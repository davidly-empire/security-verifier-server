"use client";

import { useState, useEffect } from "react";
import { QRCode } from "@/app/dashboard/qr-crud/page";

interface QrFormProps {
  qr: QRCode | null;
  isEditMode: boolean;
  onSave: (qrData: Partial<QRCode>) => void;
  onClose: () => void;
  buildings: string[];
  floors: string[];
  routes: string[];
}

export default function QrForm({
  qr,
  isEditMode,
  onSave,
  onClose,
  buildings,
  floors,
  routes,
}: QrFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: {
      building: "",
      floor: "",
      area: "",
    },
    status: "Active" as "Active" | "Inactive",
    required: "Yes" as "Yes" | "No",
    sequenceOrder: 1,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "09:00",
        to: "17:00",
      },
      graceTime: 15,
    },
    adminControls: {
      assignedRoute: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (qr && isEditMode) {
      setFormData({
        name: qr.name,
        location: { ...qr.location },
        status: qr.status,
        required: qr.required,
        sequenceOrder: qr.sequenceOrder,
        scanLogic: { ...qr.scanLogic },
        adminControls: { ...qr.adminControls },
      });
    }
  }, [qr, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (child.includes(".")) {
        const [grandParent, parent, child] = name.split(".");
        setFormData((prev) => ({
          ...prev,
          [grandParent]: {
            ...prev[grandParent as keyof typeof prev],
            [parent]: {
              ...(prev[grandParent as keyof typeof prev] as any)[parent],
              [child]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as any),
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "QR Name is required";
    }
    
    if (!formData.location.building) {
      newErrors["location.building"] = "Building is required";
    }
    
    if (!formData.location.floor) {
      newErrors["location.floor"] = "Floor is required";
    }
    
    if (!formData.location.area.trim()) {
      newErrors["location.area"] = "Area is required";
    }
    
    if (!formData.adminControls.assignedRoute) {
      newErrors["adminControls.assignedRoute"] = "Assigned Route is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isEditMode ? "Edit QR Code" : "Add New QR Code"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Basic Info</h4>
              <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    QR Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="sequenceOrder" className="block text-sm font-medium text-gray-700">
                    Sequence Order
                  </label>
                  <input
                    type="number"
                    id="sequenceOrder"
                    name="sequenceOrder"
                    value={formData.sequenceOrder}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Location</h4>
              <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="location.building" className="block text-sm font-medium text-gray-700">
                    Building
                  </label>
                  <select
                    id="location.building"
                    name="location.building"
                    value={formData.location.building}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors["location.building"] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Building</option>
                    {buildings.map((building) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                  {errors["location.building"] && (
                    <p className="mt-1 text-sm text-red-600">{errors["location.building"]}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location.floor" className="block text-sm font-medium text-gray-700">
                    Floor
                  </label>
                  <select
                    id="location.floor"
                    name="location.floor"
                    value={formData.location.floor}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors["location.floor"] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Floor</option>
                    {floors.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                  {errors["location.floor"] && (
                    <p className="mt-1 text-sm text-red-600">{errors["location.floor"]}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location.area" className="block text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <input
                    type="text"
                    id="location.area"
                    name="location.area"
                    value={formData.location.area}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors["location.area"] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors["location.area"] && (
                    <p className="mt-1 text-sm text-red-600">{errors["location.area"]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Patrol Rules Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Patrol Rules</h4>
              <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="scanLogic.expectedScanTimeWindow.from" className="block text-sm font-medium text-gray-700">
                    Expected Scan From
                  </label>
                  <input
                    type="time"
                    id="scanLogic.expectedScanTimeWindow.from"
                    name="scanLogic.expectedScanTimeWindow.from"
                    value={formData.scanLogic.expectedScanTimeWindow.from}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="scanLogic.expectedScanTimeWindow.to" className="block text-sm font-medium text-gray-700">
                    Expected Scan To
                  </label>
                  <input
                    type="time"
                    id="scanLogic.expectedScanTimeWindow.to"
                    name="scanLogic.expectedScanTimeWindow.to"
                    value={formData.scanLogic.expectedScanTimeWindow.to}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="scanLogic.graceTime" className="block text-sm font-medium text-gray-700">
                    Grace Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="scanLogic.graceTime"
                    name="scanLogic.graceTime"
                    value={formData.scanLogic.graceTime}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Status</h4>
              <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="required" className="block text-sm font-medium text-gray-700">
                    Required
                  </label>
                  <select
                    id="required"
                    name="required"
                    value={formData.required}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Admin Controls Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Admin Controls</h4>
              <div>
                <label htmlFor="adminControls.assignedRoute" className="block text-sm font-medium text-gray-700">
                  Assigned Route / Patrol
                </label>
                <select
                  id="adminControls.assignedRoute"
                  name="adminControls.assignedRoute"
                  value={formData.adminControls.assignedRoute}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors["adminControls.assignedRoute"] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
                {errors["adminControls.assignedRoute"] && (
                  <p className="mt-1 text-sm text-red-600">{errors["adminControls.assignedRoute"]}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}