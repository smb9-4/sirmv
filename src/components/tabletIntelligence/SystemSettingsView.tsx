import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Wifi,
  Clock,
  Battery,
  Lock,
  Save,
  CheckCircle2,
  Server,
  RefreshCw,
} from 'lucide-react';

export default function SystemSettingsView() {
  const [syncInterval, setSyncInterval] = useState('15');
  const [criticalBatteryThreshold, setCriticalBatteryThreshold] = useState('20');
  const [kioskStrictMode, setKioskStrictMode] = useState(true);
  const [autoQuarantineRoot, setAutoQuarantineRoot] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider flex items-center gap-1.5">
              <Settings size={12} />
              SYSTEM POLICIES & CONFIGURATION
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Fleet Cluster Administration Settings
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Central MDM & Telemetry Settings
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Configure telemetry polling frequencies, battery warning thresholds, WPA3 enterprise certificates, and automatic tamper response rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-[#650000] hover:bg-[#800000] text-white font-black text-xs flex items-center gap-2 shadow-sm transition apple-button shrink-0"
        >
          <Save size={15} />
          <span>{isSaved ? 'Settings Applied ✓' : 'Save System Policies'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Telemetry Polling Policy */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Clock size={16} className="text-[#650000]" />
            <h3 className="font-black text-sm uppercase tracking-wider text-stone-900">
              Telemetry Synchronization Frequency
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Active Assessment Heartbeat Interval:
              </label>
              <select
                value={syncInterval}
                onChange={e => setSyncInterval(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none"
              >
                <option value="5">Every 5 Seconds (High Fidelity - Exam Mode)</option>
                <option value="15">Every 15 Seconds (Default Balanced - 3,000 Tablets)</option>
                <option value="30">Every 30 Seconds (Low Network Bandwidth Mode)</option>
                <option value="60">Every 60 Seconds (Standby Mode)</option>
              </select>
              <p className="text-[11px] text-stone-400 mt-1">
                Optimized for up to 3,000 simultaneous student tablet connections with delta compression.
              </p>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Critical Battery Trigger Threshold (%):
              </label>
              <input
                type="number"
                value={criticalBatteryThreshold}
                onChange={e => setCriticalBatteryThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:outline-none"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Alerts proctors when student tablet charge drops below this value.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Lockdown Policies */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Shield size={16} className="text-[#650000]" />
            <h3 className="font-black text-sm uppercase tracking-wider text-stone-900">
              Kiosk Security & Hardware Lockdown
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <strong className="block font-black text-stone-900">Enforce Strict Kiosk Lockdown</strong>
                <span className="text-stone-500 text-[11px]">Disable home button, task switcher, and system alerts</span>
              </div>
              <input
                type="checkbox"
                checked={kioskStrictMode}
                onChange={e => setKioskStrictMode(e.target.checked)}
                className="w-4 h-4 text-[#650000] accent-[#650000] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <strong className="block font-black text-stone-900">Auto-Quarantine Rooted Devices</strong>
                <span className="text-stone-500 text-[11px]">Automatically isolate devices showing su binary modifications</span>
              </div>
              <input
                type="checkbox"
                checked={autoQuarantineRoot}
                onChange={e => setAutoQuarantineRoot(e.target.checked)}
                className="w-4 h-4 text-[#650000] accent-[#650000] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <strong className="block font-black text-stone-900">Whitelisted Wi-Fi Network SSID</strong>
                <span className="font-mono text-stone-500 text-[11px]">SirMV-Academic-5G (WPA3-Enterprise)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                Locked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

