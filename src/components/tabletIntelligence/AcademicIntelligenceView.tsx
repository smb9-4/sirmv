import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  Brain,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import type { StudentTabletRecord } from '../../tabletIntelligenceData';
import AnimatedCounter from '../AnimatedCounter';

interface AcademicIntelligenceViewProps {
  records: StudentTabletRecord[];
  onSelectStudent: (student: StudentTabletRecord) => void;
}

export default function AcademicIntelligenceView({
  records,
  onSelectStudent,
}: AcademicIntelligenceViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics' | 'Biology'>('Physics');

  const avgPhysics = Math.round(records.reduce((acc, r) => acc + r.physicsAccuracy, 0) / records.length);
  const avgChemistry = Math.round(records.reduce((acc, r) => acc + r.chemistryAccuracy, 0) / records.length);
  const avgMath = Math.round(records.reduce((acc, r) => acc + r.mathAccuracy, 0) / records.length);
  const avgBiology = Math.round(records.reduce((acc, r) => acc + r.biologyAccuracy, 0) / records.length);

  // Filter students who might need academic assistance in selected subject (< 70% accuracy)
  const studentsNeedingSupport = records
    .filter(r => {
      const acc =
        selectedSubject === 'Physics'
          ? r.physicsAccuracy
          : selectedSubject === 'Chemistry'
          ? r.chemistryAccuracy
          : selectedSubject === 'Mathematics'
          ? r.mathAccuracy
          : r.biologyAccuracy;
      return acc < 72;
    })
    .slice(0, 15);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#650000] text-[#FFE59A] tracking-wider flex items-center gap-1.5">
              <Brain size={12} />
              ACADEMIC INTELLIGENCE & MASTERY
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • AI-Assisted PUC Subject Diagnostics
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            Academic Performance Intelligence
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-3xl font-medium leading-relaxed mt-1">
            Analyzing subject-wise diagnostic accuracy across Physics, Chemistry, Mathematics, and Biology. Providing curriculum mastery observations to help faculty identify students requiring focused revision support.
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center min-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Cohort Average Accuracy
          </span>
          <div className="text-3xl font-black text-[#650000] mt-1">
            <AnimatedCounter value={Math.round((avgPhysics + avgChemistry + avgMath + avgBiology) / 4)} duration={1200} suffix="%" />
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">Passing Benchmark: 60%</span>
        </div>
      </div>

      {/* Subject Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { id: 'Physics', label: 'Physics (PUC)', avg: avgPhysics, color: 'text-blue-700', bg: 'bg-blue-50/70' },
          { id: 'Chemistry', label: 'Chemistry (PUC)', avg: avgChemistry, color: 'text-amber-700', bg: 'bg-amber-50/70' },
          { id: 'Mathematics', label: 'Mathematics (PUC)', avg: avgMath, color: 'text-purple-700', bg: 'bg-purple-50/70' },
          { id: 'Biology', label: 'Biology / CS', avg: avgBiology, color: 'text-emerald-700', bg: 'bg-emerald-50/70' },
        ].map(s => {
          const isSelected = selectedSubject === s.id;
          return (
            <motion.div
              key={s.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedSubject(s.id as any)}
              className={`p-4 rounded-2xl border cursor-pointer transition apple-button shadow-xs flex flex-col justify-between ${
                isSelected ? 'bg-white border-[#650000] ring-2 ring-[#650000]/20' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <span className="text-xs font-black text-stone-900 block">{s.label}</span>
                <div className={`text-2xl font-black ${s.color} mt-1`}>
                  {s.avg}%
                </div>
              </div>
              <span className="text-[10px] text-stone-400 font-bold mt-2 flex items-center justify-between">
                <span>{isSelected ? 'Active Filter' : 'Click to inspect'}</span>
                <ArrowRight size={10} />
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* AI Academic Observations Box */}
      <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/70 text-purple-950 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-700" />
          <strong className="text-sm font-black text-purple-950 uppercase tracking-wider">
            AI Academic Support Advisory
          </strong>
        </div>
        <p className="text-xs text-purple-900 leading-relaxed font-medium">
          Observation: Students are demonstrating high concept accuracy in Mechanics and Organic Reactions, but telemetry reveals higher skip rates in Calculus integration and Coordinate Geometry. {studentsNeedingSupport.length} students would benefit from targeted revision problem sets.
        </p>
      </div>

      {/* Students Requiring Subject Support Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">
            Students Needing Focus Support in {selectedSubject}
          </h3>
          <span className="text-xs text-stone-400 font-bold">
            Showing {studentsNeedingSupport.length} flagged profiles
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-3 px-4">USN</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">{selectedSubject} Accuracy</th>
                <th className="py-3 px-4">Overall Completion</th>
                <th className="py-3 px-4">Questions Attempted</th>
                <th className="py-3 px-4">Recommended Support</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {studentsNeedingSupport.map(r => {
                const acc =
                  selectedSubject === 'Physics'
                    ? r.physicsAccuracy
                    : selectedSubject === 'Chemistry'
                    ? r.chemistryAccuracy
                    : selectedSubject === 'Mathematics'
                    ? r.mathAccuracy
                    : r.biologyAccuracy;

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectStudent(r)}
                    className="hover:bg-amber-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">{r.usn}</td>
                    <td className="py-3 px-4 font-black text-stone-900">{r.studentName}</td>
                    <td className="py-3 px-4 font-bold text-stone-600">Section {r.section}</td>
                    <td className="py-3 px-4 font-black text-amber-700">{acc}%</td>
                    <td className="py-3 px-4 font-bold text-stone-800">{r.questionsAttempted}%</td>
                    <td className="py-3 px-4 font-bold text-stone-700">{r.questionsAttempted} / 100</td>
                    <td className="py-3 px-4 text-stone-500 font-medium">Assign Remedial Slide Kit #04</td>
                    <td className="py-3 px-4 text-[#650000] font-bold">
                      <span className="flex items-center gap-1 hover:underline">
                        <span>Inspect Profile</span>
                        <ArrowRight size={11} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

