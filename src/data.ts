// Demo Data for Sir MV College Portal

import type {
  StudentUser, ProfessorUser, Announcement, Exam, ExamResult,
  Note, StudyMaterial, SubjectAttendance, AttendanceRecord,
  Complaint, TimetableEntry, CalendarEvent, MCQQuestion
} from './types';

// ─── AUTH USERS ──────────────────────────────────────────────────────────────

export const DEMO_STUDENT: StudentUser = {
  id: 's001',
  role: 'student',
  name: 'Rahul Sharma',
  rollNumber: '23CSE001',
  department: 'Computer Science Engineering',
  semester: 5,
  section: 'A',
  email: 'rahul.sharma@sirmv.edu.in',
  phone: '+91 98765 43210',
};

export const DEMO_PROFESSOR: ProfessorUser = {
  id: 'p001',
  role: 'professor',
  name: 'Dr. Priya Nayak',
  email: 'priya.nayak@sirmv.edu.in',
  department: 'Computer Science Engineering',
  designation: 'Associate Professor',
  subjects: ['Data Structures', 'Algorithms', 'Theory of Computation'],
};

export const STUDENT_CREDENTIALS = {
  identifier: '23CSE001',
  password: 'student123',
};

export const PROFESSOR_CREDENTIALS = {
  identifier: 'priya.nayak@sirmv.edu.in',
  password: 'prof123',
};

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    senderName: 'Dr. K. Suresh Kumar',
    designation: 'Principal',
    department: 'Administration',
    title: 'Internal Examination Schedule – Semester 5',
    message: 'All students of Semester 5 are hereby informed that the Internal Assessment Examinations (IA-2) will be conducted from 18th November to 25th November 2026. Students must carry their Hall Tickets. Attendance in examinations is compulsory. Students with less than 75% attendance will not be permitted to appear for the examination without prior approval.',
    date: '2026-11-05T10:00:00',
    isRead: false,
    isUrgent: true,
    targetRole: 'all',
  },
  {
    id: 'a2',
    senderName: 'Prof. Ravi Shankar',
    designation: 'Head of Department',
    department: 'Computer Science Engineering',
    title: 'New Study Materials Uploaded – Data Structures Unit 4',
    message: 'Students of 5th Semester CSE, Unit 4 study materials for Data Structures have been uploaded to the portal. Please download and prepare for the upcoming internal examination. The materials include detailed notes, previous year questions and practice problems.',
    date: '2026-11-04T14:30:00',
    isRead: false,
    isUrgent: false,
    targetRole: 'student',
  },
  {
    id: 'a3',
    senderName: 'Dr. Priya Nayak',
    designation: 'Associate Professor',
    department: 'Computer Science Engineering',
    title: 'Theory of Computation – Assignment Deadline Extended',
    message: 'The deadline for Theory of Computation Assignment 3 has been extended to 12th November 2026. Students are requested to submit their assignments via the portal only. Late submissions will not be accepted after the deadline. The assignment must include all five questions with detailed explanations.',
    date: '2026-11-03T09:15:00',
    isRead: true,
    isUrgent: false,
    targetRole: 'student',
  },
  {
    id: 'a4',
    senderName: 'Dr. K. Suresh Kumar',
    designation: 'Principal',
    department: 'Administration',
    title: 'College Annual Day Celebration – 20th November 2026',
    message: 'All students and staff are cordially invited to the Annual Day Celebration to be held on 20th November 2026 at the college auditorium. The event will begin at 10:00 AM. Students participating in cultural activities must register with the student council before 10th November.',
    date: '2026-11-02T11:00:00',
    isRead: true,
    isUrgent: false,
    targetRole: 'all',
  },
  {
    id: 'a5',
    senderName: 'Prof. Anitha Rao',
    designation: 'Associate Professor',
    department: 'Computer Science Engineering',
    title: 'URGENT: Python Lab Record Submission – Tomorrow',
    message: 'All students are required to submit their completed Python Lab Records tomorrow (7th November 2026) before 2:00 PM. Students who fail to submit will be marked absent for that practical session. Incomplete records will not be accepted.',
    date: '2026-11-06T08:00:00',
    isRead: false,
    isUrgent: true,
    targetRole: 'student',
  },
  {
    id: 'a6',
    senderName: 'Prof. Ravi Shankar',
    designation: 'Head of Department',
    department: 'Computer Science Engineering',
    title: 'Industry Visit – Infosys Bangalore (Registration Open)',
    message: 'An industry visit to Infosys, Electronic City, Bangalore is scheduled for 25th November 2026. Interested students must register through the HOD office by 15th November. Only 30 seats are available. Priority will be given to students with CGPA above 7.5. Transport will be provided by the college.',
    date: '2026-11-01T16:00:00',
    isRead: true,
    isUrgent: false,
    targetRole: 'student',
  },
];

