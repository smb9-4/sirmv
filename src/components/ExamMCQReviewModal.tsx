import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Clock, Award, BookOpen, AlertCircle, Check, Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { PastExamRecord } from '../pucAcademicData';
import AnimatedCounter from './AnimatedCounter';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
};

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

  useEffect(() => {
    setIsFullScreen(false);
  }, [exam?.id]);

  if (!exam || typeof document === 'undefined') return null;

  const subjectPerformance = exam.subjectScores.map(({ subject, obtained, max }) => ({
    subject,
    obtained,
    max,
    percentage: max > 0 ? Math.min(100, Math.max(0, Math.round((obtained / max) * 100))) : 0,
  }));
  const overallPercentage = Math.min(100, Math.max(0, exam.percentage));
  const bestSubject = subjectPerformance.reduce<(typeof subjectPerformance)[number] | null>(
    (best, subject) => (best === null || subject.percentage > best.percentage ? subject : best),
    null,
  );
  const questionTimeAnalysis = exam.questionsReview
    .filter((question) => Number.isFinite(question.timeTakenSeconds) && question.timeTakenSeconds >= 0)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  const subjectQuestionAnalysis = exam.subjectScores.map(({ subject }) => {
    const questions = exam.questionsReview.filter((question) => question.subject === subject);

    return {
      subject,
      reviewedCount: questions.length,
      attendedCount: questions.filter((question) => Boolean(question.selectedOptionId)).length,
      correctCount: questions.filter(
        (question) => Boolean(question.selectedOptionId) && question.selectedOptionId === question.correctOptionId,
      ).length,
      incorrectCount: questions.filter(
        (question) => Boolean(question.selectedOptionId) && question.selectedOptionId !== question.correctOptionId,
      ).length,
      leftCount: questions.filter((question) => !question.selectedOptionId).length,
    };
  });
  const subjectTimeAnalysis = exam.subjectScores.map(({ subject }) => {
    const questions = questionTimeAnalysis.filter((question) => question.subject === subject);
    const totalSeconds = questions.reduce((total, question) => total + question.timeTakenSeconds, 0);

    return {
      subject,
      questionCount: questions.length,
      totalSeconds,
      averageSeconds: questions.length > 0 ? Math.round(totalSeconds / questions.length) : null,
    };
  });
  const maxSubjectTime = Math.max(1, ...subjectTimeAnalysis.map(({ totalSeconds }) => totalSeconds));
  const maxQuestionTime = Math.max(1, ...questionTimeAnalysis.map(({ timeTakenSeconds }) => timeTakenSeconds));
  const totalTrackedSeconds = questionTimeAnalysis.reduce(
    (total, question) => total + question.timeTakenSeconds,
    0,
  );

  return createPortal(
    <div
      style={{
        left: 0,
        paddingLeft:
          typeof window !== 'undefined' && window.innerWidth >= 768 && !isFullScreen
            ? sidebarWidth + 24
            : undefined,
      }}
      className={`fixed top-0 bottom-0 right-0 z-[70] flex items-center justify-center bg-black/45 backdrop-blur-sm transition-all duration-300 ${
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
              title={isFullScreen ? "Restore normal size" : "Expand to Full Screen"}
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

        {/* Performance analysis and question-by-question review */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section aria-labelledby="performance-analysis-title" className="space-y-4">
            <div>
              <h4 id="performance-analysis-title" className="font-bold text-sm uppercase tracking-wider text-stone-700">
                Student Performance Analysis
              </h4>
              <p className="mt-1 text-xs text-stone-500">Exam score and subject strengths at a glance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                <h5 className="text-xs font-bold uppercase tracking-wide text-stone-500">Overall Performance</h5>
                <div className="mt-4 flex justify-center">
                  <div
                    className="h-36 w-36 shrink-0 rounded-full p-[10px]"
                    role="img"
                    aria-label={`Overall exam score ${overallPercentage.toFixed(1)} percent`}
                    style={{
                      background: `conic-gradient(#650000 ${overallPercentage}%, #e7e5e4 ${overallPercentage}% 100%)`,
                    }}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                      <strong className="text-3xl font-black text-[#650000]">{overallPercentage.toFixed(1)}%</strong>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Overall Score</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3 rounded-xl border border-stone-200 bg-white p-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-stone-50 px-3 py-2">
                      <span className="block text-[10px] font-bold uppercase text-stone-400">Marks</span>
                      <strong className="text-sm text-stone-800">{exam.marksObtained} / {exam.totalMarks}</strong>
                    </div>
                    <div className="rounded-lg bg-stone-50 px-3 py-2">
                      <span className="block text-[10px] font-bold uppercase text-stone-400">Cohort Rank</span>
                      <strong className="text-sm text-stone-800">#{exam.cohortRank} of {exam.totalCohortStudents}</strong>
                    </div>
                  </div>

                  {bestSubject && (
                    <div className="rounded-lg bg-amber-100/70 px-3 py-2">
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-800">
                        <Award size={12} /> Best Subject
                      </span>
                      <strong className="text-sm text-amber-950">
                        {bestSubject.subject} ({bestSubject.percentage}%)
                      </strong>
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-3">
                    <div className="mb-2">
                      <h6 className="text-[11px] font-bold uppercase tracking-wide text-stone-600">Questions Attended by Subject</h6>
                      <p className="mt-0.5 text-[10px] text-stone-400">Counts from reviewed questions only.</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {subjectQuestionAnalysis.map(({ subject, reviewedCount, attendedCount, leftCount }) => (
                        <div key={subject} className="rounded-lg bg-stone-50 px-3 py-2">
                          <span className="block text-[10px] font-semibold text-stone-600">{subject}</span>
                          <strong className="text-[11px] text-stone-800">
                            {reviewedCount > 0
                              ? `${attendedCount} attended · ${leftCount} left`
                              : 'No reviewed questions'}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                <h5 className="text-xs font-bold uppercase tracking-wide text-stone-500">Subject-wise Performance</h5>
                <p className="mt-1 text-[11px] text-stone-400">Percentage of marks earned in each subject.</p>
                <div className="mt-4 space-y-4">
                  {subjectPerformance.map(({ subject, obtained, max, percentage }) => (
                    <div key={subject}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-stone-700">{subject}</span>
                        <span className="shrink-0 font-bold text-stone-600">
                          {obtained}/{max} · {percentage}%
                        </span>
                      </div>
                      <div
                        className="h-2.5 overflow-hidden rounded-full bg-stone-200"
                        role="progressbar"
                        aria-label={`${subject} score`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#650000] to-[#C2410C] transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-stone-200 pt-4">
                  <div className="mb-3">
                    <h6 className="text-[11px] font-bold uppercase tracking-wide text-stone-600">Subject-wise Time Analysis</h6>
                    <p className="mt-1 text-[10px] text-stone-400">
                      Timings from {questionTimeAnalysis.length} reviewed questions only.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {subjectTimeAnalysis.map(({ subject, questionCount, totalSeconds, averageSeconds }) => (
                      <div key={subject}>
                        <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-semibold text-stone-700">{subject}</span>
                          {averageSeconds === null ? (
                            <span className="text-stone-400">No reviewed-question timing</span>
                          ) : (
                            <span className="shrink-0 font-semibold text-stone-600">
                              {formatDuration(totalSeconds)} total · {averageSeconds}s avg · {questionCount} Q
                            </span>
                          )}
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                          {averageSeconds !== null && (
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#650000] to-[#C2410C]"
                              style={{ width: `${(totalSeconds / maxSubjectTime) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-stone-200 pt-4">
                  <div className="mb-2">
                    <h6 className="text-[11px] font-bold uppercase tracking-wide text-stone-600">Question Outcomes by Subject</h6>
                    <p className="mt-1 text-[10px] text-stone-400">Correct, incorrect and left counts from reviewed questions.</p>
                  </div>
                  <div className="space-y-2">
                    {subjectQuestionAnalysis.map(({
                      subject,
                      reviewedCount,
                      correctCount,
                      incorrectCount,
                      leftCount,
                    }) => (
                      <div key={subject} className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                        <span className="font-semibold text-stone-700">{subject}</span>
                        {reviewedCount > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            <span className="rounded-md bg-green-50 px-1.5 py-0.5 font-semibold text-green-700">
                              {correctCount} correct
                            </span>
                            <span className="rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-red-700">
                              {incorrectCount} incorrect
                            </span>
                            <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-semibold text-stone-600">
                              {leftCount} left
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400">No reviewed questions</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>

            <article className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="mb-2">
                <h5 className="text-xs font-bold uppercase tracking-wide text-stone-500">Subject Radar Chart</h5>
                <p className="mt-1 text-[11px] text-stone-400">Compare this student’s scores across the exam subjects.</p>
              </div>
              <div className="h-56 w-full">
                {subjectPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={subjectPerformance} outerRadius="72%">
                      <PolarGrid stroke="#e7e5e4" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#57534e', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={5} tick={{ fill: '#a8a29e', fontSize: 9 }} />
                      <Radar
                        name="Student score"
                        dataKey="percentage"
                        stroke="#650000"
                        strokeWidth={2}
                        fill="#A60000"
                        fillOpacity={0.24}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-stone-400">
                    No subject score data available.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wide text-stone-500">Question-wise Time Analysis</h5>
                  <p className="mt-1 text-[11px] text-stone-400">
                    Time spent on each reviewed question, grouped by question number and subject.
                  </p>
                </div>
                <div className="flex gap-4 text-right text-[11px]">
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-stone-400">Tracked time</span>
                    <strong className="text-stone-700">{formatDuration(totalTrackedSeconds)}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase text-stone-400">Average / question</span>
                    <strong className="text-stone-700">
                      {questionTimeAnalysis.length > 0
                        ? `${Math.round(totalTrackedSeconds / questionTimeAnalysis.length)}s`
                        : '—'}
                    </strong>
                  </div>
                </div>
              </div>
              {questionTimeAnalysis.length > 0 ? (
                <div className="space-y-2.5">
                  {questionTimeAnalysis.map((question) => (
                    <div key={question.id} className="grid grid-cols-[minmax(90px,1fr)_2fr_auto] items-center gap-3 text-[11px]">
                      <div className="min-w-0">
                        <span className="block font-semibold text-stone-700">Q{question.questionNumber} · {question.subject}</span>
                        <span className="block truncate text-[10px] text-stone-400">{question.topic}</span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-stone-200"
                        role="progressbar"
                        aria-label={`Time spent on question ${question.questionNumber}`}
                        aria-valuemin={0}
                        aria-valuemax={maxQuestionTime}
                        aria-valuenow={question.timeTakenSeconds}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#650000] to-[#C2410C]"
                          style={{ width: `${(question.timeTakenSeconds / maxQuestionTime) * 100}%` }}
                        />
                      </div>
                      <strong className="min-w-[48px] text-right text-stone-600">
                        {formatDuration(question.timeTakenSeconds)}
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-stone-50 p-4 text-center text-xs text-stone-500">
                  No question-level timing data is available for this exam.
                </p>
              )}
            </article>
          </section>

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
    </div>,
    document.body,
  );
}
