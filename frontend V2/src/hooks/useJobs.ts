import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobs';
import { queryKeys } from '../constants/queryKeys';

export function useJob(jobId: string, refetchInterval?: number) {
  return useQuery({
    queryKey: [queryKeys.jobs, jobId],
    queryFn: () => jobsService.getJob(jobId),
    enabled: !!jobId,
    refetchInterval,
  });
}
