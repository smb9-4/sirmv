import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconVNavPower, IconVNavDashboard } from './VerticalNavIcons';
import { ChevronRight } from 'lucide-react';
import {
  ERPModuleId,
  UserRoleType,
  NavItemConfig,
  ALL_NAV_ITEMS,
  STUDENT_NAV_ITEMS,
  ADMIN_NAV_SECTIONS,
  AdminNavSection,
} from './erpNavConfig';

interface ERPSidebarProps {
  activeModule: ERPModuleId;
  onSelectModule: (moduleId: ERPModuleId) => void;
  currentRole?: UserRoleType;
  isExpanded?: boolean;
  onExpandSidebar?: () => void;
  activeAdminSectionId?: string | null;
  onSelectAdminSection: (sectionId: string) => void;
}

const SECTION_ICON_IMAGES: Partial<Record<ERPModuleId, string>> = {
  dashboard: '/sidebar-icons/dashboard.png',
  announcements: '/sidebar-icons/announcements.png',
  tests: '/sidebar-icons/exams.png',
  notes: '/sidebar-icons/notes.png',
  materials: '/sidebar-icons/materials.png',
  reports: '/sidebar-icons/results.png',
  timetable: '/sidebar-icons/timetable.png',
  college_calendar: '/sidebar-icons/timetable.png',
  complaints: '/sidebar-icons/complaints.png',
  attendance: '/sidebar-icons/attendance.png',
};

/* ─────────────────────────────────────────────────────────────────────────────
   FLAT NAV ITEM BUTTON (used for student + non-admin roles)
───────────────────────────────────────────────────────────────────────────── */
function FlatNavItem({
  item,
  isActive,
  isExpanded,
  onSelectModule,
}: {
  item: NavItemConfig;
  isActive: boolean;
  isExpanded: boolean;
  onSelectModule: (id: ERPModuleId) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  const iconImage = SECTION_ICON_IMAGES[item.id];

  return (
    <div className="relative w-full px-0.5">
      <motion.button
        aria-current={isActive ? 'page' : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelectModule(item.id)}
        whileHover={{
          scale: isExpanded ? 1.02 : 1.05,
          y: isExpanded ? 0 : -1,
          boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)',
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 450, damping: 24, mass: 0.5 }}
        className={`group relative transition-all duration-200 cursor-pointer ${
          isExpanded
            ? 'w-full py-2.5 px-3 rounded-2xl flex flex-row items-center gap-3 text-left'
            : 'w-[68px] mx-auto py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 text-center'
        } ${
          isActive
            ? 'bg-[#F3F3F3] text-[#610000] border border-[#E6C28F] shadow-xs'
            : 'text-[#FFE59A] border border-transparent hover:text-[#FFE59A] hover:bg-white/10'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeVerticalIndicator"
            className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#610000]"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}

        {iconImage ? (
          <img
            src={iconImage}
            alt=""
            className={`shrink-0 object-contain transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F] ${
              isExpanded ? 'w-6 h-6' : 'w-[38px] h-[38px]'
            }`}
          />
        ) : (
          <div className={`flex items-center justify-center shrink-0 transition-all ${isExpanded ? 'w-6 h-6' : 'w-[38px] h-[38px]'}`}>
            <Icon
              size={isExpanded ? 19 : 34}
              className="transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]"
            />
          </div>
        )}

        {!isExpanded && (
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="max-w-[64px] whitespace-normal text-[9px] font-bold leading-tight text-center text-[#FFE59A]"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        )}

        {isExpanded && (
          <span className={`leading-tight transition-all block text-[13px] font-black tracking-normal flex-1 truncate ${
            isActive ? 'text-[#610000]' : 'text-[#FFE59A]'
          }`}>
            {item.label}
          </span>
        )}

        {item.badge && isExpanded && (
          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-black uppercase shadow-2xs border ${
            isActive
              ? 'bg-[#610000] text-white border-[#610000]'
              : item.badge === 'Live' || item.badge === 'LIVE'
              ? 'bg-[#EF4444] text-white border-white animate-pulse'
              : 'bg-[#EF4444] text-white border-white'
          }`}>
            {item.badge}
          </span>
        )}
      </motion.button>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GROUPED ADMIN SECTION (collapsible header + item list)
