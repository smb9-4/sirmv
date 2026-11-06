import React, { useState } from 'react';
import {
  HelpCircle, PlusCircle, CheckCircle2, Search, Filter,
  BookOpen, Award, Check
} from 'lucide-react';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { usePortal } from '../../context/PortalContext';
import type { MCQQuestion } from '../../types';

export default function ProfessorQuestionBank() {
  const { mcqQuestions, addMCQQuestion } = usePortal();

  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('Mechanics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState('A');
  const [successMsg, setSuccessMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) return;

    addMCQQuestion({
      questionNumber: mcqQuestions.length + 1,
      questionText: questionText.trim(),
      options: [
        { id: 'A', text: optA.trim() },
        { id: 'B', text: optB.trim() },
        { id: 'C', text: optC.trim() },
        { id: 'D', text: optD.trim() },
      ],
      correctOptionId: correctOption,
      subject,
      topic,
      difficulty,
      marks: 4,
      negativeMarks: 1,
    });

    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setSuccessMsg('MCQ question successfully added to institutional test pool!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredQuestions = mcqQuestions.filter(q => {
    if (!searchQuery.trim()) return true;
    return (
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-maroon-deep">
              <HelpCircle size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">
                PRACTICE QUESTION BANK REPOSITORY
              </h1>
              <p className="text-xs text-gray-500">
                Author & curate multiple-choice questions for competitive JEE, NEET, CET and internal quizzes
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
          {/* Question Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-2">
              Add New Question
            </h2>

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs bg-white outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Data Structures">Data Structures</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full border border-institutional-border rounded-lg p-2 text-xs bg-white outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Topic / Concept</label>
                <input
                  type="text"
                  placeholder="e.g. Thermodynamics / Binary Trees"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Question Text</label>
                <textarea
                  rows={3}
                  placeholder="Enter the complete question problem statement..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full border border-institutional-border rounded-lg p-2 text-xs outline-none"
                  required
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-700 uppercase">Answer Options</label>
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-gray-500">A</span>
                  <input
                    type="text"
                    placeholder="Option A text"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    className="flex-1 border border-institutional-border rounded p-1.5 text-xs outline-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-gray-500">B</span>
                  <input
                    type="text"
                    placeholder="Option B text"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    className="flex-1 border border-institutional-border rounded p-1.5 text-xs outline-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-gray-500">C</span>
                  <input
                    type="text"
                    placeholder="Option C text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    className="flex-1 border border-institutional-border rounded p-1.5 text-xs outline-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-gray-500">D</span>
                  <input
                    type="text"
                    placeholder="Option D text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    className="flex-1 border border-institutional-border rounded p-1.5 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Correct Answer</label>
                <div className="grid grid-cols-4 gap-2 text-center font-bold">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCorrectOption(opt)}
                      className={`py-1.5 rounded border transition ${
                        correctOption === opt ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      Option {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-full font-bold text-white text-xs shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: '#A60000' }}
              >
                Save Question to Bank
              </button>
            </form>
          </div>

          {/* Existing Questions Pool */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-institutional-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-base font-bold text-gray-900">
                Question Bank ({mcqQuestions.length} Questions)
              </h2>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-institutional-border rounded-lg px-3 py-1 text-xs outline-none"
              />
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-xl border border-institutional-border bg-gray-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-maroon-deep">
                      Q{idx + 1}. {q.subject} • {q.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700">
                      {q.difficulty}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-900">{q.questionText}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    {q.options.map(o => (
                      <div
                        key={o.id}
                        className={`p-1.5 rounded border ${
                          o.id === q.correctOptionId ? 'bg-green-50 border-green-300 text-green-900 font-bold' : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        {o.id}. {o.text} {o.id === q.correctOptionId && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

