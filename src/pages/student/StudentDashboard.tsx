import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, ClipboardList, BookOpen, FolderOpen, ChartNoAxesCombined,
  CalendarDays, MessageSquare, CalendarCheck, AlertTriangle,
  Clock, CheckCircle, ArrowRight, BookMarked, UserCheck, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortal } from '../../context/PortalContext';
import StudentNav from '../../components/StudentNav';
import AnnouncementTicker from '../../components/AnnouncementTicker';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { announcements, subjectAttendance, timetable, results } = usePortal();
  const navigate = useNavigate();

  const student = user && user.role === 'student' ? user : null;

  // Calculate overall attendance
  const totalClasses = subjectAttendance.reduce((acc, s) => acc + s.totalClasses, 0);
  const attendedClasses = subjectAttendance.reduce((acc, s) => acc + s.attendedClasses, 0);
  const overallAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 86.4;

  // Unread announcements
  const unreadAnnouncements = announcements.filter(a => !a.isRead);
  const urgentAnnouncements = announcements.filter(a => a.isUrgent);

  // Latest result
  const latestResult = results[0];

  const dashboardCards = [
    {
      id: 'announcements',
      title: 'ANNOUNCEMENTS',
      iconSrc: '/student-section-icons/announcements.png',
      desc: 'Official circulars and notices from Principal, HOD, and faculty.',
      count: unreadAnnouncements.length > 0 ? `${unreadAnnouncements.length} unread` : 'All read',
      path: '/student/announcements',
      badgeColor: '#FFE59A',
      textColor: '#500000',
    },
    {
      id: 'exams',
      title: 'EXAMS',
      iconSrc: '/student-section-icons/exams.png',
      desc: 'Live college examinations & competitive practice mock tests.',
      count: '3 Available',
      path: '/student/exams',
      badgeColor: '#E5BD55',
      textColor: '#500000',
    },
    {
      id: 'notes',
      title: 'NOTES',
      iconSrc: '/student-section-icons/notes.png',
      desc: 'Subject lecture notes, unit-wise documents & lecture slides.',
      count: '8 Documents',
      path: '/student/notes',
      badgeColor: '#F3F3F3',
      textColor: '#343434',
    },
    {
      id: 'materials',
      title: 'STUDY MATERIALS',
      iconSrc: '/student-section-icons/materials.png',
      desc: 'Video lectures, worksheets, and competitive exam resources.',
      count: '8 Resources',
      path: '/student/materials',
      badgeColor: '#F3F3F3',
      textColor: '#343434',
    },
    {
      id: 'results',
      title: 'RESULTS',
      iconSrc: '/student-section-icons/results.png',
      desc: 'Performance analytics, scores, and question-by-question review.',
      count: '8 Test Records',
      path: '/student/results',
      badgeColor: '#FFE59A',
      textColor: '#500000',
    },
    {
      id: 'timetable',
      title: 'TIMETABLE',
      iconSrc: '/student-section-icons/timetable.png',
      desc: 'Daily lectures, practical periods, and subject schedule.',
      count: 'Weekly Schedule',
      path: '/student/timetable',
      badgeColor: '#F3F3F3',
      textColor: '#343434',
    },
    {
      id: 'calendar',
      title: 'CALENDAR',
      iconSrc: '/student-section-icons/timetable.png',
      desc: 'Monthly JEE, NEET, and theory exam schedule.',
      count: 'Weekly Exams',
      path: '/student/calendar',
      badgeColor: '#F3F3F3',
      textColor: '#343434',
    },
    {
      id: 'complaints',
      title: 'COMPLAINT BOX',
      iconSrc: '/student-section-icons/complaints.png',
      desc: 'Submit grievances for academics, lab facilities, or infrastructure.',
      count: '2 Submitted',
      path: '/student/complaints',
      badgeColor: '#F3F3F3',
      textColor: '#343434',
    },
    {
      id: 'attendance',
      title: 'ATTENDANCE',
      iconSrc: '/student-section-icons/attendance.png',
      desc: 'Subject-wise class attendance, warning metrics & monthly logs.',
      count: `${overallAttendance}% Overall`,
      path: '/student/attendance',
      badgeColor: overallAttendance >= 75 ? '#DCFCE7' : '#FEE2E2',
      textColor: overallAttendance >= 75 ? '#166534' : '#991B1B',
    },
  ];

  // Today's classes (Monday schedule for demo)
  const todayClasses = timetable.filter(t => t.day === 'Monday');

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <StudentNav />
      <AnnouncementTicker />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full flex-1 space-y-6">
        {/* Welcome Section */}
        <div
          className="rounded-2xl p-6 md:p-8 text-white shadow-card relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #500000 0%, #650000 65%, #A60000 100%)',
          }}
        >
          {/* Decorative crest background */}
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <img src="/logo.png?v=3" alt="" className="w-80 h-80 object-contain" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#FFE59A', color: '#500000' }}
              >
                <Sparkles size={14} /> Academic Year 2026–27 • Odd Semester
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Welcome back, {student?.name || 'Rahul Sharma'}!
              </h1>
              <p className="text-sm md:text-base text-white/85">
                Roll No: <strong className="text-white">{student?.rollNumber || '23CSE001'}</strong> • Department of {student?.department || 'Computer Science Engineering'}
              </p>
              <p className="text-xs text-white/70">
                Class: <strong>5th Semester • Section A</strong> • Academic Advisor: Dr. Priya Nayak
              </p>
            </div>

            {/* Quick Metrics Cards Inside Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Semester Card */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] uppercase tracking-wider text-white/70 block">Current Sem</span>
                <span className="text-2xl font-black text-white mt-0.5 block">5th</span>
                <span className="text-[10px] text-gold-light mt-0.5 block">CSE Branch</span>
              </div>

              {/* Attendance Card */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] uppercase tracking-wider text-white/70 block">Attendance</span>
                <span className="text-2xl font-black block mt-0.5" style={{ color: overallAttendance >= 75 ? '#86EFAC' : '#FCA5A5' }}>
                  {overallAttendance}%
                </span>
                <span className="text-[10px] text-white/80 mt-0.5 block">
                  {overallAttendance >= 75 ? 'Above 75% Safe' : 'Warning: Low'}
                </span>
              </div>

              {/* Recent Exam Card */}
              <div className="col-span-2 sm:col-span-1 bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] uppercase tracking-wider text-white/70 block">Cohort Rank</span>
                <span className="text-2xl font-black text-gold-light block mt-0.5" style={{ color: '#FFE59A' }}>
                  #16 <span className="text-xs text-white/70 font-normal">/ 100</span>
                </span>
                <span className="text-[10px] text-white/80 mt-0.5 block">Top 16% • 212/300</span>
              </div>
            </div>
          </div>

          {/* Pending Alerts Strip */}
          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-gold-light" style={{ color: '#FFE59A' }}>
              <Clock size={15} /> Pending Academic Deadlines:
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md text-white/90">
              • Python Lab Record Submission: <strong>Tomorrow, 2:00 PM</strong>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md text-white/90">
              • IA-2 Internal Assessment: <strong>Starts Nov 18, 2026</strong>
            </span>
          </div>
        </div>

        {/* Urgent Announcement Alert if any */}
        {urgentAnnouncements.length > 0 && (
          <div
            className="rounded-xl p-4 flex items-start justify-between gap-4 border"
            style={{ backgroundColor: '#FFF5F5', borderColor: '#F37F84' }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                  Urgent Institutional Notice: {urgentAnnouncements[0].title}
                </span>
                <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                  {urgentAnnouncements[0].message}
                </p>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Issued by: {urgentAnnouncements[0].senderName} ({urgentAnnouncements[0].designation})
                </span>
              </div>
            </div>
            <Link
              to="/student/announcements"
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-90 transition whitespace-nowrap"
              style={{ backgroundColor: '#A60000' }}
            >
              Read Full Notice
            </Link>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-institutional-black tracking-tight">
              ACADEMIC MODULES
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any institutional portal card below to manage your academics
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-700">
            8 Active Modules
          </span>
        </div>

        {/* The 8 Main Dashboard Cards - Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dashboardCards.map((card) => {
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="group card cursor-pointer flex flex-col justify-between border border-institutional-border hover:border-gold transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle top indicator bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-200 group-hover:h-1.5"
                  style={{ backgroundColor: '#A60000' }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <img src={card.iconSrc} alt="" className="w-full h-full object-contain" />
                    </div>

                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-black/5"
                      style={{ backgroundColor: card.badgeColor, color: card.textColor }}
                    >
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

                <div className="absolute inset-x-0 bottom-0 flex h-11 translate-y-full items-center justify-center gap-2 bg-[#A60000] text-xs font-bold text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span>Click to Open</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Lower Row: Today's Schedule & Quick Academic Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Today's Classes preview */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-card border border-institutional-border">
            <div className="flex items-center justify-between pb-3 border-b border-institutional-border mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <CalendarDays size={18} className="text-crimson" />
                  Today's Schedule (Monday)
                </h3>
                <p className="text-xs text-gray-500">5th Semester Computer Science • Section A</p>
              </div>
              <Link to="/student/timetable" className="text-xs font-bold text-crimson hover:underline">
                Full Week →
              </Link>
            </div>

            <div className="space-y-2.5">
              {todayClasses.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-center justify-between text-xs border ${
                    item.type === 'lab'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: item.type === 'lab' ? '#FFE59A' : '#E5BD55', color: '#500000' }}
                    >
                      {item.period}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.subject}</h4>
                      <p className="text-[11px] text-gray-500">
                        Faculty: {item.teacherName} • Room: {item.room}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-700 block">{item.time}</span>
                    <span className="text-[10px] uppercase font-semibold text-gray-400">
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Attendance Summary Meter */}
          <div className="bg-white rounded-xl p-6 shadow-card border border-institutional-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-institutional-border mb-4">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <UserCheck size={18} className="text-crimson" />
                  Attendance Status
                </h3>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: overallAttendance >= 75 ? '#DCFCE7' : '#FEE2E2',
                    color: overallAttendance >= 75 ? '#166534' : '#991B1B'
                  }}
                >
                  {overallAttendance >= 75 ? 'Safe' : 'Warning'}
                </span>
              </div>

              <div className="text-center py-3">
                <div className="text-4xl font-extrabold" style={{ color: '#650000' }}>
                  {overallAttendance}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {attendedClasses} attended of {totalClasses} conducted
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${overallAttendance}%`,
                      backgroundColor: overallAttendance >= 75 ? '#166534' : '#DC2626'
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>0%</span>
                  <span className="font-bold text-red-600">75% Min Required</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2 mt-2 pt-3 border-t border-institutional-border text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Theory of Computation</span>
                  <span className="font-bold text-red-600">73.6% (Low)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Computer Networks</span>
                  <span className="font-bold text-red-600">61.1% (Low)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Data Structures</span>
                  <span className="font-bold text-green-700">90.4% (Good)</span>
                </div>
              </div>
            </div>

            <Link
              to="/student/attendance"
              className="mt-4 block text-center py-2 px-4 rounded-lg font-bold text-xs text-white"
              style={{ backgroundColor: '#650000' }}
            >
              View Full Attendance Record
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

