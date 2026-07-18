import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { OptimizationProgress } from '../features/optimization/OptimizationProgress';

interface OptimizationProgressPageProps {
  onNavigate: (page: string) => void;
}

export function OptimizationProgressPage({ onNavigate }: OptimizationProgressPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs
          crumbs={[
            { label: 'Dashboard', onClick: () => onNavigate('customer-dashboard') },
            { label: 'Italy Family Trip', onClick: () => onNavigate('trip-overview') },
            { label: 'Optimization Progress' },
          ]}
        />
      </div>
      <OptimizationProgress onNavigate={onNavigate} />
    </>
  );
}
