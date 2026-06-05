import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks';

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
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
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // useMapsLibrary returns null if the API key is missing / Maps failed to load
  const places = useMapsLibrary('places');

  // Attach Google Places Autocomplete only when the library is available
  useEffect(() => {
    if (!places || !inputRef.current) return;

    try {
      const ac = new places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'formatted_address'],
        componentRestrictions: { country: 'eg' },
      });
      setPlaceAutocomplete(ac);
    } catch {
      // Autocomplete class unavailable (deprecated for new keys), fall back to text search
    }
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();
      setSearch(place.name || place.formatted_address || '');
      onPlaceSelect(place);
    });
  }, [onPlaceSelect, placeAutocomplete, setSearch]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('pages:locations.hero.search_placeholder', 'Find a store...')}
        className={`w-full rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 py-4 ${
          isRTL ? 'pr-6 pl-14 text-right' : 'pl-6 pr-14'
        } text-gray-900 dark:text-white outline-none focus:border-starbucks-green focus:ring-1 focus:ring-starbucks-green transition-all shadow-sm`}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRTL ? 'left-2' : 'right-2'
        } p-2.5 bg-starbucks-green rounded-full`}
      >
        <Search className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}
