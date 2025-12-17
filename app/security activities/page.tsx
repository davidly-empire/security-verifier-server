'use client';

import { useState } from 'react';
import { ActivityStats } from '@/app/components/securityact/ActivityStats';
import { ActivityFilters } from '@/app/components/securityact/ActivityFilters';
import { ActivitiesTable } from '@/app/components/securityact/ActivitiesTable';
import { ActivityDetailsModal } from '@/app/components/securityact/ActivityDetailsModal';

// Mock data for security activities
const mockActivities = [
  {
    id: 'ACT-001',
    type: 'Patrol Scan Activity',
    guardName: 'John Smith',
    roundId: 'RND-2023-001',
    checkpointName: 'Main Entrance',
    location: {
      building: 'Building A',
      floor: 'Ground Floor',
      area: 'Main Lobby'
    },
    timestamp: '2023-11-15T08:30:00',
    status: 'Normal',
    violationFlags: {
      sequenceViolation: 'No',
      timeWindowViolation: 'No'
    },
    alertMetadata: {
      alertLevel: 'Low',
      triggeredReason: 'Regular patrol checkpoint scan',
      acknowledged: 'Yes'
    },
    performanceImpact: {
      scoreImpact: '+5'
    },
    trackingInfo: {
      reportedAt: '2023-11-15T08:30:05',
      lastUpdatedAt: '2023-11-15T08:30:05'
    }
  },
  {
    id: 'ACT-002',
    type: 'Late Patrol Alert',
    guardName: 'Sarah Johnson',
    roundId: 'RND-2023-002',
    checkpointName: 'North Wing',
    location: {
      building: 'Building B',
      floor: '2nd Floor',
      area: 'Corridor'
    },
    timestamp: '2023-11-15T09:45:00',
    status: 'Warning',
    violationFlags: {
      sequenceViolation: 'No',
      timeWindowViolation: 'Yes'
    },
    alertMetadata: {
      alertLevel: 'Medium',
      triggeredReason: 'Patrol checkpoint missed by 15 minutes',
      acknowledged: 'No'
    },
    performanceImpact: {
      scoreImpact: '-10'
    },
    trackingInfo: {
      reportedAt: '2023-11-15T09:45:10',
      lastUpdatedAt: '2023-11-15T09:45:10'
    }
  },
  {
    id: 'ACT-003',
    type: 'Emergency Alert',
    guardName: 'Michael Chen',
    roundId: 'RND-2023-003',
    checkpointName: 'Server Room',
    location: {
      building: 'Building C',
      floor: 'Basement',
      area: 'IT Infrastructure'
    },
    timestamp: '2023-11-15T10:15:00',
    status: 'Critical',
    violationFlags: {
      sequenceViolation: 'No',
      timeWindowViolation: 'No'
    },
    alertMetadata: {
      alertLevel: 'High',
      triggeredReason: 'Fire alarm triggered in server room',
      acknowledged: 'Yes'
    },
    performanceImpact: {
      scoreImpact: '-20'
    },
    trackingInfo: {
      reportedAt: '2023-11-15T10:15:05',
      lastUpdatedAt: '2023-11-15T10:30:20'
    }
  },
  {
    id: 'ACT-004',
    type: 'Incident Logged',
    guardName: 'Emily Rodriguez',
    roundId: 'RND-2023-004',
    checkpointName: 'Parking Lot',
    location: {
      building: 'Building D',
      floor: 'Ground Floor',
      area: 'Parking Area B'
    },
    timestamp: '2023-11-15T11:30:00',
    status: 'Warning',
    violationFlags: {
      sequenceViolation: 'No',
      timeWindowViolation: 'No'
    },
    alertMetadata: {
      alertLevel: 'Medium',
      triggeredReason: 'Unauthorized vehicle detected',
      acknowledged: 'Yes'
    },
    performanceImpact: {
      scoreImpact: '-5'
    },
    trackingInfo: {
      reportedAt: '2023-11-15T11:30:10',
      lastUpdatedAt: '2023-11-15T11:45:30'
    }
  },
  {
    id: 'ACT-005',
    type: 'Sequence Violation',
    guardName: 'David Kim',
    roundId: 'RND-2023-005',
    checkpointName: 'East Wing',
    location: {
      building: 'Building A',
      floor: '3rd Floor',
      area: 'Office Area'
    },
    timestamp: '2023-11-15T13:20:00',
    status: 'Warning',
    violationFlags: {
      sequenceViolation: 'Yes',
      timeWindowViolation: 'No'
    },
    alertMetadata: {
      alertLevel: 'Medium',
      triggeredReason: 'Patrol sequence deviation detected',
      acknowledged: 'No'
    },
    performanceImpact: {
      scoreImpact: '-8'
    },
    trackingInfo: {
      reportedAt: '2023-11-15T13:20:05',
      lastUpdatedAt: '2023-11-15T13:20:05'
    }
  },
  {
    id: 'ACT-006',
    type: 'Time Window Violation',
    guardName: 'Alex Turner',
    roundId: 'RND-2023-006',
    checkpointName: 'South Exit',
    location: {
      building: 'Building B',
      floor: '1st Floor',
      area: 'Exit Gate'
    },
    timestamp: '2023-11-15T14:45:00',
    status: 'Warning',
    violationFlags: {
      sequenceViolation: 'No',
      timeWindowViolation: 'Yes'
    },
    alertMetadata: {
      alertLevel: 'Medium',
      triggeredReason: 'Checkpoint scan outside designated time window',
      acknowledged: 'Yes'
    },
    performanceImpact: {
      scoreImpact: '-7'
    },
    trackingInfo: {
      reportedAt: '2023-11-15T14:45:10',
      lastUpdatedAt: '2023-11-15T14:50:15'
    }
  }
];

// Calculate stats from mock data
const totalActivitiesToday = mockActivities.length;
const latePatrolAlerts = mockActivities.filter(a => a.type === 'Late Patrol Alert').length;
const emergencyAlerts = mockActivities.filter(a => a.type === 'Emergency Alert').length;
const violationsCount = mockActivities.filter(a => 
  a.type === 'Sequence Violation' || a.type === 'Time Window Violation'
).length;

export default function SecurityActivitiesPage() {
  const [activities] = useState(mockActivities);
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilter = (filters) => {
    let filtered = [...activities];

    if (filters.activityType) {
      filtered = filtered.filter(activity => activity.type === filters.activityType);
    }

    if (filters.status) {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }

    if (filters.building) {
      filtered = filtered.filter(activity => activity.location.building === filters.building);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.guardName.toLowerCase().includes(searchLower) ||
        activity.checkpointName.toLowerCase().includes(searchLower) ||
        activity.roundId.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }

    setFilteredActivities(filtered);
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleAcknowledgeAlert = (activityId) => {
    // In a real app, this would update the activity in the database
    console.log(`Acknowledging alert for activity ${activityId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Security Activities</h1>
      </div>

      {/* Stats Section */}
      <ActivityStats
        totalActivitiesToday={totalActivitiesToday}
        latePatrolAlerts={latePatrolAlerts}
        emergencyAlerts={emergencyAlerts}
        violationsCount={violationsCount}
      />

      {/* Filters Section */}
      <div className="mt-6 mb-6">
        <ActivityFilters onFilter={handleFilter} />
      </div>

      {/* Table Section */}
      <ActivitiesTable
        activities={filteredActivities}
        onViewDetails={handleViewDetails}
        onAcknowledgeAlert={handleAcknowledgeAlert}
      />

      {/* Details Modal */}
      {isModalOpen && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={closeModal}
        />
      )}
    </div>
  );
}