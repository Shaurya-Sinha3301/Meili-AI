import { useQuery } from '@tanstack/react-query';
import { timelineService } from '../services/timeline';
import { queryKeys } from '../constants/queryKeys';

export function useTimeline(familyId?: string) {
  return useQuery({
    queryKey: [queryKeys.timeline, familyId],
    queryFn: () => timelineService.getCurrentTimeline(familyId),
  });
}
