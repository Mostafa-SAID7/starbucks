import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { cn } from "@/lib/ui";

interface FeaturedCardProps {
  id: string;
  image: string;
  title: string;
  description?: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  imageAlt: string;
  theme?: string;
  index: number;
  lang: string;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  id,
  image,
  title,
  description,
  cta,
  ctaLink,
  secondaryCta,
  secondaryCtaLink,
  imageAlt,
  theme,
  index,
  lang
}) => {
  const isGreenTheme = theme === "Green";

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl flex flex-col",
        isGreenTheme 
          ? "bg-starbucks-card-green-light dark:bg-starbucks-card-green-dark" 
          : "bg-starbucks-card-neutral-light dark:bg-starbucks-card-neutral-dark",
        // Medium screens: Last card (index 4) spans full width (2 columns)
        index === 4 ? "sm:col-span-2" : "",
        // Large screens: First 3 cards span 2 columns each, last 2 cards span 3 columns each
        index <= 2 ? "lg:col-span-2" : "lg:col-span-3"
      )}
    >
      {/* Image Section */}
      <div className="h-64 w-full overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4 text-center">
        <div className="flex-grow">
          <h3 className="mb-2 text-lg font-extrabold text-starbucks-dark dark:text-foreground-dark lg:text-xl">
            {title}
          </h3>
          {description && (
            <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-auto pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-2 border-starbucks-dark px-4 py-2 text-sm font-bold font-branding text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-foreground-dark dark:text-foreground-dark dark:hover:bg-foreground-dark dark:hover:text-black transition-all"
            asChild
          >
            <a
              href={
                ctaLink?.startsWith("http")
                  ? ctaLink
                  : `/${lang}${ctaLink || "#"}`
              }
            >
              {cta}
            </a>
          </Button>

          {secondaryCta && secondaryCtaLink && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-2 border-starbucks-dark px-4 py-2 text-sm font-bold font-branding text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-foreground-dark dark:text-foreground-dark dark:hover:bg-foreground-dark dark:hover:text-black transition-all"
              asChild
            >
              <a
                href={
                  secondaryCtaLink?.startsWith("http")
                    ? secondaryCtaLink
                    : `/${lang}${secondaryCtaLink || "#"}`
                }
              >
                {secondaryCta}
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


