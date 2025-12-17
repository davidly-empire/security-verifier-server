"use client";

import React, { useState } from "react";

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

interface ScanPointFormProps {
  scanPoint: ScanPoint | null;
  onClose: () => void;
  onSubmit: (data: Partial<ScanPoint>) => void;
}

export const ScanPointForm = ({
  scanPoint,
  onClose,
  onSubmit,
}: ScanPointFormProps) => {
  const [formData, setFormData] = useState({
    name: scanPoint?.name || "",
    code: scanPoint?.code || "",
    building: scanPoint?.location.building || "",
    area: scanPoint?.location.area || "",
    floor: scanPoint?.location.floor || "",
    status: scanPoint?.status || "Active",
    sequenceOrder: scanPoint?.sequenceOrder || 1,
    required: scanPoint?.required || false,
    timeFrom: scanPoint?.patrolLogic.expectedScanTimeWindow.from || "",
    timeTo: scanPoint?.patrolLogic.expectedScanTimeWindow.to || "",
    minimumTimeGap: scanPoint?.patrolLogic.minimumTimeGap || 0,
    gpsValidation: scanPoint?.validationControls.gpsValidation || false,
    allowedRadius: scanPoint?.validationControls.allowedRadius || 0,
    scanCooldown: scanPoint?.validationControls.scanCooldown || 0,
    offlineScanAllowed: scanPoint?.validationControls.offlineScanAllowed || false,
    allowIssueReporting: scanPoint?.issueReporting.allowIssueReporting || false,
    issueTypes: scanPoint?.issueReporting.issueTypes || [],
    photoRequired: scanPoint?.issueReporting.photoRequired || "No",
    assignedRoute: scanPoint?.adminControls.assignedRoute || "",
    priorityLevel: scanPoint?.adminControls.priorityLevel || "Low",
  });

  const issueTypeOptions = [
    "Light not working",
    "Door unlocked",
    "Suspicious activity",
    "Fire hazard",
  ];

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      code: formData.code,
      location: {
        building: formData.building,
        area: formData.area,
        floor: formData.floor,
      },
      status: formData.status,
      sequenceOrder: formData.sequenceOrder,
      required: formData.required,
      patrolLogic: {
        expectedScanTimeWindow: {
          from: formData.timeFrom,
          to: formData.timeTo,
        },
        minimumTimeGap: formData.minimumTimeGap,
      },
      validationControls: {
        gpsValidation: formData.gpsValidation,
        allowedRadius: formData.allowedRadius,
        scanCooldown: formData.scanCooldown,
        offlineScanAllowed: formData.offlineScanAllowed,
      },
      issueReporting: {
        allowIssueReporting: formData.allowIssueReporting,
        issueTypes: formData.issueTypes,
        photoRequired: formData.photoRequired,
      },
      adminControls: {
        assignedRoute: formData.assignedRoute,
        priorityLevel: formData.priorityLevel,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-4xl h-[100dvh] md:h-auto md:max-h-[90vh] rounded-t-xl md:rounded-xl flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {scanPoint ? "Edit Scan Point" : "Add Scan Point"}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
          <Section title="Basic Info">
            <Grid>
              <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="QR Code" name="code" value={formData.code} onChange={handleChange} />
              <Input label="Building" name="building" value={formData.building} onChange={handleChange} />
              <Input label="Area" name="area" value={formData.area} onChange={handleChange} />
              <Input label="Floor" name="floor" value={formData.floor} onChange={handleChange} />
            </Grid>
          </Section>

          <Section title="Patrol Rules">
            <Grid>
              <Input type="time" label="From" name="timeFrom" value={formData.timeFrom} onChange={handleChange} />
              <Input type="time" label="To" name="timeTo" value={formData.timeTo} onChange={handleChange} />
              <Input type="number" label="Min Time Gap (min)" name="minimumTimeGap" value={formData.minimumTimeGap} onChange={handleChange} />
            </Grid>
          </Section>

          <Section title="Admin Controls">
            <Grid>
              <Input label="Assigned Route" name="assignedRoute" value={formData.assignedRoute} onChange={handleChange} />
              <Select label="Priority" name="priorityLevel" value={formData.priorityLevel} onChange={handleChange} options={["Low","Medium","High"]} />
            </Grid>
          </Section>
        </form>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button type="button" onClick={onClose} className="w-full border rounded-md py-2">
            Cancel
          </button>
          <button type="submit" form="form" className="w-full bg-blue-600 text-white rounded-md py-2">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small helpers (inline, no new files) ---------- */

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="font-medium mb-3 border-b pb-1">{title}</h3>
    {children}
  </div>
);

const Grid = ({ children }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-1 w-full border rounded-md px-3 py-2" />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-1 w-full border rounded-md px-3 py-2">
      {options.map((o: string) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);
