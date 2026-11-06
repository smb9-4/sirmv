import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Tablet,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';
import AnimatedCounter from '../AnimatedCounter';

interface AttendanceIntelligenceViewProps {
  records: StudentTabletRecord[];
  onSelectStudent: (student: StudentTabletRecord) => void;
}

export default function AttendanceIntelligenceView({
  records,
  onSelectStudent,
}: AttendanceIntelligenceViewProps) {
  const [filter, setFilter] = useState<'All' | 'Present' | 'Late' | 'Absent'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const presentCount = records.filter(r => r.attendanceStatus === 'Present').length;
  const lateCount = records.filter(r => r.attendanceStatus === 'Late').length;
  const absentCount = records.filter(r => r.attendanceStatus === 'Absent').length;
  const deviceVerifiedCount = records.filter(r => r.tabletPresenceVerified).length;

  const filtered = records.filter(r => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedTabletId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'Present') return r.attendanceStatus === 'Present';
    if (filter === 'Late') return r.attendanceStatus === 'Late';
    if (filter === 'Absent') return r.attendanceStatus === 'Absent';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider flex items-center gap-1.5">
              <CalendarCheck size={12} />
              BIOMETRIC & TABLET ATTENDANCE
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Classroom Device Presence Telemetry
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Classroom Attendance Intelligence
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Correlating physical biometric check-in with tablet BLE beacon and Wi-Fi presence. Note: Hardware connectivity serves as a supporting telemetry signal alongside official faculty roll call.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search student or USN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#650000] transition"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setFilter('Present')}
          className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/50 cursor-pointer transition apple-button shadow-xs"
        >
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Present Students
          </span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            <AnimatedCounter value={presentCount} duration={900} />
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">Biometric & Device Confirmed</span>
        </div>

        <div
          onClick={() => setFilter('Late')}
          className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/50 cursor-pointer transition apple-button shadow-xs"
        >
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Late Arrivals
          </span>
          <div className="text-2xl font-black text-amber-800 mt-1">
            <AnimatedCounter value={lateCount} duration={900} />
          </div>
          <span className="text-[11px] text-amber-700 font-bold">Checked in after 09:00 AM</span>
        </div>

        <div
          onClick={() => setFilter('Absent')}
          className="bg-white rounded-2xl p-4 border border-red-200 bg-red-50/50 cursor-pointer transition apple-button shadow-xs"
        >
          <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
            Absent Students
          </span>
          <div className="text-2xl font-black text-red-700 mt-1">
            <AnimatedCounter value={absentCount} duration={900} />
          </div>
          <span className="text-[11px] text-red-600 font-bold">SMS Guardian Notice Sent</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/50 shadow-xs">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
            Classroom Tablet Presence
          </span>
          <div className="text-2xl font-black text-blue-800 mt-1">
            <AnimatedCounter value={deviceVerifiedCount} duration={900} />
          </div>
          <span className="text-[11px] text-blue-700 font-bold">96% BLE Verified</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {(['All', 'Present', 'Late', 'Absent'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              filter === tab ? 'bg-[#650000] text-[#FFE59A] shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">
          Daily Lecture & Examination Roll Call Roster
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-3 px-4">USN</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Assigned Tablet</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Tablet Presence Sensor</th>
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
                  <td className="py-3 px-4 font-mono font-bold text-stone-700">{r.usn}</td>
                  <td className="py-3 px-4 font-black text-stone-900">{r.studentName}</td>
                  <td className="py-3 px-4 font-bold text-stone-600">{r.class} - {r.section}</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-800">{r.assignedTabletId}</td>
                  <td className="py-3 px-4 font-medium text-stone-600">{r.checkInTime}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        r.attendanceStatus === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.attendanceStatus === 'Late'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.attendanceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                        r.tabletPresenceVerified ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {r.tabletPresenceVerified ? (
                        <>
                          <CheckCircle2 size={13} /> BLE Beacon Confirmed
                        </>
                      ) : (
                        <>
                          <XCircle size={13} /> No Device Signal
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#650000] font-bold">
                    <span className="flex items-center gap-1 hover:underline">
                      <span>Inspect</span>
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

