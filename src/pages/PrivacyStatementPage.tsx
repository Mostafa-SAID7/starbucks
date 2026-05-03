import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import InnerHeader from '../components/InnerHeader'
import Logo from '../components/Logo'

const PrivacyStatementPage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={isRTL ? 'سياسة الخصوصية | ستاربكس' : 'Privacy Statement | Starbucks'} />

      <InnerHeader
        title={isRTL ? 'سياسة الخصوصية' : 'Privacy Statement'}
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
              <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">سياسة الخصوصية</h1>
              <p className="text-sm text-gray-400">آخر تحديث: أكتوبر 2023</p>
              <p>
                تُقدِّم لكم شركة Alshaya Co.WLL ("الشايع") بصفتها حاملة الامتياز الإقليمي لستاربكس في منطقة الشرق الأوسط وشمال إفريقيا وتركيا وآسيا الوسطى ("نحن"، "لنا"، "شركتنا") هذه السياسة لإعلامكم بممارساتنا المتعلقة بجمع المعلومات الشخصية واستخدامها والإفصاح عنها وحمايتها. تنطبق هذه السياسة على موقعنا الإلكتروني وتطبيقات الهاتف المحمول وجميع الخدمات الرقمية الأخرى التي نقدمها.
              </p>
              <p>
                بزيارتك لهذا الموقع الإلكتروني أو استخدامه، فإنك تقر بأنك اطلعت على هذه السياسة وفهمت شروطها وقبلتها. إذا كنت لا توافق على سياسة الخصوصية هذه، يُرجى عدم استخدام هذا الموقع.
              </p>
            </div>

            <Section title="المعلومات التي نجمعها">
              <p>قد نجمع المعلومات التالية عنك:</p>
              <ul className="mt-3 space-y-2 pr-4">
                {[
                  'معلومات التعريف الشخصي، مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف وتاريخ الميلاد.',
                  'معلومات الحساب عند التسجيل في برنامج المكافآت أو خدمات ستاربكس الرقمية.',
                  'تفاصيل عمليات الشراء والمعاملات التجارية.',
                  'المعلومات الجغرافية عند استخدام ميزة تحديد الموقع للبحث عن أقرب فرع.',
                  'بيانات الاستخدام مثل الصفحات التي تزورها وعمليات البحث التي تُجريها.',
                  'معلومات الجهاز مثل نوع المتصفح ونظام التشغيل وعنوان IP.',
                  'ملفات تعريف الارتباط (كوكيز) والتقنيات المشابهة.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="كيفية استخدامنا للمعلومات">
              <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
              <ul className="mt-3 space-y-2 pr-4">
                {[
                  'تقديم خدماتنا ومعالجة طلباتك وإدارة حسابك.',
                  'إرسال تأكيدات الطلبات وإشعارات الشحن والتحديثات المتعلقة بحسابك.',
                  'إدارة برنامج المكافآت وإرسال العروض المخصصة لك.',
                  'تحسين خدماتنا ومنتجاتنا ومحتوى موقعنا الإلكتروني.',
                  'الرد على استفساراتك وطلبات الدعم الفني.',
                  'إرسال الرسائل التسويقية والعروض الترويجية (بموافقتك).',
                  'الامتثال للالتزامات القانونية والتنظيمية.',
                  'حماية حقوقنا وأمن موقعنا ومنع الاحتيال.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="مشاركة المعلومات مع أطراف ثالثة">
              <p>
                لا نبيع معلوماتك الشخصية لأطراف ثالثة. ومع ذلك، قد نشارك معلوماتك في الحالات التالية:
              </p>
              <ul className="mt-3 space-y-2 pr-4">
                {[
                  'مع شركة ستاربكس كوفي الدولية لأغراض إدارة العلامة التجارية.',
                  'مع مزودي الخدمات الذين يساعدوننا في تشغيل موقعنا الإلكتروني وتقديم خدماتنا.',
                  'مع شركاء التوصيل مثل Talabat لمعالجة طلبات التوصيل.',
                  'عند الضرورة للامتثال للقوانين أو أوامر المحاكم أو الطلبات الحكومية.',
                  'في حالة الاندماج أو الاستحواذ أو بيع الأصول، مع إخطارك مسبقاً.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="ملفات تعريف الارتباط (الكوكيز)">
              <p>
                نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لتحسين تجربتك على موقعنا. تُستخدم هذه الملفات لتذكر تفضيلاتك، وتحليل حركة الزيارات، وتخصيص المحتوى المقدَّم لك. يمكنك ضبط متصفحك لرفض ملفات تعريف الارتباط، غير أن ذلك قد يؤثر على بعض وظائف الموقع.
              </p>
              <p className="mt-4">
                <strong className="font-extrabold text-starbucks-dark dark:text-white">الكوكيز الضرورية:</strong> ضرورية لتشغيل الموقع ولا يمكن إيقافها.
              </p>
              <p className="mt-2">
                <strong className="font-extrabold text-starbucks-dark dark:text-white">الكوكيز الوظيفية:</strong> تسمح لنا بتحليل استخدام الموقع وقياس الأداء وتحسينه.
              </p>
              <p className="mt-2">
                <strong className="font-extrabold text-starbucks-dark dark:text-white">كوكيز الإعلانات:</strong> تُستخدم من قِبل شركات الإعلان لتقديم إعلانات مرتبطة باهتماماتك.
              </p>
            </Section>

            <Section title="نقل البيانات الدولي">
              <p>
                قد تُخزَّن معلوماتك الشخصية وتُعالَج في دول خارج دولتك، بما في ذلك الدول التي قد لا تتمتع بمستوى حماية البيانات ذاته. في مثل هذه الحالات، نتخذ تدابير مناسبة لضمان حماية معلوماتك وفقاً لهذه السياسة والقوانين المعمول بها.
              </p>
            </Section>

            <Section title="أمن البيانات">
              <p>
                نلتزم بحماية معلوماتك الشخصية ونتخذ تدابير أمنية تقنية وإدارية وفيزيائية مناسبة للحماية من الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف. ومع ذلك، لا يمكننا ضمان أمان البيانات المُرسَلة عبر الإنترنت بشكل كامل.
              </p>
            </Section>

            <Section title="الاحتفاظ بالبيانات">
              <p>
                نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضرورياً لتحقيق الأغراض المبينة في هذه السياسة، أو لفترات أطول حسبما يقتضيه القانون. عند انتهاء الحاجة إليها، نحذف معلوماتك أو نُجهِّلها بطرق آمنة.
              </p>
            </Section>

            <Section title="حقوقك">
              <p>وفقاً للقوانين المعمول بها، قد تتمتع بالحقوق التالية:</p>
              <ul className="mt-3 space-y-2 pr-4">
                {[
                  'حق الوصول إلى معلوماتك الشخصية التي نحتفظ بها.',
                  'حق تصحيح المعلومات غير الدقيقة أو غير المكتملة.',
                  'حق حذف معلوماتك الشخصية في ظروف معينة.',
                  'حق الاعتراض على معالجة معلوماتك في بعض الحالات.',
                  'حق سحب موافقتك في أي وقت دون أن يؤثر ذلك على شرعية المعالجة السابقة لسحب الموافقة.',
                  'حق تقديم شكوى إلى جهة حماية البيانات المختصة.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                لممارسة هذه الحقوق، يُرجى التواصل معنا عبر البريد الإلكتروني: <a href="mailto:privacy@alshaya.com" className="text-starbucks-green font-bold hover:underline">privacy@alshaya.com</a>
              </p>
            </Section>

            <Section title="خصوصية الأطفال">
              <p>
                لا يستهدف موقعنا الأطفال دون سن 13 عاماً ولا نجمع معلومات شخصية منهم عن قصد. إذا اكتشفنا أننا جمعنا معلومات من طفل دون سن 13 عاماً، فسنحذفها فوراً. إذا كنت تعتقد أن طفلك قدَّم لنا معلومات شخصية، يُرجى التواصل معنا.
              </p>
            </Section>

            <Section title="التعديلات على سياسة الخصوصية">
              <p>
                قد نُعدِّل هذه السياسة من وقت لآخر. سنُخطرك بأي تغييرات جوهرية عبر إشعار بارز على موقعنا أو عبر البريد الإلكتروني. يُعدّ استمرارك في استخدام الموقع بعد نشر التعديلات قبولاً منك للسياسة المعدَّلة.
              </p>
            </Section>

            <Section title="التواصل معنا">
              <p className="mb-4">
                لأي استفسارات أو طلبات تتعلق بسياسة الخصوصية أو بياناتك الشخصية، يُرجى التواصل مع مسؤول حماية البيانات لدينا:
              </p>
              <div className="space-y-1 text-starbucks-green font-bold">
                <p dir="ltr" className="text-right">
                  <a href="mailto:privacy@alshaya.com" className="hover:underline">privacy@alshaya.com</a>
                </p>
                <p dir="ltr" className="text-right">
                  <a href="tel:+96522270180" className="hover:underline">+965 2227 0180</a>
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Alshaya Co.WLL — الكويت، ص.ب. 1960، الصفاة 13020
              </p>
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

export default PrivacyStatementPage
