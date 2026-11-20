import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboardApi';

export const dashboardQueryKey = ['dashboard', 'summary'] as const;

export function useDashboardQuery() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: dashboardApi.summary,
    staleTime: 60_000,
    retry: 1,
  });
}
