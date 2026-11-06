import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Staffs Icon (ID Badge Card with Lanyard)
export function IconStaffs({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="12" width="32" height="26" rx="4" fill="#F8A055" />
      <rect x="10" y="14" width="28" height="22" rx="3" fill="#FFE8D6" />
      {/* Clip top lanyard attachment */}
      <rect x="21" y="9" width="6" height="6" rx="2" fill="#D36B15" />
      <circle cx="24" cy="7" r="1.5" fill="#FFE8D6" />
      {/* Avatar photo */}
      <circle cx="17" cy="22" r="3.5" fill="#E26D14" />
      <path d="M12.5 30C12.5 27.5 14.5 25.5 17 25.5C19.5 25.5 21.5 27.5 21.5 30H12.5Z" fill="#E26D14" />
      {/* Info text lines */}
      <rect x="25" y="19" width="10" height="2" rx="1" fill="#D36B15" />
      <rect x="25" y="24" width="8" height="2" rx="1" fill="#F8A055" />
      <rect x="25" y="28" width="6" height="2" rx="1" fill="#F8A055" />
    </svg>
  );
}

// 2. Students Icon (3 Colorful Student Avatars)
export function IconStudents({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left Student (Teal) */}
      <circle cx="16" cy="18" r="4" fill="#0EA5E9" />
      <path d="M10 32C10 27.5 12.5 24 16 24C19.5 24 22 27.5 22 32H10Z" fill="#0284C7" />
      {/* Right Student (Pink/Magenta) */}
      <circle cx="32" cy="18" r="4" fill="#EC4899" />
      <path d="M26 32C26 27.5 28.5 24 32 24C35.5 24 38 27.5 38 32H26Z" fill="#DB2777" />
      {/* Center Student (Green/Emerald, in front) */}
      <circle cx="24" cy="15" r="4.5" fill="#10B981" />
      <path d="M17 32C17 26.5 20 22.5 24 22.5C28 22.5 31 26.5 31 32H17Z" fill="#059669" />
    </svg>
  );
}

// 3. Classes Icon (Green Chalkboard on Wooden Easel)
export function IconClasses({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Easel legs */}
      <line x1="24" y1="8" x2="14" y2="40" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="8" x2="34" y2="40" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="8" x2="24" y2="38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      {/* Green Board */}
      <rect x="10" y="12" width="28" height="20" rx="3" fill="#047857" stroke="#78350F" strokeWidth="2" />
      {/* Chalk writing */}
      <path d="M14 20L18 24L22 18" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="25" y="18" width="9" height="2" rx="1" fill="#A7F3D0" />
      <rect x="25" y="23" width="7" height="2" rx="1" fill="#A7F3D0" />
      {/* Tray */}
      <rect x="8" y="31" width="32" height="2" rx="1" fill="#78350F" />
    </svg>
  );
}

// 4. Batches Icon (Connected Colorful Team Network)
export function IconBatches({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Connection lines */}
      <line x1="16" y1="24" x2="32" y2="24" stroke="#CBD5E1" strokeWidth="2.5" />
      <line x1="24" y1="16" x2="24" y2="32" stroke="#CBD5E1" strokeWidth="2.5" />
      {/* Center node */}
      <circle cx="24" cy="24" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
      {/* Outer nodes */}
      <circle cx="14" cy="24" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="34" cy="24" r="4.5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="24" cy="14" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="24" cy="34" r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
}

