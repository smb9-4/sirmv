import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  X,
  Maximize2,
  Minimize2,
  Tablet,
  Battery,
  Cpu,
  Wifi,
  HardDrive,
  Thermometer,
  RotateCcw,
  ShieldCheck,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  Clock,
  Activity,
  BarChart3,
  PlayCircle,
} from 'lucide-react';
import {
  getTabletMacAddress,
  getTabletSerialNumber,
  type StudentTabletRecord,
} from '../../tabletIntelligenceData';

interface DeviceHealthDetailModalProps {
  device: StudentTabletRecord | null;
  onClose: () => void;
  sidebarWidth?: number;
}

export default function DeviceHealthDetailModal({
  device,
  onClose,
  sidebarWidth = 86,
}: DeviceHealthDetailModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'health' | 'logs' | 'maintenance' | 'usage'>('health');

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, onClose]);

  if (!device || typeof document === 'undefined') return null;

  const batteryColor =
    device.batteryPercentage <= 20
      ? 'text-red-600 bg-red-50 border-red-200'
      : device.batteryPercentage <= 40
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  const statusBadge =
    device.deviceStatus === 'Active'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : device.deviceStatus === 'Critical Battery' || device.deviceStatus === 'Error'
      ? 'bg-red-100 text-red-800 border-red-300'
      : device.deviceStatus === 'Offline'
      ? 'bg-stone-200 text-stone-700 border-stone-300'
      : 'bg-amber-100 text-amber-800 border-amber-300';
  const studentNumber = Number.parseInt(device.usn, 10) || 0;
  const weeklyUsage = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => ({
    day,
    minutes: 75 + ((studentNumber * (index + 3) * 7) % 220),
  }));
  const dailyUsageMinutes = weeklyUsage[6].minutes;
  const weeklyUsageMinutes = weeklyUsage.reduce((total, day) => total + day.minutes, 0);
  const watchedContent = [
    'Cell Division: Meiosis Explained',
    'Laws of Motion: Solved Examples',
    'Organic Chemistry: Functional Groups',
  ].map((title, index) => ({
    title,
    duration: 8 + ((studentNumber * (index + 2)) % 14),
    watchedAt: ['Today, 4:15 PM', 'Yesterday, 6:20 PM', 'This week, 7:05 PM'][index],
  }));
  const watchTimeMinutes = watchedContent.reduce((total, item) => total + item.duration, 0);
  const formatMinutes = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  return createPortal(
    <div
      style={{
        left: 0,
        paddingLeft:
          typeof window !== 'undefined' && window.innerWidth >= 768 && !isFullScreen
            ? sidebarWidth + 24
            : undefined,
      }}
      className={`fixed top-0 bottom-0 right-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
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
            : 'w-full max-w-4xl max-h-[90vh] rounded-3xl'
        }`}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <Tablet size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-stone-900 tracking-tight font-mono">
                  {device.assignedTabletId}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusBadge}`}>
                  {device.deviceStatus}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Assigned to <strong className="text-stone-800">{device.studentName}</strong> (USN: {device.usn})
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Roll No: {device.rollNumber} • {device.class} • Section {device.section}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Serial: {getTabletSerialNumber(device)} • {device.osVersion} • Uptime: {device.uptimeHours} hrs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

        {/* Tab Strip */}
        <div className="px-4 md:px-6 py-3 bg-stone-50 border-b border-stone-200 flex flex-col gap-2 text-xs shrink-0 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid w-full grid-cols-2 gap-2 xl:flex xl:w-auto">
            {[
              { id: 'health', label: 'Hardware Telemetry & Battery Health', icon: Activity },
              { id: 'logs', label: 'Crash Logs & System Events', icon: Clock },
              { id: 'maintenance', label: 'Maintenance & Remote MDM', icon: Wrench },
              { id: 'usage', label: 'Usage & Watch History', icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full min-h-10 px-2.5 py-2 rounded-xl font-bold flex items-center justify-start gap-1.5 text-left transition-all xl:w-auto xl:px-3.5 xl:justify-center ${
                    isActive
                      ? 'bg-[#650000] text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="self-end text-[10px] font-mono text-stone-500 xl:self-auto xl:text-[11px]">
            MAC: {getTabletMacAddress(device)}
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Battery Level & Health
                  </span>
                  <div className="text-2xl font-black text-stone-900 mt-1 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-base border font-black ${batteryColor}`}>
                      {device.batteryPercentage}%
                    </span>
                    <span className="text-xs text-stone-500 font-bold">
                      Health: {device.batteryHealth}%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Estimated run: 3h 40m</span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    CPU & Thermal Status
                  </span>
                  <div className="text-2xl font-black text-stone-900 mt-1">
                    {device.cpuUsage}%{' '}
                    <span className="text-xs text-stone-500 font-normal">({device.deviceTemperature}°C)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Thermal nominal</span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    RAM Usage
                  </span>
                  <div className="text-2xl font-black text-stone-900 mt-1">
                    {device.ramUsage}%
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">3.8 GB / 6.0 GB In Use</span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Wi-Fi Signal Strength
                  </span>
                  <div className="text-2xl font-black text-stone-900 mt-1 font-mono">
                    {device.networkStrengthDbm} dBm
                  </div>
                  <span className="text-[11px] font-bold text-stone-600">{device.wifiSsid}</span>
                </div>
              </div>

              {/* Historical Battery Discharge Trend Simulation */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-wider text-stone-800">
                    Continuous 4-Hour Battery Discharge & Temperature Trend
                  </span>
                  <span className="text-xs text-stone-400 font-bold">Logged via MDM Service</span>
                </div>

                {/* Simulated SVG Graph */}
                <div className="h-32 w-full bg-white rounded-xl border border-stone-200 p-3 flex flex-col justify-between">
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>100% (07:00 AM)</span>
                    <span>75% (08:30 AM)</span>
                    <span>50% (10:00 AM)</span>
                    <span>Current: {device.batteryPercentage}%</span>
                  </div>

                  <div className="relative h-16 w-full flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 60">
                      <polyline
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        points={`0,10 80,18 160,26 240,35 320,${60 - device.batteryPercentage * 0.5} 400,${60 - device.batteryPercentage * 0.5}`}
                      />
                      <polyline
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        points={`0,50 80,48 160,42 240,40 320,${55 - device.deviceTemperature * 0.8} 400,${55 - device.deviceTemperature * 0.8}`}
                      />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-emerald-600 inline-block rounded" /> Battery Discharge Curve
                    </span>
                    <span className="text-red-600 flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-red-500 inline-block rounded border border-red-300" /> Temperature (°C)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-black text-xs uppercase tracking-wider text-stone-900">
                  Crash Logs & Hardware Telemetry Audit Stream
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Internal system kernel and application crash logs received from {device.assignedTabletId}
                </p>
              </div>

              <div className="bg-stone-900 text-stone-200 rounded-2xl p-4 font-mono text-xs space-y-2 overflow-x-auto">
                <div className="text-emerald-400">
                  [10:25:12.441] INFO - Heartbeat synced. RSSI: {device.networkStrengthDbm} dBm, Battery: {device.batteryPercentage}%, Temp: {device.deviceTemperature}C
                </div>
                <div className="text-stone-300">
                  [10:18:04.102] DEBUG - Kiosk watchdog verified process &quot;com.sirmv.exam.browser&quot; running with UID 10142
                </div>
                <div className="text-stone-300">
                  [09:45:00.890] INFO - Question packet batch #3 (Q21-Q30) encrypted and acknowledged by API endpoint
                </div>
                {device.batteryPercentage < 25 && (
                  <div className="text-amber-400">
                    [10:02:18.112] WARN - Hardware power manager notified kernel of low battery state (&lt; 25%)
                  </div>
                )}
                {device.securityIncident && (
                  <div className="text-red-400 font-bold">
                    [09:55:12.780] ALERT - Security event logged: {device.securityIncident.type} ({device.securityIncident.description})
                  </div>
                )}
                <div className="text-stone-400">
                  [09:00:00.000] INFO - Examination Mode Kiosk locked. Keyguard disabled. Navigation bar suppressed.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-black text-xs uppercase tracking-wider text-stone-900">
                  Maintenance Recommendations & MDM Hardware Actions
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Proactive maintenance suggestions generated by central fleet intelligence
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-xs space-y-1">
                    <strong className="font-black text-stone-900 block">Battery Cycle Calibration</strong>
                    <p className="text-stone-500">
                      Battery health is currently at {device.batteryHealth}%. Recommended to complete full charge-discharge cycle before next examination cohort.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench size={16} />
                  </div>
                  <div className="text-xs space-y-1">
                    <strong className="font-black text-stone-900 block">Storage Cache Sanitation</strong>
                    <p className="text-stone-500">
                      Device has 42 GB available. Purging cached examination PDF slides can reclaim 3.2 GB storage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-stone-700">Remote MDM Commands:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Diagnostics report generated for ${device.assignedTabletId}.`)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Export Log Bundle
                  </button>
                  <button
                    onClick={() => alert(`Remote cache purged on ${device.assignedTabletId}.`)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Clear Cache
                  </button>
                  <button
                    onClick={() => alert(`Reboot command sent to ${device.assignedTabletId}.`)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition"
                  >
                    Force Reboot
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-800">
                Illustrative usage and learning-video history for this sample student.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Daily device usage', value: formatMinutes(dailyUsageMinutes), icon: Activity },
                  { label: 'Weekly device usage', value: formatMinutes(weeklyUsageMinutes), icon: BarChart3 },
                  { label: 'Learning video watchtime', value: formatMinutes(watchTimeMinutes), icon: PlayCircle },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-2xl border border-stone-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-stone-500">
                        <Icon size={15} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{metric.label}</span>
                      </div>
                      <p className="mt-2 text-2xl font-black text-stone-900">{metric.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">Daily usage this week</h4>
                  <div className="mt-4 h-36 flex items-end justify-between gap-2">
                    {weeklyUsage.map((day) => (
                      <div key={day.day} className="h-full flex-1 flex flex-col items-center justify-end gap-2">
                        <span className="text-[9px] text-stone-500">{formatMinutes(day.minutes)}</span>
                        <div
                          className="w-full max-w-8 rounded-t-lg bg-sky-500"
                          style={{ height: `${Math.max(14, (day.minutes / Math.max(...weeklyUsage.map((item) => item.minutes))) * 100)}%` }}
                        />
                        <span className="text-[10px] font-bold text-stone-500">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-stone-200 bg-white p-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">Learning videos watched</h4>
                  <div className="mt-3 space-y-3">
                    {watchedContent.map((item) => (
                      <div key={item.title} className="flex items-start gap-3 rounded-xl bg-stone-50 p-3">
                        <div className="mt-0.5 rounded-lg bg-sky-100 p-2 text-sky-700">
                          <PlayCircle size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-800">{item.title}</p>
                          <p className="mt-1 text-[10px] text-stone-500">Sir MV Learning Library • {item.watchedAt}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-stone-500">{item.duration} min</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-stone-200 bg-white p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">Recent app and domain activity</h4>
                <p className="mt-2 text-xs text-stone-600">{device.activeApp}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {device.browserDomainUsage.map((domain) => (
                    <span key={domain} className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-medium text-stone-600">
                      {domain}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500 font-medium">
            Device registered in Sir MV MDM Cluster #01
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full font-bold text-xs text-white bg-stone-900 hover:bg-black transition apple-button shadow-sm"
          >
            Close Device Report
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

