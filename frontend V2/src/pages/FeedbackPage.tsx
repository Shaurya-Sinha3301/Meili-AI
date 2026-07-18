import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { FeedbackPanel } from '../features/feedback/FeedbackPanel';

interface FeedbackPageProps {
  onNavigate: (page: string) => void;
}

export function FeedbackPage({ onNavigate }: FeedbackPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs
          crumbs={[
            { label: 'Dashboard', onClick: () => onNavigate('customer-dashboard') },
            { label: 'Italy Family Trip', onClick: () => onNavigate('trip-overview') },
            { label: 'Feedback' },
          ]}
        />
      </div>
      <FeedbackPanel onNavigate={onNavigate} />
    </>
  );
}
