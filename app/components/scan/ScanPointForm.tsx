"use client";

import React, { useState } from "react";

/**
 * ✅ DB ALIGNED ScanPoint
 */
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
    factory_id: scanPoint?.factory_id || "",
    scan_point_name: scanPoint?.scan_point_name || "",
    scan_point_code: scanPoint?.scan_point_code || "",
    scan_type: scanPoint?.scan_type || "",
    location: scanPoint?.location || "",
    area: scanPoint?.area || "",
    floor: scanPoint?.floor || "",
    risk_level: scanPoint?.risk_level || "Low",
    is_active: scanPoint?.is_active ?? true,
  });

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      factory_id: formData.factory_id,
      scan_point_name: formData.scan_point_name,
      scan_point_code: formData.scan_point_code,
      scan_type: formData.scan_type,
      location: formData.location,
      area: formData.area,
      floor: formData.floor,
      risk_level: formData.risk_level,
      is_active: formData.is_active,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-3xl h-[100dvh] md:h-auto md:max-h-[90vh] rounded-t-xl md:rounded-xl flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {scanPoint ? "Edit Scan Point" : "Add Scan Point"}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-6"
        >
          {/* Basic Info */}
          <Section title="Basic Info">
            <Grid>
              <Input
                label="Factory ID"
                name="factory_id"
                value={formData.factory_id}
                onChange={handleChange}
              />
              <Input
                label="Name"
                name="scan_point_name"
                value={formData.scan_point_name}
                onChange={handleChange}
              />
              <Input
                label="QR Code"
                name="scan_point_code"
                value={formData.scan_point_code}
                onChange={handleChange}
              />
              <Input
                label="Scan Type"
                name="scan_type"
                value={formData.scan_type}
                onChange={handleChange}
              />
              <Input
                label="Building"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <Input
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
              <Input
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </Grid>
          </Section>

          {/* Controls */}
          <Section title="Controls">
            <Grid>
              <Select
                label="Risk Level"
                name="risk_level"
                value={formData.risk_level}
                onChange={handleChange}
                options={["Low", "Medium", "High"]}
              />
              <Select
                label="Status"
                name="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>
                ) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.value === "true",
                  }))
                }
                options={["true", "false"]}
                optionLabels={{
                  true: "Active",
                  false: "Inactive",
                }}
              />
            </Grid>
          </Section>
        </form>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full border rounded-md py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Helpers ---------- */
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
    <input
      {...props}
      className="mt-1 w-full border rounded-md px-3 py-2"
    />
  </div>
);

const Select = ({ label, options, optionLabels, ...props }: any) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      {...props}
      className="mt-1 w-full border rounded-md px-3 py-2"
    >
      {options.map((o: string) => (
        <option key={o} value={o}>
          {optionLabels?.[o] ?? o}
        </option>
      ))}
    </select>
  </div>
);
