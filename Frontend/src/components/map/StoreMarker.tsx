import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Location } from '@/types';

interface StoreMarkerProps {
  location: Location;
  isSelected?: boolean;
  onClick: (location: Location) => void;
}

export function StoreMarker({ location, isSelected, onClick }: StoreMarkerProps) {
  const position = location.coordinates || {
    lat: location.latitude || 0,
    lng: location.longitude || 0,
  };

  if (!position.lat || !position.lng) return null;

  const title = typeof location.name === 'string' ? location.name : (location.name?.en || '');

  return (
    <AdvancedMarker
      position={position}
      onClick={() => onClick(location)}
      title={title}
      zIndex={isSelected ? 10 : 1}
    >
      {/*
        Pure SVG pin — avoids the `PinElement` (Pin component) which crashes in
        React StrictMode due to its custom-element lifecycle conflicting with
        React's double-invoking of effects in development.
      */}
      <svg
        width="30"
        height="42"
        viewBox="0 0 30 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', filter: isSelected ? 'drop-shadow(0 0 6px rgba(0,112,74,0.7))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
      >
        {/* Teardrop body */}
        <path
          d="M15 1C7.268 1 1 7.268 1 15c0 11.046 14 26 14 26S29 26.046 29 15C29 7.268 22.732 1 15 1Z"
          fill={isSelected ? '#004f34' : '#00704A'}
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Inner white circle */}
        <circle cx="15" cy="15" r="5.5" fill="white" />
      </svg>
    </AdvancedMarker>
  );
}
