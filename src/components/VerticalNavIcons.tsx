import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// 0. Sir MV College Institutional Crest Emblem (Replaces the blue icon)
export function IconSirMVCrest({ size = 36, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="20" r="18" fill="#650000" stroke="#E5BD55" strokeWidth="2" />
      <circle cx="20" cy="20" r="14.5" fill="#500000" stroke="#FFE59A" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* College Shield / Book / Lamp Emblem */}
      <path d="M14 16C14 14.5 16.5 14 20 15.5C23.5 14 26 14.5 26 16V25C26 25 23.5 24 20 25.5C16.5 24 14 25 14 25V16Z" fill="#FFE59A" stroke="#E5BD55" strokeWidth="1" />
      <path d="M20 15.5V25.5" stroke="#650000" strokeWidth="1.2" />
      {/* Flame of Knowledge */}
      <path d="M20 10.5C20 10.5 21.5 12 21.5 13.2C21.5 14 20.8 14.5 20 14.5C19.2 14.5 18.5 14 18.5 13.2C18.5 12 20 10.5 20 10.5Z" fill="#E5BD55" />
    </svg>
  );
}

// 1. Dashboard (3x3 grid with green, yellow/orange, red/pink rounded squares with black outline)
export function IconVNavDashboard({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Row 1: Green rounded squares */}
      <rect x="5" y="4" width="7" height="7" rx="2" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="14.5" y="4" width="7" height="7" rx="2" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="24" y="4" width="7" height="7" rx="2" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />

      {/* Row 2: Yellow / Orange rounded squares */}
      <rect x="5" y="14.5" width="7" height="7" rx="2" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="14.5" y="14.5" width="7" height="7" rx="2" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="24" y="14.5" width="7" height="7" rx="2" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />

      {/* Row 3: Coral / Red rounded squares */}
      <rect x="5" y="25" width="7" height="7" rx="2" fill="#F87171" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="14.5" y="25" width="7" height="7" rx="2" fill="#F87171" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="24" y="25" width="7" height="7" rx="2" fill="#F87171" stroke="#1E293B" strokeWidth="1.5" />
    </svg>
  );
}

// 2. Students (Girl and Boy behind a school desk with navy uniform)
export function IconVNavStudents({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Desk behind them */}
      <rect x="3" y="26" width="30" height="6" rx="1.5" fill="#854D0E" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="4" y1="28.5" x2="32" y2="28.5" stroke="#713F12" strokeWidth="1" />

      {/* Left Student - Girl */}
      {/* Auburn Hair */}
      <path d="M7 16C7 10.5 9 8 13 8C17 8 19 10.5 19 16V20H7V16Z" fill="#EA580C" stroke="#1E293B" strokeWidth="1.2" />
      {/* Hairclip */}
      <circle cx="16" cy="11" r="1.5" fill="#EF4444" />
      {/* Face */}
      <rect x="9.5" y="11" width="7" height="7" rx="2.5" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      {/* Eyes and mouth */}
      <circle cx="11.5" cy="14" r="0.8" fill="#1E293B" />
      <circle cx="14.5" cy="14" r="0.8" fill="#1E293B" />
      <path d="M12.5 16C12.8 16.5 13.2 16.5 13.5 16" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      {/* Navy Collar / Tie */}
      <path d="M8 20H18L17 26H9L8 20Z" fill="#1E3A8A" stroke="#1E293B" strokeWidth="1" />
      <polygon points="12,20 14,20 13.5,24 12.5,24" fill="#FFFFFF" />
      <polygon points="13,21 14,23 13,25 12,23" fill="#DC2626" />

      {/* Right Student - Boy */}
      {/* Spiky Brown Hair */}
      <path d="M19 14L21 8L24 7L27 9L29 14V17H19V14Z" fill="#78350F" stroke="#1E293B" strokeWidth="1.2" />
      {/* Face */}
      <rect x="20.5" y="11" width="7" height="7" rx="2.5" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      {/* Eyes and mouth */}
      <circle cx="22.5" cy="14" r="0.8" fill="#1E293B" />
      <circle cx="25.5" cy="14" r="0.8" fill="#1E293B" />
      <path d="M23.5 16C23.8 16.5 24.2 16.5 24.5 16" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      {/* Navy Collar / Tie */}
      <path d="M19 20H29L28 26H20L19 20Z" fill="#1E3A8A" stroke="#1E293B" strokeWidth="1" />
      <polygon points="23,20 25,20 24.5,24 23.5,24" fill="#FFFFFF" />
      <polygon points="24,21 25,23 24,25 23,23" fill="#DC2626" />
    </svg>
  );
}

