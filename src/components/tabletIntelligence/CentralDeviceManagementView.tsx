import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Tablet,
  Lock,
  Unlock,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Shield,
  Layers,
  Wrench,
  Search,
  Check,
  Clock,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';

interface CentralDeviceManagementViewProps {
  records: StudentTabletRecord[];
  onSelectDevice: (device: StudentTabletRecord) => void;
}

export default function CentralDeviceManagementView({
  records,
  onSelectDevice,
}: CentralDeviceManagementViewProps) {
  const [announcementText, setAnnouncementText] = useState('');
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<'All Tablets' | 'Critical Battery Only' | 'Lab A Only'>('All Tablets');
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', action: 'Kiosk Policy Enforced', target: '100 Tablets (Cluster A)', user: 'Admin (Prof. Suresh)', time: '08:58 AM' },
    { id: 'log-2', action: 'App Update Pushed: Exam Browser v3.2', target: 'All Tablets', user: 'System MDM', time: '08:30 AM' },
    { id: 'log-3', action: 'Remote Battery Health Calibration', target: 'TAB-002, TAB-045', user: 'Admin (Priya Nayak)', time: '08:15 AM' },
  ]);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setIsSendingAnnouncement(true);
    setTimeout(() => {
      setIsSendingAnnouncement(false);
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          action: `Broadcast Announcement: "${announcementText.slice(0, 35)}..."`,
          target: selectedTarget,
          user: 'Admin (Executive Command)',
          time: 'Just now',
        },
        ...prev,
      ]);
      setAnnouncementText('');
      alert(`Announcement broadcasted to ${selectedTarget}!`);
    }, 600);
  };

  const handleRemoteCommand = (cmd: string) => {
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: cmd,
        target: '100 Tablets (Cluster A)',
        user: 'Admin (Executive Command)',
        time: 'Just now',
      },
      ...prev,
    ]);
    alert(`${cmd} command acknowledged by MDM fleet cluster.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider">
              CENTRAL MDM INFRASTRUCTURE
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Fleet Control for 3,000 Supported Hardware Tablets
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Central Device Management & MDM Console
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Execute remote configuration locks, broadcast live invigilation announcements, push signed APK packages, and revoke access with full administrative cryptographic audit logging.
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center min-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            MDM Server Connection
          </span>
          <strong className="text-xl font-black text-emerald-700 block mt-1">
            ● Cluster Active
          </strong>
          <span className="text-[11px] text-stone-500">Latency: 12ms • WPA3 Certs OK</span>
        </div>
      </div>

      {/* MDM Administrative Controls Grid (Requirement #12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleRemoteCommand('Lock Lost Devices & Kiosk Barrier')}
          className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs cursor-pointer hover:border-[#650000] transition apple-button space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black">
            <Lock size={20} />
          </div>
          <strong className="text-sm font-black text-stone-900 block">Lock Lost Device</strong>
          <p className="text-xs text-stone-500">
            Remotely locks down stolen or missing tablet hardware with pin-code reset screen.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleRemoteCommand('Push APK Update: Sir MV Exam Browser v3.3')}
          className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs cursor-pointer hover:border-[#650000] transition apple-button space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <DownloadCloud size={20} />
          </div>
          <strong className="text-sm font-black text-stone-900 block">Push App Updates</strong>
          <p className="text-xs text-stone-500">
            Silently pushes signed examination APK packages in background without user intervention.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleRemoteCommand('Re-enforce Examination Kiosk Mode')}
          className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs cursor-pointer hover:border-[#650000] transition apple-button space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
            <Shield size={20} />
          </div>
          <strong className="text-sm font-black text-stone-900 block">Configure Exam Mode</strong>
          <p className="text-xs text-stone-500">
            Suppresses home bar, notification shade, power menu, and disables USB hardware debugging.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleRemoteCommand('Fleet Remote Diagnostics Ping')}
          className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs cursor-pointer hover:border-[#650000] transition apple-button space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <Wrench size={20} />
          </div>
          <strong className="text-sm font-black text-stone-900 block">Remote Troubleshooting</strong>
          <p className="text-xs text-stone-500">
            Triggers memory cache clearance, packet latency tests, and thermal sensor calibration.
          </p>
        </motion.div>
      </div>

      {/* Broadcast Announcement to Student Tablets */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Send size={16} className="text-[#650000]" /> Broadcast Proctor Announcement to Tablets
            </h3>
            <p className="text-xs text-stone-500">
              Sends an official popup banner over all active student examination screens
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Instant WebSocket Push
          </span>
        </div>

        <form onSubmit={handleSendAnnouncement} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g., Attention Students: 15 minutes remaining for KCET Mathematics section..."
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#650000] transition"
            />

            <select
              value={selectedTarget}
              onChange={e => setSelectedTarget(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 bg-stone-50 focus:outline-none"
            >
              <option value="All Tablets">Target: All 100 Tablets</option>
              <option value="Critical Battery Only">Target: Critical Battery Devices</option>
              <option value="Lab A Only">Target: Lab A Cohort</option>
            </select>

            <button
              type="submit"
              disabled={isSendingAnnouncement || !announcementText.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#650000] hover:bg-[#800000] text-white font-bold text-xs disabled:opacity-50 transition shadow-sm"
            >
              {isSendingAnnouncement ? 'Broadcasting...' : 'Broadcast Announcement'}
            </button>
          </div>
        </form>
      </div>

      {/* MDM Cryptographic Audit Log */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
          <Clock size={16} className="text-[#650000]" /> Administrative MDM Audit Logs
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Administrative Action</th>
                <th className="py-3 px-4">Target Fleet</th>
                <th className="py-3 px-4">Authorized Admin</th>
                <th className="py-3 px-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50 transition font-medium">
                  <td className="py-3 px-4 font-mono text-stone-500">{log.time}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-stone-700">{log.target}</td>
                  <td className="py-3 px-4 text-[#650000] font-bold">{log.user}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 size={13} /> Cryptographically Signed
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

