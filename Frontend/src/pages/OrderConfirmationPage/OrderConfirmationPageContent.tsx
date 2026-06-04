import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components';
import { ANIMATION_CONFIG } from '@/lib/core/constants';
import { SuccessHeader } from './SuccessHeader';
import { OrderDetailsCard } from './OrderDetailsCard';

interface OrderConfirmationPageContentProps {
  orderId?: string;
}

export function OrderConfirmationPageContent({ orderId }: OrderConfirmationPageContentProps) {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark pt-24 pb-20 overflow-hidden relative">
      <SEO title={t('pages:checkout.confirmationTitle')} />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-starbucks-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-starbucks-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <motion.div
          variants={ANIMATION_CONFIG.VARIANTS.STAGGER_CONTAINER_DELAY}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Success Header */}
          <SuccessHeader />

          {/* Order Details Card */}
          <OrderDetailsCard orderId={orderId} />

          {/* Action Buttons */}
          <motion.div variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM} className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/' + i18n.language)}
              variant="outline"
              className="flex-1 py-8 rounded-[1.5rem] border-gray-200 dark:border-zinc-800 text-lg font-bold transition-all active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common:backToHome')}
            </Button>
            <Button
              className="flex-1 py-8 rounded-[1.5rem] bg-starbucks-green hover:bg-starbucks-green/90 text-lg font-black shadow-xl shadow-starbucks-green/20 transition-all active:scale-95"
            >
              <Share2 className="w-5 h-5 mr-2" />
              {t('pages:checkout.shareOrder')}
            </Button>
          </motion.div>

          {/* Helper links */}
          <motion.p variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM} className="text-center text-sm text-gray-400 font-medium pt-4">
            {t('pages:checkout.needHelp')}{' '}
            <a href="#" className="text-starbucks-green hover:underline font-bold">
              {t('pages:checkout.contactSupport')}
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
