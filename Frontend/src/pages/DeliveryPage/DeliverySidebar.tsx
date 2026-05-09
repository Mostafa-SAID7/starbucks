import { motion } from "framer-motion";
import type { LocalizedText } from "@/types";

interface DeliverySidebarProps {
  sidebarMedia: string;
  title: LocalizedText | string | null | undefined;
  isRTL: boolean;
}

/**
 * Delivery Page Sidebar Component
 * Displays hero image with overlay and CTA buttons
 */
export const DeliverySidebar: React.FC<DeliverySidebarProps> = ({
  sidebarMedia,
  title,
  isRTL,
}) => {
  const isVideo =
    sidebarMedia?.includes("player.cloudinary.com") ||
    sidebarMedia?.includes("embed");

  return (
    <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full rounded-3xl overflow-hidden shadow-2xl bg-black relative"
      >
        {isVideo ? (
          <div className="w-full h-full relative pointer-events-none">
            <div className="absolute inset-0 z-10 bg-transparent" />
            <iframe
              src={sidebarMedia}
              className="w-full h-full absolute inset-0 border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Starbucks Delivery Promo"
            />
          </div>
        ) : (
          <img
            src={sidebarMedia}
            alt={typeof title === "string" ? title : "Delivery"}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>
    </div>
  );
};

export default DeliverySidebar;
