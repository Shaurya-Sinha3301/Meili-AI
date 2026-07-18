import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { TripCard } from '../trips/TripCard';
import { useTrips } from '../../hooks/useTrips';
import { MetricCard } from '../../components/ui/MetricCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Trip } from '../../lib/types';
import { TripDetailResponse } from '../../types/dto/trip';

interface CustomerDashboardProps {
  onNavigate: (page: string) => void;
}

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  const { data, isLoading, error } = useTrips(10, 0);

  // Map backend DTO to local Trip type for TripCard
  const mapTrip = (dto: TripDetailResponse): Trip => ({
    id: dto.trip_id,
    name: dto.trip_name,
    destination: dto.destination,
    startDate: dto.start_date || new Date().toISOString(),
    endDate: dto.end_date || new Date().toISOString(),
    status: (dto.status as any) || 'active',
    travelers: [], 
    budget: {
      total: (dto as any).total_cost || 0,
      spent: 0,
      currency: '$',
      breakdown: { flights: 0, hotels: 0, activities: 0, meals: 0 }
    },
    optimizationHealth: (dto as any).total_satisfaction ? Math.round((dto as any).total_satisfaction * 10) : 0,
    lastOptimizedAt: new Date().toISOString(),
  });

  const trips = data?.items.map(mapTrip) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome back
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          You have {trips.length} active trips.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Active Trips" value={trips.length} trend="neutral" />
        <MetricCard label="Pending Optimizations" value={trips.filter(t => t.status === 'optimizing').length} trend="neutral" />
        <MetricCard label="Total Saved" value="$0" trend="up" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Your Trips
          </h2>
        </div>
        
        {isLoading && <p className="text-sm">Loading trips...</p>}
        {error && <p className="text-sm text-red-500">Failed to load trips.</p>}
        
        {!isLoading && trips.length === 0 && !error && (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            }
            title="No trips found"
            description="You don't have any trips yet. Contact your agent to get started."
          />
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {trips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => onNavigate(`trip-overview/${trip.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
