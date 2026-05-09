import { useState, useCallback, useRef } from "react";

export type GeoStatus = "idle" | "loading" | "error" | "success";

export interface UseGeolocationReturn {
  geoStatus: GeoStatus;
  city: string;
  error: string | null;
  getCurrentCity: (lang: string) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for geolocation functionality
 * Handles browser geolocation API and reverse geocoding
 * 
 * @returns Geolocation state and utilities
 * 
 * @example
 * ```tsx
 * const { geoStatus, city, getCurrentCity } = useGeolocation();
 * 
 * const handleClick = async () => {
 *   await getCurrentCity('en');
 * };
 * ```
 */
export function useGeolocation(): UseGeolocationReturn {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [city, setCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const getCurrentCity = useCallback(async (lang: string) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setError("Geolocation is not supported by your browser");
      return;
    }

    // Abort previous request if any
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new abort controller
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    setGeoStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocode using Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: { "Accept-Language": lang },
              signal,
            }
          );

          if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.statusText}`);
          }

          const data = await response.json();
          const foundCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.suburb ||
            data?.address?.village ||
            "";

          if (foundCity) {
            setCity(foundCity);
            setGeoStatus("success");
          } else {
            setGeoStatus("error");
            setError("Could not determine city from coordinates");
          }
        } catch (err) {
          // Ignore abort errors (component unmounted)
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }

          setGeoStatus("error");
          setError(
            err instanceof Error ? err.message : "Failed to get city location"
          );
        }
      },
      (err) => {
        // Handle geolocation errors
        let errorMessage = "Failed to get your location";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setGeoStatus("error");
        setError(errorMessage);
      },
      { timeout: 8000 }
    );
  }, []);

  const reset = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    setGeoStatus("idle");
    setCity("");
    setError(null);
  }, []);

  return { geoStatus, city, error, getCurrentCity, reset };
}
