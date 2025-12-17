"use client";

import { useEffect, useState } from "react";
import { ScanPointsTable } from "@/app/components/scan/ScanPointsTable";
import { ScanPointForm } from "@/app/components/scan/ScanPointForm";

interface ScanPoint {
  id: string;
  name: string;
  code: string;
  location: {
    building: string;
    area: string;
    floor: string;
  };
  status: "Active" | "Inactive";
  sequenceOrder: number;
  required: boolean;
  patrolLogic: {
    expectedScanTimeWindow: {
      from: string;
      to: string;
    };
    minimumTimeGap: number;
  };
  validationControls: {
    gpsValidation: boolean;
    allowedRadius: number;
    scanCooldown: number;
    offlineScanAllowed: boolean;
  };
  issueReporting: {
    allowIssueReporting: boolean;
    issueTypes: string[];
    photoRequired: "Yes" | "Optional" | "No";
  };
  tracking: {
    lastScannedAt: string;
    lastScannedBy: string;
    totalScans: number;
    missedScans: number;
  };
  adminControls: {
    assignedRoute: string;
    priorityLevel: "Low" | "Medium" | "High";
  };
}

const mockScanPoints: ScanPoint[] = [
  {
    id: "1",
    name: "Main Entrance",
    code: "QR001",
    location: {
      building: "Building A",
      area: "Entrance",
      floor: "Ground Floor",
    },
    status: "Active",
    sequenceOrder: 1,
    required: true,
    patrolLogic: {
      expectedScanTimeWindow: { from: "08:00", to: "10:00" },
      minimumTimeGap: 30,
    },
    validationControls: {
      gpsValidation: true,
      allowedRadius: 10,
      scanCooldown: 5,
      offlineScanAllowed: false,
    },
    issueReporting: {
      allowIssueReporting: true,
      issueTypes: ["Light not working", "Door unlocked"],
      photoRequired: "Optional",
    },
    tracking: {
      lastScannedAt: "2023-11-15 09:30",
      lastScannedBy: "John Doe",
      totalScans: 45,
      missedScans: 2,
    },
    adminControls: {
      assignedRoute: "Morning Patrol",
      priorityLevel: "High",
    },
  },
  {
    id: "2",
    name: "Server Room",
    code: "QR002",
    location: {
      building: "Building B",
      area: "IT",
      floor: "2nd Floor",
    },
    status: "Active",
    sequenceOrder: 2,
    required: true,
    patrolLogic: {
      expectedScanTimeWindow: { from: "10:00", to: "12:00" },
      minimumTimeGap: 60,
    },
    validationControls: {
      gpsValidation: true,
      allowedRadius: 5,
      scanCooldown: 10,
      offlineScanAllowed: false,
    },
    issueReporting: {
      allowIssueReporting: true,
      issueTypes: ["Fire hazard", "Suspicious activity"],
      photoRequired: "Yes",
    },
    tracking: {
      lastScannedAt: "2023-11-15 11:15",
      lastScannedBy: "Jane Smith",
      totalScans: 32,
      missedScans: 1,
    },
    adminControls: {
      assignedRoute: "Morning Patrol",
      priorityLevel: "High",
    },
  },
  {
    id: "3",
    name: "Emergency Exit",
    code: "QR003",
    location: {
      building: "Building A",
      area: "West Wing",
      floor: "Ground Floor",
    },
    status: "Inactive",
    sequenceOrder: 3,
    required: false,
    patrolLogic: {
      expectedScanTimeWindow: { from: "12:00", to: "14:00" },
      minimumTimeGap: 45,
    },
    validationControls: {
      gpsValidation: false,
      allowedRadius: 15,
      scanCooldown: 5,
      offlineScanAllowed: true,
    },
    issueReporting: {
      allowIssueReporting: false,
      issueTypes: [],
      photoRequired: "No",
    },
    tracking: {
      lastScannedAt: "2023-11-10 13:20",
      lastScannedBy: "Mike Johnson",
      totalScans: 28,
      missedScans: 5,
    },
    adminControls: {
      assignedRoute: "Afternoon Patrol",
      priorityLevel: "Low",
    },
  },
];

export default function ScanPointsPage() {
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>(mockScanPoints);
  const [filteredScanPoints, setFilteredScanPoints] = useState<ScanPoint[]>(mockScanPoints);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScanPoint, setEditingScanPoint] = useState<ScanPoint | null>(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    let data = [...scanPoints];

    if (statusFilter !== "All") {
      data = data.filter(sp => sp.status === statusFilter);
    }

    if (locationFilter !== "All") {
      data = data.filter(
        sp => `${sp.location.building} - ${sp.location.area}` === locationFilter
      );
    }

    if (priorityFilter !== "All") {
      data = data.filter(
        sp => sp.adminControls.priorityLevel === priorityFilter
      );
    }

    setFilteredScanPoints(data);
  }, [scanPoints, statusFilter, locationFilter, priorityFilter]);

  const uniqueLocations = Array.from(
    new Set(scanPoints.map(sp => `${sp.location.building} - ${sp.location.area}`))
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan Points</h1>
        <button
          onClick={() => {
            setEditingScanPoint(null);
            setIsFormOpen(true);
          }}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Scan Point
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="border p-2 rounded">
          <option value="All">All Locations</option>
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="border p-2 rounded">
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <ScanPointsTable
        scanPoints={filteredScanPoints}
        onEdit={setEditingScanPoint}
        onDisable={(id) =>
          setScanPoints(prev =>
            prev.map(sp => sp.id === id ? { ...sp, status: "Inactive" } : sp)
          )
        }
      />

      {isFormOpen && (
        <ScanPointForm
          scanPoint={editingScanPoint}
          onClose={() => setIsFormOpen(false)}
          onSubmit={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
