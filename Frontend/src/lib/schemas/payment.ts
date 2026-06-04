import { z } from 'zod';

export const PaymentMethodEnum = z.enum([
  'Cash',
  'CreditCard',
  'DebitCard',
  'MobileWallet',
  'BankTransfer',
  'Fawry',
  'Vodafone',
  'Orange',
  'Etisalat',
  'Stripe',
  'PaymobCard'
]);

export type PaymentMethodType = z.infer<typeof PaymentMethodEnum>;

export const InitiatePaymentRequestSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.string(),
  walletPhoneNumber: z.string().optional(),
  callbackUrl: z.string(),
});

export type InitiatePaymentRequest = z.infer<typeof InitiatePaymentRequestSchema>;

export const InitiatePaymentResponseSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  status: z.string(),
  redirectUrl: z.string().optional().nullable(),
  clientSecret: z.string().optional().nullable(),
  externalTransactionId: z.string().optional().nullable(),
});

export type InitiatePaymentResponse = z.infer<typeof InitiatePaymentResponseSchema>;

export const ConfirmPaymentRequestSchema = z.object({
  orderId: z.string(),
  externalTransactionId: z.string().optional().nullable(),
});

export type ConfirmPaymentRequest = z.infer<typeof ConfirmPaymentRequestSchema>;

export const PaymentStatusResponseSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  status: z.number(), // Enum values from Backend
  message: z.string(),
});

export type PaymentStatusResponse = z.infer<typeof PaymentStatusResponseSchema>;
