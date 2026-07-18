import apiClient from './client';
import type { ExplanationDTO } from '../types/dto/explainability';

export const explainabilityService = {
  getExplanations: async (itineraryId: string, familyId?: string): Promise<ExplanationDTO[]> => {
    const response = await apiClient.get<ExplanationDTO[]>(`/itinerary/explanations/${itineraryId}`, {
      params: familyId ? { family_id: familyId } : undefined
    });
    return response.data;
  }
};
