"use client";

import { useState } from "react";
import { QRCode } from "@/app/dashboard/qr-crud/page";

interface QrActionsProps {
  qr: QRCode;
  onEdit: (qr: QRCode) => void;
  onView: (qr: QRCode) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function QrActions({
  qr,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: QrActionsProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      
      {showActions && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onView(qr);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              View
            </button>
            <button
              onClick={() => {
                onEdit(qr);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onToggleStatus(qr.id);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              {qr.status === "Active" ? "Disable" : "Enable"}
            </button>
            <button
              onClick={() => {
                onDelete(qr.id);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}