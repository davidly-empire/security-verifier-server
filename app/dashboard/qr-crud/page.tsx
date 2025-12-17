"use client";

import { useState, useEffect } from "react";
import QrTable from "@/app/components/qr/QrTable";
import QrForm from "@/app/components/qr/QrForm";
import QrPreview from "@/app/components/qr/QrPreview";
import QrFilters from "@/app/components/qr/QrFilters";

interface QRCode {
  id: string;
  name: string;
  codeId: string;
  location: {
    building: string;
    floor: string;
    area: string;
  };
  status: "Active" | "Inactive";
  required: "Yes" | "No";
  sequenceOrder: number;
  scanLogic: {
    expectedScanTimeWindow: {
      from: string;
      to: string;
    };
    graceTime: number;
  };
  tracking: {
    lastScannedAt: string;
    lastScannedBy: string;
    totalScans: number;
  };
  adminControls: {
    assignedRoute: string;
  };
}

// Mock data
const mockQRCodes: QRCode[] = [
  {
    id: "1",
    name: "Main Entrance",
    codeId: "QR-001-MAIN-ENTRANCE",
    location: {
      building: "Building A",
      floor: "Ground Floor",
      area: "Entrance Lobby",
    },
    status: "Active",
    required: "Yes",
    sequenceOrder: 1,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "08:00",
        to: "10:00",
      },
      graceTime: 15,
    },
    tracking: {
      lastScannedAt: "2023-11-15 09:15:32",
      lastScannedBy: "John Doe",
      totalScans: 245,
    },
    adminControls: {
      assignedRoute: "Morning Patrol Route",
    },
  },
  {
    id: "2",
    name: "Server Room",
    codeId: "QR-002-SERVER-ROOM",
    location: {
      building: "Building A",
      floor: "2nd Floor",
      area: "IT Department",
    },
    status: "Active",
    required: "Yes",
    sequenceOrder: 2,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "10:00",
        to: "12:00",
      },
      graceTime: 10,
    },
    tracking: {
      lastScannedAt: "2023-11-15 10:32:18",
      lastScannedBy: "Jane Smith",
      totalScans: 189,
    },
    adminControls: {
      assignedRoute: "Morning Patrol Route",
    },
  },
  {
    id: "3",
    name: "Emergency Exit",
    codeId: "QR-003-EMERGENCY-EXIT",
    location: {
      building: "Building B",
      floor: "Ground Floor",
      area: "West Wing",
    },
    status: "Active",
    required: "Yes",
    sequenceOrder: 3,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "12:00",
        to: "14:00",
      },
      graceTime: 5,
    },
    tracking: {
      lastScannedAt: "2023-11-14 13:45:22",
      lastScannedBy: "Mike Johnson",
      totalScans: 312,
    },
    adminControls: {
      assignedRoute: "Afternoon Patrol Route",
    },
  },
  {
    id: "4",
    name: "Cafeteria",
    codeId: "QR-004-CAFETERIA",
    location: {
      building: "Building B",
      floor: "1st Floor",
      area: "Central Area",
    },
    status: "Inactive",
    required: "No",
    sequenceOrder: 4,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "14:00",
        to: "16:00",
      },
      graceTime: 20,
    },
    tracking: {
      lastScannedAt: "2023-11-10 15:20:45",
      lastScannedBy: "Sarah Williams",
      totalScans: 156,
    },
    adminControls: {
      assignedRoute: "Afternoon Patrol Route",
    },
  },
  {
    id: "5",
    name: "Parking Lot A",
    codeId: "QR-005-PARKING-A",
    location: {
      building: "Building C",
      floor: "Ground Floor",
      area: "Parking Area",
    },
    status: "Active",
    required: "Yes",
    sequenceOrder: 5,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "16:00",
        to: "18:00",
      },
      graceTime: 15,
    },
    tracking: {
      lastScannedAt: "2023-11-15 16:10:33",
      lastScannedBy: "Robert Brown",
      totalScans: 278,
    },
    adminControls: {
      assignedRoute: "Evening Patrol Route",
    },
  },
];

