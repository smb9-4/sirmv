// PUC Academic Data System for Sir MV College (I PU and II PU)
// Subjects: Physics, Chemistry, Mathematics, Biology, Computer Science, Statistics
// Exam Tracks: JEE Main / Adv, NEET, KCET, PU Board Theory

export type PUCYear = 'I PU' | 'II PU';
export type PUCSubject =
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Biology'
  | 'Computer Science'
  | 'Statistics';

export type ExamCategory = 'JEE' | 'NEET' | 'CET' | 'PU Board Theory';

export interface PUCAnnouncement {
  id: string;
  senderName: string;
  designation: string;
  category: 'Principal' | 'HOD' | 'Teacher';
  subject?: PUCSubject;
  targetYear: 'I PU' | 'II PU' | 'All PU';
  title: string;
  message: string;
  date: string;
  time: string;
  isUrgent?: boolean;
}

export interface DetailedQuestionReview {
  id: string;
  questionNumber: number;
  subject: PUCSubject;
  topic: string;
  difficulty: 'Foundation' | 'Moderate' | 'Advanced';
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  selectedOptionId: string | null;
  timeTakenSeconds: number; // e.g. 42s, 75s
  explanation: string;
}

export interface PastExamRecord {
  id: string;
  examName: string;
  category: ExamCategory;
  date: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  cohortRank: number; // out of 100
  totalCohortStudents: number; // 100
  timeSpentMinutes: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  subjectScores: {
    subject: PUCSubject;
    obtained: number;
    max: number;
  }[];
  questionsReview: DetailedQuestionReview[];
}

// ─────────────────────────────────────────────────────────────
// 1. ANNOUNCEMENTS FROM PRINCIPAL, HODs, AND TEACHERS
// ─────────────────────────────────────────────────────────────
export const PUC_ANNOUNCEMENTS: PUCAnnouncement[] = [
  {
    id: 'ann-01',
    senderName: 'Prof. K. R. Suresh',
    designation: 'Principal & Executive Head',
    category: 'Principal',
    targetYear: 'All PU',
    title: 'II PU & I PU Internal Assessment Examination (IA-2) Schedule',
    message:
      'All I PU and II PU students are hereby notified that the second round of Internal Assessments (IA-2) will be conducted from 18th to 25th November 2026. Hall tickets will be issued at the administrative desk. Minimum 75% attendance is strictly compulsory to appear.',
    date: 'Today, 09:30 AM',
    time: '09:30 AM',
    isUrgent: true,
  },
  {
    id: 'ann-02',
    senderName: 'Dr. Mahendra V',
    designation: 'HOD - Department of Physics',
    category: 'HOD',
    subject: 'Physics',
    targetYear: 'II PU',
    title: 'Wave Optics & Ray Optics KCET/JEE Numerical Prep Booklet',
    message:
      'A curated 45-page compilation of past 10 years KCET and JEE Main questions with detailed step-by-step derivations for Ray Optics, Wave Optics, and Alternating Currents has been published. A special doubt resolution clinic will be held this Friday at 03:30 PM in Room 301.',
    date: 'Yesterday, 02:15 PM',
    time: '02:15 PM',
    isUrgent: false,
  },
  {
    id: 'ann-03',
    senderName: 'Prof. K. N. Sridhar',
    designation: 'HOD - Department of Mathematics',
    category: 'HOD',
    subject: 'Mathematics',
    targetYear: 'II PU',
    title: 'Definite Integrals & Differential Equations Practice Series',
    message:
      'Practice Worksheet #04 covering Definite Integrals and Differential Equations is now open in the Practice Exam section. Students aiming for 100/100 in Board Examinations and top percentiles in KCET/JEE are advised to complete all 30 questions before Monday.',
    date: 'Nov 04, 2026',
    time: '11:45 AM',
    isUrgent: false,
  },
  {
    id: 'ann-04',
    senderName: 'Dr. Shobha Rani',
    designation: 'Senior Faculty - Chemistry',
    category: 'Teacher',
    subject: 'Chemistry',
    targetYear: 'II PU',
    title: 'Coordination Compounds & Organic Reactions Lab Drill',
    message:
      'Practical records for Organic Qualitative Analysis must be submitted to the Chemistry Laboratory counter by Thursday 04:00 PM. Practicals viva for Batch A starts Wednesday morning.',
    date: 'Nov 03, 2026',
    time: '04:10 PM',
    isUrgent: false,
  },
  {
    id: 'ann-05',
    senderName: 'Dr. Ramesh Prasad',
    designation: 'Senior Lecturer - Biology (NEET Coordinator)',
    category: 'Teacher',
    subject: 'Biology',
    targetYear: 'All PU',
    title: 'Genetics, Evolution & Human Physiology High-Yield NEET MCQs',
    message:
      'A targeted diagnostic mock paper focusing on Molecular Basis of Inheritance and Human Health & Disease has been uploaded for NEET aspirants. Includes NCERT-line-by-line question tagging and diagrammatic explanations.',
    date: 'Nov 02, 2026',
    time: '10:00 AM',
    isUrgent: false,
  },
  {
    id: 'ann-06',
    senderName: 'Dr. Priya Nayak',
    designation: 'Associate Professor - Computer Science',
    category: 'Teacher',
    subject: 'Computer Science',
    targetYear: 'II PU',
    title: 'C++ Classes, Pointers & Data Structures Lab Submissions',
    message:
      'Please ensure all 14 laboratory programming exercises are executed, verified, and signed in your official laboratory record manual before the final IA-2 deadline.',
    date: 'Oct 30, 2026',
    time: '01:30 PM',
    isUrgent: false,
  },
  {
    id: 'ann-07',
    senderName: 'Prof. V. Gopalakrishna',
    designation: 'Faculty - Department of Statistics',
    category: 'Teacher',
    subject: 'Statistics',
    targetYear: 'All PU',
    title: 'Probability Distributions & Index Numbers Revision Session',
    message:
      'Special formula revision and practical calculation session using statistical tables for Binomial and Poisson distributions will be held on Saturday in Lecture Room 204.',
    date: 'Oct 28, 2026',
    time: '03:00 PM',
    isUrgent: false,
  },
];

