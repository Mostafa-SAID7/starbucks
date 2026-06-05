import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks';

interface PlacesAutocompleteProps {
  onPlaceSelect: (lat: number, lng: number, label: string) => void;
  search: string;
  setSearch: (val: string) => void;
}

export function PlacesAutocomplete({
  onPlaceSelect,
  search,
  setSearch,
}: PlacesAutocompleteProps) {
  const { t } = useTranslation(['pages']);
  const { isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !containerRef.current) return;

    // Prefer the new PlaceAutocompleteElement (works with all API keys after Mar 2025)
    // Fall back to the legacy Autocomplete for older keys
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PlaceAutoEl = (places as any).PlaceAutocompleteElement;
    if (PlaceAutoEl) {
      let el: HTMLElement | null = null;
      try {
        el = new PlaceAutoEl({ componentRestrictions: { country: 'eg' } }) as HTMLElement;
        // Match the look of the native input below
        el.style.cssText = `
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          color: inherit;
          height: 100%;
        `;
        containerRef.current.appendChild(el);

        el.addEventListener('gmp-select', async (e: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const place = (e as any).placePrediction?.toPlace?.();
          if (!place) return;
          await place.fetchFields({ fields: ['displayName', 'location'] });
          const loc = place.location;
          if (loc) {
            const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
            const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
            setSearch(place.displayName || '');
            onPlaceSelect(lat, lng, place.displayName || '');
          }
        });
      } catch {
        // PlaceAutocompleteElement failed — fall through to legacy below
        el?.remove();
        useLegacyAutocomplete(places, containerRef, setSearch, onPlaceSelect);
      }

      return () => {
        el?.remove();
      };
    } else {
      // Legacy path: key predates Mar 2025 restriction
      return useLegacyAutocomplete(places, containerRef, setSearch, onPlaceSelect);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  return (
    <div className="relative w-full">
      {/* Fallback plain text input — always present, drives local list filtering */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('pages:locations.hero.search_placeholder', 'Find a store...')}
        className={`w-full rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 py-4 ${
          isRTL ? 'pr-6 pl-14 text-right' : 'pl-6 pr-14'
        } text-gray-900 dark:text-white outline-none focus:border-starbucks-green focus:ring-1 focus:ring-starbucks-green transition-all shadow-sm`}
      />

      {/* The Google Places element mounts here when the Maps API is ready */}
      <div
        ref={containerRef}
        className={`absolute inset-y-0 ${isRTL ? 'right-14 left-14' : 'left-6 right-14'} flex items-center pointer-events-none [&>*]:pointer-events-auto`}
      />

      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRTL ? 'left-2' : 'right-2'
        } p-2.5 bg-starbucks-green rounded-full pointer-events-none`}
      >
        <Search className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}

function useLegacyAutocomplete(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  places: any,
  containerRef: React.RefObject<HTMLDivElement | null>,
  setSearch: (v: string) => void,
  onPlaceSelect: (lat: number, lng: number, label: string) => void
): (() => void) | undefined {
  if (!places?.Autocomplete || !containerRef.current) return;

  // Attach to the sibling <input> (first child of parent)
  const parent = containerRef.current.parentElement;
  const input = parent?.querySelector('input');
  if (!input) return;

  try {
    const ac = new places.Autocomplete(input, {
      fields: ['geometry', 'name', 'formatted_address'],
      componentRestrictions: { country: 'eg' },
    });

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      const loc = place.geometry?.location;
      if (loc) {
        setSearch(place.name || place.formatted_address || '');
        onPlaceSelect(loc.lat(), loc.lng(), place.name || '');
      }
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).google?.maps?.event?.removeListener(listener);
    };
  } catch {
    // Autocomplete not available — plain text filtering still works
  }
}
