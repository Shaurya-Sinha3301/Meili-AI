import { http } from '../lib/http';
import type { Feedback } from '../lib/types';

export const feedbackService = {
  list: (tripId: string) => http.get<Feedback[]>(`/api/trips/${tripId}/feedback`),
  submit: (tripId: string, optimizationId: string, payload: Partial<Feedback>) =>
    http.post<Feedback>(`/api/trips/${tripId}/optimizations/${optimizationId}/feedback`, payload),
};
