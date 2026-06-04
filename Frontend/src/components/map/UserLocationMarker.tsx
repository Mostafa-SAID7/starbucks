import { AdvancedMarker } from '@vis.gl/react-google-maps';

interface UserLocationMarkerProps {
  position: google.maps.LatLngLiteral | null;
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  if (!position) return null;

  return (
    <AdvancedMarker position={position} zIndex={100}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
        <div className="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md" />
      </div>
    </AdvancedMarker>
  );
}
