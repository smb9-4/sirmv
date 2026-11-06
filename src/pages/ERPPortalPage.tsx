import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ERPSidebar from '../components/ERPSidebar';
import { ADMIN_NAV_SECTIONS, ERPModuleId, SIDEBAR_MENU_ITEMS } from '../components/erpNavConfig';
import ERPHeader, { UserRoleType, ROLE_PROFILES } from '../components/ERPHeader';
import StudentDetailModal from '../components/StudentDetailModal';
import ExamMCQReviewModal from '../components/ExamMCQReviewModal';
import AdminModuleView from '../components/AdminModuleView';
import AnimatedCounter from '../components/AnimatedCounter';
import SignatureAcademicLoader from '../components/SignatureAcademicLoader';
import PageTransition from '../components/PageTransition';
import ExpandableDashboardCard, { DashboardCardConfig } from '../components/ExpandableDashboardCard';
import { STUDENTS_100_ROSTER, StudentAnalysisRecord, PROFESSOR_1, PROFESSOR_2 } from '../rosterData';
import {
  IconStaffs, IconStudents, IconClasses, IconBatches, IconTests,
  IconBoardMarks, IconQuestions, IconReports, IconAttendance,
  IconTimetable, IconTimetableGenerator, IconExamManagement,
  IconLiveClass, IconSMS, IconNoticeboard, IconCounsellings,
  IconCollegeCalendar, IconStudentDiscipline, IconReportedIssues,
  IconHostel, IconGatePass
} from '../components/AppleIcons';
import {
  IconVNavDashboard, IconVNavStudents, IconVNavClasses, IconVNavBatches,
  IconVNavTests, IconVNavQuestions, IconVNavReports, IconVNavLeaderboard,
  IconVNavAnnouncements, IconVNavNotes, IconVNavMaterials, IconVNavTimetable,
  IconVNavAttendance, IconVNavComplaints, IconVNavSettings,
} from '../components/VerticalNavIcons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  PUC_ANNOUNCEMENTS,
  MOCK_EXAM_RESULTS,
  PUC_TOPICS_BY_SUBJECT,
  PUCSubject,
  PUCYear,
  ExamCategory,
  PastExamRecord,
  PUCAnnouncement,
} from '../pucAcademicData';
import {
  Search, Filter, Download, ArrowLeft, CheckCircle2, User, Phone,
  Mail, Calendar, Clock, Award, ShieldAlert, Sparkles, BookOpen,
  Bell, ClipboardList, FolderOpen, ChartNoAxesCombined, CalendarDays,
  MessageSquare, CalendarCheck, Check, Send, RotateCcw, Play, Eye, ArrowRight, Menu
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

const ADMIN_SECTION_DESCRIPTIONS: Record<string, string> = {
  device_admin: 'All devices, battery health, student mapping, inventory, connectivity and diagnostics.',
  exam_control: 'Monitor live exams, manage time, track submissions and review incidents.',
  student_activity: 'Application usage analytics, managed browser logs and tab activity monitoring.',
  security_remote: 'Remotely lock tablets, deploy apps, push OS updates and review audit logs.',
  reports_intelligence: 'Institution-wide reports, student history, maintenance and system configuration.',
};

const ADMIN_ITEM_BADGES: Partial<Record<ERPModuleId, string>> = {
  adm_all_devices: '100',
  adm_battery_health: '7 ⚠',
  adm_connectivity: '6 ✕',
  adm_submissions: '14',
  adm_exam_incidents: '9',
  adm_app_usage: '3 ⚠',
  adm_browser_activity: '23 ✕',
  adm_remote_lock: '1 🔒',
  adm_os_updates: '9',
  adm_student_reports: '100',
  adm_maintenance: '4 ⚠',
  adm_notifications: '7',
};

const ADMIN_ITEM_DESCRIPTIONS: Partial<Record<ERPModuleId, string>> = {
  adm_all_devices: 'Monitor every registered student tablet.',
  adm_battery_health: 'Review charge levels and battery status.',
  adm_student_mapping: 'Match students with assigned tablets.',
  adm_device_inventory: 'Track tablet assets and warranty.',
  adm_serial_specs: 'Review device identifiers and hardware details.',
  adm_connectivity: 'Check network status and signal strength.',
  adm_device_health: 'Review tablet performance and diagnostics.',
  adm_live_monitoring: 'Watch active exams as they happen.',
  adm_time_management: 'Manage exam timers and extensions.',
  adm_submissions: 'Track submitted and pending responses.',
  adm_exam_incidents: 'Review technical issues during exams.',
  adm_app_usage: 'Analyze app activity across devices.',
  adm_browser_activity: 'Review browsing and blocked-site events.',
  adm_tab_activity: 'Monitor browser tab switching events.',
  adm_remote_lock: 'Lock compromised tablets remotely.',
  adm_app_deployment: 'Install approved apps across tablets.',
  adm_os_updates: 'Manage operating system updates.',
  adm_audit_logs: 'Review administrative actions and history.',
  adm_overall_reports: 'View institution-wide system summaries.',
  adm_student_reports: 'Review individual student records.',
  adm_maintenance: 'Track service and repair requests.',
  adm_notifications: 'Manage alerts and system messages.',
  adm_configuration: 'Adjust device and platform settings.',
};

interface ERPPortalPageProps {
  initialRole?: UserRoleType;
  initialModule?: ERPModuleId;
}

export default function ERPPortalPage({ initialRole, initialModule }: ERPPortalPageProps = {}) {
  const location = useLocation();

  // If path starts with /student, default to student; otherwise default to Admin / Tab Management!
  const getInitialRole = (): UserRoleType => {
    if (initialRole) return initialRole;
    if (location.pathname.startsWith('/student')) return 'student';
    return 'admin';
  };

  const getInitialModule = (): ERPModuleId => {
    if (initialModule) return initialModule;
    if (location.pathname.includes('/announcements')) return 'announcements';
    if (location.pathname.includes('/exams') || location.pathname.includes('/take-exam')) return 'tests';
    if (location.pathname.includes('/results')) return 'reports';
    if (location.pathname.includes('/notes')) return 'notes';
    if (location.pathname.includes('/materials')) return 'materials';
    if (location.pathname.includes('/timetable')) return 'timetable';
    if (location.pathname.includes('/attendance')) return 'attendance';
    if (location.pathname.includes('/complaints')) return 'complaints';
    return 'dashboard';
  };

  // REQUIREMENT: Currently when I open the website, it should default open with PRINCIPAL page
  const [currentRole, setCurrentRole] = useState<UserRoleType>(getInitialRole);
  const [activeModule, setActiveModule] = useState<ERPModuleId>(getInitialModule);
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalysisRecord | null>(null);

  // Signature Academic Loader state
  const [showLoader, setShowLoader] = useState(true);

  // Student portal active card expansion state (only currently hovered/tapped card expands)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Filter & Search states for 100 Students module
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSectionFilter, setStudentSectionFilter] = useState<'All' | 'A' | 'B' | 'AtRisk'>('All');
  const [studentPage, setStudentPage] = useState(1);
  const pageSize = 20;

  // Interactive mock testing and complaint states
  const [selectedQuestionAnswer, setSelectedQuestionAnswer] = useState<Record<number, string>>({});
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [newComplaintText, setNewComplaintText] = useState('');
  const [newComplaintCategory, setNewComplaintCategory] = useState('Academic');

  // PUC Academic Stream State (I PU / II PU)
  const [pucYear, setPucYear] = useState<PUCYear>('II PU');

  // Announcements Category & Subject Filters
  const [announcementCategoryFilter, setAnnouncementCategoryFilter] = useState<'All' | 'Principal' | 'HOD' | 'Teacher'>('All');
  const [announcementSubjectFilter, setAnnouncementSubjectFilter] = useState<string>('All');

  // Exams View Mode (Live vs Practice)
  const [examViewMode, setExamViewMode] = useState<'live' | 'practice'>('live');

  // Custom Practice Generator Form State
  const [practiceTrack, setPracticeTrack] = useState<ExamCategory>('JEE');
  const [practiceSubject, setPracticeSubject] = useState<PUCSubject>('Physics');
  const [practiceTopic, setPracticeTopic] = useState<string>('Electrostatics & Gauss Law');
  const [practiceQCount, setPracticeQCount] = useState<number>(25);
  const [practiceDifficulty, setPracticeDifficulty] = useState<'Foundation' | 'Moderate' | 'Advanced'>('Moderate');
  const [practiceSessionActive, setPracticeSessionActive] = useState<boolean>(false);
  const [practiceActiveQIndex, setPracticeActiveQIndex] = useState<number>(0);
  const [practiceSelectedAnswers, setPracticeSelectedAnswers] = useState<Record<number, string>>({});

  // Deep Diagnostic Results Review Modal State
  const [reviewExamModal, setReviewExamModal] = useState<PastExamRecord | null>(null);

  // Collapsible Sidebar State (3 Horizontal Lines)
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [activeAdminSectionId, setActiveAdminSectionId] = useState<string | null>(null);

  // Portal Context
  const { announcements, exams, results, notes, studyMaterials, complaints, subjectAttendance } = usePortal();

  const activeProfile = ROLE_PROFILES[currentRole === 'student' ? 'student' : 'admin'];
  const activeAdminSection = ADMIN_NAV_SECTIONS.find((section) => section.sectionId === activeAdminSectionId);

  // Trigger brief academic loader when switching roles
  const handleRoleChange = (newRole: UserRoleType) => {
    setShowLoader(true);
    setCurrentRole(newRole);
    setActiveModule('dashboard');
    setExpandedCardId(null);
    setActiveAdminSectionId(null);
  };

  // 24 Workspace Modules definition for Principal/Admin/Teacher view
  const WORKSPACE_MODULES: { id: ERPModuleId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'staffs', label: 'Staffs', icon: IconStaffs },
    { id: 'students', label: 'Students', icon: IconStudents },
    { id: 'classes', label: 'Classes', icon: IconClasses },
    { id: 'batches', label: 'Batches', icon: IconBatches },
    { id: 'tests', label: 'Tests', icon: IconTests },
    { id: 'board_marks', label: 'Board Marks', icon: IconBoardMarks },
    { id: 'questions', label: 'Questions', icon: IconQuestions },
    { id: 'reports', label: 'Reports', icon: IconReports },
    { id: 'attendance', label: 'Attendance', icon: IconAttendance },
    { id: 'timetable', label: 'Timetable', icon: IconTimetable },
    { id: 'timetable_generator', label: 'Timetable Generator', icon: IconTimetableGenerator },
    { id: 'exam_management', label: 'Exam Management', icon: IconExamManagement },
    { id: 'live_class', label: 'Live Class', icon: IconLiveClass },
    { id: 'sms', label: 'Sms', icon: IconSMS },
    { id: 'noticeboard', label: 'Noticeboard', icon: IconNoticeboard },
    { id: 'counsellings', label: 'Counsellings', icon: IconCounsellings },
    { id: 'college_calendar', label: 'College Calendar', icon: IconCollegeCalendar },
    { id: 'student_discipline', label: 'Student Discipline', icon: IconStudentDiscipline },
    { id: 'reported_issues', label: 'Reported Issues', icon: IconReportedIssues },
    { id: 'hostel', label: 'Hostel', icon: IconHostel },
    { id: 'gate_pass', label: 'Gate Pass', icon: IconGatePass },
    { id: 'dashboard', label: 'Batch Analytics', icon: IconReports },
    { id: 'tests', label: 'Practice Mocks', icon: IconTests },
    { id: 'board_marks', label: 'Certificates & Ranks', icon: IconBoardMarks },
  ];

  // 8 Interactive Student Dashboard Cards configuration with hover expansion previews
  const STUDENT_DASHBOARD_CARDS: DashboardCardConfig[] = [
    {
      id: 'announcements',
      title: 'ANNOUNCEMENTS',
      icon: Bell,
      desc: 'Official circulars from Principal, HOD, and faculty.',
      count: '3 New Notices',
      badgeBg: '#FFE59A',
      badgeColor: '#650000',
      previews: [
        { label: 'Unread Circulars', value: '3 notices pending review', highlight: true },
        { label: 'Latest from HOD', value: 'Unit 4 Study Notes Released' },
        { label: 'Principal Notice', value: 'IA-2 Exam Schedule Commencing Nov 18' },
        { label: 'Last Updated', value: '2 hours ago' },
      ],
      actionLabel: 'Open Announcements Feed',
      onAction: () => setActiveModule('noticeboard'),
    },
    {
      id: 'exams',
      title: 'EXAMS',
      icon: ClipboardList,
      desc: 'Live examinations & competitive mock test series.',
      count: '3 Available',
      badgeBg: '#E5BD55',
      badgeColor: '#500000',
      previews: [
        { label: 'Live Assessment', value: 'JEE Mock Test Series 03 [DEMO]', highlight: true },
        { label: 'Recent Score', value: '212 / 300 Marks (70.7%)' },
        { label: 'Next Scheduled', value: 'Nov 18, 2026 (Internal IA-2)' },
        { label: 'Cohort Rank', value: '#16 of 100 students' },
      ],
      actionLabel: 'Launch Examination Center',
      onAction: () => setActiveModule('tests'),
    },
    {
      id: 'notes',
      title: 'NOTES',
      icon: BookOpen,
      desc: 'Curated subject notes, chapter slides & PDF guides.',
      count: '8 Documents',
      badgeBg: '#FFFFFF',
      badgeColor: '#343434',
      previews: [
        { label: 'Latest Upload', value: 'Data Structures Unit 4: Trees', highlight: true },
        { label: 'Uploaded by', value: 'Dr. Priya Nayak (Assoc. Prof)' },
        { label: 'Available Subjects', value: 'Physics, Chem, Math, DS, OS, TOC' },
        { label: 'Format', value: 'Verified Official PDF with Letterhead' },
      ],
      actionLabel: 'Browse & Download Notes',
      onAction: () => setActiveModule('board_marks'),
    },
    {
      id: 'materials',
      title: 'STUDY MATERIALS',
      icon: FolderOpen,
      desc: 'Videos, worksheets, question banks & prep kits.',
      count: '14 Resources',
      badgeBg: '#FFFFFF',
      badgeColor: '#343434',
      previews: [
        { label: 'Featured Series', value: 'JEE Adv Physics Full Course (42 hrs)', highlight: true },
        { label: 'Resource Types', value: 'Video Lectures, PPTs, Worksheets' },
        { label: 'Exam Tracks', value: 'JEE Main, KCET, NEET, VTU' },
        { label: 'Interactive Player', value: 'Available with full resolution' },
      ],
      actionLabel: 'Explore Learning Resources',
      onAction: () => setActiveModule('classes'),
    },
    {
      id: 'results',
      title: 'RESULTS',
      icon: ChartNoAxesCombined,
      desc: 'Performance analytics, scores & question-by-question review.',
      count: '70.7% Recent',
      badgeBg: '#FFE59A',
      badgeColor: '#650000',
      previews: [
        { label: 'Latest Exam', value: 'JEE Mock Test 02: 212 / 300', highlight: true },
        { label: 'Accuracy', value: '58 Correct • 14 Incorrect • 18 Left' },
        { label: 'Subject Means', value: 'Math (82%), Physics (74%), Chem (68%)' },
        { label: 'Detailed Review', value: 'All 90 MCQs with green/red answer keys' },
      ],
      actionLabel: 'View Detailed Diagnostic Scorecard',
      onAction: () => setActiveModule('reports'),
    },
    {
      id: 'timetable',
      title: 'TIMETABLE / CALENDAR',
      icon: CalendarDays,
      desc: 'Daily lecture schedule, lab slots, and event dates.',
      count: '5th Sem Schedule',
      badgeBg: '#FFFFFF',
      badgeColor: '#343434',
      previews: [
        { label: "Today's Schedule", value: '4 Lectures + 3-Hour Lab Slot', highlight: true },
        { label: 'Current Session', value: 'Period 2: Algorithms in Room 301' },
        { label: 'Afternoon Slot', value: 'Python Lab (Lab 2) at 02:00 PM' },
        { label: 'Upcoming Event', value: 'Annual Day Celebration (Nov 20)' },
      ],
      actionLabel: 'Open Weekly Timetable',
      onAction: () => setActiveModule('timetable'),
    },
    {
      id: 'complaints',
      title: 'COMPLAINT BOX',
      icon: MessageSquare,
      desc: 'Grievance redressal cell for academic & facility issues.',
      count: '1 Active Case',
      badgeBg: '#FFFFFF',
      badgeColor: '#343434',
      previews: [
        { label: 'Active Reference', value: 'SIR-MV-2026-0062 (Under Review)', highlight: true },
        { label: 'Category', value: 'Classroom Infrastructure (Room 204)' },
        { label: 'Closed Cases', value: '1 Resolved (Electronics Lab)' },
        { label: 'Service Level', value: 'Reviewed within 48 business hours' },
      ],
      actionLabel: 'Lodge or Track Grievance',
      onAction: () => setActiveModule('reported_issues'),
    },
    {
      id: 'attendance',
      title: 'ATTENDANCE',
      icon: CalendarCheck,
      desc: 'Subject-wise class attendance, logs & warning metrics.',
      count: '86.4% Safe',
      badgeBg: '#DCFCE7',
      badgeColor: '#166534',
      previews: [
        { label: 'Cohort Rate', value: '238 Attended of 276 Conducted', highlight: true },
        { label: 'Statutory Status', value: 'Above 75% VTU Minimum (Eligible)' },
        { label: 'At-Risk Subjects', value: 'Theory of Computation (73.6%)' },
        { label: 'Monthly Register', value: 'Complete daily log for Oct & Nov' },
      ],
      actionLabel: 'Check Attendance Log',
      onAction: () => setActiveModule('attendance'),
    },
  ];

  // 100 Students filtering
  const filteredStudents = STUDENTS_100_ROSTER.filter(s => {
    if (studentSectionFilter === 'A' && s.section !== 'A') return false;
    if (studentSectionFilter === 'B' && s.section !== 'B') return false;
    if (studentSectionFilter === 'AtRisk' && s.status === 'Passed' && s.attendancePercentage >= 75) return false;

    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * pageSize, studentPage * pageSize);

  // Distribution chart data
  const reportDistData = [
    { band: '≥ 80%', count: 18, fill: '#16A34A' },
    { band: '70–79%', count: 24, fill: '#650000' },
    { band: '60–69%', count: 32, fill: '#A60000' },
    { band: '50–59%', count: 16, fill: '#E5BD55' },
    { band: '< 50%', count: 10, fill: '#DC2626' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col font-sans text-stone-900 select-none">
      {/* 2. SIGNATURE ACADEMIC LOADER (Pencil and Ruler orbiting in opposite directions) */}
      <AnimatePresence>
        {showLoader && (
          <SignatureAcademicLoader
            minDuration={1600}
            onComplete={() => setShowLoader(false)}
          />
        )}
      </AnimatePresence>

      {/* Top Header with Role Switcher */}
      <ERPHeader currentRole={currentRole} onRoleChange={handleRoleChange} />

      {/* Main Layout: Sidebar + Dynamic Animated Content */}
      <div className="flex flex-1">
        {/* Left ERP Sidebar */}
        <ERPSidebar
          activeModule={activeModule}
          onSelectModule={(moduleId) => {
            setActiveModule(moduleId);
            if (moduleId === 'dashboard') setActiveAdminSectionId(null);
          }}
          onSelectAdminSection={(sectionId) => {
            setActiveModule('dashboard');
            setActiveAdminSectionId(sectionId);
          }}
          currentRole={currentRole}
          isExpanded={sidebarExpanded}
          activeAdminSectionId={activeAdminSectionId}
        />

        <div className="min-w-0 flex-1">
          <div className="flex h-12 shrink-0 items-center px-6 md:px-8">
            <button
              type="button"
              onClick={() => setSidebarExpanded((prev) => !prev)}
              aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
              className="-ml-[15px] flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-[#FFE59A] hover:text-[#650000]"
            >
              <Menu size={19} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Right Content Area with Smooth Horizontal Slide Transitions */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
            <AnimatePresence mode="wait">
              <PageTransition pageKey={`${currentRole}_${activeModule}_${activeAdminSectionId ?? ''}`}>
              {/* ─────────────────────────────────────────────────────────────
                  ROLE = STUDENT VIEW: 8 INTERACTIVE EXPANDABLE CARDS
                  ───────────────────────────────────────────────────────────── */}
              {currentRole === 'student' && activeModule === 'dashboard' && (
                <div className="space-y-6">
                  {/* Student Welcome Banner */}
                  <div
                    className="rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #500000 0%, #650000 65%, #A60000 100%)',
                    }}
                  >
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <div
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: '#FFE59A', color: '#500000' }}
                          >
                            <Sparkles size={14} /> Sir MV Pre-University College • Academic Portal
                          </div>

                          {/* I PU / II PU Toggle */}
                          <div className="inline-flex items-center bg-black/40 rounded-full p-0.5 border border-white/20">
                            {(['I PU', 'II PU'] as const).map(yr => (
                              <button
                                key={yr}
                                onClick={() => setPucYear(yr)}
                                className={`px-3 py-0.5 text-xs font-extrabold rounded-full transition ${
                                  pucYear === yr ? 'bg-white text-[#650000] shadow-xs' : 'text-white/80 hover:text-white'
                                }`}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                          Welcome back, Rahul Sharma!
                        </h1>
                        <p className="text-sm text-white/90">
                          Roll No: <strong className="text-white">24PUC101</strong> • <span className="text-[#FFE59A] font-bold">{pucYear} Science (PCMB / PCMC)</span> • Shivamogga Campus
                        </p>
                        <p className="text-xs text-white/75 flex flex-wrap gap-1.5 pt-0.5">
                          <span className="font-semibold text-white/90">PUC Core Subjects:</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">Physics</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">Chemistry</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">Mathematics</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">Biology</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">Comp Science</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold">Statistics</span>
                        </p>
                      </div>

                      {/* Animated Student Quick Metric Badges */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                          <span className="text-[10px] uppercase font-bold text-white/70 block">Cohort Rank</span>
                          <span className="text-2xl font-black text-[#FFE59A] block mt-0.5">
                            #<AnimatedCounter value={16} duration={900} />
                          </span>
                          <span className="text-[10px] text-white/70 mt-0.5 block">Top 16% in CSE</span>
                        </div>

                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                          <span className="text-[10px] uppercase font-bold text-white/70 block">Attendance</span>
                          <span className="text-2xl font-black text-green-300 block mt-0.5">
                            <AnimatedCounter value={86.4} decimals={1} duration={1100} suffix="%" />
                          </span>
                          <span className="text-[10px] text-white/70 mt-0.5 block">Above 75% Safe</span>
                        </div>

                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                          <span className="text-[10px] uppercase font-bold text-white/70 block">Mock Score</span>
                          <span className="text-2xl font-black text-[#FFE59A] block mt-0.5">
                            <AnimatedCounter value={212} duration={1200} />
                          </span>
                          <span className="text-[10px] text-white/70 mt-0.5 block">/ 300 Marks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Title */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-stone-900 uppercase tracking-wider">
                        INTERACTIVE ACADEMIC MODULES (8)
                      </h2>
                      <p className="text-xs text-stone-500">
                        Hover or tap any card to smoothly expand and reveal contextual operational details
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-200 text-stone-700">
                      Expand on Hover / Tap
                    </span>
                  </div>

                  {/* 3. EIGHT STUDENT DASHBOARD CARDS WITH HOVER EXPANSION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                    {STUDENT_DASHBOARD_CARDS.map((card) => (
                      <ExpandableDashboardCard
                        key={card.id}
                        card={card}
                        isExpanded={expandedCardId === card.id}
                        onHoverStart={() => setExpandedCardId(card.id)}
                        onHoverEnd={() => setExpandedCardId(null)}
                        onToggleTap={() => setExpandedCardId(prev => prev === card.id ? null : card.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {currentRole !== 'student' && activeModule === 'dashboard' && activeAdminSection && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveAdminSectionId(null)}
                      className="flex items-center gap-2 self-start rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-stone-600 transition hover:bg-stone-50"
                    >
                      <ArrowLeft size={15} />
                      All Sections
                    </button>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl font-black tracking-tight text-stone-900">{activeAdminSection.sectionLabel}</h1>
                      <p className="mt-1 text-xs leading-relaxed text-stone-500">
                        {ADMIN_SECTION_DESCRIPTIONS[activeAdminSection.sectionId]}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600">
                      {activeAdminSection.items.length} modules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {activeAdminSection.items.map((item) => {
                      const ItemIcon = item.icon;
                      const badge = ADMIN_ITEM_BADGES[item.id] ?? item.badge;

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveModule(item.id);
                            setActiveAdminSectionId(null);
                          }}
                          whileHover={{ y: -3, boxShadow: '0 16px 30px -20px rgba(15,23,42,0.35)' }}
                          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                          className="group flex min-h-36 flex-col rounded-3xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-stone-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A60000]"
                        >
                          <span className="mb-3.5 flex min-h-11 w-full items-start justify-between">
                            <span
                              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0F0] text-[#650000] shadow-xs"
                              style={{ color: item.colorAccent ?? activeAdminSection.sectionColor }}
                            >
                              <ItemIcon size={33} />
                            </span>
                            {badge && (
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold text-white ${badge === 'LIVE' ? 'animate-pulse bg-red-500' : ''}`}
                                style={badge === 'LIVE' ? undefined : { backgroundColor: activeAdminSection.sectionColor }}
                              >
                                {badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-4 font-black text-sm text-stone-800">{item.label}</span>
                          <span className="mt-1 text-[11px] leading-relaxed text-stone-500">
                            {ADMIN_ITEM_DESCRIPTIONS[item.id]}
                          </span>
                          <span className="mt-auto flex w-full items-center justify-between pt-4 text-xs font-black text-[#A60000]">
                            Open module
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  ROLE = PRINCIPAL / ADMIN / TEACHER DASHBOARD VIEW (DEFAULT)
                  ───────────────────────────────────────────────────────────── */}
              {currentRole !== 'student' && activeModule === 'dashboard' && !activeAdminSection && (
                <div className="space-y-6">
                  {/* ── Top Welcome Bar ── */}
                  <div
                    className="relative overflow-hidden rounded-3xl p-6 md:p-7 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 65%, #A60000 100%)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FFE59A] text-[#500000] tracking-wider">{activeProfile.roleBadge}</span>
                        <span className="text-xs text-white/75 font-medium">• Manchester Technologies – Shivamogga</span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Admin / Tab Management</h1>
                      <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">Central control for student tablets, live examinations, activity monitoring, security and reports. Open a section card to view its modules.</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm flex items-center gap-3 shrink-0 shadow-xs">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-[#500000] text-base shadow-sm bg-[#FFE59A]">{activeProfile.initial}</div>
                      <div>
                        <h3 className="font-extrabold text-xs text-white truncate max-w-[170px]">{activeProfile.name}</h3>
                        <p className="text-[11px] text-white/70 truncate max-w-[170px]">{activeProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* ── 5 Section Cards ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                    {ADMIN_NAV_SECTIONS.map((section) => {
                      const SectionIcon = section.sectionIcon;
                      return (
                        <motion.button
                          key={section.sectionId}
                          type="button"
                          aria-label={`Open ${section.sectionLabel} page`}
                          onClick={() => setActiveAdminSectionId(section.sectionId)}
                          layout
                          whileHover={{ y: -5, scale: 1.025, boxShadow: '0 20px 36px -20px rgba(15,23,42,0.35)' }}
                          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                          className="group flex min-h-[244px] flex-col overflow-hidden rounded-3xl border border-stone-200 border-t-[3px] bg-white p-5 text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A60000]"
                          style={{ borderTopColor: '#650000' }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#650000]">
                              <SectionIcon size={27} />
                            </span>
                            <span className="rounded-full border border-stone-100 px-3 py-1.5 text-[10px] font-black text-stone-700">
                              {section.items.length} Modules
                            </span>
                          </div>

                          <div className="mt-4">
                            <h2 className="font-black text-sm uppercase tracking-wide text-stone-900">{section.sectionLabel}</h2>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500">{ADMIN_SECTION_DESCRIPTIONS[section.sectionId]}</p>
                          </div>

                          <span className="mt-auto flex w-full items-center justify-between border-t border-stone-100 pt-3 text-xs font-black text-[#A60000]">
                            <span>Open section</span>
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  STUDENTS MODULE: 100 STUDENTS ROSTER WITH 0-TO-N COUNTERS
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'students' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          100-STUDENT BATCH ADMISSIONS & MARKS ROSTER
                        </h2>
                        <p className="text-xs text-stone-500">
                          Click any student card to open his full scorecard with smooth 0-to-N marks animations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                        ● All 100 Enrolled
                      </span>
                    </div>
                  </div>

                  {/* 4 Animated Metric Cards (Count smoothly from 0 to value) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-sm text-center apple-card">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Total Cohort
                      </span>
                      <div className="text-3xl font-black text-stone-900 mt-1">
                        <AnimatedCounter value={100} duration={1000} />
                      </div>
                      <span className="text-[11px] text-stone-400 mt-0.5 block">50 Sec A • 50 Sec B</span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-sm text-center apple-card">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Batch Board Mean
                      </span>
                      <div className="text-3xl font-black text-[#650000] mt-1">
                        <AnimatedCounter value={512} duration={1300} />
                        <span className="text-sm font-normal text-stone-400"> / 600</span>
                      </div>
                      <span className="text-[11px] text-stone-400 mt-0.5 block">85.3% batch avg</span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-sm text-center apple-card">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Top Board Marks
                      </span>
                      <div className="text-3xl font-black text-[#16A34A] mt-1">
                        <AnimatedCounter value={588} duration={1400} />
                        <span className="text-sm font-normal text-stone-400"> / 600</span>
                      </div>
                      <span className="text-[11px] text-green-700 font-bold mt-0.5 block truncate">
                        Aditya Patil (Rank #1)
                      </span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-sm text-center apple-card">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Pass Rate
                      </span>
                      <div className="text-3xl font-black text-[#A60000] mt-1">
                        <AnimatedCounter value={92} duration={1200} suffix="%" />
                      </div>
                      <span className="text-[11px] text-stone-400 mt-0.5 block">92 of 100 cleared</span>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="font-bold text-stone-400 mr-1 flex items-center gap-1">
                        <Filter size={13} /> Cohort Filter:
                      </span>
                      {[
                        { id: 'All', label: 'All 100 Students' },
                        { id: 'A', label: 'Section A (50)' },
                        { id: 'B', label: 'Section B (50)' },
                        { id: 'AtRisk', label: 'Needs Support' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => { setStudentSectionFilter(tab.id as any); setStudentPage(1); }}
                          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition apple-button ${
                            studentSectionFilter === tab.id
                              ? 'bg-[#650000] text-white shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search student by name or roll..."
                        value={studentSearch}
                        onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 outline-none w-56 md:w-64 bg-stone-50/50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* 100 Students Grid List with Apple Bulge hover */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedStudents.map((st) => {
                      const estBoardMarks = Math.min(600, Math.round(st.jeeMockScore * 2 + 76));

                      return (
                        <div
                          key={st.id}
                          onClick={() => setSelectedStudent(st)}
                          className="apple-card p-5 cursor-pointer flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                                {st.rollNumber}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                                Sec {st.section}
                              </span>
                            </div>

                            <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-[#A60000] transition-colors leading-snug">
                              {st.name}
                            </h3>

                            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-stone-400 uppercase block">Board Score</span>
                                <strong className="text-stone-800 font-black text-sm">
                                  {estBoardMarks} <span className="text-[10px] font-normal text-stone-400">/ 600</span>
                                </strong>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-stone-400 uppercase block">Rank</span>
                                <strong className="text-[#650000] font-black text-sm">
                                  #{st.rank}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 text-[11px] text-[#A60000] font-bold flex items-center justify-between">
                            <span>Open Scorecard</span>
                            <span>→</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
                    <span>
                      Showing {((studentPage - 1) * pageSize) + 1} to {Math.min(studentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} students
                    </span>

                    <div className="flex gap-1.5">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setStudentPage(idx + 1)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition apple-button ${
                            studentPage === idx + 1
                              ? 'bg-[#650000] text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  STAFFS MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'staffs' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          FACULTY & TEACHING STAFF DIRECTORY
                        </h2>
                        <p className="text-xs text-stone-500">
                          Executive administrators and professors
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      {
                        name: 'Prof. K. R. Suresh',
                        role: 'Principal & Executive Administrator',
                        email: 'principal@sirmv.edu.in',
                        dept: 'Administration',
                        subjects: 'Institutional Governance, Academic Schemes',
                        initial: 'P',
                        color: '#650000',
                      },
                      {
                        name: PROFESSOR_1.name,
                        role: PROFESSOR_1.designation,
                        email: PROFESSOR_1.email,
                        dept: PROFESSOR_1.department,
                        subjects: PROFESSOR_1.subjects.join(', '),
                        initial: 'T',
                        color: '#A60000',
                      },
                      {
                        name: PROFESSOR_2.name,
                        role: PROFESSOR_2.designation,
                        email: PROFESSOR_2.email,
                        dept: PROFESSOR_2.department,
                        subjects: PROFESSOR_2.subjects.join(', '),
                        initial: 'H',
                        color: '#500000',
                      },
                    ].map((st, i) => (
                      <div key={i} className="apple-card p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shadow-sm"
                              style={{ backgroundColor: st.color }}
                            >
                              {st.initial}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-base text-stone-900">{st.name}</h3>
                              <span className="text-[11px] font-bold text-[#A60000]">{st.role}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                            <p>Department: <strong className="text-stone-800">{st.dept}</strong></p>
                            <p>Courses: <strong className="text-stone-800">{st.subjects}</strong></p>
                            <p>Email: <strong className="text-stone-800">{st.email}</strong></p>
                          </div>
                        </div>

                        <button className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white transition apple-button-primary" style={{ backgroundColor: '#A60000' }}>
                          View Teaching Dossier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  REPORTS & COHORT ANALYTICS MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'reports' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          {currentRole === 'student' ? 'EXAMINATION RESULTS & DIAGNOSTIC SCORECARDS' : 'INSTITUTIONAL PERFORMANCE & COHORT REPORTS'}
                        </h2>
                        <p className="text-xs text-stone-500">
                          {currentRole === 'student'
                            ? 'Comprehensive diagnostic performance across JEE, NEET, KCET, and Board Theory examinations'
                            : 'Cohort score distribution across all 100 students'}
                        </p>
                      </div>
                    </div>

                    {currentRole === 'student' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                        ● Recent Benchmark: 70.7% (Rank #16)
                      </span>
                    )}
                  </div>

                  {/* ─────────────────────────────────────────────────────────────
                      FOR STUDENTS: RECENT EXAM PERFORMANCE IN MAIN DASHBOARD
                      ───────────────────────────────────────────────────────────── */}
                  {currentRole === 'student' && (
                    <>
                      {/* Top Recent Exam Performance Spotlight Card */}
                      <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/50 to-[#FDE68A]/30 rounded-3xl p-6 border border-[#FCD34D] shadow-sm relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#78350F] text-white">
                                Latest Evaluated Paper
                              </span>
                              <span className="text-xs font-bold text-[#92400E]">Nov 02, 2026</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#78350F] tracking-tight">
                              JEE Main All India Mock Assessment 02
                            </h3>
                            <p className="text-xs text-stone-600 max-w-xl">
                              Conducted by Senior Faculty & Examination Board. Overall accuracy: <strong>56 Correct • 12 Incorrect • 7 Unattempted</strong>. Time spent: 168 mins.
                            </p>
                          </div>

                          {/* Quick metrics grid */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FCD34D] text-center">
                              <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Score</span>
                              <div className="text-2xl font-black text-[#A60000] mt-0.5">
                                <AnimatedCounter value={212} duration={1200} />
                                <span className="text-xs font-normal text-stone-400"> / 300</span>
                              </div>
                              <span className="text-[10px] text-stone-500 block mt-0.5">70.7% Score</span>
                            </div>

                            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FCD34D] text-center">
                              <span className="text-[10px] uppercase font-bold text-stone-400 block">Cohort Rank</span>
                              <div className="text-2xl font-black text-green-700 mt-0.5">
                                #<AnimatedCounter value={16} duration={900} />
                              </div>
                              <span className="text-[10px] text-stone-500 block mt-0.5">of 100 students</span>
                            </div>

                            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#FCD34D] text-center">
                              <span className="text-[10px] uppercase font-bold text-stone-400 block">Percentile</span>
                              <div className="text-2xl font-black text-blue-700 mt-0.5">
                                <AnimatedCounter value={84.2} decimals={1} duration={1100} suffix="%" />
                              </div>
                              <span className="text-[10px] text-stone-500 block mt-0.5">Top 16% in PUC</span>
                            </div>
                          </div>
                        </div>

                        {/* Subject marks breakdown strip */}
                        <div className="mt-5 pt-4 border-t border-[#FCD34D]/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 bg-white/70 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="block text-stone-900">Physics</strong>
                              <span className="text-stone-400 text-[11px]">Electrostatics, Currents, Optics</span>
                            </div>
                            <strong className="text-sm font-black text-stone-800">74 / 100</strong>
                          </div>

                          <div className="p-3 bg-white/70 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="block text-stone-900">Chemistry</strong>
                              <span className="text-stone-400 text-[11px]">Kinetics, Coordination, Organic</span>
                            </div>
                            <strong className="text-sm font-black text-stone-800">68 / 100</strong>
                          </div>

                          <div className="p-3 bg-white/70 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="block text-stone-900">Mathematics</strong>
                              <span className="text-stone-400 text-[11px]">Calculus, Matrices, Vectors</span>
                            </div>
                            <strong className="text-sm font-black text-stone-800">70 / 100</strong>
                          </div>
                        </div>

                        {/* Button to click and review */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setReviewExamModal(MOCK_EXAM_RESULTS[0])}
                            className="px-5 py-2.5 rounded-2xl font-bold text-xs text-white bg-[#A60000] hover:bg-[#650000] transition apple-button-primary shadow-sm flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={14} /> Open Detailed MCQ Review (Right Answer Ticked & Option Chosen)
                          </button>
                        </div>
                      </div>

                      {/* ─────────────────────────────────────────────────────────────
                          SCROLL DOWN: ALL PAST EXAMINATIONS MARKS & PERCENTAGE ARCHIVE
                          ───────────────────────────────────────────────────────────── */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-extrabold text-stone-900">
                              Past Examination Records & Score Archives (Click any paper to review MCQs)
                            </h3>
                            <p className="text-xs text-stone-500">
                              Evaluated diagnostic records across JEE, NEET, KCET and PU Board evaluations
                            </p>
                          </div>
                          <span className="text-xs font-bold text-stone-400">
                            {MOCK_EXAM_RESULTS.length} Recorded Exams
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {MOCK_EXAM_RESULTS.map((exam) => (
                            <div
                              key={exam.id}
                              onClick={() => setReviewExamModal(exam)}
                              className="apple-card p-6 flex flex-col justify-between cursor-pointer group"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-[#FFE59A] text-[#500000] border border-[#E5BD55]/40">
                                    {exam.category}
                                  </span>
                                  <span className="text-xs text-stone-400 font-medium">{exam.date}</span>
                                </div>

                                <h4 className="font-extrabold text-base text-stone-900 group-hover:text-[#A60000] transition-colors leading-snug">
                                  {exam.examName}
                                </h4>

                                <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Marks Obtained</span>
                                    <strong className="text-base font-black text-stone-900">
                                      {exam.marksObtained} <span className="text-xs font-normal text-stone-400">/ {exam.totalMarks}</span>
                                    </strong>
                                  </div>

                                  <div className="text-center">
                                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Percentage</span>
                                    <strong className="text-base font-black text-[#A60000]">
                                      {exam.percentage}%
                                    </strong>
                                  </div>

                                  <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Cohort Rank</span>
                                    <strong className="text-base font-black text-green-700">
                                      #{exam.cohortRank} <span className="text-xs font-normal text-stone-400">/ {exam.totalCohortStudents}</span>
                                    </strong>
                                  </div>
                                </div>

                                {/* Subject mini pills */}
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {exam.subjectScores.map((sub, sIdx) => (
                                    <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                                      {sub.subject}: {sub.obtained}/{sub.max}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A60000] group-hover:translate-x-1 transition-transform">
                                <span>Open Full MCQ Review (Answers & Time Taken)</span>
                                <span>→</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* For Principal / Teachers View: Grade Distribution across 100 students */}
                  {currentRole !== 'student' && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/70 space-y-4">
                      <h3 className="font-bold text-base text-stone-900">
                        Cohort Grade Distribution (100 Students)
                      </h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={reportDistData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="band" tick={{ fontSize: 11, fill: '#4B5563' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  ATTENDANCE MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'attendance' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          STUDENT ATTENDANCE & BIOMETRIC ROLL-CALL
                        </h2>
                        <p className="text-xs text-stone-500">
                          Daily session register for 100 enrolled students
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 text-center apple-card">
                      <span className="text-xs font-bold text-stone-400 uppercase">Batch Attendance</span>
                      <div className="text-3xl font-black text-green-700 mt-1">
                        <AnimatedCounter value={86.4} decimals={1} duration={1200} suffix="%" />
                      </div>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Statutory safe</span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 text-center apple-card">
                      <span className="text-xs font-bold text-stone-400 uppercase">Today Present</span>
                      <div className="text-3xl font-black text-stone-900 mt-1">
                        <AnimatedCounter value={88} duration={1000} />
                      </div>
                      <span className="text-[11px] text-green-600 font-bold mt-0.5 block">In class</span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 text-center apple-card">
                      <span className="text-xs font-bold text-stone-400 uppercase">Today Absent</span>
                      <div className="text-3xl font-black text-red-600 mt-1">
                        <AnimatedCounter value={12} duration={900} />
                      </div>
                      <span className="text-[11px] text-red-500 mt-0.5 block">Leave / absent</span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-stone-200/70 text-center apple-card">
                      <span className="text-xs font-bold text-stone-400 uppercase">Total Sessions</span>
                      <div className="text-3xl font-black text-stone-900 mt-1">
                        <AnimatedCounter value={276} duration={1200} />
                      </div>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Conducted classes</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  ANNOUNCEMENTS / NOTICEBOARD MODULE (TEACHERS, HODs, PRINCIPAL)
                  ───────────────────────────────────────────────────────────── */}
              {(activeModule === 'announcements' || activeModule === 'noticeboard') && (
                <div className="space-y-6">
                  {/* Module Header */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          OFFICIAL NOTIFICATIONS & CIRCULARS FEED
                        </h2>
                        <p className="text-xs text-stone-500">
                          Verified academic circulars received directly from Principal, HODs, and Subject Teachers
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFE59A] text-[#500000]">
                      <AnimatedCounter value={PUC_ANNOUNCEMENTS.length} duration={800} /> Official Circulars
                    </span>
                  </div>

                  {/* Filter Bar: Category Tabs (Principal / HOD / Teacher / All) */}
                  <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="font-bold text-stone-400 mr-1 flex items-center gap-1">
                        <Filter size={13} /> Sender Filter:
                      </span>
                      {[
                        { id: 'All', label: 'All Notices' },
                        { id: 'Principal', label: '🏛️ From Principal' },
                        { id: 'HOD', label: '🔬 From HODs' },
                        { id: 'Teacher', label: '👩‍🏫 From Subject Teachers' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setAnnouncementCategoryFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition apple-button ${
                            announcementCategoryFilter === tab.id
                              ? 'bg-[#650000] text-white shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Subject Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                      {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics'].map(sub => (
                        <button
                          key={sub}
                          onClick={() => setAnnouncementSubjectFilter(sub)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            announcementSubjectFilter === sub
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtered Announcements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PUC_ANNOUNCEMENTS.filter(item => {
                      if (announcementCategoryFilter !== 'All' && item.category !== announcementCategoryFilter) return false;
                      if (announcementSubjectFilter !== 'All' && item.subject !== announcementSubjectFilter) return false;
                      return true;
                    }).map((item) => (
                      <div key={item.id} className="apple-card p-6 flex flex-col justify-between">
                        <div>
                          {/* Sender Info Header with Name & Designation as requested */}
                          <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs ${
                                  item.category === 'Principal'
                                    ? 'bg-[#650000]'
                                    : item.category === 'HOD'
                                    ? 'bg-[#0284C7]'
                                    : 'bg-[#D97706]'
                                }`}
                              >
                                {item.senderName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-stone-900 leading-snug">
                                  {item.senderName}
                                </h4>
                                <span className="text-[11px] font-bold text-[#A60000] block">
                                  {item.designation}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  item.category === 'Principal'
                                    ? 'bg-[#FFE59A] text-[#500000]'
                                    : item.category === 'HOD'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {item.category}
                              </span>
                              <span className="text-[10px] text-stone-400 block mt-0.5">{item.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            {item.isUrgent && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-red-100 text-red-700 animate-pulse">
                                ⚠️ URGENT
                              </span>
                            )}
                            {item.subject && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700">
                                {item.subject}
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400 font-bold">{item.targetYear}</span>
                          </div>

                          <h3 className="font-extrabold text-base text-stone-900 leading-snug">
                            {item.title}
                          </h3>

                          {/* Message Body as requested */}
                          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-stone-400 font-medium">Delivered to: Rahul Sharma ({pucYear})</span>
                          <span className="font-bold text-[#A60000] flex items-center gap-1 cursor-pointer hover:underline">
                            Official Attachment <Download size={13} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  EXAMS MODULE: 2 TYPES (LIVE & PRACTICE DASHBOARD)
                  ───────────────────────────────────────────────────────────── */}
              {(activeModule === 'tests' || activeModule === 'exam_management') && (
                <div className="space-y-6">
                  {/* Module Header with Live vs Practice Segmented Switcher */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setActiveModule('dashboard'); setPracticeSessionActive(false); }}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          EXAMINATION & ASSESSMENT CENTER
                        </h2>
                        <p className="text-xs text-stone-500">
                          {examViewMode === 'live'
                            ? 'Live teacher-uploaded official papers and examination terminals'
                            : 'Practice examination dashboard with subject analytics and custom revision studio'}
                        </p>
                      </div>
                    </div>

                    {/* TWO EXAM TYPES TOGGLE AS REQUESTED */}
                    <div className="inline-flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
                      <button
                        onClick={() => { setExamViewMode('live'); setPracticeSessionActive(false); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition apple-button ${
                          examViewMode === 'live'
                            ? 'bg-[#650000] text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        🔴 1. Live Exams (Teacher Uploaded)
                      </button>
                      <button
                        onClick={() => setExamViewMode('practice')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition apple-button ${
                          examViewMode === 'practice'
                            ? 'bg-[#650000] text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        🎯 2. Practice Exam Dashboard
                      </button>
                    </div>
                  </div>

                  {/* ══════════════════════════════════════════════════════════════
                      TYPE 1: LIVE EXAMS (TEACHER UPLOADS PAPERS, IF NOT NO LIVE)
                      ══════════════════════════════════════════════════════════════ */}
                  {examViewMode === 'live' && (
                    <div className="space-y-5">
                      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
                        <Clock size={18} className="text-blue-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Teacher Paper Verification Protocol</strong>
                          <span>
                            Live examination papers are uploaded directly by subject teachers and sealed with institutional encryption until the scheduled evaluation window commences. If no paper is actively ongoing, live terminals remain locked.
                          </span>
                        </div>
                      </div>

                      {/* Scheduled Live Paper uploaded by teacher */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="apple-card p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase bg-[#DCFCE7] text-[#166534]">
                                ● Paper Scheduled & Sealed
                              </span>
                              <span className="text-xs font-bold text-stone-500">180 Mins • 100 Marks</span>
                            </div>

                            <h3 className="font-extrabold text-lg text-stone-900 leading-snug">
                              II PU Physics Official Mid-Term Evaluation
                            </h3>
                            <span className="text-xs font-bold text-[#A60000] block mt-1">
                              Subject: Physics (Theory & Problems)
                            </span>

                            <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs text-stone-600">
                              <p>Teacher In-Charge: <strong className="text-stone-900">Dr. Mahendra V (HOD Physics)</strong></p>
                              <p>Paper Status: <span className="text-green-700 font-bold">Uploaded & Certified</span></p>
                              <p>Evaluation Window: <strong>Nov 18, 2026 • 10:00 AM – 01:00 PM</strong></p>
                              <p>Venue: <strong>Central Exam Hall & Digital Lab 2</strong></p>
                            </div>
                          </div>

                          <button
                            disabled
                            className="mt-5 w-full py-2.5 rounded-2xl text-xs font-bold text-stone-400 bg-stone-100 border border-stone-200 flex items-center justify-center gap-1.5 cursor-not-allowed"
                          >
                            <Clock size={13} /> Terminal Opens Nov 18, 10:00 AM
                          </button>
                        </div>

                        {/* Secondary status card indicating no other live exams active */}
                        <div className="bg-white rounded-3xl p-6 border border-dashed border-stone-300 text-center flex flex-col items-center justify-center space-y-3 min-h-[220px]">
                          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                            <Clock size={22} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-stone-800">No Other Live Exams Active Right Now</h4>
                            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                              Teachers upload examination papers 15 minutes before the scheduled time. When a professor releases a live paper, your terminal unlocks immediately.
                            </p>
                          </div>
                          <button
                            onClick={() => setExamViewMode('practice')}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-[#A60000] bg-red-50 hover:bg-red-100 transition apple-button"
                          >
                            Switch to Practice Exam Dashboard →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════════════
                      TYPE 2: PRACTICE EXAM DASHBOARD (PERFORMANCE & REVISION STUDIO)
                      ══════════════════════════════════════════════════════════════ */}
                  {examViewMode === 'practice' && (
                    <div className="space-y-6">
                      {/* Interactive practice session active tester */}
                      {practiceSessionActive ? (
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-md space-y-6">
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#650000] text-white">
                                  {practiceTrack} Practice Session
                                </span>
                                <span className="text-xs font-bold text-stone-700">{practiceSubject} • {practiceTopic}</span>
                              </div>
                              <h3 className="text-lg font-black text-stone-900 mt-1">
                                Question {practiceActiveQIndex + 1} of 5 (Diagnostic Blitz)
                              </h3>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                <Clock size={12} /> Timer: 14m 28s
                              </span>
                              <button
                                onClick={() => setPracticeSessionActive(false)}
                                className="px-3 py-1 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 border border-stone-200 transition"
                              >
                                End Practice Session
                              </button>
                            </div>
                          </div>

                          {/* Practice MCQ */}
                          <div className="space-y-4">
                            <p className="text-base font-bold text-stone-900 leading-relaxed">
                              {practiceActiveQIndex === 0
                                ? 'What is the SI unit of electric flux through a Gaussian surface?'
                                : practiceActiveQIndex === 1
                                ? 'Which law states that the induced electromotive force in a circuit is proportional to the rate of change of magnetic flux?'
                                : 'For a capacitor of capacitance C charged to potential V, the energy stored in the electric field is given by:'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {[
                                { id: 'A', text: practiceActiveQIndex === 0 ? 'N · m² · C⁻¹' : practiceActiveQIndex === 1 ? 'Faraday\'s Law' : '1/2 C V²' },
                                { id: 'B', text: practiceActiveQIndex === 0 ? 'N · m · C⁻²' : practiceActiveQIndex === 1 ? 'Lenz\'s Law' : 'C V²' },
                                { id: 'C', text: practiceActiveQIndex === 0 ? 'V · m⁻¹' : practiceActiveQIndex === 1 ? 'Ampere\'s Circuital Law' : '1/2 C² V' },
                                { id: 'D', text: practiceActiveQIndex === 0 ? 'J · C⁻¹' : practiceActiveQIndex === 1 ? 'Gauss\'s Law' : '2 C V' },
                              ].map((opt) => {
                                const selected = practiceSelectedAnswers[practiceActiveQIndex] === opt.id;
                                const isCorrect = opt.id === 'A';

                                let style = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
                                if (practiceSelectedAnswers[practiceActiveQIndex]) {
                                  if (isCorrect) style = 'bg-green-100 border-green-400 text-green-950 font-bold';
                                  else if (selected) style = 'bg-red-100 border-red-400 text-red-950 font-bold';
                                }

                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => setPracticeSelectedAnswers(prev => ({ ...prev, [practiceActiveQIndex]: opt.id }))}
                                    className={`p-3.5 rounded-2xl border text-left text-xs transition apple-button flex items-center justify-between ${style}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center">
                                        {opt.id}
                                      </span>
                                      <span>{opt.text}</span>
                                    </div>
                                    {practiceSelectedAnswers[practiceActiveQIndex] && isCorrect && (
                                      <Check size={14} className="text-green-700" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {practiceSelectedAnswers[practiceActiveQIndex] && (
                              <div className="p-3.5 bg-green-50/70 border border-green-200 rounded-2xl text-xs text-green-900">
                                <strong>Explanation:</strong> Option A is verified. Electric flux Φ = E · A = (N/C) · m² = N · m² · C⁻¹.
                              </div>
                            )}

                            <div className="flex justify-between pt-4 border-t border-stone-100">
                              <button
                                disabled={practiceActiveQIndex === 0}
                                onClick={() => setPracticeActiveQIndex(i => Math.max(0, i - 1))}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 disabled:opacity-40"
                              >
                                ← Previous
                              </button>
                              <button
                                onClick={() => setPracticeActiveQIndex(i => Math.min(2, i + 1))}
                                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#A60000] hover:bg-[#650000]"
                              >
                                Next Question →
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* 1. Recent Exam Performance by Subject */}
                          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-extrabold text-base text-stone-900">
                                  Recent Practice Examination Performance Overview
                                </h3>
                                <p className="text-xs text-stone-500">
                                  Diagnostic score breakdown across Physics, Chemistry, Mathematics, and elective tracks
                                </p>
                              </div>
                              <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                Overall Accuracy: 82.6%
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                                <span className="text-[11px] font-bold text-stone-500 uppercase block">Physics</span>
                                <div className="text-2xl font-black text-stone-900 mt-1">
                                  <AnimatedCounter value={74} duration={1000} />
                                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                                </div>
                                <span className="text-[10px] text-green-700 font-bold block mt-0.5">74% Accuracy</span>
                              </div>

                              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                                <span className="text-[11px] font-bold text-stone-500 uppercase block">Chemistry</span>
                                <div className="text-2xl font-black text-stone-900 mt-1">
                                  <AnimatedCounter value={68} duration={1100} />
                                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                                </div>
                                <span className="text-[10px] text-amber-700 font-bold block mt-0.5">68% Accuracy</span>
                              </div>

                              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                                <span className="text-[11px] font-bold text-stone-500 uppercase block">Mathematics</span>
                                <div className="text-2xl font-black text-stone-900 mt-1">
                                  <AnimatedCounter value={70} duration={1200} />
                                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                                </div>
                                <span className="text-[10px] text-blue-700 font-bold block mt-0.5">70% Accuracy</span>
                              </div>

                              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                                <span className="text-[11px] font-bold text-stone-500 uppercase block">Biology / CS / Stats</span>
                                <div className="text-2xl font-black text-[#A60000] mt-1">
                                  <AnimatedCounter value={85} duration={1300} />
                                  <span className="text-xs text-stone-400 font-normal"> / 100</span>
                                </div>
                                <span className="text-[10px] text-green-700 font-bold block mt-0.5">85% Accuracy</span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Diversified Overall Analysis Across 4 Tracks (JEE, NEET, CET, Board Theory) */}
                          <div className="space-y-3">
                            <h3 className="font-extrabold text-base text-stone-900">
                              Diversified Competitive & Board Examination Analysis
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {[
                                {
                                  track: 'JEE Main & Adv',
                                  score: '212 / 300',
                                  percent: '70.7%',
                                  count: '18 Mocks',
                                  highlight: 'Accuracy 74.2%',
                                  color: '#0284C7',
                                  bg: 'bg-blue-50/70',
                                },
                                {
                                  track: 'NEET Medical',
                                  score: '560 / 720',
                                  percent: '77.8%',
                                  count: '12 Mocks',
                                  highlight: 'Accuracy 78.6%',
                                  color: '#059669',
                                  bg: 'bg-emerald-50/70',
                                },
                                {
                                  track: 'KCET State Rank',
                                  score: '148 / 180',
                                  percent: '82.2%',
                                  count: '24 Mocks',
                                  highlight: 'Accuracy 84.8%',
                                  color: '#D97706',
                                  bg: 'bg-amber-50/70',
                                },
                                {
                                  track: 'PU Board Theory',
                                  score: '534 / 600',
                                  percent: '89.0%',
                                  count: '15 Papers',
                                  highlight: 'Accuracy 89.5%',
                                  color: '#A60000',
                                  bg: 'bg-red-50/70',
                                },
                              ].map((tr, idx) => (
                                <div key={idx} className={`apple-card p-5 ${tr.bg} border flex flex-col justify-between`}>
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-stone-800 shadow-2xs">
                                        {tr.count}
                                      </span>
                                      <span className="text-xs font-bold text-stone-500">{tr.highlight}</span>
                                    </div>
                                    <h4 className="font-extrabold text-base text-stone-900">{tr.track}</h4>
                                    <div className="mt-3">
                                      <span className="text-2xl font-black" style={{ color: tr.color }}>
                                        {tr.score}
                                      </span>
                                      <span className="text-xs text-stone-500 block mt-0.5">{tr.percent} Benchmark</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Interactive Custom Practice Generator ("Custom Practice Studio") */}
                          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm space-y-5">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#A60000] block">
                                Practice Studio
                              </span>
                              <h3 className="text-lg font-black text-stone-900 mt-0.5">
                                Create Custom Revision & Practice Test Session
                              </h3>
                              <p className="text-xs text-stone-500">
                                Select your desired exam track, subject, chapter topic, question volume and difficulty to launch practice
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                              {/* Step 1: Exam Track */}
                              <div>
                                <label className="font-bold text-stone-700 block mb-1.5">1. Target Exam Track</label>
                                <select
                                  value={practiceTrack}
                                  onChange={(e) => setPracticeTrack(e.target.value as any)}
                                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold outline-none"
                                >
                                  <option value="JEE">JEE Main & Advanced</option>
                                  <option value="NEET">NEET Medical Drill</option>
                                  <option value="CET">KCET State Engineering</option>
                                  <option value="PU Board Theory">PU Board Theory Examination</option>
                                </select>
                              </div>

                              {/* Step 2: Subject */}
                              <div>
                                <label className="font-bold text-stone-700 block mb-1.5">2. Core PUC Subject</label>
                                <select
                                  value={practiceSubject}
                                  onChange={(e) => {
                                    const sub = e.target.value as PUCSubject;
                                    setPracticeSubject(sub);
                                    setPracticeTopic(PUC_TOPICS_BY_SUBJECT[sub][0]);
                                  }}
                                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold outline-none"
                                >
                                  {(['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics'] as PUCSubject[]).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Step 3: Chapter / Topic */}
                              <div>
                                <label className="font-bold text-stone-700 block mb-1.5">3. Chapter / Topic to Revise</label>
                                <select
                                  value={practiceTopic}
                                  onChange={(e) => setPracticeTopic(e.target.value)}
                                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold outline-none"
                                >
                                  {PUC_TOPICS_BY_SUBJECT[practiceSubject]?.map(top => (
                                    <option key={top} value={top}>{top}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Step 4: Number of Questions */}
                              <div>
                                <label className="font-bold text-stone-700 block mb-1.5">4. Number of Questions</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {[10, 25, 45, 60].map(cnt => (
                                    <button
                                      key={cnt}
                                      onClick={() => setPracticeQCount(cnt)}
                                      className={`py-2 rounded-xl font-bold transition ${
                                        practiceQCount === cnt
                                          ? 'bg-[#650000] text-white shadow-xs'
                                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                      }`}
                                    >
                                      {cnt} Qs
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Step 5: Difficulty */}
                              <div>
                                <label className="font-bold text-stone-700 block mb-1.5">5. Difficulty Level</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {(['Foundation', 'Moderate', 'Advanced'] as const).map(diff => (
                                    <button
                                      key={diff}
                                      onClick={() => setPracticeDifficulty(diff)}
                                      className={`py-2 rounded-xl font-bold text-[11px] transition ${
                                        practiceDifficulty === diff
                                          ? 'bg-stone-900 text-white shadow-xs'
                                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                      }`}
                                    >
                                      {diff}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Step 6: Launch Action */}
                              <div className="flex flex-col justify-end">
                                <button
                                  onClick={() => {
                                    setPracticeSessionActive(true);
                                    setPracticeActiveQIndex(0);
                                    setPracticeSelectedAnswers({});
                                  }}
                                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-[#A60000] hover:bg-[#650000] transition apple-button-primary shadow-sm flex items-center justify-center gap-2"
                                >
                                  <Play size={14} /> Launch Practice Session ({practiceQCount} Qs)
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  LEADERBOARD MODULE: 1-2-3 PODIUM + GOLD TROPHY + TOP RANKERS
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'leaderboard' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          INSTITUTIONAL MERIT LEADERBOARD (TOP 10 COHORT)
                        </h2>
                        <p className="text-xs text-stone-500">
                          Top performing scholars evaluated across mock benchmarks and board evaluations
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFE59A] text-[#500000]">
                      🏆 Gold Benchmark: 588 / 600
                    </span>
                  </div>

                  {/* 1-2-3 Podium with Trophy Display matching reference icon */}
                  <div className="bg-gradient-to-b from-[#FFFDF7] to-white rounded-3xl p-8 border border-amber-200/60 shadow-sm">
                    <div className="text-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
                        Annual Academic Podium
                      </span>
                      <h3 className="text-2xl font-black text-stone-900 mt-1">
                        Top 3 University Rankers
                      </h3>
                    </div>

                    <div className="flex items-end justify-center gap-4 max-w-lg mx-auto pt-6">
                      {/* Step 2 (Left - Rank #2) */}
                      {(() => {
                        const rank2 = STUDENTS_100_ROSTER.find(s => s.rank === 2) || STUDENTS_100_ROSTER[1];
                        return (
                          <div
                            onClick={() => setSelectedStudent(rank2)}
                            className="flex-1 flex flex-col items-center cursor-pointer group"
                          >
                            <span className="text-xs font-bold text-stone-700 group-hover:text-[#A60000] transition truncate max-w-[110px]">
                              {rank2.name}
                            </span>
                            <span className="text-[11px] font-black text-green-700">
                              <AnimatedCounter value={584} duration={1200} /> / 600
                            </span>

                            {/* Mint Green Step 2 Block */}
                            <div className="w-full h-32 rounded-t-2xl bg-[#A7F3D0] border-2 border-[#1E293B] flex flex-col items-center justify-center shadow-md mt-2 group-hover:-translate-y-1 transition-transform">
                              <span className="text-3xl font-black text-stone-800">2</span>
                              <span className="text-[10px] font-bold text-stone-600 uppercase">Silver</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Step 1 (Center - Rank #1 with Gold Trophy) */}
                      {(() => {
                        const rank1 = STUDENTS_100_ROSTER.find(s => s.rank === 1) || STUDENTS_100_ROSTER[0];
                        return (
                          <div
                            onClick={() => setSelectedStudent(rank1)}
                            className="flex-1 flex flex-col items-center cursor-pointer group -translate-y-4"
                          >
                            {/* Gold Trophy */}
                            <div className="w-12 h-12 mb-1 flex items-center justify-center animate-bounce">
                              <IconVNavLeaderboard size={44} />
                            </div>

                            <span className="text-sm font-black text-stone-900 group-hover:text-[#A60000] transition truncate max-w-[120px]">
                              {rank1.name}
                            </span>
                            <span className="text-xs font-black text-[#A60000]">
                              <AnimatedCounter value={588} duration={1400} /> / 600
                            </span>

                            {/* Pink Step 1 Block */}
                            <div className="w-full h-44 rounded-t-2xl bg-[#F472B6] border-2 border-[#1E293B] flex flex-col items-center justify-center shadow-lg mt-2 group-hover:-translate-y-1 transition-transform">
                              <span className="text-4xl font-black text-stone-900">1</span>
                              <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">Gold Medal</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Step 3 (Right - Rank #3) */}
                      {(() => {
                        const rank3 = STUDENTS_100_ROSTER.find(s => s.rank === 3) || STUDENTS_100_ROSTER[2];
                        return (
                          <div
                            onClick={() => setSelectedStudent(rank3)}
                            className="flex-1 flex flex-col items-center cursor-pointer group"
                          >
                            <span className="text-xs font-bold text-stone-700 group-hover:text-[#A60000] transition truncate max-w-[110px]">
                              {rank3.name}
                            </span>
                            <span className="text-[11px] font-black text-blue-700">
                              <AnimatedCounter value={579} duration={1100} /> / 600
                            </span>

                            {/* Light Blue Step 3 Block */}
                            <div className="w-full h-24 rounded-t-2xl bg-[#7DD3FC] border-2 border-[#1E293B] flex flex-col items-center justify-center shadow-md mt-2 group-hover:-translate-y-1 transition-transform">
                              <span className="text-2xl font-black text-stone-800">3</span>
                              <span className="text-[10px] font-bold text-stone-600 uppercase">Bronze</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Top 10 Scholars Table */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                    <h3 className="font-bold text-base text-stone-900 mb-4">
                      Top 10 Cohort Roster (Click to view animated scorecard)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-100 text-stone-400 uppercase text-[10px] font-extrabold">
                            <th className="py-2.5 px-3">Rank</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Roll Number</th>
                            <th className="py-2.5 px-3">Section</th>
                            <th className="py-2.5 px-3">Board Mark</th>
                            <th className="py-2.5 px-3">Attendance</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-medium">
                          {STUDENTS_100_ROSTER.slice(0, 10).map((st) => {
                            const boardMark = Math.min(600, Math.round(st.jeeMockScore * 2 + 76));
                            return (
                              <tr
                                key={st.id}
                                onClick={() => setSelectedStudent(st)}
                                className="hover:bg-stone-50 cursor-pointer transition"
                              >
                                <td className="py-3 px-3">
                                  <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                    st.rank === 1 ? 'bg-amber-100 text-amber-800' : st.rank === 2 ? 'bg-stone-200 text-stone-800' : st.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-stone-500'
                                  }`}>
                                    #{st.rank}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-bold text-stone-900">{st.name}</td>
                                <td className="py-3 px-3 font-mono text-stone-500">{st.rollNumber}</td>
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                                    Sec {st.section}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-black text-[#A60000]">
                                  {boardMark} / 600
                                </td>
                                <td className="py-3 px-3 font-bold text-green-700">{st.attendancePercentage}%</td>
                                <td className="py-3 px-3 text-right">
                                  <span className="text-[11px] font-bold text-[#A60000] hover:underline">
                                    Open Scorecard →
                                  </span>
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

              {/* ─────────────────────────────────────────────────────────────
                  NOTES REPOSITORY MODULE
                  ───────────────────────────────────────────────────────────── */}
              {(activeModule === 'notes' || activeModule === 'board_marks') && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          OFFICIAL VERIFIED SUBJECT NOTES
                        </h2>
                        <p className="text-xs text-stone-500">
                          Official chapter slides, handwritten notes & study modules endorsed by faculty
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                      <AnimatedCounter value={notes.length} duration={800} /> Verified Documents
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {notes.map((doc) => (
                      <div key={doc.id} className="apple-card p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                              {doc.fileSize}
                            </span>
                            <span className="text-[11px] text-stone-400 font-medium">{doc.uploadDate}</span>
                          </div>

                          <h3 className="font-extrabold text-base text-stone-900 leading-snug">{doc.title}</h3>
                          <span className="text-xs font-bold text-[#A60000] block mt-1">{doc.subject}</span>
                          <p className="text-xs text-stone-500 mt-2">Prepared by: <strong>{doc.uploadedBy}</strong></p>
                        </div>

                        <button className="mt-5 w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-[#650000] hover:bg-[#500000] transition apple-button-primary shadow-sm flex items-center justify-center gap-1.5">
                          <Download size={13} /> Download Official PDF
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  STUDY MATERIALS MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'materials' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          MULTIMEDIA & PREPARATION STUDY MATERIALS
                        </h2>
                        <p className="text-xs text-stone-500">
                          Interactive video lectures, PPT presentations and competitive problem sheets
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0369A1]">
                      14 Digital Resources
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {studyMaterials.map((mat) => (
                      <div key={mat.id} className="apple-card p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {mat.resourceType}
                            </span>
                            <span className="text-xs text-stone-400">{mat.category}</span>
                          </div>

                          <h3 className="font-extrabold text-base text-stone-900">{mat.title}</h3>
                          <p className="text-xs text-stone-500 mt-1">{mat.subject}</p>
                          <p className="text-xs text-stone-600 mt-2 font-medium">Faculty: {mat.uploadedBy}</p>
                        </div>

                        <button className="mt-5 w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-stone-900 hover:bg-black transition apple-button shadow-sm flex items-center justify-center gap-1.5">
                          <Eye size={13} /> Access Learning Kit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TIMETABLE / CALENDAR MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'timetable' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          WEEKLY ACADEMIC TIMETABLE & LECTURE SCHEDULE
                        </h2>
                        <p className="text-xs text-stone-500">
                          5th Semester • Section A & B Lecture Room Matrix
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                      ● Current Period: Period 2 (Room 301)
                    </span>
                  </div>

                  {/* Weekly Timetable Grid */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-400 font-extrabold text-[10px] uppercase">
                          <th className="py-3 px-3">Day</th>
                          <th className="py-3 px-3">09:00 - 10:00</th>
                          <th className="py-3 px-3">10:00 - 11:00</th>
                          <th className="py-3 px-3">11:15 - 12:15</th>
                          <th className="py-3 px-3">12:15 - 01:15</th>
                          <th className="py-3 px-3">02:00 - 04:30</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {[
                          { day: 'Monday', p1: 'Data Structures (Room 301)', p2: 'Algorithms (Room 301)', p3: 'Operating Systems (Room 204)', p4: 'Mathematics (Room 301)', lab: 'Data Structures Lab (CS Lab 2)' },
                          { day: 'Tuesday', p1: 'Algorithms (Room 301)', p2: 'Theory of Computation', p3: 'Data Structures (Room 301)', p4: 'Chemistry (Room 102)', lab: 'Python Programming Lab' },
                          { day: 'Wednesday', p1: 'Computer Networks', p2: 'Operating Systems', p3: 'Mathematics (Room 301)', p4: 'English / Comm', lab: 'Hardware Architecture Lab' },
                          { day: 'Thursday', p1: 'Theory of Computation', p2: 'Data Structures', p3: 'Computer Networks', p4: 'Physics (Room 201)', lab: 'Competitive Coding & Mocks' },
                          { day: 'Friday', p1: 'Operating Systems', p2: 'Mathematics', p3: 'Algorithms', p4: 'Constitution of India', lab: 'Project & Seminar Slot' },
                          { day: 'Saturday', p1: 'Weekly Quiz & Review', p2: 'Faculty Doubt Session', p3: 'Remedial Coaching', p4: 'Sports / Extra-Curricular', lab: 'Library & Self-Study' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/70 transition">
                            <td className="py-3.5 px-3 font-bold text-stone-900 bg-stone-50/50">{row.day}</td>
                            <td className="py-3.5 px-3">{row.p1}</td>
                            <td className="py-3.5 px-3 bg-blue-50/40 text-blue-900 font-semibold">{row.p2}</td>
                            <td className="py-3.5 px-3">{row.p3}</td>
                            <td className="py-3.5 px-3">{row.p4}</td>
                            <td className="py-3.5 px-3 font-bold text-[#A60000]">{row.lab}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  COMPLAINTS / GRIEVANCE REDRESSAL MODULE
                  ───────────────────────────────────────────────────────────── */}
              {(activeModule === 'complaints' || activeModule === 'reported_issues') && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          CAMPUS GRIEVANCE & COMPLAINTS CELL
                        </h2>
                        <p className="text-xs text-stone-500">
                          Official student welfare channel monitored by Principal & Redressal Committee
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                      1 Pending • 1 Resolved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Complaints List */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-base text-stone-900">Your Lodged Tickets</h3>
                      {complaints.map((c) => (
                        <div key={c.id} className="apple-card p-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-stone-700">{c.referenceNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              ● {c.status}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-stone-900">{c.title}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed">{c.description}</p>
                          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100 flex justify-between">
                            <span>Category: {c.category}</span>
                            <span>{c.submittedDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lodge a Complaint Form */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-stone-900">Submit a New Inquiry / Grievance</h3>
                      <p className="text-xs text-stone-500">
                        All submissions are confidentially reviewed by the Principal within 48 business hours.
                      </p>

                      {complaintSubmitted ? (
                        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 size={16} /> Grievance registered successfully with ticket ref SIR-MV-2026-0063!
                        </div>
                      ) : (
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="font-bold text-stone-700 block mb-1">Grievance Category</label>
                            <select
                              value={newComplaintCategory}
                              onChange={(e) => setNewComplaintCategory(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none"
                            >
                              <option value="Academic">Academic / Lecture Quality</option>
                              <option value="Infrastructure">Classroom & Lab Facilities</option>
                              <option value="Examination">Internal Marks & Exam Scheduling</option>
                              <option value="Hostel">Hostel & Dining Hall</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-stone-700 block mb-1">Detailed Explanation</label>
                            <textarea
                              rows={4}
                              value={newComplaintText}
                              onChange={(e) => setNewComplaintText(e.target.value)}
                              placeholder="Please describe the incident or facility issue clearly..."
                              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none resize-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              if (newComplaintText.trim()) {
                                setComplaintSubmitted(true);
                              }
                            }}
                            className="w-full py-2.5 rounded-2xl font-bold text-xs text-white bg-[#A60000] hover:bg-[#650000] transition apple-button-primary shadow-sm"
                          >
                            Submit Confidential Grievance
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  CLASSES & LECTURE HALLS MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'classes' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          DEPARTMENT CLASSROOM & LAB INFRASTRUCTURE
                        </h2>
                        <p className="text-xs text-stone-500">
                          Active smart lecture halls and computer science laboratories
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                      ● 6 Smart Rooms Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { name: 'Room 301 (Smart Hall)', type: 'Lecture Hall', cap: 60, current: '5th Sem Sec A (Algorithms)', faculty: 'Dr. Priya Nayak', status: 'In Session' },
                      { name: 'Room 204 (Audiovisual)', type: 'Lecture Hall', cap: 60, current: '5th Sem Sec B (Operating Systems)', faculty: 'Prof. Ravi Shankar', status: 'In Session' },
                      { name: 'Room 102 (Sciences)', type: 'Seminar Room', cap: 45, current: 'Physics & CET Special Batch', faculty: 'Prof. Ananth K', status: 'Vacant' },
                      { name: 'CS Lab 2 (Linux Cluster)', type: 'High Performance Lab', cap: 50, current: 'Data Structures Practical Slot', faculty: 'Lab Asst. Raghavan', status: 'Lab Running' },
                      { name: 'Electronics & Microprocessor Lab', type: 'Hardware Lab', cap: 40, current: 'Embedded Systems Batch', faculty: 'Prof. Meenakshi S', status: 'In Session' },
                      { name: 'Central Seminar Auditorium', type: 'Executive Auditorium', cap: 250, current: 'Campus Guest Lecture (Nov 15)', faculty: 'Principal Suresh', status: 'Reserved' },
                    ].map((room, idx) => (
                      <div key={idx} className="apple-card p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              {room.type}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              room.status === 'In Session' || room.status === 'Lab Running' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'
                            }`}>
                              ● {room.status}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-base text-stone-900">{room.name}</h3>
                          <p className="text-xs text-[#A60000] font-bold mt-1">{room.current}</p>
                          <p className="text-xs text-stone-500 mt-2">Faculty in-charge: <strong>{room.faculty}</strong></p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                          <span>Seating: {room.cap} seats</span>
                          <span className="font-bold text-stone-800">Smart Projector Enabled</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  BATCHES MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'batches' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          COHORT BATCH ORGANIZATION HIERARCHY
                        </h2>
                        <p className="text-xs text-stone-500">
                          5th Semester Computer Science Academic Cohorts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section A Card */}
                    <div className="apple-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                          Section A • Core CSE
                        </span>
                        <span className="text-xs font-bold text-stone-400">Room 301</span>
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">
                        <AnimatedCounter value={50} duration={800} /> Enrolled Students
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Rolls: 23CSE001 – 23CSE050. Mentored by Dr. Priya Nayak. Specialization track in Algorithms and Data Structures.
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 uppercase block">Board Avg</span>
                          <strong className="text-stone-900 text-sm">518 / 600</strong>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 uppercase block">Attendance</span>
                          <strong className="text-green-700 text-sm">88.2%</strong>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 uppercase block">Top Rank</span>
                          <strong className="text-[#A60000] text-sm">Rank #1</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveModule('students'); setStudentSectionFilter('A'); }}
                        className="w-full py-2.5 rounded-2xl font-bold text-xs text-white bg-[#A60000] transition apple-button"
                      >
                        Browse Section A Roster (50) →
                      </button>
                    </div>

                    {/* Section B Card */}
                    <div className="apple-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                          Section B • AI & Systems
                        </span>
                        <span className="text-xs font-bold text-stone-400">Room 204</span>
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">
                        <AnimatedCounter value={50} duration={800} /> Enrolled Students
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Rolls: 23CSE051 – 23CSE100. Mentored by Prof. Ravi Shankar. Specialization track in Operating Systems and Machine Learning.
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 uppercase block">Board Avg</span>
                          <strong className="text-stone-900 text-sm">506 / 600</strong>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 uppercase block">Attendance</span>
                          <strong className="text-green-700 text-sm">84.6%</strong>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 uppercase block">Top Rank</span>
                          <strong className="text-[#A60000] text-sm">Rank #3</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveModule('students'); setStudentSectionFilter('B'); }}
                        className="w-full py-2.5 rounded-2xl font-bold text-xs text-white bg-[#500000] transition apple-button"
                      >
                        Browse Section B Roster (50) →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  QUESTIONS BANK MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'questions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>

                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          CURATED QUESTION BANK & MCQ SOLVER
                        </h2>
                        <p className="text-xs text-stone-500">
                          Click any option A, B, C, or D to verify answer keys with instant diagnostic explanations
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                      4 Sample Questions
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        subject: 'Data Structures & Algorithms',
                        q: 'What is the worst-case time complexity of searching an element in an AVL tree with n nodes?',
                        options: ['A) O(n)', 'B) O(log n)', 'C) O(n log n)', 'D) O(1)'],
                        correct: 'B',
                        explanation: 'AVL trees are strictly height-balanced BSTs where height is guaranteed to be O(log n), making worst-case search O(log n).'
                      },
                      {
                        id: 2,
                        subject: 'Operating Systems',
                        q: 'Which scheduling algorithm is non-preemptive and minimizes average waiting time for a given set of processes?',
                        options: ['A) Round Robin', 'B) First-Come First-Served', 'C) Shortest Job First (SJF)', 'D) Priority Scheduling'],
                        correct: 'C',
                        explanation: 'SJF gives the theoretically minimal average waiting time for non-preemptive CPU scheduling.'
                      },
                      {
                        id: 3,
                        subject: 'Theory of Computation',
                        q: 'The language L = {a^n b^n | n >= 0} is recognized by which machine model?',
                        options: ['A) Deterministic Finite Automaton (DFA)', 'B) Non-deterministic Pushdown Automaton (NPDA)', 'C) Mealy Machine', 'D) Moore Machine'],
                        correct: 'B',
                        explanation: 'L is a deterministic context-free language requiring a single stack memory, hence handled by PDA.'
                      },
                    ].map((item) => {
                      const selected = selectedQuestionAnswer[item.id];
                      return (
                        <div key={item.id} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {item.subject}
                            </span>
                            <span className="text-xs font-mono font-bold text-stone-400">Q#{item.id}</span>
                          </div>

                          <h4 className="font-extrabold text-sm md:text-base text-stone-900 leading-snug">
                            {item.q}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {item.options.map((opt, optIdx) => {
                              const letter = opt.charAt(0);
                              const isPicked = selected === letter;
                              const isCorrect = letter === item.correct;

                              let btnStyle = 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100';
                              if (selected) {
                                if (isCorrect) btnStyle = 'bg-green-100 border-green-300 text-green-900 font-bold';
                                else if (isPicked) btnStyle = 'bg-red-100 border-red-300 text-red-900 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => setSelectedQuestionAnswer(prev => ({ ...prev, [item.id]: letter }))}
                                  className={`p-3 rounded-2xl border text-left text-xs transition apple-button flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {selected && isCorrect && <Check size={14} className="text-green-700" />}
                                </button>
                              );
                            })}
                          </div>

                          {selected && (
                            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                              <strong className="text-stone-900 block mb-0.5">Faculty Explanation:</strong>
                              {item.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  SETTINGS MODULE
                  ───────────────────────────────────────────────────────────── */}
              {activeModule === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveModule('dashboard')}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition apple-button"
                      >
                        <ArrowLeft size={16} />
                      </button>

                      <div>
                        <h2 className="font-extrabold text-xl text-stone-900 tracking-tight">
                          CAMPUS ERP & PREFERENCES SETTINGS
                        </h2>
                        <p className="text-xs text-stone-500">
                          Active profile: {activeProfile.name} • {activeProfile.campus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="apple-card p-6 space-y-4">
                      <h3 className="font-extrabold text-base text-stone-900">Institutional Preferences</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between py-2 border-b border-stone-100">
                          <div>
                            <strong className="block text-stone-800">Campus Code</strong>
                            <span className="text-stone-400">Shivamogga PUC (SMG-01)</span>
                          </div>
                          <span className="font-bold text-[#A60000]">Active</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-stone-100">
                          <div>
                            <strong className="block text-stone-800">Academic Year</strong>
                            <span className="text-stone-400">2026 – 2027 Odd Semester</span>
                          </div>
                          <span className="font-bold text-stone-800">Odd Sem</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-stone-100">
                          <div>
                            <strong className="block text-stone-800">Apple OS Physics & Bulge Animations</strong>
                            <span className="text-stone-400">Framer Motion Spring Ease</span>
                          </div>
                          <span className="font-bold text-green-700">● Enabled</span>
                        </div>
                      </div>
                    </div>

                    <div className="apple-card p-6 space-y-4">
                      <h3 className="font-extrabold text-base text-stone-900">Notification Feeds</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between py-2 border-b border-stone-100">
                          <div>
                            <strong className="block text-stone-800">Exam Results Broadcast</strong>
                            <span className="text-stone-400">SMS & In-app alerts</span>
                          </div>
                          <span className="font-bold text-green-700">Instant</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-stone-100">
                          <div>
                            <strong className="block text-stone-800">Attendance Warning Threshold</strong>
                            <span className="text-stone-400">Alert below 75% VTU statutory minimum</span>
                          </div>
                          <span className="font-bold text-[#A60000]">75% Threshold</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-stone-100">
                          <div>
                            <strong className="block text-stone-800">Direct Portal Role</strong>
                            <span className="text-stone-400">{activeProfile.title}</span>
                          </div>
                          <span className="font-bold text-blue-700">{activeProfile.roleBadge}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  ADMIN / TAB MANAGEMENT MODULE VIEWS (Sections 1-5)
                  ───────────────────────────────────────────────────────────── */}
              {activeModule.startsWith('adm_') && (
                <AdminModuleView
                  moduleId={activeModule}
                  onBack={() => setActiveModule('dashboard')}
                />
              )}

              {/* ─────────────────────────────────────────────────────────────
                  OTHER GENERIC MODULES FALLBACK
                  ───────────────────────────────────────────────────────────── */}
              {!activeModule.startsWith('adm_') &&
                activeModule !== 'dashboard' &&
                activeModule !== 'students' &&
                activeModule !== 'staffs' &&
                activeModule !== 'reports' &&
                activeModule !== 'attendance' &&
                activeModule !== 'announcements' &&
                activeModule !== 'noticeboard' &&
                activeModule !== 'tests' &&
                activeModule !== 'exam_management' &&
                activeModule !== 'leaderboard' &&
                activeModule !== 'notes' &&
                activeModule !== 'board_marks' &&
                activeModule !== 'materials' &&
                activeModule !== 'timetable' &&
                activeModule !== 'complaints' &&
                activeModule !== 'reported_issues' &&
                activeModule !== 'classes' &&
                activeModule !== 'batches' &&
                activeModule !== 'questions' &&
                activeModule !== 'settings' && (
                <div className="bg-white rounded-3xl p-8 border border-stone-200/80 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-stone-100 mx-auto flex items-center justify-center">
                    {(() => {
                      const m = SIDEBAR_MENU_ITEMS.find(i => i.id === activeModule);
                      const Icon = m?.icon || IconClasses;
                      return <Icon size={36} />;
                    })()}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl text-stone-900 capitalize">
                      {activeModule.replace('_', ' ')} Module
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                      Active operational register for {activeProfile.title} ({activeProfile.campus}).
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModule('dashboard')}
                    className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#A60000] hover:bg-[#650000] transition apple-button-primary shadow-sm"
                  >
                    Return to Workspace Dashboard
                  </button>
                </div>
              )}

              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Apple OS Style Student Scorecard Modal (Animates from 0 to Current Marks like 500) */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        sidebarWidth={sidebarExpanded ? 230 : 86}
      />

      {/* Deep Diagnostic Results Review Modal (Right answer ticked, option chosen, exact time taken) */}
      <ExamMCQReviewModal
        exam={reviewExamModal}
        onClose={() => setReviewExamModal(null)}
        sidebarWidth={sidebarExpanded ? 230 : 86}
      />
    </div>
  );
}
