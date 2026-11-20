export type DashboardModule = {
  moduleKey: string;
  name: string;
  averageProgress?: number | null;
  progress?: number | null;
  workPackages: number;
  openNcrs: number;
};

export type SignalMetrics = {
  signals: number | null;
  points: number | null;
  axleCounters: number | null;
  eiLocations: number | null;
  ofcLengthKm: number | null;
  telecomSystems: number | null;
  completed?: Partial<Record<'signals' | 'points' | 'axleCounters' | 'eiLocations' | 'ofcLengthKm' | 'telecomSystems', number | null>>;
};

export type DashboardProject = {
  id: string;
  code: string;
  name: string;
  status: string;
  trackLengthKm: number | null;
  packageCount: number;
  proposedStations: number | null;
  majorBridges: number | null;
  minorBridges: number | null;
  roadUnderBridges: number | null;
  footOverBridges: number | null;
  levelCrossings: number | null;
  trackStatus: {
    totalKm: number;
    completedKm: number;
    inProgressKm: number;
    pendingKm: number;
  } | null;
  structureCounts: Record<string, { total: number; completed: number; inProgress: number }>;
  signalMetrics?: SignalMetrics | null;
  modules: DashboardModule[];
};

export type DashboardActivity = {
  id: string;
  action: string;
  projectName: string | null;
  createdAt: string;
};

export type DashboardSummary = {
  scope: { projectCount: number };
  kpis: {
    projects: { total: number; active: number; trackLengthKm: number };
    packages: { total: number };
    openNcrs: number;
  };
  moduleRollup: DashboardModule[];
  recentActivity: DashboardActivity[];
  projects: DashboardProject[];
};
