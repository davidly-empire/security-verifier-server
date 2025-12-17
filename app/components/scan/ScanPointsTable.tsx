// app/dashboard/scan-points/components/ScanPointsTable.tsx
"use client";

import React from "react";
import { StatusBadge } from "./StatusBadge";

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

interface ScanPointsTableProps {
  scanPoints: ScanPoint[];
  onEdit: (scanPoint: ScanPoint) => void;
  onDisable: (id: string) => void;
}

export const ScanPointsTable: React.FC<ScanPointsTableProps> = ({
  scanPoints,
  onEdit,
  onDisable,
}) => {
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                QR Code ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sequence
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Time Window
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Scanned
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scanPoints.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  No scan points found
                </td>
              </tr>
            ) : (
              scanPoints.map((scanPoint) => (
                <tr key={scanPoint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{scanPoint.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {scanPoint.location.building} - {scanPoint.location.area}
                    </div>
                    <div className="text-xs text-gray-400">{scanPoint.location.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scanPoint.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scanPoint.sequenceOrder}</div>
                    <div className="text-xs text-gray-400">
                      {scanPoint.required ? "Required" : "Optional"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {scanPoint.patrolLogic.expectedScanTimeWindow.from} -{" "}
                      {scanPoint.patrolLogic.expectedScanTimeWindow.to}
                    </div>
                    <div className="text-xs text-gray-400">
                      Gap: {scanPoint.patrolLogic.minimumTimeGap} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(
                        scanPoint.adminControls.priorityLevel
                      )}`}
                    >
                      {scanPoint.adminControls.priorityLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={scanPoint.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scanPoint.tracking.lastScannedAt}</div>
                    <div className="text-xs text-gray-400">{scanPoint.tracking.lastScannedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(scanPoint)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    {scanPoint.status === "Active" && (
                      <button
                        onClick={() => onDisable(scanPoint.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};