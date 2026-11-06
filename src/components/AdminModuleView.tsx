import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Wifi, Lock, BarChart2, Shield, Clock, FileText, Bell, Settings, Search, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { ERPModuleId, ADMIN_NAV_SECTIONS } from '../components/erpNavConfig';
import DeviceHealthDetailModal from './tabletIntelligence/DeviceHealthDetailModal';
import {
  getTabletMacAddress,
  getTabletSerialNumber,
  LIVE_100_STUDENT_TABLETS,
  StudentTabletRecord,
} from '../tabletIntelligenceData';

const ACTIVE_EXAMS = [
  { id: 'ipu-neet', label: 'I PU NEET', classPrefix: 'I PU' },
  { id: 'iipu-jee', label: 'II PU JEE', classPrefix: 'II PU' },
] as const;

type ActiveExamId = typeof ACTIVE_EXAMS[number]['id'];

interface StudentTableColumn {
  label: string;
  value: (record: StudentTabletRecord) => string;
  selectable?: boolean;
  action?: boolean;
}

const STUDENT_TABLE_COLUMNS: Record<string, StudentTableColumn[]> = {
  device_admin: [
    { label: 'Student', value: (record) => record.studentName },
    { label: 'Roll Number', value: (record) => record.rollNumber },
    { label: 'Tablet', value: (record) => record.assignedTabletId },
    { label: 'Section', value: (record) => record.section },
    { label: 'Battery', value: (record) => `${record.batteryPercentage}%` },
    { label: 'Battery Health', value: (record) => `${record.batteryHealth}%` },
    { label: 'Device Status', value: (record) => record.deviceStatus },
    { label: 'Network', value: (record) => record.networkStatus },
  ],
  exam_control: [
    { label: 'Student', value: (record) => record.studentName },
    { label: 'Roll Number', value: (record) => record.rollNumber },
    { label: 'Tablet', value: (record) => record.assignedTabletId },
    { label: 'Section', value: (record) => record.section },
    { label: 'Questions', value: (record) => `${record.questionsAttempted} / 100` },
    { label: 'Submission', value: (record) => record.submissionStatus },
    { label: 'Time Remaining', value: (record) => typeof record.timeRemainingMinutes === 'number' ? `${record.timeRemainingMinutes} min` : record.timeRemainingMinutes },
    { label: 'Last Activity', value: (record) => record.lastActivity },
  ],
  student_activity: [
    { label: 'Student', value: (record) => record.studentName },
    { label: 'Roll Number', value: (record) => record.rollNumber },
    { label: 'Tablet', value: (record) => record.assignedTabletId },
    { label: 'Active App', value: (record) => record.activeApp },
    { label: 'Focus Time', value: (record) => `${record.foregroundDurationMinutes} min` },
    { label: 'Tab Switches', value: (record) => String(record.tabSwitchCount) },
    { label: 'Idle Time', value: (record) => `${record.idleDurationSeconds} sec` },
  ],
  security_remote: [
    { label: 'Student', value: (record) => record.studentName },
    { label: 'Roll Number', value: (record) => record.rollNumber },
    { label: 'Tablet', value: (record) => record.assignedTabletId },
    { label: 'Device Status', value: (record) => record.deviceStatus },
    { label: 'Screen Status', value: (record) => record.screenStatus },
    { label: 'Security Incident', value: (record) => record.securityIncident?.type ?? 'None' },
    { label: 'Severity', value: (record) => record.securityIncident?.severity ?? 'Clear' },
  ],
  reports_intelligence: [
    { label: 'Student', value: (record) => record.studentName },
    { label: 'Roll Number', value: (record) => record.rollNumber },
    { label: 'Section', value: (record) => record.section },
    { label: 'Attendance', value: (record) => record.attendanceStatus },
    { label: 'Check-in', value: (record) => record.checkInTime },
    { label: 'Avg Accuracy', value: (record) => `${record.averageAccuracy}%` },
    { label: 'AI Insight', value: (record) => record.aiPrediction?.category ?? 'No alert' },
  ],
};

