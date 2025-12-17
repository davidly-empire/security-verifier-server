// app/dashboard/scan-points/components/StatusBadge.tsx
"use client";

import React from "react";

interface StatusBadgeProps {
  status: "Active" | "Inactive";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};