import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Wifi, Lock, BarChart2, Shield, Clock, FileText, Bell, Settings } from 'lucide-react';
import { ERPModuleId, ADMIN_NAV_SECTIONS } from '../components/erpNavConfig';

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
    description: 'View and manage all 100 registered student tablets. Filter by status, class, section, or device health.',
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
    description: 'Per-device hardware telemetry including CPU usage, RAM pressure, thermal status, and storage health.',
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
}

export default function AdminModuleView({ moduleId, onBack }: AdminModuleViewProps) {
  const meta = MODULE_META[moduleId];

  // Find section info and icon
  const section = ADMIN_NAV_SECTIONS.find((s) => s.items.some((i) => i.id === moduleId));
  const navItem = section?.items.find((i) => i.id === moduleId);
  const Icon = navItem?.icon;

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

      {/* ── Placeholder Data Table ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <span className="font-black text-sm text-stone-900 uppercase tracking-wide">{meta.title} — Live Data</span>
          <span className="text-xs text-stone-400 font-medium animate-pulse">● Live</span>
        </div>
        <div className="p-5 text-center text-stone-400 text-xs py-12 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${meta.sectionColor}12` }}>
            {Icon && <Icon size={28} />}
          </div>
          <p className="font-bold text-stone-500 max-w-sm">
            Live telemetry for <span style={{ color: meta.sectionColor }}>{meta.title}</span> will appear here when backend is connected. Currently showing 100 simulated records.
          </p>
        </div>
      </div>
    </div>
  );
}
