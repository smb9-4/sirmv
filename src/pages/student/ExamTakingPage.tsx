import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight,
  Bookmark, Flag, Send, HelpCircle, ArrowLeft, Trophy, CheckCircle2,
  XCircle, RotateCcw
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { DEMO_MCQ_QUESTIONS } from '../../data';
import type { ExamResult, QuestionResult } from '../../types';

export default function ExamTakingPage() {
  const navigate = useNavigate();
  const { activeExamSession, addResult } = usePortal();

  // If no session active, fallback to default JEE Mock test
  const examName = activeExamSession?.examName || 'JEE Mock Test – Series 03 [DEMO]';
  const category = activeExamSession?.category || 'JEE';
  const questions = activeExamSession?.questions || DEMO_MCQ_QUESTIONS;
  const initialDuration = (activeExamSession?.durationMinutes || 180) * 60; // seconds

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<ExamResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });

      // Track time per question
      setQuestionTimes((prev) => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isSubmitted]);

  // Current Question
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  };

  const handleClearOption = () => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  };

  const handleToggleMarkReview = () => {
    if (isSubmitted) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalMarks = 0;
    let marksObtained = 0;

    const questionWiseResults: QuestionResult[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] || null;
      const isCorrect = selected === q.correctOptionId;
      const marks = q.marks || 4;
      const negMarks = q.negativeMarks || 1;
      totalMarks += marks;

      if (!selected) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
        marksObtained += marks;
      } else {
        incorrectCount++;
        marksObtained -= negMarks;
      }

      return {
        questionId: q.id,
        question: q,
        selectedOptionId: selected,
        timeTaken: questionTimes[idx] || 35,
        isCorrect: isCorrect,
      };
    });

    const resultId = 'res_' + Date.now();
    const finalResult: ExamResult = {
      id: resultId,
      examId: 'exam_' + Date.now(),
      examName: examName,
      category: category,
      date: new Date().toISOString().split('T')[0],
      totalMarks: totalMarks,
      marksObtained: Math.max(0, marksObtained),
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattempted: unattemptedCount,
      timeTaken: initialDuration - timeRemaining,
      totalQuestions: questions.length,
      questionWiseResult: questionWiseResults,
      isDemo: true,
    };

    addResult(finalResult);
    setSubmittedResult(finalResult);
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  // Format time (HH:MM:SS)
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Status counters
  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = questions.length - answeredCount;

  // Post submission view
  if (isSubmitted && submittedResult) {
    const percentage = Math.round((submittedResult.marksObtained / submittedResult.totalMarks) * 1000) / 10;

    return (
      <div className="min-h-screen bg-institutional-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-institutional-border text-center space-y-6">
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-md"
            style={{ backgroundColor: '#FFE59A', color: '#500000' }}
          >
            <Trophy size={32} />
          </div>

          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-green-100 text-green-800">
              Exam Submitted Successfully
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-2">
              {submittedResult.examName}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Category: {submittedResult.category} • Completed in {Math.floor(submittedResult.timeTaken / 60)} mins
            </p>
          </div>

          {/* Score highlight */}
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score Achieved</span>
            <div className="text-4xl font-black text-maroon-deep mt-1">
              {submittedResult.marksObtained} <span className="text-xl text-gray-400">/ {submittedResult.totalMarks}</span>
            </div>
            <span className="text-sm font-bold text-green-700 mt-1 block">
              Percentage: {percentage}%
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-bold text-green-800 block text-lg">{submittedResult.correctAnswers}</span>
              <span className="text-green-700">Correct</span>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="font-bold text-red-800 block text-lg">{submittedResult.incorrectAnswers}</span>
              <span className="text-red-700">Incorrect</span>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
              <span className="font-bold text-gray-700 block text-lg">{submittedResult.unattempted}</span>
              <span className="text-gray-600">Unattempted</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate(`/student/results?detailId=${submittedResult.id}`)}
              className="flex-1 py-3 px-4 rounded-full font-bold text-xs text-white shadow-md hover:opacity-90 transition"
              style={{ backgroundColor: '#A60000' }}
            >
              View Full Question-by-Question Analysis
            </button>
            <button
              onClick={() => navigate('/student/exams')}
              className="py-3 px-6 rounded-full font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            >
              Back to Exams
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans select-none">
      {/* Top Examination Exam Header */}
      <header
        className="text-white px-4 py-3 shadow-header flex items-center justify-between sticky top-0 z-40"
        style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 70%, #A60000 100%)' }}
      >
        <div className="flex items-center gap-3">
          <img src="/logo.png?v=3" alt="Sir MV" className="h-8 w-8 object-contain rounded" />
          <div>
            <h1 className="font-extrabold text-sm md:text-base leading-tight">
              {examName}
            </h1>
            <p className="text-[11px] text-gold-light" style={{ color: '#FFE59A' }}>
              Candidate: Rahul Sharma (23CSE001) • Subject: {currentQuestion?.subject || 'Engineering'}
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm shadow-inner ${
              timeRemaining < 300
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-black/40 text-gold-light border border-white/20'
            }`}
            style={timeRemaining >= 300 ? { color: '#FFE59A' } : {}}
          >
            <Clock size={16} />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-xs text-white shadow-sm hover:opacity-95 transition"
            style={{ backgroundColor: '#A60000' }}
          >
            <Send size={14} /> Submit Test
          </button>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Question Content Area */}
        <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl shadow-card border border-institutional-border p-6">
          <div>
            {/* Question Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-institutional-border mb-6">
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: '#650000' }}
                >
                  Q{currentIndex + 1}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 ml-2">
                  {currentQuestion?.subject} • {currentQuestion?.topic}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  +{currentQuestion?.marks || 4} Marks
                </span>
                <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  -{currentQuestion?.negativeMarks || 1} Neg
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm md:text-base font-semibold text-gray-900 leading-relaxed mb-6">
              {currentQuestion?.questionText}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedAnswers[currentIndex] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all duration-150 flex items-center gap-4 ${
                      isSelected
                        ? 'border-crimson bg-red-50/60 ring-2 ring-crimson/30 text-gray-900 font-medium'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-crimson text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      style={isSelected ? { backgroundColor: '#A60000' } : {}}
                    >
                      {option.id}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="pt-6 border-t border-institutional-border mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMarkReview}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition ${
                  markedForReview[currentIndex]
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={14} className={markedForReview[currentIndex] ? 'fill-current' : ''} />
                {markedForReview[currentIndex] ? 'Marked for Review' : 'Mark for Review'}
              </button>

              {selectedAnswers[currentIndex] && (
                <button
                  type="button"
                  onClick={handleClearOption}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-red-600 transition"
                >
                  <RotateCcw size={13} /> Clear Response
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold border border-institutional-border text-gray-700 hover:bg-gray-100 transition disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((c) => Math.min(questions.length - 1, c + 1))}
                  className="flex items-center gap-1 px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 transition"
                  style={{ backgroundColor: '#650000' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(true)}
                  className="flex items-center gap-1 px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 transition"
                  style={{ backgroundColor: '#A60000' }}
                >
                  Submit Examination
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Panel / Palette */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-5">
            <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-institutional-border mb-3">
              Question Palette
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 pb-3 border-b border-institutional-border">
              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3.5 h-3.5 rounded bg-green-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3.5 h-3.5 rounded bg-gray-200 border border-gray-400" />
                <span>Not Answered ({unattemptedCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3.5 h-3.5 rounded bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">★</span>
                <span>Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="w-3.5 h-3.5 rounded bg-white border-2 border-crimson" />
                <span>Current Question</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
              {questions.map((_, idx) => {
                const isAnswered = Boolean(selectedAnswers[idx]);
                const isReview = Boolean(markedForReview[idx]);
                const isCurrent = idx === currentIndex;

                let bgClass = 'bg-gray-100 text-gray-700 border-gray-300';
                if (isAnswered && isReview) {
                  bgClass = 'bg-purple-600 text-white border-purple-700';
                } else if (isAnswered) {
                  bgClass = 'bg-green-600 text-white border-green-700';
                } else if (isReview) {
                  bgClass = 'bg-purple-200 text-purple-900 border-purple-400';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs border flex items-center justify-center transition-all ${bgClass} ${
                      isCurrent ? 'ring-2 ring-crimson ring-offset-2 font-black' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Mobile Submit Button */}
            <div className="mt-5 pt-3 border-t border-institutional-border">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-2.5 rounded-full font-bold text-xs text-white shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: '#A60000' }}
              >
                Submit Examination
              </button>
            </div>
          </div>

          {/* Institutional Integrity Notice */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <span className="font-bold block">Examination Regulations:</span>
            <p>Do not switch browser tabs or minimize the window during this session.</p>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-institutional-border space-y-5">
            <div className="flex items-center gap-3 text-crimson">
              <AlertCircle size={24} />
              <h3 className="font-bold text-lg text-gray-900">Confirm Exam Submission?</h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <strong className="text-gray-900">{questions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Answered:</span>
                <strong className="text-green-700">{answeredCount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marked for Review:</span>
                <strong className="text-purple-700">{reviewCount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered Questions:</span>
                <strong className="text-red-700">{unattemptedCount}</strong>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Once submitted, you will immediately receive your score and question-wise diagnostic breakdown.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 rounded-full font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 rounded-full font-bold text-xs text-white shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: '#A60000' }}
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

