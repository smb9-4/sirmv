import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ChartNoAxesCombined, Award, CheckCircle2, XCircle, Clock,
  Calendar, ArrowRight, ArrowLeft, BarChart2, Check, X,
  AlertCircle, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { DEMO_DETAILED_RESULT } from '../../data';
import type { ExamResult, QuestionResult } from '../../types';

export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { results, getResultById } = usePortal();

  // Check if a specific detailed result is requested via URL query param
  const detailId = searchParams.get('detailId');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (detailId) {
      const found = getResultById(detailId) || (results.find(r => r.id === detailId));
      if (found) {
        // If questionWiseResult is empty, populate from DEMO_DETAILED_RESULT for realistic view
        if (!found.questionWiseResult || found.questionWiseResult.length === 0) {
          setSelectedResult({
            ...found,
            questionWiseResult: DEMO_DETAILED_RESULT.questionWiseResult,
          });
        } else {
          setSelectedResult(found);
        }
      } else {
        setSelectedResult(DEMO_DETAILED_RESULT);
      }
    } else {
      setSelectedResult(null);
    }
  }, [detailId, results, getResultById]);

  // Top Most Recent Exam Result (JEE Mock Test 02)
  const recentExam = results.find(r => r.id === 'r2') || results[0] || DEMO_DETAILED_RESULT;
  const recentPercentage = Math.round((recentExam.marksObtained / recentExam.totalMarks) * 1000) / 10;

  // Recharts data for subject performance
  const subjectScoresData = [
    { subject: 'Physics', obtained: 68, total: 100, percentage: 68 },
    { subject: 'Chemistry', obtained: 64, total: 100, percentage: 64 },
    { subject: 'Mathematics', obtained: 80, total: 100, percentage: 80 },
  ];

  const pieChartData = [
    { name: 'Correct', value: recentExam.correctAnswers, color: '#16A34A' },
    { name: 'Incorrect', value: recentExam.incorrectAnswers, color: '#DC2626' },
    { name: 'Unattempted', value: recentExam.unattempted, color: '#9CA3AF' },
  ];

  const handleViewDetail = (res: ExamResult) => {
    setSearchParams({ detailId: res.id });
  };

  const handleBackToOverview = () => {
    setSearchParams({});
    setSelectedResult(null);
  };

  const filteredHistory = results.filter(r => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <StudentNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* If viewing Detailed Examination Result */}
        {selectedResult ? (
          <div className="space-y-6">
            {/* Back Button & Header */}
            <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToOverview}
                  className="p-2 rounded-lg border border-institutional-border hover:bg-gray-100 transition text-gray-700"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      {selectedResult.examName}
                    </h1>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: '#FFE59A', color: '#500000' }}>
                      DEMO DATA
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Category: <strong>{selectedResult.category}</strong> • Date Attempted: {selectedResult.date} • Candidate: Rahul Sharma
                  </p>
                </div>
              </div>

              <button
                onClick={handleBackToOverview}
                className="px-4 py-2 rounded-full font-bold text-xs text-white"
                style={{ backgroundColor: '#650000' }}
              >
                Return to All Results
              </button>
            </div>

            {/* Score Summary Metrics Card */}
            <div
              className="rounded-2xl p-6 text-white shadow-card relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 70%, #A60000 100%)' }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">Total Marks</span>
                  <span className="text-2xl font-black text-white mt-0.5 block">{selectedResult.totalMarks}</span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">Marks Obtained</span>
                  <span className="text-2xl font-black text-gold-light mt-0.5 block" style={{ color: '#FFE59A' }}>
                    {selectedResult.marksObtained}
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">Percentage</span>
                  <span className="text-2xl font-black text-green-300 mt-0.5 block">
                    {Math.round((selectedResult.marksObtained / selectedResult.totalMarks) * 1000) / 10}%
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">Correct Answers</span>
                  <span className="text-2xl font-black text-green-400 mt-0.5 block">{selectedResult.correctAnswers}</span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">Incorrect Answers</span>
                  <span className="text-2xl font-black text-red-300 mt-0.5 block">{selectedResult.incorrectAnswers}</span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">Total Time</span>
                  <span className="text-2xl font-black text-white mt-0.5 block">
                    {Math.floor(selectedResult.timeTaken / 60)}m {selectedResult.timeTaken % 60}s
                  </span>
                </div>
              </div>
            </div>

            {/* Answer Highlighting Legend */}
            <div className="bg-white rounded-xl p-4 shadow-card border border-institutional-border flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="font-bold text-gray-800">Answer Key & Highlighting Guide:</span>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-green-700 font-semibold">
                  <span className="w-4 h-4 rounded bg-green-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  Correct Answer
                </span>
                <span className="flex items-center gap-1.5 text-red-700 font-semibold">
                  <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">✗</span>
                  Student's Incorrect Selection
                </span>
                <span className="flex items-center gap-1.5 text-gray-600 font-semibold">
                  <span className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center text-[10px] font-bold">–</span>
                  Unattempted Question
                </span>
              </div>
            </div>

            {/* Question by Question Detailed Breakdown */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                QUESTION-BY-QUESTION DIAGNOSTIC BREAKDOWN ({selectedResult.questionWiseResult?.length || 0} Questions)
              </h2>

              {selectedResult.questionWiseResult?.map((item: QuestionResult, idx: number) => {
                const q = item.question;
                const studentAnswer = item.selectedOptionId;
                const correctAnswer = q.correctOptionId;
                const isCorrect = item.isCorrect;
                const isUnattempted = !studentAnswer;

                return (
                  <div
                    key={q.id || idx}
                    className={`bg-white rounded-xl p-5 md:p-6 shadow-card border transition-all ${
                      isCorrect
                        ? 'border-green-300 ring-1 ring-green-100'
                        : isUnattempted
                        ? 'border-gray-200'
                        : 'border-red-300 ring-1 ring-red-100'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-institutional-border mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                            isCorrect ? 'bg-green-600' : isUnattempted ? 'bg-gray-400' : 'bg-red-600'
                          }`}
                        >
                          Q{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-gray-600">
                          {q.subject} • {q.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock size={13} /> Time Taken: <strong>{item.timeTaken || 18} seconds</strong>
                        </span>

                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            isCorrect
                              ? 'bg-green-100 text-green-800'
                              : isUnattempted
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCorrect ? 'Result: Correct (+4)' : isUnattempted ? 'Result: Unattempted (0)' : 'Result: Incorrect (-1)'}
                        </span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-sm md:text-base font-semibold text-gray-900 mb-4 leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Options list with highlight rules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt) => {
                        const isOptionCorrect = opt.id === correctAnswer;
                        const isStudentSelection = opt.id === studentAnswer;

                        let cardStyle = 'border-gray-200 bg-white text-gray-800';
                        let badgeBg = 'bg-gray-100 text-gray-700';

                        if (isOptionCorrect) {
                          // Green indicator with tick icon
                          cardStyle = 'border-green-500 bg-green-50 text-green-900 font-bold ring-2 ring-green-300';
                          badgeBg = 'bg-green-600 text-white';
                        } else if (isStudentSelection && !isOptionCorrect) {
                          // Red indicator
                          cardStyle = 'border-red-500 bg-red-50 text-red-900 font-bold ring-2 ring-red-300';
                          badgeBg = 'bg-red-600 text-white';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3.5 rounded-xl border text-xs md:text-sm flex items-center justify-between gap-3 ${cardStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${badgeBg}`}>
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </div>

                            <div className="shrink-0">
                              {isOptionCorrect && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-extrabold bg-green-200/60 px-2 py-0.5 rounded">
                                  <Check size={13} /> Correct Answer
                                </span>
                              )}
                              {isStudentSelection && !isOptionCorrect && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-red-700 font-extrabold bg-red-200/60 px-2 py-0.5 rounded">
                                  <X size={13} /> Student Selected
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Diagnostic Summary row */}
                    <div className="pt-3 border-t border-institutional-border flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                      <div>
                        <span>Correct Answer: <strong className="text-green-700">{correctAnswer}</strong></span>
                        <span className="mx-2">•</span>
                        <span>
                          Student Selected:{' '}
                          <strong className={isCorrect ? 'text-green-700' : isUnattempted ? 'text-gray-500' : 'text-red-700'}>
                            {studentAnswer || 'None (Unattempted)'}
                          </strong>
                        </span>
                      </div>

                      <span className="text-[11px] text-gray-400">Difficulty: {q.difficulty || 'Medium'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Overview Academic Results Dashboard */
          <div className="space-y-6">
            {/* Top Page Header */}
            <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
                  >
                    <ChartNoAxesCombined size={22} />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      ACADEMIC RESULTS & EXAMINATION HISTORY
                    </h1>
                    <p className="text-xs text-gray-500">
                      Official score reports, subject-wise analytics, and question diagnostics
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{ background: '#FFE59A', color: '#500000' }}
              >
                <Sparkles size={14} /> ALL RECORDS MARKED AS DEMO DATA
              </div>
            </div>

            {/* TOP PERFORMANCE SECTION (PROMINENT RECENT EXAM) */}
            <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-institutional-border gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-crimson block">
                    Most Recent Examination Performance
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                    {recentExam.examName}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Category: <strong>{recentExam.category}</strong> • Attempted on {recentExam.date} • Total Duration: {Math.floor(recentExam.timeTaken / 60)} Mins
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetail(recentExam)}
                  className="px-5 py-2.5 rounded-full font-bold text-xs text-white shadow-md hover:opacity-90 transition flex items-center gap-1.5 self-start md:self-auto"
                  style={{ backgroundColor: '#A60000' }}
                >
                  View Detailed Result Breakdown <ChevronRight size={15} />
                </button>
              </div>

              {/* Grid of Key Score Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Marks</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">{recentExam.totalMarks}</span>
                </div>

                <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: '#FFFBEB', borderColor: '#FFE59A' }}>
                  <span className="text-[10px] font-bold uppercase text-amber-800">Marks Obtained</span>
                  <span className="text-2xl font-black mt-1 block" style={{ color: '#500000' }}>
                    {recentExam.marksObtained}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
                  <span className="text-[10px] font-bold text-green-700 uppercase">Percentage</span>
                  <span className="text-2xl font-black text-green-800 mt-1 block">{recentPercentage}%</span>
                </div>

                <div className="p-4 rounded-xl bg-green-50/60 border border-green-200 text-center">
                  <span className="text-[10px] font-bold text-green-700 uppercase">Correct</span>
                  <span className="text-2xl font-black text-green-700 mt-1 block">{recentExam.correctAnswers}</span>
                </div>

                <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-center">
                  <span className="text-[10px] font-bold text-red-700 uppercase">Incorrect</span>
                  <span className="text-2xl font-black text-red-700 mt-1 block">{recentExam.incorrectAnswers}</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Unattempted</span>
                  <span className="text-2xl font-black text-gray-700 mt-1 block">{recentExam.unattempted}</span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Time Taken</span>
                  <span className="text-xl font-black text-gray-800 mt-1 block">
                    {Math.floor(recentExam.timeTaken / 3600)}h {Math.floor((recentExam.timeTaken % 3600) / 60)}m
                  </span>
                </div>
              </div>

              {/* Charts Section: Subject Wise Breakdown (Physics, Chemistry, Math) & Accuracy Pie */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Subject Performance Bar Chart */}
                <div className="lg:col-span-2 p-5 rounded-xl border border-institutional-border bg-gray-50/50">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                    <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                      <BarChart2 size={16} className="text-crimson" />
                      Subject Performance: Physics, Chemistry & Mathematics
                    </h3>
                    <span className="text-xs text-gray-500">Benchmark: 100%</span>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectScoresData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#4B5563' }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4B5563' }} />
                        <Tooltip
                          formatter={(val) => [`${val}%`, 'Score']}
                          contentStyle={{ borderRadius: 8, borderColor: '#DEDEDE', fontSize: 12 }}
                        />
                        <Bar dataKey="percentage" fill="#650000" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Accuracy Distribution Pie Chart */}
                <div className="p-5 rounded-xl border border-institutional-border bg-gray-50/50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 pb-3 border-b border-gray-200 mb-2">
                      Answer Distribution
                    </h3>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-center text-[11px] pt-2 border-t border-gray-200">
                    <div>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block mr-1" />
                      <span className="text-gray-600">Correct: {recentExam.correctAnswers}</span>
                    </div>
                    <div>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block mr-1" />
                      <span className="text-gray-600">Wrong: {recentExam.incorrectAnswers}</span>
                    </div>
                    <div>
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block mr-1" />
                      <span className="text-gray-600">Left: {recentExam.unattempted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXAMINATION HISTORY LIST */}
            <div className="bg-white rounded-2xl shadow-card border border-institutional-border p-6 md:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-institutional-border gap-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">
                    EXAMINATION HISTORY & SCORE ARCHIVES
                  </h3>
                  <p className="text-xs text-gray-500">
                    All completed mock examinations, competitive test series, and VTU internal papers
                  </p>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-gray-500">Filter:</span>
                  {['All', 'JEE', 'NEET', 'CET', 'Theory'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full font-bold transition ${
                        selectedCategory === cat
                          ? 'bg-crimson text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b border-institutional-border">
                    <tr>
                      <th className="py-3 px-4">Examination Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Marks Obtained</th>
                      <th className="py-3 px-3">Percentage</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-institutional-border">
                    {filteredHistory.map((rec) => {
                      const pct = Math.round((rec.marksObtained / rec.totalMarks) * 1000) / 10;
                      return (
                        <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-900 block">{rec.examName}</span>
                            <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              DEMO DATA
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-gray-700 px-2 py-0.5 rounded bg-gray-100">
                              {rec.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">
                            {rec.date}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-gray-900">
                            {rec.marksObtained} <span className="text-gray-400 font-normal">/ {rec.totalMarks}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`font-black ${pct >= 70 ? 'text-green-700' : 'text-amber-700'}`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleViewDetail(rec)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-90 transition"
                              style={{ backgroundColor: '#A60000' }}
                            >
                              View Detailed Result
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

