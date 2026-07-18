import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { TripCard } from '../features/trips/TripCard';
import { useTripSummary } from '../hooks/useTrips';
import { Trip } from '../lib/types';
import { TripDetailResponse } from '../types/dto/trip';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export function TripOverviewPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useTripSummary(tripId || '');

  if (!tripId) return <div className="p-8 text-red-500">Trip ID is missing.</div>;

  if (isLoading) return <div className="p-8">Loading trip details...</div>;
  if (error || !data) return <div className="p-8 text-red-500">Failed to load trip details.</div>;

  const trip: Trip = {
    id: data.trip_id,
    name: data.trip_name,
    destination: data.destination,
    startDate: data.start_date || new Date().toISOString(),
    endDate: data.end_date || new Date().toISOString(),
    status: (data.status as any) || 'active',
    travelers: [], 
    budget: {
      total: (data as any).total_cost || 0,
      spent: 0,
      currency: '$',
      breakdown: { flights: 0, hotels: 0, activities: 0, meals: 0 }
    },
    optimizationHealth: (data as any).total_satisfaction ? Math.round((data as any).total_satisfaction * 10) : 0,
    lastOptimizedAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Breadcrumbs
        crumbs={[
          { label: 'Dashboard', onClick: () => navigate(ROUTES.DASHBOARD) },
          { label: trip.name },
        ]}
      />

      <TripCard trip={trip} />

      <div className="flex items-center gap-4 mt-8">
        <Button variant="primary" onClick={() => navigate(`/timeline`)}>
          View Timeline
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/feedback`)}>
          Provide Feedback
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/optimization`)}>
          View Optimization Progress
        </Button>
      </div>
    </div>
  );
}
