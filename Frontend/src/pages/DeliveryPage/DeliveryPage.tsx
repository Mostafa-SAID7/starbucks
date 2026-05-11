import { useTranslation } from "react-i18next";
import { SEO, QueryErrorBoundary, SidebarTemplate } from "@/components";
import { StaticPageSkeleton } from "@/components/skeletons";
import { useLanguage, useAccordion } from "@/hooks";
import { usePageData } from "@/hooks/queries";
import { type GenericPageData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink } from "lucide-react";

const DeliveryPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslation(["pages", "common"]);
  const { toggleSection, isOpen } = useAccordion("intro");

  const textAlignClass = isRTL ? "text-right" : "text-left";
  const itemsAlignClass = isRTL ? "items-end" : "items-start";

  // ── Derived values from structural data ──────────────────────────────────
  const sidebarMedia =
    typeof data.sidebarImage === "string"
      ? data.sidebarImage
      : (data.sidebarImage as { en?: string; ar?: string } | null)?.en ?? "";

  const isVideo =
    sidebarMedia.includes("player.cloudinary.com") ||
    sidebarMedia.includes("embed");

  const pageTitle = t("pages:delivery.title");

  // Intro paragraphs from i18n
  const introParagraphs = t("pages:delivery.intro.paragraphs", {
    returnObjects: true,
    defaultValue: [],
  }) as string[];

  // Accordion from i18n
  const accordionTitle = t("pages:delivery.accordion.title", {
    defaultValue: "",
  });

  return (
    <div
      className="bg-white dark:bg-background-dark min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SEO title={pageTitle} />

      <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl">
        <SidebarTemplate image={sidebarMedia} title={pageTitle} isVideo={isVideo}>
          <div className="max-w-4xl">
            {/* Page title (shown when hideMainTitle is false) */}
            {!data.hideMainTitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-12 ${textAlignClass}`}
              >
                <h1 className="text-4xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  {pageTitle}
                </h1>
              </motion.div>
            )}

            <div className="space-y-12">
              {/* ── Intro accordion ── */}
              <div className="border-b border-gray-100 dark:border-white/10 pb-16 mb-4">
                <button
                  onClick={() => toggleSection("intro")}
                  className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                >
                  <div className={`flex flex-col ${itemsAlignClass} grow`}>
                    <span className="text-starbucks-green font-black text-xs uppercase tracking-widest mb-3 opacity-80">
                      {t("common:overview")}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight tracking-tight">
                      {pageTitle}
                    </h3>
                  </div>
                  <div className="text-starbucks-green bg-starbucks-green/5 dark:bg-white/5 p-4 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                    {isOpen("intro") ? (
                      <Minus size={24} strokeWidth={3} />
                    ) : (
                      <Plus size={24} strokeWidth={3} />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen("intro") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`pt-10 space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                      >
                        {Array.isArray(introParagraphs) &&
                          introParagraphs.map((p, idx) => (
                            <p key={idx} className="font-medium opacity-90">
                              {p}
                            </p>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Sections (partners, how-it-works, …) ── */}
              <div className="space-y-20">
                {data.sections.map((section, index) => {
                  const sTitle = t(
                    `pages:delivery.sections.${section.id}.title`,
                    { defaultValue: "" }
                  );
                  const sSubtitle = t(
                    `pages:delivery.sections.${section.id}.subtitle`,
                    { defaultValue: "" }
                  );
                  const sParagraphs = t(
                    `pages:delivery.sections.${section.id}.paragraphs`,
                    { returnObjects: true, defaultValue: [] }
                  ) as string[];
                  const sList = t(
                    `pages:delivery.sections.${section.id}.list`,
                    { returnObjects: true, defaultValue: [] }
                  ) as string[];
                  const sCta = t(
                    `pages:delivery.sections.${section.id}.cta`,
                    { defaultValue: "" }
                  );

                  const sectionImage =
                    typeof section.image === "string" ? section.image : "";
                  const ctaLink =
                    typeof section.ctaLink === "string" ? section.ctaLink : "";

                  return (
                    <div
                      key={section.id}
                      className={`pb-12 ${
                        index !== data.sections.length - 1
                          ? "border-b border-gray-100 dark:border-white/10"
                          : ""
                      }`}
                    >
                      {sectionImage && (
                        <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video lg:aspect-[21/9] border border-gray-100 dark:border-white/5">
                          <img
                            src={sectionImage}
                            alt={sTitle}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex items-center justify-between group gap-6 ${textAlignClass}`}
                      >
                        <div className={`flex flex-col ${itemsAlignClass} grow`}>
                          {sSubtitle && (
                            <span className="text-starbucks-green font-black text-xs uppercase tracking-widest mb-3 opacity-80">
                              {sSubtitle}
                            </span>
                          )}
                          <h3 className="text-2xl lg:text-4xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors leading-tight tracking-tight">
                            {sTitle}
                          </h3>
                        </div>
                        <div className="text-starbucks-green bg-starbucks-green/5 dark:bg-white/5 p-4 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                          {isOpen(section.id) ? (
                            <Minus size={24} strokeWidth={3} />
                          ) : (
                            <Plus size={24} strokeWidth={3} />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen(section.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div
                              className={`pt-10 space-y-10 text-xl text-gray-600 dark:text-gray-300 leading-relaxed ${textAlignClass}`}
                            >
                              {Array.isArray(sParagraphs) &&
                                sParagraphs.map((p, pIdx) => (
                                  <p key={pIdx} className="opacity-90">
                                    {p}
                                  </p>
                                ))}

                              {Array.isArray(sList) && sList.length > 0 && (
                                <ul
                                  className={`space-y-6 ${
                                    isRTL
                                      ? "border-r-4 pr-8"
                                      : "border-l-4 pl-8"
                                  } border-starbucks-green/20 font-medium`}
                                >
                                  {sList.map((item, lIdx) => (
                                    <li key={lIdx} className="opacity-90">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {sCta && ctaLink && (
                                <div className="pt-6">
                                  <a
                                    href={ctaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-4 bg-starbucks-green text-white px-10 py-5 rounded-full font-black text-xl hover:bg-white hover:text-starbucks-green border-2 border-starbucks-green transition-all transform hover:scale-105 shadow-2xl"
                                  >
                                    {sCta}
                                    <ExternalLink size={24} strokeWidth={3} />
                                  </a>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* ── FAQ Accordion ── */}
              {data.accordion && (
                <div className="mt-12 pt-20 border-t-4 border-starbucks-green/10">
                  <h2
                    className={`text-3xl lg:text-5xl font-black text-starbucks-dark dark:text-white mb-16 tracking-tight ${textAlignClass}`}
                  >
                    {accordionTitle}
                  </h2>
                  <div className="space-y-8">
                    {data.accordion.items?.map((_item, idx) => {
                      const itemTitle = t(
                        `pages:delivery.accordion.items.${idx}.title`,
                        { defaultValue: "" }
                      );
                      const itemContent = t(
                        `pages:delivery.accordion.items.${idx}.content`,
                        { defaultValue: "" }
                      );
                      return (
                        <div
                          key={idx}
                          className="bg-gray-50 dark:bg-white/5 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5"
                        >
                          <button
                            onClick={() => toggleSection(`faq-${idx}`)}
                            className={`w-full p-10 flex items-center justify-between text-left group ${
                              isRTL ? "text-right" : ""
                            }`}
                          >
                            <span className="text-2xl font-black text-starbucks-dark dark:text-white group-hover:text-starbucks-green transition-colors tracking-tight">
                              {itemTitle}
                            </span>
                            <div className="text-starbucks-green group-hover:scale-125 transition-transform shrink-0">
                              {isOpen(`faq-${idx}`) ? (
                                <Minus size={24} strokeWidth={3} />
                              ) : (
                                <Plus size={24} strokeWidth={3} />
                              )}
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen(`faq-${idx}`) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                <div
                                  className={`px-10 pb-10 text-xl text-gray-600 dark:text-gray-300 leading-relaxed opacity-90 ${textAlignClass}`}
                                >
                                  {itemContent}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SidebarTemplate>
      </div>
    </div>
  );
};

export const DeliveryPage = () => {
  const { data: pageData, isLoading } = usePageData("delivery");

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {pageData && <DeliveryPageContent data={pageData as GenericPageData} />}
    </QueryErrorBoundary>
  );
};

export default DeliveryPage;
