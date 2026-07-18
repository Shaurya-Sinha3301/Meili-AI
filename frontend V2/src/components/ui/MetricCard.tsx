import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, delta, deltaLabel, trend, icon }: MetricCardProps) {
  const trendColor =
    trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--error)' : 'var(--muted-foreground)';

  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {value}
          </p>
          {(delta != null || deltaLabel) && (
            <p className="text-xs mt-1.5" style={{ color: trendColor }}>
              {delta != null && (delta > 0 ? '↑' : '↓')} {deltaLabel ?? Math.abs(delta ?? 0)}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
