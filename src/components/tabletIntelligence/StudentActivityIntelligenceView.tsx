import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Eye,
  Tablet,
  User,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Compass,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';

interface StudentActivityIntelligenceViewProps {
  records: StudentTabletRecord[];
  onSelectStudent: (student: StudentTabletRecord) => void;
}

export default function StudentActivityIntelligenceView({
  records,
  onSelectStudent,
}: StudentActivityIntelligenceViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = records.filter(
    r =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedTabletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.usn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTabSwitches = records.reduce((acc, r) => acc + r.tabSwitchCount, 0);
  const studentsWithSwitches = records.filter(r => r.tabSwitchCount > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider">
              EDUCATIONAL DEVICE MONITORING
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Authorized Kiosk Telemetry Only (Zero Private Keystrokes/Camera Data)
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Student Educational Activity Intelligence
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Auditing foreground application runtime, session duration, authorized domain access, and tab switching frequency during active assessments.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search student or tablet..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#650000] transition"
          />
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Monitored Sessions
          </span>
          <strong className="text-2xl font-black text-stone-900 block mt-1">{records.length} Tablets</strong>
          <span className="text-[11px] text-emerald-700 font-bold">100% Kiosk Mode Protected</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Avg Active Session Duration
          </span>
          <strong className="text-2xl font-black text-stone-900 block mt-1">68 Minutes</strong>
          <span className="text-[11px] text-stone-500 font-medium">Foreground app sustained</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Tab Switching Events
          </span>
          <strong className={`text-2xl font-black block mt-1 ${totalTabSwitches > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {totalTabSwitches} Events
          </strong>
          <span className="text-[11px] text-stone-500 font-medium">Logged across {studentsWithSwitches.length} students</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Permitted Domains
          </span>
          <strong className="text-2xl font-black text-blue-700 block mt-1">2 Endpoints</strong>
          <span className="text-[11px] text-stone-500 font-medium">exam.sirmv.edu.in whitelist</span>
        </div>
      </div>

      {/* Activity Telemetry Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">
          Student Device Usage & Window Focus Log
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Tablet ID</th>
                <th className="py-3 px-4">Active Application</th>
                <th className="py-3 px-4">Session Duration</th>
                <th className="py-3 px-4">Tab Switching Count</th>
                <th className="py-3 px-4">Idle Duration</th>
                <th className="py-3 px-4">Screen Status</th>
                <th className="py-3 px-4">Whitelisted Domains</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(r => (
                <tr
                  key={r.id}
                  onClick={() => onSelectStudent(r)}
                  className="hover:bg-amber-50/50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-black text-stone-900">{r.studentName} (USN: {r.usn})</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-700">{r.assignedTabletId}</td>
                  <td className="py-3 px-4 font-bold text-blue-800">{r.activeApp}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">{r.foregroundDurationMinutes} mins</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        r.tabSwitchCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {r.tabSwitchCount} switches
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-stone-600">{r.idleDurationSeconds}s</td>
                  <td className="py-3 px-4 font-medium text-stone-700">{r.screenStatus}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                    {r.browserDomainUsage.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-[#650000] font-bold">
                    <span className="flex items-center gap-1 hover:underline">
                      <span>Timeline</span>
                      <ArrowRight size={11} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

