import { useTranslation } from "react-i18next";
import { LiveRegionProps } from "@/types/components";

/**
 * Live Region Component for Screen Reader Announcements
 *
 * Provides accessible announcements for dynamic content changes
 *
 * Usage:
 * ```tsx
 * <LiveRegion message="Loading menu data" politeness="polite" />
 * ```
 */
export function LiveRegion({
  message,
  politeness = "polite",
  atomic = true,
  relevant = "additions",
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Loading Announcement Component
 * Announces loading states to screen readers
 */
export function LoadingAnnouncement({ isLoading }: { isLoading: boolean }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  if (!isLoading) return null;

  return (
    <LiveRegion
      message={lang === "ar" ? "جاري التحميل..." : "Loading..."}
      politeness="polite"
    />
  );
}

/**
 * Error Announcement Component
 * Announces errors to screen readers
 */
export function ErrorAnnouncement({ error }: { error: Error | null }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  if (!error) return null;

  return (
    <LiveRegion
      message={
        lang === "ar"
          ? "حدث خطأ. يرجى المحاولة مرة أخرى."
          : "An error occurred. Please try again."
      }
      politeness="assertive"
    />
  );
}

/**
 * Success Announcement Component
 * Announces successful actions to screen readers
 */
export function SuccessAnnouncement({ message }: { message?: string }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  if (!message) return null;

  return (
    <LiveRegion
      message={message || (lang === "ar" ? "تم بنجاح" : "Success")}
      politeness="polite"
    />
  );
}

export default LiveRegion;
