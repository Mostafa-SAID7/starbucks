import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, Send, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'

const ContactUsPage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={isRTL ? 'اتصل بنا | ستاربكس' : 'Contact Us | Starbucks'} />

      {/* ─── Hero Split Section ─── */}
      <section className="flex flex-col lg:flex-row min-h-[420px] border-b border-gray-100 dark:border-zinc-800">
        {/* Left — Info */}
        <div className="flex flex-1 flex-col justify-center bg-[#f7f7f7] dark:bg-zinc-950 px-10 py-16 text-right lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-3xl font-black text-starbucks-dark dark:text-white lg:text-4xl"
          >
            {isRTL ? 'هل ترغبون بمعرفة كيفية التواصل معنا؟' : 'Would you like to know how to contact us?'}
          </motion.h1>

          <div className="space-y-5 text-gray-600 dark:text-gray-400">
            <p className="font-bold text-starbucks-dark dark:text-white">
              {isRTL ? 'هل لديكم أي استفسار؟' : 'Do you have any inquiry?'}
            </p>
            <p>
              {isRTL
                ? 'يمكنكم التواصل مع فريق خدمة الزبائن عبر البريد الإلكتروني:'
                : 'You can contact our customer service team by email:'}
            </p>

            <a
              href="mailto:starbucks.mena@alshaya.com"
              className="flex items-center justify-end gap-3 text-starbucks-green font-bold hover:underline underline-offset-4"
            >
              starbucks.mena@alshaya.com
              <Mail className="h-5 w-5" />
            </a>

            <p>
              {isRTL
                ? 'أو عبر صفحاتنا على فيسبوك وانستغرام.'
                : 'Or through our Facebook and Instagram pages.'}
            </p>

            <div className="pt-2">
              <p className="font-bold text-starbucks-dark dark:text-white mb-2">
                {isRTL ? 'اتصلوا بنا على الرقم:' : 'Call us at:'}
              </p>
              <a
                href="tel:0224803822"
                className="flex items-center justify-end gap-3 text-starbucks-green font-bold text-xl hover:underline underline-offset-4"
                dir="ltr"
              >
                02-24803822
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="relative flex-1 min-h-[300px] overflow-hidden lg:max-w-[45%]">
          <img
            src="https://www.starbucks.eg/assets/image-cache/contact-us-hero.jpg"
            alt={isRTL ? 'للتواصل مع فريق ستاربكس' : 'Contact Starbucks Team'}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1561494673-f9e9e9f7a1c3?w=800&q=80'
            }}
          />
          <div className="absolute inset-0 bg-starbucks-dark/40" />
          <div className="absolute bottom-8 right-8 left-8 text-right">
            <p className="mb-3 text-2xl font-black text-white drop-shadow-lg">
              {isRTL ? 'للتواصل مع فريق ستاربكس' : 'Connect with the Starbucks Team'}
            </p>
            <Link
              to="/about-us"
              className="inline-block rounded-full bg-white px-8 py-3 text-sm font-extrabold text-starbucks-dark hover:bg-starbucks-green hover:text-white transition-all shadow-lg"
            >
              {isRTL ? 'اكتشف المزيد' : 'Discover More'}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Contact Form ─── */}
      <section className="py-16 lg:py-24 bg-white dark:bg-black">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="text-right mb-10">
            <h2 className="text-3xl font-extrabold text-starbucks-dark dark:text-white mb-3">
              {isRTL ? 'أرسل لنا رسالة' : 'Send Us a Message'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {isRTL
                ? 'سيقوم فريقنا بالرد على استفساركم في أقرب وقت ممكن.'
                : 'Our team will respond to your inquiry as soon as possible.'}
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-12 text-center"
            >
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-starbucks-green" />
              <h3 className="text-xl font-extrabold text-starbucks-dark dark:text-white mb-2">
                {isRTL ? 'شكراً لتواصلكم معنا!' : 'Thank you for contacting us!'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isRTL
                  ? 'تم استلام رسالتكم بنجاح. سنرد عليكم في أقرب وقت ممكن.'
                  : 'Your message has been received. We will get back to you shortly.'}
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-starbucks-dark dark:text-white">
                    {isRTL ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-starbucks-green focus:ring-2 focus:ring-starbucks-green/20 transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-starbucks-dark dark:text-white">
                    {isRTL ? 'البريد الإلكتروني *' : 'Email *'}
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-starbucks-green focus:ring-2 focus:ring-starbucks-green/20 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-starbucks-dark dark:text-white">
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-starbucks-green focus:ring-2 focus:ring-starbucks-green/20 transition-all"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-starbucks-dark dark:text-white">
                    {isRTL ? 'موضوع الرسالة *' : 'Subject *'}
                  </label>
                  <select
                    required
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 text-gray-800 dark:text-white outline-none focus:border-starbucks-green focus:ring-2 focus:ring-starbucks-green/20 transition-all"
                  >
                    <option value="">{isRTL ? 'اختر الموضوع' : 'Select subject'}</option>
                    <option value="general">{isRTL ? 'استفسار عام' : 'General Inquiry'}</option>
                    <option value="complaint">{isRTL ? 'شكوى' : 'Complaint'}</option>
                    <option value="feedback">{isRTL ? 'اقتراح أو ملاحظة' : 'Feedback / Suggestion'}</option>
                    <option value="delivery">{isRTL ? 'خدمة التوصيل' : 'Delivery Service'}</option>
                    <option value="rewards">{isRTL ? 'برنامج المكافآت' : 'Rewards Program'}</option>
                    <option value="other">{isRTL ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-starbucks-dark dark:text-white">
                  {isRTL ? 'نص الرسالة *' : 'Message *'}
                </label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  className="w-full resize-none rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 px-4 py-3.5 text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-starbucks-green focus:ring-2 focus:ring-starbucks-green/20 transition-all"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-3 rounded-full bg-starbucks-green px-12 py-4 font-extrabold text-white hover:bg-starbucks-dark disabled:opacity-60 transition-all shadow-lg hover:shadow-starbucks-green/30"
                >
                  {loading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {isRTL ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  )
}

export default ContactUsPage
