// Types for the Sir MV College Portal

export type UserRole = 'student' | 'professor';

export interface StudentUser {
  id: string;
  role: 'student';
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  section: string;
  email: string;
  phone: string;
  profilePic?: string;
}

export interface ProfessorUser {
  id: string;
  role: 'professor';
  name: string;
  email: string;
  department: string;
  designation: string;
  subjects: string[];
  profilePic?: string;
}

export type AuthUser = StudentUser | ProfessorUser;

export interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginCredentials {
  identifier: string; // roll number or email
  password: string;
  role: UserRole;
}

export interface Announcement {
  id: string;
  senderName: string;
  designation: string;
  department: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  isUrgent: boolean;
  targetRole: 'student' | 'professor' | 'all';
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  teacherName: string;
  startDate: string;
  startTime: string;
  duration: number; // minutes
  totalMarks: number;
  totalQuestions: number;
  status: 'upcoming' | 'live' | 'completed' | 'demo';
  category: 'JEE' | 'NEET' | 'CET' | 'Theory' | 'Internal';
  isDemo: boolean;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: MCQOption[];
  correctOptionId: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  negativeMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  category: string;
  date: string;
  totalMarks: number;
  marksObtained: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeTaken: number; // seconds
  totalQuestions: number;
  questionWiseResult: QuestionResult[];
  isDemo: boolean;
}

export interface QuestionResult {
  questionId: string;
  question: MCQQuestion;
  selectedOptionId: string | null;
  timeTaken: number; // seconds
  isCorrect: boolean;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  uploadedBy: string;
  uploadedByRole: string;
  uploadDate: string;
  fileType: 'PDF' | 'DOC' | 'PPT';
  fileSize: string;
  description: string;
  isDemo: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  topic: string;
  category: 'JEE' | 'NEET' | 'CET' | 'Theory' | 'General';
  resourceType: 'PDF' | 'Video' | 'PPT' | 'Link' | 'Worksheet';
  uploadedBy: string;
  uploadDate: string;
  description: string;
  fileSize?: string;
  duration?: string; // for videos
  isDemo: boolean;
}

export interface SubjectAttendance {
  subject: string;
  subjectCode: string;
  teacherName: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'holiday' | 'exam';
  subject?: string;
}

export interface Complaint {
  id: string;
  referenceNumber: string;
  category: string;
  title: string;
  description: string;
  submittedDate: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  hasAttachment: boolean;
}

export interface TimetableEntry {
  day: string;
  period: number;
  time: string;
  subject: string;
  teacherName: string;
  room: string;
  type: 'lecture' | 'lab' | 'free';
}

export interface CalendarEvent {
  date: string;
  title: string;
  type: 'exam' | 'holiday' | 'assignment' | 'practical' | 'event';
  description: string;
}

export interface PracticeConfig {
  examType: string;
  subject: string;
  topics: string[];
  numQuestions: number;
  difficulty: string;
}

