import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  imageAlt?: string;
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
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
      secondaryImageUrl,
      secondaryImageAlt,
      variant = "default",
      className,
      isRTL = false,
    },
    ref,
  ) => {
    const { lang } = useParams<{ lang: string }>();
    const currentLang = lang || "ar";
    const internalRef = React.useRef<HTMLElement>(null);
    const isInView = useInView(internalRef, { once: true, amount: 0 });

    // Use a combined ref approach
    React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    // Add language prefix to internal links
    const finalCtaLink =
      ctaLink && !ctaLink.startsWith("http")
        ? `/${currentLang}${ctaLink}`
        : ctaLink;

    return (
      <section
        ref={internalRef}
        className={cn(
          "relative overflow-hidden min-h-[600px] lg:min-h-[80vh] flex items-start w-full",
          className,
        )}
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%), url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        aria-label={imageAlt || title}
        role={variant === "default" ? "banner" : "section"}
      >
        {/* Secondary Animated Image Layer (e.g., Woman entering) */}
        {secondaryImageUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[10]">
            <motion.div
              initial={{ opacity: 0, x: currentLang === "ar" ? -500 : 500 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: currentLang === "ar" ? -500 : 500 }}
              transition={{ 
                duration: 2.5, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2
              }}
              className={cn(
                "absolute bottom-0 h-[100%] lg:h-[115%] w-auto max-w-none flex items-end",
                currentLang === "ar" ? "left-0" : "right-0"
              )}
            >
              <img 
                src={secondaryImageUrl} 
                alt={secondaryImageAlt || ""} 
                className="h-full w-auto object-contain object-bottom select-none"
              />
            </motion.div>
          </div>
        )}

        {/* Fallback gradient if no image */}
        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-starbucks-green/10 to-transparent" />
        )}

        {/* Remove any blur transition from inside hero - it should be completely outside */}

        <div className="container mx-auto px-4 sm:px-6 pt-28 pb-20 lg:pt-44 lg:pb-32 relative z-10 w-full max-w-7xl">
          <div
            className={cn(
              "flex flex-col max-w-full lg:max-w-2xl w-full lg:w-3/5",
              isRTL ? "items-end ml-auto text-right" : "items-start mr-auto text-left",
            )}
          >
            {/* Optimized Content Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: isRTL ? 30 : -30 }}
              animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 20, x: isRTL ? 30 : -30 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 md:space-y-6 w-full"
            >
              {subtitle && (
                <p className="text-starbucks-gold font-bold tracking-[0.3em] text-xs sm:text-sm uppercase drop-shadow-sm">
                  {subtitle}
                </p>
              )}
              <h1
                className={cn(
                  "text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]",
                  isRTL ? "font-heading" : "font-branding",
                  "text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]",
                )}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={cn(
                    "text-lg sm:text-xl lg:text-2xl text-white/90 max-w-xl font-medium leading-relaxed drop-shadow-md",
                    isRTL ? "font-sans" : "font-sans",
                  )}
                >
                  {description}
                </p>
              )}
              {ctaText && finalCtaLink && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="pt-4 sm:pt-6"
                >
                  {finalCtaLink.startsWith("http") ? (
                    <a
                      href={finalCtaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-starbucks-green px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-starbucks-green/30 hover:bg-starbucks-dark hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                    >
                      {ctaText}
                    </a>
                  ) : (
                    <Link
                      to={finalCtaLink}
                      className="inline-block rounded-full bg-starbucks-green px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-starbucks-green/30 hover:bg-starbucks-dark hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                    >
                      {ctaText}
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Cinematic Branding & Scroll Overlay - Optimized Responsiveness */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-[5] pointer-events-none w-full px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="relative flex items-center justify-center w-full max-w-4xl"
          >
            {/* The Track */}
            <div className="absolute w-[1px] h-20 sm:h-32 bg-transparent overflow-visible">
              <div className="absolute inset-[-10px] sm:inset-[-20px] blur-[20px] bg-starbucks-green/5 rounded-full" />
              
              <motion.div
                animate={{
                  top: ["-10%", "110%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-0 w-full h-1/4 bg-gradient-to-b from-transparent via-starbucks-green to-transparent"
                style={{
                  boxShadow: "0 0 15px 2px rgba(0, 98, 65, 0.8), 0 0 30px 4px rgba(0, 98, 65, 0.4)",
                }}
              />
            </div>

            {/* Massive Branding Text - Fluid & Responsive */}
            <h2 className={cn(
              "relative text-3xl sm:text-6xl md:text-8xl lg:text-[130px] font-black tracking-[0.15em] sm:tracking-[0.2em] text-white/[0.08] uppercase select-none text-center whitespace-nowrap leading-none transition-all duration-700",
              lang === 'ar' ? "font-heading" : "font-branding"
            )}>
              {lang === 'ar' ? 'ستاربكس' : 'STARBUCKS'}
            </h2>
          </motion.div>

          {/* Subtle Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0.15, 0.4, 0.15] } : { opacity: 0 }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              delay: 2.5,
              ease: "easeInOut"
            }}
            className="mt-3 sm:mt-4"
          >
            <span className="text-[9px] sm:text-[11px] font-branding uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/20 whitespace-nowrap">
              {lang === 'ar' ? 'اسحب للأسفل' : 'Scroll'}
            </span>
          </motion.div>
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
