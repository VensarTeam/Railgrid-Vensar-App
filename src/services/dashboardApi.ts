import { api } from './api';
import type { DashboardSummary } from '../types/dashboard';

type Envelope<T> = { success: true; data: T };

export const dashboardApi = {
  async summary(): Promise<DashboardSummary> {
    const response = await api.get<Envelope<DashboardSummary>>('/dashboard/summary');
    if (!response.data?.success || !response.data.data) {
      throw new Error('Dashboard data is unavailable right now.');
    }
    return response.data.data;
  },
};
