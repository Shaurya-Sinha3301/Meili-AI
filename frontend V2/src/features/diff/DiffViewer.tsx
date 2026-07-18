import { useState } from 'react';
import { DiffCard } from './DiffCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useDiff } from '../../hooks/useDiff';
import type { DiffChange } from '../../lib/types';

// Mock array removed since we now fetch from useDiff

type FilterType = 'all' | 'savings' | 'upgrades' | 'schedule';

interface DiffViewerProps {
  onNavigate: (page: string) => void;
}

export function DiffViewer({ onNavigate }: DiffViewerProps) {
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Use a default familyId/versions for the integration
  const { data: diffData, isLoading } = useDiff('default-family-id', 1, 2);

  // Map backend DiffDTO to frontend DiffChange format
  const changes: DiffChange[] = [];
  
  if (diffData) {
    let idCounter = 1;
    const processItems = (items: any[], type: any, field: string) => {
      if (!items) return;
      items.forEach(item => {
        const beforeTitle = item.before?.title || JSON.stringify(item.before) || 'None';
        const afterTitle = item.after?.title || JSON.stringify(item.after) || 'None';
        
        changes.push({
          id: `diff-${idCounter++}`,
          type,
          field,
          previousValue: beforeTitle,
          updatedValue: afterTitle,
          reason: item.reason || 'Optimization adjusted this activity',
          impact: { costDelta: 0, currency: '€' }, // The DTO doesn't include cost delta, defaulting to 0
          tags: item.affected_constraints || [],
          confidence: item.importance === 'high' ? 95 : 80,
        });
      });
    };
    
    processItems(diffData.added_activities, 'activity', 'added');
    processItems(diffData.removed_activities, 'activity', 'removed');
    processItems(diffData.moved_activities, 'activity', 'moved');
    processItems(diffData.time_changes, 'activity', 'time_changed');
    processItems(diffData.hotel_changes, 'hotel', 'hotel_changed');
    processItems(diffData.transport_changes, 'transport', 'transport_changed');
  }

  function handleApprove(id: string) {
    setApproved(prev => new Set([...prev, id]));
    setRejected(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  function handleReject(id: string) {
    setRejected(prev => new Set([...prev, id]));
    setApproved(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  function handleApproveAll() {
    setApproved(new Set(changes.map(c => c.id)));
    setRejected(new Set());
  }

  const pending = changes.filter(c => !approved.has(c.id) && !rejected.has(c.id)).length;
  const totalCostDelta = changes.reduce((sum, c) => sum + (c.impact.costDelta ?? 0), 0);

  if (isLoading) return <div className="p-8 text-center">Loading diffs...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Change Review
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Italy Family Trip · Optimization opt-8f3a9c · {changes.length} proposed changes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => onNavigate('explainability')}>
              View Explanation
            </Button>
            <Button variant="primary" size="md" onClick={handleApproveAll} disabled={pending === 0}>
              Approve all ({pending})
            </Button>
          </div>
        </div>

        {/* Summary bar */}
        <div
          className="flex items-center gap-6 px-4 py-3 rounded-lg mt-4"
          style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <div className="text-xs">
            <span style={{ color: 'var(--muted-foreground)' }}>Total impact: </span>
            <span className="font-mono font-semibold" style={{ color: totalCostDelta <= 0 ? 'var(--success)' : 'var(--error)' }}>
              {totalCostDelta > 0 ? '+' : ''}€{totalCostDelta}
            </span>
          </div>
          <div className="text-xs">
            <span style={{ color: 'var(--muted-foreground)' }}>Approved: </span>
            <span className="font-semibold" style={{ color: 'var(--success)' }}>{approved.size}</span>
          </div>
          <div className="text-xs">
            <span style={{ color: 'var(--muted-foreground)' }}>Rejected: </span>
            <span className="font-semibold" style={{ color: 'var(--error)' }}>{rejected.size}</span>
          </div>
          <div className="text-xs">
            <span style={{ color: 'var(--muted-foreground)' }}>Pending: </span>
            <span className="font-semibold">{pending}</span>
          </div>
        </div>
      </div>

      {/* Changes */}
      <div className="space-y-6">
        {changes.map(change => {
          const isApproved = approved.has(change.id);
          const isRejected = rejected.has(change.id);

          return (
            <div key={change.id} style={{ opacity: isRejected ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              {isApproved && (
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-t-lg"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)', border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)', borderBottom: 'none' }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Approved
                </div>
              )}
              {isRejected && (
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-t-lg"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--error) 10%, transparent)', color: 'var(--error)', border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)', borderBottom: 'none' }}
                >
                  ✕ Rejected
                </div>
              )}
              <div style={{ borderRadius: (isApproved || isRejected) ? '0 0 8px 8px' : undefined }}>
                <DiffCard
                  change={change}
                  showActions={!isApproved && !isRejected}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
              {!isApproved && !isRejected && (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => handleReject(change.id)}
                    className="text-xs px-2 py-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Reject this change
                  </button>
                </div>
              )}
              {(isApproved || isRejected) && (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => { setApproved(p => { const n = new Set(p); n.delete(change.id); return n; }); setRejected(p => { const n = new Set(p); n.delete(change.id); return n; }); }}
                    className="text-xs px-2 py-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Undo
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final action */}
      {approved.size + rejected.size === changes.length && (
        <div
          className="flex items-center justify-between p-4 rounded-lg"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
        >
          <p className="text-sm font-medium">
            All changes reviewed · {approved.size} approved, {rejected.size} rejected
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate('explainability')}>
            Confirm and continue →
          </Button>
        </div>
      )}
    </div>
  );
}
