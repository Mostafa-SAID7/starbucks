import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Link } from "react-router-dom";
import { useStatement } from "@/hooks/queries";

import { StatementData } from "@/types/components";

const StatementSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";

  // Fetch statement data using TanStack Query
  const { data: statementData, isLoading, error } = useStatement();

  // Show loading state (minimal skeleton)
  if (isLoading) {
    return (
      <section className="bg-background py-16 transition-colors">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center space-y-4">
            <div className="h-10 w-3/4 mx-auto animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-1/2 mx-auto animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-5/6 mx-auto animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-32 mx-auto animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </section>
    );
  }

  // Show error state (minimal fallback)
  if (error || !statementData) {
    return null; // Gracefully hide section if data fails to load
  }

  const localizedData = (statementData[lang] ||
    statementData.en) as StatementData;

  return (
    <section className="bg-background py-16 transition-colors">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-6 text-3xl font-bold text-starbucks-dark dark:text-foreground-dark md:text-4xl transition-colors">
            {localizedData.title}
          </h2>
          <div className="mb-8 space-y-4 text-center">
            <h4 className="text-xl font-semibold text-starbucks-green">
              {localizedData.subtitle}
            </h4>
            {localizedData.paragraphs.map(
              (paragraph: string, index: number) => (
                <p
                  key={index}
                  className="leading-relaxed text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {paragraph}
                </p>
              ),
            )}
          </div>
          <Link to={`/${lang}${localizedData.ctaLink}`}>
            <Button variant="outline" size="lg">
              {localizedData.ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export { StatementSection };
export default StatementSection;
