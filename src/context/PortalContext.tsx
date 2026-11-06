import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Announcement, Exam, ExamResult, Note, StudyMaterial,
  SubjectAttendance, Complaint, MCQQuestion, TimetableEntry, CalendarEvent
} from '../types';
import {
  DEMO_ANNOUNCEMENTS, DEMO_EXAMS, DEMO_RESULTS, DEMO_NOTES,
  DEMO_MATERIALS, DEMO_SUBJECT_ATTENDANCE, DEMO_COMPLAINTS,
  DEMO_MCQ_QUESTIONS, DEMO_TIMETABLE, DEMO_EVENTS, DEMO_DETAILED_RESULT
} from '../data';

interface PortalContextType {
  announcements: Announcement[];
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'isRead'>) => void;
  deleteAnnouncement: (id: string) => void;

  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id' | 'isDemo'>) => void;

  results: ExamResult[];
  addResult: (result: ExamResult) => void;
  getResultById: (id: string) => ExamResult | undefined;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'isDemo'>) => void;
  deleteNote: (id: string) => void;

  studyMaterials: StudyMaterial[];
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'isDemo'>) => void;
  deleteStudyMaterial: (id: string) => void;

  complaints: Complaint[];
  addComplaint: (complaint: { category: string; title: string; description: string; hasAttachment: boolean }) => Complaint;
  updateComplaintStatus: (id: string, status: 'Submitted' | 'Under Review' | 'Resolved') => void;

  subjectAttendance: SubjectAttendance[];
  markAttendance: (subjectCode: string, presentStudentIds: string[]) => void;

  mcqQuestions: MCQQuestion[];
  addMCQQuestion: (q: Omit<MCQQuestion, 'id'>) => void;

  timetable: TimetableEntry[];
  events: CalendarEvent[];

  // Active exam session
  activeExamSession: {
    examName: string;
    category: string;
    subject: string;
    questions: MCQQuestion[];
    durationMinutes: number;
  } | null;
  startExamSession: (session: { examName: string; category: string; subject: string; questions: MCQQuestion[]; durationMinutes: number }) => void;
  clearExamSession: () => void;
}

