import { motion } from 'framer-motion';
import { Clock, MapPin, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/ui';
import { ANIMATION_CONFIG } from '@/lib/core/constants';

interface OrderDetailsCardProps {
  orderId?: string;
}

export function OrderDetailsCard({ orderId }: OrderDetailsCardProps) {
  const { t } = useTranslation(['pages', 'common']);

  return (
    <motion.div variants={ANIMATION_CONFIG.VARIANTS.STAGGER_ITEM} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border border-gray-100 dark:border-zinc-800">
      <div className="p-8 space-y-8">
        {/* Order ID & Status */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('pages:checkout.orderNumber')}</p>
            <p className="text-2xl font-black text-starbucks-green tracking-tight">
              #{orderId?.substring(0, 8).toUpperCase() || 'SBX-7291-K'}
            </p>
          </div>
          <div className="h-12 w-[1px] bg-gray-200 dark:bg-zinc-700 hidden md:block" />
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('pages:checkout.estimatedArrival')}</p>
            <div className="flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white">
              <Clock className="w-5 h-5 text-starbucks-green" />
              <span>25 - 35 {t('common:minutes')}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-starbucks-green" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white">{t('pages:checkout.deliveryTo')}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed pl-13">
              123 Nile Corniche, Maadi<br />
              Apartment 4B, 4th Floor<br />
              Cairo, Egypt
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-starbucks-green" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white">{t('pages:checkout.orderSummary')}</h3>
            </div>
            <div className="space-y-1 pl-13 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{t('pages:checkout.items')} (3)</span>
                <span className="font-bold text-gray-900 dark:text-white">EGP 425.00</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{t('pages:checkout.deliveryFee')}</span>
                <span className="font-bold text-gray-900 dark:text-white">EGP 25.00</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800">
                <span className="font-black text-gray-900 dark:text-white">{t('pages:checkout.total')}</span>
                <span className="font-black text-starbucks-green text-lg">EGP 450.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Progress Mock */}
      <div className="bg-gray-50 dark:bg-zinc-800/30 p-8 border-t border-gray-100 dark:border-zinc-800">
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-zinc-700 -translate-y-1/2" />
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "35%" }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute top-1/2 left-0 h-1 bg-starbucks-green -translate-y-1/2"
          />
          
          <div className="relative flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={cn(
                "w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 shadow-sm relative z-10 transition-colors duration-500",
                step === 1 ? "bg-starbucks-green" : step === 2 ? "bg-starbucks-green/40" : "bg-gray-300 dark:bg-zinc-600"
              )} />
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span className="text-starbucks-green">{t('pages:checkout.orderPlaced')}</span>
          <span>{t('pages:checkout.preparing')}</span>
          <span>{t('pages:checkout.onTheWay')}</span>
          <span>{t('pages:checkout.delivered')}</span>
        </div>
      </div>
    </motion.div>
  );
}