const DEFAULT_STUDENT_TABLE_COLUMNS: StudentTableColumn[] = [
  { label: 'Student', value: (record) => record.studentName },
  { label: 'Roll Number', value: (record) => record.rollNumber },
  { label: 'Tablet', value: (record) => record.assignedTabletId },
  { label: 'Section', value: (record) => record.section },
  { label: 'Device Status', value: (record) => record.deviceStatus },
];

const DEVICE_SUMMARY_COLUMNS: StudentTableColumn[] = [
  { label: 'Student Name', value: (record) => record.studentName, selectable: true },
  { label: 'Roll Number', value: (record) => record.rollNumber },
  { label: 'Tablet ID', value: (record) => record.assignedTabletId },
  { label: 'Section', value: (record) => record.section },
  { label: 'Year', value: (record) => record.class.startsWith('I PU') ? 'I PU' : 'II PU' },
  { label: 'Device Status', value: (record) => record.deviceStatus },
];

const SERIAL_SPEC_COLUMNS: StudentTableColumn[] = [
  { label: 'Student', value: (record) => record.studentName },
  { label: 'Roll Number', value: (record) => record.rollNumber },
  { label: 'Tablet', value: (record) => record.assignedTabletId },
  { label: 'Section', value: (record) => record.section },
  { label: 'Serial Number', value: getTabletSerialNumber },
  { label: 'MAC Address', value: getTabletMacAddress },
  { label: 'More', value: () => 'Click to view more', action: true },
];

// ── Module metadata map ─────────────────────────────────────────────────────
const MODULE_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    sectionColor: string;
    sectionLabel: string;
    sectionNumber: number;
    description: string;
    stats: { label: string; value: string; color: string }[];
    actions: string[];
  }
