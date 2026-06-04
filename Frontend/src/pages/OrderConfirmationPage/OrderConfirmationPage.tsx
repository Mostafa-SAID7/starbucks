import { useParams } from 'react-router-dom';
import { OrderConfirmationPageContent } from './OrderConfirmationPageContent';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  // In a real app, we would fetch order details by orderId here.
  // For now, we'll just pass the orderId down.

  return <OrderConfirmationPageContent orderId={orderId} />;
}

export default OrderConfirmationPage;
