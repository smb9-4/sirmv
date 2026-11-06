import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Minimize2,
  Tablet,
  User,
  Clock,
  Battery,
  Wifi,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Shield,
  Cpu,
  HardDrive,
  Thermometer,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { StudentTabletRecord, QuestionTelemetry } from '../../tabletIntelligenceData';

interface IndividualStudentExamReportModalProps {
  student: StudentTabletRecord | null;
  onClose: () => void;
  sidebarWidth?: number;
}

export default function IndividualStudentExamReportModal({
  student,
  onClose,
  sidebarWidth = 86,
}: IndividualStudentExamReportModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionTelemetry | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'device' | 'timeline'>('overview');

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedQuestion) {
          setSelectedQuestion(null);
        } else if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, onClose, selectedQuestion]);

  if (!student) return null;

  const batteryColor =
    student.batteryPercentage <= 20
      ? 'text-red-600 bg-red-50 border-red-200'
      : student.batteryPercentage <= 40
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  const statusColor =
    student.deviceStatus === 'Active'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : student.deviceStatus === 'Critical Battery' || student.deviceStatus === 'Error'
      ? 'bg-red-100 text-red-800 border-red-300'
      : student.deviceStatus === 'Offline'
      ? 'bg-stone-200 text-stone-700 border-stone-300'
      : 'bg-amber-100 text-amber-800 border-amber-300';

  return (
    <div
      style={{
        left: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : 0,
      }}
      className={`fixed top-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
        isFullScreen ? 'p-1.5 md:p-3' : 'p-3 md:p-6'
      }`}
    >
      <motion.div
        layout
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{
          scale: isFullScreen ? [0.97, 1.015, 1] : 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 24,
          mass: 0.8,
        }}
        className={`relative bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full max-w-none max-h-none rounded-2xl md:rounded-3xl border-2 border-[#E5BD55]'
            : 'w-full max-w-5xl max-h-[92vh] rounded-3xl'
        }`}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#650000] text-[#FFE59A] flex items-center justify-center font-black text-sm border border-[#E5BD55] shrink-0 shadow-xs">
              {student.usn}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-stone-900 tracking-tight">
                  {student.studentName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  USN: {student.usn}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusColor}`}>
                  {student.deviceStatus}
                </span>
                {isFullScreen && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Maximize2 size={10} /> Full Screen Expanded
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                {student.class} • Section {student.section} • Roll No: {student.rollNumber} • Assigned Tablet:{' '}
                <span className="font-mono font-bold text-stone-800 bg-stone-100 px-1.5 py-0.5 rounded">
                  {student.assignedTabletId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Expand / Minimize Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsFullScreen(prev => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all apple-button shadow-xs border ${
                isFullScreen
                  ? 'bg-[#650000] text-[#FFE59A] border-[#650000]'
                  : 'bg-stone-100 hover:bg-[#FFE59A] text-stone-600 hover:text-[#650000] border-stone-200'
              }`}
              title={isFullScreen ? 'Restore Normal Window' : 'Expand to Full Screen'}
            >
              {isFullScreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 flex items-center justify-center transition apple-button shrink-0 shadow-xs border border-stone-200"
              title="Close Report"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview', label: 'Examination Overview', icon: Activity },
              { id: 'questions', label: '100-Question Progress', icon: Layers },
              { id: 'device', label: 'Tablet Telemetry & Hardware', icon: Tablet },
              { id: 'timeline', label: 'Activity & Audit Timeline', icon: Clock },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#650000] text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold text-stone-500">
            <span>Exam ID: {student.examinationId}</span>
            <span>•</span>
            <span className="text-emerald-700 font-black">● Telemetry Live</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Quick Status Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Current Question
                  </span>
                  <div className="text-2xl font-black text-stone-900 mt-1">
                    Q #{student.currentQuestion}{' '}
                    <span className="text-xs font-normal text-stone-400">/ 100</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600">Currently in view</span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Attempted vs Skipped
                  </span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    {student.questionsAttempted}{' '}
                    <span className="text-xs text-amber-600 font-bold">({student.questionsSkipped} skipped)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {student.questionsRemaining} remaining
                  </span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Time Remaining
                  </span>
                  <div
                    className={`text-2xl font-black mt-1 ${
                      student.timeRemainingMinutes === 'Time Over' ? 'text-red-600' : 'text-stone-900'
                    }`}
                  >
                    {student.timeRemainingMinutes === 'Time Over'
                      ? 'Time Over'
                      : `${student.timeRemainingMinutes}m`}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Last activity: {student.lastActivity}
                  </span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Tablet Battery & Signal
                  </span>
                  <div className="text-2xl font-black text-stone-900 mt-1 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-lg text-sm font-black border ${batteryColor}`}>
                      {student.batteryPercentage}%
                    </span>
                    <span className="text-xs text-stone-400 font-normal">
                      {student.networkStrengthDbm} dBm
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-stone-500">
                    Health: {student.batteryHealth}% • {student.deviceTemperature}°C
                  </span>
                </div>
              </div>

              {/* Security Alert Callout (if student has an active incident) */}
              {student.securityIncident && (
                <div className="rounded-2xl p-4 border border-red-300 bg-red-50/80 text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Shield size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-red-900">
                          {student.securityIncident.type}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-200 text-red-900">
                          {student.securityIncident.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                        {student.securityIncident.description}
                      </p>
                      <p className="text-[11px] text-red-700 font-bold mt-1">
                        Recommended Action: {student.securityIncident.recommendedAction}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Initiating remote lock for tablet ${student.assignedTabletId}...`)}
                    className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shrink-0 transition shadow-xs"
                  >
                    Lock Device Remotely
                  </button>
                </div>
              )}

              {/* AI Predictive Early Warning Callout */}
              {student.aiPrediction && (
                <div className="rounded-2xl p-4 border border-purple-200 bg-purple-50/70 text-purple-950 flex items-start gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-purple-950">
                        AI Prediction: {student.aiPrediction.pattern}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-200 text-purple-900">
                        {student.aiPrediction.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-purple-900 mt-0.5 leading-relaxed">
                      {student.aiPrediction.evidence}
                    </p>
                    <p className="text-[11px] text-purple-700 font-bold mt-1">
                      Suggested Action: {student.aiPrediction.suggestedAction}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Summary Visualizer Bar */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Examination Completion Progress</span>
                  <span>{Math.round((student.questionsAttempted / 100) * 100)}% Complete</span>
                </div>

                <div className="w-full h-3.5 rounded-full bg-stone-200 overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${student.questionsAttempted}%` }}
                    className="h-full bg-emerald-500"
                    title={`Attempted: ${student.questionsAttempted}`}
                  />
                  <div
                    style={{ width: `${student.questionsSkipped}%` }}
                    className="h-full bg-amber-400"
                    title={`Skipped: ${student.questionsSkipped}`}
                  />
                  <div
                    style={{ width: '1%' }}
                    className="h-full bg-blue-500 animate-pulse"
                    title="Currently Viewing"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-stone-500 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Attempted (
                      {student.questionsAttempted})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Skipped (
                      {student.questionsSkipped})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Viewing (Q #
                      {student.currentQuestion})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-stone-300 inline-block" /> Not Visited (
                      {student.questionsRemaining})
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('questions')}
                    className="text-[#650000] hover:underline flex items-center gap-1"
                  >
                    <span>View all 100 questions grid</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Subject Accuracy Breakdown */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                  Subject-Wise Diagnostic Mastery
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block">Physics</span>
                    <span className="text-xl font-black text-stone-900 mt-0.5 block">
                      {student.physicsAccuracy}%
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block">Chemistry</span>
                    <span className="text-xl font-black text-stone-900 mt-0.5 block">
                      {student.chemistryAccuracy}%
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block">Mathematics</span>
                    <span className="text-xl font-black text-stone-900 mt-0.5 block">
                      {student.mathAccuracy}%
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 block">Biology</span>
                    <span className="text-xl font-black text-stone-900 mt-0.5 block">
                      {student.biologyAccuracy}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 100 QUESTIONS VISUALIZER (SECTION #4) */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-stone-900">
                    100-Question Progress Matrix & Response Inspector
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Click any numbered question badge below to inspect question telemetry and selected option
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500" /> Answered
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-400" /> Skipped
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-500 ring-2 ring-blue-300" /> Viewing
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-stone-200" /> Unvisited
                  </span>
                </div>
              </div>

              {/* 100 Questions Interactive Grid */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-[380px] overflow-y-auto">
                {student.questions.map(q => {
                  let badgeStyle = 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200';
                  if (q.status === 'Currently Viewing') {
                    badgeStyle = 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 font-black animate-pulse';
                  } else if (q.status === 'Answered') {
                    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold hover:bg-emerald-200';
                  } else if (q.status === 'Skipped') {
                    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-bold hover:bg-amber-200';
                  }

                  return (
                    <button
                      key={q.questionNumber}
                      onClick={() => setSelectedQuestion(q)}
                      className={`h-9 rounded-lg border text-xs flex flex-col items-center justify-center transition apple-button cursor-pointer relative ${badgeStyle}`}
                      title={`Question ${q.questionNumber} (${q.subject}) - ${q.status}`}
                    >
                      <span>{q.questionNumber}</span>
                      {q.selectedOption && (
                        <span className="text-[9px] font-black -mt-1">{q.selectedOption}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Question Details Inspector Popover */}
              {selectedQuestion && (
                <div className="p-4 rounded-2xl border border-[#E5BD55] bg-[#FFFBEB] text-stone-900 space-y-2 relative shadow-sm">
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="absolute top-3 right-3 text-stone-400 hover:text-stone-700"
                  >
                    <X size={15} />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#650000] text-white font-black text-xs flex items-center justify-center">
                      Q #{selectedQuestion.questionNumber}
                    </span>
                    <span className="font-black text-xs text-[#78350F] uppercase">
                      {selectedQuestion.subject} Section
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        selectedQuestion.status === 'Answered'
                          ? 'bg-emerald-200 text-emerald-900'
                          : selectedQuestion.status === 'Skipped'
                          ? 'bg-amber-200 text-amber-900'
                          : selectedQuestion.status === 'Currently Viewing'
                          ? 'bg-blue-200 text-blue-900'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {selectedQuestion.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-700 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-stone-500 block text-[10px] font-bold">Selected Response:</span>
                      <strong className="text-sm font-black text-stone-900">
                        {selectedQuestion.selectedOption ? `Option ${selectedQuestion.selectedOption}` : 'No option chosen'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] font-bold">Time Spent:</span>
                      <strong className="text-sm font-black text-stone-900">{selectedQuestion.timeSpentSeconds} seconds</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] font-bold">Flagged for Review:</span>
                      <strong className="text-sm font-black text-stone-900">{selectedQuestion.flaggedForReview ? 'Yes 🚩' : 'No'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] font-bold">Encrypted Telemetry Sync:</span>
                      <strong className="text-sm font-black text-emerald-700">Verified OK</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TABLET TELEMETRY (SECTION #4 & #6) */}
          {activeTab === 'device' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hardware Status Card */}
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Tablet size={15} /> Hardware & Battery Specifications
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {student.assignedTabletId}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Battery Percentage:</span>
                      <span className="font-black text-stone-900">{student.batteryPercentage}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Battery Health Condition:</span>
                      <span className="font-bold text-emerald-700">{student.batteryHealth}% (Optimal)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Device Temperature:</span>
                      <span className="font-bold text-stone-900">{student.deviceTemperature}°C</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">CPU Usage / Thermal Throttling:</span>
                      <span className="font-bold text-stone-900">{student.cpuUsage}% (Normal clock)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">RAM Allocation:</span>
                      <span className="font-bold text-stone-900">{student.ramUsage}% (3.8 GB / 6.0 GB)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Internal Storage Free:</span>
                      <span className="font-bold text-stone-900">{100 - student.storageUsage}% free (42 GB available)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Operating System:</span>
                      <span className="font-bold text-stone-900">{student.osVersion}</span>
                    </div>
                  </div>
                </div>

                {/* Connectivity & Kiosk Status */}
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-black text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Wifi size={15} /> Wireless Connectivity & MDM Kiosk
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Encrypted Link
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Associated Wi-Fi SSID:</span>
                      <span className="font-mono font-bold text-stone-900">{student.wifiSsid}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Signal Strength (RSSI):</span>
                      <span className="font-bold text-stone-900">{student.networkStrengthDbm} dBm ({student.networkStatus})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Active Foreground App:</span>
                      <span className="font-bold text-[#650000]">{student.activeApp}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Screen Lock Status:</span>
                      <span className="font-bold text-stone-900">{student.screenStatus}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Tab Switching Events:</span>
                      <span className={`font-black ${student.tabSwitchCount > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
                        {student.tabSwitchCount} unauthorized switches
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Device Uptime:</span>
                      <span className="font-bold text-stone-900">{student.uptimeHours} hours</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Last Telemetry Heartbeat:</span>
                      <span className="font-bold text-emerald-700">{student.lastOnlineTimestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MDM Remote Actions Bar */}
              <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-stone-700">MDM Remote Management Commands:</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Ping sent to ${student.assignedTabletId}. Telemetry RTT: 14ms.`)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-50 transition shadow-2xs"
                  >
                    Ping Diagnostic
                  </button>
                  <button
                    onClick={() => alert(`Remote cache purged on ${student.assignedTabletId}.`)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-50 transition shadow-2xs"
                  >
                    Clear App Cache
                  </button>
                  <button
                    onClick={() => alert(`Reboot instruction queued for ${student.assignedTabletId}.`)}
                    className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 font-bold text-red-700 hover:bg-red-100 transition shadow-2xs"
                  >
                    Reboot Tablet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TIMELINE (SECTION #4) */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-black text-xs uppercase tracking-wider text-stone-900">
                  Student Assessment Activity & Device Audit Log
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Chronological telemetry stream recorded by the Central Tablet Intelligence service
                </p>
              </div>

              <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 pl-1">
                {student.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="flex items-start gap-3 relative pl-6">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs absolute left-2.5 top-1 -translate-x-1/2 ${
                        event.category === 'exam'
                          ? 'bg-emerald-600'
                          : event.category === 'security'
                          ? 'bg-red-600'
                          : event.category === 'device'
                          ? 'bg-blue-600'
                          : 'bg-stone-500'
                      }`}
                    />
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 flex-1 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-stone-900">{event.event}</span>
                        <span className="font-mono text-[11px] text-stone-400 font-bold">{event.timestamp}</span>
                      </div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Category: {event.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>Verified by Sir MV Tablet Intelligence Command</span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-400">Esc to {isFullScreen ? 'restore' : 'close'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(prev => !prev)}
              className="px-4 py-2 rounded-full font-bold text-xs text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition apple-button shadow-xs flex items-center gap-1.5"
            >
              {isFullScreen ? (
                <>
                  <Minimize2 size={13} />
                  <span>Restore Window</span>
                </>
              ) : (
                <>
                  <Maximize2 size={13} />
                  <span>Expand to Full Screen</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full font-bold text-xs text-white bg-stone-900 hover:bg-black transition apple-button shadow-sm"
            >
              Close Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