// 3. Classes (Teacher in pink/coral at whiteboard with chart and students)
export function IconVNavClasses({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Easel Stand Legs */}
      <line x1="22" y1="5" x2="16" y2="28" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="5" x2="33" y2="28" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24.5" y1="5" x2="24.5" y2="28" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />

      {/* Whiteboard */}
      <rect x="15" y="7" width="18" height="13" rx="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      {/* Chart on board: 3 colored bars + trend line */}
      <rect x="18" y="14" width="2" height="4" rx="0.5" fill="#10B981" />
      <rect x="22" y="12" width="2" height="6" rx="0.5" fill="#F59E0B" />
      <rect x="26" y="10" width="2" height="8" rx="0.5" fill="#3B82F6" />
      <path d="M18 14L22 12L26 10L29 8" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />

      {/* Teacher on the left in coral shirt */}
      <circle cx="8" cy="10" r="2.5" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <path d="M6 7.5C6 7.5 7.5 6 9.5 7C9.5 7 10.5 8 10 9" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
      {/* Coral shirt */}
      <path d="M5 14C5 12.8 6.2 12 7.5 12H9C10.2 12 11.5 12.8 11.5 14L12.5 21H4L5 14Z" fill="#FB7185" stroke="#1E293B" strokeWidth="1.2" />
      {/* Right arm pointing with pointer stick to board */}
      <line x1="11" y1="14" x2="18" y2="10" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      {/* Trousers */}
      <rect x="5.5" y="21" width="2.5" height="7" fill="#1E293B" rx="1" />
      <rect x="8.5" y="21" width="2.5" height="7" fill="#1E293B" rx="1" />

      {/* Classroom student heads at bottom right */}
      <circle cx="18" cy="27" r="1.8" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <rect x="16.5" y="29" width="3" height="3" rx="1" fill="#1E3A8A" />

      <circle cx="24" cy="27" r="1.8" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <rect x="22.5" y="29" width="3" height="3" rx="1" fill="#10B981" />

      <circle cx="30" cy="27" r="1.8" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <rect x="28.5" y="29" width="3" height="3" rx="1" fill="#DC2626" />
    </svg>
  );
}

// 4. Batches (3 connected users hierarchy tree with green branch lines)
export function IconVNavBatches({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Green connection branch lines */}
      <line x1="18" y1="16" x2="18" y2="21" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="21" x2="10" y2="21" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="21" x2="26" y2="21" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="21" x2="10" y2="24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="21" x2="26" y2="24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="21" r="1.5" fill="#10B981" />

      {/* Top User (Orange shirt) */}
      <circle cx="18" cy="8" r="2.8" fill="#FED7AA" stroke="#1E293B" strokeWidth="1.2" />
      <path d="M15.5 7C15.5 7 16.5 5.5 18.5 6C18.5 6 20 6.5 20.5 8" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13.5 15C13.5 13 15.5 11.5 18 11.5C20.5 11.5 22.5 13 22.5 15H13.5Z" fill="#F97316" stroke="#1E293B" strokeWidth="1.2" />

      {/* Bottom Left User (Cyan/Blue shirt) */}
      <circle cx="10" cy="25.5" r="2.5" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <path d="M8 24.5C8 24.5 9 23.5 10.5 24C10.5 24 11.5 24.5 12 25.5" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
      <path d="M6 31C6 29.5 7.8 28.5 10 28.5C12.2 28.5 14 29.5 14 31H6Z" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.2" />

      {/* Bottom Right User (Cyan/Blue shirt) */}
      <circle cx="26" cy="25.5" r="2.5" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <path d="M24 24.5C24 24.5 25 23.5 26.5 24C26.5 24 27.5 24.5 28 25.5" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
      <path d="M22 31C22 29.5 23.8 28.5 26 28.5C28.2 28.5 30 29.5 30 31H22Z" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.2" />
    </svg>
  );
}

// 5. Tests / Exams (Hand holding pen with A B C speech bubbles)
export function IconVNavTests({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Speech bubble [A] - Yellow/Amber */}
      <rect x="4" y="6" width="9" height="8" rx="2" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.2" />
      <polygon points="8,14 10,14 7,16" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.2" />
      <text x="8.5" y="12" fill="#1E293B" fontSize="6" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">A</text>

      {/* Speech bubble [B] - Blue */}
      <rect x="23" y="6" width="9" height="8" rx="2" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.2" />
      <polygon points="26,14 28,14 29,16" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.2" />
      <text x="27.5" y="12" fill="#1E293B" fontSize="6" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">B</text>

      {/* Speech bubble [C] - Grey/Slate */}
      <rect x="4" y="21" width="9" height="8" rx="2" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
      <polygon points="8,21 10,21 7,19" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
      <text x="8.5" y="27" fill="#1E293B" fontSize="6" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">C</text>

      {/* Hand holding pencil */}
      {/* Green sleeve cuff */}
      <rect x="15" y="27" width="8" height="5" rx="1.5" fill="#10B981" stroke="#1E293B" strokeWidth="1.2" />
      {/* Beige hand knuckles */}
      <rect x="16.5" y="19" width="6" height="8" rx="2" fill="#FED7AA" stroke="#1E293B" strokeWidth="1.2" />
      <line x1="16.5" y1="22" x2="22.5" y2="22" stroke="#1E293B" strokeWidth="0.8" />
      <line x1="16.5" y1="24.5" x2="22.5" y2="24.5" stroke="#1E293B" strokeWidth="0.8" />

      {/* Silver/Black Pen in hand */}
      <g transform="rotate(-30 18 16)">
        <rect x="17" y="5" width="3" height="18" rx="0.5" fill="#475569" stroke="#1E293B" strokeWidth="1" />
        <polygon points="17,23 20,23 18.5,27" fill="#FBBF24" stroke="#1E293B" strokeWidth="1" />
        <polygon points="18,25.5 19,25.5 18.5,27" fill="#1E293B" />
      </g>
    </svg>
  );
}

