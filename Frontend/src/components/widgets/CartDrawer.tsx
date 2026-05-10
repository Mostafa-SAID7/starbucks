import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CartDrawer({ isOpen: controlledIsOpen, onClose: controlledOnClose }: CartDrawerProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onClose = controlledOnClose || (() => setInternalIsOpen(false));

  const { t } = useTranslation(['common', 'cart']);
  const { isRTL } = useLanguage();
  const { items, total, removeItem, updateQuantity, applyDiscount, removeDiscount, discount, clearCart } = useCartStore();

  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    try {
      // Simulate API call to validate discount code
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock discount validation
      if (discountCode.toUpperCase() === 'SAVE10') {
        applyDiscount(discountCode, 10);
      } else if (discountCode.toUpperCase() === 'SAVE20') {
        applyDiscount(discountCode, 20);
      } else {
        // Invalid code - could show error
        console.warn('Invalid discount code');
      }
    } finally {
      setIsApplyingDiscount(false);
      setDiscountCode('');
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount?.amount || 0;

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setInternalIsOpen(true)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        aria-label={t('common:cart')}
      >
        <ShoppingCart className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: isRTL ? -400 : 400 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? -400 : 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed top-0 w-full max-w-md h-full bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col',
                isRTL ? 'left-0' : 'right-0'
              )}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold">{t('common:cart')}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label={t('common:close')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">{t('cart:empty')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                      >
                        {/* Item Image */}
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}

                        {/* Item Details */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {t('common:price')}: ${item.price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
                              aria-label={t('common:decrease')}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
                              aria-label={t('common:increase')}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                          aria-label={t('common:remove')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount Section */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-zinc-800">
                  {!discount ? (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder={t('cart:discountCode')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={isApplyingDiscount || !discountCode.trim()}
                        size="sm"
                      >
                        {t('cart:apply')}
                      </Button>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                          {t('cart:discountApplied')}: {discount.code}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {discount.percentage}% {t('cart:off')}
                        </p>
                      </div>
                      <button
                        onClick={removeDiscount}
                        className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-zinc-800 space-y-4">
                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('cart:subtotal')}</span>
                      <span className="font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>{t('cart:discount')}</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-zinc-800">
                      <span>{t('cart:total')}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-starbucks-green hover:bg-starbucks-green/90"
                    >
                      {t('cart:checkout')}
                    </Button>
                    <Button
                      onClick={() => {
                        clearCart();
                        onClose();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {t('cart:clear')}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
