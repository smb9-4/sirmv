import React from 'react';
import {
  IconVNavDashboard,
  IconVNavStudents,
  IconVNavClasses,
  IconVNavBatches,
  IconVNavTests,
  IconVNavQuestions,
  IconVNavReports,
  IconVNavLeaderboard,
  IconVNavAnnouncements,
  IconVNavNotes,
  IconVNavMaterials,
  IconVNavTimetable,
  IconVNavCalendar,
  IconVNavAttendance,
  IconVNavComplaints,
  IconVNavSettings,
  // Admin section icons
  IconAdmAllDevices,
  IconAdmBatteryHealth,
  IconAdmStudentMapping,
  IconAdmDeviceInventory,
  IconAdmSerialSpecs,
  IconAdmConnectivity,
  IconAdmDeviceHealth,
  IconAdmLiveMonitoring,
  IconAdmTimeManagement,
  IconAdmSubmissions,
  IconAdmExamIncidents,
  IconAdmAppUsage,
  IconAdmBrowserActivity,
  IconAdmTabActivity,
  IconAdmRemoteLock,
  IconAdmAppDeployment,
  IconAdmOSUpdates,
  IconAdmAuditLogs,
  IconAdmOverallReports,
  IconAdmStudentReports,
  IconAdmMaintenance,
  IconAdmNotifications,
  IconAdmConfiguration,
} from './VerticalNavIcons';

export type ERPModuleId =
  | 'dashboard'
  | 'announcements'
  | 'students'
  | 'classes'
  | 'batches'
  | 'tests'
  | 'questions'
  | 'reports'
  | 'leaderboard'
  | 'notes'
  | 'materials'
  | 'timetable'
  | 'attendance'
  | 'complaints'
  | 'settings'
  | 'staffs'
  | 'board_marks'
  | 'timetable_generator'
  | 'exam_management'
  | 'live_class'
  | 'sms'
  | 'noticeboard'
  | 'counsellings'
  | 'college_calendar'
  | 'student_discipline'
  | 'reported_issues'
  | 'hostel'
  | 'gate_pass'
  // ── Admin / Tab Management Module IDs ──────────────────────────
  // Section 1: Device Administration
  | 'adm_all_devices'
  | 'adm_battery_health'
  | 'adm_student_mapping'
  | 'adm_device_inventory'
  | 'adm_serial_specs'
  | 'adm_connectivity'
  | 'adm_device_health'
  // Section 2: Examination Control
  | 'adm_live_monitoring'
  | 'adm_time_management'
  | 'adm_submissions'
  | 'adm_exam_incidents'
  // Section 3: Student Activity & Intelligence
  | 'adm_app_usage'
  | 'adm_browser_activity'
  | 'adm_tab_activity'
  // Section 4: Security & Remote Management
  | 'adm_remote_lock'
  | 'adm_app_deployment'
  | 'adm_os_updates'
  | 'adm_audit_logs'
  // Section 5: Reports & System Intelligence
  | 'adm_overall_reports'
  | 'adm_student_reports'
  | 'adm_maintenance'
  | 'adm_notifications'
  | 'adm_configuration';

export type UserRoleType = 'admin' | 'student' | 'super_admin' | 'principal' | 'teacher';

export interface NavItemConfig {
  id: ERPModuleId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorAccent?: string;
  badge?: string;
}

export interface AdminNavSection {
  sectionId: string;
  sectionLabel: string;
  sectionNumber: number;
  sectionColor: string;        // accent color for section header
  sectionIcon: React.ComponentType<{ size?: number; className?: string }>;
  items: NavItemConfig[];
}