// ─── EXAMS ───────────────────────────────────────────────────────────────────

export const DEMO_EXAMS: Exam[] = [
  {
    id: 'e1',
    name: 'JEE Mock Test – Series 03 [DEMO]',
    subject: 'Physics, Chemistry, Mathematics',
    teacherName: 'Dr. Priya Nayak',
    startDate: '2026-11-10',
    startTime: '09:00',
    duration: 180,
    totalMarks: 300,
    totalQuestions: 90,
    status: 'demo',
    category: 'JEE',
    isDemo: true,
  },
  {
    id: 'e2',
    name: 'CET Practice Paper – Set 01 [DEMO]',
    subject: 'Physics, Chemistry, Mathematics',
    teacherName: 'Prof. Suresh Babu',
    startDate: '2026-11-12',
    startTime: '10:00',
    duration: 90,
    totalMarks: 180,
    totalQuestions: 60,
    status: 'demo',
    category: 'CET',
    isDemo: true,
  },
  {
    id: 'e3',
    name: 'Data Structures – Internal Assessment [DEMO]',
    subject: 'Data Structures',
    teacherName: 'Dr. Priya Nayak',
    startDate: '2026-11-18',
    startTime: '11:00',
    duration: 60,
    totalMarks: 30,
    totalQuestions: 30,
    status: 'demo',
    category: 'Theory',
    isDemo: true,
  },
];

// ─── MCQ QUESTIONS ────────────────────────────────────────────────────────────

