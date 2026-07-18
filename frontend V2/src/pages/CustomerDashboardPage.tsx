import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { CustomerDashboard } from '../features/dashboard/CustomerDashboard';

interface CustomerDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function CustomerDashboardPage({ onNavigate }: CustomerDashboardPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs crumbs={[{ label: 'Dashboard' }]} />
      </div>
      <CustomerDashboard onNavigate={onNavigate} />
    </>
  );
}
