import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Clock,
  User,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Edit2,
  Check,
  Power,
  Calendar,
  Save,
  AlertCircle,
  Search,
  Users,
  Smartphone,
  Eye,
  CheckCircle
} from 'lucide-react';
import { createPortal } from 'react-dom';
import {
  LIVE_100_STUDENT_TABLETS,
  StudentTabletRecord,
} from '../tabletIntelligenceData';
import { STUDENTS_100_ROSTER } from '../rosterData';

// Types for Calling System
export interface ParentContact {
  id: string;
  name: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  phone: string;
  isAuthorized: boolean;
  avatarUrl?: string;
}

export interface StudentCallLog {
  id: string;
  timestamp: string;
  parentName: string;
  relationship: string;
  parentPhone: string;
  durationSeconds: number;
  type: 'incoming' | 'outgoing' | 'missed';
  status: 'completed' | 'missed' | 'rejected' | 'terminated_schedule';
}

export interface StudentParentConnectData {
  studentId: string;
  rollNumber: string;
  studentName: string;
  pucYear: 'I PU' | 'II PU';
  tabNumber: string;
  photoUrl: string;
  callingEnabled: boolean;
  parents: ParentContact[];
  callLogs: StudentCallLog[];
  totalTalkTimeSeconds: number;
}

export interface TimingSchedule {
  dayOfWeek: number; // 0: Sunday, 1: Monday, ... 6: Saturday
  dayName: string;
  startTime: string; // "17:00"
  endTime: string;   // "21:30"
  maxDurationMinutes: number;
  isActive: boolean;
}

const DEFAULT_SCHEDULES: TimingSchedule[] = [
  { dayOfWeek: 0, dayName: 'Sunday', startTime: '09:00', endTime: '21:00', maxDurationMinutes: 20, isActive: true },
  { dayOfWeek: 1, dayName: 'Monday', startTime: '17:00', endTime: '20:30', maxDurationMinutes: 15, isActive: true },
  { dayOfWeek: 2, dayName: 'Tuesday', startTime: '17:00', endTime: '20:30', maxDurationMinutes: 15, isActive: true },
  { dayOfWeek: 3, dayName: 'Wednesday', startTime: '17:00', endTime: '20:30', maxDurationMinutes: 15, isActive: true },
  { dayOfWeek: 4, dayName: 'Thursday', startTime: '17:00', endTime: '20:30', maxDurationMinutes: 15, isActive: true },
  { dayOfWeek: 5, dayName: 'Friday', startTime: '17:00', endTime: '20:30', maxDurationMinutes: 15, isActive: true },
  { dayOfWeek: 6, dayName: 'Saturday', startTime: '14:00', endTime: '21:00', maxDurationMinutes: 20, isActive: true },
];

const LOCAL_STORAGE_DATA_KEY = 'sirmv_admin_parent_connect_students_v1';
const LOCAL_STORAGE_SCHED_KEY = 'sirmv_admin_parent_connect_schedules_v1';

// Format seconds into "Xh Ym Zs" or "Ym Zs"
export const formatTalkTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

