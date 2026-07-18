import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardMeta } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitFeedback } from '../../hooks/useFeedback';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment is too short"),
});
type FeedbackFormData = z.infer<typeof feedbackSchema>;

const SUGGESTIONS = [
  {
    id: 's1',
    summary: 'Switch Florence–Venice train to 09:14 departure to avoid 2h overlap with hotel check-in.',
    confidence: 94,
    impact: '−€32 · +3h free time',
    type: 'schedule',
  },
  {
    id: 's2',
    summary: 'Upgrade Rome hotel to Colosseum-view room — only €28 more per night given availability forecast.',
    confidence: 81,
    impact: '+€56 · Comfort +17pts',
    type: 'upgrade',
  },
];

const HISTORY = [
  { date: '9 Jul 2024', action: 'Accepted', summary: 'JR Pass added for Tokyo trip', impact: '−€44' },
  { date: '8 Jul 2024', action: 'Rejected', summary: 'Airline upgrade LHR→FCO Business class', impact: '+€480' },
  { date: '7 Jul 2024', action: 'Accepted', summary: 'Colosseum tour rescheduled from 14:00 to 10:00', impact: 'No cost change' },
];

interface FeedbackPanelProps {
  onNavigate: (page: string) => void;
}

export function FeedbackPanel({ onNavigate }: FeedbackPanelProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [prefs, setPrefs] = useState({ budgetPriority: 50, comfortVsCost: 60, pace: 35 });

  const { mutate: submitFeedback, isPending, isError, isSuccess } = useSubmitFeedback();
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 5, comment: '' }
  });

  const watchRating = watch('rating');

  const onSubmit = (data: FeedbackFormData) => {
    submitFeedback({
      node_id: 'general', // Using general as default if no specific node is selected
      rating: data.rating,
      comment: data.comment
    }, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Feedback</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Review AI suggestions, set your optimization preferences, and provide feedback on your itinerary.
        </p>
      </div>

      {/* Provide Feedback Form */}
      <Card padding="md">
        <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Provide Feedback</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="cursor-pointer flex items-center">
                <input
                  type="radio"
                  value={star}
                  {...register('rating', { valueAsNumber: true })}
                  className="hidden"
                />
                <span className={`text-xl ${watchRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              </label>
            ))}
            {errors.rating && <p className="text-xs text-red-500 ml-2">{errors.rating.message}</p>}
          </div>

          <div>
            <textarea
              {...register('comment')}
              className="w-full text-sm p-3 rounded"
              rows={3}
              placeholder="What did you think of this itinerary? Note: leave feedback for specific activities here if needed."
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)'
              }}
            />
            {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="sm" type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
          {isError && <p className="text-xs text-red-500 mt-2 text-right">Failed to submit feedback. Please try again.</p>}
          {isSuccess && <p className="text-xs text-green-500 mt-2 text-right">Feedback submitted successfully!</p>}
        </form>
      </Card>

      <div className="grid grid-cols-2 gap-8">
        {/* Suggestions */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Pending Suggestions ({SUGGESTIONS.filter(s => !dismissed.has(s.id)).length})
          </h2>
          {SUGGESTIONS.filter(s => !dismissed.has(s.id)).map(s => (
            <Card key={s.id} ai padding="md">
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="ai">AI · {s.confidence}% confidence</Badge>
                <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.impact}</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">{s.summary}</p>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => onNavigate('explainability')}>
                  Accept & Review
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onNavigate('explainability')}>
                  Explain
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDismissed(p => new Set([...p, s.id]))}>
                  Dismiss
                </Button>
              </div>
            </Card>
          ))}
          {SUGGESTIONS.filter(s => !dismissed.has(s.id)).length === 0 && (
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No pending suggestions.</p>
          )}
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Optimization Preferences</h2>
          <Card padding="md">
            <div className="space-y-6">
              {[
                { key: 'budgetPriority' as const, label: 'Budget priority', left: 'Flexible', right: 'Strict' },
                { key: 'comfortVsCost' as const, label: 'Comfort vs cost', left: 'Cost first', right: 'Comfort first' },
                { key: 'pace' as const, label: 'Travel pace', left: 'Relaxed', right: 'Packed' },
              ].map(({ key, label, left, right }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium">{label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{prefs[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={prefs[key]}
                    onChange={e => setPrefs(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full"
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div className="flex justify-between text-[11px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    <span>{left}</span>
                    <span>{right}</span>
                  </div>
                </div>
              ))}
              <Button variant="primary" size="md" className="w-full">
                Save preferences
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Feedback History</h2>
        <Card padding="none">
          {HISTORY.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 text-xs"
              style={{ borderBottom: i < HISTORY.length - 1 ? '1px solid var(--border)' : undefined }}
            >
              <span style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{h.date}</span>
              <span
                className="font-semibold shrink-0"
                style={{ color: h.action === 'Accepted' ? 'var(--success)' : 'var(--error)' }}
              >
                {h.action}
              </span>
              <span className="flex-1 truncate">{h.summary}</span>
              <span style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{h.impact}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
