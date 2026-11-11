import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Check, ShieldCheck, User, Users, GraduationCap, Sparkles, LogOut, Tablet } from 'lucide-react';
import type { Announcement } from '../types';

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
  unreadAnnouncements: Announcement[];
  onOpenAnnouncement: (announcement: Announcement) => void;
}

export default function ERPHeader({
  currentRole,
  onRoleChange,
  unreadAnnouncements,
  onOpenAnnouncement,
}: ERPHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Normalize any legacy role (principal/super_admin/teacher) to 'admin'
  const normalizedRole: 'admin' | 'student' = currentRole === 'student' ? 'student' : 'admin';
  const activeProfile = ROLE_PROFILES[normalizedRole];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full px-4 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_12px_rgba(0,0,0,0.08)]" style={{ backgroundColor: '#A41419' }}>
      {/* Left side: College name */}
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs md:text-sm text-white tracking-tight uppercase">
              SIR MV PU COLLEGE
            </span>
          </div>
          <span className="mt-0.5 block text-[10px] font-semibold text-white/75">
            {normalizedRole === 'student' ? 'SIRMV Campus' : activeProfile.campus}
          </span>
        </div>
      </div>

      {/* Right side: Notification & Role Switcher Dropdown */}
      <div className="flex items-center gap-3">
        {normalizedRole === 'student' && (
          <>
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label={unreadAnnouncements.length > 0 ? `Notifications, ${unreadAnnouncements.length} unread` : 'Notifications'}
                aria-haspopup="dialog"
                aria-expanded={notificationsOpen}
                title="Notifications"
                className="relative w-9 h-9 rounded-full border border-white/20 hover:bg-white/10 text-white flex items-center justify-center transition apple-button"
              >
                <Bell size={16} />
                {unreadAnnouncements.length > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black leading-[18px] text-center shadow-sm"
                  >
                    {unreadAnnouncements.length > 99 ? '99+' : unreadAnnouncements.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  role="dialog"
                  aria-label="Unread messages"
                  className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
                    <h2 className="text-sm font-black">Messages</h2>
                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-700">
                      {unreadAnnouncements.length} unread
                    </span>
                  </div>

                  {unreadAnnouncements.length === 0 ? (
                    <p className="px-4 py-6 text-center text-xs font-medium text-stone-500">You’re all caught up.</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto p-2">
                      {unreadAnnouncements.map((announcement) => (
                        <button
                          key={announcement.id}
                          type="button"
                          onClick={() => {
                            setNotificationsOpen(false);
                            onOpenAnnouncement(announcement);
                          }}
                          className="block w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A60000]"
                        >
                          <span className="block truncate text-[10px] font-bold text-[#A60000]">
                            {announcement.senderName} · {announcement.designation}
                          </span>
                          <span className="mt-0.5 block text-xs font-extrabold text-stone-900">
                            {announcement.title}
                          </span>
                          <span className="mt-1 block text-[11px] leading-relaxed text-stone-600">
                            {announcement.message.length > 100
                              ? `${announcement.message.slice(0, 100)}…`
                              : announcement.message}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Profile Dropdown Menu Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all apple-button shadow-sm"
          >
            {/* Initial Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${
                normalizedRole === 'student' ? 'text-[#500000]' : 'text-white'
              }`}
              style={{ backgroundColor: normalizedRole === 'student' ? '#E5BD55' : activeProfile.color }}
            >
              {activeProfile.initial}
            </div>

            {/* Name & Role */}
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-white leading-tight">
                {activeProfile.title}
              </div>
              <div className="text-[10px] font-black text-[#FFE59A] uppercase tracking-wider">
                {activeProfile.roleBadge}
              </div>
            </div>

            <ChevronDown size={14} className="text-white/80 ml-0.5" />
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
                        setNotificationsOpen(false);
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
