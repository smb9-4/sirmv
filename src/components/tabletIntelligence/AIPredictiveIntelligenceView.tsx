import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  Battery,
  Cpu,
  Wifi,
  Brain,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import type { StudentTabletRecord, AIPredictionRecord } from '../../tabletIntelligenceData';

interface AIPredictiveIntelligenceViewProps {
  records: StudentTabletRecord[];
  onSelectStudent: (student: StudentTabletRecord) => void;
  onSelectDevice: (device: StudentTabletRecord) => void;
}

export default function AIPredictiveIntelligenceView({
  records,
  onSelectStudent,
  onSelectDevice,
}: AIPredictiveIntelligenceViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Academic' | 'Hardware Failure' | 'Connectivity'>('All');

  const predictedRecords = records.filter(r => r.aiPrediction !== undefined);

  const filtered = predictedRecords.filter(r => {
    if (categoryFilter === 'All') return true;
    return r.aiPrediction?.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-700 text-white tracking-wider flex items-center gap-1.5">
              <Bot size={13} />
              AI PREDICTIVE TELEMETRY ENGINE
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Statistical Heuristics & Anomaly Detection (Separated from verified facts)
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            AI Predictive Intelligence & Early Warnings
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Analyzing live telemetry streams to flag students at risk of running out of time, devices with anomalous thermal or battery discharge slopes, and wireless packets drops before examinations are disrupted.
          </p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-center min-w-[200px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
            Active Predictions
          </span>
          <strong className="text-3xl font-black text-purple-950 block mt-1">
            {predictedRecords.length} Flagged
          </strong>
          <span className="text-[11px] text-purple-700 font-bold">Avg Confidence: 92%</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {(['All', 'Academic', 'Hardware Failure', 'Connectivity'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setCategoryFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              categoryFilter === tab
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {filtered.map(r => {
          const pred = r.aiPrediction!;
          return (
            <motion.div
              key={pred.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-3xl p-6 border border-purple-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-black shadow-xs mt-0.5">
                  <Sparkles size={24} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-base text-stone-900">
                      {pred.pattern}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-200">
                      {pred.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-100 text-stone-700">
                      {pred.confidence}% Confidence
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        pred.impact === 'High'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pred.impact} Impact
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    <strong className="text-stone-900">Supporting Evidence: </strong>
                    {pred.evidence}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    <span className="font-bold text-stone-800">
                      Student: <span className="text-[#650000]">{r.studentName}</span> (USN: {r.usn})
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                      {r.assignedTabletId}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                      Suggested Action: {pred.suggestedAction}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                <button
                  onClick={() => onSelectStudent(r)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-xs text-stone-700 transition"
                >
                  Student Report
                </button>
                <button
                  onClick={() => onSelectDevice(r)}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 font-bold text-xs text-white transition shadow-xs"
                >
                  Device Telemetry
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