export const DEMO_MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    questionText: "Newton's second law of motion states that the net force on an object is equal to:",
    options: [
      { id: 'A', text: 'F = ma' },
      { id: 'B', text: 'F = mv' },
      { id: 'C', text: 'F = m/a' },
      { id: 'D', text: 'F = a/m' },
    ],
    correctOptionId: 'A',
    subject: 'Physics',
    topic: 'Laws of Motion',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q2',
    questionNumber: 2,
    questionText: "The SI unit of electric charge is:",
    options: [
      { id: 'A', text: 'Ampere' },
      { id: 'B', text: 'Coulomb' },
      { id: 'C', text: 'Volt' },
      { id: 'D', text: 'Watt' },
    ],
    correctOptionId: 'B',
    subject: 'Physics',
    topic: 'Electrostatics',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q3',
    questionNumber: 3,
    questionText: "The molar mass of water (H₂O) is approximately:",
    options: [
      { id: 'A', text: '16 g/mol' },
      { id: 'B', text: '18 g/mol' },
      { id: 'C', text: '20 g/mol' },
      { id: 'D', text: '22 g/mol' },
    ],
    correctOptionId: 'B',
    subject: 'Chemistry',
    topic: 'Basic Concepts',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q4',
    questionNumber: 4,
    questionText: "If f(x) = x³ - 3x² + 2, then f'(x) equals:",
    options: [
      { id: 'A', text: '3x² - 6x' },
      { id: 'B', text: 'x² - 6x' },
      { id: 'C', text: '3x² - 3x' },
      { id: 'D', text: '3x - 6' },
    ],
    correctOptionId: 'A',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q5',
    questionNumber: 5,
    questionText: "The speed of light in vacuum is approximately:",
    options: [
      { id: 'A', text: '3 × 10⁶ m/s' },
      { id: 'B', text: '3 × 10⁷ m/s' },
      { id: 'C', text: '3 × 10⁸ m/s' },
      { id: 'D', text: '3 × 10⁹ m/s' },
    ],
    correctOptionId: 'C',
    subject: 'Physics',
    topic: 'Wave Optics',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q6',
    questionNumber: 6,
    questionText: "Which of the following is a noble gas?",
    options: [
      { id: 'A', text: 'Nitrogen' },
      { id: 'B', text: 'Oxygen' },
      { id: 'C', text: 'Argon' },
      { id: 'D', text: 'Chlorine' },
    ],
    correctOptionId: 'C',
    subject: 'Chemistry',
    topic: 'Periodic Table',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q7',
    questionNumber: 7,
    questionText: "The roots of the equation x² - 5x + 6 = 0 are:",
    options: [
      { id: 'A', text: '1 and 6' },
      { id: 'B', text: '2 and 3' },
      { id: 'C', text: '-2 and -3' },
      { id: 'D', text: '2 and -3' },
    ],
    correctOptionId: 'B',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q8',
    questionNumber: 8,
    questionText: "The work-energy theorem states that the net work done on an object equals the change in its:",
    options: [
      { id: 'A', text: 'Potential energy' },
      { id: 'B', text: 'Momentum' },
      { id: 'C', text: 'Kinetic energy' },
      { id: 'D', text: 'Force' },
    ],
    correctOptionId: 'C',
    subject: 'Physics',
    topic: 'Work, Energy and Power',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q9',
    questionNumber: 9,
    questionText: "Which law states that the pressure of a gas is inversely proportional to its volume at constant temperature?",
    options: [
      { id: 'A', text: "Charles's Law" },
      { id: 'B', text: "Avogadro's Law" },
      { id: 'C', text: "Boyle's Law" },
      { id: 'D', text: "Gay-Lussac's Law" },
    ],
    correctOptionId: 'C',
    subject: 'Chemistry',
    topic: 'States of Matter',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'q10',
    questionNumber: 10,
    questionText: "If sin θ = 3/5, then cos θ equals:",
    options: [
      { id: 'A', text: '3/4' },
      { id: 'B', text: '4/5' },
      { id: 'C', text: '5/3' },
      { id: 'D', text: '4/3' },
    ],
    correctOptionId: 'B',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1,
  },
];

// ─── EXAM RESULTS ─────────────────────────────────────────────────────────────

