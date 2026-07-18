import { useMutation } from '@tanstack/react-query';
import { feedbackService } from '../services/feedback';
import type { FeedbackRequest } from '../types/dto/feedback';

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (data: FeedbackRequest) => feedbackService.submitFeedback(data),
  });
}
