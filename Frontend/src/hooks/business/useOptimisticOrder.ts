import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandling } from '@/hooks/error/useErrorHandling';
import { useCartStore } from '@/stores/cartStore';
import { orderFetchers } from '@/lib/api';
import type { Order } from '@/lib/schemas';

interface OptimisticOrderOptions {
  onSuccess?: (order: Order) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing order creation with optimistic UI updates
 */
export function useOptimisticOrder(options: OptimisticOrderOptions = {}) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();
  const { handleError, addBreadcrumb } = useErrorHandling();
  const { items, total, clearCart } = useCartStore();
  const [optimisticOrder, setOptimisticOrder] = useState<Order | null>(null);

  const createOrderMutation = useMutation<Order, Error, Partial<Order>, { previousOrders?: Order[], optimisticData: Order }>({
    mutationFn: (orderData: Partial<Order>) => orderFetchers.createOrder(orderData),
    onMutate: async (newOrder) => {
      addBreadcrumb('Starting optimistic order creation', 'transaction', 'info', { newOrder });
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData<Order[]>(['orders']);

      // Create optimistic order
      const optimisticData: Order = {
        id: `temp-${Date.now()}`,
        orderNumber: `TEMP-${Date.now()}`,
        userId: 'current-user',
        items: items.map(item => ({
            id: item.id,
            menuItemId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total,
        status: 'pending',
        locationId: newOrder.locationId || 'default',
        orderType: newOrder.orderType || 'pickup',
        paymentMethod: newOrder.paymentMethod || 'cash',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setOptimisticOrder(optimisticData);

      // Optimistically update the cache
      queryClient.setQueryData<Order[]>(['orders'], (old = []) => [
        ...old,
        optimisticData,
      ]);

      return { previousOrders, optimisticData };
    },
    onSuccess: (data) => {
      addBreadcrumb('Order created successfully', 'transaction', 'info', { orderId: data.id });
      
      // Update cache with real order
      queryClient.setQueryData<Order[]>(['orders'], (old = []) =>
        old.map((order) => (order.id.startsWith('temp-') ? data : order))
      );

      queryClient.setQueryData(['order', data.id], data);

      setOptimisticOrder(null);
      clearCart();

      onSuccess?.(data);
    },
    onError: (error, _variables, context) => {
      // Rollback to previous state
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }

      setOptimisticOrder(null);

      handleError(error, { context: 'Order Creation', showNotification: true });
      onError?.(error);
    },
  });

  const createOrder = useCallback(
    async (orderData?: Partial<Order>) => {
      try {
        await createOrderMutation.mutateAsync({
          total: total,
          ...orderData,
        });
      } catch {
        // Error is handled in mutation onError
      }
    },
    [total, createOrderMutation]
  );

  const retryOrder = useCallback(async () => {
    if (optimisticOrder) {
      await createOrder(optimisticOrder);
    }
  }, [optimisticOrder, createOrder]);

  return {
    createOrder,
    retryOrder,
    isLoading: createOrderMutation.isPending,
    isError: createOrderMutation.isError,
    error: createOrderMutation.error,
    optimisticOrder,
  };
}