export const DEMO_RESULTS: ExamResult[] = [
  {
    id: 'r1',
    examId: 'je1',
    examName: 'JEE Mock Test – Series 01',
    category: 'JEE',
    date: '2026-10-20',
    totalMarks: 300,
    marksObtained: 187,
    correctAnswers: 52,
    incorrectAnswers: 18,
    unattempted: 20,
    timeTaken: 9800,
    totalQuestions: 90,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r2',
    examId: 'je2',
    examName: 'JEE Mock Test – Series 02',
    category: 'JEE',
    date: '2026-10-28',
    totalMarks: 300,
    marksObtained: 212,
    correctAnswers: 58,
    incorrectAnswers: 14,
    unattempted: 18,
    timeTaken: 10200,
    totalQuestions: 90,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r3',
    examId: 'ne1',
    examName: 'NEET Mock Test – Series 01',
    category: 'NEET',
    date: '2026-10-15',
    totalMarks: 720,
    marksObtained: 498,
    correctAnswers: 124,
    incorrectAnswers: 36,
    unattempted: 20,
    timeTaken: 9500,
    totalQuestions: 180,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r4',
    examId: 'ce1',
    examName: 'CET Mock Test – Set 01',
    category: 'CET',
    date: '2026-10-10',
    totalMarks: 180,
    marksObtained: 142,
    correctAnswers: 142,
    incorrectAnswers: 0,
    unattempted: 38,
    timeTaken: 5400,
    totalQuestions: 180,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r5',
    examId: 'ce2',
    examName: 'CET Mock Test – Set 02',
    category: 'CET',
    date: '2026-11-01',
    totalMarks: 180,
    marksObtained: 156,
    correctAnswers: 156,
    incorrectAnswers: 0,
    unattempted: 24,
    timeTaken: 5200,
    totalQuestions: 180,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r6',
    examId: 'phy1',
    examName: 'Physics – Internal Assessment I',
    category: 'Theory',
    date: '2026-09-20',
    totalMarks: 30,
    marksObtained: 24,
    correctAnswers: 24,
    incorrectAnswers: 4,
    unattempted: 2,
    timeTaken: 3600,
    totalQuestions: 30,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r7',
    examId: 'chem1',
    examName: 'Chemistry – Internal Assessment I',
    category: 'Theory',
    date: '2026-09-22',
    totalMarks: 30,
    marksObtained: 22,
    correctAnswers: 22,
    incorrectAnswers: 5,
    unattempted: 3,
    timeTaken: 3600,
    totalQuestions: 30,
    questionWiseResult: [],
    isDemo: true,
  },
  {
    id: 'r8',
    examId: 'math1',
    examName: 'Mathematics – Internal Assessment I',
    category: 'Theory',
    date: '2026-09-25',
    totalMarks: 30,
    marksObtained: 27,
    correctAnswers: 27,
    incorrectAnswers: 2,
    unattempted: 1,
    timeTaken: 3600,
    totalQuestions: 30,
    questionWiseResult: [],
    isDemo: true,
  },
];

// Detailed result for the latest exam
export const DEMO_DETAILED_RESULT: ExamResult = {
  id: 'r2',
  examId: 'je2',
  examName: 'JEE Mock Test – Series 02',
  category: 'JEE',
  date: '2026-10-28',
  totalMarks: 300,
  marksObtained: 212,
  correctAnswers: 58,
  incorrectAnswers: 14,
  unattempted: 18,
  timeTaken: 10200,
  totalQuestions: 90,
  isDemo: true,
  questionWiseResult: DEMO_MCQ_QUESTIONS.map((q, i) => ({
    questionId: q.id,
    question: q,
    selectedOptionId: i === 1 ? 'A' : i === 5 ? null : q.correctOptionId, // mix correct/incorrect/unattempted
    timeTaken: 45 + i * 12,
    isCorrect: i === 1 ? false : i === 5 ? false : true,
  })),
};

// ─── NOTES ────────────────────────────────────────────────────────────────────

