import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Tablet,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Battery,
  Wifi,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Lock,
  DownloadCloud,
  Send,
  Zap,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';
import { calculateDashboardStatistics } from '../../tabletIntelligenceData';
import AnimatedCounter from '../AnimatedCounter';

interface TabletDashboardOverviewProps {
  records: StudentTabletRecord[];
  onNavigateModule: (moduleId: string) => void;
  onFilterLiveExam: (filter: string) => void;
  onSelectStudent: (student: StudentTabletRecord) => void;
  onSelectDevice: (device: StudentTabletRecord) => void;
}

export default function TabletDashboardOverview({
  records,
  onNavigateModule,
  onFilterLiveExam,
  onSelectStudent,
  onSelectDevice,
}: TabletDashboardOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now (10:25 AM)');

  const stats = calculateDashboardStatistics(records);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now (10:25:30 AM)');
    }, 700);
  };

  const criticalBatteryStudents = records.filter(r => r.batteryPercentage <= 20);
  const securityIncidentStudents = records.filter(r => r.securityIncident !== undefined);

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP COMMAND BAR: TITLE, TELEMETRY HEARTBEAT & QUICK ACTIONS
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Institutional Maroon Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#500000] via-[#A60000] to-[#E5BD55]" />

        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] border border-[#650000] tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              CENTRAL COMMAND ACTIVE
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Fleet Telemetry: 3,000 Supported Tablets (100 Active in Cluster A)
            </span>
            <span className="text-xs text-stone-400 font-medium">
              • Sync: {lastRefreshed}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Central Student & Tablet Intelligence Dashboard
          </h1>
          <p className="text-xs md:text-sm text-stone-500 mt-1 max-w-3xl font-medium leading-relaxed">
            Real-time biometric examination monitoring, device telemetry diagnostics, and MDM fleet administration for SIR MV PU College. Every metric below is interactive and opens its detailed intelligence report.
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-2 border border-stone-200 transition apple-button shadow-2xs"
            title="Force Telemetry Sync"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#650000]' : ''} />
            <span>Sync Telemetry</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateModule('live_exam')}
            className="px-5 py-2.5 rounded-2xl bg-[#650000] hover:bg-[#800000] text-white font-black text-xs flex items-center gap-2 shadow-sm transition apple-button"
          >
            <Activity size={15} />
            <span>Open Live Terminal</span>
          </motion.button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECURITY & CRITICAL HARDWARE ALERTS STRIP (CLICKABLE)
          ───────────────────────────────────────────────────────────── */}
      {(criticalBatteryStudents.length > 0 || securityIncidentStudents.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Critical Battery Alert Card */}
          {criticalBatteryStudents.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => {
                onNavigateModule('live_exam');
                onFilterLiveExam('Low Battery');
              }}
              className="p-4 rounded-2xl bg-red-50/90 border border-red-300 text-red-950 flex items-center justify-between cursor-pointer group shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  <Battery size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-red-900">
                      {criticalBatteryStudents.length} Tablets with Critical Battery (≤ 20%)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-200 text-red-900">
                      Urgent Action
                    </span>
                  </div>
                  <p className="text-xs text-red-700 mt-0.5">
                    Affected: {criticalBatteryStudents.map(s => s.assignedTabletId).slice(0, 3).join(', ')}... Click to filter and dispatch charging units.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-red-700 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          )}

          {/* Security Incidents Card */}
          {securityIncidentStudents.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => onNavigateModule('security_centre')}
              className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex items-center justify-between cursor-pointer group shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-amber-900">
                      {securityIncidentStudents.length} Security Alerts Detected
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-200 text-amber-900">
                      Investigation
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Includes developer mode toggles, USB debugging, and root attempts. Click to open Security Centre.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-amber-800 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION 1: STUDENT OVERVIEW (8 DYNAMIC CLICKABLE CARDS)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Users size={16} className="text-[#650000]" /> Student Overview
            </h2>
            <p className="text-xs text-stone-500">
              Live student examination status calculated dynamically from telemetry
            </p>
          </div>
          <span className="text-xs font-bold text-stone-400">Click any card to filter student list</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            {
              label: 'Total Students',
              value: stats.studentOverview.totalStudents,
              color: 'text-stone-900',
              bg: 'bg-white',
              border: 'border-stone-200',
              filter: 'All Students',
            },
            {
              label: 'Active Students',
              value: stats.studentOverview.activeStudents,
              color: 'text-emerald-700',
              bg: 'bg-emerald-50/70',
              border: 'border-emerald-200',
              filter: 'Active',
            },
            {
              label: 'Inactive Students',
              value: stats.studentOverview.inactiveStudents,
              color: 'text-stone-600',
              bg: 'bg-stone-100/70',
              border: 'border-stone-200',
              filter: 'Inactive',
            },
            {
              label: 'Not Started',
              value: stats.studentOverview.notStarted,
              color: 'text-amber-700',
              bg: 'bg-amber-50/70',
              border: 'border-amber-200',
              filter: 'Not Started',
            },
            {
              label: 'Exam Completed',
              value: stats.studentOverview.examCompleted,
              color: 'text-blue-700',
              bg: 'bg-blue-50/70',
              border: 'border-blue-200',
              filter: 'Submitted',
            },
            {
              label: 'In Progress',
              value: stats.studentOverview.examInProgress,
              color: 'text-purple-700',
              bg: 'bg-purple-50/70',
              border: 'border-purple-200',
              filter: 'Active',
            },
            {
              label: 'Submitted',
              value: stats.studentOverview.submitted,
              color: 'text-emerald-800',
              bg: 'bg-emerald-50/70',
              border: 'border-emerald-200',
              filter: 'Submitted',
            },
            {
              label: 'Not Submitted',
              value: stats.studentOverview.notSubmitted,
              color: 'text-[#650000]',
              bg: 'bg-red-50/70',
              border: 'border-red-200',
              filter: 'Not Submitted',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onNavigateModule('live_exam');
                onFilterLiveExam(item.filter);
              }}
              className={`p-3.5 rounded-2xl border ${item.border} ${item.bg} cursor-pointer transition apple-button shadow-xs flex flex-col justify-between`}
              title={`Click to filter Live Examination by ${item.label}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">
                {item.label}
              </span>
              <div className={`text-2xl font-black ${item.color} mt-1.5`}>
                <AnimatedCounter value={item.value} duration={900} />
              </div>
              <span className="text-[10px] text-stone-400 font-bold mt-1 flex items-center gap-0.5">
                <span>Inspect</span>
                <ArrowRight size={10} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION 2: DEVICE OVERVIEW (6 DYNAMIC CLICKABLE CARDS)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Tablet size={16} className="text-[#650000]" /> Device Overview (Tablet Fleet)
            </h2>
            <p className="text-xs text-stone-500">
              Hardware health, battery safety, and MDM connection telemetry
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('device_health')}
            className="text-xs font-bold text-[#650000] hover:underline flex items-center gap-1"
          >
            <span>Open Device Health Module</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            {
              label: 'Total Registered Tablets',
              value: stats.deviceOverview.totalRegisteredTablets,
              sub: 'Enterprise MDM Enrolled',
              color: 'text-stone-900',
              bg: 'bg-white',
              border: 'border-stone-200',
              action: () => onNavigateModule('device_mgmt'),
            },
            {
              label: 'Online Devices',
              value: stats.deviceOverview.onlineDevices,
              sub: 'Heartbeat Verified',
              color: 'text-emerald-700',
              bg: 'bg-emerald-50/70',
              border: 'border-emerald-200',
              action: () => {
                onNavigateModule('live_exam');
                onFilterLiveExam('Active');
              },
            },
            {
              label: 'Offline Devices',
              value: stats.deviceOverview.offlineDevices,
              sub: 'No Heartbeat > 5m',
              color: 'text-stone-600',
              bg: 'bg-stone-100/70',
              border: 'border-stone-200',
              action: () => {
                onNavigateModule('live_exam');
                onFilterLiveExam('Inactive');
              },
            },
            {
              label: 'Critical Battery Devices',
              value: stats.deviceOverview.criticalBatteryDevices,
              sub: 'Charge ≤ 20%',
              color: 'text-red-600',
              bg: 'bg-red-50/70',
              border: 'border-red-200',
              action: () => {
                onNavigateModule('live_exam');
                onFilterLiveExam('Low Battery');
              },
            },
            {
              label: 'Devices with Errors',
              value: stats.deviceOverview.devicesWithErrors,
              sub: 'Security or System Flag',
              color: 'text-amber-700',
              bg: 'bg-amber-50/70',
              border: 'border-amber-200',
              action: () => onNavigateModule('security_centre'),
            },
            {
              label: 'Requiring Maintenance',
              value: stats.deviceOverview.devicesRequiringMaintenance,
              sub: 'Battery Degradation',
              color: 'text-[#650000]',
              bg: 'bg-orange-50/70',
              border: 'border-orange-200',
              action: () => onNavigateModule('device_health'),
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={item.action}
              className={`p-4 rounded-2xl border ${item.border} ${item.bg} cursor-pointer transition apple-button shadow-xs flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {item.label}
                </span>
                <div className={`text-2xl font-black ${item.color} mt-1`}>
                  <AnimatedCounter value={item.value} duration={1000} />
                </div>
              </div>
              <p className="text-[10px] text-stone-400 font-bold mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                <span>{item.sub}</span>
                <ArrowRight size={10} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION 3: EXAMINATION OVERVIEW & HEALTH SCORE
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Examination Metrics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Layers size={16} className="text-[#650000]" /> Examination Overview Metrics
              </h2>
              <p className="text-xs text-stone-500">
                KCET Live Mock Assessment 2026 • 100 Objective Questions
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('exam_health')}
              className="text-xs font-bold text-[#650000] hover:underline flex items-center gap-1"
            >
              <span>Full Health Report</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Questions', val: stats.examinationOverview.totalQuestions, suffix: '' },
              { label: 'Students Participating', val: stats.examinationOverview.totalStudentsParticipating, suffix: ' / 100' },
              { label: 'Questions Attempted', val: stats.examinationOverview.totalQuestionsAttemptedSum, suffix: '' },
              { label: 'Questions Skipped', val: stats.examinationOverview.totalQuestionsSkippedSum, suffix: '' },
              { label: 'Avg Questions / Student', val: stats.examinationOverview.averageQuestionsAttempted, suffix: ' / 100' },
              { label: 'Total Submissions', val: stats.examinationOverview.totalSubmissions, suffix: '' },
              { label: 'Pending Submissions', val: stats.examinationOverview.pendingSubmissions, suffix: '' },
              { label: 'Time Over Count', val: stats.examinationOverview.timeOverCount, suffix: ' Students' },
            ].map((m, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block truncate">
                  {m.label}
                </span>
                <span className="text-xl font-black text-stone-900 mt-0.5 block">
                  <AnimatedCounter value={m.val} duration={1100} />
                  <span className="text-xs font-normal text-stone-400">{m.suffix}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Quick MDM Kiosk Action Buttons */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-stone-700">MDM Command Shortcuts:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Broadcasting 10-minute warning notice to all 100 student tablets...')}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 transition"
              >
                Send Time Warning
              </button>
              <button
                onClick={() => alert('Pushing emergency examination mode configuration lock...')}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 transition"
              >
                Re-enforce Kiosk Lock
              </button>
              <button
                onClick={() => onNavigateModule('device_mgmt')}
                className="px-3 py-1.5 rounded-xl bg-[#650000] text-white font-bold hover:bg-[#800000] transition"
              >
                Open MDM Manager
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Examination Health Score Gauge (Requirement #5F) */}
        <div
          onClick={() => onNavigateModule('exam_health')}
          className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FDE68A]/40 rounded-3xl p-6 border border-[#FCD34D] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#E5BD55] transition apple-card group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#78350F] text-[#FFE59A] tracking-wider">
                LIVE EXAM HEALTH SCORE
              </span>
              <span className="text-xs font-black text-[#78350F] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Details</span>
                <ArrowRight size={13} />
              </span>
            </div>

            <div className="text-center py-2">
              <div className="text-5xl font-black text-[#78350F] tracking-tight">
                <AnimatedCounter value={stats.examinationOverview.examinationHealthScore} duration={1400} />
                <span className="text-2xl text-[#B45309]/60 font-semibold ml-0.5">/ 100</span>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 mt-1 block">
                {stats.examinationOverview.examinationHealthScore >= 85
                  ? 'Optimal Exam Reliability'
                  : 'Requires Technical Attention'}
              </span>
            </div>

            <p className="text-xs text-[#92400E] mt-2 font-medium leading-relaxed">
              Calculated dynamically from 5 key factors: Participation (25%), Connectivity (25%), Submission Reliability (25%), Battery Safety (15%), and Security Deductions (10%).
            </p>
          </div>

          <div className="pt-3 border-t border-[#FCD34D]/80 text-[11px] font-bold text-[#78350F] space-y-1">
            <div className="flex justify-between">
              <span>Student Participation:</span>
              <span>{stats.examinationOverview.healthBreakdown.participationRate} / 25</span>
            </div>
            <div className="flex justify-between">
              <span>Device Connectivity:</span>
              <span>{stats.examinationOverview.healthBreakdown.connectivityRate} / 25</span>
            </div>
            <div className="flex justify-between">
              <span>Submission Reliability:</span>
              <span>{stats.examinationOverview.healthBreakdown.submissionReliability} / 25</span>
            </div>
            <div className="flex justify-between">
              <span>Battery & Device Safety:</span>
              <span>{stats.examinationOverview.healthBreakdown.batteryHealthRate} / 15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