// ─────────────────────────────────────────────────────────────
// 2. DETAILED EXAMS & QUESTION-BY-QUESTION RESULTS DATA (100 STUDENTS COHORT)
// ─────────────────────────────────────────────────────────────

export const MOCK_EXAM_RESULTS: PastExamRecord[] = [
  {
    id: 'exam-jee-02',
    examName: 'JEE Main All India Mock Assessment 02',
    category: 'JEE',
    date: 'Nov 02, 2026',
    totalMarks: 300,
    marksObtained: 212,
    percentage: 70.7,
    cohortRank: 16,
    totalCohortStudents: 100,
    timeSpentMinutes: 168,
    totalQuestions: 75,
    correctAnswers: 56,
    incorrectAnswers: 12,
    unattempted: 7,
    subjectScores: [
      { subject: 'Physics', obtained: 74, max: 100 },
      { subject: 'Chemistry', obtained: 68, max: 100 },
      { subject: 'Mathematics', obtained: 70, max: 100 },
    ],
    questionsReview: [
      {
        id: 'q-jee-1',
        questionNumber: 1,
        subject: 'Physics',
        topic: 'Electrostatics & Gauss Law',
        difficulty: 'Moderate',
        questionText:
          'A hollow conducting sphere of radius R has charge Q on its surface. What is the electric potential at a distance r = R/2 from the centre?',
        options: [
          { id: 'A', text: 'Zero' },
          { id: 'B', text: 'kQ / R' },
          { id: 'C', text: '2kQ / R' },
          { id: 'D', text: 'kQ / (2R)' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 38,
        explanation:
          'Inside a hollow conducting sphere, the electric field E is zero everywhere. Consequently, the electric potential is constant and equals the potential at the surface: V = kQ / R.',
      },
      {
        id: 'q-jee-2',
        questionNumber: 2,
        subject: 'Physics',
        topic: 'Current Electricity',
        difficulty: 'Advanced',
        questionText:
          'In a potentiometer wire of length 10 m and resistance 20 Ω, connected in series with a 480 Ω resistor and a 4 V battery, what is the potential gradient along the wire?',
        options: [
          { id: 'A', text: '0.16 V/m' },
          { id: 'B', text: '0.016 V/m' },
          { id: 'C', text: '0.04 V/m' },
          { id: 'D', text: '0.4 V/m' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 52,
        explanation:
          'Total resistance R_total = 20 + 480 = 500 Ω. Current I = 4 V / 500 Ω = 0.008 A. Potential drop across wire V_wire = 0.008 * 20 = 0.16 V. Potential gradient k = 0.16 V / 10 m = 0.016 V/m.',
      },
      {
        id: 'q-jee-3',
        questionNumber: 3,
        subject: 'Chemistry',
        topic: 'Chemical Kinetics',
        difficulty: 'Moderate',
        questionText:
          'For a first-order reaction A -> Products, if the initial concentration is halved, the half-life period t_{1/2} will:',
        options: [
          { id: 'A', text: 'Double' },
          { id: 'B', text: 'Halve' },
          { id: 'C', text: 'Remain unchanged' },
          { id: 'D', text: 'Become 4 times' },
        ],
        correctOptionId: 'C',
        selectedOptionId: 'C',
        timeTakenSeconds: 24,
        explanation:
          'For any first-order reaction, t_{1/2} = 0.693 / k. It is strictly independent of initial reactant concentration.',
      },
      {
        id: 'q-jee-4',
        questionNumber: 4,
        subject: 'Chemistry',
        topic: 'Coordination Chemistry',
        difficulty: 'Advanced',
        questionText:
          'Which of the following complex ions is diamagnetic according to Valence Bond Theory?',
        options: [
          { id: 'A', text: '[FeF_6]^{3-}' },
          { id: 'B', text: '[Co(NH_3)_6]^{3+}' },
          { id: 'C', text: '[Fe(H_2O)_6]^{2+}' },
          { id: 'D', text: '[NiCl_4]^{2-}' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'A',
        timeTakenSeconds: 76,
        explanation:
          'In [Co(NH_3)_6]^{3+}, Co is in +3 oxidation state (3d^6). Strong-field NH_3 causes pairing of all 6 d-electrons into t_{2g}^6, resulting in zero unpaired electrons (diamagnetic). Student incorrectly marked [FeF_6]^{3-} which is paramagnetic with 5 unpaired electrons.',
      },
      {
        id: 'q-jee-5',
        questionNumber: 5,
        subject: 'Mathematics',
        topic: 'Calculus - Definite Integrals',
        difficulty: 'Moderate',
        questionText:
          'Evaluate: \\int_{0}^{\\pi/2} \\frac{\\sin^4 x}{\\sin^4 x + \\cos^4 x} \\, dx',
        options: [
          { id: 'A', text: 'π / 2' },
          { id: 'B', text: 'π / 4' },
          { id: 'C', text: 'π' },
          { id: 'D', text: '0' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 45,
        explanation:
          'Using the King\'s property \\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx, adding both gives 2I = \\int_0^{\\pi/2} 1 dx = \\pi/2 => I = \\pi/4.',
      },
    ],
  },
  {
    id: 'exam-kcet-01',
    examName: 'KCET State Rank Practice Exam 01',
    category: 'CET',
    date: 'Oct 26, 2026',
    totalMarks: 180,
    marksObtained: 148,
    percentage: 82.2,
    cohortRank: 11,
    totalCohortStudents: 100,
    timeSpentMinutes: 140,
    totalQuestions: 180,
    correctAnswers: 148,
    incorrectAnswers: 26,
    unattempted: 6,
    subjectScores: [
      { subject: 'Physics', obtained: 48, max: 60 },
      { subject: 'Chemistry', obtained: 46, max: 60 },
      { subject: 'Mathematics', obtained: 54, max: 60 },
    ],
    questionsReview: [
      {
        id: 'q-cet-1',
        questionNumber: 1,
        subject: 'Mathematics',
        topic: 'Matrices & Determinants',
        difficulty: 'Foundation',
        questionText: 'If A is a 3x3 invertible matrix with |A| = 5, what is |adj(A)|?',
        options: [
          { id: 'A', text: '5' },
          { id: 'B', text: '25' },
          { id: 'C', text: '125' },
          { id: 'D', text: '1/5' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 28,
        explanation:
          'For an n x n matrix, |adj(A)| = |A|^{n-1}. For n = 3, |adj(A)| = |A|^2 = 5^2 = 25.',
      },
      {
        id: 'q-cet-2',
        questionNumber: 2,
        subject: 'Physics',
        topic: 'Ray Optics',
        difficulty: 'Moderate',
        questionText:
          'A convex lens of focal length 20 cm in air is immersed in water (μ_w = 4/3). Given μ_g = 3/2, the new focal length is:',
        options: [
          { id: 'A', text: '40 cm' },
          { id: 'B', text: '80 cm' },
          { id: 'C', text: '10 cm' },
          { id: 'D', text: '20 cm' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 48,
        explanation:
          'Using Lens Maker\'s formula: f_w = 4 * f_air = 4 * 20 = 80 cm.',
      },
    ],
  },
  {
    id: 'exam-neet-03',
    examName: 'NEET Full Syllabus Medical Diagnostic Drill 03',
    category: 'NEET',
    date: 'Oct 18, 2026',
    totalMarks: 720,
    marksObtained: 560,
    percentage: 77.8,
    cohortRank: 14,
    totalCohortStudents: 100,
    timeSpentMinutes: 195,
    totalQuestions: 180,
    correctAnswers: 146,
    incorrectAnswers: 24,
    unattempted: 10,
    subjectScores: [
      { subject: 'Biology', obtained: 310, max: 360 },
      { subject: 'Chemistry', obtained: 130, max: 180 },
      { subject: 'Physics', obtained: 120, max: 180 },
    ],
    questionsReview: [
      {
        id: 'q-neet-1',
        questionNumber: 1,
        subject: 'Biology',
        topic: 'Genetics & Evolution',
        difficulty: 'Foundation',
        questionText:
          'In Mendelian dihybrid cross, what is the phenotypic ratio obtained in the F2 generation?',
        options: [
          { id: 'A', text: '3:1' },
          { id: 'B', text: '9:3:3:1' },
          { id: 'C', text: '1:2:1' },
          { id: 'D', text: '9:7' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 18,
        explanation:
          'Mendelian independent assortment in a dihybrid cross produces 9 Round Yellow, 3 Round Green, 3 Wrinkled Yellow, and 1 Wrinkled Green (9:3:3:1).',
      },
    ],
  },
  {
    id: 'exam-board-mid',
    examName: 'II PU Mid-Term Board Theory Evaluation (Official)',
    category: 'PU Board Theory',
    date: 'Oct 10, 2026',
    totalMarks: 600,
    marksObtained: 534,
    percentage: 89.0,
    cohortRank: 8,
    totalCohortStudents: 100,
    timeSpentMinutes: 180,
    totalQuestions: 60,
    correctAnswers: 54,
    incorrectAnswers: 4,
    unattempted: 2,
    subjectScores: [
      { subject: 'Physics', obtained: 92, max: 100 },
      { subject: 'Chemistry', obtained: 88, max: 100 },
      { subject: 'Mathematics', obtained: 94, max: 100 },
      { subject: 'Computer Science', obtained: 96, max: 100 },
    ],
    questionsReview: [
      {
        id: 'q-board-1',
        questionNumber: 1,
        subject: 'Computer Science',
        topic: 'OOP Concepts & C++',
        difficulty: 'Foundation',
        questionText:
          'Which C++ feature enables a single function name to perform distinct operations based on arguments?',
        options: [
          { id: 'A', text: 'Inheritance' },
          { id: 'B', text: 'Function Overloading (Polymorphism)' },
          { id: 'C', text: 'Data Encapsulation' },
          { id: 'D', text: 'Dynamic Binding' },
        ],
        correctOptionId: 'B',
        selectedOptionId: 'B',
        timeTakenSeconds: 22,
        explanation:
          'Compile-time polymorphism is achieved through function and operator overloading in C++.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 3. TOPICS LIST FOR THE INTERACTIVE PRACTICE GENERATOR
// ─────────────────────────────────────────────────────────────
export const PUC_TOPICS_BY_SUBJECT: Record<PUCSubject, string[]> = {
  Physics: [
    'Electrostatics & Gauss Law',
    'Current Electricity & Potentiometer',
    'Magnetic Effects of Current & Magnetism',
    'Electromagnetic Induction & Alternating Current',
    'Ray Optics & Optical Instruments',
    'Wave Optics & Interference',
    'Dual Nature of Radiation & Matter',
    'Semiconductors & Logic Gates',
  ],
  Chemistry: [
    'Solid State & Solutions',
    'Electrochemistry & Nernst Equation',
    'Chemical Kinetics & Rate Laws',
    'Surface Chemistry & Catalysis',
    'p-Block, d-Block & f-Block Elements',
    'Coordination Compounds & Bonding',
    'Haloalkanes & Haloarenes',
    'Alcohols, Phenols & Ethers',
    'Aldehydes, Ketones & Carboxylic Acids',
    'Biomolecules & Polymers',
  ],
  Mathematics: [
    'Relations & Functions',
    'Inverse Trigonometric Functions',
    'Matrices & Determinants',
    'Continuity & Differentiability',
    'Applications of Derivatives (Maxima & Minima)',
    'Indefinite & Definite Integrals',
    'Differential Equations',
    'Vector Algebra & 3D Geometry',
    'Linear Programming Problem (LPP)',
    'Probability & Bayes Theorem',
  ],
  Biology: [
    'Reproduction in Organisms',
    'Sexual Reproduction in Flowering Plants',
    'Human Reproduction & Reproductive Health',
    'Principles of Inheritance & Variation',
    'Molecular Basis of Inheritance',
    'Evolutionary Biology',
    'Human Health & Diseases',
    'Biotechnology Principles & Processes',
    'Ecosystem & Environmental Issues',
  ],
  'Computer Science': [
    'C++ Classes, Objects & Constructors',
    'Function Overloading & Templates',
    'Inheritance (Single, Multiple, Hierarchical)',
    'Pointers & Dynamic Memory Allocation',
    'Data Structures (Stacks, Queues, Linked Lists)',
    'Database Management Systems & SQL',
    'Boolean Algebra & Logic Simplification',
    'Networking Concepts & Web Protocols',
  ],
  Statistics: [
    'Vital Statistics & Mortality Rates',
    'Index Numbers (Laspeyres, Paasche, Fisher)',
    'Time Series Analysis & Trend Estimation',
    'Probability Theory & Random Variables',
    'Binomial & Poisson Probability Distributions',
    'Normal Distribution & Z-Scores',
    'Sampling Theory & Testing of Hypothesis',
    'Statistical Quality Control (SQC)',
  ],
};

