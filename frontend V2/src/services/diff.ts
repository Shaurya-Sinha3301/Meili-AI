import apiClient from './client';
import type { DiffDTO } from '../types/dto/diff';

export const diffService = {
  getDiff: async (familyId: string, versionA: number, versionB: number): Promise<DiffDTO> => {
    const response = await apiClient.get<DiffDTO>('/itinerary/diff', {
      params: { family_id: familyId, version_a: versionA, version_b: versionB }
    });
    return response.data;
  }
};
