import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/api/ordersService';

export const useOrders = () => {
  const queryClient = useQueryClient();

  const useMyOrders = () => {
    return useQuery({
      queryKey: ['orders', 'my'],
      queryFn: () => ordersService.getMyOrders(),
    });
  };

  const useOrderDetails = (id: string) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: () => ordersService.getOrderById(id),
      enabled: !!id,
    });
  };

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => ordersService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    useMyOrders,
    useOrderDetails,
    cancelOrder: cancelOrderMutation.mutate,
    isCancelling: cancelOrderMutation.isPending,
  };
};
