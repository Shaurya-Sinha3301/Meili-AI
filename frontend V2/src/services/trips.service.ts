import { http } from '../lib/http';
import type { Trip, TimelineDay } from '../lib/types';

export const tripsService = {
  list: () => http.get<Trip[]>('/api/trips'),
  get: (id: string) => http.get<Trip>(`/api/trips/${id}`),
  getTimeline: (id: string) => http.get<TimelineDay[]>(`/api/trips/${id}/timeline`),
  create: (payload: Partial<Trip>) => http.post<Trip>('/api/trips', payload),
  update: (id: string, payload: Partial<Trip>) => http.patch<Trip>(`/api/trips/${id}`, payload),
};
