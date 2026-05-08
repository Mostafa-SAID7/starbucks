import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Send, CheckCircle } from "lucide-react";
import { SEO, Button, Input, Select, Textarea } from "@/components";
import { useContactInfo } from "@/hooks/queries";
import { ContactUsData as ContactData } from "@/types/pages";

export const ContactUsPage: React.FC = () => {
  const { t, i18n } = useTranslation(["pages", "common"]);
  const isRTL = i18n.language === "ar";
  
  // Fetch contact data using TanStack Query
  const { data: contactData, isLoading, error } = useContactInfo();
  
  // Type assertion for the data
  const data = contactData as ContactData;

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
  const itemsAlignClass = isRTL ? "items-end" : "items-start";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-starbucks-green border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {t("common:status.loading", { defaultValue: "Loading..." })}
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
            {t("common:status.error", { defaultValue: "Error loading data" })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white dark:bg-black transition-colors duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={t("pages:contact.hero.title")} />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Side 1: Sticky Sidebar Image - Matches Sustainability Design */}
          <div className="lg:w-[40%] lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)] group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <img
                src="/contact-us.webp"
                alt={t("pages:contact.hero.image_alt")}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>

          {/* Side 2: Content Column */}
          <div className="lg:w-[60%]">
            <div className="max-w-4xl mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-16 ${textAlignClass}`}
              >
                <h1 className="text-5xl lg:text-7xl font-black text-starbucks-dark dark:text-white mb-8 leading-tight">
                  {t("pages:contact.hero.title")}
                </h1>

                <div className={`flex flex-col gap-10 mt-12 ${itemsAlignClass}`}>
                  <div className={`flex flex-col gap-3 ${itemsAlignClass}`}>
                    <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      {t("pages:contact.info.inquiry")}
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
                      {t("pages:contact.info.phone_label")}
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

              {/* Form Section */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 dark:bg-white/5 rounded-[3rem] p-8 lg:p-16 shadow-sm border border-gray-100 dark:border-white/10"
              >
                <div className={`mb-12 ${textAlignClass}`}>
                  <h2 className="text-4xl font-black text-starbucks-dark dark:text-white mb-4">
                    {t("pages:contact.form.title")}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                    {t("pages:contact.form.subtitle")}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[2rem] bg-starbucks-green/5 border border-starbucks-green/20 p-12 text-center"
                    >
                      <div className="bg-starbucks-green text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-black text-starbucks-dark dark:text-white mb-3">
                        {t("pages:contact.form.success.title")}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t("pages:contact.form.success.message")}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-10">
                      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                        <div className="space-y-4">
                          <label
                            className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                          >
                            {t("pages:contact.form.fields.name.label")}
                          </label>
                          <Input
                            required
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t("pages:contact.form.fields.name.placeholder")}
                            className="h-16 text-lg rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />
                        </div>
                        <div className="space-y-4">
                          <label
                            className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                          >
                            {t("pages:contact.form.fields.email.label")}
                          </label>
                          <Input
                            required
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder={t("pages:contact.form.fields.email.placeholder")}
                            dir="ltr"
                            className="h-16 text-lg rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                        <div className="space-y-4">
                          <label
                            className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                          >
                            {t("pages:contact.form.fields.phone.label")}
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder={t("pages:contact.form.fields.phone.placeholder")}
                            dir="ltr"
                            className="h-16 text-lg rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />
                        </div>
                        <div className="space-y-4">
                          <label
                            className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                          >
                            {t("pages:contact.form.fields.subject.label")}
                          </label>
                          <Select
                            isRTL={isRTL}
                            options={(data.form.subjects as string[]).map(
                              (sId) => ({ id: sId, label: t(`pages:contact.form.subjects.${sId}`) }),
                            )}
                            value={form.subject}
                            onChange={(val) =>
                              setForm((prev) => ({ ...prev, subject: val }))
                            }
                            placeholder={t("pages:contact.form.fields.subject.placeholder")}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label
                          className={`block text-lg font-black text-starbucks-dark dark:text-white px-2 ${textAlignClass}`}
                        >
                          {t("pages:contact.form.fields.message.label")}
                        </label>
                        <Textarea
                          required
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={6}
                          placeholder={t("pages:contact.form.fields.message.placeholder")}
                          className="text-lg rounded-2xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
                        />
                      </div>

                      <div className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
                        <Button
                          type="submit"
                          loading={loading}
                          className="h-16 px-16 text-xl font-black rounded-full bg-starbucks-green hover:bg-starbucks-dark text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                        >
                          {loading ? (
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span>{t("pages:contact.form.fields.submit")}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Send
                                  className={`h-6 w-6 ${isRTL ? "rotate-180" : ""}`}
                              />
                              <span>{t("pages:contact.form.fields.submit")}</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
