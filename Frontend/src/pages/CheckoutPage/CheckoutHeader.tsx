import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Page header with a back button and a 3-step progress indicator.
 */
export function CheckoutHeader() {
  const { t } = useTranslation(['pages']);
  const navigate = useNavigate();

  return (
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
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
          {t('pages:checkout.title')}
        </h1>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 max-w-2xl">
        {[
          t('pages:checkout.steps.delivery'),
          t('pages:checkout.steps.payment'),
          t('pages:checkout.steps.summary'),
        ].map((label, idx) => (
          <div key={label} className="flex items-center gap-3" style={{ opacity: idx === 0 ? 1 : 0.3 }}>
            {idx > 0 && <div className="h-0.5 bg-gray-100 dark:bg-zinc-800 flex-1 w-12" />}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-black shadow-sm ${
                idx === 0
                  ? 'bg-starbucks-green text-white shadow-starbucks-green/20'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
              }`}
            >
              {idx + 1}
            </div>
            <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
