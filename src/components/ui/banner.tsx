import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  imageAlt?: string;
  variant?: "default" | "reverse";
  className?: string;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      title,
      subtitle,
      description,
      ctaText,
      ctaLink,
      imageUrl,
      imageAlt,
      variant = "default",
      className,
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden min-h-[70vh] lg:min-h-[80vh] flex items-center w-full",
          className,
        )}
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      >
        {/* Fallback gradient if no image */}
        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-starbucks-green/10 to-transparent" />
        )}

        {/* Smooth blur transition at bottom for both modes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-zinc-950 via-white/70 dark:via-zinc-950/70 to-transparent backdrop-blur-[2px] z-20"
        />

        <div className="container mx-auto px-6 py-16 lg:py-32 relative z-10 w-full">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {subtitle && (
                <span
                  className={cn(
                    "inline-block text-sm font-bold uppercase tracking-widest",
                    imageUrl ? "text-white/90" : "text-starbucks-green",
                  )}
                >
                  {subtitle}
                </span>
              )}
              <h1
                className={cn(
                  "text-4xl lg:text-6xl xl:text-7xl font-black leading-tight",
                  imageUrl
                    ? "text-white drop-shadow-lg"
                    : "text-gray-900 dark:text-white",
                )}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={cn(
                    "text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto",
                    imageUrl
                      ? "text-white/90 drop-shadow-md"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {description}
                </p>
              )}
              {ctaText && ctaLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <a
                    href={ctaLink}
                    className="inline-block rounded-full bg-starbucks-green px-8 py-4 text-lg font-bold text-white shadow-lg shadow-starbucks-green/20 hover:bg-starbucks-dark hover:scale-105 transition-all duration-300 drop-shadow-lg"
                  >
                    {ctaText}
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Decorative elements - only show if no background image */}
        {!imageUrl && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-starbucks-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-starbucks-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </>
        )}
      </section>
    );
  },
);

Banner.displayName = "Banner";