export const DEMO_NOTES: Note[] = [
  { id: 'n1', title: 'Data Structures – Unit 4: Trees and Graphs', subject: 'Data Structures', chapter: 'Unit 4', uploadedBy: 'Dr. Priya Nayak', uploadedByRole: 'Associate Professor', uploadDate: '2026-11-04', fileType: 'PDF', fileSize: '2.4 MB', description: 'Complete notes on Binary Trees, BST, AVL Trees and Graph Traversals with examples.', isDemo: true },
  { id: 'n2', title: 'Algorithms – Dynamic Programming Notes', subject: 'Algorithms', chapter: 'Unit 3', uploadedBy: 'Dr. Priya Nayak', uploadedByRole: 'Associate Professor', uploadDate: '2026-10-28', fileType: 'PDF', fileSize: '1.8 MB', description: 'DP concepts, memoization, tabulation with solved problems.', isDemo: true },
  { id: 'n3', title: 'TOC – Regular Languages and Automata', subject: 'Theory of Computation', chapter: 'Unit 1', uploadedBy: 'Prof. Suresh Babu', uploadedByRole: 'Assistant Professor', uploadDate: '2026-10-20', fileType: 'PDF', fileSize: '3.1 MB', description: 'DFA, NFA, Regular Expressions and Pumping Lemma.', isDemo: true },
  { id: 'n4', title: 'Operating Systems – Process Scheduling', subject: 'Operating Systems', chapter: 'Unit 2', uploadedBy: 'Prof. Anitha Rao', uploadedByRole: 'Associate Professor', uploadDate: '2026-10-15', fileType: 'PDF', fileSize: '1.5 MB', description: 'CPU Scheduling algorithms: FCFS, SJF, Round Robin, Priority.', isDemo: true },
  { id: 'n5', title: 'Physics – Electrostatics Chapter Notes', subject: 'Physics', chapter: 'Chapter 1', uploadedBy: 'Prof. Mahesh Kumar', uploadedByRole: 'Assistant Professor', uploadDate: '2026-10-12', fileType: 'PDF', fileSize: '2.0 MB', description: "Coulomb's Law, Electric Field, Potential and Capacitors.", isDemo: true },
  { id: 'n6', title: 'Mathematics – Differential Equations', subject: 'Mathematics', chapter: 'Unit 5', uploadedBy: 'Prof. Kavitha S', uploadedByRole: 'Associate Professor', uploadDate: '2026-10-10', fileType: 'PDF', fileSize: '1.9 MB', description: 'First order and second order differential equations with boundary conditions.', isDemo: true },
  { id: 'n7', title: 'Chemistry – Chemical Bonding Notes', subject: 'Chemistry', chapter: 'Chapter 4', uploadedBy: 'Prof. Rashida Begum', uploadedByRole: 'Assistant Professor', uploadDate: '2026-10-08', fileType: 'PDF', fileSize: '2.2 MB', description: 'Ionic, Covalent, Metallic bonding and VSEPR theory.', isDemo: true },
  { id: 'n8', title: 'English Communication – Technical Writing', subject: 'English', chapter: 'Module 3', uploadedBy: 'Prof. Leela Krishnan', uploadedByRole: 'Assistant Professor', uploadDate: '2026-10-05', fileType: 'DOC', fileSize: '0.8 MB', description: 'Technical writing skills, report writing and email communication.', isDemo: true },
];

// ─── STUDY MATERIALS ─────────────────────────────────────────────────────────

