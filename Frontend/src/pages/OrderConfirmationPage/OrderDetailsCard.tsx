import { motion } from 'framer-motion';
import { Clock, MapPin, Package, Phone, CreditCard, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/ui';
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import { orderFetchers } from '@/lib/api';
import type { Order } from '@/lib/schemas';

interface OrderDetailsCardProps {
  orderId?: string;
}

const TRACKING_STEPS_EN = ['Order Placed', 'Preparing', 'On the Way', 'Delivered'];
const TRACKING_STEPS_AR = ['تم الطلب', 'قيد التحضير', 'في الطريق', 'تم التوصيل'];

const STATUS_STEP_MAP: Record<string, number> = {
  pending: 0,
  Pending: 0,
  confirmed: 1,
  Confirmed: 1,
  preparing: 1,
  Preparing: 1,
  shipped: 2,
  Shipped: 2,
  ready: 2,
  Ready: 2,
  delivered: 3,
  Delivered: 3,
  completed: 3,
  Completed: 3,
};

const PAYMENT_LABEL: Record<string, { en: string; ar: string }> = {
  Cash: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
  PaymobCard: { en: 'Credit / Debit Card', ar: 'بطاقة ائتمان / خصم' },
  Stripe: { en: 'International Card (Stripe)', ar: 'بطاقة دولية (Stripe)' },
  Fawry: { en: 'Fawry Pay', ar: 'فوري' },
  Vodafone: { en: 'Vodafone Cash', ar: 'فودافون كاش' },
  Orange: { en: 'Orange Cash', ar: 'أورنج كاش' },
  Etisalat: { en: 'Etisalat Cash', ar: 'اتصالات كاش' },
};

export function OrderDetailsCard({ orderId }: OrderDetailsCardProps) {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const isAR = i18n.language === 'ar';
  const currency = isAR ? 'ج.م' : 'EGP';
  const queryClient = useQueryClient();

  // Try cache first (set by useOptimisticOrder on order creation), then fetch
  const cachedOrder = queryClient.getQueryData<Order>(['order', orderId]);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderFetchers.fetchOrderById(orderId!),
    enabled: !!orderId,
    initialData: cachedOrder,
    staleTime: 5 * 60 * 1000,
  });

  const trackingStep = order ? (STATUS_STEP_MAP[order.status] ?? 0) : 0;
  const trackingLabels = isAR ? TRACKING_STEPS_AR : TRACKING_STEPS_EN;
  const progressPct = `${(trackingStep / (trackingLabels.length - 1)) * 100}%`;

  const paymentLabel = order
    ? (PAYMENT_LABEL[order.paymentMethod]?.[isAR ? 'ar' : 'en'] ?? order.paymentMethod)
    : '—';

  if (isLoading && !cachedOrder) {
    return (
      <motion.div
        variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border border-gray-100 dark:border-zinc-800 p-12 flex items-center justify-center"
      >
        <div className="w-8 h-8 border-4 border-starbucks-green/30 border-t-starbucks-green rounded-full animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM}
      className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border border-gray-100 dark:border-zinc-800"
    >
      <div className="p-8 space-y-8">
        {/* Order ID & Estimated Time */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('pages:checkout.orderNumber')}</p>
            <p className="text-2xl font-black text-starbucks-green tracking-tight">
              #{(order?.orderNumber || orderId?.substring(0, 8) || 'SBX-0000').toUpperCase()}
            </p>
          </div>
          <div className="h-12 w-[1px] bg-gray-200 dark:bg-zinc-700 hidden md:block" />
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('pages:checkout.estimatedArrival')}</p>
            <div className="flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white">
              <Clock className="w-5 h-5 text-starbucks-green" />
              <span>
                {order?.orderType === 'pickup'
                  ? (isAR ? '١٠ - ١٥ دقيقة' : '10 - 15 min')
                  : (isAR ? '٢٥ - ٣٥ دقيقة' : '25 - 35 min')}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Info + Order Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: address / pickup info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-starbucks-green" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white">
                {order?.orderType === 'pickup' ? (isAR ? 'الاستلام من الفرع' : 'Store Pickup') : t('pages:checkout.deliveryTo')}
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed pl-13">
              {order?.deliveryAddress || (isAR ? 'لا يوجد عنوان' : 'No address provided')}
            </p>
            {order?.deliveryPhoneNumber && (
              <div className="flex items-center gap-2 pl-13 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-starbucks-green" />
                <span className="font-medium">{order.deliveryPhoneNumber}</span>
              </div>
            )}
            {order?.notes && (
              <p className="pl-13 text-xs text-gray-400 font-medium italic">{order.notes}</p>
            )}
            {/* Payment method */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-starbucks-green" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {isAR ? 'طريقة الدفع' : 'Payment'}
                </p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{paymentLabel}</p>
              </div>
            </div>
          </div>

          {/* Right: order items */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-starbucks-green" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white">{t('pages:checkout.orderSummary')}</h3>
            </div>

            {order?.items && order.items.length > 0 ? (
              <div className="space-y-2 pl-13 max-h-40 overflow-y-auto custom-scrollbar">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-starbucks-green/60 shrink-0" />
                      {item.name}
                      <span className="text-gray-400 font-black">×{item.quantity}</span>
                    </span>
                    <span className="font-black text-gray-900 dark:text-white whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2)} {currency}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="pl-13 text-sm text-gray-400">—</p>
            )}

            <div className="space-y-1 pl-13 text-sm pt-2 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>
                  {t('pages:checkout.items')} ({order?.items?.length ?? 0})
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {(order?.subtotal ?? (order?.total ?? 0)).toFixed(2)} {currency}
                </span>
              </div>
              {order?.deliveryFee !== undefined && order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t('pages:checkout.deliveryFee')}</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {order.deliveryFee.toFixed(2)} {currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800">
                <span className="font-black text-gray-900 dark:text-white">{t('pages:checkout.total')}</span>
                <span className="font-black text-starbucks-green text-lg">
                  {(order?.total ?? 0).toFixed(2)} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Tracking Progress */}
      <div className="bg-gray-50 dark:bg-zinc-800/30 p-8 border-t border-gray-100 dark:border-zinc-800">
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-zinc-700 -translate-y-1/2" />
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: progressPct }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-1/2 left-0 h-1 bg-starbucks-green -translate-y-1/2"
          />
          <div className="relative flex justify-between">
            {trackingLabels.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 shadow-sm relative z-10 transition-colors duration-500',
                  idx <= trackingStep ? 'bg-starbucks-green' : 'bg-gray-300 dark:bg-zinc-600'
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          {trackingLabels.map((label, idx) => (
            <span key={idx} className={idx <= trackingStep ? 'text-starbucks-green' : ''}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
