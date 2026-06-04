// Shared type for the checkout delivery form
export interface DeliveryForm {
  address: string;
  phone: string;
  notes: string;
  deliveryMethod: 'delivery' | 'pickup';
  estimatedTime?: string;
}
