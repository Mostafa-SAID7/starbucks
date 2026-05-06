import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import { featuredCards } from "@/data";

interface CardData {
  id: string;
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
  theme: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
}

export function FeaturedCards() {
  const { i18n } = useTranslation();
  const lang = i18n.language as keyof typeof featuredCards;
  const localizedData = featuredCards[lang] || featuredCards.en;

  return (
    <section className="py-12 relative overflow-hidden bg-white dark:bg-black transition-colors">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-starbucks-green/5 via-transparent to-starbucks-green/10 dark:from-starbucks-green/10 dark:via-transparent dark:to-starbucks-green/5 animate-gradient-shift"></div>

      {/* Animated Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-starbucks-green/10 dark:bg-starbucks-green/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-starbucks-green/5 dark:bg-starbucks-green/15 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-starbucks-green/8 dark:bg-starbucks-green/12 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Animated Dots/Points */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-starbucks-green/40 dark:bg-starbucks-green/60 rounded-full animate-ping-slow"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-starbucks-green/30 dark:bg-starbucks-green/50 rounded-full animate-bounce-slow"></div>
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-starbucks-green/40 dark:bg-starbucks-green/60 rounded-full animate-ping-slower"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-starbucks-green/35 dark:bg-starbucks-green/55 rounded-full animate-float-dot"></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-starbucks-green/30 dark:bg-starbucks-green/50 rounded-full animate-pulse-slower"></div>
      <div className="absolute top-1/4 left-2/3 w-2 h-2 bg-starbucks-green/40 dark:bg-starbucks-green/60 rounded-full animate-twinkle"></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-starbucks-green/35 dark:bg-starbucks-green/55 rounded-full animate-twinkle-delayed"></div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {localizedData.cards.map((card: CardData, index: number) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl flex flex-col ${
                card.theme === "Green"
                  ? "bg-[#d4e9e2] dark:bg-[#1e3932]"
                  : "bg-[#f2f0eb] dark:bg-[#2d2926]"
              } ${
                // Medium screens: Last card (index 4) spans full width (2 columns)
                index === 4 ? "sm:col-span-2" : ""
              } ${
                // Large screens: First 3 cards span 2 columns each (2*3=6), last 2 cards span 3 columns each (3*2=6)
                index <= 2 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            >
              {/* Image Section */}
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow p-4 text-center">
                <div className="flex-grow">
                  <h3 className="mb-2 text-lg font-extrabold text-starbucks-dark dark:text-foreground-dark lg:text-xl">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3">
                      {card.description}
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
                    <a href={card.ctaLink}>{card.cta}</a>
                  </Button>

                  {card.secondaryCta && card.secondaryCtaLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-2 border-starbucks-dark px-4 py-2 text-sm font-bold font-branding text-starbucks-dark hover:bg-starbucks-dark hover:text-white dark:border-foreground-dark dark:text-foreground-dark dark:hover:bg-foreground-dark dark:hover:text-black transition-all"
                      asChild
                    >
                      <a href={card.secondaryCtaLink}>{card.secondaryCta}</a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedCardsSkeleton() {
  return (
    <section className="py-12 dark:bg-black transition-colors">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 shadow-lg flex flex-col ${
                // Medium screens: Last card (index 4) spans full width (2 columns)
                i === 4 ? "sm:col-span-2" : ""
              } ${
                // Large screens: First 3 cards span 2 columns each, last 2 cards span 3 columns each
                i <= 2 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            >
              {/* Image Skeleton */}
              <div className="h-48 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />

              {/* Content Skeleton */}
              <div className="flex flex-col flex-grow p-4">
                <div className="flex-grow">
                  <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 mx-auto" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="mb-4 h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 mx-auto" />
                </div>
                <div className="mt-auto pt-4">
                  <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
