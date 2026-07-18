import { useQuery } from '@tanstack/react-query';
import { tripsService } from '../services/trips';
import { queryKeys } from '../constants/queryKeys';

export function useTrips(limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: [queryKeys.trips, { limit, offset }],
    queryFn: () => tripsService.getTrips(limit, offset),
  });
}

export function useTripSummary(tripId: string) {
  return useQuery({
    queryKey: [queryKeys.tripSummary, tripId],
    queryFn: () => tripsService.getTripSummary(tripId),
    enabled: !!tripId,
  });
}
