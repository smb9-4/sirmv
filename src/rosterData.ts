// 100 Students and 2 Professors Roster for Deep Academic Analysis

import type { StudentUser, ProfessorUser } from './types';

export interface StudentAnalysisRecord {
  id: string;
  rollNumber: string;
  name: string;
  section: 'A' | 'B';
  email: string;
  phone: string;
  jeeMockScore: number; // out of 300
  physicsScore: number; // out of 100
  chemistryScore: number; // out of 100
  mathScore: number; // out of 100
  cetScore: number; // out of 180
  internalScore: number; // out of 30
  attendancePercentage: number;
  rank: number;
  status: 'Passed' | 'Needs Support';
}

export const PROFESSOR_1: ProfessorUser = {
  id: 'p001',
  role: 'professor',
  name: 'Dr. Priya Nayak',
  email: 'priya.nayak@sirmv.edu.in',
  department: 'Computer Science Engineering',
  designation: 'Associate Professor',
  subjects: ['Data Structures', 'Algorithms', 'Theory of Computation'],
};

export const PROFESSOR_2: ProfessorUser = {
  id: 'p002',
  role: 'professor',
  name: 'Prof. Ravi Shankar',
  email: 'ravi.shankar@sirmv.edu.in',
  department: 'Computer Science Engineering',
  designation: 'Professor & Head of Department (HOD)',
  subjects: ['Operating Systems', 'Computer Networks', 'Software Architecture'],
};

export const DEMO_PROFESSORS: ProfessorUser[] = [PROFESSOR_1, PROFESSOR_2];

// 100 Realistic Student Names
const STUDENT_NAMES: string[] = [
  'Rahul Sharma', 'Aditya Patil', 'Ananya Hegde', 'Bhavana Gowda', 'Chetan Kumar',
  'Deepa Kulkarni', 'Farhan Ahmed', 'Girish Murthy', 'Harini Reddy', 'Ishaan Joshi',
  'Jyothi Rao', 'Karthik Nair', 'Lavanya Iyer', 'Manoj Deshmukh', 'Nidhi Bhat',
  'Omkar Jadhav', 'Pooja Shetty', 'Raghavendra Pai', 'Sneha Kulkarni', 'Tanvi Shinde',
  'Uday Kiran', 'Varun Teja', 'Yashaswini M', 'Zainab Khan', 'Abhishek M',
  'Aishwarya R', 'Akash Biradar', 'Alok Hegde', 'Amrutha Rao', 'Anand Swamy',
  'Ankitha N', 'Anupama V', 'Arjun Nayak', 'Ashwini K', 'Bharath S',
  'Bindu P', 'Chandan K', 'Darshan R', 'Divya B', 'Eashwar M',
  'Gagana R', 'Harish T', 'Indu S', 'Jagadeesh K', 'Keerthi M',
  'Kiran Kumar', 'Lakshmi N', 'Madhu S', 'Meghana R', 'Naveen B',
  'Nithin P', 'Pallavi K', 'Pavithra R', 'Pradeep S', 'Prajwal M',
  'Prashanth K', 'Priya D', 'Puneeth R', 'Rajeshwari B', 'Rakesh N',
  'Rashmi K', 'Rohith M', 'Sahana S', 'Sandeep B', 'Sanjana R',
  'Santosh K', 'Sharath M', 'Shashi Kumar', 'Shilpa N', 'Shreya P',
  'Shrinivas B', 'Sindhu K', 'Somesh R', 'Soumya M', 'Sparsha B',
  'Sudeep K', 'Suhas N', 'Suma R', 'Sunil Kumar', 'Sushma B',
  'Swathi M', 'Tejaswini K', 'Ullas P', 'Vaishnavi S', 'Vasanth R',
  'Vidya B', 'Vijay Kumar', 'Vinay M', 'Vinutha K', 'Vishwas S',
  'Vivek R', 'Yashwanth B', 'Yogesh M', 'Aditi Rao', 'Arvind S',
  'Chaitra M', 'Ganesh K', 'Mamatha R', 'Nagesh B', 'Sunil Gowda'
];