// ── 5-SECTION ADMIN / TAB MANAGEMENT GROUPED SIDEBAR ────────────────────────
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    sectionId: 'device_admin',
    sectionLabel: 'Device Administration',
    sectionNumber: 1,
    sectionColor: '#0284C7',
    sectionIcon: IconAdmAllDevices,
    items: [
      { id: 'adm_all_devices',      label: 'All Devices',       icon: IconAdmAllDevices,      colorAccent: '#0284C7' },
      { id: 'adm_battery_health',   label: 'Battery Health',    icon: IconAdmBatteryHealth,   colorAccent: '#16A34A' },
      { id: 'adm_student_mapping',  label: 'Student Mapping',   icon: IconAdmStudentMapping,  colorAccent: '#7C3AED' },
      { id: 'adm_device_inventory', label: 'Device Inventory',  icon: IconAdmDeviceInventory, colorAccent: '#EA580C' },
      { id: 'adm_serial_specs',     label: 'Serial & Specs',    icon: IconAdmSerialSpecs,     colorAccent: '#64748B' },
      { id: 'adm_connectivity',     label: 'Connectivity',      icon: IconAdmConnectivity,    colorAccent: '#06B6D4' },
      { id: 'adm_device_health',    label: 'Device Health',     icon: IconAdmDeviceHealth,    colorAccent: '#F59E0B' },
    ],
  },
  {
    sectionId: 'exam_control',
    sectionLabel: 'Examination Control',
    sectionNumber: 2,
    sectionColor: '#DC2626',
    sectionIcon: IconAdmLiveMonitoring,
    items: [
      { id: 'adm_live_monitoring',  label: 'Live Monitoring',   icon: IconAdmLiveMonitoring,  colorAccent: '#DC2626', badge: 'LIVE' },
      { id: 'adm_time_management',  label: 'Time Management',   icon: IconAdmTimeManagement,  colorAccent: '#D97706' },
      { id: 'adm_submissions',      label: 'Submissions',       icon: IconAdmSubmissions,     colorAccent: '#16A34A' },
      { id: 'adm_exam_incidents',   label: 'Exam Incidents',    icon: IconAdmExamIncidents,   colorAccent: '#EF4444' },
    ],
  },
  {
    sectionId: 'student_activity',
    sectionLabel: 'Student Activity',
    sectionNumber: 3,
    sectionColor: '#7C3AED',
    sectionIcon: IconAdmAppUsage,
    items: [
      { id: 'adm_app_usage',        label: 'App Usage',         icon: IconAdmAppUsage,        colorAccent: '#7C3AED' },
      { id: 'adm_browser_activity', label: 'Browser Activity',  icon: IconAdmBrowserActivity, colorAccent: '#0EA5E9' },
      { id: 'adm_tab_activity',     label: 'Tab Activity',      icon: IconAdmTabActivity,     colorAccent: '#6366F1' },
    ],
  },
  {
    sectionId: 'security_remote',
    sectionLabel: 'Security & Remote',
    sectionNumber: 4,
    sectionColor: '#B91C1C',
    sectionIcon: IconAdmRemoteLock,
    items: [
      { id: 'adm_remote_lock',      label: 'Remote Lock',       icon: IconAdmRemoteLock,      colorAccent: '#B91C1C' },
      { id: 'adm_app_deployment',   label: 'App Deployment',    icon: IconAdmAppDeployment,   colorAccent: '#059669' },
      { id: 'adm_os_updates',       label: 'OS Updates',        icon: IconAdmOSUpdates,       colorAccent: '#2563EB' },
      { id: 'adm_audit_logs',       label: 'Audit Logs',        icon: IconAdmAuditLogs,       colorAccent: '#64748B' },
    ],
  },
  {
    sectionId: 'reports_intelligence',
    sectionLabel: 'Reports & Intelligence',
    sectionNumber: 5,
    sectionColor: '#065F46',
    sectionIcon: IconAdmOverallReports,
    items: [
      { id: 'adm_overall_reports',  label: 'Overall Reports',   icon: IconAdmOverallReports,  colorAccent: '#065F46' },
      { id: 'adm_student_reports',  label: 'Student Reports',   icon: IconAdmStudentReports,  colorAccent: '#0284C7' },
      { id: 'adm_maintenance',      label: 'Maintenance',       icon: IconAdmMaintenance,     colorAccent: '#92400E' },
      { id: 'adm_notifications',    label: 'Notifications',     icon: IconAdmNotifications,   colorAccent: '#D97706' },
      { id: 'adm_configuration',    label: 'Configuration',     icon: IconAdmConfiguration,   colorAccent: '#475569' },
    ],
  },
];

