import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Wifi, Lock, BarChart2, Shield, Clock, FileText, Bell, Settings, Search, ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Send, X } from 'lucide-react';
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

const NOTIFICATION_TARGETS = [
  { id: 'all', label: 'Send all' },
  { id: 'i-pu', label: 'Send to I PU' },
  { id: 'ii-pu', label: 'Send to II PU' },
  { id: 'neet', label: 'Only NEET' },
  { id: 'jee', label: 'Only JEE' },
] as const;

type BulkNotificationTarget = typeof NOTIFICATION_TARGETS[number]['id'];

function getNotificationRecipients(records: StudentTabletRecord[], target: BulkNotificationTarget) {
  if (target === 'all') return records;
  const classPrefix = target === 'i-pu' || target === 'neet'
    ? ACTIVE_EXAMS[0].classPrefix
    : ACTIVE_EXAMS[1].classPrefix;
  return records.filter((record) => record.class.startsWith(classPrefix));
}

const INITIAL_STOCK_TABLETS = [
  { id: 'TAB-101', model: 'Android tablet' },
  { id: 'TAB-102', model: 'Android tablet' },
  { id: 'TAB-103', model: 'Android tablet' },
  { id: 'TAB-104', model: 'Android tablet' },
  { id: 'TAB-105', model: 'Android tablet' },
];

type AdminRecordFilter = 'active' | 'low-battery' | 'critical' | 'blocked' | 'locked' | 'open' | 'pending' | 'weak-network' | null;

const ACTION_FILTERS: Record<string, Exclude<AdminRecordFilter, null>> = {
  'Filter Active': 'active',
  'Alert Low Battery': 'low-battery',
  'Flag Critical': 'critical',
  'View Blocked': 'blocked',
  'View Locked': 'locked',
  'View Open': 'open',
  'View Queue': 'pending',
  'Network Map': 'weak-network',
};