const PortalContext = createContext<PortalContextType | null>(null);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage', e);
  }
}

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadFromStorage('sir_mv_announcements', DEMO_ANNOUNCEMENTS)
  );

  const [exams, setExams] = useState<Exam[]>(() =>
    loadFromStorage('sir_mv_exams', DEMO_EXAMS)
  );

  const [results, setResults] = useState<ExamResult[]>(() => {
    const saved = loadFromStorage<ExamResult[]>('sir_mv_results', DEMO_RESULTS);
    // Ensure the detailed result exists in list
    const hasDetailed = saved.some(r => r.id === DEMO_DETAILED_RESULT.id);
    if (!hasDetailed) {
      return [DEMO_DETAILED_RESULT, ...saved];
    }
    return saved;
  });

  const [notes, setNotes] = useState<Note[]>(() =>
    loadFromStorage('sir_mv_notes', DEMO_NOTES)
  );

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() =>
    loadFromStorage('sir_mv_materials', DEMO_MATERIALS)
  );

  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadFromStorage('sir_mv_complaints', DEMO_COMPLAINTS)
  );

  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>(() =>
    loadFromStorage('sir_mv_attendance', DEMO_SUBJECT_ATTENDANCE)
  );

  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>(() =>
    loadFromStorage('sir_mv_questions', DEMO_MCQ_QUESTIONS)
  );

  const [timetable] = useState<TimetableEntry[]>(DEMO_TIMETABLE);
  const [events] = useState<CalendarEvent[]>(DEMO_EVENTS);

  const [activeExamSession, setActiveExamSession] = useState<{
    examName: string;
    category: string;
    subject: string;
    questions: MCQQuestion[];
    durationMinutes: number;
  } | null>(null);

  // Sync to storage
  useEffect(() => { saveToStorage('sir_mv_announcements', announcements); }, [announcements]);
  useEffect(() => { saveToStorage('sir_mv_exams', exams); }, [exams]);
  useEffect(() => { saveToStorage('sir_mv_results', results); }, [results]);
  useEffect(() => { saveToStorage('sir_mv_notes', notes); }, [notes]);
  useEffect(() => { saveToStorage('sir_mv_materials', studyMaterials); }, [studyMaterials]);
  useEffect(() => { saveToStorage('sir_mv_complaints', complaints); }, [complaints]);
  useEffect(() => { saveToStorage('sir_mv_attendance', subjectAttendance); }, [subjectAttendance]);
  useEffect(() => { saveToStorage('sir_mv_questions', mcqQuestions); }, [mcqQuestions]);

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAnnouncementsAsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const addAnnouncement = (newA: Omit<Announcement, 'id' | 'date' | 'isRead'>) => {
    const item: Announcement = {
      ...newA,
      id: 'ann_' + Date.now(),
      date: new Date().toISOString(),
      isRead: false,
    };
    setAnnouncements(prev => [item, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addExam = (newE: Omit<Exam, 'id' | 'isDemo'>) => {
    const item: Exam = {
      ...newE,
      id: 'exam_' + Date.now(),
      isDemo: true,
    };
    setExams(prev => [item, ...prev]);
  };

  const addResult = (newR: ExamResult) => {
    setResults(prev => [newR, ...prev]);
  };

  const getResultById = (id: string): ExamResult | undefined => {
    if (id === DEMO_DETAILED_RESULT.id) return DEMO_DETAILED_RESULT;
    return results.find(r => r.id === id);
  };

  const addNote = (newN: Omit<Note, 'id' | 'isDemo'>) => {
    const item: Note = {
      ...newN,
      id: 'note_' + Date.now(),
      isDemo: true,
    };
    setNotes(prev => [item, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addStudyMaterial = (newM: Omit<StudyMaterial, 'id' | 'isDemo'>) => {
    const item: StudyMaterial = {
      ...newM,
      id: 'mat_' + Date.now(),
      isDemo: true,
    };
    setStudyMaterials(prev => [item, ...prev]);
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
  };

  const addComplaint = (c: { category: string; title: string; description: string; hasAttachment: boolean }): Complaint => {
    const refNum = `SIR-MV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newComplaint: Complaint = {
      id: 'comp_' + Date.now(),
      referenceNumber: refNum,
      category: c.category,
      title: c.title,
      description: c.description,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      hasAttachment: c.hasAttachment,
    };
    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: 'Submitted' | 'Under Review' | 'Resolved') => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const markAttendance = (subjectCode: string, presentStudentIds: string[]) => {
    setSubjectAttendance(prev => prev.map(s => {
      if (s.subjectCode === subjectCode) {
        const isPresent = presentStudentIds.includes('s001') || presentStudentIds.includes('23CSE001');
        return {
          ...s,
          totalClasses: s.totalClasses + 1,
          attendedClasses: isPresent ? s.attendedClasses + 1 : s.attendedClasses,
        };
      }
      return s;
    }));
  };

  const addMCQQuestion = (q: Omit<MCQQuestion, 'id'>) => {
    const item: MCQQuestion = {
      ...q,
      id: 'q_' + Date.now(),
    };
    setMcqQuestions(prev => [...prev, item]);
  };

  const startExamSession = (session: { examName: string; category: string; subject: string; questions: MCQQuestion[]; durationMinutes: number }) => {
    setActiveExamSession(session);
  };

  const clearExamSession = () => {
    setActiveExamSession(null);
  };

  return (
    <PortalContext.Provider
      value={{
        announcements,
        markAnnouncementAsRead,
        markAllAnnouncementsAsRead,
        addAnnouncement,
        deleteAnnouncement,
        exams,
        addExam,
        results,
        addResult,
        getResultById,
        notes,
        addNote,
        deleteNote,
        studyMaterials,
        addStudyMaterial,
        deleteStudyMaterial,
        complaints,
        addComplaint,
        updateComplaintStatus,
        subjectAttendance,
        markAttendance,
        mcqQuestions,
        addMCQQuestion,
        timetable,
        events,
        activeExamSession,
        startExamSession,
        clearExamSession,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

