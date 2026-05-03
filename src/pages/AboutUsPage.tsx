import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { Button } from '../components/ui/button'

const TALABAT_URL = 'https://www.talabat.com/egypt/restaurant/516792/el-rehab-city?aid=7600'
const LOCATIONS_URL = 'https://locations.starbucks.eg/ar/directory'

const AboutUsPage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={isRTL ? 'نبذة عنا | ستاربكس' : 'About Us | Starbucks'} />

      {/* ─── Hero Split ─── */}
      <div className="flex flex-col lg:flex-row min-h-[380px]">
        {/* Left — B&W store photo */}
        <div className="relative flex-1 min-h-[280px] lg:min-h-0 overflow-hidden">
          <img
            src="https://www.starbucks.eg/assets/image-cache/about-us-hero.jpg"
            alt="Starbucks store"
            className="absolute inset-0 h-full w-full object-cover grayscale"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&q=80'
              e.currentTarget.classList.add('grayscale')
            }}
          />
        </div>

        {/* Right — cup card + CTA */}
        <div className="flex flex-col justify-between bg-[#f7f7f7] dark:bg-zinc-950 lg:w-72 xl:w-80">
          {/* Cup image */}
          <div className="relative flex-1 min-h-[220px] overflow-hidden">
            <img
              src="https://www.starbucks.eg/assets/image-cache/about-us-cup.jpg"
              alt="Starbucks cup"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-starbucks-dark/60 to-transparent" />
            <div className="absolute bottom-4 right-4 left-4 text-right">
              <p className="text-xs font-bold text-white/80 mb-0.5">
                {isRTL ? 'تعرف على تاريخنا' : 'Learn our history'}
              </p>
              <p className="text-lg font-extrabold text-white">
                {isRTL ? 'نبذة عنا' : 'About Us'}
              </p>
            </div>
          </div>
          {/* CTA button */}
          <div className="p-4">
            <a href={LOCATIONS_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full rounded-full bg-white text-starbucks-dark font-extrabold text-sm hover:bg-starbucks-green hover:text-white transition-all border-2 border-starbucks-dark dark:border-white dark:bg-zinc-800 dark:text-white py-5">
                {isRTL ? 'قابلني في ستاربكس' : 'Find a Starbucks'}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto max-w-4xl px-6 py-16 lg:px-8 space-y-16">

        {/* Section 1 — نبذة عنا */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-right space-y-5"
        >
          <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white">
            {isRTL ? 'نبذة عنا' : 'About Us'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-bold">
            تقدم ستاربكس مشروبات القهوة للملايين من زبائنها حول العالم كل أسبوع، ومع ذلك فنحن نقدم لكل زبون مشروبه الخاص بطريقة خاصة.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            ومع أن الأمر يبدو بسيطاً، وهو تقديم مشروب قهوة خلال لحظات للزبون، إلا أن هذه اللحظات القصيرة تعني لنا الكثير فهي تعبر عن اهتمامنا بالزبائن.
          </p>

          <h3 className="text-xl font-extrabold text-starbucks-dark dark:text-white pt-2">
            {isRTL ? 'التواصل مع الزبائن' : 'Connecting with Customers'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            نحن نهتم بأدق التفاصيل في كل ما نقوم به لتعزيز التواصل مع زبائننا من خلال التزامنا بأعلى معايير جودة القهوة في العالم، وتقديمها لزبائننا والمجتمع بطريقة مميزة ومستدامة. منذ البداية عندما افتتحنا أول مقهى لنا منذ ما يقارب 40 عاماً، كنا ومازلنا نعمل دائماً على تطوير مقاهينا نحو الأفضل في كل بلد نتواجد فيه.
          </p>
        </motion.section>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-zinc-800" />

        {/* Section 2 — تاريخنا */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-right space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white">
              {isRTL ? 'تاريخنا' : 'Our History'}
            </h2>
            <p className="text-starbucks-green font-bold">
              {isRTL
                ? 'منذ انطلاقتنا الأولى وحتى اليوم، نعمل كل يوم على مبدأين أساسيين هما: مشاركة تجربة قهوة مميزة مع الأصدقاء والمساعدة في جعل هذا العالم مكاناً أفضل.'
                : 'From our beginning to today, we work every day on two core principles: sharing a unique coffee experience with friends and helping make this world a better place.'}
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              ونحن نلتزم بهذه المبادئ الأساسية التي اتخذناها منذ افتتاح أول مقهى ستاربكس عام <strong className="text-starbucks-dark dark:text-white">1971</strong> لغاية يومنا هذا. في ذلك الوقت، كانت الشركة عبارة عن مقهى واحد صغير يتواجد في سوق <strong className="text-starbucks-dark dark:text-white">Pike Place Market</strong> في مدينة سياتل، يقدم أجود أنواع حبوب القهوة الكاملة المحمصة طازجة في العالم، وتم اعتماد اسم "ستاربكس" المستوحى من قصة <strong className="text-starbucks-dark dark:text-white">Moby Dick</strong> التي تتحدث عن المغامرة في عالم البحار وتعكس التقاليد القديمة لتجارة القهوة عبر البحار.
            </p>

            <p>
              في عام <strong className="text-starbucks-dark dark:text-white">1981</strong>، قام هاورد شولتز بأول زيارة له لمقهى ستاربكس، حيث استمتع بأول كوب قهوة سومطرة كثيراً، لينضم لستاربكس بعد عام، وهو الآن رئيس مجلس إدارة ستاربكس والرئيس التنفيذي.
            </p>

            <p>
              في عام <strong className="text-starbucks-dark dark:text-white">1983</strong>، سافر هوارد إلى إيطاليا وأحب المقاهي الإيطالية الصغيرة واستمتع بتجربة قهوة مميزة بأجواء رومانسية، عندها فكر في نقل مفهوم هذه المقاهي الإيطالية التقليدية إلى الولايات المتحدة لتكون مكاناً للقاءات الأصدقاء والعائلة بعد يوم عمل طويل وللاستمتاع بقضاء أوقات مميزة خارج المنزل. بعدها ترك هوارد العمل لدى ستاربكس لفترة قصيرة ليبدأ أعماله التجارية الخاصة عبر افتتاح مقاهي <strong className="text-starbucks-dark dark:text-white">Il Giornale</strong>، ليعود بعدها في أغسطس، عام <strong className="text-starbucks-dark dark:text-white">1987</strong> لشراء ستاربكس بمساعدة المستثمرين المحليين.
            </p>

            <p>
              منذ البداية سعت شركة ستاربكس لتحقيق التميز من خلال تقديم أفضل تجربة تذوق قهوة ضمن أجواء استثنائية تتواصل من خلالها مع زبائنها بطريقة فريدة. مهمتنا هي أن نعمل جاهدين لنكون مصدر إلهام وتفاؤل للجميع - شخص مميز يستمتع بمشروب قهوة مميز في أجواء رائعة.
            </p>

            <p>
              اليوم، مع انتشار أكثر من <strong className="text-starbucks-dark dark:text-white">15,000</strong> مقهى ستاربكس في <strong className="text-starbucks-dark dark:text-white">50</strong> بلداً حول العالم، أصبح ستاربكس من أكبر الشركات المتخصصة بتحميص وتقديم مشروبات القهوة ومن أفضل محلات البيع بالتجزئة للقهوة في العالم. ومع كل كوب، نسعى جاهدين لتقديم تجربة استثنائية بأجواء مميزة.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end pt-4">
            <a href={TALABAT_URL} target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full bg-starbucks-green px-10 py-6 font-extrabold text-white hover:bg-starbucks-dark transition-all">
                {isRTL ? 'اطلب الآن' : 'Order Now'}
              </Button>
            </a>
            <a href={LOCATIONS_URL} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="rounded-full border-2 border-starbucks-dark px-10 py-6 font-extrabold text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all"
              >
                {isRTL ? 'اكتشف مواقع محلاتنا' : 'Find Our Stores'}
              </Button>
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  )
}

export default AboutUsPage
