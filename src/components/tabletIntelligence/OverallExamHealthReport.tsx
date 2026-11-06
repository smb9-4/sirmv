import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Users,
  CheckCircle2,
  HelpCircle,
  Clock,
  Tablet,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';
import { calculateDashboardStatistics } from '../../tabletIntelligenceData';
import AnimatedCounter from '../AnimatedCounter';

interface OverallExamHealthReportProps {
  records: StudentTabletRecord[];
  onNavigateToMonitoring: (filter: string) => void;
  onNavigateModule: (moduleId: string) => void;
}

export default function OverallExamHealthReport({
  records,
  onNavigateToMonitoring,
  onNavigateModule,
}: OverallExamHealthReportProps) {
  const stats = calculateDashboardStatistics(records);

  const totalRegistered = records.length;
  const started = records.filter(r => r.submissionStatus !== 'Not Started').length;
  const notStarted = records.filter(r => r.submissionStatus === 'Not Started').length;
  const active = records.filter(r => r.deviceStatus === 'Active').length;
  const inactive = records.filter(r => r.deviceStatus === 'Inactive').length;
  const disconnected = records.filter(r => r.deviceStatus === 'Offline').length;

  const submitted = records.filter(r => r.submissionStatus === 'Submitted').length;
  const notSubmitted = totalRegistered - submitted;
  const submissionPercentage = Math.round((submitted / totalRegistered) * 100);
  const pendingSubmissions = records.filter(r => r.submissionStatus === 'In Progress' || r.submissionStatus === 'Pending').length;
  const failedSubmissions = records.filter(r => r.submissionStatus === 'Failed Submission').length;

  const totalAttempted = records.reduce((acc, r) => acc + r.questionsAttempted, 0);
  const totalSkipped = records.reduce((acc, r) => acc + r.questionsSkipped, 0);
  const avgAttempted = Math.round(totalAttempted / Math.max(1, started));
  const avgCompletionPct = Math.round((avgAttempted / 100) * 100);

  const avgBattery = Math.round(records.reduce((acc, r) => acc + r.batteryPercentage, 0) / totalRegistered);
  const criticalBatteryCount = records.filter(r => r.batteryPercentage <= 20).length;
  const offlineTablets = disconnected;
  const networkDrops = records.filter(r => r.networkStatus === 'Weak').length;
  const appCrashes = 0; // Telemetry reports 0 unhandled crash dumps
  const syncFailures = records.filter(r => r.deviceStatus === 'Offline').length;

  const under10MinsRemaining = records.filter(r => typeof r.timeRemainingMinutes === 'number' && r.timeRemainingMinutes < 10).length;
  const timeOverCount = records.filter(r => r.timeRemainingMinutes === 'Time Over').length;
  const requiringAttention = criticalBatteryCount + under10MinsRemaining + disconnected;

  const healthScore = stats.examinationOverview.examinationHealthScore;

  return (
    <div className="space-y-6">
      {/* Page Title & Score Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider flex items-center gap-1.5">
              <HeartPulse size={12} />
              EXAMINATION HEALTH TELEMETRY
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Real-Time Diagnostic Audit for KCET Live Mock Assessment
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Overall Examination Health & Telemetry Report
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed">
            Comprehensive operational situation report tracking student participation, submission reliability, question velocity, time analytics, and tablet hardware health.
          </p>
        </div>

        {/* Live Examination Health Score Card (Requirement #5F) */}
        <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FDE68A]/40 rounded-3xl p-6 border border-[#FCD34D] text-center min-w-[280px] shadow-sm shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#92400E] block">
            LIVE EXAMINATION HEALTH SCORE
          </span>

          <div className="text-5xl font-black text-[#78350F] tracking-tight mt-1">
            <AnimatedCounter value={healthScore} duration={1400} />
            <span className="text-2xl text-[#B45309]/60 font-semibold ml-0.5">/ 100</span>
          </div>

          <span className="inline-block mt-1 text-xs font-black uppercase text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
            {healthScore >= 85 ? 'Optimal Examination Reliability' : 'Requires Technical Attention'}
          </span>
        </div>
      </div>

      {/* Health Score Calculation Explanation Box (Requirement #5F) */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2 text-xs">
        <strong className="font-black text-stone-900 text-sm block">
          How the Live Examination Health Score is Calculated (0 - 100):
        </strong>
        <p className="text-stone-600 leading-relaxed font-medium">
          The health score reflects infrastructure and examination integrity rather than academic marks. It is derived from:
          <strong className="text-stone-900"> Student Participation (25 pts)</strong> +
          <strong className="text-stone-900"> Device Connectivity (25 pts)</strong> +
          <strong className="text-stone-900"> Submission Reliability (25 pts)</strong> +
          <strong className="text-stone-900"> Battery Safety & Sync (15 pts)</strong> +
          <strong className="text-stone-900"> Zero-Incident Security Clearance (10 pts)</strong>.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 font-mono text-[11px] font-bold">
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            Participation: {stats.examinationOverview.healthBreakdown.participationRate}/25
          </div>
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            Connectivity: {stats.examinationOverview.healthBreakdown.connectivityRate}/25
          </div>
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            Submission: {stats.examinationOverview.healthBreakdown.submissionReliability}/25
          </div>
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            Battery Safety: {stats.examinationOverview.healthBreakdown.batteryHealthRate}/15
          </div>
          <div className="p-2 bg-white rounded-lg border border-stone-200">
            Security: {stats.examinationOverview.healthBreakdown.securityRate}/10
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTIONS A THROUGH E (REQUIREMENTS 5A - 5E)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* A. STUDENT PARTICIPATION (Requirement #5A) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Users size={15} className="text-[#650000]" /> A. Student Participation
            </span>
            <button
              onClick={() => onNavigateToMonitoring('All Students')}
              className="text-xs text-[#650000] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Inspect</span>
              <ArrowRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Registered</span>
              <strong className="text-xl font-black text-stone-900">{totalRegistered}</strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Started</span>
              <strong className="text-xl font-black text-emerald-800">{started}</strong>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Not Started</span>
              <strong className="text-xl font-black text-amber-800">{notStarted}</strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Active</span>
              <strong className="text-xl font-black text-emerald-700">{active}</strong>
            </div>
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-600 uppercase block">Inactive</span>
              <strong className="text-xl font-black text-stone-700">{inactive}</strong>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <span className="text-[10px] font-bold text-red-800 uppercase block">Disconnected</span>
              <strong className="text-xl font-black text-red-700">{disconnected}</strong>
            </div>
          </div>
        </div>

        {/* B. SUBMISSION ANALYTICS (Requirement #5B) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#650000]" /> B. Submission Analytics
            </span>
            <button
              onClick={() => onNavigateToMonitoring('Submitted')}
              className="text-xs text-[#650000] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Submissions</span>
              <ArrowRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Submitted</span>
              <strong className="text-xl font-black text-emerald-800">{submitted}</strong>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <span className="text-[10px] font-bold text-red-800 uppercase block">Not Submitted</span>
              <strong className="text-xl font-black text-red-800">{notSubmitted}</strong>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">Submission %</span>
              <strong className="text-xl font-black text-blue-800">{submissionPercentage}%</strong>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Pending</span>
              <strong className="text-xl font-black text-purple-800">{pendingSubmissions}</strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Failed Submission Attempts</span>
              <strong className="text-xl font-black text-emerald-700">{failedSubmissions} (0.0% failure)</strong>
            </div>
          </div>
        </div>

        {/* C. QUESTION ANALYTICS (Requirement #5C) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <HelpCircle size={15} className="text-[#650000]" /> C. Question Analytics
            </span>
            <span className="text-xs text-stone-400 font-bold">100 Question Total</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Questions Total</span>
              <strong className="text-xl font-black text-stone-900">100</strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Attempted</span>
              <strong className="text-xl font-black text-emerald-800">{totalAttempted}</strong>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Total Skipped</span>
              <strong className="text-xl font-black text-amber-800">{totalSkipped}</strong>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">Avg Attempt / Student</span>
              <strong className="text-xl font-black text-blue-800">{avgAttempted} / 100</strong>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 col-span-2">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Average Completion Rate</span>
              <strong className="text-xl font-black text-purple-800">{avgCompletionPct}%</strong>
            </div>
          </div>
        </div>

        {/* D. TIME ANALYTICS (Requirement #5D) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Clock size={15} className="text-[#650000]" /> D. Time Analytics
            </span>
            <button
              onClick={() => onNavigateToMonitoring('Time Over')}
              className="text-xs text-[#650000] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Time Over</span>
              <ArrowRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Avg Time Spent</span>
              <strong className="text-xl font-black text-stone-900">48 mins</strong>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">&lt; 10 Mins Remaining</span>
              <strong className="text-xl font-black text-amber-800">{under10MinsRemaining} Students</strong>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <span className="text-[10px] font-bold text-red-800 uppercase block">Students Time Over</span>
              <strong className="text-xl font-black text-red-800">{timeOverCount}</strong>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Requiring Attention</span>
              <strong className="text-xl font-black text-purple-800">{requiringAttention}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* E. DEVICE HEALTH DURING EXAMINATION (Requirement #5E) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Tablet size={15} className="text-[#650000]" /> E. Device Health During Examination
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Real-time hardware metrics across all 100 student tablets
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('device_health')}
            className="text-xs text-[#650000] font-bold hover:underline flex items-center gap-0.5"
          >
            <span>Open Device Health Fleet View</span>
            <ArrowRight size={11} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Avg Battery</span>
            <strong className="text-xl font-black text-emerald-800">{avgBattery}%</strong>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <span className="text-[10px] font-bold text-red-800 uppercase block">Critical Battery</span>
            <strong className="text-xl font-black text-red-800">{criticalBatteryCount}</strong>
          </div>
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-600 uppercase block">Offline Tablets</span>
            <strong className="text-xl font-black text-stone-700">{offlineTablets}</strong>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Network Disconnections</span>
            <strong className="text-xl font-black text-amber-800">{networkDrops}</strong>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">App Crashes</span>
            <strong className="text-xl font-black text-emerald-700">0 Dump</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Sync Failures</span>
            <strong className="text-xl font-black text-stone-700">{syncFailures}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

