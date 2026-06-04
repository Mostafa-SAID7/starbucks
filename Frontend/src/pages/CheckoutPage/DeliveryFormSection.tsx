import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Clock, ShieldCheck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/ui';
import type { DeliveryForm } from './types';

interface DeliveryFormSectionProps {
  form: DeliveryForm;
  errors: Partial<DeliveryForm>;
  onChange: (updated: DeliveryForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Left column form: delivery method selector, address/phone/notes inputs,
 * and a mock (disabled) payment section.
 */
export function DeliveryFormSection({ form, errors, onChange, onSubmit }: DeliveryFormSectionProps) {
  const { t } = useTranslation(['pages']);

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Delivery Method */}
      <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black mb-8 tracking-tight">{t('pages:checkout.deliveryMethod')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(['delivery', 'pickup'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onChange({ ...form, deliveryMethod: method })}
              className={cn(
                'relative p-6 rounded-2xl border-2 text-left transition-all group overflow-hidden',
                form.deliveryMethod === method
                  ? 'border-starbucks-green bg-starbucks-green/[0.03] ring-1 ring-starbucks-green/20'
                  : 'border-gray-100 dark:border-zinc-800 hover:border-starbucks-green/30 bg-white dark:bg-zinc-900/50'
              )}
            >
              {form.deliveryMethod === method && (
                <motion.div
                  layoutId="active-method"
                  className="absolute top-4 right-4 w-6 h-6 bg-starbucks-green rounded-full flex items-center justify-center shadow-lg shadow-starbucks-green/30"
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </motion.div>
              )}
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-starbucks-green/10 transition-colors">
                  {method === 'delivery' ? (
                    <MapPin className="w-7 h-7 text-starbucks-green" />
                  ) : (
                    <Clock className="w-7 h-7 text-starbucks-green" />
                  )}
                </div>
                <span className="font-black text-xl mb-1">{t(`pages:checkout.${method}`)}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {t(`pages:checkout.${method}Description`)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Address & Details */}
      <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black mb-8 tracking-tight">{t('pages:checkout.address')}</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 ml-1">
              {t('pages:checkout.address')}
            </label>
            <textarea
              value={form.address}
              onChange={(e) => onChange({ ...form, address: e.target.value })}
              placeholder={t('pages:checkout.addressPlaceholder')}
              rows={3}
              className={cn(
                'w-full p-5 rounded-2xl border bg-gray-50/50 dark:bg-zinc-800/50 transition-all focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none font-bold text-lg placeholder:font-medium resize-none',
                errors.address ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-gray-200 dark:border-zinc-700'
              )}
            />
            {errors.address && <p className="text-sm text-red-500 font-bold ml-1">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 ml-1">
              {t('pages:checkout.phone')}
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange({ ...form, phone: e.target.value })}
              placeholder={t('pages:checkout.phonePlaceholder')}
              className={cn(
                'w-full p-5 rounded-2xl border bg-gray-50/50 dark:bg-zinc-800/50 transition-all focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none font-bold text-lg placeholder:font-medium',
                errors.phone ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-gray-200 dark:border-zinc-700'
              )}
            />
            {errors.phone && <p className="text-sm text-red-500 font-bold ml-1">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 ml-1">
              {t('pages:checkout.notes')}
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => onChange({ ...form, notes: e.target.value })}
              placeholder={t('pages:checkout.notesPlaceholder')}
              rows={2}
              className="w-full p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 transition-all focus:ring-4 focus:ring-starbucks-green/10 focus:border-starbucks-green outline-none font-bold text-lg placeholder:font-medium resize-none"
            />
          </div>
        </div>
      </div>

      {/* Payment (Mock / disabled) */}
      <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm opacity-50 grayscale select-none">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">{t('pages:checkout.steps.payment')}</h2>
          <ShieldCheck className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex items-center gap-5 p-6 rounded-2xl bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700">
          <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-700 rounded-lg opacity-50" />
          </div>
        </div>
      </div>
    </form>
  );
}
