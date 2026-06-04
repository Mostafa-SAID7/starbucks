import { useMap } from '@vis.gl/react-google-maps';
import { Navigation, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MapControlsProps {
  onLocateMe: () => void;
  geoStatus: 'idle' | 'loading' | 'error';
}

export function MapControls({ onLocateMe, geoStatus }: MapControlsProps) {
  const { t } = useTranslation(['pages']);
  const map = useMap();

  const handleZoomIn = () => {
    if (map) map.setZoom((map.getZoom() || 11) + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom((map.getZoom() || 11) - 1);
  };

  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
      <button
        onClick={onLocateMe}
        disabled={geoStatus === 'loading'}
        className="bg-white dark:bg-zinc-900 p-3 rounded-full shadow-lg border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        title={t('pages:locations.hero.use_my_location', 'Use my location')}
      >
        <Navigation
          className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${
            geoStatus === 'loading' ? 'animate-spin' : ''
          }`}
        />
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-100 dark:border-white/10"
          title="Zoom in"
        >
          <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          title="Zoom out"
        >
          <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
