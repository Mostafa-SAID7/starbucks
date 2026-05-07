import { useState, useEffect } from "react";

/**
 * Hook to check online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook to detect if data is stale (potentially from cache while offline)
 */
export function useStaleDataDetection() {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      const timer = setTimeout(() => setWasOffline(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return {
    isOnline,
    isUsingStaleData: !isOnline || wasOffline,
  };
}
