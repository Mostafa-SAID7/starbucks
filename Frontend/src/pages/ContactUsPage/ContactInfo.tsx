import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { ContactUsData as ContactData } from '@/types/pages';

interface ContactInfoProps {
  data: ContactData;
  textAlignClass: string;
  itemsAlignClass: string;
}

export function ContactInfo({ data, textAlignClass, itemsAlignClass }: ContactInfoProps) {
  const { t } = useTranslation(['pages']);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-16 ${textAlignClass}`}
    >
      <h1 className="text-5xl lg:text-7xl font-black text-starbucks-dark dark:text-white mb-8 leading-tight">
        {t('pages:contact.hero.title')}
      </h1>

      <div className={`flex flex-col gap-10 mt-12 ${itemsAlignClass}`}>
        <div className={`flex flex-col gap-3 ${itemsAlignClass}`}>
          <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {t('pages:contact.info.inquiry')}
          </p>
          <a
            href={`mailto:${data.info.email}`}
            className="flex items-center gap-4 text-starbucks-green font-black text-3xl lg:text-4xl hover:text-starbucks-dark dark:hover:text-white transition-all underline decoration-starbucks-green/30 underline-offset-8"
          >
            <Mail className="h-8 w-8" />
            {data.info.email}
          </a>
        </div>

        <div className={`flex flex-col gap-3 pt-4 ${itemsAlignClass}`}>
          <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {t('pages:contact.info.phone_label')}
          </p>
          <a
            href={`tel:${data.info.phoneTel}`}
            className="flex items-center gap-4 text-starbucks-green font-black text-4xl lg:text-5xl hover:text-starbucks-dark dark:hover:text-white transition-all"
            dir="ltr"
          >
            <Phone className="h-9 w-9" />
            {data.info.phone}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
