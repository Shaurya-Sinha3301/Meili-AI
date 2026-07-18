import { useState } from 'react';
import { TimelineActivity } from './TimelineActivity';
import { Button } from '../../components/ui/Button';
import type { TimelineDay } from '../../lib/types';

import { useTimeline } from '../../hooks/useTimeline';
import { TimelineActivityDTO } from '../../types/dto/timeline';


interface TimelineProps {
  onNavigate: (page: string) => void;
}

export function Timeline({ onNavigate }: TimelineProps) {
  const { data: timelineDto, isLoading, error } = useTimeline();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Map backend DTO to frontend types
  const timelineData: TimelineDay[] = timelineDto?.days.map(d => ({
    date: `Day ${d.day}`, // Backend DTO has 'day: number', no 'date' string
    activities: d.activities.map(a => ({
      id: a.id,
      type: (a.category.toLowerCase() as any) || 'activity',
      title: a.title,
      location: a.location,
      startTime: a.start_time ? new Date(a.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
      endTime: a.end_time ? new Date(a.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
      status: 'confirmed',
      notes: a.notes,
      warnings: a.warnings,
      provider: a.travel_mode ? `Travel by ${a.travel_mode}` : undefined,
    })),
  })) || [];

  const days = timelineData.filter(d => !selectedDay || d.date === selectedDay);

  function formatDay(dateStr: string) {
    if (dateStr.startsWith('Day')) return dateStr;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  if (isLoading) return <div className="p-8 text-center">Loading timeline...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Failed to load timeline.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Italy Family Trip — Timeline
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Aug 12–24, 2024 · 13 days · 31 activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('diff-viewer')}>
            View Changes
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('optimization-progress')}>
            Optimize
          </Button>
        </div>
      </div>

      {/* Day filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay(null)}
          className="text-xs px-3 py-1.5 rounded whitespace-nowrap transition-colors duration-150"
          style={{
            backgroundColor: !selectedDay ? 'var(--foreground)' : 'var(--muted)',
            color: !selectedDay ? 'var(--background)' : 'var(--muted-foreground)',
            border: '1px solid var(--border)',
          }}
        >
          All days
        </button>
        {timelineData.map(d => (
          <button
            key={d.date}
            onClick={() => setSelectedDay(d.date === selectedDay ? null : d.date)}
            className="text-xs px-3 py-1.5 rounded whitespace-nowrap transition-colors duration-150"
            style={{
              backgroundColor: selectedDay === d.date ? 'var(--foreground)' : 'var(--muted)',
              color: selectedDay === d.date ? 'var(--background)' : 'var(--muted-foreground)',
              border: '1px solid var(--border)',
            }}
          >
            {formatDay(d.date)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {days.map(day => (
          <div key={day.date}>
            {/* Day header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-3 py-1 rounded text-xs font-semibold"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
              >
                {formatDay(day.date)}
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {day.activities.length} activities
              </span>
            </div>

            {/* Activities */}
            <div>
              {day.activities.map((activity, idx) => (
                <div key={activity.id}>
                  {idx === day.activities.length - 1 ? (
                    /* Last item — no bottom line extension */
                    <div className="flex gap-4 group cursor-pointer" onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}>
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${activity.type === 'transport' ? 'var(--primary)' : activity.type === 'hotel' ? 'var(--ai)' : activity.type === 'meal' ? 'var(--success)' : 'var(--warning)'} 12%, var(--card))`,
                            color: activity.type === 'transport' ? 'var(--primary)' : activity.type === 'hotel' ? 'var(--ai)' : activity.type === 'meal' ? 'var(--success)' : 'var(--warning)',
                            border: `1px solid color-mix(in srgb, ${activity.type === 'transport' ? 'var(--primary)' : activity.type === 'hotel' ? 'var(--ai)' : activity.type === 'meal' ? 'var(--success)' : 'var(--warning)'} 20%, var(--border))`,
                          }}
                        >
                          <span className="text-xs">{activity.type === 'transport' ? '✈' : activity.type === 'hotel' ? '🏨' : activity.type === 'meal' ? '🍽' : '📍'}</span>
                        </div>
                      </div>
                      <div className="flex-1 mb-0">
                        <TimelineActivity
                          activity={activity}
                          expanded={expandedId === activity.id}
                        />
                      </div>
                    </div>
                  ) : (
                    <TimelineActivity
                      activity={activity}
                      onExpand={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                      expanded={expandedId === activity.id}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Load more */}
        <div className="flex justify-center pt-4">
          <Button variant="secondary" size="md">
            Load 10 more days
          </Button>
        </div>
      </div>
    </div>
  );
}
