import { http } from '../lib/http';
import type { Optimization } from '../lib/types';

export const optimizationService = {
  list: () => http.get<Optimization[]>('/api/optimizations'),
  get: (id: string) => http.get<Optimization>(`/api/optimizations/${id}`),
  getForTrip: (tripId: string) => http.get<Optimization[]>(`/api/trips/${tripId}/optimizations`),
  approve: (id: string, comment?: string) =>
    http.post<Optimization>(`/api/optimizations/${id}/approve`, { comment }),
  reject: (id: string, comment?: string) =>
    http.post<Optimization>(`/api/optimizations/${id}/reject`, { comment }),
  requestChanges: (id: string, comment: string) =>
    http.post<Optimization>(`/api/optimizations/${id}/request-changes`, { comment }),
};
