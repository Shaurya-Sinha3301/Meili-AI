import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { DiffViewer } from '../features/diff/DiffViewer';

interface DiffViewerPageProps {
  onNavigate: (page: string) => void;
}

export function DiffViewerPage({ onNavigate }: DiffViewerPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs
          crumbs={[
            { label: 'Dashboard', onClick: () => onNavigate('customer-dashboard') },
            { label: 'Italy Family Trip', onClick: () => onNavigate('trip-overview') },
            { label: 'Change Review' },
          ]}
        />
      </div>
      <DiffViewer onNavigate={onNavigate} />
    </>
  );
}
