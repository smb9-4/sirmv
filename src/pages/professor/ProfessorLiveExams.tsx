import React, { useState } from 'react';
import {
  ClipboardList, PlusCircle, CheckCircle2, Trash2, Calendar,
  Clock, Award, BookOpen, AlertCircle
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import { useAuth } from '../../context/AuthContext';
import type { Exam } from '../../types';

export default function ProfessorLiveExams() {
  const { exams, addExam } = usePortal();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(50);
  const [totalQuestions, setTotalQuestions] = useState(25);
  const [category, setCategory] = useState<'Theory' | 'JEE' | 'CET' | 'NEET'>('Theory');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addExam({
      name: `${name.trim()} [DEMO]`,
      subject,
      teacherName: user?.name || 'Dr. Priya Nayak',
      startDate,
      startTime,
      duration: Number(duration),
      totalMarks: Number(totalMarks),
      totalQuestions: Number(totalQuestions),
      status: 'upcoming',
      category,
    });

    setName('');
    setSuccessMsg('Live examination paper successfully scheduled and published!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <ClipboardList size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                LIVE EXAMINATIONS & PAPER SCHEDULER
              </h1>
              <p className="text-xs text-gray-500">
                Author new internal assessments, semester tests, and mock practice series
              </p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" /> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Exam Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Schedule New Examination
            </h2>

            <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures – Unit 4 Assessment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-crimson outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white outline-none"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Theory of Computation">Theory of Computation</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border border-institutional-border rounded-lg p-2.5 text-xs bg-white outline-none"
                >
                  <option value="Theory">VTU Theory Internal</option>
                  <option value="JEE">JEE Mock Series</option>
                  <option value="CET">CET Practice Exam</option>
                  <option value="NEET">NEET Mock Test</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Duration</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                    placeholder="Mins"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Questions</label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-full font-bold text-white text-xs shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: '#A60000' }}
              >
                Publish Live Exam
              </button>
            </form>
          </div>

          {/* Existing Exams */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Scheduled Live Examinations ({exams.length})
            </h2>

            <div className="space-y-3">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl border border-institutional-border bg-gray-50 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: '#FFE59A', color: '#500000' }}>
                        {ex.category}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">{ex.subject}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{ex.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: {ex.startDate} at {ex.startTime} • Duration: {ex.duration} Mins • Total: {ex.totalMarks} Marks ({ex.totalQuestions} Questions)
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 shrink-0">
                    Active on Portal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

