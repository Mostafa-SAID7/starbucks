import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';
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
  const { t, i18n } = useTranslation(['pages', 'common']);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const { items, total, discount } = useCartStore();
  const { createOrder, isLoading, optimisticOrder } = useOptimisticOrder({
    onSuccess: (order: { id: string }) => {
      navigate(`/${i18n.language}/order/${order.id}`);
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
      <div className="min-h-screen bg-white dark:bg-background-dark flex items-center justify-center p-6">
        <SEO title={t('pages:checkout.emptyCart')} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tight">{t('pages:checkout.emptyCart')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            {t('pages:checkout.emptyCartDescription')}
          </p>
          <Button 
            onClick={() => navigate('/' + i18n.language + '/menu')}
            className="w-full bg-starbucks-green hover:bg-starbucks-green/90 rounded-full py-6 text-base font-bold shadow-xl shadow-starbucks-green/20"
          >
            {t('common:backToMenu')}
          </Button>
        </motion.div>
      </div>
    );
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

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header & Progress Bar */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all group active:scale-95"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight">{t('pages:checkout.title')}</h1>
          </motion.div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-starbucks-green text-white flex items-center justify-center font-black shadow-lg shadow-starbucks-green/20">1</div>
              <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">{t('pages:checkout.steps.delivery')}</span>
            </div>
            <div className="h-0.5 bg-gray-100 dark:bg-zinc-800 flex-1" />
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center font-black">2</div>
              <span className="font-black text-sm uppercase tracking-wider">{t('pages:checkout.steps.payment')}</span>
            </div>
            <div className="h-0.5 bg-gray-100 dark:bg-zinc-800 flex-1" />
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center font-black">3</div>
              <span className="font-black text-sm uppercase tracking-wider">{t('pages:checkout.steps.summary')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Delivery Method Selection */}
              <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-2xl font-black mb-8 tracking-tight">{t('pages:checkout.deliveryMethod')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(['delivery', 'pickup'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryMethod: method })}
                      className={cn(
                        'relative p-6 rounded-2xl border-2 text-left transition-all group overflow-hidden',
                        form.deliveryMethod === method
                          ? 'border-starbucks-green bg-starbucks-green/[0.03] ring-1 ring-starbucks-green/20'
                          : 'border-gray-100 dark:border-zinc-800 hover:border-starbucks-green/30 bg-white dark:bg-zinc-900/50'
                      )}
                    >
                      {form.deliveryMethod === method && (
                        <motion.div 
                          layoutId="active-method"
                          className="absolute top-4 right-4 w-6 h-6 bg-starbucks-green rounded-full flex items-center justify-center shadow-lg shadow-starbucks-green/30"
                        >
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </motion.div>
                      )}
                      <div className="flex flex-col h-full">
                        <div className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-starbucks-green/10 transition-colors">
                          {method === 'delivery' ? (
                            <MapPin className="w-7 h-7 text-starbucks-green" />
                          ) : (
                            <Clock className="w-7 h-7 text-starbucks-green" />
                          )}
                        </div>
                        <span className="font-black text-xl mb-1">{t(`pages:checkout.${method}`)}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          {t(`pages:checkout.${method}Description`)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address & Details */}
              <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-2xl font-black mb-8 tracking-tight">{t('pages:checkout.address')}</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 ml-1">{t('pages:checkout.address')}</label>
                    <textarea
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder={t('pages:checkout.addressPlaceholder')}
                      rows={3}
                      className={cn(
                        'w-full p-5 rounded-2xl border bg-gray-50/50 dark:bg-zinc-800/50 transition-all focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none font-bold text-lg placeholder:font-medium resize-none',
                        errors.address ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-gray-200 dark:border-zinc-700'
                      )}
                    />
                    {errors.address && <p className="text-sm text-red-500 font-bold ml-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 ml-1">{t('pages:checkout.phone')}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder={t('pages:checkout.phonePlaceholder')}
                        className={cn(
                          'w-full p-5 rounded-2xl border bg-gray-50/50 dark:bg-zinc-800/50 transition-all focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none font-bold text-lg placeholder:font-medium',
                          errors.phone ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-gray-200 dark:border-zinc-700'
                        )}
                      />
                      {errors.phone && <p className="text-sm text-red-500 font-bold ml-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 ml-1">{t('pages:checkout.notes')}</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      placeholder={t('pages:checkout.notesPlaceholder')}
                      rows={2}
                      className="w-full p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 transition-all focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none font-bold text-lg placeholder:font-medium resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section (Mock) */}
              <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm opacity-50 grayscale select-none">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tight">{t('pages:checkout.steps.payment')}</h2>
                  <ShieldCheck className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex items-center gap-5 p-6 rounded-2xl bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-700 rounded-lg opacity-50" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-2xl sticky top-24">
              <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-starbucks-green" />
                {t('pages:checkout.orderSummary')}
              </h2>

              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 p-4 bg-gray-50/50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-800 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h4 className="font-black text-gray-900 dark:text-white line-clamp-1 mb-1 text-sm">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{t('common:qty')}: {item.quantity}</span>
                        <span className="font-black text-starbucks-green dark:text-starbucks-light">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex justify-between items-center text-gray-500 dark:text-zinc-400">
                  <span className="font-bold text-sm uppercase tracking-wider">{t('pages:checkout.subtotal')}</span>
                  <span className="font-black text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>

                {discount && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center text-starbucks-green"
                  >
                    <span className="font-bold text-sm uppercase tracking-wider">{t('pages:checkout.discount')}</span>
                    <span className="font-black">-${discountAmount.toFixed(2)}</span>
                  </motion.div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <span className="font-black text-xl tracking-tight">{t('pages:checkout.total')}</span>
                  <span className="text-3xl font-black text-starbucks-green dark:text-starbucks-light tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-10 bg-starbucks-green hover:bg-starbucks-green/90 py-8 rounded-[1.5rem] text-xl font-black shadow-xl shadow-starbucks-green/30 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('common:processing')}
                  </div>
                ) : t('pages:checkout.placeOrder')}
              </Button>

              <p className="mt-6 text-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
                Secure SSL Encrypted Payment<br />powered by Starbucks Global
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

