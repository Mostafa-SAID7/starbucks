import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useOptimisticOrder } from '@/hooks/business/useOptimisticOrder';
import { useLanguage } from '@/hooks';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components';
import { cn } from '@/lib/ui';

interface DeliveryForm {
  address: string;
  phone: string;
  notes: string;
  deliveryMethod: 'delivery' | 'pickup';
  estimatedTime?: string;
}

export function CheckoutPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const { items, total, discount } = useCartStore();
  const { createOrder, isLoading, optimisticOrder } = useOptimisticOrder({
    onSuccess: (order: { id: string }) => {
      // Navigate to order confirmation
      navigate(`/order/${order.id}`);
    },
    onError: (error: Error) => {
      console.error('Order creation failed:', error);
    },
  });

  const [form, setForm] = useState<DeliveryForm>({
    address: '',
    phone: '',
    notes: '',
    deliveryMethod: 'delivery',
  });

  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});

  // Redirect if cart is empty
  if (items.length === 0 && !optimisticOrder) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('pages:checkout.emptyCart')}</h1>
          <Button onClick={() => navigate('/menu')}>
            {t('common:backToMenu')}
          </Button>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<DeliveryForm> = {};

    if (!form.address.trim()) {
      newErrors.address = t('pages:checkout.addressRequired');
    }

    if (!form.phone.trim()) {
      newErrors.phone = t('pages:checkout.phoneRequired');
    } else if (!/^\+?[0-9]{10,}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('pages:checkout.phoneInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await createOrder({
      items: items.map(item => ({
        id: item.id,
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount?.amount || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title={t('pages:checkout.title')} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black">{t('pages:checkout.title')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Method */}
              <div>
                <h2 className="text-xl font-bold mb-4">{t('pages:checkout.deliveryMethod')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(['delivery', 'pickup'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryMethod: method })}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all',
                        form.deliveryMethod === method
                          ? 'border-starbucks-green bg-starbucks-green/5'
                          : 'border-gray-200 dark:border-zinc-800 hover:border-starbucks-green/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {method === 'delivery' ? (
                          <MapPin className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                        <span className="font-bold capitalize">
                          {t(`pages:checkout.${method}`)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(`pages:checkout.${method}Description`)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              {form.deliveryMethod === 'delivery' && (
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {t('pages:checkout.address')}
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={t('pages:checkout.addressPlaceholder')}
                    className={cn(
                      'w-full px-4 py-3 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white',
                      errors.address
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-zinc-700'
                    )}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  {t('pages:checkout.phone')}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t('pages:checkout.phonePlaceholder')}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white',
                    errors.phone
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-zinc-700'
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  {t('pages:checkout.notes')}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t('pages:checkout.notesPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-starbucks-green hover:bg-starbucks-green/90 py-3 text-lg"
              >
                {isLoading ? t('common:processing') : t('pages:checkout.placeOrder')}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">{t('pages:checkout.orderSummary')}</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('pages:checkout.subtotal')}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>{t('pages:checkout.discount')}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-zinc-800">
                  <span>{t('pages:checkout.total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Optimistic Order Status */}
              {optimisticOrder && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
                  {t('pages:checkout.processingOrder')}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

