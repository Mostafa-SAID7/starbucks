import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useOptimisticOrder } from '@/hooks/business/useOptimisticOrder';
import { useLanguage } from '@/hooks';
import { SEO } from '@/components';
import { CheckoutHeader } from './CheckoutHeader';
import { DeliveryFormSection } from './DeliveryFormSection';
import { OrderSummary } from './OrderSummary';
import { EmptyCartView } from './EmptyCartView';
import { PaymentMethodSelector, PaymentMethod } from '@/features/payment/PaymentMethodSelector';
import { PaymobIframe } from '@/features/payment/PaymobIframe';
import { StripeCheckout } from '@/features/payment/StripeCheckout';
import { paymentService } from '@/services/api/paymentService';
import { Loader2 } from 'lucide-react';
import type { DeliveryForm } from './types';

export function CheckoutPageContent() {
  const { t, i18n } = useTranslation(['pages']);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const { items, total, clearCart } = useCartStore();

  const { createOrder, isLoading: isCreatingOrder, optimisticOrder } = useOptimisticOrder({
    onSuccess: async (order) => {
      if (selectedMethod === 'Cash') {
        // Clear cart now — payment is complete (cash on delivery)
        clearCart();
        navigate(`/${i18n.language}/order/${order.id}`);
      } else {
        // For online payment, keep cart visible until payment succeeds
        setCreatedOrderId(order.id);
        await handleInitiatePayment(order.id);
      }
    },
    onError: (error: Error) => {
      console.error('Order creation failed:', error);
      setErrorMessage(isRTL ? 'فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.' : 'Order creation failed. Please try again.');
      setCheckoutStep(1);
    },
  });

  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
  const [walletPhoneNumber, setWalletPhoneNumber] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<DeliveryForm>({
    address: '',
    phone: '',
    notes: '',
    deliveryMethod: 'delivery',
  });

  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});

  if (items.length === 0 && !optimisticOrder) {
    return <EmptyCartView />;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<DeliveryForm> = {};
    if (!form.address.trim()) newErrors.address = t('pages:checkout.addressRequired');
    if (!form.phone.trim()) {
      newErrors.phone = t('pages:checkout.phoneRequired');
    } else if (!/^\+?[0-9]{10,}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('pages:checkout.phoneInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCheckoutStep(2);
  };

  const handleInitiatePayment = async (orderId: string) => {
    setIsInitiatingPayment(true);
    setErrorMessage(null);
    try {
      const response = await paymentService.initiatePayment(
        orderId,
        selectedMethod,
        walletPhoneNumber,
        `${window.location.origin}/payment/success?orderId=${orderId}`
      );

      if (response.redirectUrl) {
        if (['Vodafone', 'Orange', 'Etisalat'].includes(selectedMethod)) {
          window.location.href = response.redirectUrl;
          return;
        }
        setRedirectUrl(response.redirectUrl);
      }
      if (response.clientSecret) {
        setClientSecret(response.clientSecret);
      }
      setCheckoutStep(3);
    } catch (err: unknown) {
      console.error('Payment initiation failed', err);
      const msg = err instanceof Error ? err.message : '';
      setErrorMessage(
        msg ||
        (isRTL ? 'فشلت تهيئة بوابة الدفع. يرجى المحاولة مرة أخرى.' : 'Failed to initialize payment gateway. Please try again.')
      );
      setCheckoutStep(2);
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handleFinalOrderSubmit = async () => {
    setErrorMessage(null);

    if (['Vodafone', 'Orange', 'Etisalat'].includes(selectedMethod)) {
      if (!walletPhoneNumber.trim()) {
        setErrorMessage(isRTL ? 'رقم الهاتف المحمول مطلوب للمحفظة الإلكترونية.' : 'Wallet phone number is required.');
        return;
      }
      if (!/^01[0125][0-9]{8}$/.test(walletPhoneNumber.trim())) {
        setErrorMessage(isRTL ? 'رقم الهاتف المحمول غير صالح.' : 'Invalid mobile wallet phone number.');
        return;
      }
    }

    await createOrder({
      items: items.map((item) => ({
        id: item.id,
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total,
      status: 'pending',
      paymentMethod: selectedMethod,
      deliveryAddress: form.address,
      deliveryPhoneNumber: form.phone,
      notes: form.notes,
      orderType: form.deliveryMethod === 'delivery' ? 'Delivery' : 'PickUp',
      createdAt: new Date().toISOString(),
    });
  };

  const handlePaymentSuccess = () => {
    clearCart();
    if (createdOrderId) {
      navigate(`/${i18n.language}/order/${createdOrderId}`);
    } else {
      navigate(`/${i18n.language}`);
    }
  };

  const handlePaymentFailed = (msg?: string) => {
    navigate(`/${i18n.language}/payment/failed?orderId=${createdOrderId}&message=${encodeURIComponent(msg || '')}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title={t('pages:checkout.title')} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <CheckoutHeader currentStep={checkoutStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Wizard Column */}
          <div className="lg:col-span-2 space-y-10">
            {checkoutStep === 1 && (
              <DeliveryFormSection
                form={form}
                errors={errors}
                onChange={setForm}
                onSubmit={handleDeliverySubmit}
              />
            )}

            {checkoutStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    {isRTL ? '← العودة لتفاصيل التوصيل' : '← Back to Delivery'}
                  </button>
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                    {isRTL ? 'الخطوة ٢ من ٣' : 'Step 2 of 3'}
                  </span>
                </div>

                <PaymentMethodSelector
                  selectedMethod={selectedMethod}
                  onSelectMethod={setSelectedMethod}
                  walletPhoneNumber={walletPhoneNumber}
                  onWalletPhoneChange={setWalletPhoneNumber}
                />

                {errorMessage && (
                  <p className="text-sm font-semibold text-red-500 bg-red-50 p-4 rounded-xl">
                    {errorMessage}
                  </p>
                )}

                <button
                  onClick={handleFinalOrderSubmit}
                  disabled={isCreatingOrder || isInitiatingPayment}
                  className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-4 px-6 rounded-full transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(isCreatingOrder || isInitiatingPayment) ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{isRTL ? 'جاري معالجة الطلب...' : 'Processing Order...'}</span>
                    </>
                  ) : (
                    <span>
                      {selectedMethod === 'Cash'
                        ? (isRTL ? 'تأكيد وإرسال الطلب' : 'Confirm & Place Order')
                        : (isRTL ? 'الانتقال إلى الدفع آمن' : 'Proceed to Secure Payment')}
                    </span>
                  )}
                </button>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    {isRTL ? '← العودة لطريقة الدفع' : '← Back to Payment Methods'}
                  </button>
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                    {isRTL ? 'الخطوة ٣ من ٣' : 'Step 3 of 3'}
                  </span>
                </div>

                {selectedMethod === 'PaymobCard' && redirectUrl && (
                  <PaymobIframe
                    iframeUrl={redirectUrl}
                    orderId={createdOrderId!}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailed={handlePaymentFailed}
                  />
                )}

                {selectedMethod === 'Fawry' && redirectUrl && (
                  <PaymobIframe
                    iframeUrl={redirectUrl}
                    orderId={createdOrderId!}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailed={handlePaymentFailed}
                  />
                )}

                {selectedMethod === 'Stripe' && clientSecret && (
                  <StripeCheckout
                    clientSecret={clientSecret}
                    orderId={createdOrderId!}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailed={handlePaymentFailed}
                  />
                )}
              </div>
            )}
          </div>

          {/* Sidebar Summary — button hidden on Step 3 while gateway handles payment */}
          <div className="lg:col-span-1">
            <OrderSummary
              onPlaceOrder={
                checkoutStep === 1
                  ? handleDeliverySubmit
                  : checkoutStep === 2
                  ? handleFinalOrderSubmit
                  : () => {}
              }
              isLoading={isCreatingOrder || isInitiatingPayment}
              hideButton={checkoutStep === 3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
