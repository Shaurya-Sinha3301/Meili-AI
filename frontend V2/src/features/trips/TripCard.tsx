import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import type { Trip } from '../../lib/types';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  compact?: boolean;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

export function TripCard({ trip, onClick, compact = false }: TripCardProps) {
  const budgetPct = Math.round((trip.budget.spent / trip.budget.total) * 100);

  if (compact) {
    return (
      <Card onClick={onClick} padding="sm">
        <div className="flex items-center gap-3">
          <ProgressRing value={trip.optimizationHealth} size={40} strokeWidth={4} label={`${trip.optimizationHealth}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold truncate">{trip.name}</p>
              <StatusBadge status={trip.status} />
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {trip.destination} · {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card onClick={onClick} padding="md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {trip.name}
            </h3>
            <StatusBadge status={trip.status} />
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            {trip.destination} · {formatDateRange(trip.startDate, trip.endDate)} · {trip.travelers.length} traveler{trip.travelers.length !== 1 ? 's' : ''}
          </p>

          {/* Budget bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--muted-foreground)' }}>
              <span>Budget</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {trip.budget.currency}{trip.budget.spent.toLocaleString()} / {trip.budget.currency}{trip.budget.total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(budgetPct, 100)}%`,
                  backgroundColor: budgetPct > 90 ? 'var(--error)' : budgetPct > 75 ? 'var(--warning)' : 'var(--success)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <ProgressRing value={trip.optimizationHealth} size={56} strokeWidth={5} label={`${trip.optimizationHealth}`} sublabel="health" />
        </div>
      </div>

      {/* Travelers */}
      <div className="flex items-center gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex -space-x-1.5">
          {trip.travelers.slice(0, 4).map((t, i) => (
            <div
              key={t.id}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold"
              style={{
                borderColor: 'var(--card)',
                backgroundColor: `hsl(${(i * 67) % 360} 30% 60%)`,
                color: '#fff',
                zIndex: 4 - i,
              }}
              title={t.name}
            >
              {t.name.charAt(0)}
            </div>
          ))}
        </div>
        {trip.travelers.length > 4 && (
          <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
            +{trip.travelers.length - 4} more
          </span>
        )}
        {trip.lastOptimizedAt && (
          <span className="ml-auto text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
            Optimized {new Date(trip.lastOptimizedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </Card>
  );
}
