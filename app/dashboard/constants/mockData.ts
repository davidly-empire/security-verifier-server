import { DashboardStats, RoundStatusData, RecentActivity, GuardIssue, SiteOption } from '../types/dashboard';

export const mockStats: DashboardStats = {
  totalGuards: 24,
  roundsToday: {
    completed: 68,
    scheduled: 80
  },
  missedRounds: 12,
  activeAlerts: 5
};

export const mockRoundStatusData: RoundStatusData[] = [
  { name: 'Completed', value: 68, color: '#10b981' },
  { name: 'Missed', value: 12, color: '#ef4444' },
  { name: 'Late', value: 8, color: '#f59e0b' }
];

export const mockRecentActivity: RecentActivity[] = [
  { id: '1', guardName: 'John Smith', site: 'Main Building', location: 'Floor 1', time: '08:30 AM', status: 'on-time' },
  { id: '2', guardName: 'Sarah Johnson', site: 'East Wing', location: 'Entrance', time: '09:15 AM', status: 'late' },
  { id: '3', guardName: 'Michael Brown', site: 'West Wing', location: 'Parking Lot', time: '10:00 AM', status: 'on-time' },
  { id: '4', guardName: 'Emily Davis', site: 'North Building', location: 'Floor 2', time: '10:45 AM', status: 'on-time' },
  { id: '5', guardName: 'Robert Wilson', site: 'South Building', location: 'Rooftop', time: '11:30 AM', status: 'late' },
  { id: '6', guardName: 'Jessica Miller', site: 'Main Building', location: 'Basement', time: '12:15 PM', status: 'on-time' },
  { id: '7', guardName: 'David Taylor', site: 'East Wing', location: 'Floor 3', time: '01:00 PM', status: 'on-time' },
  { id: '8', guardName: 'Jennifer Anderson', site: 'West Wing', location: 'Loading Dock', time: '01:45 PM', status: 'late' }
];

export const mockGuardIssues: GuardIssue[] = [
  { id: '1', guardName: 'Thomas Martinez', issue: 'Missed 3 consecutive rounds', severity: 'high' },
  { id: '2', guardName: 'Linda Garcia', issue: 'Device malfunction reported', severity: 'medium' },
  { id: '3', guardName: 'William Rodriguez', issue: 'Scheduled time off not approved', severity: 'low' },
  { id: '4', guardName: 'Patricia Hernandez', issue: 'Incomplete checkpoint documentation', severity: 'medium' },
  { id: '5', guardName: 'Christopher Lopez', issue: 'Excessive tardiness this week', severity: 'high' }
];

export const mockSiteOptions: SiteOption[] = [
  { id: 'all', name: 'All Sites' },
  { id: 'main', name: 'Main Building' },
  { id: 'east', name: 'East Wing' },
  { id: 'west', name: 'West Wing' },
  { id: 'north', name: 'North Building' },
  { id: 'south', name: 'South Building' }
];