export const DEMO_MATERIALS: StudyMaterial[] = [
  { id: 'm1', title: 'JEE Advanced 2024 – Complete Physics Video Series', subject: 'Physics', chapter: 'Full Syllabus', topic: 'All Topics', category: 'JEE', resourceType: 'Video', uploadedBy: 'Dr. Priya Nayak', uploadDate: '2026-10-30', description: 'Comprehensive video series covering entire JEE Advanced Physics syllabus.', duration: '42 hours', isDemo: true },
  { id: 'm2', title: 'CET 2025 – Previous Year Papers (2015–2024)', subject: 'Physics, Chemistry, Mathematics', chapter: 'All', topic: 'PYQ', category: 'CET', resourceType: 'PDF', uploadedBy: 'Prof. Suresh Babu', uploadDate: '2026-10-25', description: 'Complete collection of Karnataka CET previous year papers with solutions.', fileSize: '15.6 MB', isDemo: true },
  { id: 'm3', title: 'NEET Biology – Cell Biology Presentation', subject: 'Biology', chapter: 'Chapter 8', topic: 'Cell Biology', category: 'NEET', resourceType: 'PPT', uploadedBy: 'Prof. Anitha Rao', uploadDate: '2026-10-22', description: 'Detailed slides on cell structure, organelles and cell division.', fileSize: '8.4 MB', isDemo: true },
  { id: 'm4', title: 'JEE Mathematics – Coordinate Geometry Worksheet', subject: 'Mathematics', chapter: 'Coordinate Geometry', topic: 'Circles and Parabola', category: 'JEE', resourceType: 'Worksheet', uploadedBy: 'Prof. Kavitha S', uploadDate: '2026-10-18', description: 'Practice worksheet with 50 problems on circles and conic sections.', fileSize: '1.2 MB', isDemo: true },
  { id: 'm5', title: 'Data Structures – Algorithm Visualization Links', subject: 'Data Structures', chapter: 'All', topic: 'Algorithm Visualization', category: 'General', resourceType: 'Link', uploadedBy: 'Dr. Priya Nayak', uploadDate: '2026-10-14', description: 'Curated links to interactive algorithm visualizers (VisuAlgo, etc.).', isDemo: true },
  { id: 'm6', title: 'Chemistry – Periodic Table Reference Sheet', subject: 'Chemistry', chapter: 'Periodic Table', topic: 'Element Properties', category: 'General', resourceType: 'PDF', uploadedBy: 'Prof. Rashida Begum', uploadDate: '2026-10-10', description: 'Complete periodic table with element properties, atomic numbers and electron configurations.', fileSize: '0.5 MB', isDemo: true },
  { id: 'm7', title: 'Physics – Formula Handbook for JEE/NEET', subject: 'Physics', chapter: 'All', topic: 'Formulas', category: 'JEE', resourceType: 'PDF', uploadedBy: 'Prof. Mahesh Kumar', uploadDate: '2026-10-05', description: 'All important Physics formulas organized chapter-wise for quick revision.', fileSize: '3.2 MB', isDemo: true },
  { id: 'm8', title: 'TOC – Lecture Videos by NPTEL', subject: 'Theory of Computation', chapter: 'All', topic: 'Complete Course', category: 'Theory', resourceType: 'Link', uploadedBy: 'Prof. Suresh Babu', uploadDate: '2026-09-30', description: 'Links to NPTEL Theory of Computation lecture series.', isDemo: true },
];

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────

export const DEMO_SUBJECT_ATTENDANCE: SubjectAttendance[] = [
  { subject: 'Data Structures', subjectCode: 'CS501', teacherName: 'Dr. Priya Nayak', totalClasses: 42, attendedClasses: 38 },
  { subject: 'Algorithms', subjectCode: 'CS502', teacherName: 'Dr. Priya Nayak', totalClasses: 40, attendedClasses: 36 },
  { subject: 'Theory of Computation', subjectCode: 'CS503', teacherName: 'Prof. Suresh Babu', totalClasses: 38, attendedClasses: 28 },
  { subject: 'Operating Systems', subjectCode: 'CS504', teacherName: 'Prof. Anitha Rao', totalClasses: 44, attendedClasses: 40 },
  { subject: 'Computer Networks', subjectCode: 'CS505', teacherName: 'Prof. Rajan Kumar', totalClasses: 36, attendedClasses: 22 },
  { subject: 'Python Lab', subjectCode: 'CSL501', teacherName: 'Prof. Anitha Rao', totalClasses: 20, attendedClasses: 18 },
  { subject: 'Mathematics', subjectCode: 'MA501', teacherName: 'Prof. Kavitha S', totalClasses: 46, attendedClasses: 44 },
];

