import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { WifiOff, Wifi } from "lucide-react";

/**
 * Offline Indicator Component
 * Shows when the app is offline and using cached data
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(() => !navigator.onLine);
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" message briefly
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <div
      className={`fixed top-4 ${isRTL ? "left-4" : "right-4"} z-50 max-w-sm`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
          ${
            isOnline
              ? "bg-card border-border text-starbucks-green"
              : "bg-card border-border text-foreground"
          }
          transition-all duration-300 ease-in-out
        `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Icon */}
        <div className="shrink-0">
          {isOnline ? (
            <Wifi className="h-5 w-5" aria-hidden="true" />
          ) : (
            <WifiOff className="h-5 w-5" aria-hidden="true" />
          )}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {isOnline
              ? lang === "ar"
                ? "عاد الاتصال"
                : "Back online"
              : lang === "ar"
                ? "لا يوجد اتصال بالإنترنت"
                : "No internet connection"}
          </p>
          {!isOnline && (
            <p className="text-xs mt-1 opacity-90">
              {lang === "ar"
                ? "يتم عرض البيانات المحفوظة"
                : "Showing cached data"}
            </p>
          )}
        </div>

        {/* Close button for offline state */}
        {!isOnline && (
          <button
            onClick={() => setShowIndicator(false)}
            className="shrink-0 ml-2 text-foreground/60 hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-starbucks-green focus:ring-offset-2 rounded"
            aria-label={lang === "ar" ? "إغلاق التنبيه" : "Dismiss alert"}
          >
            <span className="sr-only">{lang === "ar" ? "إغلاق" : "Close"}</span>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;
