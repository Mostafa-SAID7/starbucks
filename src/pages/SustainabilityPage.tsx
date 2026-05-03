import React from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import InnerHeader from '../components/InnerHeader'
import { Button } from '../components/ui/button'
import { ExternalLink } from 'lucide-react'

const SustainabilityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title="الاستدامة والتأثير الاجتماعي" />

      <InnerHeader
        title="الاستدامة والتأثير الاجتماعي"
        subtitle="نعمل معاً لإعادة ابتكار المستقبل لأجل أمورٍ، كثيرة"
        variant="dark"
      />

      {/* Section 1 — Hero intro */}
      <section className="py-16 lg:py-24 border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                src="https://www.starbucks.eg/assets/image-cache/sustainability-hero-ar.jpg"
                alt="الاستدامة"
                className="w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  const t = e.currentTarget
                  t.src = 'https://www.starbucks.eg/assets/image-cache/social-impact.jpg'
                }}
              />
            </div>
            <div className="flex-1 text-right space-y-6">
              <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white leading-snug lg:text-4xl">
                نعمل معاً لإعادة ابتكار المستقبل لأجل أمورٍ، كثيرة
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                نحب شغفكم للقهوة سواء كنتم في الطريق الى العمل أو لمقابلة الأصدقاء أو الذهاب إلى النادي الرياضي، فنحن معكم في كل مكان وجزء من روتينكم اليومي مثلما أنكم أيضاً جزء من رحلتنا لنكون شركة إيجابية الموارد.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                تتمثل أهمية البيئة بالنسبة لنا كأهمية صناعة القهوة ولهذا السبب قمنا بزيادة خيارات قائمة الطعام النباتي والصديق للبيئة، كما قمنا بالتخلص من المواد ذات الاستخدام الواحد واستبدالها بمواد قابلة لإعادة الاستخدام، وقمنا بالاستثمار في ممارسات مبتكرة وجديدة لتطوير مقاهي صديقة للبيئة ومستدامة. فبإمكان شركائنا وزبائننا المساهمة في صنع التغير <span className="font-bold text-starbucks-green">#اصنعوا_الفرق</span> ومساعدتنا في رحلتنا للاستدامة البيئية من خلال مقاهينا ال 900 الموجودة في منطقة الشرق الأوسط وشمال إفريقيا.
              </p>
              <h3 className="text-xl font-extrabold text-starbucks-dark dark:text-white">
                نحقق أهدافنا بالعمل الجماعي
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                إبدأ بخطوات بسيطة فمثلاً في كل مرة تخرج فيها احمل معك كوب قابل لإعادة الاستخدام و<span className="font-bold text-starbucks-green">#اصنعوا_الفرق</span> بطريقة سهلة وفعالة لتكونوا جزءاً من نجاحنا في الحفاظ على البيئة حيث نقدم أكثر مما نستهلك. لذا ندعوكم لجعل المواد القابلة لإعادة الاستخدام جزء من روتينكم اليومي فمن خلال خطوات صغيرة نستطيع أن نحدث فرقاً كبيراً.
              </p>
              <a
                href="https://www.youtube.com/watch?v=ybWV-w6M_0U"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full bg-starbucks-dark px-10 py-6 font-extrabold hover:bg-starbucks-green transition-all flex items-center gap-2">
                  قم بإجراء التغيير
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Reusable Cups */}
      <section className="py-16 lg:py-24 bg-[#f7f7f7] dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src="https://www.starbucks.eg/assets/image-cache/reusable-cup.jpg"
                alt="الأكواب القابلة للاستخدام"
                className="w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://www.starbucks.eg/assets/image-cache/sustainability-cup.jpg'
                }}
              />
            </div>
            <div className="flex-1 text-right space-y-6">
              <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white lg:text-4xl leading-snug">
                طريقة استعمال الأكواب القابلة لإعادة الاستخدام
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                تعد آمنة وبدون تلامس! ما عليك سوى أن تحضر كوبك النظيف القابل لإعادة الاستخدام للاستمتاع بمشروبك المفضل من ستاربكس و<span className="font-bold text-starbucks-green">#اصنعوا_الفرق</span>
              </p>
              <a
                href="https://www.youtube.com/watch?v=qY160wQXkfM"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="rounded-full border-2 border-starbucks-dark px-10 py-6 font-extrabold hover:bg-starbucks-dark hover:text-white dark:border-white dark:text-white transition-all flex items-center gap-2">
                  شاهد كيف
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Coffee Grounds Garden */}
      <section className="py-16 lg:py-24 border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-start gap-12">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                src="https://www.starbucks.eg/assets/image-cache/flowers-sustainability.jpg"
                alt="الزهور والقهوة"
                className="w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://www.starbucks.eg/assets/image-cache/coffee-grounds.jpg'
                }}
              />
            </div>
            <div className="flex-1 text-right space-y-6">
              <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white lg:text-4xl leading-snug">
                الزهور تحب القهوة أيضاً!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                هل تساءلت يومًا إلى أي مدى يمكن أن تذهب حبة البن؟ بالإضافة إلى فنجان القهوة الساخن الذي تستمتع به يوميًا، لقد وجدنا طريقة لاستخدام القهوة المطحونة في تغذية البيئة.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                القهوة مصدر كبير للعناصر الغذائية لزهورك ونباتاتك. مستوحاة من هذا، بدأت ستاربكس برنامج <span className="font-bold">Grounds for Your Garden</span> في عام 1995. هذا هو المكان الذي يتم فيه تعبئة بقايا القهوة المستهلكة بعناية في أكياس، لتأخذها إلى المنزل وتستخدمها في حديقتك.
              </p>
              <div className="bg-starbucks-green/10 dark:bg-starbucks-green/5 border border-starbucks-green/20 rounded-2xl p-6 text-right">
                <p className="font-bold text-starbucks-dark dark:text-white mb-4">تُعد تفل القهوة المستخدمة سماداً ممتازاً، خاصةً للنباتات التي تزدهر في التربة الحمضية. فيما يلي ثلاث طرق لاستخدام قهوتنا:</p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>مختلطة مباشرة في التربة حول النباتات، مثل الهذر، رودودندرون، الأزاليات، المغنوليا، الكوبية والكاميليا.</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>يضاف إلى السماد للمساعدة في تسريع عملية التسميد.</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-starbucks-green" />
                    <span>يتم تطبيقه كضمادة علوية للخضروات سريعة النمو، والعزق في التربة لتجنب تلوث أوراق الشجر.</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                  للحصول على أفضل النتائج، يجب ألا تزيد نسبة القهوة المطحونة عن 25٪ من إجمالي محتوى كومة السماد. يجب استخدام القهوة المطحونة في غضون 2-3 أسابيع من التخمير للحصول على أكبر قيمة غذائية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Strawless Lids */}
      <section className="py-16 lg:py-24 bg-[#f7f7f7] dark:bg-zinc-950">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src="https://www.starbucks.eg/assets/image-cache/cold-cup-ar.jpg"
                alt="أغطية بدون أعواد الشرب"
                className="w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://www.starbucks.eg/assets/image-cache/strawless-lid.jpg'
                }}
              />
            </div>
            <div className="flex-1 text-right space-y-6">
              <a
                href="https://www.alshaya.com/campaigns/Starbucks/Strawless_Lid_Launch/ar/strawless.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <h2 className="text-3xl font-extrabold text-starbucks-green underline underline-offset-4 lg:text-4xl leading-snug hover:text-starbucks-dark transition-colors">
                  أغطية بدون أعواد الشرب في الشرق الأوسط
                </h2>
              </a>
              <h3 className="text-xl font-extrabold text-starbucks-dark dark:text-white">
                تقليل النفايات + تمكين الابتكار
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                يمكن للأمور الصغيرة التي نفعلها أن تحقق أثراً كبيراً على العالم. يعد اتخاذ قرار البدء في التوقف عن استخدام أعواد الشرب البلاستيكية من قبل مقاهي ستاربكس خطوةً صغيرةً لكنها مهمة في رحلتنا لتعزيز وعينا تجاه البيئة وتقليل تأثيرنا على العالم من خلال الحد من النفايات التي ننتجها والوصول إلى هدفنا المتمثل في أن نكون شركة إيجابية الموارد هنا في منطقة الشرق الأوسط وشمال أفريقيا.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                ومن خلال مزيج من التصميم الرائع والتفكير المبتكر والتركيز على إيجاد حلول أفضل للحفاظ على البيئة، قدمنا أغطية الأكواب الخالية من اعواد الشرب والقابلة لإعادة التدوير بالكامل. ويمثل وصول أغطية الأكواب الخالية من الأعواد إلى منطقة الشرق الأوسط وشمال أفريقيا، قفزةً إلى الأمام في ما يتعلق بالتفكير الصديق للبيئة وحل المشكلات، كما أنه يعد دليلاً على أن التغييرات الصغيرة يمكنها أن تحقق أثراً كبيراً.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SustainabilityPage
