import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { SEO } from '@/components';
import { useLanguage } from '@/hooks';

export function PaymentFailedPage() {
  const { t, i18n } = useTranslation(['pages']);
  const { isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');
  const errorMsg = searchParams.get('message') || (isRTL ? 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.' : 'Payment failed. Please try again.');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title={t('pages:checkout.paymentFailed', { defaultValue: 'Payment Failed' })} />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 text-red-600">
          <XCircle className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'فشلت عملية الدفع' : 'Payment Failed'}
          </h2>
          <p className="text-sm text-red-500">
            {errorMsg}
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          {orderId && (
            <button
              onClick={() => navigate(`/${i18n.language}/checkout?orderId=${orderId}`)}
              className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isRTL ? 'إعادة محاولة الدفع' : 'Retry Payment'}</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/${i18n.language}/checkout`)}
            className="w-full bg-gray-150 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            <span>{isRTL ? 'العودة إلى سلة التسوق' : 'Back to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