// Seed initial 100 students dataset for Parent Connect
function generateInitialStudentData(): StudentParentConnectData[] {
  return LIVE_100_STUDENT_TABLETS.map((tab, idx) => {
    const isIPU = tab.class.startsWith('I PU');
    const rosterMatch = STUDENTS_100_ROSTER.find(s => s.name === tab.studentName);
    const lastName = tab.studentName.split(' ')[1] || 'Kumar';
    
    // Seed talk time: realistic distributions (10 mins to 1 hr 40 mins)
    const seedSeconds = ((idx * 137) % 5200) + 420;
    
    // Pre-generate 2-4 call logs
    const mockLogs: StudentCallLog[] = [
      {
        id: `call_${tab.id}_1`,
        timestamp: 'Today, 06:45 PM',
        parentName: `Mr. Suresh ${lastName}`,
        relationship: 'Father',
        parentPhone: `+91-98${String(10000000 + idx * 83).slice(0, 8)}`,
        durationSeconds: Math.floor(seedSeconds * 0.45),
        type: 'outgoing',
        status: 'completed',
      },
      {
        id: `call_${tab.id}_2`,
        timestamp: 'Yesterday, 07:15 PM',
        parentName: `Mrs. Geetha ${lastName}`,
        relationship: 'Mother',
        parentPhone: `+91-94${String(20000000 + idx * 67).slice(0, 8)}`,
        durationSeconds: Math.floor(seedSeconds * 0.35),
        type: 'incoming',
        status: 'completed',
      },
      {
        id: `call_${tab.id}_3`,
        timestamp: '09 Nov, 08:10 PM',
        parentName: `Mr. Suresh ${lastName}`,
        relationship: 'Father',
        parentPhone: `+91-98${String(10000000 + idx * 83).slice(0, 8)}`,
        durationSeconds: Math.floor(seedSeconds * 0.2),
        type: 'outgoing',
        status: 'completed',
      },
      {
        id: `call_${tab.id}_4`,
        timestamp: '07 Nov, 06:12 PM',
        parentName: `Mrs. Geetha ${lastName}`,
        relationship: 'Mother',
        parentPhone: `+91-94${String(20000000 + idx * 67).slice(0, 8)}`,
        durationSeconds: 0,
        type: 'missed',
        status: 'missed',
      },
    ];

    return {
      studentId: tab.id,
      rollNumber: tab.rollNumber,
      studentName: tab.studentName,
      pucYear: isIPU ? 'I PU' : 'II PU',
      tabNumber: tab.assignedTabletId,
      photoUrl: '/student-profile.png',
      callingEnabled: idx !== 4 && idx !== 18, // 2 demo students disabled
      totalTalkTimeSeconds: seedSeconds,
      parents: [
        {
          id: `p_fa_${tab.id}`,
          name: `Mr. Suresh ${lastName}`,
          relationship: 'Father',
          phone: `+91-98${String(10000000 + idx * 83).slice(0, 8)}`,
          isAuthorized: true,
        },
        {
          id: `p_mo_${tab.id}`,
          name: `Mrs. Geetha ${lastName}`,
          relationship: 'Mother',
          phone: `+91-94${String(20000000 + idx * 67).slice(0, 8)}`,
          isAuthorized: true,
        },
      ],
      callLogs: mockLogs,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT CALLING DETAILS POPUP MODAL (Same architecture as ExamMCQReviewModal)
// ─────────────────────────────────────────────────────────────────────────────
export interface StudentCallingDetailModalProps {
  studentData: StudentParentConnectData | null;
  onClose: () => void;
  onUpdateStudent: (updated: StudentParentConnectData) => void;
  sidebarWidth?: number;
}

export function StudentCallingDetailModal({
  studentData,
  onClose,
  onUpdateStudent,
  sidebarWidth = 86,
}: StudentCallingDetailModalProps) {
  const [data, setData] = useState<StudentParentConnectData | null>(studentData);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [tempPhone, setTempPhone] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setData(studentData);
    setEditingParentId(null);
  }, [studentData]);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data || typeof document === 'undefined') return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Toggle Master Calling Permission for this student
  const handleToggleCalling = () => {
    const updated: StudentParentConnectData = {
      ...data,
      callingEnabled: !data.callingEnabled,
    };
    setData(updated);
    onUpdateStudent(updated);
    showToast(
      updated.callingEnabled
        ? `Calling enabled for ${updated.studentName}`
        : `Calling disabled for ${updated.studentName}`
    );
  };

  // Toggle individual parent authorization
  const handleToggleParentAuth = (parentId: string) => {
    const updatedParents = data.parents.map(p =>
      p.id === parentId ? { ...p, isAuthorized: !p.isAuthorized } : p
    );
    const updated: StudentParentConnectData = {
      ...data,
      parents: updatedParents,
    };
    setData(updated);
    onUpdateStudent(updated);
    showToast('Parent authorization updated.');
  };

  // Start editing parent number/name
  const startEditingParent = (parent: ParentContact) => {
    setEditingParentId(parent.id);
    setTempPhone(parent.phone);
    setTempName(parent.name);
  };

  // Save edited parent phone number
  const handleSaveParentEdit = (parentId: string) => {
    if (!tempPhone.trim()) return;
    const updatedParents = data.parents.map(p =>
      p.id === parentId ? { ...p, phone: tempPhone.trim(), name: tempName.trim() } : p
    );
    const updated: StudentParentConnectData = {
      ...data,
      parents: updatedParents,
    };
    setData(updated);
    onUpdateStudent(updated);
    setEditingParentId(null);
    showToast('Parent contact information saved successfully.');
  };

  return createPortal(
    <div
      style={{
        left: 0,
        paddingLeft:
          typeof window !== 'undefined' && window.innerWidth >= 768
            ? sidebarWidth + 24
            : undefined,
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-300"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden"
      >
        {/* Toast alert */}
        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{successToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div
          className="px-6 py-5 border-b border-stone-200 flex items-center justify-between text-white"
          style={{ backgroundColor: '#A41419' }}
        >
          <div className="flex items-center gap-3.5">
            <img
              src={data.photoUrl}
              alt={data.studentName}
              className="w-12 h-12 rounded-full border-2 border-white/40 object-cover shadow-sm bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">{data.studentName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-[#FFE59A] border border-white/20">
                  {data.pucYear}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/25 text-white border border-white/10">
                  {data.tabNumber}
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Roll No: <span className="font-bold text-white">{data.rollNumber}</span> • Parent Voice Calling Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition border border-white/15"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
          {/* Top Quick Control: Enable/Disable Calling & Total Talk Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Talk Time Card */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Total Talk Time</span>
                <span className="text-lg font-black text-stone-900 block">{formatTalkTime(data.totalTalkTimeSeconds)}</span>
                <span className="text-[11px] text-stone-500">{data.callLogs.length} total call interactions</span>
              </div>
            </div>

            {/* Master Calling Access Status */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between gap-4 md:col-span-2">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    data.callingEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {data.callingEnabled ? <Phone size={24} /> : <Power size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-stone-900">
                      {data.callingEnabled ? 'Calling Permitted' : 'Calling Suspended'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        data.callingEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {data.callingEnabled ? 'ACTIVE' : 'BLOCKED'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {data.callingEnabled
                      ? 'Student can make outgoing encrypted voice calls to authorized parents within scheduled hours.'
                      : 'Calling feature is locked for this student tablet by the administrator.'}
                  </p>
                </div>
              </div>

              {/* Toggle Master Calling Button */}
              <button
                type="button"
                onClick={handleToggleCalling}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-xs shrink-0 flex items-center gap-1.5 ${
                  data.callingEnabled
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600'
                }`}
              >
                <Power size={14} />
                <span>{data.callingEnabled ? 'Disable Calling' : 'Enable Calling'}</span>
              </button>
            </div>
          </div>

          {/* SECTION: AUTHORIZED PARENTS & EDIT NUMBERS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#A41419]" />
                <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">
                  Authorized Parent Contacts & Numbers
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                Admin Privilege: Edit phone numbers & toggle calling access per parent
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.parents.map((parent) => {
                const isEditing = editingParentId === parent.id;

                return (
                  <div
                    key={parent.id}
                    className={`p-4 rounded-xl border transition-all ${
                      parent.isAuthorized
                        ? 'border-stone-200 bg-stone-50/60'
                        : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#A41419]/10 text-[#A41419] flex items-center justify-center font-bold text-sm shrink-0 border border-[#A41419]/20">
                          {parent.relationship[0]}
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="px-2 py-1 text-xs font-bold rounded border border-stone-300 w-full"
                                placeholder="Parent Name"
                              />
                              <input
                                type="text"
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                                className="px-2 py-1 text-xs font-bold rounded border border-[#A41419] text-[#A41419] w-full"
                                placeholder="+91-XXXXXXXXXX"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs text-stone-900">{parent.name}</span>
                                <span className="text-[10px] font-bold text-stone-500 px-1.5 py-0.2 rounded bg-stone-200">
                                  {parent.relationship}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-bold text-stone-700 block mt-0.5">
                                {parent.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleSaveParentEdit(parent.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                            title="Save contact"
                          >
                            <Check size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditingParent(parent)}
                            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition"
                            title="Edit phone number"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Parent Authorization toggle button */}
                    <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-stone-500">
                        Status:{' '}
                        <span className={parent.isAuthorized ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {parent.isAuthorized ? 'Authorized to Call' : 'Access Revoked'}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleParentAuth(parent.id)}
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition ${
                          parent.isAuthorized
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {parent.isAuthorized ? 'Revoke Access' : 'Authorize'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: CALL HISTORY LOGS (WHO HE TALKED WITH & HOW MUCH) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#A41419]" />
                <h3 className="font-black text-sm text-stone-900 uppercase tracking-wide">
                  Detailed Call Activity & Interaction Logs
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                Record of all encrypted WebRTC audio calls
              </span>
            </div>

            <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200">
              {data.callLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500">
                  No call sessions recorded for this student yet.
                </div>
              ) : (
                data.callLogs.map((log) => (
                  <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-stone-50/70 transition">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          log.type === 'outgoing'
                            ? 'bg-blue-50 text-blue-700'
                            : log.type === 'incoming'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {log.type === 'outgoing' && <PhoneOutgoing size={16} />}
                        {log.type === 'incoming' && <PhoneIncoming size={16} />}
                        {log.type === 'missed' && <PhoneMissed size={16} />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900">{log.parentName}</span>
                          <span className="text-[10px] font-bold text-stone-500">({log.relationship})</span>
                          <span className="text-[10px] font-mono text-stone-400">{log.parentPhone}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 block mt-0.5">{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-stone-900 block">
                        {log.durationSeconds > 0 ? formatTalkTime(log.durationSeconds) : '0s (Missed)'}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase ${
                          log.status === 'completed'
                            ? 'text-emerald-700'
                            : log.status === 'missed'
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Sir MV Institutional Voice Gate • Real-Time WebRTC Encryption
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-xs"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PARENT CONNECT SECTION (MAIN COMPONENT)
// ─────────────────────────────────────────────────────────────────────────────
interface AdminParentConnectSectionProps {
  sidebarWidth?: number;
}

export default function AdminParentConnectSection({ sidebarWidth = 86 }: AdminParentConnectSectionProps) {
  // Students calling data
  const [students, setStudents] = useState<StudentParentConnectData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load parent connect students from storage', e);
    }
    return generateInitialStudentData();
  });

  // Call Schedules
  const [schedules, setSchedules] = useState<TimingSchedule[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SCHED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load parent connect schedules from storage', e);
    }
    return DEFAULT_SCHEDULES;
  });

  const [activeTab, setActiveTab] = useState<'students' | 'timing'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [pucFilter, setPucFilter] = useState<'ALL' | 'I PU' | 'II PU'>('ALL');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentParentConnectData | null>(null);
  const [scheduleNotice, setScheduleNotice] = useState<string | null>(null);

  // Sync students data to localStorage
  const handleUpdateStudent = (updated: StudentParentConnectData) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.studentId === updated.studentId ? updated : s));
      try {
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save parent connect students to storage', e);
      }
      return next;
    });
    setSelectedStudentForModal(updated);
  };

  // Sync schedules
  const handleUpdateSchedule = (index: number, field: keyof TimingSchedule, value: any) => {
    setSchedules((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      try {
        localStorage.setItem(LOCAL_STORAGE_SCHED_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save schedules', e);
      }
      return next;
    });
  };

  const handleSaveAllSchedules = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SCHED_KEY, JSON.stringify(schedules));
      setScheduleNotice('Calling schedules updated and active institution-wide.');
      setTimeout(() => setScheduleNotice(null), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  // Filter students
  const filteredStudents = students.filter((st) => {
    if (pucFilter !== 'ALL' && st.pucYear !== pucFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        st.studentName.toLowerCase().includes(term) ||
        st.rollNumber.toLowerCase().includes(term) ||
        st.tabNumber.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Top stats
  const totalStudents = students.length;
  const activeCallingCount = students.filter((s) => s.callingEnabled).length;
  const totalCallSeconds = students.reduce((acc, curr) => acc + curr.totalTalkTimeSeconds, 0);

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ── */}
      <div
        className="rounded-2xl p-6 md:p-7 text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        style={{ backgroundColor: '#A41419' }}
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[#E5BD55]" />
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FFE59A] text-[#500000] tracking-wider">
              ADMIN CONTROL
            </span>
            <span className="text-xs text-white/80 font-medium">• Voice Telephony & Tablet Calling Gateway</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Parent Connect</h1>
          <p className="text-xs text-white/85 mt-1 max-w-2xl leading-relaxed">
            Manage timing maintenance, monitor student-parent call durations, verify parent numbers, and enable or disable tablet voice calling.
          </p>
        </div>

        {/* Tab switch pills: Student Register vs Timing Maintenance */}
        <div className="flex items-center bg-black/30 p-1 rounded-2xl border border-white/15 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-white text-[#A41419] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users size={15} />
            <span>Student Register</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'timing'
                ? 'bg-white text-[#A41419] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Clock size={15} />
            <span>Timing Maintenance</span>
          </button>
        </div>
      </div>

      {/* ── Quick KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Total Tablets</span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">{totalStudents}</span>
            <span className="text-xs text-stone-500">I PU & II PU active students</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Smartphone size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Calling Enabled</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">{activeCallingCount}</span>
            <span className="text-xs text-stone-500">{totalStudents - activeCallingCount} disabled by admin</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Phone size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Total Talk Time Logged</span>
            <span className="text-2xl font-black text-[#A41419] mt-1 block">{formatTalkTime(totalCallSeconds)}</span>
            <span className="text-xs text-stone-500">Encrypted institutional audio calls</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#A41419] flex items-center justify-center border border-rose-100">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* ── TAB 1: STUDENT DATA TABLE WITH POPUP TRIGGER ── */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-0">
          {/* Table Toolbar */}
          <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-stone-900 uppercase tracking-wide">
                Parent Connect Tabular Register
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Click on any student’s name to open their calling popup window, view who they talked with, total talk time, change parent numbers, or toggle permissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Year Toggle */}
              <div className="inline-flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                {(['ALL', 'I PU', 'II PU'] as const).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setPucFilter(yr)}
                    className={`px-3 py-1 font-bold rounded-lg transition ${
                      pucFilter === yr
                        ? 'bg-white text-[#A41419] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student, roll no, or tab..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#A41419] w-56"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black uppercase tracking-wider text-stone-500">
                  <th className="px-5 py-3">Photo</th>
                  <th className="px-5 py-3">Name (Click to view dossier)</th>
                  <th className="px-5 py-3">Roll Number</th>
                  <th className="px-5 py-3">PUC Level</th>
                  <th className="px-5 py-3">Tab Number</th>
                  <th className="px-5 py-3">Total Talk Time</th>
                  <th className="px-5 py-3">Calling Status</th>
                  <th className="px-5 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-stone-400">
                      No student records found matching “{searchTerm}”.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.studentId} className="hover:bg-stone-50/80 transition-colors">
                      {/* Photo */}
                      <td className="px-5 py-3">
                        <img
                          src={st.photoUrl}
                          alt={st.studentName}
                          className="w-10 h-10 rounded-full border border-stone-200 object-cover"
                        />
                      </td>

                      {/* Name with Popup Trigger */}
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForModal(st)}
                          className="font-bold text-sky-800 hover:text-sky-950 hover:underline flex items-center gap-1.5 text-left"
                          title="Open student calling details"
                        >
                          <span>{st.studentName}</span>
                          <Eye size={13} className="text-sky-600 opacity-70" />
                        </button>
                      </td>

                      {/* Roll Number */}
                      <td className="px-5 py-3 font-mono font-bold text-stone-600">{st.rollNumber}</td>

                      {/* PUC I / II */}
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-stone-100 text-stone-800 border border-stone-200">
                          {st.pucYear}
                        </span>
                      </td>

                      {/* Tab Number */}
                      <td className="px-5 py-3 font-mono font-bold text-stone-800">{st.tabNumber}</td>

                      {/* Total Talk Time */}
                      <td className="px-5 py-3 font-mono font-bold text-stone-900">
                        {formatTalkTime(st.totalTalkTimeSeconds)}
                      </td>

                      {/* Calling Status */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            st.callingEnabled
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              st.callingEnabled ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                          {st.callingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>

                      {/* Quick Action */}
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForModal(st)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-stone-100 hover:bg-[#A41419] hover:text-white transition"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: TIMING MAINTENANCE SECTION ── */}
      {activeTab === 'timing' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-[#A41419]" />
                <h2 className="text-base font-black text-stone-900 uppercase tracking-wide">
                  Institutional Voice Calling Timing Maintenance
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Configure permissible call windows for student tablets. Calls initiated outside these windows are automatically blocked or gracefully ended by the institutional gateway.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAllSchedules}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Save size={14} />
              <span>Save & Apply Schedules</span>
            </button>
          </div>

          {/* Schedule Notice */}
          {scheduleNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{scheduleNotice}</span>
            </div>
          )}

          {/* Schedule Configuration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sched, idx) => (
              <div
                key={sched.dayOfWeek}
                className={`p-4 rounded-2xl border transition-all ${
                  sched.isActive ? 'border-stone-200 bg-stone-50/50' : 'border-rose-100 bg-rose-50/20 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-sm text-stone-900">{sched.dayName}</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">
                      {sched.isActive ? 'Active' : 'Off'}
                    </span>
                    <input
                      type="checkbox"
                      checked={sched.isActive}
                      onChange={(e) => handleUpdateSchedule(idx, 'isActive', e.target.checked)}
                      className="accent-[#A41419] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Start Window</span>
                      <input
                        type="time"
                        value={sched.startTime}
                        disabled={!sched.isActive}
                        onChange={(e) => handleUpdateSchedule(idx, 'startTime', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono font-bold bg-white outline-none focus:border-[#A41419]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">End Window</span>
                      <input
                        type="time"
                        value={sched.endTime}
                        disabled={!sched.isActive}
                        onChange={(e) => handleUpdateSchedule(idx, 'endTime', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-mono font-bold bg-white outline-none focus:border-[#A41419]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                      Max Duration Limit: <strong className="text-stone-900">{sched.maxDurationMinutes} mins</strong>
                    </span>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={sched.maxDurationMinutes}
                      disabled={!sched.isActive}
                      onChange={(e) => handleUpdateSchedule(idx, 'maxDurationMinutes', parseInt(e.target.value, 10))}
                      className="w-full accent-[#A41419] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Student Calling Detail Popup Modal ── */}
      <StudentCallingDetailModal
        studentData={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        onUpdateStudent={handleUpdateStudent}
        sidebarWidth={sidebarWidth}
      />
    </div>
  );
}
