"use client";

import React from "react";
import { StatusBadge } from "./StatusBadge";

export interface ScanPoint {
  id: string;
  factory_id: string;
  scan_point_code: string;
  scan_point_name: string;
  scan_type?: string | null;
  floor?: string | null;
  area?: string | null;
  location?: string | null;
  risk_level?: "Low" | "Medium" | "High" | null;
  is_active: boolean;
  created_at?: string;
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
  const getRiskColor = (risk?: string | null) => {
    switch (risk) {
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
    <div className="bg-white shadow rounded-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Factory ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Scan Type</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {scanPoints.length === 0 ? (
            <tr>
              <td colSpan={12} className="px-4 py-2 text-center text-sm text-gray-500">
                No scan points found
              </td>
            </tr>
          ) : (
            scanPoints.map((sp) => (
              <tr key={sp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{sp.id}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.factory_id}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.scan_point_code}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.scan_point_name}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.scan_type || "—"}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.floor || "—"}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.area || "—"}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{sp.location || "—"}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(sp.risk_level)}`}>
                    {sp.risk_level || "—"}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <StatusBadge status={sp.is_active ? "Active" : "Inactive"} />
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {sp.created_at ? new Date(sp.created_at).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-2 text-right text-sm font-medium">
                  <button onClick={() => onEdit(sp)} className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  {sp.is_active && (
                    <button onClick={() => onDisable(sp.id)} className="text-red-600 hover:text-red-900">
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
  );
};
