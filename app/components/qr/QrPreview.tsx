"use client";

import { useState, useEffect } from "react";
import { QRCode } from "@/app/dashboard/qr-crud/page";

interface QrPreviewProps {
  qr: QRCode;
  onClose: () => void;
}

export default function QrPreview({ qr, onClose }: QrPreviewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  useEffect(() => {
    // Generate QR code using a simple data URL
    // In a real app, you would use a library like qrcode.js
    const generateQrCode = () => {
      // This is a placeholder for QR code generation
      // In a real implementation, you would use a QR code library
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Fill with white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 200, 200);
        
        // Draw a simple placeholder pattern
        ctx.fillStyle = "#000000";
        const cellSize = 10;
        const cells = 20;
        
        // Create a simple pattern based on the QR code ID
        for (let i = 0; i < cells; i++) {
          for (let j = 0; j < cells; j++) {
            // Use the QR code ID to determine if a cell should be filled
            const charIndex = (i * cells + j) % qr.codeId.length;
            const charCode = qr.codeId.charCodeAt(charIndex);
            
            if (charCode % 2 === 0) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }
        
        // Add position markers (simplified)
        ctx.fillStyle = "#000000";
        // Top-left
        ctx.fillRect(0, 0, 70, 70);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(10, 10, 50, 50);
        ctx.fillStyle = "#000000";
        ctx.fillRect(20, 20, 30, 30);
        
        // Top-right
        ctx.fillStyle = "#000000";
        ctx.fillRect(130, 0, 70, 70);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(140, 10, 50, 50);
        ctx.fillStyle = "#000000";
        ctx.fillRect(150, 20, 30, 30);
        
        // Bottom-left
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 130, 70, 70);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(10, 140, 50, 50);
        ctx.fillStyle = "#000000";
        ctx.fillRect(20, 150, 30, 30);
        
        // Convert canvas to data URL
        setQrCodeUrl(canvas.toDataURL());
      }
    };
    
    generateQrCode();
  }, [qr.codeId]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${qr.name.replace(/\s+/g, "-")}-QR.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code: ${qr.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
              }
              .qr-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 20px;
              }
              .qr-info {
                margin-top: 10px;
                text-align: center;
              }
              .qr-name {
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 5px;
              }
              .qr-code {
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="QR Code for ${qr.name}" />
              <div class="qr-info">
                <div class="qr-name">${qr.name}</div>
                <div class="qr-code">${qr.codeId}</div>
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            QR Code Preview
          </h3>
          
          <div className="flex flex-col items-center">
            <div className="border-2 border-gray-200 p-4 rounded-lg mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Generating QR Code...</span>
                </div>
              )}
            </div>
            
            <div className="text-left w-full mb-4">
              <div className="mb-2">
                <span className="font-semibold">QR Name:</span> {qr.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">QR Code ID:</span> {qr.codeId}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Location:</span> {qr.location.building}, {qr.location.floor}, {qr.location.area}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Download QR (PNG)
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Print QR
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}