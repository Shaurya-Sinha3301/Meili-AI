import { Card, CardHeader, CardTitle, CardMeta } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { JobProgressCard } from '../optimization/JobProgressCard';
import type { AgentJob } from '../../lib/types';
import { useAgentJobs } from '../../hooks/useAgentJobs';

interface AgentDashboardProps {
  onNavigate: (page: string) => void;
}

export function AgentDashboard({ onNavigate }: AgentDashboardProps) {
  const { data, isLoading } = useAgentJobs(50, 0);

  const jobs: AgentJob[] = data?.jobs.map((j: any, idx: number) => ({
    id: j.job_id,
    tripId: j.result?.trip_id || j.job_id, // fallback
    tripName: 'Trip ' + (j.result?.trip_id?.slice(0,4) || 'Unknown'),
    customerName: 'Customer', // Would come from DB relations if populated
    optimizationId: `opt-${j.job_id.slice(0, 4)}`,
    status: j.status === 'RUNNING' ? 'running' : (j.status === 'CREATED' ? 'awaiting_approval' : 'completed'),
    priority: idx % 3 === 0 ? 'high' : 'medium',
    createdAt: j.created_at || new Date().toISOString(),
    updatedAt: j.updated_at || new Date().toISOString(),
    confidence: 90,
  })) || [];

  const awaitingCount = jobs.filter(j => j.status === 'awaiting_approval').length;
  const runningCount = jobs.filter(j => j.status === 'running').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  
  // Aggregate customers from trips
  const customersMap = new Map();
  jobs.forEach(j => {
    if (!customersMap.has(j.customerName)) {
      customersMap.set(j.customerName, { name: j.customerName, trips: 0, pending: 0, status: j.status });
    }
    const c = customersMap.get(j.customerName);
    c.trips += 1;
    if (j.status === 'awaiting_approval') c.pending += 1;
  });
  const customers = Array.from(customersMap.values());

  const activity = jobs.slice(0, 4).map(j => ({
    text: `Job for ${j.tripName} is ${j.status}`,
    trip: j.tripName,
    time: 'Recently',
    color: j.status === 'awaiting_approval' ? 'var(--warning)' : 'var(--primary)'
  }));
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Agent Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Thursday, 10 July 2024 · 4 active jobs · 2 awaiting approval
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Awaiting Approval" value={awaitingCount} trend="neutral" deltaLabel="action required" />
        <MetricCard label="Running Jobs" value={runningCount} trend="neutral" />
        <MetricCard label="Completed" value={completedCount} trend="neutral" />
        <MetricCard label="Active Customers" value={customers.length} trend="neutral" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Optimization Queue — main column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Optimization Queue
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Sort: Priority</span>
            </div>
          </div>
          <Card padding="none">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading queue...</div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No jobs found.</div>
            ) : (
              jobs.map(job => (
                <JobProgressCard
                  key={job.id}
                  job={job}
                  onQuickApprove={() => onNavigate('explainability')}
                  onView={() => onNavigate('diff-viewer')}
                />
              ))
            )}
          </Card>
        </div>

        {/* Right column: customers + activity */}
        <div className="space-y-4">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Customers</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {customers.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 pb-3"
                  style={{ borderBottom: i < customers.length - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ backgroundColor: `hsl(${i * 80} 30% 60%)`, color: '#fff' }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{c.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                      {c.trips} trip{c.trips !== 1 ? 's' : ''}
                      {c.pending > 0 && ` · ${c.pending} pending`}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
              {customers.length === 0 && !isLoading && (
                <p className="text-sm text-muted-foreground">No customers found.</p>
              )}
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
                  <div>
                    <p className="leading-snug">{a.text}</p>
                    <p className="mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {a.trip} · {a.time}
                    </p>
                  </div>
                </div>
              ))}
              {activity.length === 0 && !isLoading && (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