// 6. Questions (4 boxes 2x2 grid [A][C] / [B][D] with question lines)
export function IconVNavQuestions({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Left: [A] Pink/Red box */}
      <rect x="4" y="5" width="7" height="7" rx="1.5" fill="#FB7185" stroke="#1E293B" strokeWidth="1.2" />
      <text x="7.5" y="10" fill="#FFFFFF" fontSize="5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">A</text>
      {/* 3 lines */}
      <line x1="13" y1="7" x2="16" y2="7" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="9" x2="16" y2="9" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="11" x2="15" y2="11" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

      {/* Top Right: [C] Green box */}
      <rect x="20" y="5" width="7" height="7" rx="1.5" fill="#34D399" stroke="#1E293B" strokeWidth="1.2" />
      <text x="23.5" y="10" fill="#FFFFFF" fontSize="5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">C</text>
      {/* 3 lines */}
      <line x1="29" y1="7" x2="32" y2="7" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="29" y1="9" x2="32" y2="9" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="29" y1="11" x2="31" y2="11" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

      {/* Bottom Left: [B] Yellow/Amber box */}
      <rect x="4" y="21" width="7" height="7" rx="1.5" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.2" />
      <text x="7.5" y="26" fill="#FFFFFF" fontSize="5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">B</text>
      {/* 3 lines */}
      <line x1="13" y1="23" x2="16" y2="23" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="25" x2="16" y2="25" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="27" x2="15" y2="27" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

      {/* Bottom Right: [D] Blue box */}
      <rect x="20" y="21" width="7" height="7" rx="1.5" fill="#60A5FA" stroke="#1E293B" strokeWidth="1.2" />
      <text x="23.5" y="26" fill="#FFFFFF" fontSize="5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">D</text>
      {/* 3 lines */}
      <line x1="29" y1="23" x2="32" y2="23" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="29" y1="25" x2="32" y2="25" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="29" y1="27" x2="31" y2="27" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 7. Reports / Results (Ascending 4-colored bar chart with upward trend line and dots)
export function IconVNavReports({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base platform */}
      <rect x="3" y="30" width="30" height="2.5" rx="1" fill="#475569" />

      {/* Bar 1 - Dark Blue */}
      <rect x="5.5" y="22" width="4.5" height="8" rx="1" fill="#1E40AF" stroke="#1E293B" strokeWidth="1" />
      {/* Bar 2 - Cyan / Light Blue */}
      <rect x="12" y="16" width="4.5" height="14" rx="1" fill="#06B6D4" stroke="#1E293B" strokeWidth="1" />
      {/* Bar 3 - Amber / Orange */}
      <rect x="18.5" y="11" width="4.5" height="19" rx="1" fill="#F59E0B" stroke="#1E293B" strokeWidth="1" />
      {/* Bar 4 - Coral / Red */}
      <rect x="25" y="6" width="4.5" height="24" rx="1" fill="#EF4444" stroke="#1E293B" strokeWidth="1" />

      {/* Curved trend line connecting peaks */}
      <path
        d="M7.7 20L14.2 14L20.7 9L27.2 4.5"
        stroke="#1E293B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4 White circles with black stroke at peaks */}
      <circle cx="7.7" cy="20" r="1.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.2" />
      <circle cx="14.2" cy="14" r="1.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.2" />
      <circle cx="20.7" cy="9" r="1.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.2" />
      <circle cx="27.2" cy="4.5" r="1.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.2" />
    </svg>
  );
}

