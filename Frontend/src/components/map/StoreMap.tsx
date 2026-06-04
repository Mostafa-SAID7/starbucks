import { useState, useCallback } from 'react';
import { Map, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { StoreMarker } from './StoreMarker';
import { UserLocationMarker } from './UserLocationMarker';
import type { Location } from '@/types';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'lucide-react';

interface StoreMapProps {
  locations: Location[];
  userLocation: google.maps.LatLngLiteral | null;
  selectedLocation: Location | null;
  onLocationSelect: (location: Location | null) => void;
}

export function StoreMap({
  locations,
  userLocation,
  selectedLocation,
  onLocationSelect,
}: StoreMapProps) {
  const { t } = useTranslation(['pages']);
  const map = useMap();
  
  // Custom map style mapId - default or provide one from env
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID || 'DEMO_MAP_ID';
  const defaultCenter = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt

  const handleMarkerClick = useCallback(
    (location: Location) => {
      onLocationSelect(location);
      const position = location.coordinates || {
        lat: location.latitude || 0,
        lng: location.longitude || 0,
      };
      if (map && position.lat && position.lng) {
        map.panTo(position);
        map.setZoom(15);
      }
    },
    [map, onLocationSelect]
  );

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative shadow-lg">
      <Map
        defaultZoom={11}
        defaultCenter={defaultCenter}
        mapId={mapId}
        disableDefaultUI={false}
        gestureHandling="greedy"
      >
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
            position={
              selectedLocation.coordinates || {
                lat: selectedLocation.latitude || 0,
                lng: selectedLocation.longitude || 0,
              }
            }
            onCloseClick={() => onLocationSelect(null)}
          >
            <div className="p-2 max-w-[250px]">
              <h3 className="font-bold text-gray-900 mb-1">
                {typeof selectedLocation.name === 'string'
                  ? selectedLocation.name
                  : selectedLocation.name?.en}
              </h3>
              {selectedLocation.address && (
                <p className="text-sm text-gray-600 mb-2">
                  {typeof selectedLocation.address === 'string'
                    ? selectedLocation.address
                    : selectedLocation.address?.en}
                </p>
              )}
              {selectedLocation.operatingHours && (
                <div className="text-xs text-gray-500 mb-3">
                  {Object.entries(selectedLocation.operatingHours)[0] && (
                    <span>
                      {Object.entries(selectedLocation.operatingHours)[0][1].open} -{' '}
                      {Object.entries(selectedLocation.operatingHours)[0][1].close}
                    </span>
                  )}
                </div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${
                  selectedLocation.coordinates?.lat || selectedLocation.latitude
                },${selectedLocation.coordinates?.lng || selectedLocation.longitude}`}
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