// 5. Tests Icon (Document with [A] [B] and Pencil)
export function IconTests({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Document Sheet */}
      <rect x="11" y="9" width="24" height="30" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      {/* Block A (Red) */}
      <rect x="15" y="14" width="7" height="7" rx="2" fill="#EF4444" />
      <text x="18.5" y="19" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">A</text>
      {/* Block B (Blue) */}
      <rect x="24" y="14" width="7" height="7" rx="2" fill="#3B82F6" />
      <text x="27.5" y="19" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">B</text>
      {/* Text lines */}
      <rect x="15" y="24" width="16" height="2" rx="1" fill="#E2E8F0" />
      <rect x="15" y="28" width="12" height="2" rx="1" fill="#E2E8F0" />
      <rect x="15" y="32" width="14" height="2" rx="1" fill="#E2E8F0" />
      {/* Red Pencil */}
      <g transform="rotate(-35 32 30)">
        <rect x="28" y="14" width="4" height="18" rx="1" fill="#DC2626" />
        <polygon points="28,32 32,32 30,36" fill="#FBBF24" />
        <polygon points="29.5,35 30.5,35 30,36" fill="#1E293B" />
      </g>
    </svg>
  );
}

// 6. Board Marks Icon (Clipboard with A+ Stamp)
export function IconBoardMarks({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Clipboard base */}
      <rect x="12" y="10" width="24" height="29" rx="3" fill="#E2E8F0" />
      <rect x="14" y="12" width="20" height="25" rx="2" fill="#FFFFFF" />
      {/* Top Clip */}
      <rect x="19" y="8" width="10" height="4" rx="1.5" fill="#475569" />
      {/* Lines */}
      <rect x="17" y="18" width="14" height="2" rx="1" fill="#CBD5E1" />
      <rect x="17" y="22" width="11" height="2" rx="1" fill="#CBD5E1" />
      {/* Red A+ Stamp badge */}
      <circle cx="24" cy="29" r="6" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
      <text x="24" y="30.5" fill="#DC2626" fontSize="6.5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">A+</text>
    </svg>
  );
}

// 7. Questions Icon (4 Colored Letters Blocks A B C D)
export function IconQuestions({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* A - Red */}
      <rect x="12" y="12" width="10.5" height="10.5" rx="2.5" fill="#EF4444" />
      <text x="17.25" y="19" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">A</text>
      {/* B - Green */}
      <rect x="25.5" y="12" width="10.5" height="10.5" rx="2.5" fill="#10B981" />
      <text x="30.75" y="19" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">B</text>
      {/* C - Yellow/Orange */}
      <rect x="12" y="25.5" width="10.5" height="10.5" rx="2.5" fill="#F59E0B" />
      <text x="17.25" y="32.5" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">C</text>
      {/* D - Blue */}
      <rect x="25.5" y="25.5" width="10.5" height="10.5" rx="2.5" fill="#3B82F6" />
      <text x="30.75" y="32.5" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">D</text>
    </svg>
  );
}

