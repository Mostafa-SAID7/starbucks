import { QueryErrorBoundary } from '@/components';
import { StaticPageSkeleton } from '@/components/skeletons';
import { usePageData } from '@/hooks/queries';
import type { GenericPageData } from '@/types';
import { SustainabilityPageContent } from './SustainabilityPageContent';

export const SustainabilityPage = () => {
  const { data: pageData, isLoading } = usePageData('sustainability');

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {pageData && <SustainabilityPageContent data={pageData as GenericPageData} />}
    </QueryErrorBoundary>
  );
};

export default SustainabilityPage;
