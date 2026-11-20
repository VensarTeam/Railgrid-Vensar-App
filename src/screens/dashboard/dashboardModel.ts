import type { DashboardProject } from '../../types/dashboard';

export type Quantity = { completed: number | null; total: number | null; unit?: string };

const finite = (value: unknown): number | null =>
  value == null || !Number.isFinite(Number(value)) ? null : Number(value);

const completed = (project: DashboardProject, keys: string[]): number =>
  keys.reduce((sum, key) => sum + (finite(project.structureCounts?.[key]?.completed) ?? 0), 0);

const total = (values: Array<number | null>): number | null =>
  values.some((value) => finite(value) == null)
    ? null
    : values.reduce<number>((sum, value) => sum + Number(value), 0);

export function projectQuantities(project: DashboardProject) {
  return {
    track: {
      completed: finite(project.trackStatus?.completedKm),
      total: finite(project.trackStatus?.totalKm) ?? finite(project.trackLengthKm),
      unit: 'km',
    },
    stations: {
      completed: completed(project, ['station']),
      total: finite(project.proposedStations),
    },
    bridges: {
      completed: completed(project, ['major_bridge', 'minor_bridge', 'rub', 'road_under_bridge', 'foot_over_bridge']),
      total: total([project.majorBridges, project.minorBridges, project.roadUnderBridges, project.footOverBridges]),
    },
    majorBridges: {
      completed: completed(project, ['major_bridge']),
      total: finite(project.majorBridges),
    },
    minorBridges: {
      completed: completed(project, ['minor_bridge']),
      total: finite(project.minorBridges),
    },
    roadUnderBridges: {
      completed: completed(project, ['rub', 'road_under_bridge']),
      total: finite(project.roadUnderBridges),
    },
    footOverBridges: {
      completed: completed(project, ['foot_over_bridge']),
      total: finite(project.footOverBridges),
    },
    crossings: {
      completed: completed(project, ['level_crossing']),
      total: finite(project.levelCrossings),
    },
  };
}

function sumKnown(values: Array<number | null>): number | null {
  return values.length && values.every((value) => value != null)
    ? values.reduce<number>((sum, value) => sum + Number(value), 0)
    : null;
}

export function aggregateQuantities(projects: DashboardProject[]) {
  const rows = projects.map(projectQuantities);
  const keys = ['track', 'stations', 'bridges', 'majorBridges', 'minorBridges', 'roadUnderBridges', 'footOverBridges', 'crossings'] as const;
  return Object.fromEntries(keys.map((key) => [key, {
    completed: sumKnown(rows.map((row) => row[key].completed)),
    total: sumKnown(rows.map((row) => row[key].total)),
    unit: key === 'track' ? 'km' : undefined,
  }])) as Record<typeof keys[number], Quantity>;
}

export function aggregateTrackStatus(projects: DashboardProject[]) {
  return {
    completedKm: sumKnown(projects.map((item) => finite(item.trackStatus?.completedKm))),
    inProgressKm: sumKnown(projects.map((item) => finite(item.trackStatus?.inProgressKm))),
    pendingKm: sumKnown(projects.map((item) => finite(item.trackStatus?.pendingKm))),
  };
}

export function aggregateSignalMetrics(projects: DashboardProject[]) {
  const keys = ['signals', 'points', 'axleCounters', 'eiLocations', 'ofcLengthKm', 'telecomSystems'] as const;
  return Object.fromEntries(keys.map((key) => [key, {
    completed: sumKnown(projects.map((project) => finite(project.signalMetrics?.completed?.[key]))),
    total: sumKnown(projects.map((project) => finite(project.signalMetrics?.[key]))),
    unit: key === 'ofcLengthKm' ? 'km' : undefined,
  }])) as Record<typeof keys[number], Quantity>;
}

export function formatQuantityNumber(value: number | null, unit?: string): string {
  if (value == null) return '—';
  return unit === 'km' ? value.toFixed(1) : Math.round(value).toLocaleString();
}

export function formatQuantity(value: number | null, unit?: string): string {
  const formatted = formatQuantityNumber(value, unit);
  return unit && value != null ? `${formatted} ${unit}` : formatted;
}

export function formatProjectStatus(status: string): string {
  return status.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function progressOf(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(Number(value))) return null;
  return Math.max(0, Math.min(100, Math.round(Number(value))));
}

export function activityTitle(action: string): string {
  const words = action.replace(/[._-]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Project update';
}

export function activityDate(date: string): string {
  const time = new Date(date).getTime();
  if (!Number.isFinite(time)) return '';
  const days = Math.floor((Date.now() - time) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
