import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Play, CheckCircle2, AlertCircle, BarChart3,
  Sliders, Award, Clock, HelpCircle, BookOpen, Layers,
  ChevronRight, Calendar, User, Zap, Sparkles, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { DEMO_MCQ_QUESTIONS } from '../../data';
import type { MCQQuestion } from '../../types';

export default function ExamsPage() {
  const navigate = useNavigate();
  const { exams, startExamSession, results } = usePortal();

  const [activeTab, setActiveTab] = useState<'live' | 'practice'>('live');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'JEE' | 'NEET' | 'CET' | 'Theory'>('ALL');

  // Practice Configuration Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configExamType, setConfigExamType] = useState('JEE');
  const [configSubject, setConfigSubject] = useState('Physics');
  const [configTopic, setConfigTopic] = useState('Full Syllabus');
  const [configNumQuestions, setConfigNumQuestions] = useState(10);
  const [configDifficulty, setConfigDifficulty] = useState('Mixed');

  // Practice Statistics
  const practiceStats = {
    totalAttempted: 14,
    avgScore: '72.4%',
    highestScore: '92.0%',
    accuracy: '78.6%',
    recentScore: '212 / 300 (JEE Mock 02)',
  };

  // Recharts Data for Subject Performance
  const subjectPerformanceData = [
    { subject: 'Physics', score: 74, total: 100, attempts: 5 },
    { subject: 'Chemistry', score: 68, total: 100, attempts: 4 },
    { subject: 'Mathematics', score: 82, total: 100, attempts: 5 },
  ];

  const radarData = [
    { subject: 'Mechanics', score: 85, fullMark: 100 },
    { subject: 'Electromagnetism', score: 70, fullMark: 100 },
    { subject: 'Organic Chem', score: 65, fullMark: 100 },
    { subject: 'Physical Chem', score: 78, fullMark: 100 },
    { subject: 'Calculus', score: 88, fullMark: 100 },
    { subject: 'Algebra', score: 75, fullMark: 100 },
  ];

  const handleStartExam = (examName: string, category: string, subject: string, durationMinutes: number) => {
    // Generate questions matching the subject/category or default set
    const questions: MCQQuestion[] = DEMO_MCQ_QUESTIONS.slice(0, 10);
    startExamSession({
      examName,
      category,
      subject,
      questions,
      durationMinutes,
    });
    navigate('/student/take-exam');
  };

  const handleStartCustomPractice = () => {
    setShowConfigModal(false);
    // Filter questions if possible or use demo pool
    let questionsPool = DEMO_MCQ_QUESTIONS;
    if (configSubject !== 'All') {
      const filtered = DEMO_MCQ_QUESTIONS.filter(q => q.subject.toLowerCase() === configSubject.toLowerCase());
      if (filtered.length > 0) questionsPool = filtered;
    }

    startExamSession({
      examName: `${configExamType} Practice Exam – ${configSubject} (${configTopic}) [DEMO]`,
      category: configExamType,
      subject: configSubject,
      questions: questionsPool.slice(0, configNumQuestions),
      durationMinutes: Math.max(10, configNumQuestions * 2),
    });
    navigate('/student/take-exam');
  };

  // Filter exams based on category
  const filteredExams = exams.filter(e => {
    if (selectedCategory === 'ALL') return true;
    return e.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <StudentNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
              >
                <ClipboardList size={22} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  EXAMINATION CELL & PRACTICE PORTAL
                </h1>
                <p className="text-xs text-gray-500">
                  Access institutional tests, VTU internals, and national competitive exam simulators
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-crimson text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap size={14} /> LIVE EXAMINATIONS
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-crimson text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sliders size={14} /> PRACTICE EXAMINATIONS
            </button>
          </div>
        </div>

        {/* TAB A: LIVE EXAMINATIONS */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Filter size={14} /> Filter:
                </span>
                {(['ALL', 'JEE', 'NEET', 'CET', 'Theory'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs rounded-full font-bold transition ${
                      selectedCategory === cat
                        ? 'bg-maroon-deep text-white'
                        : 'bg-white text-gray-700 border border-institutional-border hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div
                className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: '#FFE59A', color: '#500000' }}
              >
                <Sparkles size={14} /> All tests labeled [DEMO] are fully interactive
              </div>
            </div>

            {/* Live Exams Grid */}
            {filteredExams.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-institutional-border">
                <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-bold text-gray-700">No live examinations available right now.</h3>
                <p className="text-xs text-gray-500 mt-1">Check back later or explore the Practice Examinations tab.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-xl shadow-card border border-institutional-border p-5 flex flex-col justify-between hover:shadow-card-hover transition-all duration-200"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase"
                          style={{ backgroundColor: '#FFE59A', color: '#500000' }}
                        >
                          DEMO EXAMINATION
                        </span>
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                          AVAILABLE
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Subject: <strong className="text-gray-800">{exam.subject}</strong>
                      </p>

                      {/* Details Box */}
                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-lg bg-gray-50 text-xs text-gray-600 border border-gray-100">
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 block">Duration</span>
                          <span className="font-bold text-gray-800">{exam.duration} Minutes</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 block">Total Marks</span>
                          <span className="font-bold text-gray-800">{exam.totalMarks} Marks</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 block">Questions</span>
                          <span className="font-bold text-gray-800">{exam.totalQuestions} Questions</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 block">Category</span>
                          <span className="font-bold text-crimson">{exam.category}</span>
                        </div>
                      </div>

                      <div className="mt-3 text-[11px] text-gray-500 flex items-center gap-1.5">
                        <User size={13} className="text-gray-400" />
                        <span>Invigilator / Faculty: {exam.teacherName}</span>
                      </div>
                    </div>

                    {/* Start Button */}
                    <div className="mt-5 pt-3 border-t border-institutional-border">
                      <button
                        onClick={() => handleStartExam(exam.name, exam.category, exam.subject, exam.duration)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs text-white shadow-sm hover:opacity-90 transition-all active:scale-95"
                        style={{ backgroundColor: '#A60000' }}
                      >
                        <Play size={14} className="fill-current" />
                        Start Examination
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB B: PRACTICE EXAMINATIONS */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {/* Top Performance Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-card border border-institutional-border">
                <span className="text-[11px] font-bold uppercase text-gray-400 block">Practice Tests</span>
                <span className="text-2xl font-black text-gray-900 mt-1 block">{practiceStats.totalAttempted}</span>
                <span className="text-[11px] text-green-600 font-semibold mt-1 block">↑ 4 attempted this week</span>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-card border border-institutional-border">
                <span className="text-[11px] font-bold uppercase text-gray-400 block">Average Score</span>
                <span className="text-2xl font-black text-maroon-deep mt-1 block">{practiceStats.avgScore}</span>
                <span className="text-[11px] text-gray-500 mt-1 block">Across all categories</span>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-card border border-institutional-border">
                <span className="text-[11px] font-bold uppercase text-gray-400 block">Highest Score</span>
                <span className="text-2xl font-black text-green-700 mt-1 block">{practiceStats.highestScore}</span>
                <span className="text-[11px] text-gray-500 mt-1 block">In CET Mock Test 02</span>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-card border border-institutional-border">
                <span className="text-[11px] font-bold uppercase text-gray-400 block">Overall Accuracy</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">{practiceStats.accuracy}</span>
                <span className="text-[11px] text-gray-500 mt-1 block">78.6% correct attempts</span>
              </div>
            </div>

            {/* Launch Practice Config Button Banner */}
            <div
              className="rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-4"
              style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 70%, #A60000 100%)' }}
            >
              <div>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-2"
                  style={{ backgroundColor: '#FFE59A', color: '#500000' }}
                >
                  Custom Test Engine
                </span>
                <h2 className="text-xl md:text-2xl font-black">
                  Configure a Personalized Practice Examination
                </h2>
                <p className="text-xs md:text-sm text-white/80 mt-1">
                  Choose specific topics, question volume (10–50), difficulty level, and examination type.
                </p>
              </div>

              <button
                onClick={() => setShowConfigModal(true)}
                className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-institutional-black shadow-lg hover:brightness-105 transition active:scale-95 whitespace-nowrap"
                style={{ backgroundColor: '#E5BD55' }}
              >
                <Sliders size={18} />
                Configure & Start Practice
              </button>
            </div>

            {/* Subject Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart: Subject Score Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border">
                <div className="flex items-center justify-between pb-3 border-b border-institutional-border mb-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <BarChart3 size={18} className="text-crimson" />
                      Subject Performance Overview
                    </h3>
                    <p className="text-xs text-gray-500">Average percentage achieved in practice tests</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    P • C • M
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#4B5563' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4B5563' }} />
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'Score']}
                        contentStyle={{ borderRadius: 8, borderColor: '#DEDEDE', fontSize: 12 }}
                      />
                      <Bar dataKey="score" fill="#A60000" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-institutional-border text-center text-xs">
                  <div>
                    <span className="font-semibold text-gray-500 block">Physics</span>
                    <span className="font-extrabold text-gray-900 text-sm">74%</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 block">Chemistry</span>
                    <span className="font-extrabold text-gray-900 text-sm">68%</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 block">Mathematics</span>
                    <span className="font-extrabold text-gray-900 text-sm">82%</span>
                  </div>
                </div>
              </div>

              {/* Radar Chart: Topic-Wise Concept Strengths */}
              <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border">
                <div className="flex items-center justify-between pb-3 border-b border-institutional-border mb-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <Award size={18} className="text-crimson" />
                      Concept Proficiency Radar
                    </h3>
                    <p className="text-xs text-gray-500">Core engineering & competitive domains</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Diagnostic
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#4B5563' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Proficiency" dataKey="score" stroke="#650000" fill="#A60000" fillOpacity={0.4} />
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'Proficiency']}
                        contentStyle={{ borderRadius: 8, borderColor: '#DEDEDE', fontSize: 12 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-3 border-t border-institutional-border flex justify-between text-xs text-gray-500">
                  <span>Strongest: <strong>Calculus (88%)</strong></span>
                  <span>Focus Needed: <strong>Organic Chem (65%)</strong></span>
                </div>
              </div>
            </div>

            {/* Examination Categories Quick Start Cards */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-gray-900">
                SELECT EXAMINATION CATEGORY
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'JEE Main & Adv', code: 'JEE', questions: '90 MCQs', duration: '180 Mins', icon: Award, color: '#A60000' },
                  { title: 'NEET Medical', code: 'NEET', questions: '180 MCQs', duration: '200 Mins', icon: Award, color: '#650000' },
                  { title: 'KCET Engineering', code: 'CET', questions: '60 MCQs', duration: '80 Mins', icon: Award, color: '#080808' },
                  { title: 'Theory / VTU Internals', code: 'Theory', questions: '30 Questions', duration: '60 Mins', icon: BookOpen, color: '#343434' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.code}
                      className="bg-white rounded-xl p-5 shadow-card border border-institutional-border hover:border-gold transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: item.color }}>
                            <Icon size={20} />
                          </div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {item.code}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-gray-900">{item.title}</h4>
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                          <p>• Format: {item.questions}</p>
                          <p>• Standard Duration: {item.duration}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setConfigExamType(item.code);
                          setShowConfigModal(true);
                        }}
                        className="mt-4 w-full py-2 rounded-full font-bold text-xs text-white transition hover:opacity-90"
                        style={{ backgroundColor: '#A60000' }}
                      >
                        Start {item.code} Practice
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Practice Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-institutional-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-institutional-border">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-crimson" />
                <h3 className="font-bold text-lg text-gray-900">Configure Practice Examination</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Exam Type */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">1. Examination Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {['JEE', 'NEET', 'CET', 'Theory'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setConfigExamType(t)}
                      className={`py-2 rounded-lg font-bold border transition ${
                        configExamType === t
                          ? 'bg-crimson text-white border-crimson'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Subject */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">2. Subject</label>
                <select
                  value={configSubject}
                  onChange={(e) => setConfigSubject(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-crimson"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="All">All Subjects Combined</option>
                </select>
              </div>

              {/* 3. Topic Selection */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">3. Topic / Concept Scope</label>
                <select
                  value={configTopic}
                  onChange={(e) => setConfigTopic(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-crimson"
                >
                  <option value="Full Syllabus">Full Syllabus (Comprehensive)</option>
                  <option value="Mechanics & Laws of Motion">Mechanics & Laws of Motion</option>
                  <option value="Electrostatics & Current">Electrostatics & Current</option>
                  <option value="Calculus & Differential Equations">Calculus & Differential Equations</option>
                  <option value="Algebra & Matrices">Algebra & Matrices</option>
                  <option value="Organic Chemistry & Bonding">Organic Chemistry & Bonding</option>
                </select>
              </div>

              {/* 4. Number of Questions */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">4. Number of Questions</label>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 20, 30, 50].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setConfigNumQuestions(n)}
                      className={`py-2 rounded-lg font-bold border transition ${
                        configNumQuestions === n
                          ? 'bg-maroon-deep text-white border-maroon-deep'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setConfigNumQuestions(10)}
                    className="py-2 rounded-lg font-bold border bg-gray-50 text-gray-500 border-gray-200"
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* 5. Difficulty */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">5. Difficulty Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Easy', 'Medium', 'Hard', 'Mixed'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setConfigDifficulty(d)}
                      className={`py-2 rounded-lg font-bold border transition ${
                        configDifficulty === d
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-institutional-border flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 rounded-full font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartCustomPractice}
                className="flex-1 py-2.5 rounded-full font-bold text-xs text-white shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: '#A60000' }}
              >
                Start Practice Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

