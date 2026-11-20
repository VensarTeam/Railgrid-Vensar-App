import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['auth', 'profile', userId],
    queryFn: profileApi.me,
    enabled: Boolean(userId),
    staleTime: 60_000,
    retry: 1,
  });
}
