import { StaticPageSkeleton } from '@/components/skeletons';
import { QueryErrorBoundary } from '@/components';
import { usePageData } from '@/hooks/queries';
import { DeliveryPageContent } from './DeliveryPageContent';
import type { GenericPageData } from '@/types';

export const DeliveryPage = () => {
  const { data: pageData, isLoading } = usePageData('delivery');

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {pageData && <DeliveryPageContent data={pageData as GenericPageData} />}
    </QueryErrorBoundary>
  );
};

export default DeliveryPage;
