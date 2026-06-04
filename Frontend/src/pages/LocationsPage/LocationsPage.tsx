import { useLocations } from '@/hooks';
import { LocationsSkeleton } from '@/components/skeletons';
import { LocationsPageContent } from './LocationsPageContent';
import type { Location } from '@/types';

export const LocationsPage = () => {
  const { data: cities, isLoading } = useLocations() as { data: Location[] | undefined; isLoading: boolean };

  if (isLoading) {
    return <LocationsSkeleton />;
  }

  return <LocationsPageContent locations={cities || []} />;
};

export default LocationsPage;
