import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface CheckoutHeaderProps {
  currentStep: 1 | 2 | 3;
}

/**
 * Page header with a back button and a live 3-step progress indicator.
 */
export function CheckoutHeader({ currentStep }: CheckoutHeaderProps) {
  const { t } = useTranslation(['pages']);
  const navigate = useNavigate();

  const steps = [
    t('pages:checkout.steps.delivery'),
    t('pages:checkout.steps.payment'),
    t('pages:checkout.steps.summary'),
  ];

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
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          return (
            <div
              key={label}
              className="flex items-center gap-3"
              style={{ opacity: isActive || isCompleted ? 1 : 0.3 }}
            >
              {idx > 0 && (
                <div
                  className={`h-0.5 flex-1 w-12 transition-colors duration-300 ${
                    isCompleted ? 'bg-starbucks-green' : 'bg-gray-100 dark:bg-zinc-800'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black shadow-sm transition-colors duration-300 ${
                  isActive
                    ? 'bg-starbucks-green text-white shadow-starbucks-green/20'
                    : isCompleted
                    ? 'bg-starbucks-green/20 text-starbucks-green'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <span
                className={`font-black text-sm uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
