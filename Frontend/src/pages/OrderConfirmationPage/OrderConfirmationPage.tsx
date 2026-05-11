import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, MapPin, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components';
import { useLanguage } from '@/hooks';
import { cn } from '@/lib/ui';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation(['pages', 'common']);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  // In a real app, we would fetch order details by orderId
  // For now, we'll show a premium mock success state

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark pt-24 pb-20 overflow-hidden relative">
      <SEO title={t('pages:checkout.confirmationTitle')} />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-starbucks-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-starbucks-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Success Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
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

          {/* Order Details Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border border-gray-100 dark:border-zinc-800">
            <div className="p-8 space-y-8">
              {/* Order ID & Status */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
                <div className="text-center md:text-left space-y-1">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('pages:checkout.orderNumber')}</p>
                  <p className="text-2xl font-black text-starbucks-green tracking-tight">#{orderId?.substring(0, 8).toUpperCase() || 'SBX-7291-K'}</p>
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

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
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
          <motion.p variants={itemVariants} className="text-center text-sm text-gray-400 font-medium pt-4">
            {t('pages:checkout.needHelp')} <a href="#" className="text-starbucks-green hover:underline font-bold">{t('pages:checkout.contactSupport')}</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
