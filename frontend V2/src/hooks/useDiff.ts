import { useQuery } from '@tanstack/react-query';
import { diffService } from '../services/diff';
import { queryKeys } from '../constants/queryKeys';

export function useDiff(familyId: string, versionA: number, versionB: number) {
  return useQuery({
    queryKey: [queryKeys.diff, familyId, versionA, versionB],
    queryFn: () => diffService.getDiff(familyId, versionA, versionB),
    enabled: !!familyId && versionA !== undefined && versionB !== undefined,
  });
}
