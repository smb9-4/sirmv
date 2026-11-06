import React, { useState } from 'react';
import {
  CalendarCheck, AlertTriangle, CheckCircle2, XCircle, Calendar,
  TrendingDown, TrendingUp, Sparkles, Filter, ChevronRight, User
} from 'lucide-react';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';

export default function AttendancePage() {
  const { subjectAttendance } = usePortal();

  const [selectedMonth, setSelectedMonth] = useState<'nov' | 'oct'>('nov');

  // Compute Overall Stats
  const totalConducted = subjectAttendance.reduce((acc, s) => acc + s.totalClasses, 0);
  const totalAttended = subjectAttendance.reduce((acc, s) => acc + s.attendedClasses, 0);
  const totalMissed = totalConducted - totalAttended;
  const overallPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 1000) / 10 : 86.4;

  const lowAttendanceSubjects = subjectAttendance.filter(
    (s) => (s.attendedClasses / s.totalClasses) < 0.75
  );

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <StudentNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
            >
              <CalendarCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                STUDENT ATTENDANCE MONITORING
              </h1>
              <p className="text-xs text-gray-500">
                Official VTU biometric & roll-call records for 5th Semester CSE (Section A)
              </p>
            </div>
          </div>

          <div
            className="text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-auto"
            style={{
              backgroundColor: overallPercentage >= 75 ? '#DCFCE7' : '#FEE2E2',
              color: overallPercentage >= 75 ? '#166534' : '#991B1B',
            }}
          >
            {overallPercentage >= 75 ? 'Eligibility Status: Eligible' : 'Eligibility Status: At Risk (< 75%)'}
          </div>
        </div>

        {/* 75% Attendance Regulation Warning Alert if applicable */}
        {lowAttendanceSubjects.length > 0 && (
          <div
            className="p-4 rounded-xl border flex items-start gap-3 shadow-sm"
            style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
          >
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <strong className="block font-bold">VTU Statutory Attendance Warning:</strong>
              <p>
                You have less than 75% attendance in <strong>{lowAttendanceSubjects.length} subject(s)</strong> (
                {lowAttendanceSubjects.map(s => s.subject).join(', ')}). As per VTU regulations, students with less than 75% aggregate in any subject are liable to be detained from appearing in Semester End Examinations.
              </p>
            </div>
          </div>
        )}

        {/* Overall Attendance Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-card border border-institutional-border text-center">
            <span className="text-[11px] font-bold uppercase text-gray-400 block">Overall Percentage</span>
            <span
              className="text-3xl font-black mt-1 block"
              style={{ color: overallPercentage >= 75 ? '#166534' : '#DC2626' }}
            >
              {overallPercentage}%
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">75% minimum required</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-institutional-border text-center">
            <span className="text-[11px] font-bold uppercase text-gray-400 block">Total Classes</span>
            <span className="text-3xl font-black text-gray-900 mt-1 block">{totalConducted}</span>
            <span className="text-[10px] text-gray-500 mt-0.5 block">All subjects combined</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-institutional-border text-center">
            <span className="text-[11px] font-bold uppercase text-gray-400 block">Classes Attended</span>
            <span className="text-3xl font-black text-green-700 mt-1 block">{totalAttended}</span>
            <span className="text-[10px] text-green-600 font-semibold mt-0.5 block">Present in sessions</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-institutional-border text-center">
            <span className="text-[11px] font-bold uppercase text-gray-400 block">Classes Missed</span>
            <span className="text-3xl font-black text-red-600 mt-1 block">{totalMissed}</span>
            <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">Absent / Leave</span>
          </div>
        </div>

        {/* Subject-Wise Attendance Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            SUBJECT-WISE ATTENDANCE BREAKDOWN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjectAttendance.map((sub) => {
              const pct = Math.round((sub.attendedClasses / sub.totalClasses) * 1000) / 10;
              const isLow = pct < 75;
              const missed = sub.totalClasses - sub.attendedClasses;

              return (
                <div
                  key={sub.subjectCode}
                  className={`bg-white rounded-2xl p-5 shadow-card border flex flex-col justify-between transition-all duration-200 ${
                    isLow ? 'border-red-300 ring-1 ring-red-100' : 'border-institutional-border'
                  }`}
                >
                  <div>
                    {/* Header with status badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {sub.subjectCode}
                      </span>
                      {isLow ? (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          <AlertTriangle size={11} /> BELOW 75%
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          <CheckCircle2 size={11} /> SAFE
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                      {sub.subject}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <User size={13} className="text-gray-400" /> Faculty: {sub.teacherName}
                    </p>

                    {/* Numerical breakdown */}
                    <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-gray-50 text-center text-xs border border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Conducted</span>
                        <strong className="text-gray-800 text-sm">{sub.totalClasses}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Attended</span>
                        <strong className="text-green-700 text-sm">{sub.attendedClasses}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Missed</span>
                        <strong className="text-red-600 text-sm">{missed}</strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-500 font-semibold">Current Attendance:</span>
                        <span className={`font-black text-sm ${isLow ? 'text-red-600' : 'text-green-700'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isLow ? '#DC2626' : '#16A34A',
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                        <span>0%</span>
                        <span className="font-bold text-red-500">75% Cut-off</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {isLow && (
                    <div className="mt-4 pt-3 border-t border-red-100 text-[11px] text-red-700 font-medium">
                      ⚠️ Needs {Math.ceil((0.75 * sub.totalClasses - sub.attendedClasses) / 0.25)} consecutive attendances to cross 75%.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Attendance Calendar */}
        <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-institutional-border gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                MONTHLY ATTENDANCE LOG CALENDAR
              </h3>
              <p className="text-xs text-gray-500">
                Daily presence verification for odd semester classes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMonth('oct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMonth === 'oct' ? 'bg-crimson text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                October 2026
              </button>
              <button
                onClick={() => setSelectedMonth('nov')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMonth === 'nov' ? 'bg-crimson text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                November 2026 (Current)
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-green-500 text-white flex items-center justify-center text-[9px] font-bold">P</span> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-red-500 text-white flex items-center justify-center text-[9px] font-bold">A</span> Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-purple-200 border border-purple-400 text-purple-800 flex items-center justify-center text-[9px] font-bold">H</span> Sunday / Holiday</span>
            <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-gray-100 border border-gray-300 text-gray-400 flex items-center justify-center text-[9px] font-bold">–</span> Upcoming</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="font-extrabold text-gray-400 uppercase py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: selectedMonth === 'nov' ? 30 : 31 }).map((_, i) => {
              const day = i + 1;
              const isSunday = (day % 7 === 1);
              const isPast = selectedMonth === 'oct' || day <= 6; // Nov 6 is today
              const isAbsent = isPast && !isSunday && (day === 3 || day === 14 || day === 21);
              const isPresent = isPast && !isSunday && !isAbsent;

              let style = 'bg-gray-50 border-gray-200 text-gray-400';
              let badge = '–';

              if (isSunday) {
                style = 'bg-purple-50 border-purple-200 text-purple-800 font-bold';
                badge = 'H';
              } else if (isPresent) {
                style = 'bg-green-50 border-green-300 text-green-900 font-bold';
                badge = 'P';
              } else if (isAbsent) {
                style = 'bg-red-50 border-red-300 text-red-900 font-bold';
                badge = 'A';
              }

              return (
                <div
                  key={day}
                  className={`h-16 p-2 rounded-xl border flex flex-col justify-between items-center transition-all ${style}`}
                >
                  <span className="text-xs">{day}</span>
                  <span className="text-xs font-black">{badge}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

