"use client";

import { QRCode } from "@/app/dashboard/qr-crud/page";
import QrActions from "./QrActions";

interface QrTableProps {
  qrCodes: QRCode[];
  onEdit: (qr: QRCode) => void;
  onView: (qr: QRCode) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function QrTable({
  qrCodes,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: QrTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                QR Name
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
                Sequence Order
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
            {qrCodes.map((qr) => (
              <tr key={qr.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {qr.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{qr.location.building}</div>
                    <div className="text-xs text-gray-400">
                      {qr.location.floor} / {qr.location.area}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {qr.codeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {qr.sequenceOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      qr.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {qr.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{qr.tracking.lastScannedAt}</div>
                    <div className="text-xs text-gray-400">
                      by {qr.tracking.lastScannedBy}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <QrActions
                    qr={qr}
                    onEdit={onEdit}
                    onView={onView}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {qrCodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No QR codes found matching your filters.
        </div>
      )}
    </div>
  );
}