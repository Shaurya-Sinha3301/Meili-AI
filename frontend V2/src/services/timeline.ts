import apiClient from './client';
import type { TimelineDTO } from '../types/dto/timeline';

export const timelineService = {
  getCurrentTimeline: async (familyId?: string): Promise<TimelineDTO> => {
    const response = await apiClient.get<TimelineDTO>('/itinerary/current', {
      params: familyId ? { family_id: familyId } : undefined
    });
    return response.data;
  }
};
