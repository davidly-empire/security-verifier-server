"use client";

import { QRCodeSVG } from "qrcode.react";
import { QRCode as QRDataType } from "@/app/dashboard/qr-crud/page";
import { Printer, X, Hash, Info } from "lucide-react";

interface QrPreviewProps {
  qr: QRDataType;
  onClose: () => void;
}

export default function QrPreview({ qr, onClose }: QrPreviewProps) {
  // -------------------------------------------------------
  // STRATEGY: RAW ID ONLY
  // The QR code will contain ONLY the numeric or string ID.
  // Scanning this will simply display the ID value.
  // -------------------------------------------------------
  const qrData = String(qr.qr_id || "0");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 print:hidden"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden print:shadow-none print:w-full print:max-w-none print:relative">
        
        {/* Left Side: QR Display */}
        <div className="w-full md:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center border-r border-slate-100 print:bg-white">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 print:shadow-none print:border-2">
            <QRCodeSVG
              value={qrData}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level={"H"}
              includeMargin={false}
            />
          </div>
          <div className="mt-6 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Encoded Value</span>
            <p className="text-3xl font-mono font-bold text-blue-600">{qrData}</p>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col bg-white">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Scan Preview</h3>
              <p className="text-xs text-slate-500 mt-1">Direct ID Encoding</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900 uppercase">Scanner Behavior</span>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                    Scanning this code will return the raw value <code className="font-bold">"{qrData}"</code>. 
                    No URL or external browser redirect is included.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-xs text-slate-500 font-medium">Point Name</span>
                    <span className="text-sm font-bold text-slate-800">{qr.qr_name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-xs text-slate-500 font-medium">Factory Code</span>
                    <span className="text-sm font-bold text-slate-800">{qr.factory_code}</span>
                </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\:relative, .print\:relative * { visibility: visible; }
          .print\:relative { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}