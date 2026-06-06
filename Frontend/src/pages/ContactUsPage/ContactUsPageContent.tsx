import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components';
import { cn } from '@/lib/ui';
import { useLanguage } from '@/hooks';
import type { ContactUsData as ContactData } from '@/types/pages';
import { ContactInfo } from './ContactInfo';
import { ContactForm } from './ContactForm';

interface ContactUsPageContentProps {
  data: ContactData;
}

export function ContactUsPageContent({ data }: ContactUsPageContentProps) {
  const { t } = useTranslation(['pages']);
  const { isRTL } = useLanguage();

  const textAlignClass = isRTL ? 'text-right' : 'text-left';
  const itemsAlignClass = isRTL ? 'items-end' : 'items-start';

  return (
    <div
      className="min-h-screen bg-white dark:bg-black transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO title={t('pages:contact.hero.title')} />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className={cn('flex flex-col lg:flex-row gap-16 relative', isRTL && 'lg:flex-row-reverse')}>
          {/* Side 1: Sticky Sidebar Image */}
          <div className="lg:w-[40%] lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <img
                src="/api/v1/images/contact-us.webp"
                alt={t('pages:contact.hero.image_alt')}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className="max-w-4xl mx-auto lg:mx-0">
              <ContactInfo
                data={data}
                textAlignClass={textAlignClass}
                itemsAlignClass={itemsAlignClass}
              />
              <ContactForm
                data={data}
                isRTL={isRTL}
                textAlignClass={textAlignClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
