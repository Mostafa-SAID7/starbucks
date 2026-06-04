import { StaticPageSkeleton } from '@/components/skeletons';
import { useLanguage } from '@/hooks';
import { usePageData } from '@/hooks/queries';
import { type GenericPageData } from '@/types';
import { CommunityImpactPageContent } from './CommunityImpactPageContent';

export const CommunityImpactPage = () => {
  const { lang } = useLanguage();

  const {
    data: pageData,
    isLoading,
    error,
    refetch,
  } = usePageData('community-impact');

  if (isLoading) {
    return <StaticPageSkeleton />;
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'ar' ? 'حدث خطأ في تحميل الصفحة' : 'Error loading page'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {lang === 'ar'
              ? 'عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.'
              : 'Sorry, there was an error loading the page. Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-starbucks-green text-white font-bold rounded-full hover:bg-starbucks-green/90 transition-colors"
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return <CommunityImpactPageContent data={pageData as GenericPageData} />;
};

export default CommunityImpactPage;
