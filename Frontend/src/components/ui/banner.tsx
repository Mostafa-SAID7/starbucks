import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/ui";

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
      className,
      isRTL: isRTLProp,
    },
    ref,
  ) => {
    const { lang } = useParams<{ lang: string }>();
    const currentLang = lang || "ar";
    const isRTL = isRTLProp ?? currentLang === "ar";
    
    const internalRef = React.useRef<HTMLElement>(null);
    const isInView = useInView(internalRef, { once: true, amount: 0.1 });

    React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    const finalCtaLink =
      ctaLink && !ctaLink.startsWith("http")
        ? `/${currentLang}${ctaLink}`
        : ctaLink;

    return (
      <section
        ref={internalRef}
        className={cn(
          "relative overflow-hidden min-h-[650px] lg:min-h-[85vh] flex items-start w-full",
          className,
        )}
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%), url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        aria-label={imageAlt || title}
      >
        {/* Secondary Animated Image Layer */}
        {secondaryImageUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[10] select-none">
            <motion.div
              initial={{ opacity: 0, x: currentLang === "ar" ? -500 : 500, scale: 1.05 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: currentLang === "ar" ? -500 : 500, scale: 1.05 }}
              transition={{ 
                duration: 2.2, 
                ease: [0.19, 1, 0.22, 1],
                delay: 0.1
              }}
              className={cn(
                "absolute bottom-0 h-full lg:h-[110%] w-auto max-w-none flex items-end will-change-transform translate-z-0",
                currentLang === "ar" ? "left-0" : "right-0"
              )}
            >
              <img 
                src={secondaryImageUrl} 
                alt={secondaryImageAlt || ""} 
                className="h-full w-auto object-contain object-bottom"
                loading="eager"
              />
            </motion.div>
          </div>
        )}

        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-starbucks-green/20 via-black to-black" />
        )}

        <div className="container mx-auto px-6 pt-32 pb-20 lg:pt-44 lg:pb-32 relative z-20 w-full max-w-7xl">
          <div
            className={cn(
              "flex flex-col w-full lg:w-[85%] xl:w-[75%] transition-all duration-1000",
              isRTL ? "items-end ml-auto text-right" : "items-start mr-auto text-left",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="space-y-6 md:space-y-8 w-full">
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "text-starbucks-gold font-bold text-[10px] sm:text-xs uppercase drop-shadow-md",
                    isRTL ? "tracking-normal" : "tracking-[0.4em]"
                  )}
                >
                  {subtitle}
                </motion.p>
              )}
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={cn(
                  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] text-white drop-shadow-2xl",
                  isRTL ? "font-heading" : "font-branding"
                )}
              >
                {title}
              </motion.h1>

              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl font-medium leading-relaxed drop-shadow-lg"
                >
                  {description}
                </motion.p>
              )}

              {ctaText && finalCtaLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="pt-4 sm:pt-8"
                >
                  {finalCtaLink.startsWith("http") ? (
                    <a
                      href={finalCtaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-starbucks-green hover:bg-starbucks-dark text-white px-10 py-4 sm:px-12 sm:py-5 text-base sm:text-lg font-black uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,112,74,0.3)] hover:shadow-[0_20px_60px_rgba(0,112,74,0.5)]"
                    >
                      {ctaText}
                    </a>
                  ) : (
                    <Link
                      to={finalCtaLink}
                      className="inline-flex items-center justify-center rounded-full bg-starbucks-green hover:bg-starbucks-dark text-white px-10 py-4 sm:px-12 sm:py-5 text-base sm:text-lg font-black uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,112,74,0.3)] hover:shadow-[0_20px_60px_rgba(0,112,74,0.5)]"
                    >
                      {ctaText}
                    </Link>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Branding Overlay */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center z-[5] pointer-events-none px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="relative flex items-center justify-center w-full"
          >
            <h2 className={cn(
              "text-4xl sm:text-7xl md:text-9xl lg:text-[180px] font-black select-none text-center whitespace-nowrap transition-all duration-1000",
              isRTL ? "font-heading tracking-normal text-white/20 leading-normal" : "font-branding tracking-[0.2em] text-white/25 leading-none uppercase",
            )}>
              {currentLang === 'ar' ? 'ستاربكس' : 'STARBUCKS'}
            </h2>
          </motion.div>
        </div>

        {!imageUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-starbucks-green/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-starbucks-green/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </div>
        )}
      </section>
    );
  },
);

Banner.displayName = "Banner";


