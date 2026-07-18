import { http } from '../lib/http';
import type { AgentJob, ActivityFeedItem } from '../lib/types';

export const agentsService = {
  listJobs: () => http.get<AgentJob[]>('/api/agent/jobs'),
  getJob: (id: string) => http.get<AgentJob>(`/api/agent/jobs/${id}`),
  getActivityFeed: () => http.get<ActivityFeedItem[]>('/api/agent/activity'),
  quickApprove: (optimizationId: string) =>
    http.post<void>(`/api/optimizations/${optimizationId}/approve`, {}),
};