// Flat list of all admin items (derived from sections above)
export const ADMIN_NAV_ITEMS: NavItemConfig[] = ADMIN_NAV_SECTIONS.flatMap((s) => s.items);

// Full 15-module roster for Super Admin & Principal (non-admin roles)
export const ALL_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard',      label: 'Dashboard',   icon: IconVNavDashboard,    colorAccent: '#34D399' },
  { id: 'students',       label: 'Students',    icon: IconVNavStudents,     colorAccent: '#EA580C', badge: '100' },
  { id: 'classes',        label: 'Classes',     icon: IconVNavClasses,      colorAccent: '#FB7185' },
  { id: 'batches',        label: 'Batches',     icon: IconVNavBatches,      colorAccent: '#F97316' },
  { id: 'tests',          label: 'Tests',       icon: IconVNavTests,        colorAccent: '#38BDF8', badge: 'Live' },
  { id: 'questions',      label: 'Questions',   icon: IconVNavQuestions,    colorAccent: '#FBBF24' },
  { id: 'reports',        label: 'Reports',     icon: IconVNavReports,      colorAccent: '#EF4444' },
  { id: 'leaderboard',    label: 'Leaderboard', icon: IconVNavLeaderboard,  colorAccent: '#F59E0B' },
  { id: 'announcements',  label: 'Notices',     icon: IconVNavAnnouncements,colorAccent: '#EF4444', badge: '3' },
  { id: 'notes',          label: 'Notes',       icon: IconVNavNotes,        colorAccent: '#10B981' },
  { id: 'materials',      label: 'Materials',   icon: IconVNavMaterials,    colorAccent: '#3B82F6' },
  { id: 'timetable',      label: 'Timetable',   icon: IconVNavTimetable,    colorAccent: '#EF4444' },
  { id: 'college_calendar',label:'Calendar',    icon: IconVNavCalendar,     colorAccent: '#DC2626' },
  { id: 'attendance',     label: 'Attendance',  icon: IconVNavAttendance,   colorAccent: '#10B981' },
  { id: 'complaints',     label: 'Complaints',  icon: IconVNavComplaints,   colorAccent: '#F59E0B' },
  { id: 'settings',       label: 'Settings',    icon: IconVNavSettings,     colorAccent: '#64748B' },
];

// Student-only modules
export const STUDENT_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard',      label: 'Dashboard',   icon: IconVNavDashboard,    colorAccent: '#34D399' },
  { id: 'announcements',  label: 'Notices',     icon: IconVNavAnnouncements,colorAccent: '#EF4444', badge: '3' },
  { id: 'tests',          label: 'Exams',       icon: IconVNavTests,        colorAccent: '#38BDF8', badge: 'Live' },
  { id: 'materials',      label: 'Materials',   icon: IconVNavMaterials,    colorAccent: '#3B82F6' },
  { id: 'reports',        label: 'Results',     icon: IconVNavReports,      colorAccent: '#EF4444' },
  { id: 'timetable',      label: 'Timetable',   icon: IconVNavTimetable,    colorAccent: '#EF4444' },
  { id: 'college_calendar',label:'Calendar',    icon: IconVNavCalendar,     colorAccent: '#DC2626' },
  { id: 'attendance',     label: 'Attendance',  icon: IconVNavAttendance,   colorAccent: '#10B981' },
  { id: 'complaints',     label: 'Complaints',  icon: IconVNavComplaints,   colorAccent: '#F59E0B' },
];

export const VERTICAL_NAV_ITEMS = ALL_NAV_ITEMS;
export const SIDEBAR_MENU_ITEMS = VERTICAL_NAV_ITEMS;
