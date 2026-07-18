import { http } from '../lib/http';
import type { Optimization } from '../lib/types';

export const explainabilityService = {
  get: (optimizationId: string) =>
    http.get<Optimization>(`/api/optimizations/${optimizationId}/explanation`),
};