const buildings = ["Building A", "Building B", "Building C"];
const floors = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];
const routes = [
  "Morning Patrol Route",
  "Afternoon Patrol Route",
  "Evening Patrol Route",
  "Night Patrol Route",
];

export default function QrCrudPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>(mockQRCodes);
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCode[]>(mockQRCodes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentQr, setCurrentQr] = useState<QRCode | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filters, setFilters] = useState({
    status: "All",
    building: "All",
    floor: "All",
    search: "",
  });

  useEffect(() => {
    let filtered = [...qrCodes];

    // Filter by status
    if (filters.status !== "All") {
      filtered = filtered.filter((qr) => qr.status === filters.status);
    }

    // Filter by building
    if (filters.building !== "All") {
      filtered = filtered.filter(
        (qr) => qr.location.building === filters.building
      );
    }

    // Filter by floor
    if (filters.floor !== "All") {
      filtered = filtered.filter(
        (qr) => qr.location.floor === filters.floor
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (qr) =>
          qr.name.toLowerCase().includes(searchTerm) ||
          qr.codeId.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredQrCodes(filtered);
  }, [qrCodes, filters]);

  const handleAddQr = () => {
    setCurrentQr(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditQr = (qr: QRCode) => {
    setCurrentQr(qr);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewQr = (qr: QRCode) => {
    setCurrentQr(qr);
    setIsPreviewOpen(true);
  };

  const handleSaveQr = (qrData: Partial<QRCode>) => {
    if (isEditMode && currentQr) {
      // Update existing QR
      setQrCodes((prevQrCodes) =>
        prevQrCodes.map((qr) =>
          qr.id === currentQr.id ? { ...qr, ...qrData } : qr
        )
      );
    } else {
      // Add new QR
      const newQr: QRCode = {
        id: Date.now().toString(),
        codeId: `QR-${Date.now()}-${qrData.name?.replace(/\s+/g, "-").toUpperCase()}`,
        name: qrData.name || "",
        location: qrData.location || {
          building: "",
          floor: "",
          area: "",
        },
        status: qrData.status || "Active",
        required: qrData.required || "Yes",
        sequenceOrder: qrCodes.length + 1,
        scanLogic: qrData.scanLogic || {
          expectedScanTimeWindow: {
            from: "09:00",
            to: "17:00",
          },
          graceTime: 15,
        },
        tracking: {
          lastScannedAt: "Never",
          lastScannedBy: "None",
          totalScans: 0,
        },
        adminControls: {
          assignedRoute: qrData.adminControls?.assignedRoute || "",
        },
      };
      setQrCodes([...qrCodes, newQr]);
    }
    setIsFormOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setQrCodes((prevQrCodes) =>
      prevQrCodes.map((qr) =>
        qr.id === id
          ? { ...qr, status: qr.status === "Active" ? "Inactive" : "Active" }
          : qr
      )
    );
  };

  const handleDeleteQr = (id: string) => {
    if (window.confirm("Are you sure you want to delete this QR code?")) {
      setQrCodes((prevQrCodes) => prevQrCodes.filter((qr) => qr.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            QR Codes
          </h1>
          <button
            onClick={handleAddQr}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add QR
          </button>
        </div>

        {/* Filters Section */}
        <QrFilters
          filters={filters}
          setFilters={setFilters}
          buildings={buildings}
          floors={floors}
        />

        {/* Table Section */}
        <QrTable
          qrCodes={filteredQrCodes}
          onEdit={handleEditQr}
          onView={handleViewQr}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteQr}
        />

        {/* Form Modal */}
        {isFormOpen && (
          <QrForm
            qr={currentQr}
            isEditMode={isEditMode}
            onSave={handleSaveQr}
            onClose={() => setIsFormOpen(false)}
            buildings={buildings}
            floors={floors}
            routes={routes}
          />
        )}

        {/* Preview Modal */}
        {isPreviewOpen && currentQr && (
          <QrPreview
            qr={currentQr}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </div>
    </div>
  );
}