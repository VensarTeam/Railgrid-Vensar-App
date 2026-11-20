import { aggregateQuantities, aggregateSignalMetrics, aggregateTrackStatus } from '../src/screens/dashboard/dashboardModel';
import type { DashboardProject } from '../src/types/dashboard';

function project(id: string, totalKm: number, completedKm: number, stationTotal: number, stationDone: number): DashboardProject {
  return {
    id, code: id, name: id, status: 'active', trackLengthKm: totalKm, packageCount: 1,
    proposedStations: stationTotal, majorBridges: 2, minorBridges: 3,
    roadUnderBridges: 1, footOverBridges: 1, levelCrossings: 2,
    trackStatus: { totalKm, completedKm, inProgressKm: 1, pendingKm: totalKm - completedKm - 1 },
    structureCounts: { station: { total: stationTotal, completed: stationDone, inProgress: 0 } },
    modules: [],
  };
}

it('adds quantities and track status across every assigned project', () => {
  const projects = [project('one', 10, 2, 2, 1), project('two', 20, 4, 3, 2)];
  const quantities = aggregateQuantities(projects);
  expect(quantities.track).toMatchObject({ completed: 6, total: 30 });
  expect(quantities.stations).toMatchObject({ completed: 3, total: 5 });
  expect(quantities.majorBridges).toMatchObject({ completed: 0, total: 4 });
  expect(aggregateTrackStatus(projects)).toEqual({ completedKm: 6, inProgressKm: 2, pendingKm: 22 });
});

it('does not present an incomplete portfolio total as a complete one', () => {
  const projects = [project('one', 10, 2, 2, 1), { ...project('two', 20, 4, 3, 2), proposedStations: null }];
  expect(aggregateQuantities(projects).stations.total).toBeNull();
});

it('adds recorded and approved S&T work across projects', () => {
  const first = { ...project('one', 10, 2, 2, 1), signalMetrics: {
    signals: 2, points: 1, axleCounters: 0, eiLocations: 0, ofcLengthKm: 1.5, telecomSystems: 0,
    completed: { signals: 1, points: 0, axleCounters: 0, eiLocations: 0, ofcLengthKm: 0.5, telecomSystems: 0 },
  } };
  const second = { ...project('two', 20, 4, 3, 2), signalMetrics: {
    signals: 3, points: 2, axleCounters: 0, eiLocations: 0, ofcLengthKm: 2, telecomSystems: 0,
    completed: { signals: 2, points: 1, axleCounters: 0, eiLocations: 0, ofcLengthKm: 1, telecomSystems: 0 },
  } };
  const signal = aggregateSignalMetrics([first, second]);
  expect(signal.signals).toMatchObject({ completed: 3, total: 5 });
  expect(signal.points).toMatchObject({ completed: 1, total: 3 });
  expect(signal.ofcLengthKm).toMatchObject({ completed: 1.5, total: 3.5, unit: 'km' });
});
