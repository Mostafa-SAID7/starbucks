import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/ui';
import { useLanguage } from '@/hooks';

interface SidebarTemplateProps {
  children?: React.ReactNode;
  /** URL of the sidebar image */
  image?: string;
  /** When true, `image` is treated as an embed iframe URL (e.g. Cloudinary video) */
  isVideo?: boolean;
  title?: string;
  overlay?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
}

/**
 * Premium Sidebar Template — Sticky Sidebar
 *
 * HOW STICKY WORKS (the non-obvious part)
 * ─────────────────────────────────────────
 * `position: sticky` stays "stuck" only while its PARENT element is scrolling
 * past. The parent must be taller than the sticky element so there is room to
 * travel. The calculation:
 *
 *   sticky element height  = calc(100vh - 7rem) ≈ 521 px (at 633 px viewport)
 *   content column height  ≈ 1 800 px (menu list, sections, etc.)
 *   travel room needed     = 1 800 - 521 = 1 279 px  ✓
 *
 * To make the sidebar column as tall as the content column we MUST NOT use
 * `items-start` on the flex row. Default flex alignment is `stretch`, which
 * makes both flex children the same height (= the tallest child = content col).
 * This is exactly what we need.
 *
 * If you add `items-start`, the sidebar column height collapses to ~521 px
 * (its natural height). The sticky element fills the column exactly, so the
 * parent's bottom == the element's bottom from the very first scroll pixel —
 * sticky fires and immediately un-sticks. The sidebar appears to scroll away.
 *
 * RTL: `lg:flex-row-reverse` moves the sidebar to the right side.
 * Parallax: window.scrollY drives the image since the window is the scroll container.
 */
export const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  children,
  image,
  isVideo = false,
  title,
  overlay,
  className,
  imageClassName,
  containerClassName,
}) => {
  const { isRTL } = useLanguage();

  // ── Parallax (images only) ────────────────────────────────────────────────
  // We use window.scrollY because MainLayout removed overflow-y-auto from
  // <main>; the window is therefore the real scroll container.
  const rawScroll = useMotionValue(0);
  // 35 px max travel keeps the image inside its oversized bounding box.
  const parallaxY = useTransform(rawScroll, [0, 800], [0, 35]);

  useEffect(() => {
    if (isVideo) return;
    const onScroll = () => rawScroll.set(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [rawScroll, isVideo]);

  // ── Sidebar column ────────────────────────────────────────────────────────
  const sidebarColumn = (
    <div className="lg:w-[42%] xl:w-[40%]">
      {/*
        The sticky wrapper must have an explicit viewport-relative height so it
        fills the screen without overflowing it.
          top-24 = 6 rem = 96 px  →  matches desktop navbar height (h-24).
          h-[calc(100vh-7rem)]  →  fills remaining viewport below the navbar.

        This element sticks for as long as there is room in its parent
        (the sidebar column, which has been stretched to match the content
        column by the default flex `stretch` alignment on the row container).
      */}
      <div className="lg:sticky lg:top-24 h-64 lg:h-[calc(100vh-7rem)] group">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative h-full overflow-hidden rounded-[2.5rem]',
            'bg-gray-200 dark:bg-zinc-900',
            'shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)]',
            'border border-white/10 dark:border-zinc-700/40',
            className
          )}
        >
          {/* ── Video embed (Cloudinary, YouTube, etc.) ── */}
          {isVideo && image && (
            <iframe
              src={image}
              title={title ?? 'Sidebar video'}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          )}

          {/* ── Parallax image ── */}
          {!isVideo && image && (
            <motion.img
              style={{ y: parallaxY }}
              src={image}
              alt={title ?? 'Sidebar'}
              loading="lazy"
              className={cn(
                // h-[125%] / -top-[12%]: 12 % buffer top + 13 % buffer bottom.
                // At 35 px max parallax travel this never reveals the bg.
                'absolute inset-0 w-full h-[125%] -top-[12%] object-cover',
                'will-change-transform transition-transform duration-700',
                'group-hover:scale-[1.04]',
                imageClassName
              )}
            />
          )}

          {/* ── Gradient overlay (images only) ── */}
          {!isVideo && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/6 to-transparent pointer-events-none" />
            </>
          )}

          {/* ── Title + CTA overlay ── */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-end pb-10 px-8 text-center text-white z-10',
              isVideo && !title && !overlay && 'hidden'
            )}
          >
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.55 }}
                className="text-3xl lg:text-4xl xl:text-5xl font-black mb-6 drop-shadow-2xl leading-tight tracking-tight"
              >
                {title}
              </motion.h2>
            )}
            {overlay && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5 }}
                className="w-full"
              >
                {overlay}
              </motion.div>
            )}
          </div>

          {/* ── Inner hairline border ── */}
          <div className="absolute inset-4 border border-white/10 rounded-[2rem] pointer-events-none" />

          {/* ── Corner accent marks ── */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-white/25 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-white/25 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-white/25 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-white/25 rounded-br-xl pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );

  const contentColumn = (
    <div className="lg:w-[58%] xl:w-[60%] min-w-0 py-4">
      {children}
    </div>
  );

  return (
    <div
      className={cn(
        // NO items-start here — default `stretch` is required.
        // stretch makes the sidebar column grow to match the content column
        // height, giving the sticky element the full page height to travel in.
        'flex flex-col lg:flex-row gap-8 lg:gap-12',
        // RTL: sidebar column moves to the right
        isRTL && 'lg:flex-row-reverse',
        containerClassName
      )}
    >
      {sidebarColumn}
      {contentColumn}
    </div>
  );
};

export default SidebarTemplate;
