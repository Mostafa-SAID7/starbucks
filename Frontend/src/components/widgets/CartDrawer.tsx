import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Ticket, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/ui';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CartTrigger() {
  const { t } = useTranslation(['common']);
  const { items, toggleCart } = useCartStore();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all group active:scale-90"
      aria-label={t('common:cart.title')}
    >
      <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-starbucks-green transition-colors" />
      <AnimatePresence>
        {items.length > 0 && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            key={items.length}
            className="absolute -top-1 -right-1 bg-starbucks-green text-white text-[10px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg shadow-starbucks-green/20 border-2 border-white dark:border-zinc-900"
          >
            {items.length}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function CartDrawer({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose
}: CartDrawerProps) {
  const { isOpen: storeIsOpen, setIsOpen: setStoreIsOpen } = useCartStore();
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : storeIsOpen;
  const onClose = controlledOnClose || (() => setStoreIsOpen(false));
  const navigate = useNavigate();

  const { t, i18n } = useTranslation(['common']);
  const { isRTL, lang } = useLanguage();
  const { items, total, removeItem, updateQuantity, applyDiscount, removeDiscount, discount, clearCart } = useCartStore();

  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const [currentLocation] = useState({
    type: 'delivery',
    address: 'Cairo, Egypt',
    store: 'Starbucks - Mall of Arabia'
  });

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    setDiscountError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const code = discountCode.toUpperCase();
      if (code === 'SAVE10') {
        applyDiscount(code, 10);
        setDiscountCode('');
      } else if (code === 'SAVE20') {
        applyDiscount(code, 20);
        setDiscountCode('');
      } else {
        setDiscountError(
          i18n.language === 'ar'
            ? 'كود الخصم غير صالح. حاول SAVE10 أو SAVE20'
            : 'Invalid code. Try SAVE10 or SAVE20'
        );
      }
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate(`/${i18n.language}/checkout`);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount?.amount || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? -400 : 400 }}
            animate={{ x: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
            exit={{ x: isRTL ? -400 : 400, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
            className={cn(
              'w-full max-w-md h-screen bg-white dark:bg-zinc-950 shadow-2xl z-[210] flex flex-col fixed top-0',
              isRTL ? 'left-0 border-r dark:border-zinc-800' : 'right-0 border-l dark:border-zinc-800'
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="relative z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between p-7 pb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">{t('cart.title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-bold uppercase tracking-widest">
                    {items.length} {items.length === 1 ? t('cart.item') : t('cart.items')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-label={t('close')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Location Selection Bar */}
              <div className="px-7 pb-7">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    navigate('/' + lang + '/locations');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-[1.5rem] border border-gray-100 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-starbucks-green/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-700 group-hover:border-starbucks-green/30 group-hover:bg-starbucks-green/5 transition-all">
                      <MapPin className="w-6 h-6 text-starbucks-green" />
                    </div>
                    <div className="text-left rtl:text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 leading-none mb-1.5">
                        {currentLocation.type === 'delivery' ? t('cart.delivery_to') : t('cart.pickup_from')}
                      </p>
                      <p className="text-base font-black text-gray-900 dark:text-white line-clamp-1 tracking-tight">
                        {currentLocation.type === 'delivery' ? currentLocation.address : currentLocation.store}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-starbucks-green group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('cart.change')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-7 py-4 scroll-smooth custom-scrollbar bg-gray-50/30 dark:bg-transparent">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-white dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black/5"
                  >
                    <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-zinc-800" />
                  </motion.div>
                  <div className="max-w-[280px]">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{t('cart.empty_title')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{t('cart.empty_description')}</p>
                  </div>
                  <Button
                    onClick={onClose}
                    className="bg-starbucks-green hover:bg-starbucks-green-dark text-white rounded-full px-10 py-7 text-lg font-black shadow-2xl shadow-starbucks-green/30 active:scale-95 transition-all mt-4"
                  >
                    {t('cart.start_ordering')}
                  </Button>
                </div>
              ) : (
                <motion.div
                  layout
                  className="space-y-4 py-4"
                >
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: isRTL ? 50 : -50 }}
                        transition={{
                          type: 'spring',
                          damping: 25,
                          stiffness: 200,
                          delay: index * 0.05
                        }}
                        className="flex gap-5 p-5 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/50 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group relative overflow-hidden"
                      >
                        {/* Item Image */}
                        <div className="relative shrink-0">
                          <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-md bg-gray-50 dark:bg-zinc-800">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-gray-200 dark:text-zinc-700" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col relative z-10 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white truncate group-hover:text-starbucks-green transition-colors tracking-tight">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all active:scale-90"
                              aria-label={t('remove')}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-[0.2em]">
                            {t('cart.regular')}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-starbucks-green dark:text-starbucks-light tracking-tighter">
                                {item.price.toFixed(2)}
                              </span>
                              <span className="text-[10px] font-black text-gray-400 uppercase">{t('cart.currency')}</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-50 dark:bg-zinc-900 rounded-full p-1 border border-gray-100 dark:border-zinc-800 shadow-inner">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-starbucks-green hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
                                aria-label={t('decrease')}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-black text-gray-900 dark:text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-starbucks-green hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
                                aria-label={t('increase')}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Discount Section */}
            {items.length > 0 && (
              <div className="px-7 py-5 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800">
                {!discount ? (
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <div className="relative flex-1 group">
                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-starbucks-green transition-colors" />
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value);
                            if (discountError) setDiscountError('');
                          }}
                          placeholder={t('cart.discountCode')}
                          className={cn(
                            'w-full pl-11 pr-4 py-4 rounded-[1.25rem] border bg-gray-50 dark:bg-zinc-900 text-sm font-bold focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none transition-all placeholder:text-gray-400',
                            discountError
                              ? 'border-red-300 dark:border-red-800'
                              : 'border-gray-100 dark:border-zinc-800'
                          )}
                        />
                      </div>
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={isApplyingDiscount || !discountCode.trim()}
                        className="bg-gray-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-[1.25rem] px-7 font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isApplyingDiscount ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : t('cart.apply')}
                      </Button>
                    </div>
                    {discountError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-xs text-red-500 font-bold px-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {discountError}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-starbucks-green/5 dark:bg-starbucks-green/10 rounded-[1.5rem] border border-starbucks-green/20 flex items-center justify-between group shadow-sm shadow-starbucks-green/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-starbucks-green rounded-2xl flex items-center justify-center shadow-xl shadow-starbucks-green/30 rotate-3">
                        <Ticket className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-starbucks-green tracking-tight uppercase">
                          {discount.code} {t('cart.discountApplied')}
                        </p>
                        <p className="text-[10px] text-starbucks-green/60 font-black uppercase tracking-[0.2em] mt-1">
                          {discount.percentage}% {t('cart.off')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeDiscount}
                      className="p-2.5 text-starbucks-green/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all active:scale-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
                {/* Totals */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-500 dark:text-zinc-500">
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{t('cart.subtotal')}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-gray-900 dark:text-white tracking-tight">{subtotal.toFixed(2)}</span>
                      <span className="text-[8px] font-black uppercase">{t('cart.currency')}</span>
                    </div>
                  </div>
                  {discount && (
                    <div className="flex justify-between items-center text-starbucks-green">
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">{t('cart.discount')}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-black tracking-tight">-{discountAmount.toFixed(2)}</span>
                        <span className="text-[8px] font-black uppercase">{t('cart.currency')}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-600 mb-1 leading-none">{t('cart.order_total')}</span>
                      <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{total.toFixed(2)}</span>
                    </div>
                    <span className="text-sm font-black text-starbucks-green uppercase mb-0.5">{t('cart.currency')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 bg-starbucks-green hover:bg-starbucks-green-dark h-20 rounded-[1.5rem] text-xl font-black shadow-2xl shadow-starbucks-green/30 active:scale-[0.98] transition-all relative overflow-hidden group"
                  >
                    <span className="relative z-10">{t('cart.checkout')}</span>
                    <motion.div
                      initial={false}
                      whileHover={{ x: 10 }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </motion.div>
                  </Button>
                  <Button
                    onClick={() => {
                      clearCart();
                      onClose();
                    }}
                    variant="outline"
                    className="w-20 h-20 rounded-[1.5rem] border-gray-100 dark:border-zinc-800 hover:bg-red-50 hover:text-red-500 hover:border-red-100 dark:hover:bg-red-950/30 transition-all active:scale-[0.95] flex items-center justify-center"
                    title={t('cart.clear')}
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