// 8. Reports Icon (Rising Multi-Color 3D Bars)
export function IconReports({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base line */}
      <line x1="10" y1="36" x2="38" y2="36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      {/* Cyan bar */}
      <rect x="12" y="26" width="5" height="10" rx="1.5" fill="#06B6D4" />
      {/* Orange bar */}
      <rect x="18.5" y="20" width="5" height="16" rx="1.5" fill="#F97316" />
      {/* Red bar */}
      <rect x="25" y="14" width="5" height="22" rx="1.5" fill="#EF4444" />
      {/* Green bar */}
      <rect x="31.5" y="10" width="5" height="26" rx="1.5" fill="#10B981" />
      {/* Growth Arrow line */}
      <path d="M14 24L20 18L26 12L34 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="30,8 34,8 34,12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 9. Attendance Icon (Calendar with Red Ring & Green Checkmark)
export function IconAttendance({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Calendar Body */}
      <rect x="10" y="12" width="28" height="25" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      {/* Red Header Bar */}
      <path d="M10 16C10 13.8 11.8 12 14 12H34C36.2 12 38 13.8 38 16V19H10V16Z" fill="#EF4444" />
      {/* Hanging Rings */}
      <rect x="16" y="9" width="3" height="5" rx="1.5" fill="#334155" />
      <rect x="29" y="9" width="3" height="5" rx="1.5" fill="#334155" />
      {/* Green Checkmark Circle */}
      <circle cx="24" cy="27" r="6" fill="#10B981" />
      <path d="M21 27L23 29L27 25" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 10. Timetable Icon (Blue Weekly Grid Schedule)
export function IconTimetable({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="11" width="28" height="26" rx="4" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
      {/* Blue Top bar */}
      <path d="M10 15C10 12.8 11.8 11 14 11H34C36.2 11 38 12.8 38 15V17H10V15Z" fill="#3B82F6" />
      {/* Grid cells with colorful lecture blocks */}
      <rect x="14" y="20" width="8" height="4" rx="1" fill="#38BDF8" />
      <rect x="26" y="20" width="8" height="4" rx="1" fill="#A855F7" />
      <rect x="14" y="26" width="8" height="4" rx="1" fill="#10B981" />
      <rect x="26" y="26" width="8" height="4" rx="1" fill="#F59E0B" />
      <rect x="14" y="32" width="20" height="2" rx="1" fill="#E2E8F0" />
    </svg>
  );
}

// 11. Timetable Generator Icon (Grid with Gear Accent)
export function IconTimetableGenerator({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="11" width="28" height="26" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      <path d="M10 15C10 12.8 11.8 11 14 11H34C36.2 11 38 12.8 38 15V17H10V15Z" fill="#0284C7" />
      {/* Calendar Slots */}
      <rect x="14" y="20" width="9" height="4" rx="1" fill="#38BDF8" />
      <rect x="25" y="20" width="9" height="4" rx="1" fill="#CBD5E1" />
      <rect x="14" y="26" width="9" height="4" rx="1" fill="#CBD5E1" />
      {/* Lightning / Generator Gear */}
      <circle cx="29" cy="28" r="5.5" fill="#F59E0B" />
      <path d="M29 24.5L27 28.5H30L28 32.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 12. Exam Management Icon (Purple Calculator & Sheet)
export function IconExamManagement({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="13" y="10" width="22" height="28" rx="4" fill="#8B5CF6" />
      <rect x="15" y="12" width="18" height="24" rx="3" fill="#FAF5FF" />
      {/* Screen */}
      <rect x="17" y="14" width="14" height="6" rx="1.5" fill="#C4B5FD" />
      {/* Keypad */}
      <circle cx="19.5" cy="23.5" r="1.5" fill="#8B5CF6" />
      <circle cx="24" cy="23.5" r="1.5" fill="#8B5CF6" />
      <circle cx="28.5" cy="23.5" r="1.5" fill="#8B5CF6" />
      <circle cx="19.5" cy="28" r="1.5" fill="#8B5CF6" />
      <circle cx="24" cy="28" r="1.5" fill="#8B5CF6" />
      <circle cx="28.5" cy="28" r="1.5" fill="#8B5CF6" />
      <circle cx="19.5" cy="32.5" r="1.5" fill="#8B5CF6" />
      <rect x="23" y="31.5" width="7" height="2" rx="1" fill="#6D28D9" />
    </svg>
  );
}

// 13. Live Class Icon
export function IconLiveClass({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="9" y="12" width="30" height="21" rx="3" fill="#1E293B" />
      <rect x="11" y="14" width="26" height="17" rx="2" fill="#0F172A" />
      <circle cx="24" cy="22.5" r="4" fill="#EF4444" />
      <circle cx="24" cy="22.5" r="2" fill="#FFFFFF" />
      {/* Stand */}
      <path d="M24 33V37M18 37H30" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 14. SMS Icon
export function IconSMS({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="14" y="9" width="20" height="30" rx="4" fill="#0284C7" />
      <rect x="16" y="13" width="16" height="20" rx="2" fill="#E0F2FE" />
      <circle cx="24" cy="36" r="1.5" fill="#FFFFFF" />
      {/* Speech bubble */}
      <path d="M19 17H29C29.5 17 30 17.5 30 18V24C30 24.5 29.5 25 29 25H22L19 28V18C19 17.5 19.5 17 20 17" fill="#0284C7" />
    </svg>
  );
}

// 15. Noticeboard Icon
export function IconNoticeboard({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="9" y="10" width="30" height="26" rx="3" fill="#D97706" />
      <rect x="11" y="12" width="26" height="22" rx="2" fill="#FDE68A" />
      {/* Pinned notes */}
      <rect x="14" y="15" width="8" height="8" rx="1" fill="#F472B6" />
      <circle cx="18" cy="15" r="1" fill="#BE185D" />
      <rect x="24" y="17" width="9" height="9" rx="1" fill="#38BDF8" />
      <circle cx="28.5" cy="17" r="1" fill="#0369A1" />
    </svg>
  );
}

// 16. Counsellings Icon
export function IconCounsellings({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="20" r="5" fill="#8B5CF6" />
      <circle cx="32" cy="20" r="5" fill="#EC4899" />
      <path d="M10 33C10 28 13 26 16 26C19 26 22 28 22 33" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 33C26 28 29 26 32 26C35 26 38 28 38 33" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
      {/* Heart connection */}
      <path d="M24 16C24 14 22 13 20.5 14.5C19 16 24 19 24 19C24 19 29 16 27.5 14.5C26 13 24 14 24 16Z" fill="#EF4444" />
    </svg>
  );
}

// 17. College Calendar Icon
export function IconCollegeCalendar({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="11" width="28" height="26" rx="4" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
      <path d="M10 15C10 12.8 11.8 11 14 11H34C36.2 11 38 12.8 38 15V17H10V15Z" fill="#334155" />
      <circle cx="16" cy="22" r="1.5" fill="#EF4444" />
      <circle cx="21" cy="22" r="1.5" fill="#475569" />
      <circle cx="26" cy="22" r="1.5" fill="#475569" />
      <circle cx="31" cy="22" r="1.5" fill="#475569" />
      <circle cx="16" cy="27" r="1.5" fill="#475569" />
      <circle cx="21" cy="27" r="1.5" fill="#10B981" />
      <circle cx="26" cy="27" r="1.5" fill="#475569" />
      <circle cx="31" cy="27" r="1.5" fill="#3B82F6" />
    </svg>
  );
}

// 18. Student Discipline Icon
export function IconStudentDiscipline({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M24 9L35 13V24C35 30.5 30 36 24 38C18 36 13 30.5 13 24V13L24 9Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <path d="M19 23L22.5 26.5L29 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 19. Reported Issues Icon
export function IconReportedIssues({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="24" r="15" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
      <path d="M24 16V25" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="29.5" r="1.5" fill="#EF4444" />
    </svg>
  );
}

// 20. Hostel Icon
export function IconHostel({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="11" y="13" width="26" height="23" rx="3" fill="#64748B" />
      <rect x="13" y="15" width="22" height="19" rx="2" fill="#F1F5F9" />
      {/* Windows */}
      <rect x="16" y="17" width="5" height="5" rx="1" fill="#3B82F6" />
      <rect x="27" y="17" width="5" height="5" rx="1" fill="#3B82F6" />
      <rect x="16" y="25" width="5" height="5" rx="1" fill="#3B82F6" />
      <rect x="27" y="25" width="5" height="5" rx="1" fill="#3B82F6" />
    </svg>
  );
}

// 21. Gate Pass Icon
export function IconGatePass({ size = 48, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="14" width="28" height="20" rx="3" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
      <rect x="10" y="14" width="6" height="20" rx="1" fill="#10B981" />
      {/* Barcode lines */}
      <line x1="20" y1="18" x2="20" y2="30" stroke="#334155" strokeWidth="1.5" />
      <line x1="23" y1="18" x2="23" y2="30" stroke="#334155" strokeWidth="1" />
      <line x1="26" y1="18" x2="26" y2="30" stroke="#334155" strokeWidth="2" />
      <line x1="30" y1="18" x2="30" y2="30" stroke="#334155" strokeWidth="1" />
      <line x1="33" y1="18" x2="33" y2="30" stroke="#334155" strokeWidth="1.5" />
    </svg>
  );
}

