import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortalProvider } from './context/PortalContext';
import { AuthProvider as CallingAuthProvider } from './calling/context/AuthContext';
import { CallProvider as CallingCallProvider } from './calling/context/CallContext';
import ProtectedRoute from './components/ProtectedRoute';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AnnouncementsPage from './pages/student/AnnouncementsPage';
import ExamsPage from './pages/student/ExamsPage';
import ExamTakingPage from './pages/student/ExamTakingPage';
import ResultsPage from './pages/student/ResultsPage';
import NotesPage from './pages/student/NotesPage';
import StudyMaterialsPage from './pages/student/StudyMaterialsPage';
import TimetablePage from './pages/student/TimetablePage';
import ComplaintsPage from './pages/student/ComplaintsPage';
import AttendancePage from './pages/student/AttendancePage';

// Professor Pages
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import ProfessorAnnouncements from './pages/professor/ProfessorAnnouncements';
import ProfessorLiveExams from './pages/professor/ProfessorLiveExams';
import ProfessorQuestionBank from './pages/professor/ProfessorQuestionBank';
import ProfessorNotesUpload from './pages/professor/ProfessorNotesUpload';
import ProfessorMaterialsUpload from './pages/professor/ProfessorMaterialsUpload';
import ProfessorResults from './pages/professor/ProfessorResults';
import ProfessorAttendance from './pages/professor/ProfessorAttendance';
import ProfessorTimetable from './pages/professor/ProfessorTimetable';
import ProfessorFeedback from './pages/professor/ProfessorFeedback';

// Unified Academic ERP Portal (Zero login wall, default Principal, vertical navigation dock with bulging animations)
import ERPPortalPage from './pages/ERPPortalPage';

export default function App() {
  return (
    <AuthProvider>
      <CallingAuthProvider>
        <CallingCallProvider>
          <PortalProvider>
            <Router>
              <Routes>
                {/* Primary Unified ERP Portal Route (Direct access, no login wall, defaults to Principal) */}
                <Route path="/" element={<ERPPortalPage />} />
                <Route path="/portal" element={<ERPPortalPage />} />
                <Route path="/erp" element={<ERPPortalPage />} />

                {/* Student Routes (Directly mapped to ERP Portal with Student Role and Vertical Dock) */}
                <Route path="/student/dashboard" element={<ERPPortalPage initialRole="student" initialModule="dashboard" />} />
                <Route path="/student/announcements" element={<ERPPortalPage initialRole="student" initialModule="announcements" />} />
                <Route path="/student/exams" element={<ERPPortalPage initialRole="student" initialModule="tests" />} />
                <Route path="/student/take-exam" element={<ERPPortalPage initialRole="student" initialModule="tests" />} />
                <Route path="/student/results" element={<ERPPortalPage initialRole="student" initialModule="reports" />} />
                <Route path="/student/notes" element={<ERPPortalPage initialRole="student" initialModule="notes" />} />
                <Route path="/student/materials" element={<ERPPortalPage initialRole="student" initialModule="materials" />} />
                <Route path="/student/timetable" element={<ERPPortalPage initialRole="student" initialModule="timetable" />} />
                <Route path="/student/calendar" element={<ERPPortalPage initialRole="student" initialModule="college_calendar" />} />
                <Route path="/student/attendance" element={<ERPPortalPage initialRole="student" initialModule="attendance" />} />
                <Route path="/student/complaints" element={<ERPPortalPage initialRole="student" initialModule="complaints" />} />
                <Route path="/student/*" element={<ERPPortalPage initialRole="student" />} />

                {/* Professor / Faculty Routes */}
                <Route path="/professor/dashboard" element={<ERPPortalPage initialRole="teacher" initialModule="dashboard" />} />
                <Route path="/professor/*" element={<ERPPortalPage initialRole="teacher" />} />

                {/* Fallback to ERP Portal */}
                <Route path="*" element={<ERPPortalPage />} />
              </Routes>
            </Router>
          </PortalProvider>
        </CallingCallProvider>
      </CallingAuthProvider>
    </AuthProvider>
  );
}
