import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { Button } from '../components/ui/button'
import Logo from '../components/Logo'

const TALABAT_URL = 'https://www.talabat.com/ar/egypt/restaurant/516787/starbucks-city-scape-6th-of-october?aid=7935'

const faqs = [
  {
    q: 'كيف أحصل على خدمة التوصيل من ستاربكس؟',
    a: (
      <>
        اطلب بسهولة عبر تطبيق{' '}
        <a href={TALABAT_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#ff6600] underline underline-offset-2">
          Talabat
        </a>
        .
      </>
    ),
  },
  {
    q: 'هل يمكن طلب كافة المأكولات والمشروبات المتوفرة ضمن قائمة ستاربكس مع خدمة التوصيل؟',
    a: 'حفاظاً على معايير الجودة العالية ومستويات الخدمة التي نقدمها لزبائننا، يرجى العلم بأنه يتوفر لدينا قائمة خاصة للتوصيل، وبالتالي فإن بعض المأكولات والمشروبات المختارة غير متوفرة حالياً مع خدمة التوصيل.',
  },
  {
    q: 'هل يمكنني الدفع باستخدام بطاقة ستاربكس أو تطبيق ستاربكس مع خدمة التوصيل؟',
    a: 'يرجى العلم بأن خدمة الدفع باستخدام بطاقة ستاربكس أو عبر التطبيق غير متوفرة حالياً مع خدمة التوصيل. الرجاء الدفع عن طريق تطبيق Talabat عند الطلب مع خدمة التوصيل.',
  },
  {
    q: 'هل خدمة توصيل ستاربكس متوفرة في منطقتي؟',
    a: 'يرجى تحديد موقعك على الخريطة (اللوكيشن) عبر تطبيق Talabat لمعرفة ما إذا كانت خدمة توصيل ستاربكس متوفرة في منطقتك.',
  },
  {
    q: 'ماذا يمكنني أن أفعل إذا حدث خطأ في طلبي مع خدمة التوصيل؟',
    a: 'يرجى التواصل مع خدمة زبائن Talabat في حال حدوث أي خطأ في طلبك مع خدمة التوصيل.',
  },
]

const DeliveryPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title="قائمة التوصيل | ستاربكس" />

      {/* ─── Hero Section ─── */}
      <section className="bg-[#f7f7f7] dark:bg-zinc-950 py-12 lg:py-20">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex flex-col-reverse items-center gap-10 lg:flex-row">
            {/* Left text */}
            <div className="flex-1 text-right space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold text-starbucks-dark dark:text-white lg:text-5xl leading-tight"
              >
                الآن أصبح الاستمتاع بتجربة ستاربكس أسهل
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                اكتشف إذا كانت خدمة التوصيل متوفرة في منطقتك. اطلب الآن من ستاربكس واستمتع بمشروباتك ومأكولاتك المفضلة مع خدمة التوصيل عبر Talabat.
              </motion.p>

              {/* Partners Card */}
              <div className="mt-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <p className="mb-4 text-base font-extrabold text-starbucks-dark dark:text-white text-center">
                  شركاؤنا في خدمة التوصيل
                </p>
                <div className="flex items-center justify-center gap-3 mb-6">
                  {/* Starbucks logo */}
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 p-1 shadow">
                    <Logo className="h-full w-full object-contain" />
                  </div>
                  {/* Plus / separator */}
                  <div className="h-8 w-px bg-gray-200 dark:bg-zinc-700" />
                  {/* Talabat logo */}
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700 p-1 bg-white shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Talabat_logo.png/512px-Talabat_logo.png"
                      alt="Talabat"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-center text-sm font-bold text-starbucks-dark dark:text-white mb-1">
                  خدمة التوصيل من ستاربكس متوفرة عبر Talabat
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
                  استمتع بمشروبك المفضل من ستاربكس مع خدمة التوصيل عبر Talabat
                </p>
                <a href={TALABAT_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-full bg-starbucks-green py-6 font-extrabold text-white hover:bg-starbucks-dark transition-all">
                    اطلب الآن
                  </Button>
                </a>
              </div>
            </div>

            {/* Right image */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <img
                  src="https://www.starbucks.eg/assets/image-cache/delivery-hero-ar.jpg"
                  alt="خدمة التوصيل لدى ستاربكس"
                  className="w-full rounded-3xl shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://www.starbucks.eg/assets/image-cache/delivery.jpg'
                  }}
                />
                {/* Overlay badge */}
                <div className="absolute bottom-4 right-4 rounded-xl bg-starbucks-dark/90 backdrop-blur-sm px-4 py-3 text-white shadow-xl">
                  <p className="text-xs font-bold">خدمة التوصيل لدى ستاربكس</p>
                  <a
                    href={TALABAT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs font-extrabold text-starbucks-green underline"
                  >
                    اطلب الآن
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Enjoy at Home Section ─── */}
      <section className="py-16 lg:py-24 border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex flex-col items-center gap-10 lg:flex-row-reverse">
            <div className="flex-1">
              <motion.img
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src="https://www.starbucks.eg/assets/image-cache/delivery-home-ar.jpg"
                alt="استمتع بتجربة ستاربكس في المنزل"
                className="w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://www.starbucks.eg/assets/image-cache/home-delivery.jpg'
                }}
              />
            </div>
            <div className="flex-1 text-right space-y-6">
              <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white lg:text-4xl leading-snug">
                استمتع بتجربة ستاربكس في المنزل
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                الآن يمكنك الاستمتاع بمشروبات ومأكولات ستاربكس المفضلة لديك وأنت في منزلك مع خدمة التوصيل!
              </p>
              <Link to="/our-coffees">
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-starbucks-dark px-10 py-6 font-extrabold text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  تعرّف على المزيد
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-16 lg:py-24 bg-[#f9f9f9] dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-right text-3xl font-extrabold text-starbucks-dark dark:text-white">
            أسئلة شائعة
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-right"
              >
                <h3 className="mb-2 text-base font-extrabold text-starbucks-dark dark:text-white lg:text-lg">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DeliveryPage
