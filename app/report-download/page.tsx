"use client";

import { useState, useEffect, useRef } from "react";

import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getFactories } from "../api/factories.api";

import PatrolReportPDF from "../components/reports/PatrolReportPDF";
import ReportTable from "../components/reports/ReportTable";


// ===============================
// Types
// ===============================
type Factory = {
  factory_code: string;
  factory_name: string;
  factory_address?: string;
};


// ===============================
// Component
// ===============================
export default function ReportDownloadPage() {

  // -------------------------------
  // State
  // -------------------------------
  const [factories, setFactories] = useState<Factory[]>([]);

  const [factoryCode, setFactoryCode] = useState("");

  const [reportDate, setReportDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [report, setReport] = useState<PatrolReportItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [showPDF, setShowPDF] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);


  // ===============================
  // Load Factories
  // ===============================
  useEffect(() => {

    const loadFactories = async () => {

      try {

        const res = await getFactories();

        if (res?.data?.length) {

          setFactories(res.data);

          setFactoryCode(res.data[0].factory_code);
        }

      } catch (err) {

        console.error("Factory load error:", err);

      }
    };

    loadFactories();

  }, []);


  // ===============================
  // Fetch Report
  // ===============================
  const fetchReport = async () => {

    if (!factoryCode) return;

    setLoading(true);
    setError(null);
    setShowPDF(false);

    try {

      const data = await getPatrolReport(factoryCode, reportDate);

      console.log("REPORT DATA:", data); // debug

      setReport(data);

    } catch (err: any) {

      console.error(err);

      setError(err?.message || "Failed to fetch report");

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // Print
  // ===============================
  const printReport = () => {

    if (!printRef.current) return;

    const content = printRef.current.innerHTML;

    const win = window.open("", "_blank", "width=900,height=600");

    if (!win) return;


    const factoryName =
      factories.find((f) => f.factory_code === factoryCode)?.factory_name ||
      factoryCode;


    win.document.write(`
      <html>
        <head>
          <title>Patrol Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <h2>${factoryName} - ${reportDate}</h2>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };


  // ===============================
  // Prepare PDF
  // ===============================
  const preparePDF = () => {

    if (!report.length) {
      alert("Fetch report first");
      return;
    }

    setShowPDF(true);
  };


  // ===============================
  // Factory Info
  // ===============================
  const currentFactory = factories.find(
    (f) => f.factory_code === factoryCode
  );

  const factoryName = currentFactory?.factory_name || factoryCode;

  const factoryAddress = currentFactory?.factory_address || "N/A";


  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">
        Patrol Report
      </h1>


      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">


        {/* Factory */}
        <select
          className="border p-2 rounded"
          value={factoryCode}
          onChange={(e) => setFactoryCode(e.target.value)}
        >

          {factories.map((f) => (
            <option
              key={f.factory_code}
              value={f.factory_code}
            >
              {f.factory_name}
            </option>
          ))}

        </select>


        {/* Date */}
        <input
          type="date"
          className="border p-2 rounded"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
        />


        {/* Fetch */}
        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch
        </button>


        {/* Print */}
        <button
          onClick={printReport}
          disabled={!report.length}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700"
        >
          Print
        </button>


        {/* PDF */}
        <button
          onClick={preparePDF}
          disabled={!report.length}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-purple-700"
        >
          PDF
        </button>

      </div>


      {/* Status */}
      {loading && (
        <p className="text-slate-600">
          Loading report...
        </p>
      )}

      {error && (
        <p className="text-red-600 font-medium">
          {error}
        </p>
      )}


      {/* Table */}
      {!loading && !error && report.length > 0 && (

        <div ref={printRef}>
          <ReportTable logs={report} loading={loading} />
        </div>

      )}


      {/* Empty */}
      {!loading && !error && report.length === 0 && (

        <p className="text-gray-500">
          No records found
        </p>

      )}


      {/* PDF Generator */}
      {showPDF && (

        <PatrolReportPDF
          logs={report}
          factoryCode={factoryCode}
          factoryName={factoryName}
          factoryAddress={factoryAddress}
          reportDate={reportDate}
          generatedBy="System"
        />

      )}

    </div>
  );
}