───────────────────────────────────────────────────────────────────────────── */
function AdminSectionGroup({
  section,
  activeModule,
  activeAdminSectionId,
  isExpanded: sidebarExpanded,
  onSelectSection,
}: {
  section: AdminNavSection;
  activeModule: ERPModuleId;
  activeAdminSectionId: string | null;
  isExpanded: boolean;
  onSelectSection: (sectionId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive =
    activeAdminSectionId === section.sectionId ||
    section.items.some((i) => i.id === activeModule);
  const SectionIcon = section.sectionIcon;

  return (
    <button
      onClick={() => onSelectSection(section.sectionId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? 'page' : undefined}
      className={`group relative w-full transition-all duration-150 rounded-xl ${
        sidebarExpanded
          ? 'px-2 py-2 flex items-center gap-2 text-left'
          : 'flex-col px-1 py-2 flex items-center justify-center gap-1'
      } ${
        isActive
        ? 'bg-[#F3F3F3] text-[#610000] border border-[#E6C28F] shadow-xs'
        : 'text-[#FFE59A] border border-transparent hover:bg-white/10 hover:text-[#FFE59A]'
      }`}
      title={sidebarExpanded ? section.sectionLabel : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#610000]" />
      )}
      <span className="shrink-0 transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]" style={{ color: isActive ? '#610000' : '#FFE59A' }}>
        {section.sidebarIconSrc ? (
          <img
            src={section.sidebarIconSrc}
            alt=""
            className={`object-contain ${sidebarExpanded ? 'h-5 w-5' : 'h-[31px] w-[31px]'}`}
          />
        ) : (
          <SectionIcon size={sidebarExpanded ? 20 : 31} />
        )}
      </span>
      {sidebarExpanded ? (
        <>
          <span
            className="flex-1 text-left text-[11px] font-black uppercase tracking-wider truncate"
            style={{ color: isActive ? '#610000' : '#FFE59A' }}
          >
            {section.sectionLabel}
          </span>
          <ChevronRight size={13} className="shrink-0" style={{ color: isActive ? '#610000' : '#FFE59A' }} />
        </>
      ) : (
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="max-w-[64px] whitespace-normal text-[8px] font-black uppercase leading-tight text-center text-[#FFE59A]"
            >
              {section.sectionLabel}
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SIDEBAR COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function ERPSidebar({
  activeModule,
  onSelectModule,
  currentRole = 'principal',
  isExpanded: externalExpanded,
  onExpandSidebar,
  activeAdminSectionId = null,
  onSelectAdminSection,
}: ERPSidebarProps) {
  const isExpanded = externalExpanded ?? false;

  const isAdmin = currentRole === 'admin';
  const isStudent = currentRole === 'student';

  // For non-admin, non-student roles use ALL_NAV_ITEMS flat list
  const flatItems = isStudent ? STUDENT_NAV_ITEMS : ALL_NAV_ITEMS;

  return (
    <motion.aside
      animate={{ width: isExpanded ? 236 : 86 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={`shrink-0 bg-[#610000] border-r border-white/10 h-full flex flex-col justify-between py-3 select-none z-[60] shadow-[1px_0_8px_rgba(0,0,0,0.06)] overflow-x-hidden ${
        isExpanded ? 'w-[236px] min-w-[236px]' : 'w-[86px] min-w-[86px]'
      }`}
    >
      {/* ── TOP HEADER ───────────────────────────────────────────── */}
      <div className="pt-1 pb-3 px-2 flex flex-col items-center border-b border-stone-100 w-full transition-all">
        {isExpanded ? (
          isStudent ? (
            <div className="w-full flex flex-col items-center px-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-[77px] h-[77px] rounded-full border border-white/20 overflow-hidden shadow-xs"
                onClick={onExpandSidebar}
                aria-label="View Rahul Sharma's profile"
                aria-expanded="true"
                title="Rahul Sharma"
              >
                <img src="/student-profile.png?v=1" alt="Rahul Sharma" className="w-full h-full object-cover" />
              </motion.button>
              <div className="mt-2 text-center leading-tight">
                <span className="block text-xs font-black text-white">Rahul Sharma</span>
                <span className="mt-1 block text-[10px] font-bold text-[#FFE59A]">23CSE001</span>
              </div>
              <div className="mt-3 w-full border-t border-white/20 pt-2 text-center leading-relaxed">
                <span className="block text-[11px] font-bold text-white/90">PUC - Computer Science</span>
                <span className="block text-[11px] font-bold text-white/90">JEE/NEET</span>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center px-1">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer w-9 h-9 rounded-[20%] bg-white/10 border border-white/10 p-1 flex items-center justify-center shadow-xs transition shrink-0"
                  onClick={() => onSelectModule('dashboard')}
                  title="Dashboard"
                >
                  <img src="/logo.png?v=3" alt="Sir MV College" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </motion.div>
                <div className="leading-tight text-left overflow-hidden">
                  <span className="font-black text-xs text-white tracking-tight block truncate uppercase">Sir MV PU College</span>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex w-full justify-center">
            {isStudent ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-[43px] h-[43px] rounded-full border border-white/20 overflow-hidden shadow-xs"
                onClick={onExpandSidebar}
                aria-label="Open Rahul Sharma's profile"
                aria-expanded="false"
                title="Open student profile"
              >
                <img src="/student-profile.png?v=1" alt="Rahul Sharma" className="w-full h-full object-cover" />
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-9 h-9 rounded-[20%] bg-white/10 border border-white/10 p-1 flex items-center justify-center shadow-xs transition"
                onClick={() => onSelectModule('dashboard')}
                title="Dashboard"
              >
                <img src="/logo.png?v=3" alt="Sir MV College" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* ── NAVIGATION ───────────────────────────────────────────── */}
      <nav className="flex-1 w-full overflow-y-auto overflow-x-hidden py-2 px-1.5 no-scrollbar scroll-smooth">
        {isAdmin ? (
          /* ── ADMIN: 5 Grouped Sections ── */
          <div className="space-y-1">
            {/* Dashboard shortcut */}
            <FlatNavItem
              item={{ id: 'dashboard', label: 'Dashboard', icon: IconVNavDashboard }}
              isActive={activeModule === 'dashboard' && !activeAdminSectionId}
              isExpanded={isExpanded}
              onSelectModule={onSelectModule}
            />

            {/* 5 collapsible sections */}
            {ADMIN_NAV_SECTIONS.map((section) => (
              <AdminSectionGroup
                key={section.sectionId}
                section={section}
                activeModule={activeModule}
                activeAdminSectionId={activeAdminSectionId}
                isExpanded={isExpanded}
                onSelectSection={onSelectAdminSection}
              />
            ))}
          </div>
        ) : (
          /* ── STUDENT / OTHER ROLES: Flat list ── */
          <div className="space-y-1.5">
            {flatItems.map((item) => {
              const isActive =
                activeModule === item.id ||
                (item.id === 'tests' && activeModule === 'exam_management') ||
                (item.id === 'announcements' && activeModule === 'noticeboard') ||
                (item.id === 'complaints' && activeModule === 'reported_issues');

              return (
                <FlatNavItem
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  onSelectModule={onSelectModule}
                />
              );
            })}
          </div>
        )}
      </nav>

      {/* ── BOTTOM CONTROLS ──────────────────────────────────────── */}
      <div className="pt-2 pb-1 border-t border-stone-100 flex flex-col items-center gap-1 w-full px-2">
        {isExpanded ? (
          <div className="w-full flex items-center justify-between px-2 py-1">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectModule('dashboard')}
              className="p-1.5 rounded-full hover:bg-red-50 text-[#FFE59A] hover:text-[#FFE59A] transition"
              title="Return to Dashboard"
            >
              <IconVNavPower size={20} />
            </motion.button>
            <span className="text-[10px] font-black text-[#FFE59A] uppercase tracking-wider">Sir MV ERP v2.4</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectModule('dashboard')}
              className="p-1.5 rounded-full hover:bg-red-50 text-[#FFE59A] hover:text-[#FFE59A] transition"
              title="Return to Dashboard"
            >
              <IconVNavPower size={29} />
            </motion.button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
