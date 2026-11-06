import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Check, ShieldCheck, User, Users, GraduationCap, Sparkles, LogOut, Tablet } from 'lucide-react';

export type UserRoleType = 'admin' | 'student' | 'super_admin' | 'principal' | 'teacher';

export interface RoleProfile {
  id: 'admin' | 'student';
  title: string;
  name: string;
  roleBadge: string;
  email: string;
  campus: string;
  initial: string;
  color: string;
  description: string;
}

export const ROLE_PROFILES: Record<'admin' | 'student', RoleProfile> = {
  admin: {
    id: 'admin',
    title: 'Admin / Tab Management',
    name: 'Executive Administration & Tab Control',
    roleBadge: 'ADMIN / TAB',
    email: 'admin@sirmv.edu.in',
    campus: 'Central Management & Tablet Hub',
    initial: 'A',
    color: '#650000',
    description: 'Full institutional portal, tablet management & all academic modules',
  },
  student: {
    id: 'student',
    title: 'Student Section',
    name: 'Rahul Sharma (24PUC101 • II PU Science)',
    roleBadge: 'STUDENT',
    email: 'rahul.sharma@sirmv.edu.in',
    campus: 'Shivamogga PU Campus • Science',
    initial: 'S',
    color: '#0284C7',
    description: 'Student academic portal, exams, live test results & notes',
  },
};

interface ERPHeaderProps {
  currentRole: UserRoleType;
  onRoleChange: (newRole: UserRoleType) => void;
}

export default function ERPHeader({ currentRole, onRoleChange }: ERPHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize any legacy role (principal/super_admin/teacher) to 'admin'
  const normalizedRole: 'admin' | 'student' = currentRole === 'student' ? 'student' : 'admin';
  const activeProfile = ROLE_PROFILES[normalizedRole];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-stone-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Left side: College Logo & Campus ERP Badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center p-1 shadow-sm">
          <img src="/logo.png" alt="Sir MV" className="w-full h-full object-contain" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xs md:text-sm text-stone-900 tracking-tight uppercase">
              SIR MV PU COLLEGE
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              CAMPUS ERP
            </span>
          </div>
          <div className="text-[11px] text-[#0284C7] font-bold flex items-center gap-1">
            <span>🏛️ Shivamogga PU Campus</span>
          </div>
        </div>
      </div>

      {/* Right side: Notification & Role Switcher Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="w-9 h-9 rounded-full border border-stone-200/80 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition apple-button">
          <Bell size={16} />
        </button>

        {/* Profile Dropdown Menu Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-stone-200/90 hover:bg-stone-50 transition-all apple-button shadow-sm"
          >
            {/* Initial Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm"
              style={{ backgroundColor: activeProfile.color }}
            >
              {activeProfile.initial}
            </div>

            {/* Name & Role */}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-stone-900 leading-tight">
                {activeProfile.title}
              </div>
              <div className="text-[10px] font-black text-[#A60000] uppercase tracking-wider">
                {activeProfile.roleBadge}
              </div>
            </div>

            <ChevronDown size={14} className="text-stone-400 ml-0.5" />
          </button>

          {/* Role Switcher Dropdown Menu: ONLY Student Section and Admin/Tab Management */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-stone-200/80 p-2.5 z-50 apple-modal-enter">
              <div className="px-3 py-2 border-b border-stone-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                  Switch Active Portal Role
                </span>
                <span className="text-xs text-stone-600 font-medium">
                  Select a section to preview and manage that workspace instantly
                </span>
              </div>

              <div className="py-2 space-y-1.5">
                {(['admin', 'student'] as const).map((roleKey) => {
                  const prof = ROLE_PROFILES[roleKey];
                  const isSelected = normalizedRole === roleKey;

                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        onRoleChange(roleKey);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#FFE59A]/40 text-[#650000] font-bold border border-[#E5BD55]'
                          : 'hover:bg-stone-50 text-stone-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs shrink-0"
                          style={{ backgroundColor: prof.color }}
                        >
                          {prof.initial}
                        </div>
                        <div>
                          <div className="text-xs font-black text-stone-900 leading-snug">
                            {prof.title}
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            {prof.name}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check size={18} className="text-[#650000] stroke-[2.5] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-stone-100 px-3 py-1 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                <span>Direct Access Mode</span>
                <span className="text-green-600 font-black">● Active Session</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
