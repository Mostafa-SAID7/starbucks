import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Location } from '@/types';

interface StoreMarkerProps {
  location: Location;
  onClick: (location: Location) => void;
}

export function StoreMarker({ location, onClick }: StoreMarkerProps) {
  // Use location.coordinates if present, otherwise fallback to latitude/longitude
  const position = location.coordinates || {
    lat: location.latitude || 0,
    lng: location.longitude || 0,
  };

  if (!position.lat || !position.lng) return null;

  return (
    <AdvancedMarker
      position={position}
      onClick={() => onClick(location)}
      title={typeof location.name === 'string' ? location.name : location.name?.en || ''}
    >
      <Pin
        background={'#00704A'} // Starbucks Green
        borderColor={'#004f34'}
        glyphColor={'#ffffff'}
      />
    </AdvancedMarker>
  );
}
