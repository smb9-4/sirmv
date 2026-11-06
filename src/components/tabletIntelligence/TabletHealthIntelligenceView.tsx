import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Tablet,
  Battery,
  Cpu,
  Wifi,
  HardDrive,
  Thermometer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';

interface TabletHealthIntelligenceViewProps {
  records: StudentTabletRecord[];
  onSelectDevice: (device: StudentTabletRecord) => void;
}

export default function TabletHealthIntelligenceView({
  records,
  onSelectDevice,
}: TabletHealthIntelligenceViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Warning' | 'Critical' | 'Offline'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Classification for visual warnings (Requirement #6):
  // Green: Healthy
  // Yellow: Warning
  // Orange: Critical
  // Red: Offline or serious fault
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch =
        r.assignedTabletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.usn.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const isOffline = r.deviceStatus === 'Offline';
      const isCritical = r.batteryPercentage <= 20 || r.deviceTemperature > 42 || r.deviceStatus === 'Error';
      const isWarning = (r.batteryPercentage <= 40 || r.deviceTemperature > 38 || r.batteryHealth < 85) && !isCritical && !isOffline;
      const isHealthy = !isOffline && !isCritical && !isWarning;

      if (statusFilter === 'Healthy') return isHealthy;
      if (statusFilter === 'Warning') return isWarning;
      if (statusFilter === 'Critical') return isCritical;
      if (statusFilter === 'Offline') return isOffline;

      return true;
    });
  }, [records, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider">
              FLEET TELEMETRY & HARDWARE
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • 100 Tablets Monitored Live
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Tablet Health Intelligence & Hardware Telemetry
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Real-time battery level, thermal monitoring, CPU/RAM utilization, Wi-Fi RSSI signals, and proactive maintenance logs. Click any tablet to inspect its historical discharge curves and logs.
          </p>
        </div>

        {/* Filter & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Tablet ID, Student..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#650000] transition"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Visual Warning Status Filter Chips (Requirement #6) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            statusFilter === 'All' ? 'bg-[#650000] text-white shadow-xs' : 'bg-stone-100 text-stone-600'
          }`}
        >
          All ({records.length})
        </button>

        <button
          onClick={() => setStatusFilter('Healthy')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            statusFilter === 'Healthy'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Green: Healthy</span>
        </button>

        <button
          onClick={() => setStatusFilter('Warning')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            statusFilter === 'Warning'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          <span>Yellow: Warning</span>
        </button>

        <button
          onClick={() => setStatusFilter('Critical')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            statusFilter === 'Critical'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-orange-50 text-orange-900 border border-orange-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
          <span>Orange: Critical Battery / High Temp</span>
        </button>

        <button
          onClick={() => setStatusFilter('Offline')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            statusFilter === 'Offline'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          <span>Red: Offline / Serious Fault</span>
        </button>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRecords.map(r => {
            const isOffline = r.deviceStatus === 'Offline';
            const isCritical = r.batteryPercentage <= 20 || r.deviceTemperature > 42 || r.deviceStatus === 'Error';
            const isWarning = (r.batteryPercentage <= 40 || r.deviceTemperature > 38 || r.batteryHealth < 85) && !isCritical && !isOffline;

            let cardBorder = 'border-emerald-200 bg-white hover:border-emerald-400';
            let statusPill = 'bg-emerald-100 text-emerald-800';
            let statusLabel = 'Healthy';

            if (isOffline) {
              cardBorder = 'border-red-300 bg-red-50/40 hover:border-red-400';
              statusPill = 'bg-red-100 text-red-800';
              statusLabel = 'Offline';
            } else if (isCritical) {
              cardBorder = 'border-orange-300 bg-orange-50/40 hover:border-orange-400';
              statusPill = 'bg-orange-100 text-orange-900 font-black';
              statusLabel = 'Critical';
            } else if (isWarning) {
              cardBorder = 'border-amber-300 bg-amber-50/40 hover:border-amber-400';
              statusPill = 'bg-amber-100 text-amber-800 font-bold';
              statusLabel = 'Warning';
            }

            return (
              <motion.div
                key={r.id}
                whileHover={{ y: -3, scale: 1.02 }}
                onClick={() => onSelectDevice(r)}
                className={`p-5 rounded-3xl border ${cardBorder} shadow-xs cursor-pointer transition apple-button flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                      {r.assignedTabletId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusPill}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <strong className="text-sm font-black text-stone-900 block truncate">
                    {r.studentName}
                  </strong>
                  <span className="text-xs text-stone-400 block font-medium">USN: {r.usn}</span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Battery:</span>
                    <strong className={r.batteryPercentage <= 20 ? 'text-red-600 font-black' : 'text-stone-900'}>
                      {r.batteryPercentage}% (Health: {r.batteryHealth}%)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Temperature:</span>
                    <strong className={r.deviceTemperature > 40 ? 'text-red-600' : 'text-stone-800'}>
                      {r.deviceTemperature}°C
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">CPU / RAM:</span>
                    <span className="font-bold text-stone-800">{r.cpuUsage}% / {r.ramUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Wi-Fi Signal:</span>
                    <span className="font-mono text-stone-700">{r.networkStrengthDbm} dBm</span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-[#650000] flex items-center justify-between pt-1">
                  <span>Open Device Diagnostics</span>
                  <ArrowRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto bg-white rounded-3xl border border-stone-200 shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-3 px-4">Tablet ID</th>
                <th className="py-3 px-4">Assigned Student</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Battery Health</th>
                <th className="py-3 px-4">CPU Usage</th>
                <th className="py-3 px-4">RAM Usage</th>
                <th className="py-3 px-4">Device Temp</th>
                <th className="py-3 px-4">Wi-Fi Signal</th>
                <th className="py-3 px-4">Status Warning</th>
                <th className="py-3 px-4">Last Online</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.map(r => (
                <tr
                  key={r.id}
                  onClick={() => onSelectDevice(r)}
                  className="hover:bg-amber-50/50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">{r.assignedTabletId}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">{r.studentName} (USN: {r.usn})</td>
                  <td className="py-3 px-4 font-black">{r.batteryPercentage}%</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{r.batteryHealth}%</td>
                  <td className="py-3 px-4 text-stone-700">{r.cpuUsage}%</td>
                  <td className="py-3 px-4 text-stone-700">{r.ramUsage}%</td>
                  <td className="py-3 px-4 font-bold">{r.deviceTemperature}°C</td>
                  <td className="py-3 px-4 font-mono">{r.networkStrengthDbm} dBm</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100">
                      {r.deviceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">{r.lastOnlineTimestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

