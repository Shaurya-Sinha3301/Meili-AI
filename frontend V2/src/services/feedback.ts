import apiClient from './client';
import type { FeedbackRequest, FeedbackResponse } from '../types/dto/feedback';

export const feedbackService = {
  submitFeedback: async (data: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await apiClient.post<FeedbackResponse>('/itinerary/feedback', data);
    return response.data;
  }
};
