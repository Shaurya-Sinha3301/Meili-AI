import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AgentDashboard } from '../features/dashboard/AgentDashboard';

interface AgentDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function AgentDashboardPage({ onNavigate }: AgentDashboardPageProps) {
  return (
    <>
      <div className="mb-6">
        <Breadcrumbs crumbs={[{ label: 'Agent Dashboard' }]} />
      </div>
      <AgentDashboard onNavigate={onNavigate} />
    </>
  );
}
