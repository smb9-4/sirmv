import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  DownloadCloud,
  Printer,
  Table,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  Battery,
  Users,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';

interface ReportGenerationViewProps {
  records: StudentTabletRecord[];
}

export default function ReportGenerationView({ records }: ReportGenerationViewProps) {
  const [selectedReportType, setSelectedReportType] = useState<string>('Overall Examination Report');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    { id: 'Overall Examination Report', desc: 'Comprehensive examination health score, completion metrics, and participation analytics.' },
    { id: 'Student-wise Examination Report', desc: '100-student detailed attempt list, question numbers, skipped counts, and submission flags.' },
    { id: 'Device Health Report', desc: 'Hardware telemetry, CPU utilization, thermal readings, RAM, and MDM kiosk status.' },
    { id: 'Battery & Power Audit Report', desc: 'Discharge rates, battery health status, critical battery events, and charger logs.' },
    { id: 'Security Incident Report', desc: 'Cryptographic tamper alerts, rooted signatures, USB attachment attempts, and quarantine logs.' },
    { id: 'Attendance & Verification Report', desc: 'Biometric registration time, tablet presence verification, and roll call records.' },
    { id: 'Academic Performance Report', desc: 'Subject-wise diagnostic accuracy across Physics, Chemistry, Math, and Biology.' },
  ];

  const handleDownloadCSV = (reportName: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);

      let headers: string[] = [];
      let rows: (string | number)[][] = [];

      if (reportName.includes('Student-wise') || reportName.includes('Overall')) {
        headers = ['USN', 'Student Name', 'Tablet ID', 'Battery %', 'Status', 'Current Q', 'Attempted', 'Remaining', 'Submission', 'Last Activity'];
        rows = records.map(r => [
          r.usn,
          `"${r.studentName}"`,
          r.assignedTabletId,
          r.batteryPercentage,
          r.deviceStatus,
          r.currentQuestion,
          r.questionsAttempted,
          r.questionsRemaining,
          r.submissionStatus,
          `"${r.lastActivity}"`,
        ]);
      } else if (reportName.includes('Device') || reportName.includes('Battery')) {
        headers = ['Tablet ID', 'Assigned Student', 'Battery %', 'Battery Health %', 'CPU %', 'RAM %', 'Device Temp °C', 'Signal RSSI', 'OS Version'];
        rows = records.map(r => [
          r.assignedTabletId,
          `"${r.studentName}"`,
          r.batteryPercentage,
          r.batteryHealth,
          r.cpuUsage,
          r.ramUsage,
          r.deviceTemperature,
          r.networkStrengthDbm,
          `"${r.osVersion}"`,
        ]);
      } else {
        headers = ['USN', 'Student Name', 'Tablet ID', 'Attendance Status', 'Check-In Time', 'BLE Beacon Verified', 'Physics %', 'Math %'];
        rows = records.map(r => [
          r.usn,
          `"${r.studentName}"`,
          r.assignedTabletId,
          r.attendanceStatus,
          `"${r.checkInTime}"`,
          r.tabletPresenceVerified ? 'Yes' : 'No',
          r.physicsAccuracy,
          r.mathAccuracy,
        ]);
      }

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SirMV_${reportName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider flex items-center gap-1.5">
              <FileText size={12} />
              EXECUTIVE COMPLIANCE REPORTS
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Formatted CSV & Printable PDF Generation
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Central Intelligence Report Generator
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Produce formal institutional reports for examination boards, hardware warranty audits, and state educational authorities.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-2 border border-stone-300 transition apple-button shrink-0 shadow-2xs"
        >
          <Printer size={15} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Reports Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((rep, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2 }}
            className={`p-6 rounded-3xl border bg-white shadow-xs flex flex-col justify-between space-y-4 transition ${
              selectedReportType === rep.id ? 'border-[#650000] ring-2 ring-[#650000]/15' : 'border-stone-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-stone-100 text-[#650000] flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready to Export
                </span>
              </div>

              <strong className="text-base font-black text-stone-900 block leading-snug">
                {rep.id}
              </strong>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed font-medium">
                {rep.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleDownloadCSV(rep.id)}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-[#650000] hover:bg-[#800000] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
              >
                <DownloadCloud size={14} />
                <span>Download CSV</span>
              </button>

              <button
                onClick={() => {
                  setSelectedReportType(rep.id);
                  handlePrint();
                }}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
              >
                <span>Print PDF</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