// Generate demo attendance calendar data
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const subjects = ['Data Structures', 'Algorithms', 'Operating Systems', 'Mathematics'];
  for (let d = 1; d <= 31; d++) {
    if (d > 6) break; // November 2026, only up to today (6th)
    const dateStr = `2026-11-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(dateStr).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({ date: dateStr, status: 'holiday' });
    } else {
      records.push({ date: dateStr, status: d % 7 === 0 ? 'absent' : 'present', subject: subjects[d % subjects.length] });
    }
  }
  // Add some October data
  for (let d = 1; d <= 31; d++) {
    const dateStr = `2026-10-${String(d).padStart(2, '0')}`;
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) continue;
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        records.push({ date: dateStr, status: 'holiday' });
      } else if (d === 15) {
        records.push({ date: dateStr, status: 'holiday', subject: 'Dussehra Holiday' });
      } else {
        records.push({ date: dateStr, status: d % 8 === 0 ? 'absent' : 'present', subject: subjects[d % subjects.length] });
      }
    } catch { /* skip invalid dates */ }
  }
  return records;
}

export const DEMO_ATTENDANCE_RECORDS: AttendanceRecord[] = generateAttendance();

// ─── COMPLAINTS ───────────────────────────────────────────────────────────────

export const DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    referenceNumber: 'SIR-MV-2026-0045',
    category: 'Academic',
    title: 'Lab Experiment Equipment Not Functioning',
    description: 'The oscilloscopes in the Electronics Lab (Lab 3) are not functioning properly for the past two weeks, affecting practical sessions.',
    submittedDate: '2026-10-25',
    status: 'Resolved',
    hasAttachment: false,
  },
  {
    id: 'c2',
    referenceNumber: 'SIR-MV-2026-0062',
    category: 'Infrastructure',
    title: 'Classroom Projector Not Working – Room 204',
    description: 'The projector in Room 204 (5th Semester CSE classroom) has been non-functional since 1st November, affecting lecture delivery.',
    submittedDate: '2026-11-02',
    status: 'Under Review',
    hasAttachment: true,
  },
];

// ─── TIMETABLE ────────────────────────────────────────────────────────────────

export const DEMO_TIMETABLE: TimetableEntry[] = [
  // Monday
  { day: 'Monday', period: 1, time: '09:00–10:00', subject: 'Data Structures', teacherName: 'Dr. Priya Nayak', room: '301', type: 'lecture' },
  { day: 'Monday', period: 2, time: '10:00–11:00', subject: 'Algorithms', teacherName: 'Dr. Priya Nayak', room: '301', type: 'lecture' },
  { day: 'Monday', period: 3, time: '11:15–12:15', subject: 'Operating Systems', teacherName: 'Prof. Anitha Rao', room: '301', type: 'lecture' },
  { day: 'Monday', period: 4, time: '12:15–13:15', subject: 'Mathematics', teacherName: 'Prof. Kavitha S', room: '301', type: 'lecture' },
  { day: 'Monday', period: 5, time: '14:00–17:00', subject: 'Python Lab', teacherName: 'Prof. Anitha Rao', room: 'Lab 2', type: 'lab' },
  // Tuesday
  { day: 'Tuesday', period: 1, time: '09:00–10:00', subject: 'Theory of Computation', teacherName: 'Prof. Suresh Babu', room: '302', type: 'lecture' },
  { day: 'Tuesday', period: 2, time: '10:00–11:00', subject: 'Computer Networks', teacherName: 'Prof. Rajan Kumar', room: '302', type: 'lecture' },
  { day: 'Tuesday', period: 3, time: '11:15–12:15', subject: 'Data Structures', teacherName: 'Dr. Priya Nayak', room: '302', type: 'lecture' },
  { day: 'Tuesday', period: 4, time: '12:15–13:15', subject: 'Mathematics', teacherName: 'Prof. Kavitha S', room: '302', type: 'lecture' },
  { day: 'Tuesday', period: 5, time: '14:00–15:00', subject: 'Free Period', teacherName: '–', room: '–', type: 'free' },
  // Wednesday
  { day: 'Wednesday', period: 1, time: '09:00–10:00', subject: 'Algorithms', teacherName: 'Dr. Priya Nayak', room: '303', type: 'lecture' },
  { day: 'Wednesday', period: 2, time: '10:00–11:00', subject: 'Operating Systems', teacherName: 'Prof. Anitha Rao', room: '303', type: 'lecture' },
  { day: 'Wednesday', period: 3, time: '11:15–12:15', subject: 'Theory of Computation', teacherName: 'Prof. Suresh Babu', room: '303', type: 'lecture' },
  { day: 'Wednesday', period: 4, time: '12:15–13:15', subject: 'Computer Networks', teacherName: 'Prof. Rajan Kumar', room: '303', type: 'lecture' },
  { day: 'Wednesday', period: 5, time: '14:00–17:00', subject: 'Networks Lab', teacherName: 'Prof. Rajan Kumar', room: 'Lab 3', type: 'lab' },
  // Thursday
  { day: 'Thursday', period: 1, time: '09:00–10:00', subject: 'Data Structures', teacherName: 'Dr. Priya Nayak', room: '301', type: 'lecture' },
  { day: 'Thursday', period: 2, time: '10:00–11:00', subject: 'Mathematics', teacherName: 'Prof. Kavitha S', room: '301', type: 'lecture' },
  { day: 'Thursday', period: 3, time: '11:15–12:15', subject: 'Algorithms', teacherName: 'Dr. Priya Nayak', room: '301', type: 'lecture' },
  { day: 'Thursday', period: 4, time: '12:15–13:15', subject: 'Operating Systems', teacherName: 'Prof. Anitha Rao', room: '301', type: 'lecture' },
  { day: 'Thursday', period: 5, time: '14:00–15:00', subject: 'Free Period', teacherName: '–', room: '–', type: 'free' },
  // Friday
  { day: 'Friday', period: 1, time: '09:00–10:00', subject: 'Theory of Computation', teacherName: 'Prof. Suresh Babu', room: '302', type: 'lecture' },
  { day: 'Friday', period: 2, time: '10:00–11:00', subject: 'Computer Networks', teacherName: 'Prof. Rajan Kumar', room: '302', type: 'lecture' },
  { day: 'Friday', period: 3, time: '11:15–12:15', subject: 'Mathematics', teacherName: 'Prof. Kavitha S', room: '302', type: 'lecture' },
  { day: 'Friday', period: 4, time: '12:15–13:15', subject: 'Data Structures', teacherName: 'Dr. Priya Nayak', room: '302', type: 'lecture' },
  { day: 'Friday', period: 5, time: '14:00–17:00', subject: 'OS Lab', teacherName: 'Prof. Anitha Rao', room: 'Lab 1', type: 'lab' },
];

// ─── CALENDAR EVENTS ──────────────────────────────────────────────────────────

export const DEMO_EVENTS: CalendarEvent[] = [
  { date: '2026-11-10', title: 'JEE Mock Test – Series 03', type: 'exam', description: 'Full-length JEE mock examination in Exam Hall 1' },
  { date: '2026-11-12', title: 'CET Practice Paper', type: 'exam', description: 'CET practice examination' },
  { date: '2026-11-15', title: 'Children\'s Day', type: 'holiday', description: 'National Holiday' },
  { date: '2026-11-18', title: 'IA-2 Examinations Begin', type: 'exam', description: 'Internal Assessment 2 starts' },
  { date: '2026-11-20', title: 'Annual Day Celebration', type: 'event', description: 'College Annual Day at Auditorium, 10:00 AM' },
  { date: '2026-11-25', title: 'IA-2 Examinations End', type: 'exam', description: 'Internal Assessment 2 ends' },
  { date: '2026-11-25', title: 'Industry Visit – Infosys Bangalore', type: 'event', description: 'Industry visit for shortlisted students' },
  { date: '2026-11-30', title: 'TOC Assignment Deadline', type: 'assignment', description: 'Theory of Computation Assignment 3 due' },
  { date: '2026-12-05', title: 'Physics Practical Exam', type: 'practical', description: 'Physics Lab Examination' },
  { date: '2026-12-15', title: 'End of Semester', type: 'event', description: 'Last working day of Semester 5' },
];

