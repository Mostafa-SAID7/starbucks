import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ANIMATION_CONFIG } from '@/lib/core/constants';

export function SuccessHeader() {
  const { t } = useTranslation(['pages']);

  return (
    <motion.div variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM} className="text-center space-y-6">
      <div className="relative inline-block">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 bg-starbucks-green rounded-full flex items-center justify-center shadow-2xl shadow-starbucks-green/20 relative z-10"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        {/* Pulse effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-starbucks-green rounded-full"
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          {t('pages:checkout.thankYou')}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
          {t('pages:checkout.orderReceived')}
        </p>
      </div>
    </motion.div>
  );
}
