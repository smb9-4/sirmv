import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Shield,
  Smartphone,
} from 'lucide-react';
import type { StudentTabletRecord, SecurityIncidentRecord } from '../../tabletIntelligenceData';

interface SecurityIntelligenceViewProps {
  records: StudentTabletRecord[];
  onSelectStudent: (student: StudentTabletRecord) => void;
}

export default function SecurityIntelligenceView({
  records,
  onSelectStudent,
}: SecurityIntelligenceViewProps) {
  const [incidents, setIncidents] = useState(() =>
    records.filter(r => r.securityIncident !== undefined)
  );
  const [statusFilter, setStatusFilter] = useState<'All' | 'Investigating' | 'Quarantined' | 'Resolved'>('All');

  const filteredIncidents = incidents.filter(r => {
    if (statusFilter === 'All') return true;
    return r.securityIncident?.status === statusFilter;
  });

  const handleUpdateStatus = (recordId: string, newStatus: 'Investigating' | 'Quarantined' | 'Resolved') => {
    setIncidents(prev =>
      prev.map(r => {
        if (r.id === recordId && r.securityIncident) {
          return {
            ...r,
            securityIncident: {
              ...r.securityIncident,
              status: newStatus,
            },
          };
        }
        return r;
      })
    );
  };

  const criticalCount = incidents.filter(r => r.securityIncident?.severity === 'Critical').length;
  const highCount = incidents.filter(r => r.securityIncident?.severity === 'High').length;
  const investigatingCount = incidents.filter(r => r.securityIncident?.status === 'Investigating').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={12} />
              REAL-TIME SECURITY COMMAND
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Hardware Sensor & Kiosk Tampering Audit
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Security Intelligence & Tampering Prevention
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Tracking rooted hardware signatures, developer mode toggles, USB debugging attachments, unauthorized wireless handshakes, and abnormal data transfers across 3,000 supported student tablets.
          </p>
        </div>

        <button
          onClick={() => alert('Integrity scan dispatched across all 100 active tablet kiosks.')}
          className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 shadow-sm transition apple-button shrink-0"
        >
          <ShieldCheck size={16} />
          <span>Run Fleet Integrity Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Flagged Events
          </span>
          <strong className="text-2xl font-black text-stone-900 block mt-1">{incidents.length} Incidents</strong>
          <span className="text-[11px] text-stone-500">Across 100 live devices</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-red-200 bg-red-50/50 shadow-xs">
          <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
            Critical Severity
          </span>
          <strong className="text-2xl font-black text-red-700 block mt-1">{criticalCount} Critical</strong>
          <span className="text-[11px] text-red-600 font-bold">Root / Dev mode toggles</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/50 shadow-xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            High / Medium Severity
          </span>
          <strong className="text-2xl font-black text-amber-800 block mt-1">{highCount} Warnings</strong>
          <span className="text-[11px] text-amber-700 font-medium">USB / Wi-Fi handshakes</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Under Active Investigation
          </span>
          <strong className="text-2xl font-black text-purple-800 block mt-1">{investigatingCount} Cases</strong>
          <span className="text-[11px] text-purple-700 font-bold">Proctors Notified</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {(['All', 'Investigating', 'Quarantined', 'Resolved'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              statusFilter === tab ? 'bg-[#650000] text-[#FFE59A] shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Security Incidents Cards List */}
      <div className="space-y-3.5">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-stone-400 font-bold text-sm">
            No security incidents match the selected filter.
          </div>
        ) : (
          filteredIncidents.map(r => {
            const inc = r.securityIncident!;
            return (
              <motion.div
                key={inc.incidentId}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-white shadow-xs ${
                      inc.severity === 'Critical'
                        ? 'bg-red-600'
                        : inc.severity === 'High'
                        ? 'bg-orange-600'
                        : 'bg-amber-600'
                    }`}
                  >
                    <ShieldAlert size={22} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm text-stone-900">{inc.type}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          inc.severity === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inc.severity} Severity
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-500">
                        Incident #{inc.incidentId} • {inc.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs pt-0.5">
                      <span className="font-bold text-stone-800">
                        Student: <span className="text-[#650000]">{r.studentName}</span> (USN: {r.usn})
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="font-bold text-stone-800 font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {r.assignedTabletId}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-500 font-medium">
                        Recommended: <strong className="text-stone-800">{inc.recommendedAction}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status Pill */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectStudent(r)}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition"
                  >
                    Inspect Profile
                  </button>

                  {inc.status !== 'Quarantined' ? (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'Quarantined')}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition"
                    >
                      Quarantine Device
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-900 font-black text-xs">
                      Quarantined 🔒
                    </span>
                  )}

                  {inc.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'Resolved')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                    >
                      Clear & Resolve
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                      Resolved ✓
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

