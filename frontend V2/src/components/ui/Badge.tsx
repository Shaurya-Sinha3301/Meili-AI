type BadgeVariant = 'default' | 'approved' | 'pending' | 'failed' | 'review' | 'ai' | 'running';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' },
  approved: { backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)', color: 'var(--success)' },
  pending: { backgroundColor: 'color-mix(in srgb, var(--warning) 12%, transparent)', color: 'var(--warning)' },
  failed: { backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)', color: 'var(--error)' },
  review: { backgroundColor: 'color-mix(in srgb, var(--warning) 12%, transparent)', color: 'var(--warning)' },
  ai: { backgroundColor: 'color-mix(in srgb, var(--ai) 12%, transparent)', color: 'var(--ai)' },
  running: { backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' },
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'failed' | 'running' | 'awaiting_approval' | 'completed' | 'cancelled' | 'draft' | 'active';
  className?: string;
}

const statusMap: Record<StatusBadgeProps['status'], { variant: BadgeVariant; label: string }> = {
  approved: { variant: 'approved', label: 'Approved' },
  completed: { variant: 'approved', label: 'Completed' },
  active: { variant: 'running', label: 'Active' },
  pending: { variant: 'pending', label: 'Pending' },
  awaiting_approval: { variant: 'review', label: 'Awaiting Approval' },
  running: { variant: 'running', label: 'Running' },
  failed: { variant: 'failed', label: 'Failed' },
  cancelled: { variant: 'failed', label: 'Cancelled' },
  draft: { variant: 'default', label: 'Draft' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { variant, label } = statusMap[status] ?? { variant: 'default', label: status };
  return (
    <Badge variant={variant} className={className}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: 'currentColor', flexShrink: 0 }}
      />
      {label}
    </Badge>
  );
}
