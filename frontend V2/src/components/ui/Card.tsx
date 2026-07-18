interface CardProps {
  children: React.ReactNode;
  className?: string;
  ai?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({ children, className = '', ai = false, onClick, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg ${paddingMap[padding]} ${onClick ? 'cursor-pointer transition-colors duration-150' : ''} ${className}`}
      style={{
        backgroundColor: ai ? 'color-mix(in srgb, var(--ai) 5%, var(--card))' : 'var(--card)',
        border: ai
          ? '1px solid color-mix(in srgb, var(--ai) 20%, var(--border))'
          : '1px solid var(--border)',
      }}
      onMouseEnter={onClick ? e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--muted-foreground)') : undefined}
      onMouseLeave={onClick ? e => ((e.currentTarget as HTMLElement).style.borderColor = ai ? 'color-mix(in srgb, var(--ai) 20%, var(--border))' : 'var(--border)') : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`} style={style}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-sm font-semibold ${className}`} style={{ fontFamily: 'var(--font-display)' }}>
      {children}
    </h3>
  );
}

export function CardMeta({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-xs ${className}`} style={{ color: 'var(--muted-foreground)' }}>
      {children}
    </p>
  );
}
