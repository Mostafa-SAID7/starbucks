import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  onPlaceOrder: (e: React.FormEvent) => void;
  isLoading: boolean;
}

/**
 * Sticky right-column sidebar: cart items list, subtotal, discount, total, and place-order CTA.
 */
export function OrderSummary({ onPlaceOrder, isLoading }: OrderSummaryProps) {
  const { t } = useTranslation(['pages', 'common']);
  const { items, total, discount } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount?.amount || 0;

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-2xl sticky top-24">
      <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
        <ShoppingBag className="w-7 h-7 text-starbucks-green" />
        {t('pages:checkout.orderSummary')}
      </h2>

      {/* Item list */}
      <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <motion.div
            layout
            key={item.id}
            className="flex gap-4 p-4 bg-gray-50/50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 group"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-800 shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700" />
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h4 className="font-black text-gray-900 dark:text-white line-clamp-1 mb-1 text-sm">
                {item.name}
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                  {t('common:qty')}: {item.quantity}
                </span>
                <span className="font-black text-starbucks-green dark:text-starbucks-light">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Totals */}
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
          <span className="text-3xl font-black text-starbucks-green dark:text-starbucks-light tracking-tighter">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={onPlaceOrder}
        disabled={isLoading}
        className="w-full mt-10 bg-starbucks-green hover:bg-starbucks-green/90 py-8 rounded-[1.5rem] text-xl font-black shadow-xl shadow-starbucks-green/30 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            {t('common:processing')}
          </div>
        ) : (
          t('pages:checkout.placeOrder')
        )}
      </Button>

      <p className="mt-6 text-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
        Secure SSL Encrypted Payment
        <br />
        powered by Starbucks Global
      </p>
    </div>
  );
}
