import { StaticPageSkeleton } from '@/components/skeletons';
import { QueryErrorBoundary } from '@/components';
import { usePageData } from '@/hooks/queries';
import { MiddleEastPageContent } from './MiddleEastPageContent';
import type { GenericPageData } from '@/types';

export const MiddleEastPage = () => {
  const { data: pageData, isLoading } = usePageData('middle-east');

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {pageData && <MiddleEastPageContent data={pageData as GenericPageData} />}
    </QueryErrorBoundary>
  );
};

export default MiddleEastPage;
