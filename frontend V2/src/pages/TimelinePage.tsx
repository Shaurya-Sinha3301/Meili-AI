import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Timeline } from '../features/timeline/Timeline';

interface TimelinePageProps {
  onNavigate: (page: string) => void;
}

export function TimelinePage({ onNavigate }: TimelinePageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs
          crumbs={[
            { label: 'Dashboard', onClick: () => onNavigate('customer-dashboard') },
            { label: 'Italy Family Trip', onClick: () => onNavigate('trip-overview') },
            { label: 'Timeline' },
          ]}
        />
      </div>
      <Timeline onNavigate={onNavigate} />
    </>
  );
}