// 8. Leaderboard (1-2-3 podium with gold trophy on step 1)
export function IconVNavLeaderboard({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Step 2 (Left - Mint green) */}
      <rect x="4" y="20" width="8" height="12" rx="1" fill="#6EE7B7" stroke="#1E293B" strokeWidth="1.2" />
      <text x="8" y="27" fill="#1E293B" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">2</text>

      {/* Step 1 (Center - Pink/Coral, tallest) */}
      <rect x="13" y="16" width="10" height="16" rx="1" fill="#F472B6" stroke="#1E293B" strokeWidth="1.2" />
      <text x="18" y="24" fill="#1E293B" fontSize="7" fontWeight="900" textAnchor="middle" dominantBaseline="middle">1</text>

      {/* Step 3 (Right - Light blue) */}
      <rect x="24" y="22" width="8" height="10" rx="1" fill="#7DD3FC" stroke="#1E293B" strokeWidth="1.2" />
      <text x="28" y="28" fill="#1E293B" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">3</text>

      {/* Golden Trophy on top of Step 1 */}
      {/* Pedestal */}
      <rect x="15.5" y="13.5" width="5" height="2.5" rx="0.5" fill="#D97706" stroke="#1E293B" strokeWidth="0.8" />
      <rect x="17" y="11.5" width="2" height="2.5" fill="#F59E0B" />
      {/* Cup body */}
      <path d="M14 5H22V8C22 10.2 20.2 12 18 12C15.8 12 14 10.2 14 8V5Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.2" />
      {/* Left handle */}
      <path d="M14 6H12C11 6 11 9 13 9.5L14 9.5" stroke="#1E293B" strokeWidth="1" fill="none" />
      {/* Right handle */}
      <path d="M22 6H24C25 6 25 9 23 9.5L22 9.5" stroke="#1E293B" strokeWidth="1" fill="none" />
      {/* Star on trophy */}
      <path d="M18 6.5L18.5 7.5L19.5 7.6L18.7 8.3L19 9.3L18 8.7L17 9.3L17.3 8.3L16.5 7.6L17.5 7.5L18 6.5Z" fill="#FFFFFF" />
    </svg>
  );
}

// 9. Settings (Slate gear with person avatar inside)
export function IconVNavSettings({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Gear outer cogwheel */}
      <path
        d="M18 4L20 4L20.5 7C21.4 7.3 22.3 7.8 23 8.5L25.8 7.3L27.2 8.7L26 11.5C26.7 12.2 27.2 13.1 27.5 14L30.5 14.5L30.5 16.5L27.5 17C27.2 17.9 26.7 18.8 26 19.5L27.2 22.3L25.8 23.7L23 22.5C22.3 23.2 21.4 23.7 20.5 24L20 27L18 27L17.5 24C16.6 23.7 15.7 23.2 15 22.5L12.2 23.7L10.8 22.3L12 19.5C11.3 18.8 10.8 17.9 10.5 17L7.5 16.5L7.5 14.5L10.5 14C10.8 13.1 11.3 12.2 12 11.5L10.8 8.7L12.2 7.3L15 8.5C15.7 7.8 16.6 7.3 17.5 7L18 4Z"
        fill="#94A3B8"
        stroke="#1E293B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Center circle */}
      <circle cx="18" cy="15.5" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.2" />

      {/* Person Silhouette inside gear */}
      <circle cx="18" cy="13" r="2.2" fill="#FED7AA" stroke="#1E293B" strokeWidth="1" />
      <path d="M16 11.8C16 11.8 17 11 18 11C19 11 20 11.8 20 12" stroke="#1E293B" strokeWidth="0.8" />
      <path d="M14 19C14 17 15.8 16 18 16C20.2 16 22 17 22 19H14Z" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1" />
    </svg>
  );
}

