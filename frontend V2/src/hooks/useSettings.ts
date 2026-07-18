import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings';
import type { UserProfileUpdate } from '../types/dto/settings';
import { queryKeys } from '../constants/queryKeys';

export function useSettings() {
  return useQuery({
    queryKey: [queryKeys.userProfile],
    queryFn: () => settingsService.getProfile(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserProfileUpdate) => settingsService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.userProfile] });
    },
  });
}
