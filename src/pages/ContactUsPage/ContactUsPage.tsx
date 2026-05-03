import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, Send, CheckCircle } from 'lucide-react'
import { SEO, Button, Input, Select, Textarea } from '@/components'
import { contactUs as data } from '@/data'
import type { ContactSubjectOption as SubjectOption } from '@/types'

export const ContactUsPage: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
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
      <SEO title={data.hero.title[lang]} />

      {/* ─── Hero Split Section ─── */}
      <section className="flex flex-col min-h-[450px] border-b border-gray-100 dark:border-zinc-800 lg:flex-row">
        {/* Info Side */}
        <div className="flex flex-1 flex-col justify-center bg-[#f7f7f7] dark:bg-zinc-950 px-10 py-16 lg:px-20 text-start">
          <motion.h1
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 text-4xl font-black text-starbucks-dark dark:text-white lg:text-5xl"
          >
            {data.hero.title[lang]}
          </motion.h1>

          <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg">
            <p className="font-extrabold text-starbucks-dark dark:text-white">
              {data.info.inquiry[lang]}
            </p>
            
            <div className="flex flex-col gap-4 items-start">
              <p className="opacity-70">{data.info.emailLabel[lang]}</p>
              <a
                href={`mailto:${data.info.email}`}
                className="flex items-center gap-3 text-starbucks-green font-black text-2xl hover:underline underline-offset-8 transition-all flex-row"
              >
                <Mail className="h-6 w-6" />
                {data.info.email}
              </a>
            </div>

            <div className="flex flex-col gap-4 pt-4 items-start">
              <p className="font-extrabold text-starbucks-dark dark:text-white">
                {data.info.phoneLabel[lang]}
              </p>
              <a
                href={`tel:${data.info.phoneTel}`}
                className="flex items-center gap-3 text-starbucks-green font-black text-3xl hover:underline underline-offset-8 transition-all flex-row"
                dir="ltr"
              >
                <Phone className="h-7 w-7" />
                {data.info.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="relative flex-1 min-h-[350px] overflow-hidden lg:max-w-[45%]">
          <img
            src={data.hero.image}
            alt={data.hero.imageAlt[lang]}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            onError={(e) => {
              if (data.hero.fallbackImage) (e.target as HTMLImageElement).src = data.hero.fallbackImage
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-starbucks-dark/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 px-10 w-full text-start inset-inline-start-0">
            <p className="mb-4 text-3xl font-black text-white drop-shadow-2xl">
              {data.hero.imageAlt[lang]}
            </p>
            <Link
              to="/about-us"
              className="inline-block rounded-full bg-starbucks-green px-10 py-4 text-base font-black text-white hover:bg-white hover:text-starbucks-dark transition-all shadow-2xl transform hover:-translate-y-1"
            >
              {isRTL ? 'اكتشف المزيد' : 'Discover More'}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Contact Form ─── */}
      <section className="py-20 lg:py-32 bg-white dark:bg-black">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-16 text-start">
            <h2 className="text-4xl font-black text-starbucks-dark dark:text-white mb-4">
              {data.form.title[lang]}
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
              {data.form.subtitle[lang]}
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
                {data.form.success.title[lang]}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {data.form.success.message[lang]}
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-lg font-black text-starbucks-dark dark:text-white px-2">
                    {data.form.fields.name.label[lang]}
                  </label>
                  <Input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={data.form.fields.name.placeholder[lang]}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-lg font-black text-starbucks-dark dark:text-white px-2">
                    {data.form.fields.email.label[lang]}
                  </label>
                  <Input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={data.form.fields.email.placeholder[lang]}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-lg font-black text-starbucks-dark dark:text-white px-2">
                    {data.form.fields.phone.label[lang]}
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={data.form.fields.phone.placeholder[lang]}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-lg font-black text-starbucks-dark dark:text-white px-2">
                    {data.form.fields.subject.label[lang]}
                  </label>
                  <Select
                    isRTL={isRTL}
                    options={(data.form.subjects as SubjectOption[]).map(s => ({ id: s.id, label: s[lang] }))}
                    value={form.subject}
                    onChange={(val) => setForm(prev => ({ ...prev, subject: val }))}
                    placeholder={data.form.fields.subject.placeholder[lang]}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-black text-starbucks-dark dark:text-white px-2">
                  {data.form.fields.message.label[lang]}
                </label>
                <Textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder={data.form.fields.message.placeholder[lang]}
                />
              </div>

              <div className="flex items-center justify-start">
                <Button
                  type="submit"
                  loading={loading}
                  className="h-16 px-16 text-lg rounded-full shadow-2xl hover:shadow-starbucks-green/40 transform hover:-translate-y-1 transition-all"
                  leftIcon={!loading ? <Send className="h-6 w-6 rtl:-rotate-180" /> : undefined}
                >
                  {data.form.fields.submit[lang]}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  )
}

export default ContactUsPage
