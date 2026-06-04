import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/api/paymentService';
import { useErrorHandling } from '@/hooks/error/useErrorHandling';
import { InitiatePaymentResponse } from '@/lib/schemas/payment';

export function usePayment(orderId?: string) {
  const { handleError, addBreadcrumb } = useErrorHandling();

  const initiatePaymentMutation = useMutation<
    InitiatePaymentResponse,
    Error,
    { paymentMethod: string; walletPhoneNumber?: string; callbackUrl?: string }
  >({
    mutationFn: async ({ paymentMethod, walletPhoneNumber, callbackUrl }) => {
      if (!orderId) throw new Error('Order ID is required to initiate payment.');
      addBreadcrumb('Initiating payment', 'transaction', 'info', { orderId, paymentMethod });
      return paymentService.initiatePayment(orderId, paymentMethod, walletPhoneNumber, callbackUrl);
    },
    onError: (error) => {
      handleError(error, { context: 'Initiate Payment', showNotification: true });
    }
  });

  const confirmPaymentMutation = useMutation<
    boolean,
    Error,
    { externalTransactionId?: string | null }
  >({
    mutationFn: async ({ externalTransactionId }) => {
      if (!orderId) throw new Error('Order ID is required to confirm payment.');
      addBreadcrumb('Confirming payment', 'transaction', 'info', { orderId, externalTransactionId });
      return paymentService.confirmPayment(orderId, externalTransactionId);
    },
    onError: (error) => {
      handleError(error, { context: 'Confirm Payment', showNotification: true });
    }
  });

  const { data: paymentStatus, isLoading: isLoadingStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['paymentStatus', orderId],
    queryFn: () => {
      if (!orderId) throw new Error('Order ID is required.');
      return paymentService.getPaymentStatus(orderId);
    },
    enabled: !!orderId,
    refetchInterval: (query) => {
      // Poll every 3 seconds while payment is pending or processing
      const status = query.state.data?.status;
      return status === 0 || status === 1 ? 3000 : false;
    }
  });

  return {
    initiatePayment: initiatePaymentMutation.mutateAsync,
    isInitiating: initiatePaymentMutation.isPending,
    confirmPayment: confirmPaymentMutation.mutateAsync,
    isConfirming: confirmPaymentMutation.isPending,
    paymentStatus,
    isLoadingStatus,
    refetchStatus,
  };
}