> = {
  // Section 1 ─ Device Administration
  adm_all_devices: {
    title: 'All Devices',
    subtitle: 'Complete tablet fleet inventory and live status',
    sectionColor: '#0284C7', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Search students by name or tablet ID, filter by PU year, and open a student record for device details.',
    stats: [
      { label: 'Total Tablets', value: '100', color: '#0284C7' },
      { label: 'Online', value: '82', color: '#16A34A' },
      { label: 'Offline', value: '11', color: '#DC2626' },
      { label: 'Unknown', value: '7', color: '#D97706' },
    ],
    actions: ['View Grid', 'View Table', 'Export CSV', 'Refresh Status'],
  },
  adm_battery_health: {
    title: 'Battery Health',
    subtitle: 'Per-device battery level and degradation analytics',
    sectionColor: '#16A34A', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Real-time battery percentage readings, charge cycle counts, and low-battery warnings across all devices.',
    stats: [
      { label: 'Avg Battery', value: '68%', color: '#16A34A' },
      { label: 'Critical (<20%)', value: '7', color: '#DC2626' },
      { label: 'Charging', value: '14', color: '#D97706' },
      { label: 'Full (>90%)', value: '23', color: '#059669' },
    ],
    actions: ['Battery Report', 'Alert Low Battery', 'Export CSV'],
  },
  adm_student_mapping: {
    title: 'Student Mapping',
    subtitle: 'Student-to-device assignment registry',
    sectionColor: '#7C3AED', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Maps each student USN to their assigned tablet ID. Reassign, unassign, or swap devices.',
    stats: [
      { label: 'Assigned', value: '100', color: '#7C3AED' },
      { label: 'Unassigned Devices', value: '0', color: '#64748B' },
      { label: 'Shared Devices', value: '0', color: '#D97706' },
      { label: 'Last Synced', value: '2m ago', color: '#16A34A' },
    ],
    actions: ['Reassign Device', 'Export Mapping', 'Sync Now'],
  },
  adm_device_inventory: {
    title: 'Device Inventory',
    subtitle: 'Serial numbers, procurement and asset records',
    sectionColor: '#EA580C', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Complete asset register with procurement date, warranty status, model, and department assignment.',
    stats: [
      { label: 'Total Assets', value: '100', color: '#EA580C' },
      { label: 'Under Warranty', value: '87', color: '#16A34A' },
      { label: 'Expired Warranty', value: '13', color: '#DC2626' },
      { label: 'In Service', value: '100', color: '#0284C7' },
    ],
    actions: ['Add Device', 'Export Register', 'Print QR Labels'],
  },
  adm_serial_specs: {
    title: 'Serial Numbers & Specs',
    subtitle: 'Hardware specifications and serial number lookup',
    sectionColor: '#64748B', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Look up any device by serial number. View full hardware specs: model, RAM, storage, OS version.',
    stats: [
      { label: 'Models', value: '3', color: '#64748B' },
      { label: 'OS Versions', value: '2', color: '#0284C7' },
      { label: 'Avg RAM', value: '4 GB', color: '#7C3AED' },
      { label: 'Avg Storage', value: '64 GB', color: '#D97706' },
    ],
    actions: ['Search Serial', 'Export Specs', 'Download Report'],
  },
  adm_connectivity: {
    title: 'Connectivity',
    subtitle: 'Wi-Fi signal strength and network diagnostics',
    sectionColor: '#06B6D4', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Real-time Wi-Fi signal (RSSI) per device, SSID connection logs, packet loss, and network health map.',
    stats: [
      { label: 'Connected', value: '82', color: '#16A34A' },
      { label: 'Weak Signal', value: '12', color: '#D97706' },
      { label: 'Disconnected', value: '6', color: '#DC2626' },
      { label: 'Avg Latency', value: '18 ms', color: '#06B6D4' },
    ],
    actions: ['Ping All Devices', 'Network Map', 'Export Logs'],
  },
  adm_device_health: {
    title: 'Device Health',
    subtitle: 'CPU, RAM, temperature and storage diagnostics',
    sectionColor: '#F59E0B', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Review device and student records. Select a student to view hardware, usage, and learning activity details.',
    stats: [
      { label: 'Healthy', value: '76', color: '#16A34A' },
      { label: 'Warning', value: '18', color: '#D97706' },
      { label: 'Critical', value: '4', color: '#DC2626' },
      { label: 'Avg CPU Temp', value: '41°C', color: '#F59E0B' },
    ],
    actions: ['Health Report', 'Flag Critical', 'Export Diagnostics'],
  },

  // Section 2 ─ Examination Control
  adm_live_monitoring: {
    title: 'Live Monitoring',
    subtitle: 'Real-time examination activity across all tablets',
    sectionColor: '#DC2626', sectionLabel: 'Examination Control', sectionNumber: 2,
    description: 'Track every student\'s question progress, submission status, and device activity during live examinations.',
    stats: [
      { label: 'Exam Active', value: 'YES', color: '#DC2626' },
      { label: 'Students Active', value: '76', color: '#16A34A' },
      { label: 'Submitted', value: '14', color: '#0284C7' },
      { label: 'Not Started', value: '10', color: '#D97706' },
    ],
    actions: ['Open Live Table', 'Filter Active', 'Export Status'],
  },
  adm_time_management: {
    title: 'Time Management',
    subtitle: 'Remaining time per student and extensions',
    sectionColor: '#D97706', sectionLabel: 'Examination Control', sectionNumber: 2,
    description: 'View countdown timers for each student. Grant time extensions to individual students or groups.',
    stats: [
      { label: 'Avg Remaining', value: '38 min', color: '#D97706' },
      { label: 'Time Over', value: '7', color: '#DC2626' },
      { label: '< 10 min', value: '11', color: '#EF4444' },
      { label: 'Extensions Given', value: '2', color: '#7C3AED' },
    ],
    actions: ['Grant Extension', 'End Exam Early', 'Timer Report'],
  },
  adm_submissions: {
    title: 'Submissions',
    subtitle: 'Submitted and pending answer packets',
    sectionColor: '#16A34A', sectionLabel: 'Examination Control', sectionNumber: 2,
    description: 'Track answer submission status per student. Force submit for unresponsive devices. View pending queues.',
    stats: [
      { label: 'Submitted', value: '14', color: '#16A34A' },
      { label: 'Pending', value: '76', color: '#D97706' },
      { label: 'Failed Attempts', value: '3', color: '#DC2626' },
      { label: 'Submission Rate', value: '14%', color: '#0284C7' },
    ],
    actions: ['Force Submit', 'Submission Report', 'View Queue'],
  },
  adm_exam_incidents: {
    title: 'Exam Incidents',
    subtitle: 'Disconnections and technical issues log',
    sectionColor: '#EF4444', sectionLabel: 'Examination Control', sectionNumber: 2,
    description: 'Log of all technical incidents: network drops, app crashes, frozen devices, and unplanned disconnections.',
    stats: [
      { label: 'Total Incidents', value: '9', color: '#EF4444' },
      { label: 'Disconnections', value: '6', color: '#DC2626' },
      { label: 'App Crashes', value: '2', color: '#7C3AED' },
      { label: 'Resolved', value: '7', color: '#16A34A' },
    ],
    actions: ['Incident Report', 'Notify Students', 'Export Log'],
  },

  // Section 3 ─ Student Activity & Intelligence
  adm_app_usage: {
    title: 'App Usage',
    subtitle: 'Application usage analytics per student',
    sectionColor: '#7C3AED', sectionLabel: 'Student Activity & Intelligence', sectionNumber: 3,
    description: 'Foreground application session durations per student, top used apps, and policy violation detection.',
    stats: [
      { label: 'Monitored Apps', value: '8', color: '#7C3AED' },
      { label: 'Policy Violations', value: '3', color: '#DC2626' },
      { label: 'Avg Active Time', value: '2h 14m', color: '#16A34A' },
      { label: 'Exam App Usage', value: '94%', color: '#0284C7' },
    ],
    actions: ['App Report', 'Block App', 'Export Data'],
  },
  adm_browser_activity: {
    title: 'Browser Activity',
    subtitle: 'Managed browser domain activity logs',
    sectionColor: '#0EA5E9', sectionLabel: 'Student Activity & Intelligence', sectionNumber: 3,
    description: 'Whitelist and blacklist-based browser domain access logs. Flagged unauthorized domain access attempts.',
    stats: [
      { label: 'Allowed Domains', value: '12', color: '#16A34A' },
      { label: 'Blocked Attempts', value: '23', color: '#DC2626' },
      { label: 'Flagged Students', value: '5', color: '#D97706' },
      { label: 'Total Requests', value: '1,204', color: '#0EA5E9' },
    ],
    actions: ['Add Whitelist', 'View Blocked', 'Export Report'],
  },
  adm_tab_activity: {
    title: 'Tab Activity',
    subtitle: 'Browser tab and switching event log',
    sectionColor: '#6366F1', sectionLabel: 'Student Activity & Intelligence', sectionNumber: 3,
    description: 'Tracks browser tab switch frequency per student. High tab-switching may indicate off-task behavior.',
    stats: [
      { label: 'Avg Switches', value: '4.2', color: '#6366F1' },
      { label: 'High Activity (>10)', value: '8', color: '#DC2626' },
      { label: 'Single Tab', value: '62', color: '#16A34A' },
      { label: 'Flagged', value: '8', color: '#D97706' },
    ],
    actions: ['Tab Report', 'Alert Students', 'Export Log'],
  },

  // Section 4 ─ Security & Remote Management
  adm_remote_lock: {
    title: 'Remote Lock',
    subtitle: 'Lock lost or compromised tablets remotely',
    sectionColor: '#B91C1C', sectionLabel: 'Security & Remote Management', sectionNumber: 4,
    description: 'Instantly lock any device over-the-air. Locked devices display a custom lockscreen message.',
    stats: [
      { label: 'Locked Devices', value: '1', color: '#B91C1C' },
      { label: 'Unlocked', value: '99', color: '#16A34A' },
      { label: 'Lock Requests', value: '1', color: '#D97706' },
      { label: 'Last Lock', value: '2h ago', color: '#64748B' },
    ],
    actions: ['Lock Device', 'Unlock Device', 'Bulk Lock', 'View Locked'],
  },
  adm_app_deployment: {
    title: 'App Deployment',
    subtitle: 'Push approved applications to device fleet',
    sectionColor: '#059669', sectionLabel: 'Security & Remote Management', sectionNumber: 4,
    description: 'Remotely install, update, or remove applications from managed tablets. Supports silent push.',
    stats: [
      { label: 'Deployed Apps', value: '5', color: '#059669' },
      { label: 'Pending Push', value: '0', color: '#D97706' },
      { label: 'Failed Installs', value: '1', color: '#DC2626' },
      { label: 'Last Deployment', value: '3d ago', color: '#64748B' },
    ],
    actions: ['Push App', 'Remove App', 'Deployment Report'],
  },
  adm_os_updates: {
    title: 'OS Updates',
    subtitle: 'Device operating system update management',
    sectionColor: '#2563EB', sectionLabel: 'Security & Remote Management', sectionNumber: 4,
    description: 'Schedule and push OS security patches and firmware updates to the tablet fleet silently.',
    stats: [
      { label: 'Up-to-date', value: '91', color: '#16A34A' },
      { label: 'Updates Pending', value: '9', color: '#D97706' },
      { label: 'OS Version', value: 'Android 14', color: '#2563EB' },
      { label: 'Last Patch', value: '7d ago', color: '#64748B' },
    ],
    actions: ['Push Update', 'Schedule Update', 'Update Report'],
  },
  adm_audit_logs: {
    title: 'Audit Logs',
    subtitle: 'Complete administrative action history',
    sectionColor: '#475569', sectionLabel: 'Security & Remote Management', sectionNumber: 4,
    description: 'Signed, immutable log of every admin action: device locks, app pushes, exam starts, quarantine events.',
    stats: [
      { label: 'Log Entries', value: '1,042', color: '#475569' },
      { label: 'Today', value: '34', color: '#0284C7' },
      { label: 'High Severity', value: '5', color: '#DC2626' },
      { label: 'Last Entry', value: '4m ago', color: '#16A34A' },
    ],
    actions: ['Search Logs', 'Export CSV', 'Download PDF'],
  },

  // Section 5 ─ Reports & System Intelligence
  adm_overall_reports: {
    title: 'Overall Reports',
    subtitle: 'Institution-wide analytics and summaries',
    sectionColor: '#065F46', sectionLabel: 'Reports & System Intelligence', sectionNumber: 5,
    description: 'Comprehensive institution-wide reports covering exam performance, attendance, device health, and security.',
    stats: [
      { label: 'Reports Generated', value: '7', color: '#065F46' },
      { label: 'Last Generated', value: 'Today', color: '#16A34A' },
      { label: 'Students Covered', value: '100', color: '#0284C7' },
      { label: 'Export Formats', value: 'CSV / PDF', color: '#64748B' },
    ],
    actions: ['Generate Report', 'Download PDF', 'Download CSV'],
  },
  adm_student_reports: {
    title: 'Student Reports',
    subtitle: 'Individual student academic and device history',
    sectionColor: '#0284C7', sectionLabel: 'Reports & System Intelligence', sectionNumber: 5,
    description: 'Per-student report cards covering exam scores, question analysis, device behavior, and attendance.',
    stats: [
      { label: 'Students', value: '100', color: '#0284C7' },
      { label: 'Reports Ready', value: '100', color: '#16A34A' },
      { label: 'Avg Score', value: '70.4%', color: '#D97706' },
      { label: 'At Risk', value: '12', color: '#DC2626' },
    ],
    actions: ['Search Student', 'Generate All', 'Bulk Export'],
  },
  adm_maintenance: {
    title: 'Maintenance',
    subtitle: 'Repair and service records for the fleet',
    sectionColor: '#92400E', sectionLabel: 'Reports & System Intelligence', sectionNumber: 5,
    description: 'Log of device repairs, service tickets, replacement parts, and maintenance schedules.',
    stats: [
      { label: 'Open Tickets', value: '4', color: '#DC2626' },
      { label: 'Resolved', value: '23', color: '#16A34A' },
      { label: 'In Repair', value: '2', color: '#D97706' },
      { label: 'Avg Resolution', value: '2.4 days', color: '#64748B' },
    ],
    actions: ['New Ticket', 'View Open', 'Service Report'],
  },
  adm_notifications: {
    title: 'Notifications',
    subtitle: 'System alerts and announcements',
    sectionColor: '#D97706', sectionLabel: 'Reports & System Intelligence', sectionNumber: 5,
    description: 'Send broadcast announcements to all students or specific devices. View notification delivery status.',
    stats: [
      { label: 'Sent Today', value: '3', color: '#D97706' },
      { label: 'Unread Alerts', value: '7', color: '#DC2626' },
      { label: 'Delivery Rate', value: '98%', color: '#16A34A' },
      { label: 'Scheduled', value: '1', color: '#6366F1' },
    ],
    actions: ['Send Broadcast', 'Schedule Alert', 'Notification Log'],
  },
  adm_configuration: {
    title: 'Configuration',
    subtitle: 'System policies and global settings',
    sectionColor: '#475569', sectionLabel: 'Reports & System Intelligence', sectionNumber: 5,
    description: 'Configure telemetry sync interval, battery alert thresholds, kiosk mode policies, and MDM rules.',
    stats: [
      { label: 'Sync Interval', value: '15s', color: '#475569' },
      { label: 'Battery Threshold', value: '20%', color: '#DC2626' },
      { label: 'Kiosk Mode', value: 'ON', color: '#16A34A' },
      { label: 'Last Config Change', value: '2d ago', color: '#64748B' },
    ],
    actions: ['Edit Policies', 'Save Config', 'Reset Defaults'],
  },
};

