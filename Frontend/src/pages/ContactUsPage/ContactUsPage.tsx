import { QueryErrorBoundary } from '@/components';
import { ContactSkeleton } from '@/components/skeletons';
import { useContactInfo } from '@/hooks';
import type { ContactUsData as ContactData } from '@/types/pages';
import { ContactUsPageContent } from './ContactUsPageContent';

export function ContactUsPage() {
  const { data: contactData, isLoading } = useContactInfo();

  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <QueryErrorBoundary>
      {contactData && <ContactUsPageContent data={contactData as ContactData} />}
    </QueryErrorBoundary>
  );
}

export default ContactUsPage;
