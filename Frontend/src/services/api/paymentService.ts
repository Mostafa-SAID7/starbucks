import { ApiService } from './ApiService';
import { InitiatePaymentResponse, PaymentStatusResponse } from '@/lib/schemas/payment';

export class PaymentService extends ApiService {
  private static instance: PaymentService;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public async initiatePayment(
    orderId: string,
    paymentMethod: string,
    walletPhoneNumber?: string,
    callbackUrl?: string
  ): Promise<InitiatePaymentResponse> {
    return this.post<InitiatePaymentResponse>('/payment/initiate', {
      orderId,
      paymentMethod,
      walletPhoneNumber,
      callbackUrl: callbackUrl || `${window.location.origin}/payment/success`
    });
  }

  public async confirmPayment(orderId: string, externalTransactionId?: string | null): Promise<boolean> {
    return this.post<boolean>('/payment/confirm', {
      orderId,
      externalTransactionId
    });
  }

  public async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    return this.get<PaymentStatusResponse>(`/payment/status/${orderId}`);
  }
}

export const paymentService = PaymentService.getInstance();
