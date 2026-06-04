import { CheckoutPageContent } from './CheckoutPageContent';

/**
 * CheckoutPage main entry point. 
 * Renders the checkout content. 
 * Since all data is from Zustand stores and mutations, no query wrappers are needed.
 */
export function CheckoutPage() {
  return <CheckoutPageContent />;
}

export default CheckoutPage;
