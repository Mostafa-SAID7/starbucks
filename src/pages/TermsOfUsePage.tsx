import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import InnerHeader from '../components/InnerHeader'
import Logo from '../components/Logo'

const TermsOfUsePage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={isRTL ? 'الشروط والأحكام | ستاربكس' : 'Terms of Use | Starbucks'} />

      <InnerHeader
        title={isRTL ? 'الشروط والأحكام' : 'Terms of Use'}
        variant="light"
      />

      <div className="container mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row-reverse">

          {/* ─── Sidebar ─── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="bg-starbucks-green p-4 text-center">
                <Logo className="mx-auto h-16 w-16 object-contain mb-2" />
              </div>
              <div className="bg-gray-50 dark:bg-zinc-900 p-4 space-y-3">
                <a
                  href="https://www.starbucks.eg/ar/our-coffees"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-starbucks-green py-3 text-center text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                >
                  {isRTL ? 'قائمتنا' : 'Our Menu'}
                </a>
                <a
                  href="https://www.starbucks.eg/ar/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full border-2 border-starbucks-dark py-3 text-center text-sm font-extrabold text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all"
                >
                  {isRTL ? 'نبذة عنا' : 'About Us'}
                </a>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-right leading-relaxed text-gray-700 dark:text-gray-300 space-y-8"
            dir="rtl"
          >
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">الشروط والأحكام</h1>
              <p>
                تُعدّ هذه الشروط والأحكام ("الاتفاقية") اتفاقية قانونية بين مستخدمي هذا الموقع الإلكتروني ("الموقع") وشركة Alshaya Co.WLL ("الشايع") بصفتها حاملة الامتياز الإقليمي لستاربكس كوفي الدولية في المنطقة. ويعني استخدامك لهذا الموقع موافقتك على الالتزام بالشروط والأحكام المذكورة أدناه. إذا كنت لا توافق على هذه الشروط، يُرجى عدم استخدام هذا الموقع.
              </p>
              <p>
                تحتفظ شركة الشايع بحقها في تعديل هذه الاتفاقية في أي وقت، وسيُعدّ استمرارك في استخدام الموقع بعد نشر أي تعديلات قبولاً منك لهذه التعديلات. تسري هذه الاتفاقية أيضاً على جميع المحتويات والبرامج والخدمات الواردة في الموقع أو المتاحة من خلاله والمقدَّمة من شركة الشايع.
              </p>
            </div>

            <Section title="مسؤوليات المستخدم">
              <p>
                أنت توافق على استخدام هذا الموقع فقط لأغراض قانونية، وعلى عدم إرسال أو نشر أي محتوى من شأنه:
              </p>
              <ul className="mt-3 space-y-2 pr-4">
                {[
                  'انتهاك أي قوانين أو لوائح تنظيمية محلية أو دولية.',
                  'نشر أي مواد غير قانونية أو ضارة أو تهديدية أو مسيئة أو مضايقة أو تشهيرية أو خادشة للحياء أو فاحشة.',
                  'انتهاك حقوق الملكية الفكرية لأي طرف.',
                  'إرسال أي معلومات أو برامج تحتوي على فيروسات أو أكواد ضارة أو أي ملفات تالفة أخرى.',
                  'إعاقة المستخدمين الآخرين من استخدام هذا الموقع.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="الملكية الفكرية">
              <p>
                جميع محتويات هذا الموقع، بما في ذلك على سبيل المثال لا الحصر النصوص والصور والرسومات والشعارات وصور الأزرار ومقاطع الصوت والتنزيلات الرقمية والبيانات المجمّعة والبرامج، هي ملك لشركة ستاربكس كوفي الدولية أو موردي محتواها وتخضع لحماية قوانين الملكية الفكرية السارية.
              </p>
              <p className="mt-4">
                علامة ستاربكس التجارية وشعاراتها وما يرتبط بها من صور تجارية هي علامات خدمة أو علامات تجارية مسجلة مملوكة لشركة ستاربكس كوفي إنترناشيونال. لا يجوز استخدام هذه العلامات التجارية في أي منتجات أو خدمات غير مرتبطة بستاربكس أو بأي طريقة من شأنها إثارة البلبلة لدى العملاء أو تشويه سمعة ستاربكس.
              </p>
            </Section>

            <Section title="ترخيص الموقع واستخدام الموقع">
              <p>
                تمنحك شركة الشايع ترخيصاً محدوداً وغير قابل للتحويل وغير حصري للوصول إلى هذا الموقع واستخدامه للأغراض الشخصية وغير التجارية فقط. ويشمل هذا الترخيص حق تنزيل محتوى الموقع وطباعته للأغراض الشخصية وغير التجارية فقط.
              </p>
              <p className="mt-4">
                لا يجوز لك استخدام هذا الموقع لأي غرض تجاري أو عام دون الحصول على إذن خطي مسبق من شركة الشايع. كما لا يجوز لك استخدام أي روبوتات أو عناكب بحث أو أي أجهزة آلية أخرى أو أي عملية يدوية للرصد أو نسخ أي صفحات من هذا الموقع.
              </p>
            </Section>

            <Section title="التعليقات والمقترحات وغيرها من المحتويات">
              <p>
                يمكنك نشر تعليقات ومراجعات ومقترحات وأسئلة أو إرسال محتويات أخرى، شريطة ألا تكون هذه المحتويات غير قانونية أو فاضحة أو مهددة أو تشهيرية أو تنتهك خصوصية أي شخص أو تعالج موضوعات مرفوضة أو أي محتويات غير مقبولة على الإنترنت أو مضرة بالقاصرين بأي شكل من الأشكال. كما يجب ألا تحتوي هذه المحتويات على إشارات تجارية أو دعائية أو سياسية أو طلبات متكررة أو رسائل تسلسلية أو أي محتويات أخرى تُعدّ بمثابة بريد إلكتروني تجاري غير مرغوب فيه.
              </p>
              <p className="mt-4">
                إذا قمت بنشر أي محتوى، فإنك تمنح شركة الشايع الحق غير الحصري والمجاني وخالي من حقوق الملكية والدائم والقابل للتحويل الفرعي في استخدام هذه المحتويات وإعادة إنتاجها وتعديلها ونشرها وترجمتها وإنشاء أعمال مشتقة منها وتوزيعها وتنفيذها وعرضها في جميع أنحاء العالم وعبر أي وسيلة إعلامية.
              </p>
            </Section>

            <Section title="التنصل من المسؤولية">
              <p>
                يُقدَّم هذا الموقع على أساس "كما هو" دون أي ضمانات من أي نوع، صريحة كانت أم ضمنية. لا تُقدّم شركة الشايع أي ضمانات صريحة أو ضمنية بشأن تشغيل هذا الموقع أو المعلومات أو المحتويات أو المواد أو المنتجات المتاحة فيه. ولا تضمن شركة الشايع دقة المعلومات المتاحة على هذا الموقع أو اكتمالها.
              </p>
              <p className="mt-4">
                لن تكون شركة الشايع مسؤولة عن أي أضرار من أي نوع تنشأ عن استخدامك لهذا الموقع، بما في ذلك على سبيل المثال لا الحصر الأضرار المباشرة وغير المباشرة والعرضية والعقابية والتبعية.
              </p>
            </Section>

            <Section title="الروابط لمواقع أخرى">
              <p>
                قد يحتوي هذا الموقع على روابط لمواقع إلكترونية أخرى يشغّلها أطراف أخرى. لا تتحكم شركة الشايع في هذه المواقع ولا تتحمل أي مسؤولية عنها. وبالتالي، لا تضمن شركة الشايع دقة المعلومات المتاحة على هذه المواقع أو اكتمالها، ولا تتحمل أي مسؤولية عن هذه المعلومات.
              </p>
            </Section>

            <Section title="القانون الواجب التطبيق">
              <p>
                تخضع هذه الاتفاقية لقوانين دولة الكويت وتُفسَّر وفقها. وفي حالة نشوء أي نزاع بشأن هذه الاتفاقية، فإنك توافق على الخضوع للاختصاص القضائي الشخصي والحصري للمحاكم المختصة في الكويت.
              </p>
            </Section>

            <Section title="التعديلات على الشروط والأحكام">
              <p>
                تحتفظ شركة الشايع بحقها في تعديل هذه الشروط والأحكام في أي وقت دون إشعار مسبق. وسيُعدّ استمرارك في استخدام الموقع بعد نشر أي تعديلات قبولاً منك لهذه التعديلات.
              </p>
            </Section>

            <Section title="التواصل معنا">
              <p className="mb-4">
                إذا كان لديك أي استفسارات أو ملاحظات بشأن هذه الشروط والأحكام، يُرجى التواصل معنا:
              </p>
              <div className="space-y-1 text-starbucks-green font-bold">
                <p dir="ltr" className="text-right">
                  <a href="mailto:privacy@alshaya.com" className="hover:underline">privacy@alshaya.com</a>
                </p>
                <p dir="ltr" className="text-right">
                  <a href="tel:+96522270180" className="hover:underline">+965 2227 0180</a>
                </p>
              </div>
            </Section>
          </motion.article>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-extrabold text-starbucks-dark dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export default TermsOfUsePage
