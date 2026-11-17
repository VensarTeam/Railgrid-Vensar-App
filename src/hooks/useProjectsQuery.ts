import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Project } from '../types/project';

export const projectQueryKey = ['projects'] as const;

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectQueryKey,
    queryFn: async () => {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    },
  });
}
