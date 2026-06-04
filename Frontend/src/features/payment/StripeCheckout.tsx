import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

interface StripeCheckoutProps {
  clientSecret: string;
  orderId: string;
  onPaymentSuccess: () => void;
  onPaymentFailed: (errorMsg?: string) => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentFailed,
}) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#006241', // Starbucks Green
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            borderRadius: '12px',
          },
        },
      }}
    >
      <StripeForm
        onPaymentSuccess={onPaymentSuccess}
        onPaymentFailed={onPaymentFailed}
      />
    </Elements>
  );
};

interface StripeFormProps {
  onPaymentSuccess: () => void;
  onPaymentFailed: (errorMsg?: string) => void;
}

const StripeForm: React.FC<StripeFormProps> = ({
  onPaymentSuccess,
  onPaymentFailed,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required', // Avoid page reload redirects for nicer SPA experience
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      onPaymentFailed(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess();
    } else {
      onPaymentFailed('Payment status unknown');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <h4 className="font-semibold text-gray-900 text-lg">
          {isRTL ? 'تفاصيل بطاقة الائتمان' : 'Credit Card Details'}
        </h4>

        <PaymentElement className="mt-2" />

        {errorMessage && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-red-600 bg-red-50 p-4 rounded-xl text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{isRTL ? 'جاري معالجة الدفع...' : 'Processing Payment...'}</span>
          </>
        ) : (
          <span>{isRTL ? 'ادفع الآن' : 'Pay Now'}</span>
        )}
      </button>
    </form>
  );
};
