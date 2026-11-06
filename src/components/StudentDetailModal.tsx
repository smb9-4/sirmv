import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Award, CheckCircle2, TrendingUp, CalendarCheck, Mail, Phone, BookOpen, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import type { StudentAnalysisRecord } from '../rosterData';
import AnimatedCounter from './AnimatedCounter';

interface StudentDetailModalProps {
  student: StudentAnalysisRecord | null;
  onClose: () => void;
  sidebarWidth?: number;
}

export default function StudentDetailModal({ student, onClose, sidebarWidth = 86 }: StudentDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (student) {
      setMounted(true);
    } else {
      setMounted(false);
      setIsFullScreen(false);
    }
  }, [student]);

  // Esc key closes or restores
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

  if (!student) return null;

  // Let's compute a 600-scale total board mark (e.g. 500 / 600) for realistic PUC standards
  const totalBoardMarks = Math.min(600, Math.round(student.jeeMockScore * 2 + 76)); // e.g. 500, 524, etc.
  const physicsBoard = Math.min(100, Math.round(student.physicsScore * 0.95 + 6));
  const chemistryBoard = Math.min(100, Math.round(student.chemistryScore * 0.95 + 6));
  const mathBoard = Math.min(100, Math.round(student.mathScore * 0.95 + 6));
  const biologyBoard = Math.min(100, Math.round(86 + (student.rank % 12)));
  const csBoard = Math.min(100, Math.round(89 + (student.rank % 9)));
  const statisticsBoard = Math.min(100, Math.round(84 + (student.rank % 14)));

  return (
    <div
      style={{
        left: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : 0,
      }}
      className={`fixed top-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-md transition-all duration-300 ${
        isFullScreen ? 'p-1.5 md:p-3' : 'p-4'
      }`}
    >
      <motion.div
        layout
        initial={{ scale: 0.93, opacity: 0 }}
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
        className={`relative bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-200/80 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full max-w-none max-h-none rounded-2xl md:rounded-3xl border-2 border-[#E5BD55]'
            : 'w-full max-w-2xl rounded-3xl'
        }`}
      >
        {/* Apple Style Top Header Strip */}
        <div className="px-6 py-5 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/10 text-[#0284C7] flex items-center justify-center font-bold text-lg border border-[#0EA5E9]/20 shadow-inner shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-stone-900 leading-tight">
                  {student.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0369A1]">
                  Section {student.section}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    student.status === 'Passed'
                      ? 'bg-[#DCFCE7] text-[#166534]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}
                >
                  {student.status}
                </span>
                {isFullScreen && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Maximize2 size={10} /> Full Screen
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                Roll No: <span className="font-mono font-bold text-stone-800">{student.rollNumber}</span> • II PU Science (PCMB / PCMC) • Shivamogga Campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Expand / Bulge Fullscreen Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsFullScreen((prev) => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all apple-button shadow-xs border ${
                isFullScreen
                  ? 'bg-[#650000] text-[#FFE59A] border-[#650000]'
                  : 'bg-stone-100 hover:bg-[#FFE59A] text-stone-600 hover:text-[#650000] border-stone-200'
              }`}
              title={isFullScreen ? "Restore normal size" : "Expand to Full Screen (Sidebar remains visible)"}
            >
              {isFullScreen ? (
                <Minimize2 size={17} />
              ) : (
                <Maximize2 size={17} />
              )}
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition apple-button shrink-0 shadow-xs border border-stone-200"
              title="Close"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Main Animated Marks Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FDE68A]/40 border border-[#FCD34D] text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-2 right-3 opacity-15 pointer-events-none">
              <Award size={90} className="text-[#B45309]" />
            </div>

            <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider block">
              Cumulative Academic Board Score
            </span>

            {/* THE NUMBERS ANIMATE FROM 0 TO CURRENT MARKS (e.g. 500) */}
            <div className="text-5xl md:text-6xl font-black text-[#78350F] mt-2 tracking-tight">
              <AnimatedCounter value={totalBoardMarks} duration={1400} />
              <span className="text-2xl text-[#B45309]/60 font-semibold ml-1">/ 600</span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-4 text-xs font-bold text-[#92400E]">
              <span className="flex items-center gap-1">
                Batch Rank: #<AnimatedCounter value={student.rank} duration={800} /> of 100
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Score: <AnimatedCounter value={Math.round((totalBoardMarks / 600) * 100)} duration={1200} suffix="%" />
              </span>
            </div>
          </div>

          {/* Subject Breakdown Animated Cards */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">
              PUC Core Subjects Breakdown (Animates from 0 to Marks)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center hover:bg-white hover:shadow-md transition apple-button">
                <span className="text-[11px] font-semibold text-stone-500 block">Physics</span>
                <div className="text-2xl font-black text-stone-800 mt-1">
                  <AnimatedCounter value={physicsBoard} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center hover:bg-white hover:shadow-md transition apple-button">
                <span className="text-[11px] font-semibold text-stone-500 block">Chemistry</span>
                <div className="text-2xl font-black text-stone-800 mt-1">
                  <AnimatedCounter value={chemistryBoard} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center hover:bg-white hover:shadow-md transition apple-button">
                <span className="text-[11px] font-semibold text-stone-500 block">Mathematics</span>
                <div className="text-2xl font-black text-stone-800 mt-1">
                  <AnimatedCounter value={mathBoard} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center hover:bg-white hover:shadow-md transition apple-button">
                <span className="text-[11px] font-semibold text-stone-500 block">Biology</span>
                <div className="text-2xl font-black text-stone-800 mt-1">
                  <AnimatedCounter value={biologyBoard} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center hover:bg-white hover:shadow-md transition apple-button">
                <span className="text-[11px] font-semibold text-stone-500 block">Computer Science</span>
                <div className="text-2xl font-black text-stone-800 mt-1">
                  <AnimatedCounter value={csBoard} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center hover:bg-white hover:shadow-md transition apple-button">
                <span className="text-[11px] font-semibold text-stone-500 block">Statistics</span>
                <div className="text-2xl font-black text-stone-800 mt-1">
                  <AnimatedCounter value={statisticsBoard} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance and Competitive Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Attendance */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-600 block">Overall Attendance</span>
                <span className="text-[11px] text-stone-400">75% statutory minimum</span>
              </div>
              <div className="text-right">
                <span
                  className={`text-2xl font-black ${
                    student.attendancePercentage >= 75 ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  <AnimatedCounter
                    value={student.attendancePercentage}
                    decimals={1}
                    duration={1100}
                    suffix="%"
                  />
                </span>
              </div>
            </div>

            {/* KCET Score */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-600 block">KCET Mock Rating</span>
                <span className="text-[11px] text-stone-400">State engineering rank prep</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-700">
                  <AnimatedCounter value={student.cetScore} duration={1200} />
                  <span className="text-xs text-stone-400 font-normal"> / 180</span>
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details Footer */}
          <div className="p-3.5 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-stone-400" /> {student.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-stone-400" /> {student.phone}
            </span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="px-4 py-2 rounded-full font-bold text-xs text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition apple-button shadow-xs flex items-center gap-1.5"
          >
            {isFullScreen ? (
              <>
                <Minimize2 size={13} />
                <span>Restore Window</span>
              </>
            ) : (
              <>
                <Maximize2 size={13} />
                <span>Expand to Full Screen</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-stone-900 hover:bg-black transition apple-button shadow-sm"
          >
            Close Student Record
          </button>
        </div>
      </motion.div>
    </div>
  );
}
