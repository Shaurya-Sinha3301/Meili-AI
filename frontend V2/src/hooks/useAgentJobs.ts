import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobs';
import { queryKeys } from '../constants/queryKeys';

export function useAgentJobs(limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: ['agent-jobs', { limit, offset }],
    queryFn: () => jobsService.getAgentJobs(limit, offset),
  });
}
