import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, Phone, Send, CheckCircle } from "lucide-react";
import { SEO, Button, Input, Select, Textarea } from "@/components";
import { useContactInfo } from "@/hooks/queries";
import type { ContactSubjectOption as SubjectOption } from "@/types";

export const ContactUsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = i18n.language === "ar";

  // Fetch contact data using TanStack Query
  const { data: contactData, isLoading, error } = useContactInfo();

  // Type assertion for the data (proper types should be added to fetchers.ts)
  const data = contactData as any;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const textAlignClass = isRTL ? "text-right" : "text-left";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-starbucks-green border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 dark:text-red-400 mb-4">
            {lang === "ar"
              ? "حدث خطأ أثناء تحميل البيانات"
              : "Error loading data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={data.hero.title[lang]} />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div
          className={`flex flex-col lg:flex-row gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Side 1: Sticky Sidebar Image */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] group">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img
                src="/contact-us.webp"
                alt={data.hero.title[lang]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-12 ${textAlignClass}`}
              >
                <h1 className="text-4xl lg:text-6xl font-black text-starbucks-dark dark:text-white mb-6">
                  {data.hero.title[lang]}
                </h1>

                <div className="space-y-8 mt-12">
                  <div className="flex flex-col gap-4">
                    <p className="text-lg font-black text-starbucks-dark dark:text-white">
                      {data.info.inquiry[lang]}
                    </p>
                    <a
                      href={`mailto:${data.info.email}`}
                      className="flex items-center gap-3 text-starbucks-green font-black text-2xl hover:underline underline-offset-8 transition-all w-fit"
                    >
                      <Mail className="h-6 w-6" />
                      {data.info.email}
                    </a>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <p className="text-lg font-black text-starbucks-dark dark:text-white">
                      {data.info.phoneLabel[lang]}
                    </p>
                    <a
                      href={`tel:${data.info.phoneTel}`}
                      className="flex items-center gap-3 text-starbucks-green font-black text-3xl hover:underline underline-offset-8 transition-all w-fit"
                      dir="ltr"
                    >
                      <Phone className="h-7 w-7" />
                      {data.info.phone}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Form Section */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className={`mb-10 ${textAlignClass}`}>
                  <h2 className="text-3xl font-black text-starbucks-dark dark:text-white mb-3">
                    {data.form.title[lang]}
                  </h2>
                  <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
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
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div className="space-y-3">
                        <label
                          className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                        >
                          {data.form.fields.name.label[lang]}
                        </label>
                        <Input
                          required
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder={data.form.fields.name.placeholder[lang]}
                          className="h-14 rounded-2xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <label
                          className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                        >
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
                          className="h-14 rounded-2xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div className="space-y-3">
                        <label
                          className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                        >
                          {data.form.fields.phone.label[lang]}
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder={data.form.fields.phone.placeholder[lang]}
                          dir="ltr"
                          className="h-14 rounded-2xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <label
                          className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                        >
                          {data.form.fields.subject.label[lang]}
                        </label>
                        <Select
                          isRTL={isRTL}
                          options={(data.form.subjects as SubjectOption[]).map(
                            (s) => ({ id: s.id, label: s[lang] }),
                          )}
                          value={form.subject}
                          onChange={(val) =>
                            setForm((prev) => ({ ...prev, subject: val }))
                          }
                          placeholder={
                            data.form.fields.subject.placeholder[lang]
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                      >
                        {data.form.fields.message.label[lang]}
                      </label>
                      <Textarea
                        required
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder={data.form.fields.message.placeholder[lang]}
                        className="rounded-2xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      />
                    </div>

                    <div
                      className={`flex items-center ${isRTL ? "justify-start" : "justify-start"}`}
                    >
                      <Button
                        type="submit"
                        loading={loading}
                        className="h-16 px-16 text-lg font-black rounded-full bg-starbucks-green hover:bg-starbucks-dark text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>{data.form.fields.submit[lang]}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Send
                              className={`h-6 w-6 ${isRTL ? "-rotate-180" : ""}`}
                            />
                            <span>{data.form.fields.submit[lang]}</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
