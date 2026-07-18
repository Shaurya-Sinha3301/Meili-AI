interface Crumb {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          {crumb.onClick ? (
            <button
              onClick={crumb.onClick}
              className="hover:text-foreground transition-colors duration-150 cursor-pointer"
              style={{ color: 'inherit' }}
            >
              {crumb.label}
            </button>
          ) : (
            <span style={{ color: i === crumbs.length - 1 ? 'var(--foreground)' : 'inherit' }} className="font-medium">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
