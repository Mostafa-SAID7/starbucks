import { Marker } from '@vis.gl/react-google-maps';
import type { Location } from '@/types';

interface StoreMarkerProps {
  location: Location;
  isSelected?: boolean;
  onClick: (location: Location) => void;
}

/*
 * Why Marker instead of AdvancedMarker?
 *
 * @vis.gl/react-google-maps v1.x (latest 1.8.3) wraps AdvancedMarkerElement,
 * which uses the Google Maps shadow DOM API and calls getRootNode() on its
 * content container in an async scheduler callback. In React 19, the
 * component can be in a transitional state when that callback fires, leaving
 * the container reference undefined → TypeError: Cannot read properties of
 * undefined (reading 'getRootNode').
 *
 * The legacy Marker class does not use shadow DOM or custom elements and is
 * fully synchronous — no async callbacks, no getRootNode calls. We pass the
 * pin shape as an inline SVG data URL so we retain full visual control.
 *
 * Deprecation note: google.maps.Marker is deprecated in Maps JS API v3.58+
 * but Google guarantees backward-compat support for the foreseeable future.
 * Switch back to AdvancedMarker when @vis.gl/react-google-maps ships React 19
 * compatibility (track: github.com/visgl/react-google-maps).
 */

const PIN_NORMAL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 1C7.268 1 1 7.268 1 15c0 11.046 14 26 14 26S29 26.046 29 15C29 7.268 22.732 1 15 1Z"
      fill="#00704A" stroke="white" stroke-width="1.5"/>
    <circle cx="15" cy="15" r="5.5" fill="white"/>
  </svg>`
)}`;

const PIN_SELECTED = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg width="34" height="48" viewBox="0 0 34 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 1C8.163 1 1 8.163 1 17c0 12.868 16 30 16 30S33 29.868 33 17C33 8.163 25.837 1 17 1Z"
      fill="#004f34" stroke="white" stroke-width="2"/>
    <circle cx="17" cy="17" r="6.5" fill="white"/>
  </svg>`
)}`;

export function StoreMarker({ location, isSelected, onClick }: StoreMarkerProps) {
  const position = location.coordinates || {
    lat: location.latitude || 0,
    lng: location.longitude || 0,
  };

  if (!position.lat || !position.lng) return null;

  const title = typeof location.name === 'string' ? location.name : (location.name?.en ?? '');

  return (
    <Marker
      position={position}
      onClick={() => onClick(location)}
      title={title}
      zIndex={isSelected ? 10 : 1}
      icon={{
        url: isSelected ? PIN_SELECTED : PIN_NORMAL,
        scaledSize: isSelected
          ? { width: 34, height: 48, equals: () => false }
          : { width: 30, height: 42, equals: () => false },
        anchor: isSelected
          ? { x: 17, y: 48, equals: () => false }
          : { x: 15, y: 42, equals: () => false },
      }}
    />
  );
}
