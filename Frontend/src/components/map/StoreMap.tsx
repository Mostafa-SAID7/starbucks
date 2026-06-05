import { useCallback, useEffect } from 'react';
import { Map, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { StoreMarker } from './StoreMarker';
import { UserLocationMarker } from './UserLocationMarker';
import { MapControls } from './MapControls';
import type { Location } from '@/types';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'lucide-react';

interface StoreMapProps {
  locations: Location[];
  userLocation: google.maps.LatLngLiteral | null;
  selectedLocation: Location | null;
  onLocationSelect: (location: Location | null) => void;
  onLocateMe: () => void;
  geoStatus: 'idle' | 'loading' | 'error';
}

function getPosition(location: Location): google.maps.LatLngLiteral {
  return (
    location.coordinates || {
      lat: location.latitude || 0,
      lng: location.longitude || 0,
    }
  );
}

function getLocationName(location: Location): string {
  return typeof location.name === 'string' ? location.name : (location.name?.en || '');
}

function getLocationAddress(location: Location): string | undefined {
  if (!location.address) return undefined;
  return typeof location.address === 'string' ? location.address : location.address?.en;
}

/** Pans the map to the selected location — must live inside <Map> to access useMap(). */
function MapPanner({ selectedLocation }: { selectedLocation: Location | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedLocation) return;
    const pos = getPosition(selectedLocation);
    if (pos.lat && pos.lng) {
      map.panTo(pos);
      map.setZoom(15);
    }
  }, [map, selectedLocation]);

  return null;
}

export function StoreMap({
  locations,
  userLocation,
  selectedLocation,
  onLocationSelect,
  onLocateMe,
  geoStatus,
}: StoreMapProps) {
  const { t } = useTranslation(['pages']);

  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID || 'DEMO_MAP_ID';
  const defaultCenter = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt

  const handleMarkerClick = useCallback(
    (location: Location) => {
      onLocationSelect(location);
    },
    [onLocationSelect]
  );

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative shadow-lg">
      <Map
        defaultZoom={11}
        defaultCenter={defaultCenter}
        mapId={mapId}
        disableDefaultUI={true}
        gestureHandling="greedy"
      >
        {/* Must be inside <Map> so useMap() and useEffect work correctly */}
        <MapPanner selectedLocation={selectedLocation} />
        <MapControls onLocateMe={onLocateMe} geoStatus={geoStatus} />

        {userLocation && <UserLocationMarker position={userLocation} />}

        {locations.map((location) => (
          <StoreMarker
            key={location.id || location.slug}
            location={location}
            onClick={handleMarkerClick}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={getPosition(selectedLocation)}
            onCloseClick={() => onLocationSelect(null)}
          >
            <div className="p-2 max-w-[250px]">
              <h3 className="font-bold text-gray-900 mb-1">
                {getLocationName(selectedLocation)}
              </h3>
              {getLocationAddress(selectedLocation) && (
                <p className="text-sm text-gray-600 mb-2">
                  {getLocationAddress(selectedLocation)}
                </p>
              )}
              {selectedLocation.operatingHours &&
                Object.entries(selectedLocation.operatingHours)[0] && (
                  <div className="text-xs text-gray-500 mb-3">
                    <span>
                      {Object.entries(selectedLocation.operatingHours)[0][1].open}
                      {' – '}
                      {Object.entries(selectedLocation.operatingHours)[0][1].close}
                    </span>
                  </div>
                )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${
                  getPosition(selectedLocation).lat
                },${getPosition(selectedLocation).lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-starbucks-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-starbucks-dark transition-colors"
              >
                <Navigation className="w-4 h-4" />
                {t('pages:locations.map.get_directions', 'Get Directions')}
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