// Deterministic seed-based score generator for 100 students
function generate100Students(): StudentAnalysisRecord[] {
  const records: StudentAnalysisRecord[] = [];

  // Seeded distribution to create realistic spread: top rankers, high average, tail needing support
  const baseScores = [
    268, 262, 258, 254, 250, 246, 242, 238, 235, 231,
    228, 225, 222, 219, 216, 212, 210, 208, 205, 202,
    200, 198, 196, 194, 192, 190, 188, 186, 184, 182,
    180, 178, 176, 174, 172, 170, 168, 166, 164, 162,
    160, 158, 156, 154, 152, 150, 148, 146, 144, 142,
    140, 138, 136, 134, 132, 130, 128, 126, 124, 122,
    120, 118, 116, 114, 112, 110, 108, 106, 104, 102,
    195, 185, 175, 165, 155, 145, 135, 125, 115, 105,
    215, 205, 197, 187, 177, 167, 157, 147, 137, 127,
    98,  94,  90,  86,  82,  78,  74,  70,  66,  62
  ];

  for (let i = 0; i < 100; i++) {
    const rollNumInt = i + 1;
    const rollNumber = `23CSE${String(rollNumInt).padStart(3, '0')}`;
    const name = STUDENT_NAMES[i] || `Student ${rollNumInt}`;
    const section = rollNumInt <= 50 ? 'A' : 'B';

    // Rahul Sharma special case (Roll 23CSE001)
    let jeeMockScore = baseScores[i];
    if (i === 0) {
      jeeMockScore = 212; // preserve Rahul Sharma's documented mock score
    }

    const physicsScore = Math.min(100, Math.max(20, Math.round(jeeMockScore * 0.34)));
    const chemistryScore = Math.min(100, Math.max(18, Math.round(jeeMockScore * 0.31)));
    const mathScore = Math.min(100, Math.max(20, jeeMockScore - physicsScore - chemistryScore));

    const cetScore = Math.min(180, Math.round((jeeMockScore / 300) * 180 + ((i % 7) - 3)));
    const internalScore = Math.min(30, Math.round((jeeMockScore / 300) * 30 + 3));

    // Attendance between 61% and 98%
    const attendancePercentage = i % 8 === 0 ? 68.4 : i % 11 === 0 ? 71.2 : Math.min(98.5, Math.max(62.0, 75 + ((i * 17) % 23) - 3));

    const cleanName = name.toLowerCase().replace(/[^a-z]/g, '.');
    const email = `${cleanName}@sirmv.edu.in`;
    const phone = `+91 ${98000 + i * 11} ${String(10000 + i * 23).slice(-5)}`;

    records.push({
      id: `s${String(rollNumInt).padStart(3, '0')}`,
      rollNumber,
      name,
      section,
      email,
      phone,
      jeeMockScore,
      physicsScore,
      chemistryScore,
      mathScore,
      cetScore,
      internalScore,
      attendancePercentage: Math.round(attendancePercentage * 10) / 10,
      rank: 0, // computed below
      status: jeeMockScore >= 120 ? 'Passed' : 'Needs Support',
    });
  }

  // Sort descending by jeeMockScore to assign ranks
  records.sort((a, b) => b.jeeMockScore - a.jeeMockScore);
  records.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return records;
}

export const STUDENTS_100_ROSTER: StudentAnalysisRecord[] = generate100Students();

// Full 100 StudentUser array for AuthContext
export const ALL_STUDENT_USERS: StudentUser[] = STUDENTS_100_ROSTER.map(s => ({
  id: s.id,
  role: 'student',
  name: s.name,
  rollNumber: s.rollNumber,
  department: 'Computer Science Engineering',
  semester: 5,
  section: s.section,
  email: s.email,
  phone: s.phone,
}));

