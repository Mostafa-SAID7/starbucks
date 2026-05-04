import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface BannerProps {
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  imageUrl?: string
  imageAlt?: string
  variant?: "default" | "reverse"
  className?: string
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ 
    title, 
    subtitle, 
    description, 
    ctaText, 
    ctaLink, 
    imageUrl, 
    imageAlt, 
    variant = "default",
    className 
  }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-starbucks-green/10 to-transparent",
          className
        )}
      >
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className={cn(
            "flex flex-col items-center gap-12 lg:flex-row",
            variant === "reverse" ? "lg:flex-row-reverse" : ""
          )}>
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left space-y-6 max-w-2xl"
            >
              {subtitle && (
                <span className="inline-block text-sm font-bold uppercase tracking-widest text-starbucks-green">
                  {subtitle}
                </span>
              )}
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              )}
              {ctaText && ctaLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <a
                    href={ctaLink}
                    className="inline-block rounded-full bg-starbucks-green px-8 py-4 text-lg font-bold text-white shadow-lg shadow-starbucks-green/20 hover:bg-starbucks-dark hover:scale-105 transition-all duration-300"
                  >
                    {ctaText}
                  </a>
                </motion.div>
              )}
            </motion.div>

            {/* Image */}
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 max-w-lg"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={imageUrl}
                    alt={imageAlt || title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-starbucks-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-starbucks-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>
    )
  }
)

Banner.displayName = "Banner"