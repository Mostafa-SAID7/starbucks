import * as React from "react";
import { Link, useParams } from "react-router-dom";
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
  isRTL?: boolean;
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
      imageAlt = "",
      variant = "default",
      className,
      isRTL = false,
    },
    ref,
  ) => {
    const { lang } = useParams<{ lang: string }>();
    const currentLang = lang || "ar";

    // Add language prefix to internal links
    const finalCtaLink =
      ctaLink && !ctaLink.startsWith("http")
        ? `/${currentLang}${ctaLink}`
        : ctaLink;

    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden min-h-[600px] lg:min-h-[80vh] flex items-center w-full",
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
        aria-label={imageAlt || title}
        role={variant === "default" ? "banner" : "section"}
      >
        {/* Fallback gradient if no image */}
        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-starbucks-green/10 to-transparent" />
        )}

        {/* Remove any blur transition from inside hero - it should be completely outside */}

        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 w-full max-w-7xl">
          <div
            className={cn(
              "flex flex-col max-w-2xl w-full lg:w-1/2",
              isRTL ? "items-end ml-auto" : "items-start mr-auto",
            )}
          >
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6 }}
              className={cn(
                "space-y-6 w-full",
                isRTL ? "text-right" : "text-left",
              )}
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
              {ctaText && finalCtaLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  {finalCtaLink.startsWith("http") ? (
                    <a
                      href={finalCtaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-starbucks-green px-8 py-4 text-lg font-bold text-white shadow-lg shadow-starbucks-green/20 hover:bg-starbucks-dark hover:scale-105 transition-all duration-300 drop-shadow-lg"
                    >
                      {ctaText}
                    </a>
                  ) : (
                    <Link
                      to={finalCtaLink}
                      className="inline-block rounded-full bg-starbucks-green px-8 py-4 text-lg font-bold text-white shadow-lg shadow-starbucks-green/20 hover:bg-starbucks-dark hover:scale-105 transition-all duration-300 drop-shadow-lg"
                    >
                      {ctaText}
                    </Link>
                  )}
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