// 10. Announcements (Megaphone in golden yellow & red with broadcast waves)
export function IconVNavAnnouncements({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Handle */}
      <path d="M12 21L13 29H16L15 21" fill="#78350F" stroke="#1E293B" strokeWidth="1.2" strokeLinejoin="round" />

      {/* Main Megaphone Body (Golden Yellow & Red) */}
      <path d="M6 14H10L21 8V24L10 18H6C4.8 18 4 17.2 4 16V16C4 14.8 4.8 14 6 14Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="6" y="14" width="4" height="4" fill="#EF4444" stroke="#1E293B" strokeWidth="1" />

      {/* Front Bell Rim (Red) */}
      <ellipse cx="21" cy="16" rx="2" ry="8" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />

      {/* Sound broadcast waves */}
      <path d="M25 11C27 13 28 14.5 28 16C28 17.5 27 19 25 21" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M29 8C32 11 33 13.5 33 16C33 18.5 32 21 29 24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 11. Notes (Spiral notebook with colorful bookmark tabs)
export function IconVNavNotes({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bookmark tabs sticking out top */}
      <rect x="12" y="4" width="4" height="4" rx="1" fill="#34D399" stroke="#1E293B" strokeWidth="1" />
      <rect x="18" y="4" width="4" height="4" rx="1" fill="#FBBF24" stroke="#1E293B" strokeWidth="1" />
      <rect x="24" y="4" width="4" height="4" rx="1" fill="#60A5FA" stroke="#1E293B" strokeWidth="1" />

      {/* Notebook Cover */}
      <rect x="8" y="7" width="22" height="24" rx="2.5" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
      {/* Inner paper panel */}
      <rect x="12" y="9" width="16" height="20" rx="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />

      {/* Ruled lines */}
      <line x1="15" y1="13" x2="25" y2="13" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="17" x2="25" y2="17" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="21" x2="23" y2="21" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="25" x2="21" y2="25" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

      {/* Spiral wire rings on left */}
      <path d="M7 11C7 9.5 9 9.5 9 11" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 15C7 13.5 9 13.5 9 15" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 19C7 17.5 9 17.5 9 19" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 23C7 21.5 9 21.5 9 23" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 27C7 25.5 9 25.5 9 27" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 12. Materials (Folder binder with textbooks and CD disc)
export function IconVNavMaterials({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Back folder flap */}
      <path d="M5 8C5 6.8 6 6 7 6H14L16 9H29C30 9 31 10 31 11V26C31 27 30 28 29 28H7C6 28 5 27 5 26V8Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />

      {/* Book inside */}
      <rect x="9" y="11" width="14" height="15" rx="1.5" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="11" y="13" width="10" height="11" rx="1" fill="#FFFFFF" />

      {/* Front folder flap */}
      <path d="M4 14C4 13 5 12 6 12H30C31 12 32 13 32 14L30 28C30 29 29 30 28 30H6C5 30 4 29 4 28L4 14Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />

      {/* Shiny CD Media Disc sticking out */}
      <circle cx="25" cy="17" r="6" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
      <circle cx="25" cy="17" r="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
      <path d="M23 13C25 12 27 13 28 15" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 13. Timetable (Calendar with clock hands)
export function IconVNavTimetable({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Calendar body */}
      <rect x="5" y="7" width="26" height="23" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      {/* Red header strip */}
      <path d="M5 10C5 8.3 6.3 7 8 7H28C29.7 7 31 8.3 31 10V13H5V10Z" fill="#EF4444" stroke="#1E293B" strokeWidth="1.2" />

      {/* Ring clips */}
      <rect x="9" y="4.5" width="2.5" height="4.5" rx="1" fill="#1E293B" />
      <rect x="24.5" y="4.5" width="2.5" height="4.5" rx="1" fill="#1E293B" />

      {/* Calendar grid slots */}
      <rect x="8" y="16" width="3.5" height="3" rx="0.5" fill="#3B82F6" />
      <rect x="14" y="16" width="3.5" height="3" rx="0.5" fill="#10B981" />
      <rect x="8" y="21" width="3.5" height="3" rx="0.5" fill="#F59E0B" />
      <rect x="14" y="21" width="3.5" height="3" rx="0.5" fill="#EF4444" />

      {/* Clock icon in bottom right */}
      <circle cx="23" cy="22" r="5.5" fill="#F8FAFC" stroke="#1E293B" strokeWidth="1.2" />
      <circle cx="23" cy="22" r="0.8" fill="#1E293B" />
      <line x1="23" y1="22" x2="23" y2="18.5" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
      <line x1="23" y1="22" x2="25.5" y2="23.5" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 14. Attendance (Calendar with large green checkmark badge)
export function IconVNavAttendance({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Calendar body */}
      <rect x="5" y="7" width="26" height="23" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      {/* Header strip in teal/emerald */}
      <path d="M5 10C5 8.3 6.3 7 8 7H28C29.7 7 31 8.3 31 10V13H5V10Z" fill="#10B981" stroke="#1E293B" strokeWidth="1.2" />

      {/* Ring clips */}
      <rect x="9" y="4.5" width="2.5" height="4.5" rx="1" fill="#1E293B" />
      <rect x="24.5" y="4.5" width="2.5" height="4.5" rx="1" fill="#1E293B" />

      {/* Register lines */}
      <line x1="8" y1="16" x2="16" y2="16" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="20" x2="14" y2="20" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="24" x2="16" y2="24" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

      {/* Big Bright Green Checkmark Circle */}
      <circle cx="23" cy="22" r="6" fill="#10B981" stroke="#1E293B" strokeWidth="1.2" />
      <path d="M20 22L22 24L26 19.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 15. Complaints (Mailbox / envelope with orange exclamation alert badge)
export function IconVNavComplaints({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mailbox base */}
      <rect x="6" y="10" width="24" height="18" rx="2.5" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.5" />

      {/* Envelope flap */}
      <path d="M6 11L18 20L30 11" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 27L13 20" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 27L23 20" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

      {/* Orange/Yellow Exclamation Alert Shield Badge */}
      <circle cx="26" cy="10" r="5" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.2" />
      <text x="26" y="12" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle" dominantBaseline="middle">!</text>
    </svg>
  );
}

// 15b. Calendar (Flip desk calendar with red binder header)
export function IconVNavCalendar({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Red binder top */}
      <rect x="5" y="6" width="26" height="7" rx="2" fill="#DC2626" stroke="#1E293B" strokeWidth="1.5" />
      {/* Binder rings */}
      <circle cx="10" cy="5" r="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
      <circle cx="18" cy="5" r="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
      <circle cx="26" cy="5" r="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
      {/* White page body */}
      <rect x="5" y="13" width="26" height="17" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      {/* Date 24 */}
      <text x="18" y="25" fill="#1E293B" fontSize="11" fontWeight="900" textAnchor="middle" dominantBaseline="middle">24</text>
    </svg>
  );
}

// 16. Power / Logout (Red toggle switch at bottom of reference)
export function IconVNavPower({ size = 28, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M11 9C8 11.5 6.5 15 7 19C7.8 23.5 12 27 16.5 27C21.5 27 25.5 23 25.5 18C25.5 14.5 23.5 11.5 21 9" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="5" x2="16" y2="15" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 17. Live Examination (Radio waves / pulse activity)
export function IconVNavLiveExam({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="4" fill="#EF4444" />
      <path d="M11 11C8.2 13.8 8.2 18.2 11 21M21 11C23.8 13.8 23.8 18.2 21 21" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 7C2.6 11.4 2.6 18.6 7 23M25 7C29.4 11.4 29.4 18.6 25 23" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 1" />
    </svg>
  );
}

// 18. Exam Health (Heart pulse gauge)
export function IconVNavExamHealth({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="6" width="24" height="20" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
      <path d="M7 16H11L13 11L17 21L19 14L21 16H25" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 19. Individual Student Reports
export function IconVNavStudentReports({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="4" width="20" height="24" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="16" cy="12" r="3.5" fill="#3B82F6" />
      <path d="M11 21C11 18.5 13.2 17 16 17C18.8 17 21 18.5 21 21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="24" x2="22" y2="24" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 20. Device Management (MDM Tablet)
export function IconVNavDeviceMgmt({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="4" width="22" height="24" rx="4" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.2" />
      <line x1="14" y1="24" x2="18" y2="24" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="8" r="1" fill="#94A3B8" />
      <rect x="8" y="10" width="16" height="11" rx="2" fill="#E2E8F0" />
    </svg>
  );
}

// 21. Device Health (Battery & Thermal)
export function IconVNavDeviceHealth({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="9" width="20" height="14" rx="3.5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <path d="M25 13V19" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 12L12 16H16L14 20" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 22. Student Activity (Foreground clock telemetry)
export function IconVNavStudentActivity({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="11" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" />
      <polyline points="16,10 16,16 20,18" stroke="#7E22CE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 23. Academic Intelligence (Brain / Learning)
export function IconVNavAcademicIntel({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 5L5 11L16 17L27 11L16 5Z" fill="#FFE59A" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 14V21C9 23 12 25 16 25C20 25 23 23 23 21V14" stroke="#B45309" strokeWidth="2" />
      <line x1="27" y1="12" x2="27" y2="21" stroke="#D97706" strokeWidth="2" />
    </svg>
  );
}

// 24. Security Centre (Shield alert)
export function IconVNavSecurityCentre({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4L6 8V16C6 22 10.5 27 16 28C21.5 27 26 22 26 16V8L16 4Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" strokeLinejoin="round" />
      <line x1="16" y1="11" x2="16" y2="17" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="21" r="1.2" fill="#DC2626" />
    </svg>
  );
}

// 25. AI Predictions (Sparkles)
export function IconVNavAIPredictions({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 22L25.2 25.8L29 27L25.2 28.2L24 32L22.8 28.2L19 27L22.8 25.8L24 22Z" fill="#C4B5FD" />
    </svg>
  );
}

// 26. Reports & Export (Cloud download / bar chart)
export function IconVNavReportsExport({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="5" width="22" height="22" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
      <rect x="9" y="16" width="3" height="7" rx="1" fill="#0284C7" />
      <rect x="14" y="12" width="3" height="11" rx="1" fill="#0284C7" />
      <rect x="19" y="9" width="3" height="14" rx="1" fill="#0284C7" />
    </svg>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// ADMIN / TAB MANAGEMENT MODULE ICONS  (Sections 1-5)
// ═══════════════════════════════════════════════════════════════════════════

// SECTION 1 ── DEVICE ADMINISTRATION ────────────────────────────────────────

// All Devices – grid of tablets
export function IconAdmAllDevices({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="4" width="11" height="15" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.8"/>
      <rect x="6" y="21" width="5" height="2" rx="1" fill="#0284C7"/>
      <rect x="17" y="4" width="11" height="15" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.8"/>
      <rect x="20" y="21" width="5" height="2" rx="1" fill="#0284C7"/>
      <rect x="10" y="25" width="12" height="3" rx="1.5" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
    </svg>
  );
}

// Battery Health – battery with tick
export function IconAdmBatteryHealth({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="10" width="22" height="12" rx="2.5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.8"/>
      <rect x="25" y="13" width="4" height="6" rx="1.5" fill="#16A34A"/>
      <rect x="5" y="12" width="8" height="8" rx="1.5" fill="#16A34A"/>
      <polyline points="7,16 9.5,19 14,13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Device Inventory – clipboard with checklist
export function IconAdmDeviceInventory({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="5" width="20" height="24" rx="2.5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.8"/>
      <rect x="12" y="3" width="8" height="4" rx="2" fill="#EA580C"/>
      <line x1="10" y1="13" x2="22" y2="13" stroke="#EA580C" strokeWidth="1.4"/>
      <line x1="10" y1="17" x2="22" y2="17" stroke="#EA580C" strokeWidth="1.4"/>
      <line x1="10" y1="21" x2="18" y2="21" stroke="#EA580C" strokeWidth="1.4"/>
      <circle cx="8.5" cy="13" r="1.5" fill="#EA580C"/>
      <circle cx="8.5" cy="17" r="1.5" fill="#EA580C"/>
      <circle cx="8.5" cy="21" r="1.5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1"/>
    </svg>
  );
}

// Serial & Specs – barcode / chip
export function IconAdmSerialSpecs({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="8" width="24" height="16" rx="2" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.8"/>
      <line x1="8" y1="11" x2="8" y2="21" stroke="#64748B" strokeWidth="1.5"/>
      <line x1="11" y1="11" x2="11" y2="21" stroke="#64748B" strokeWidth="2.5"/>
      <line x1="14" y1="11" x2="14" y2="21" stroke="#64748B" strokeWidth="1.5"/>
      <line x1="17" y1="11" x2="17" y2="21" stroke="#64748B" strokeWidth="2"/>
      <line x1="20" y1="11" x2="20" y2="21" stroke="#64748B" strokeWidth="1.5"/>
      <line x1="23" y1="11" x2="23" y2="21" stroke="#64748B" strokeWidth="2.5"/>
    </svg>
  );
}

// Connectivity – WiFi waves
export function IconAdmConnectivity({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5 13C9 8 23 8 27 13" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 17C11 13.5 21 13.5 24 17" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 21C13 18.5 19 18.5 21 21" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="25" r="2" fill="#06B6D4"/>
    </svg>
  );
}

// Device Health – heart pulse on tablet
export function IconAdmDeviceHealth({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="5" width="24" height="22" rx="2.5" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.8"/>
      <polyline points="7,16 10,16 12,11 15,21 17,14 19,16 25,16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// SECTION 2 ── EXAMINATION CONTROL ───────────────────────────────────────────

// Live Monitoring – eye with pulse
export function IconAdmLiveMonitoring({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="16" cy="16" rx="11" ry="7" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.8"/>
      <circle cx="16" cy="16" r="3.5" fill="#DC2626"/>
      <circle cx="17" cy="15" r="1" fill="#fff"/>
      <circle cx="4" cy="6" r="2.5" fill="#EF4444"/>
      <line x1="4" y1="9" x2="4" y2="11" stroke="#EF4444" strokeWidth="1.5"/>
    </svg>
  );
}

// Time Management – clock with arrow
export function IconAdmTimeManagement({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="11" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.8"/>
      <polyline points="16,9 16,16 21,19" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 6 L27 9 L24 12" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Submissions – inbox tray with tick
export function IconAdmSubmissions({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="17" width="24" height="11" rx="2" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.8"/>
      <path d="M10 17V10L16 4L22 10V17" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.8" strokeLinejoin="round"/>
      <polyline points="12,20 15,23 20,18" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Exam Incidents – warning triangle with bolt
export function IconAdmExamIncidents({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4L29 27H3L16 4Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="16" y2="20" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="16" cy="23.5" r="1.3" fill="#EF4444"/>
    </svg>
  );
}

// SECTION 3 ── STUDENT ACTIVITY & INTELLIGENCE ───────────────────────────────

// App Usage – grid with analytics bars
export function IconAdmAppUsage({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="4" width="10" height="10" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5"/>
      <rect x="18" y="4" width="10" height="10" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5"/>
      <rect x="4" y="18" width="10" height="10" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5"/>
      <rect x="18" y="21" width="2.5" height="7" rx="1" fill="#7C3AED"/>
      <rect x="22" y="18" width="2.5" height="10" rx="1" fill="#7C3AED"/>
      <rect x="26" y="23" width="2.5" height="5" rx="1" fill="#7C3AED"/>
    </svg>
  );
}

// Browser Activity – globe with cursor
export function IconAdmBrowserActivity({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="14" cy="14" r="10" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1.8"/>
      <line x1="4" y1="14" x2="24" y2="14" stroke="#0EA5E9" strokeWidth="1.3"/>
      <ellipse cx="14" cy="14" rx="4.5" ry="10" stroke="#0EA5E9" strokeWidth="1.3"/>
      <path d="M22 22 L28 28" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="2" fill="#0EA5E9"/>
    </svg>
  );
}

// Tab Activity – overlapping browser tabs
export function IconAdmTabActivity({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="12" width="20" height="16" rx="2" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.8"/>
      <path d="M2 16h8V12a2 2 0 012-2h2a2 2 0 012 2v4" stroke="#6366F1" strokeWidth="1.5"/>
      <rect x="10" y="6" width="20" height="16" rx="2" fill="#C7D2FE" stroke="#6366F1" strokeWidth="1.8" opacity="0.7"/>
      <line x1="13" y1="12" x2="27" y2="12" stroke="#6366F1" strokeWidth="1.3"/>
      <line x1="13" y1="15" x2="24" y2="15" stroke="#6366F1" strokeWidth="1.3"/>
    </svg>
  );
}

// SECTION 4 ── SECURITY & REMOTE MANAGEMENT ──────────────────────────────────

// Remote Lock – padlock with radio waves
export function IconAdmRemoteLock({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="9" y="15" width="14" height="12" rx="2" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="1.8"/>
      <path d="M12 15V11a4 4 0 018 0v4" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="16" cy="21" r="2" fill="#B91C1C"/>
      <path d="M4 8 C6 4 10 2 16 2 C22 2 26 4 28 8" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M7 11 C9 8 12 6 16 6 C20 6 23 8 25 11" stroke="#B91C1C" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// App Deployment – rocket / upload arrow
export function IconAdmAppDeployment({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4 C10 4 7 10 8 18 L12 22 C12 25 11 28 11 28 L16 26 L21 28 C21 28 20 25 20 22 L24 18 C25 10 22 4 16 4Z" fill="#DCFCE7" stroke="#059669" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="16" cy="13" r="2.5" fill="#059669"/>
      <line x1="10" y1="27" x2="22" y2="27" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// OS Updates – refresh arrow with download
export function IconAdmOSUpdates({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 16 A10 10 0 1 1 10 23" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <polyline points="4,19 6,16 9,19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="10" x2="16" y2="21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="12,18 16,22 20,18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Audit Logs – document with magnifier
export function IconAdmAuditLogs({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="4" width="16" height="22" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.8"/>
      <line x1="9" y1="10" x2="17" y2="10" stroke="#64748B" strokeWidth="1.3"/>
      <line x1="9" y1="14" x2="17" y2="14" stroke="#64748B" strokeWidth="1.3"/>
      <line x1="9" y1="18" x2="14" y2="18" stroke="#64748B" strokeWidth="1.3"/>
      <circle cx="23" cy="22" r="5.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.8"/>
      <line x1="27" y1="26" x2="30" y2="29" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// SECTION 5 ── REPORTS & SYSTEM INTELLIGENCE ─────────────────────────────────

// Overall Reports – stacked bar chart
export function IconAdmOverallReports({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="20" width="5" height="8" rx="1" fill="#065F46"/>
      <rect x="4" y="15" width="5" height="5" rx="0.5" fill="#34D399"/>
      <rect x="12" y="12" width="5" height="16" rx="1" fill="#065F46"/>
      <rect x="12" y="7" width="5" height="5" rx="0.5" fill="#34D399"/>
      <rect x="20" y="17" width="5" height="11" rx="1" fill="#065F46"/>
      <rect x="20" y="12" width="5" height="5" rx="0.5" fill="#34D399"/>
      <line x1="3" y1="28" x2="27" y2="28" stroke="#064E3B" strokeWidth="1.5"/>
    </svg>
  );
}

// Student Reports – person with chart
export function IconAdmStudentReports({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="11" cy="10" r="4.5" fill="#DBEAFE" stroke="#0284C7" strokeWidth="1.8"/>
      <path d="M4 26c0-4 3-7 7-7s7 3 7 7" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <rect x="20" y="12" width="9" height="14" rx="1.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5"/>
      <rect x="22" y="20" width="2" height="4" rx="0.5" fill="#0284C7"/>
      <rect x="25" y="17" width="2" height="7" rx="0.5" fill="#0284C7"/>
    </svg>
  );
}

// Maintenance – wrench / spanner
export function IconAdmMaintenance({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M25 7a5 5 0 00-7 7L6 26a2 2 0 002 2 2 2 0 002-2L22 14a5 5 0 006-7 5 5 0 00-3 3z" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="8" cy="24" r="1.5" fill="#92400E"/>
    </svg>
  );
}

// Notifications – bell with dot
export function IconAdmNotifications({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 4a7 7 0 00-7 7v5l-2 3h18l-2-3v-5a7 7 0 00-7-7z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M13 24a3 3 0 006 0" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="23" cy="6" r="4" fill="#EF4444"/>
      <text x="23" y="9" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">!</text>
    </svg>
  );
}

// Configuration – gear / cog
export function IconAdmConfiguration({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1.8"/>
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M7.5 24.5l2.1-2.1M22.4 9.6l2.1-2.1" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="8" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
    </svg>
  );
}

// Parent Connect – phone call & parent/student shield
export function IconAdmParentConnect({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="3" width="26" height="26" rx="7" fill="#DCFCE7" stroke="#10B981" strokeWidth="1.8" />
      <path
        d="M10 12a2 2 0 012-2h1.2a1 1 0 01.95.68l.8 2.4a1 1 0 01-.24 1.05l-1.1 1.1a9 9 0 004.26 4.26l1.1-1.1a1 1 0 011.05-.24l2.4.8a1 1 0 01.68.95V21a2 2 0 01-2 2A12 12 0 019 11v1z"
        fill="#10B981"
      />
      <circle cx="21" cy="11" r="3" fill="#047857" />
    </svg>
  );
}