interface StudentTableColumn {
  label: string;
  value: (record: StudentTabletRecord) => string;
  selectable?: boolean;
  action?: boolean;
  photo?: boolean;
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

const STUDENT_PHOTO_COLUMN: StudentTableColumn = {
  label: 'Photo',
  value: () => '',
  photo: true,
};

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
  adm_device_inventory: {
    title: 'Device Inventory',
    subtitle: 'Serial numbers, procurement and asset records',
    sectionColor: '#EA580C', sectionLabel: 'Device Administration', sectionNumber: 1,
    description: 'Complete asset register with procurement date, warranty status, model, and department assignment.',
    stats: [
      { label: 'Total Assets', value: '105', color: '#EA580C' },
      { label: 'Under Warranty', value: '92', color: '#16A34A' },
      { label: 'Expired Warranty', value: '13', color: '#DC2626' },
      { label: 'In Service', value: '100', color: '#0284C7' },
      { label: 'In Stock', value: '5', color: '#059669' },
    ],
    actions: ['Add Device', 'Export Register', 'Assign Tablet'],
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
  adm_block_access: {
    title: 'Block Access',
    subtitle: 'Restrict an app or tablet access for a selected student',
    sectionColor: '#B91C1C', sectionLabel: 'Security & Remote Management', sectionNumber: 4,
    description: 'Select a student to block their current app or tablet access. Add a reason before submitting the demo action.',
    stats: [
      { label: 'Total Students', value: '100', color: '#7C3AED' },
      { label: 'Blocked Students', value: '0', color: '#B91C1C' },
      { label: 'App Blocks', value: '0', color: '#D97706' },
      { label: 'Access Blocks', value: '0', color: '#DC2626' },
    ],
    actions: ['Open Student List', 'Filter Active', 'View Blocked', 'Export List'],
  },
  adm_send_notification: {
    title: 'Send Notification',
    subtitle: 'Send a message to an individual student tablet',
    sectionColor: '#D97706', sectionLabel: 'Student Activity', sectionNumber: 3,
    description: 'Select a student to compose and send a message to their tablet. Messages are recorded locally in this demo.',
    stats: [
      { label: 'Total Students', value: '100', color: '#7C3AED' },
      { label: 'Messages Sent', value: '0', color: '#D97706' },
      { label: 'Students Notified', value: '0', color: '#0284C7' },
      { label: 'Delivery', value: 'Demo only', color: '#64748B' },
    ],
    actions: ['Open Student List', 'Search Student', 'Export List'],
  },

  // Section 4 ─ Security & Remote Management
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
    sectionColor: '#0284C7', sectionLabel: 'Student Activity & Intelligence', sectionNumber: 3,
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

interface TabletAssignment {
  studentName: string;
  rollNumber: string;
  puYear: 'I PU' | 'II PU';
  section: 'A' | 'B';
  deviceId: string;
  assignedAt: string;
}

type BlockActionType = 'Block App' | 'Block Access';

interface StudentBlockRecord {
  appReason?: string;
  accessReason?: string;
}

export default function AdminModuleView({ moduleId, onBack, sidebarWidth }: AdminModuleViewProps) {
  const meta = MODULE_META[moduleId];

  // Find section info and icon
  const section = ADMIN_NAV_SECTIONS.find((s) => s.items.some((i) => i.id === moduleId));
  const navItem = section?.items.find((i) => i.id === moduleId);
  const Icon = navItem?.icon;
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<'All' | 'I PU' | 'II PU'>('All');
  const [recordFilter, setRecordFilter] = useState<AdminRecordFilter>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<StudentTabletRecord[]>(LIVE_100_STUDENT_TABLETS);
  const [selectedStudent, setSelectedStudent] = useState<StudentTabletRecord | null>(null);
  const [selectedActionStudent, setSelectedActionStudent] = useState<StudentTabletRecord | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<ActiveExamId>('ipu-neet');
  const [deviceView, setDeviceView] = useState<'grid' | 'table'>('table');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [studentActionNotice, setStudentActionNotice] = useState<string | null>(null);
  const [studentActionError, setStudentActionError] = useState<string | null>(null);
  const [blockedStudents, setBlockedStudents] = useState<Record<string, StudentBlockRecord>>({});
  const [blockActionType, setBlockActionType] = useState<BlockActionType>('Block App');
  const [blockReason, setBlockReason] = useState('');
  const [sentNotifications, setSentNotifications] = useState<Record<string, string>>({});
  const [sentNotificationCount, setSentNotificationCount] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [bulkSendTarget, setBulkSendTarget] = useState<BulkNotificationTarget | null>(null);
  const [isBulkSendMenuOpen, setIsBulkSendMenuOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [availableTablets, setAvailableTablets] = useState(INITIAL_STOCK_TABLETS);
  const [tabletAssignments, setTabletAssignments] = useState<TabletAssignment[]>([]);
  const [assignmentForm, setAssignmentForm] = useState({
    studentName: '',
    rollNumber: '',
    puYear: 'I PU' as 'I PU' | 'II PU',
    section: 'A' as 'A' | 'B',
    deviceId: INITIAL_STOCK_TABLETS[0].id,
  });
  const [assignmentNotice, setAssignmentNotice] = useState<string | null>(null);
  const isAllDevicesModule = moduleId === 'adm_all_devices';
  const isDeviceSummaryModule = isAllDevicesModule || moduleId === 'adm_device_health';
  const isDeviceInventoryModule = moduleId === 'adm_device_inventory';
  const isBlockAccessModule = moduleId === 'adm_block_access';
  const isSendNotificationModule = moduleId === 'adm_send_notification';
  const isStudentActionModule = isBlockAccessModule || isSendNotificationModule;
  const pageSize = isStudentActionModule ? Math.max(1, records.length) : 10;
  const isExamModule = section?.sectionId === 'exam_control';
  const selectedExam = ACTIVE_EXAMS.find((exam) => exam.id === selectedExamId) ?? ACTIVE_EXAMS[0];
  const studentColumns: StudentTableColumn[] = isAllDevicesModule
    ? DEVICE_SUMMARY_COLUMNS
    : isDeviceSummaryModule
      ? DEVICE_SUMMARY_COLUMNS
      : isBlockAccessModule
        ? [
            { label: 'Student', value: (record: StudentTabletRecord) => record.studentName, selectable: true },
            { label: 'Roll Number', value: (record: StudentTabletRecord) => record.rollNumber },
            { label: 'Tablet ID', value: (record: StudentTabletRecord) => record.assignedTabletId },
            { label: 'Section', value: (record: StudentTabletRecord) => record.section },
            { label: 'Year', value: (record: StudentTabletRecord) => record.class.startsWith('I PU') ? 'I PU' : 'II PU' },
            { label: 'Active App', value: (record: StudentTabletRecord) => record.activeApp },
            {
              label: 'Access Status',
              value: (record: StudentTabletRecord) => blockedStudents[record.id]?.accessReason
                ? 'Access blocked'
                : blockedStudents[record.id]?.appReason
                  ? 'App blocked'
                  : 'Allowed',
            },
            {
              label: 'Reason',
              value: (record: StudentTabletRecord) => {
                const block = blockedStudents[record.id];
                if (!block) return '—';
                return [
                  block.appReason ? `App: ${block.appReason}` : '',
                  block.accessReason ? `Access: ${block.accessReason}` : '',
                ].filter(Boolean).join(' · ');
              },
            },
          ]
        : isSendNotificationModule
          ? [
              { label: 'Student', value: (record: StudentTabletRecord) => record.studentName, selectable: true },
              { label: 'Roll Number', value: (record: StudentTabletRecord) => record.rollNumber },
              { label: 'Tablet ID', value: (record: StudentTabletRecord) => record.assignedTabletId },
              { label: 'Section', value: (record: StudentTabletRecord) => record.section },
              { label: 'Year', value: (record: StudentTabletRecord) => record.class.startsWith('I PU') ? 'I PU' : 'II PU' },
              { label: 'Active App', value: (record: StudentTabletRecord) => record.activeApp },
              { label: 'Device Status', value: (record: StudentTabletRecord) => record.deviceStatus },
              {
                label: 'Last Message',
                value: (record: StudentTabletRecord) => {
                  const message = sentNotifications[record.id];
                  return message ? (message.length > 48 ? `${message.slice(0, 45)}...` : message) : '—';
                },
              },
            ]
      : moduleId === 'adm_serial_specs'
        ? SERIAL_SPEC_COLUMNS
        : section
          ? STUDENT_TABLE_COLUMNS[section.sectionId] ?? DEFAULT_STUDENT_TABLE_COLUMNS
          : DEFAULT_STUDENT_TABLE_COLUMNS;
  const columns = [STUDENT_PHOTO_COLUMN, ...studentColumns];
  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      const searchableValues = isAllDevicesModule
        ? [record.studentName, record.assignedTabletId]
        : [record.studentName, record.rollNumber, record.assignedTabletId, record.section];
      const matchesSearch = searchableValues.some((value) => value.toLowerCase().includes(query));
      const matchesClass = isExamModule || classFilter === 'All' || record.class.startsWith(classFilter);
      const matchesExam = !isExamModule || record.class.startsWith(selectedExam.classPrefix);
      const matchesRecordFilter = (() => {
        switch (recordFilter) {
          case 'active':
            return record.deviceStatus === 'Active';
          case 'low-battery':
            return record.batteryPercentage < 20;
          case 'critical':
            return record.deviceStatus === 'Critical Battery'
              || record.deviceStatus === 'Error'
              || record.batteryPercentage < 20
              || record.securityIncident?.severity === 'Critical';
          case 'blocked':
            return isBlockAccessModule
              ? blockedStudents[record.id] !== undefined
              : record.deviceStatus === 'Offline'
                || record.networkStatus === 'Disconnected'
                || record.securityIncident !== undefined;
          case 'locked':
            return record.screenStatus === 'Locked by MDM';
          case 'open':
            return record.deviceStatus !== 'Active'
              || (record.securityIncident !== undefined && record.securityIncident.status !== 'Resolved');
          case 'pending':
            return record.submissionStatus !== 'Submitted';
          case 'weak-network':
            return record.networkStatus === 'Weak'
              || record.networkStatus === 'Fair'
              || record.networkStatus === 'Disconnected';
          default:
            return true;
        }
      })();
      return matchesSearch && matchesClass && matchesExam && matchesRecordFilter;
    });
  }, [records, searchTerm, classFilter, recordFilter, isAllDevicesModule, isExamModule, isBlockAccessModule, blockedStudents, selectedExam]);
  const selectedStudentCount = records.filter((record) => {
    const matchesClass = isExamModule || classFilter === 'All' || record.class.startsWith(classFilter);
    const matchesExam = !isExamModule || record.class.startsWith(selectedExam.classPrefix);
    return matchesClass && matchesExam;
  }).length;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleRecord = filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleRecord = Math.min(currentPage * pageSize, filteredRecords.length);
  const displayedStats = isDeviceInventoryModule
    ? meta.stats.map((stat) => {
        if (stat.label === 'In Stock') return { ...stat, value: String(availableTablets.length) };
        if (stat.label === 'In Service') return { ...stat, value: String(100 + tabletAssignments.length) };
        return stat;
      })
    : isBlockAccessModule
      ? meta.stats.map((stat) => {
          if (stat.label === 'Blocked Students') return { ...stat, value: String(Object.values(blockedStudents).filter((entry) => entry.appReason || entry.accessReason).length) };
          if (stat.label === 'App Blocks') return { ...stat, value: String(Object.values(blockedStudents).filter((entry) => entry.appReason).length) };
          if (stat.label === 'Access Blocks') return { ...stat, value: String(Object.values(blockedStudents).filter((entry) => entry.accessReason).length) };
          return stat;
        })
      : isSendNotificationModule
        ? meta.stats.map((stat) => {
            if (stat.label === 'Messages Sent') return { ...stat, value: String(sentNotificationCount) };
            if (stat.label === 'Students Notified') return { ...stat, value: String(Object.keys(sentNotifications).length) };
            return stat;
          })
        : meta.stats;
  const bulkSendRecipients = bulkSendTarget ? getNotificationRecipients(records, bulkSendTarget) : [];
  const bulkSendTargetLabel = bulkSendTarget
    ? NOTIFICATION_TARGETS.find((target) => target.id === bulkSendTarget)?.label
    : undefined;

  useEffect(() => {
    if (!assignmentNotice) return;
    const timeoutId = window.setTimeout(() => setAssignmentNotice(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [assignmentNotice]);

  useEffect(() => {
    if (!actionNotice) return;
    const timeoutId = window.setTimeout(() => setActionNotice(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [actionNotice]);

  useEffect(() => {
    if (!studentActionNotice) return;
    const timeoutId = window.setTimeout(() => setStudentActionNotice(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [studentActionNotice]);

  useEffect(() => {
    setSearchTerm('');
    setClassFilter('All');
    setRecordFilter(null);
    setCurrentPage(1);
    setRecords(LIVE_100_STUDENT_TABLETS);
    setSelectedStudent(null);
    setSelectedActionStudent(null);
    setBlockReason('');
    setNotificationMessage('');
    setBulkSendTarget(null);
    setIsBulkSendMenuOpen(false);
    setStudentActionError(null);
    setLastRefreshedAt(null);
    setActionNotice(null);
    setStudentActionNotice(null);
  }, [moduleId]);

  const exportCurrentRecords = (action: string) => {
    const exportColumns = studentColumns.filter((column) => !column.photo && !column.action);
    const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvRows = [
      exportColumns.map((column) => escapeCsvValue(column.label)).join(','),
      ...filteredRecords.map((record) =>
        exportColumns.map((column) => escapeCsvValue(column.value(record))).join(','),
      ),
    ];
    const blob = new Blob([`\uFEFF${csvRows.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const actionName = action.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    link.href = url;
    link.download = `${moduleId}-${actionName}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setActionNotice(`${action}: exported ${filteredRecords.length} student records.`);
  };

  const handleAllDevicesAction = (action: string) => {
    if (!isAllDevicesModule) return;

    switch (action) {
      case 'View Grid':
        setDeviceView('grid');
        break;
      case 'View Table':
        setDeviceView('table');
        break;
      case 'Export CSV':
        exportCurrentRecords(action);
        break;
      case 'Refresh Status':
        setSearchTerm('');
        setClassFilter('All');
        setRecordFilter(null);
        setCurrentPage(1);
        setLastRefreshedAt(new Date().toLocaleTimeString());
        setActionNotice('Device status list refreshed.');
        break;
    }
  };

  const handleAssignTablet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const studentName = assignmentForm.studentName.trim();
    const rollNumber = assignmentForm.rollNumber.trim();
    const device = availableTablets.find((tablet) => tablet.id === assignmentForm.deviceId);
    if (!studentName || !rollNumber || !device) return;

    const remainingTablets = availableTablets.filter((tablet) => tablet.id !== device.id);
    setTabletAssignments((previous) => [
      {
        studentName,
        rollNumber,
        puYear: assignmentForm.puYear,
        section: assignmentForm.section,
        deviceId: device.id,
        assignedAt: new Date().toLocaleString(),
      },
      ...previous,
    ]);
    setAvailableTablets(remainingTablets);
    setAssignmentForm((previous) => ({
      ...previous,
      studentName: '',
      rollNumber: '',
      deviceId: remainingTablets[0]?.id ?? '',
    }));
    setAssignmentNotice(studentName);
  };

  const openStudentAction = (record: StudentTabletRecord) => {
    setSelectedActionStudent(record);
    setBulkSendTarget(null);
    setIsBulkSendMenuOpen(false);
    setBlockActionType('Block App');
    setBlockReason('');
    setNotificationMessage('');
    setStudentActionError(null);
  };

  const openBulkSend = (target: BulkNotificationTarget) => {
    setSelectedActionStudent(null);
    setBulkSendTarget(target);
    setNotificationMessage('');
    setStudentActionError(null);
    setIsBulkSendMenuOpen(false);
  };

  const handleStudentActionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSendNotificationModule) {
      const message = notificationMessage.trim();
      if (!message) {
        setStudentActionError('Enter a message before sending the notification.');
        return;
      }

      if (bulkSendTarget) {
        const recipients = getNotificationRecipients(records, bulkSendTarget);
        if (recipients.length === 0) {
          setStudentActionError('There are no students in this recipient group.');
          return;
        }
        setSentNotifications((previous) => {
          const next = { ...previous };
          recipients.forEach((record) => {
            next[record.id] = message;
          });
          return next;
        });
        setSentNotificationCount((count) => count + recipients.length);
        const targetLabel = NOTIFICATION_TARGETS.find((target) => target.id === bulkSendTarget)?.label ?? 'selected students';
        setStudentActionError(null);
        setStudentActionNotice(`Message sent to ${recipients.length} students (${targetLabel})`);
        setBulkSendTarget(null);
        setNotificationMessage('');
        return;
      }
    }

    if (!selectedActionStudent) {
      setStudentActionError('Select a student before submitting.');
      return;
    }

    if (isBlockAccessModule) {
      const reason = blockReason.trim();
      if (!reason) {
        setStudentActionError('Enter a reason before submitting the block request.');
        return;
      }
      setBlockedStudents((previous) => ({
        ...previous,
        [selectedActionStudent.id]: {
          ...previous[selectedActionStudent.id],
          ...(blockActionType === 'Block App' ? { appReason: reason } : { accessReason: reason }),
        },
      }));
      setStudentActionError(null);
      setStudentActionNotice(`Student '${selectedActionStudent.studentName}' is blocked`);
      setSelectedActionStudent(null);
      setBlockReason('');
      return;
    }

    if (isSendNotificationModule) {
      const message = notificationMessage.trim();
      setSentNotifications((previous) => ({
        ...previous,
        [selectedActionStudent.id]: message,
      }));
      setSentNotificationCount((count) => count + 1);
      setStudentActionError(null);
      setStudentActionNotice(`Message sent to Student '${selectedActionStudent.studentName}'`);
      setSelectedActionStudent(null);
      setNotificationMessage('');
    }
  };

  const handleModuleAction = (action: string) => {
    handleAllDevicesAction(action);
    if (isAllDevicesModule && ['View Grid', 'View Table', 'Export CSV', 'Refresh Status'].includes(action)) return;

    if (isDeviceInventoryModule && action === 'Assign Tablet') {
      document.getElementById('assign-tablet')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActionNotice('Assign a student to one of the in-stock tablets below.');
      return;
    }

    if (action === 'Add Device') {
      const existingIds = [
        ...availableTablets.map((tablet) => tablet.id),
        ...tabletAssignments.map((assignment) => assignment.deviceId),
      ];
      const nextId = Math.max(
        100,
        ...existingIds.map((id) => Number.parseInt(id.replace(/\D/g, ''), 10) || 0),
      ) + 1;
      const deviceId = `TAB-${nextId}`;
      setAvailableTablets((previous) => [...previous, { id: deviceId, model: 'Android tablet' }]);
      setAssignmentForm((previous) => ({ ...previous, deviceId: previous.deviceId || deviceId }));
      setActionNotice(`${deviceId} added to in-stock inventory.`);
      document.getElementById('assign-tablet')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (action === 'Open Live Table' || action === 'View Queue' || action === 'Open Student List') {
      if (action === 'View Queue') setRecordFilter('pending');
      if (action === 'Open Student List') {
        setSearchTerm('');
        setClassFilter('All');
        setRecordFilter(null);
      }
      if (action !== 'Open Live Table') setCurrentPage(1);
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActionNotice(action === 'View Queue'
        ? 'Showing students with pending submissions.'
        : action === 'Open Student List'
          ? 'Showing the complete student list.'
          : 'Live student table opened.');
      return;
    }

    const actionFilter = ACTION_FILTERS[action];
    if (actionFilter) {
      setRecordFilter(actionFilter);
      setCurrentPage(1);
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActionNotice(`Showing ${action.replace(/^(Filter|Alert|Flag|View)\s+/i, '').toLowerCase()} records.`);
      return;
    }

    if (action.startsWith('Search ')) {
      searchInputRef.current?.focus();
      setActionNotice(`Search is ready for ${action.replace(/^Search\s+/i, '').toLowerCase()}.`);
      return;
    }

    if (action === 'Ping All Devices' || action === 'Refresh Status') {
      setLastRefreshedAt(new Date().toLocaleTimeString());
      setActionNotice(`${action}: checked ${records.length} sample devices. This demo does not contact live tablets.`);
      return;
    }

    if (action === 'Reset Defaults') {
      setRecords(LIVE_100_STUDENT_TABLETS);
      setSearchTerm('');
      setClassFilter('All');
      setRecordFilter(null);
      setCurrentPage(1);
      setActionNotice('Demo records and filters were reset to their defaults.');
      return;
    }

    if (action.includes('Download PDF')) {
      window.print();
      setActionNotice('Print dialog opened. Choose “Save as PDF” to create a PDF.');
      return;
    }

    if (/Export|Report|Download|Generate/.test(action)) {
      exportCurrentRecords(action);
      return;
    }

    if (action === 'Force Submit') {
      const targetIds = new Set(filteredRecords.map((record) => record.id));
      const pendingCount = filteredRecords.filter((record) => record.submissionStatus !== 'Submitted').length;
      setRecords((previous) => previous.map((record) =>
        targetIds.has(record.id) ? { ...record, submissionStatus: 'Submitted' } : record,
      ));
      setActionNotice(`Demo action: submitted ${pendingCount} pending answer packets locally. No live tablets were contacted.`);
      return;
    }

    if (action === 'Grant Extension') {
      const targetRecords = filteredRecords.filter((record) => record.submissionStatus !== 'Submitted');
      const targetIds = new Set(targetRecords.map((record) => record.id));
      setRecords((previous) => previous.map((record) => targetIds.has(record.id)
        ? {
            ...record,
            timeRemainingMinutes: typeof record.timeRemainingMinutes === 'number'
              ? record.timeRemainingMinutes + 10
              : 10,
          }
        : record,
      ));
      setActionNotice(`Demo action: added 10 minutes for ${targetIds.size} students with pending submissions.`);
      return;
    }

    if (action === 'End Exam Early') {
      const targetRecords = filteredRecords.filter((record) => record.submissionStatus !== 'Submitted');
      const targetIds = new Set(targetRecords.map((record) => record.id));
      setRecords((previous) => previous.map((record) =>
        targetIds.has(record.id) ? { ...record, timeRemainingMinutes: 'Time Over' } : record,
      ));
      setActionNotice(`Demo action: ended the exam timer for ${targetIds.size} students with pending submissions.`);
      return;
    }

    if (action === 'Lock Device' || action === 'Unlock Device' || action === 'Bulk Lock') {
      const target = action === 'Unlock Device'
        ? filteredRecords.find((record) => record.screenStatus === 'Locked by MDM') ?? filteredRecords[0]
        : filteredRecords[0];
      const targets = action === 'Bulk Lock' ? filteredRecords : target ? [target] : [];
      if (targets.length === 0) {
        setActionNotice('No student devices match the current filters.');
        return;
      }
      const targetIds = new Set(targets.map((record) => record.id));
      const screenStatus = action === 'Unlock Device' ? 'Unlocked (Kiosk Assessment)' : 'Locked by MDM';
      setRecords((previous) => previous.map((record) =>
        targetIds.has(record.id) ? { ...record, screenStatus } : record,
      ));
      const targetDescription = action === 'Bulk Lock'
        ? `${targets.length} devices`
        : targets[0].studentName;
      setActionNotice(`Demo action: ${action.toLowerCase()} applied to ${targetDescription}. No live tablets were contacted.`);
      return;
    }

    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActionNotice(`${action} was recorded in the demo. No live device or notification service is connected.`);
  };

  const isActionFilterActive = (action: string) => {
    if (isAllDevicesModule && action === 'View Grid') return deviceView === 'grid';
    if (isAllDevicesModule && action === 'View Table') return deviceView === 'table';
    return ACTION_FILTERS[action] !== undefined && recordFilter === ACTION_FILTERS[action];
  };

  if (!meta) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-stone-200">
        <h3 className="font-black text-lg text-stone-700">Module: {moduleId}</h3>
        <button onClick={onBack} className="px-5 py-2 bg-[#A60000] text-white rounded-full text-xs font-bold">Back to section</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {assignmentNotice && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          role="status"
          className="fixed right-6 top-24 z-[100] flex items-center gap-3 rounded-2xl bg-emerald-700 px-5 py-4 text-white shadow-xl"
        >
          <CheckCircle2 size={21} />
          <div>
            <p className="text-sm font-black">Student assigned</p>
            <p className="text-xs text-white/85">{assignmentNotice}</p>
          </div>
        </motion.div>
      )}
      {studentActionNotice && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          role="status"
          aria-live="polite"
          className="fixed right-6 top-24 z-[110] flex items-center gap-3 rounded-2xl bg-emerald-700 px-5 py-4 text-white shadow-xl"
        >
          <CheckCircle2 size={21} />
          <p className="text-sm font-black">{studentActionNotice}</p>
        </motion.div>
      )}
      {/* ── Header ── */}
      <div
        className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5"
        style={{ background: `linear-gradient(135deg, ${meta.sectionColor}12 0%, ${meta.sectionColor}06 100%)`, border: `1px solid ${meta.sectionColor}30` }}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            aria-label={`Back to ${section?.sectionLabel ?? 'admin section'}`}
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
      <div className={`grid grid-cols-2 gap-4 ${isDeviceInventoryModule ? 'md:grid-cols-3 xl:grid-cols-5' : 'md:grid-cols-4'}`}>
        {displayedStats.map((stat, i) => (
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
        {meta.actions.map((action, i) => {
          const isViewAction = isAllDevicesModule && (action === 'View Grid' || action === 'View Table');
          const isActiveAction = isActionFilterActive(action)
            || (!isViewAction && ACTION_FILTERS[action] === undefined && i === 0);
          return (
            <button
              key={action}
              type="button"
              onClick={() => handleModuleAction(action)}
              aria-pressed={isViewAction || ACTION_FILTERS[action] !== undefined ? isActionFilterActive(action) : undefined}
              className="px-4 py-2 rounded-xl text-xs font-black transition border hover:shadow-md"
              style={
                isActiveAction
                  ? { backgroundColor: meta.sectionColor, color: '#fff', borderColor: meta.sectionColor }
                  : { backgroundColor: `${meta.sectionColor}12`, color: meta.sectionColor, borderColor: `${meta.sectionColor}40` }
              }
            >
              {action}
            </button>
          );
        })}
        {isSendNotificationModule && (
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isBulkSendMenuOpen}
              onClick={() => setIsBulkSendMenuOpen((isOpen) => !isOpen)}
              className="px-4 py-2 rounded-xl border text-xs font-black transition hover:shadow-md"
              style={{ backgroundColor: `${meta.sectionColor}12`, color: meta.sectionColor, borderColor: `${meta.sectionColor}40` }}
            >
              Send to
            </button>
            {isBulkSendMenuOpen && (
              <div role="menu" aria-label="Choose notification recipients" className="absolute left-0 top-full z-30 mt-2 w-52 rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
                {NOTIFICATION_TARGETS.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    role="menuitem"
                    onClick={() => openBulkSend(target.id)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-stone-700 transition hover:bg-amber-50 hover:text-amber-800"
                  >
                    {target.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {lastRefreshedAt && (
          <span role="status" className="self-center text-xs text-stone-500">Refreshed at {lastRefreshedAt}</span>
        )}
        {actionNotice && (
          <p role="status" aria-live="polite" className="basis-full text-xs font-semibold text-stone-600">
            {actionNotice}
          </p>
        )}
      </div>

      {isDeviceInventoryModule && (
        <section id="assign-tablet" className="grid scroll-mt-24 grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-stone-900">Available Tablets</h2>
                <p className="mt-1 text-xs text-stone-500">Devices currently in stock and ready to assign.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {availableTablets.length} in stock
              </span>
            </div>
            {availableTablets.length > 0 ? (
              <div className="space-y-2">
                {availableTablets.map((tablet) => (
                  <div key={tablet.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-100 bg-stone-50/70 px-4 py-3">
                    <div>
                      <p className="text-xs font-black text-stone-900">{tablet.id}</p>
                      <p className="mt-0.5 text-[11px] text-stone-500">{tablet.model}</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-emerald-700">In stock</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-stone-50 p-4 text-xs text-stone-500">No tablets are currently in stock.</p>
            )}
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-black uppercase tracking-wide text-stone-900">Assign Tablet</h2>
              <p className="mt-1 text-xs text-stone-500">Assign an available device to a student.</p>
            </div>
            <form onSubmit={handleAssignTablet} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-500">Student name</span>
                <input
                  required
                  value={assignmentForm.studentName}
                  onChange={(event) => setAssignmentForm((previous) => ({ ...previous, studentName: event.target.value }))}
                  placeholder="Enter student name"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#0284C7]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-500">Roll number</span>
                <input
                  required
                  value={assignmentForm.rollNumber}
                  onChange={(event) => setAssignmentForm((previous) => ({ ...previous, rollNumber: event.target.value }))}
                  placeholder="Enter roll number"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#0284C7]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-500">PU year</span>
                <select
                  value={assignmentForm.puYear}
                  onChange={(event) => setAssignmentForm((previous) => ({
                    ...previous,
                    puYear: event.target.value === 'II PU' ? 'II PU' : 'I PU',
                  }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#0284C7]"
                >
                  <option>I PU</option>
                  <option>II PU</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-500">Section</span>
                <select
                  value={assignmentForm.section}
                  onChange={(event) => setAssignmentForm((previous) => ({
                    ...previous,
                    section: event.target.value === 'B' ? 'B' : 'A',
                  }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#0284C7]"
                >
                  <option>A</option>
                  <option>B</option>
                </select>
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-500">Device ID</span>
                <select
                  required
                  value={assignmentForm.deviceId}
                  onChange={(event) => setAssignmentForm((previous) => ({ ...previous, deviceId: event.target.value }))}
                  disabled={availableTablets.length === 0}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#0284C7] disabled:bg-stone-100"
                >
                  {availableTablets.map((tablet) => (
                    <option key={tablet.id} value={tablet.id}>{tablet.id} · {tablet.model}</option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={availableTablets.length === 0}
                className="rounded-xl bg-[#0284C7] px-4 py-2.5 text-xs font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
              >
                Assign Tablet
              </button>
            </form>
            {tabletAssignments.length > 0 && (
              <div className="mt-5 border-t border-stone-100 pt-4">
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-wide text-stone-500">Recent Assignments</h3>
                <div className="space-y-2">
                  {tabletAssignments.slice(0, 3).map((assignment) => (
                    <div key={`${assignment.deviceId}-${assignment.rollNumber}`} className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <img src="/student-profile.png" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                        <span className="truncate font-bold text-stone-800">{assignment.studentName} · {assignment.rollNumber}</span>
                      </span>
                      <span className="shrink-0 text-stone-500">{assignment.deviceId} · {assignment.puYear} {assignment.section}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {((selectedActionStudent && isStudentActionModule) || (isSendNotificationModule && bulkSendTarget !== null)) && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedActionStudent(null);
              setBulkSendTarget(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-action-title"
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/student-profile.png" alt="" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <h2 id="student-action-title" className="text-lg font-black text-stone-900">
                    {isBlockAccessModule ? 'Block Student' : 'Send Notification'}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-stone-500">
                    {bulkSendTarget
                      ? `${bulkSendTargetLabel} · ${bulkSendRecipients.length} students`
                      : `${selectedActionStudent?.studentName} · ${selectedActionStudent?.rollNumber} · ${selectedActionStudent?.assignedTabletId}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedActionStudent(null);
                  setBulkSendTarget(null);
                }}
                aria-label="Close student action"
                className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              >
                <X size={18} />
              </button>
            </div>

            {isBlockAccessModule ? (
              <form onSubmit={handleStudentActionSubmit} className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-stone-500">Choose action</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Block App', 'Block Access'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={blockActionType === type}
                        onClick={() => {
                          setBlockActionType(type);
                          setStudentActionError(null);
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-black transition ${
                          blockActionType === type
                            ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {blockActionType === 'Block App' && (
                  <div className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-600">
                    App to block: <strong className="text-stone-900">{selectedActionStudent?.activeApp}</strong>
                  </div>
                )}
                <label className="block space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wide text-stone-500">Reason</span>
                  <textarea
                    required
                    rows={4}
                    value={blockReason}
                    onChange={(event) => {
                      setBlockReason(event.target.value);
                      setStudentActionError(null);
                    }}
                    placeholder="Enter the reason for blocking..."
                    className="w-full resize-y rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#B91C1C]"
                  />
                </label>
                {studentActionError && <p role="alert" className="text-xs font-semibold text-red-700">{studentActionError}</p>}
                <p className="text-[11px] text-stone-500">Demo only: this records the block in the portal and does not contact a live tablet.</p>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B91C1C] px-4 py-3 text-sm font-black text-white transition hover:bg-red-800">
                  <Lock size={16} />
                  Submit Block Request
                </button>
              </form>
            ) : (
              <form onSubmit={handleStudentActionSubmit} className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wide text-stone-500">Message to tablet</span>
                  <textarea
                    required
                    rows={5}
                    value={notificationMessage}
                    onChange={(event) => {
                      setNotificationMessage(event.target.value);
                      setStudentActionError(null);
                    }}
                    placeholder="Write a message for this student..."
                    className="w-full resize-y rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#D97706]"
                  />
                </label>
                {studentActionError && <p role="alert" className="text-xs font-semibold text-red-700">{studentActionError}</p>}
                <p className="text-[11px] text-stone-500">
                  Demo only: the message is recorded locally and is not delivered to live tablets.
                  {bulkSendTarget === 'neet' && ' NEET targets the I PU cohort in this demo.'}
                  {bulkSendTarget === 'jee' && ' JEE targets the II PU cohort in this demo.'}
                </p>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97706] px-4 py-3 text-sm font-black text-white transition hover:bg-amber-700">
                  <Send size={16} />
                  {bulkSendTarget ? `Send to ${bulkSendRecipients.length} Students` : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* ── Student Data Table ── */}
      <div ref={tableRef} className="scroll-mt-24 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
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
                  ref={searchInputRef}
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
        {isAllDevicesModule && deviceView === 'grid' ? (
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleRecords.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => setSelectedStudent(record)}
                aria-label={`View details for ${record.studentName}`}
                className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 text-left transition hover:border-sky-300 hover:bg-sky-50/40"
              >
                <img src="/student-profile.png" alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-black text-stone-900">{record.studentName}</span>
                  <span className="mt-1 block text-[11px] text-stone-500">{record.rollNumber} · {record.assignedTabletId}</span>
                  <span className="mt-1 block text-[10px] font-bold text-stone-600">{record.deviceStatus}</span>
                </span>
              </button>
            ))}
            {visibleRecords.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-stone-400">No student records match “{searchTerm}”.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full ${isAllDevicesModule ? 'min-w-[950px]' : 'min-w-[850px]'} text-left`}>
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
                      {column.photo ? (
                        <img src="/student-profile.png" alt="" className="h-10 w-10 rounded-full border border-stone-200 object-cover" />
                      ) : column.selectable || column.action ? (
                        <button
                          type="button"
                          onClick={() => isStudentActionModule ? openStudentAction(record) : setSelectedStudent(record)}
                          aria-label={isStudentActionModule ? `Open actions for ${record.studentName}` : `View details for ${record.studentName}`}
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
        )}
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
