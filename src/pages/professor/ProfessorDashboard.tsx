import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, ClipboardList, HelpCircle, BookOpen, FolderOpen,
  ChartNoAxesCombined, CalendarCheck, CalendarDays, MessageSquare,
  Users, PlusCircle, ArrowRight, CheckCircle2, Clock, Upload, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import ProfessorNav from '../../components/ProfessorNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { announcements, exams, notes, studyMaterials, complaints } = usePortal();
  const navigate = useNavigate();

  const prof = user && user.role === 'professor' ? user : null;

  const profCards = [
    { title: 'PUBLISH ANNOUNCEMENT', icon: Bell, path: '/professor/announcements', count: 'Circulars Desk', desc: 'Issue notices to students and departments.' },
    { title: 'LIVE EXAMINATIONS', icon: ClipboardList, path: '/professor/exams', count: `${exams.length} Scheduled`, desc: 'Create and publish live semester tests.' },
    { title: 'QUESTION BANK', icon: HelpCircle, path: '/professor/questions', count: 'MCQ Repository', desc: 'Add and categorize competitive MCQs.' },
    { title: 'NOTES UPLOAD', icon: BookOpen, path: '/professor/notes', count: `${notes.length} Uploaded`, desc: 'Upload lecture PDFs and unit slides.' },
    { title: 'MATERIALS UPLOAD', icon: FolderOpen, path: '/professor/materials', count: `${studyMaterials.length} Resources`, desc: 'Share videos, worksheets and references.' },
    { title: 'STUDENT RESULTS', icon: ChartNoAxesCombined, path: '/professor/results', count: 'Class Analytics', desc: 'Track class performance and student marks.' },
    { title: 'ATTENDANCE SYSTEM', icon: CalendarCheck, path: '/professor/attendance', count: 'Roll-Call Active', desc: 'Record daily student subject attendance.' },
    { title: 'FACULTY TIMETABLE', icon: CalendarDays, path: '/professor/timetable', count: 'Teaching Slots', desc: 'View your weekly lectures and lab slots.' },
    { title: 'STUDENT FEEDBACK', icon: MessageSquare, path: '/professor/feedback', count: `${complaints.length} Grievances`, desc: 'Review and resolve student grievances.' },
  ];

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <ProfessorNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 md:p-8 text-white shadow-card relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #222222 0%, #343434 60%, #500000 100%)' }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#FFE59A', color: '#500000' }}
              >
                Faculty Portal • Academic Year 2026–27
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Welcome, {prof?.name || 'Dr. Priya Nayak'}
              </h1>
              <p className="text-sm md:text-base text-white/85">
                {prof?.designation || 'Associate Professor'} • Department of {prof?.department || 'Computer Science Engineering'}
              </p>
              <p className="text-xs text-white/70">
                Assigned Subjects: <strong>{(prof as any)?.subjects ? (prof as any).subjects.join(', ') : 'Data Structures, Algorithms, Theory of Computation'}</strong>
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] uppercase tracking-wider text-white/70 block">Cohort Size</span>
                <span className="text-2xl font-black text-white mt-0.5 block">100</span>
                <span className="text-[10px] text-green-300 mt-0.5 block">50 Sec A • 50 Sec B</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] uppercase tracking-wider text-white/70 block">Average Attendance</span>
                <span className="text-2xl font-black text-gold-light mt-0.5 block" style={{ color: '#FFE59A' }}>84.2%</span>
                <span className="text-[10px] text-white/80 mt-0.5 block">Satisfactory</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-black/40 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] uppercase tracking-wider text-white/70 block">Pending Grievances</span>
                <span className="text-2xl font-black text-red-400 mt-0.5 block">{complaints.filter(c => c.status !== 'Resolved').length}</span>
                <span className="text-[10px] text-white/80 mt-0.5 block">Requires Action</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-institutional-black tracking-tight">
              FACULTY MANAGEMENT SECTIONS
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any section to manage tests, course notes, marks, and student logs
            </p>
          </div>
        </div>

        {/* 9 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(card.path)}
                className="group card cursor-pointer flex flex-col justify-between border border-institutional-border hover:border-crimson transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm"
                      style={{ backgroundColor: '#FFF0F0', color: '#650000' }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-800">
                      {card.count}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 group-hover:text-crimson transition-colors tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-institutional-border flex items-center justify-between text-xs font-bold text-crimson group-hover:text-maroon-deep transition-colors">
                  <span>Open Section</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

