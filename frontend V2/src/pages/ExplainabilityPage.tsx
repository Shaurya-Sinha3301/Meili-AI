import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ExplainabilityPanel } from '../features/explainability/ExplainabilityPanel';

interface ExplainabilityPageProps {
  onNavigate: (page: string) => void;
}

export function ExplainabilityPage({ onNavigate }: ExplainabilityPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs
          crumbs={[
            { label: 'Dashboard', onClick: () => onNavigate('customer-dashboard') },
            { label: 'Italy Family Trip', onClick: () => onNavigate('trip-overview') },
            { label: 'Change Review', onClick: () => onNavigate('diff-viewer') },
            { label: 'AI Explanation' },
          ]}
        />
      </div>
      <ExplainabilityPanel
        onApprove={() => onNavigate('customer-dashboard')}
        onRequestChanges={() => onNavigate('diff-viewer')}
      />
    </>
  );
}
