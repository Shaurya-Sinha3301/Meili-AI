import { useState } from 'react';
import type { ExplanationStep } from '../../lib/types';

interface ExplanationCardProps {
  step: ExplanationStep;
  index: number;
}

const stepTypeConfig = {
  analysis: { label: 'Analysis', color: 'var(--primary)' },
  constraint_check: { label: 'Constraint Check', color: 'var(--warning)' },
  scoring: { label: 'Scoring', color: 'var(--ai)' },
  selection: { label: 'Selection', color: 'var(--success)' },
  validation: { label: 'Validation', color: 'var(--success)' },
};

export function ExplanationCard({ step, index }: ExplanationCardProps) {
  const [open, setOpen] = useState(false);
  const config = stepTypeConfig[step.stepType] ?? { label: step.stepType, color: 'var(--muted-foreground)' };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left transition-colors duration-150 hover:bg-muted"
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{ backgroundColor: `color-mix(in srgb, ${config.color} 12%, var(--muted))`, color: config.color }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold">{step.title}</p>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `color-mix(in srgb, ${config.color} 10%, transparent)`, color: config.color }}
            >
              {config.label}
            </span>
          </div>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ color: 'var(--muted-foreground)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs leading-relaxed pt-3" style={{ color: 'var(--muted-foreground)' }}>
            {step.description}
          </p>
        </div>
      )}
    </div>
  );
}
