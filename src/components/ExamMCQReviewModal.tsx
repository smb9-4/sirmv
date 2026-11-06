import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Clock, Award, BookOpen, AlertCircle, Check, Maximize2, Minimize2 } from 'lucide-react';
import type { PastExamRecord } from '../pucAcademicData';
import AnimatedCounter from './AnimatedCounter';

interface ExamMCQReviewModalProps {
  exam: PastExamRecord | null;
  onClose: () => void;
  sidebarWidth?: number;
}

export default function ExamMCQReviewModal({ exam, onClose, sidebarWidth = 86 }: ExamMCQReviewModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Allow Esc key to exit fullscreen first, then close on second Esc
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

  if (!exam) return null;

  return (
    <div
      style={{
        left: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : 0,
      }}
      className={`fixed top-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm transition-all duration-300 ${
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
        className={`relative bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-stone-200/80 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full max-w-none max-h-none rounded-2xl md:rounded-3xl border-2 border-[#E5BD55]'
            : 'w-full max-w-4xl max-h-[90vh] rounded-3xl'
        }`}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE59A] text-[#650000] flex items-center justify-center font-black text-sm border border-[#E5BD55] shrink-0">
              {exam.category}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg text-stone-900 leading-tight">
                  {exam.examName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  {exam.category} Track
                </span>
                {isFullScreen && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Maximize2 size={10} /> Full Screen Expanded
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Completed on {exam.date} • Time Spent: {exam.timeSpentMinutes} mins • {exam.totalQuestions} Questions
              </p>
            </div>
          </div>

          {/* Action Buttons: Expand Fullscreen & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Expand / Bulge to Full Screen Button with arrows */}
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
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 flex items-center justify-center transition apple-button shrink-0 shadow-xs border border-stone-200"
              title="Close Review"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Score and Performance Callout Strip */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Score</span>
              <strong className="text-base font-black text-[#A60000]">
                {exam.marksObtained} <span className="text-xs font-normal text-stone-400">/ {exam.totalMarks}</span>
              </strong>
            </div>

            <div className="h-7 w-[1px] bg-stone-200" />

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Percentage</span>
              <strong className="text-base font-black text-stone-800">
                {exam.percentage}%
              </strong>
            </div>

            <div className="h-7 w-[1px] bg-stone-200" />

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Cohort Rank</span>
              <strong className="text-base font-black text-green-700">
                #{exam.cohortRank} <span className="text-xs font-normal text-stone-400">of {exam.totalCohortStudents}</span>
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-800 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 size={13} /> {exam.correctAnswers} Correct
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1">
              <XCircle size={13} /> {exam.incorrectAnswers} Incorrect
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 font-bold text-xs">
              {exam.unattempted} Left
            </span>
          </div>
        </div>

        {/* Scrollable Questions Review List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
              Detailed Question-by-Question Analysis ({exam.questionsReview.length} Diagnostic MCQs)
            </h4>
            <span className="text-xs text-stone-400 font-medium">
              Right answers ticked in green • Student selections highlighted
            </span>
          </div>

          {exam.questionsReview.map((q) => {
            const isStudentCorrect = q.selectedOptionId === q.correctOptionId;
            const isUnattempted = !q.selectedOptionId;

            return (
              <div
                key={q.id}
                className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/90 space-y-4 hover:border-stone-300 transition"
              >
                {/* Question Header: Number, Subject, Topic, Difficulty & Time Taken */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                      {q.questionNumber}
                    </span>
                    <span className="text-xs font-bold text-[#650000]">{q.subject}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs font-medium text-stone-600">{q.topic}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* TIME TAKEN TO MARK THAT QUESTION */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      <Clock size={12} className="text-blue-600" />
                      <span>Time Taken: {q.timeTakenSeconds}s</span>
                    </div>

                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isUnattempted
                          ? 'bg-stone-200 text-stone-600'
                          : isStudentCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isUnattempted ? 'Unattempted' : isStudentCorrect ? '+4 Marks (Correct)' : '-1 Mark (Wrong)'}
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-sm font-bold text-stone-900 leading-relaxed">
                  {q.questionText}
                </p>

                {/* 4 Options with Right Answer Ticked & Option Chosen Highlighted */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isRightAnswer = opt.id === q.correctOptionId;
                    const isChosenByStudent = opt.id === q.selectedOptionId;

                    let cardClass = 'bg-white border-stone-200 text-stone-700';

                    if (isRightAnswer) {
                      cardClass = 'bg-green-50 border-green-500 text-green-950 font-bold ring-1 ring-green-500';
                    } else if (isChosenByStudent && !isRightAnswer) {
                      cardClass = 'bg-red-50 border-red-500 text-red-950 font-bold ring-1 ring-red-500';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${cardClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                              isRightAnswer
                                ? 'bg-green-600 text-white'
                                : isChosenByStudent
                                ? 'bg-red-600 text-white'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </div>

                        {/* Status badges for option */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isRightAnswer && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-green-700 bg-green-200/80 px-2 py-0.5 rounded-md">
                              <Check size={12} className="stroke-[3]" /> Right Answer Ticked
                            </span>
                          )}

                          {isChosenByStudent && (
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                isRightAnswer ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
                              }`}
                            >
                              You Chose
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-Step Faculty Explanation */}
                <div className="mt-3 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1 text-stone-700">
                  <div className="font-extrabold text-[#78350F] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <BookOpen size={13} /> Official Faculty Solution & Explanation:
                  </div>
                  <p className="leading-relaxed text-stone-800">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>Evaluation verified by Department Examination Cell</span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-400">Press Esc to {isFullScreen ? 'restore' : 'close'}</span>
          </div>

          <div className="flex items-center gap-2">
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
              className="px-6 py-2 rounded-full font-bold text-xs text-white bg-stone-900 hover:bg-black transition apple-button shadow-sm"
            >
              Close Review
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
