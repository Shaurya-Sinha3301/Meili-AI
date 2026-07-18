import apiClient from './client';
import type { UserProfileResponse, UserProfileUpdate } from '../types/dto/settings';

export const settingsService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UserProfileUpdate): Promise<UserProfileResponse> => {
    const response = await apiClient.patch<UserProfileResponse>('/users/me', data);
    return response.data;
  }
};
