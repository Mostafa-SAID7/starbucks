import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';
import { useCartStore } from '@/stores/cartStore';
import axios from 'axios';

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt?: string;
}

interface OptimisticOrderOptions {
  onSuccess?: (order: Order) => void;
  onError?: (error: Error) => void;
}

export function useOptimisticOrder(options: OptimisticOrderOptions = {}) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler({ showNotification: true, retryable: true });
  const { items, total, clearCart } = useCartStore();
  const [optimisticOrder, setOptimisticOrder] = useState<Order | null>(null);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const response = await axios.post('/api/orders', orderData);
      return response.data.data as Order;
    },
    onMutate: async (newOrder) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData(['orders']);

      // Create optimistic order
      const optimisticData: Order = {
        id: `temp-${Date.now()}`,
        userId: 'current-user',
        items: items,
        total: total,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        ...newOrder,
      };

      setOptimisticOrder(optimisticData);

      // Optimistically update the cache
      queryClient.setQueryData(['orders'], (old: Order[] = []) => [
        ...old,
        optimisticData,
      ]);

      return { previousOrders, optimisticData };
    },
    onSuccess: (data) => {
      // Update cache with real order
      queryClient.setQueryData(['orders'], (old: Order[] = []) =>
        old.map((order) => (order.id === optimisticOrder?.id ? data : order))
      );

      queryClient.setQueryData(['order', data.id], data);

      setOptimisticOrder(null);
      clearCart();

      onSuccess?.(data);
    },
    onError: (error, variables, context: any) => {
      // Rollback to previous state
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }

      setOptimisticOrder(null);

      const { title, message } = handleError(error, 'Order Creation');
      onError?.(new Error(message));
    },
  });

  const createOrder = useCallback(
    async (orderData?: Partial<Order>) => {
      try {
        await createOrderMutation.mutateAsync({
          items: items,
          total: total,
          ...orderData,
        });
      } catch (error) {
        handleError(error, 'Create Order');
      }
    },
    [items, total, createOrderMutation, handleError]
  );

  const retryOrder = useCallback(async () => {
    if (optimisticOrder) {
      await createOrder({
        items: optimisticOrder.items,
        total: optimisticOrder.total,
      });
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
