'use client';

import React, { useState, useEffect } from 'react';
import DashboardStatCard from './components/DashboardStatCard';
import RoundsStatusChart from './components/RoundsStatusChart';
import AverageRoundTimeCard from './components/AverageRoundTimeCard';
import RecentActivityTable from './components/RecentActivityTable';
import GuardsIssueTable from './components/GuardsIssueTable';
import DashboardFilters from './components/DashboardFilters';
import DashboardSkeleton from './components/DashboardSkeleton';
import EmptyState from './components/EmptyState';
import DashboardError from './components/DashboardError';
import { 
  mockStats, 
  mockRoundStatusData, 
  mockRecentActivity, 
  mockGuardIssues, 
  mockSiteOptions 
} from './constants/mockData';
import { DashboardFilters as DashboardFiltersType } from './types/dashboard';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filters, setFilters] = useState<DashboardFiltersType>({
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    site: 'all'
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate occasional error for demo purposes
      // setHasError(Math.random() > 0.9);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDateRangeChange = (start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  const handleSiteChange = (site: string) => {
    setFilters(prev => ({
      ...prev,
      site
    }));
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6">
        <DashboardError onRetry={handleRetry} />
      </div>
    );
  }

  // Filter data based on selected site
  const filteredRecentActivity = filters.site === 'all' 
    ? mockRecentActivity 
    : mockRecentActivity.filter(activity => {
        const siteOption = mockSiteOptions.find(option => option.id === filters.site);
        return activity.site === siteOption?.name;
      });

  const filteredGuardIssues = filters.site === 'all' 
    ? mockGuardIssues 
    : mockGuardIssues.filter(issue => {
        // In a real app, we would have site info for each guard
        // For demo purposes, we'll just return a subset
        return Math.random() > 0.5;
      });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Security Rounds Dashboard</h1>
      </div>

      <DashboardFilters
        dateRange={filters.dateRange}
        site={filters.site}
        siteOptions={mockSiteOptions}
        onDateRangeChange={handleDateRangeChange}
        onSiteChange={handleSiteChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStatCard
          title="Total Guards"
          value={mockStats.totalGuards}
          trend={{ value: 2, isPositive: true }}
        />
        <DashboardStatCard
          title="Rounds Today"
          value={`${mockStats.roundsToday.completed}/${mockStats.roundsToday.scheduled}`}
          subtitle={`${Math.round((mockStats.roundsToday.completed / mockStats.roundsToday.scheduled) * 100)}% completed`}
          trend={{ value: 5, isPositive: true }}
        />
        <DashboardStatCard
          title="Missed Rounds"
          value={mockStats.missedRounds}
          trend={{ value: 8, isPositive: false }}
        />
        <DashboardStatCard
          title="Active Alerts"
          value={mockStats.activeAlerts}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RoundsStatusChart data={mockRoundStatusData} />
        <AverageRoundTimeCard averageTime={42} targetTime={45} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecentActivity.length > 0 ? (
          <RecentActivityTable data={filteredRecentActivity} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <EmptyState
              title="No recent activity"
              description="There is no recent activity to display for the selected filters."
            />
          </div>
        )}
        
        {filteredGuardIssues.length > 0 ? (
          <GuardsIssueTable data={filteredGuardIssues} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <EmptyState
              title="No issues found"
              description="All guards are performing well. No attention is required at this time."
            />
          </div>
        )}
      </div>
    </div>
  );
}