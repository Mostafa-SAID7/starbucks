import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components';

/**
 * Shown when the user navigates to checkout with an empty cart.
 */
export function EmptyCartView() {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const navigate = useNavigate();
  const { optimisticOrder } = useCartStore();

  if (optimisticOrder) return null;

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
