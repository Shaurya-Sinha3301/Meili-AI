import { useQuery } from '@tanstack/react-query';
import { explainabilityService } from '../services/explainability';
import { queryKeys } from '../constants/queryKeys';

export function useExplainability(itineraryId: string, familyId?: string) {
  return useQuery({
    queryKey: [queryKeys.explainability, itineraryId, familyId],
    queryFn: () => explainabilityService.getExplanations(itineraryId, familyId),
    enabled: !!itineraryId,
  });
}