interface AdminModuleViewProps {
  moduleId: ERPModuleId;
  onBack: () => void;
  sidebarWidth: number;
}

export default function AdminModuleView({ moduleId, onBack, sidebarWidth }: AdminModuleViewProps) {
  const meta = MODULE_META[moduleId];

  // Find section info and icon
  const section = ADMIN_NAV_SECTIONS.find((s) => s.items.some((i) => i.id === moduleId));
  const navItem = section?.items.find((i) => i.id === moduleId);
  const Icon = navItem?.icon;
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<'All' | 'I PU' | 'II PU'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<StudentTabletRecord | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<ActiveExamId>('ipu-neet');
  const pageSize = 10;
  const isAllDevicesModule = moduleId === 'adm_all_devices';
  const isDeviceSummaryModule = isAllDevicesModule || moduleId === 'adm_device_health';
  const isExamModule = section?.sectionId === 'exam_control';
  const selectedExam = ACTIVE_EXAMS.find((exam) => exam.id === selectedExamId) ?? ACTIVE_EXAMS[0];
  const columns = isDeviceSummaryModule
    ? DEVICE_SUMMARY_COLUMNS
    : moduleId === 'adm_serial_specs'
      ? SERIAL_SPEC_COLUMNS
      : section
        ? STUDENT_TABLE_COLUMNS[section.sectionId] ?? DEFAULT_STUDENT_TABLE_COLUMNS
        : DEFAULT_STUDENT_TABLE_COLUMNS;
  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return LIVE_100_STUDENT_TABLETS.filter((record) => {
      const searchableValues = isAllDevicesModule
        ? [record.studentName, record.assignedTabletId]
        : [record.studentName, record.rollNumber, record.assignedTabletId, record.section];
      const matchesSearch = searchableValues.some((value) => value.toLowerCase().includes(query));
      const matchesClass = isExamModule || classFilter === 'All' || record.class.startsWith(classFilter);
      const matchesExam = !isExamModule || record.class.startsWith(selectedExam.classPrefix);
      return matchesSearch && matchesClass && matchesExam;
    });
  }, [searchTerm, classFilter, isAllDevicesModule, isExamModule, selectedExam]);
  const selectedStudentCount = LIVE_100_STUDENT_TABLETS.filter((record) => {
    const matchesClass = isExamModule || classFilter === 'All' || record.class.startsWith(classFilter);
    const matchesExam = !isExamModule || record.class.startsWith(selectedExam.classPrefix);
    return matchesClass && matchesExam;
  }).length;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleRecord = filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleRecord = Math.min(currentPage * pageSize, filteredRecords.length);

  if (!meta) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-stone-200">
        <h3 className="font-black text-lg text-stone-700">Module: {moduleId}</h3>
        <button onClick={onBack} className="px-5 py-2 bg-[#A60000] text-white rounded-full text-xs font-bold">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div
        className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5"
        style={{ background: `linear-gradient(135deg, ${meta.sectionColor}12 0%, ${meta.sectionColor}06 100%)`, border: `1px solid ${meta.sectionColor}30` }}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-white transition shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                style={{ backgroundColor: meta.sectionColor }}
              >
                {meta.sectionNumber}. {meta.sectionLabel}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">{meta.title}</h1>
            <p className="text-xs md:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">{meta.subtitle}</p>
          </div>
        </div>

        {Icon && (
          <div
            className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${meta.sectionColor}18`, border: `1.5px solid ${meta.sectionColor}40` }}
          >
            <Icon size={36} />
          </div>
        )}
      </div>

      {/* ── Description ── */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
        <p className="text-sm text-stone-700 leading-relaxed font-medium">{meta.description}</p>
      </div>

      {isExamModule && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-stone-900">Select an ongoing examination</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">The student list below updates to the selected exam.</p>
            </div>
          </div>
          <label className="flex flex-col gap-1.5 w-full sm:w-72">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Active examination / PU cohort</span>
            <select
              value={selectedExamId}
              onChange={(event) => {
                const exam = ACTIVE_EXAMS.find((option) => option.id === event.target.value);
                if (exam) {
                  setSelectedExamId(exam.id);
                  setCurrentPage(1);
                }
              }}
              aria-label="Select ongoing examination"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-bold text-stone-800 outline-none focus:border-red-400"
            >
              {ACTIVE_EXAMS.map((exam) => (
                <option key={exam.id} value={exam.id}>{exam.label}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {meta.stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm text-center"
          >
            <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">{stat.label}</span>
            <span className="block text-2xl font-black" style={{ color: stat.color }}>{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Action Buttons ── */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-wrap gap-3">
        {meta.actions.map((action, i) => (
          <button
            key={i}
            className="px-4 py-2 rounded-xl text-xs font-black transition border hover:shadow-md"
            style={
              i === 0
                ? { backgroundColor: meta.sectionColor, color: '#fff', borderColor: meta.sectionColor }
                : { backgroundColor: `${meta.sectionColor}12`, color: meta.sectionColor, borderColor: `${meta.sectionColor}40` }
            }
          >
            {action}
          </button>
        ))}
      </div>

      {/* ── Student Data Table ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
              <span className="font-black text-sm text-stone-900 uppercase tracking-wide">
                {meta.title} — {isExamModule ? `${selectedExam.label} Records` : 'Student Records'}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                {isExamModule
                  ? `${selectedStudentCount} sample students in ${selectedExam.label}`
                  : `Sample records for ${classFilter === 'All' ? 'all PU years' : classFilter} (${selectedStudentCount} students)`}
              </p>
          </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isExamModule && (
                <select
                  value={classFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    setClassFilter(value === 'I PU' || value === 'II PU' ? value : 'All');
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by PU year"
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 outline-none focus:border-stone-400"
                >
                  <option value="All">All PU Years</option>
                  <option value="I PU">I PU</option>
                  <option value="II PU">II PU</option>
                </select>
              )}
              <label className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={isAllDevicesModule ? 'Search name or Tablet ID...' : 'Search student name, roll number, or tablet...'}
                  aria-label={isAllDevicesModule ? 'Search by student name or tablet ID' : 'Search students by name, roll number, tablet ID, or section'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs outline-none focus:border-stone-400"
                />
              </label>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {columns.map((column) => (
                  <th key={column.label} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-stone-500 whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {visibleRecords.map((record) => (
                <tr key={record.id} className="hover:bg-stone-50/80 transition-colors">
                  {columns.map((column) => (
                    <td key={column.label} className="px-4 py-3 text-xs text-stone-700 whitespace-nowrap">
                      {column.selectable || column.action ? (
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(record)}
                          className="font-bold text-sky-700 hover:text-sky-900 hover:underline"
                        >
                          {column.value(record)}
                        </button>
                      ) : column.value(record)}
                    </td>
                  ))}
                </tr>
              ))}
              {visibleRecords.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-stone-400">
                    No student records match “{searchTerm}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-stone-500">
            Showing {firstVisibleRecord}–{lastVisibleRecord} of {filteredRecords.length} students
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50"
            >
              <ChevronLeft size={14} className="inline -mt-0.5 mr-1" />
              Previous
            </button>
            <span className="text-xs font-bold text-stone-500">Page {currentPage} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50"
            >
              Next
              <ChevronRight size={14} className="inline -mt-0.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
      {selectedStudent && (
        <DeviceHealthDetailModal
          key={selectedStudent.id}
          device={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          sidebarWidth={sidebarWidth}
        />
      )}
    </div>
  );
}
