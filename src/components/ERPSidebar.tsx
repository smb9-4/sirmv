import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconVNavPower, IconVNavDashboard } from './VerticalNavIcons';
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
  isLocked?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onToggleLock?: () => void;
  activeAdminSectionId?: string | null;
  onSelectAdminSection: (sectionId: string) => void;
}

const SECTION_ICON_IMAGES: Partial<Record<ERPModuleId, string>> = {
  dashboard: '/sidebar-icons/dashboard.png',
  announcements: '/student-section-icons/announcements.png',
  tests: '/student-section-icons/exams.png',
  notes: '/student-section-icons/notes.png',
  materials: '/student-section-icons/materials.png',
  reports: '/student-section-icons/results.png',
  timetable: '/student-section-icons/timetable.png',
  college_calendar: '/student-section-icons/calendar.png',
  complaints: '/student-section-icons/complaints.png',
  attendance: '/student-section-icons/attendance.png',
};

/* ─────────────────────────────────────────────────────────────────────────────
   FLAT NAV ITEM BUTTON (used for student + non-admin roles)
───────────────────────────────────────────────────────────────────────────── */
function FlatNavItem({
  item,
  isActive,
  isExpanded,
  labelsBelowIcon = false,
  onSelectModule,
}: {
  item: NavItemConfig;
  isActive: boolean;
  isExpanded: boolean;
  labelsBelowIcon?: boolean;
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
        whileHover={{ boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)' }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 450, damping: 24, mass: 0.5 }}
        className={`group relative transition-all duration-200 cursor-pointer ${
          isExpanded
            ? labelsBelowIcon
              ? 'w-full py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 text-center'
              : 'w-full py-2.5 px-3 rounded-2xl flex flex-row items-center gap-3 text-left max-[480px]:flex-col max-[480px]:items-center max-[480px]:gap-1 max-[480px]:px-1 max-[480px]:py-2 max-[480px]:text-center'
            : 'w-full mx-auto py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 text-center'
        } ${
          isActive
            ? 'bg-white/10 text-white border border-white/20 shadow-xs'
            : 'text-white border border-transparent hover:text-[#FFE59A] hover:bg-white/10'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeVerticalIndicator"
            className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#610000]"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}

        {iconImage ? labelsBelowIcon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
            <img
              src={iconImage}
              alt=""
              className="h-full w-full object-contain transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]"
            />
          </span>
        ) : (
          <img
            src={iconImage}
            alt=""
            className={`shrink-0 object-contain transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F] ${
              isExpanded ? 'w-6 h-6 max-[480px]:w-[34px] max-[480px]:h-[34px]' : 'w-[38px] h-[38px]'
            }`}
          />
        ) : (
          labelsBelowIcon ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
              <Icon size={28} className="transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]" />
            </span>
          ) : (
            <div className={`flex items-center justify-center shrink-0 transition-all ${
              isExpanded ? 'w-6 h-6 max-[480px]:w-[34px] max-[480px]:h-[34px]' : 'w-[38px] h-[38px]'
            }`}>
              <Icon
                size={isExpanded ? 19 : 34}
                className="transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]"
              />
            </div>
          )
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
          <span className={`leading-tight transition-all block text-[13px] font-black tracking-normal text-white group-hover:text-[#FFE59A] ${
            labelsBelowIcon
              ? 'w-full flex-none whitespace-normal text-center text-[9px]'
              : 'flex-1 truncate max-[480px]:w-full max-[480px]:flex-none max-[480px]:whitespace-normal max-[480px]:overflow-visible max-[480px]:text-[10px]'
          }`}
          >
            {item.label}
          </span>
        )}

        {item.badge && isExpanded && (
          <span className={`ml-auto ${labelsBelowIcon ? 'text-[8px]' : 'text-[10px]'} px-2 py-0.5 rounded-full font-black uppercase shadow-2xs border ${
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
          ? 'px-1 py-2 flex flex-col items-center justify-center gap-1 text-center'
          : 'flex-col px-1 py-2 flex items-center justify-center gap-1'
      } ${
        isActive
          ? 'bg-white/10 text-white border border-white/20 shadow-xs'
          : 'text-white border border-transparent hover:bg-white/10 hover:text-[#FFE59A]'
      }`}
      title={sidebarExpanded ? section.sectionLabel : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#FFE59A]" />
      )}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
        {section.sidebarIconSrc ? (
          <img
            src={section.sidebarIconSrc}
            alt=""
            className="h-full w-full object-contain transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]"
          />
        ) : (
          <SectionIcon
            size={28}
            className="text-[#610000] transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]"
          />
        )}
      </span>
      {sidebarExpanded ? (
        <span className="w-full flex-none whitespace-normal text-center text-[9px] font-black uppercase leading-tight tracking-wide text-white group-hover:text-[#FFE59A]">
          {section.sectionLabel}
        </span>
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
  isLocked = false,
  onHoverChange,
  onToggleLock,
  activeAdminSectionId = null,
  onSelectAdminSection,
}: ERPSidebarProps) {
  const isExpanded = externalExpanded ?? false;

  const isAdmin = currentRole === 'admin';
  const isStudent = currentRole === 'student';
  const isCompactPortal = isStudent || isAdmin;
  const sidebarWidth = isCompactPortal ? 68 : 86;
  const expandedSidebarWidth = isCompactPortal ? 89.76 : 236;

  // For non-admin, non-student roles use ALL_NAV_ITEMS flat list
  const flatItems = isStudent ? STUDENT_NAV_ITEMS : ALL_NAV_ITEMS;

  return (
    <motion.aside
      animate={{ width: isExpanded ? expandedSidebarWidth : sidebarWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.9 }}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      style={{
        maxWidth: isCompactPortal && isExpanded ? 'min(89.76px, max(68px, 17.952vw))' : undefined,
      }}
      className={`shrink-0 border-r border-white/10 h-full flex flex-col justify-between py-3 select-none z-[60] shadow-[1px_0_8px_rgba(0,0,0,0.06)] overflow-x-hidden ${
        isCompactPortal ? 'bg-[#8F1016]' : 'bg-[#610000]'
      } ${
        isExpanded
          ? isCompactPortal ? 'w-[89.76px] min-w-0' : 'w-[236px] min-w-[236px]'
          : isCompactPortal ? 'w-[68px] min-w-[68px]' : 'w-[86px] min-w-[86px]'
      }`}
    >
      {/* ── TOP HEADER ───────────────────────────────────────────── */}
      <div className="pt-1 pb-3 px-2 flex flex-col items-center border-b border-stone-100 w-full transition-all">
        {isCompactPortal ? (
          <motion.div
            animate={{ width: isExpanded ? 56 : 38, height: isExpanded ? 56 : 38 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="shrink-0 overflow-hidden rounded-[22%] border border-white/30 bg-white p-1 shadow-xs"
          >
            <img src="/updated_logo.png" alt="Sir MV College" className="h-full w-full object-contain" />
          </motion.div>
        ) : (
          isExpanded ? (
            <div className="w-full flex items-center px-1">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer w-9 h-9 rounded-[20%] bg-white/10 border border-white/10 p-1 flex items-center justify-center shadow-xs transition shrink-0"
                  onClick={() => onSelectModule('dashboard')}
                  title="Dashboard"
                >
                  <img src="/updated_logo.png" alt="Sir MV College" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </motion.div>
                <div className="leading-tight text-left overflow-hidden">
                  <span className="font-black text-xs text-white tracking-tight block truncate uppercase">Sir MV PU College</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-9 h-9 rounded-[20%] bg-white/10 border border-white/10 p-1 flex items-center justify-center shadow-xs transition"
                onClick={() => onSelectModule('dashboard')}
                title="Dashboard"
              >
                <img src="/updated_logo.png" alt="Sir MV College" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </motion.div>
            </div>
          )
        )}
        <button
          type="button"
          onClick={onToggleLock}
          aria-label={isLocked ? 'Unpin names' : 'Keep names visible'}
          aria-pressed={isLocked}
          title={isLocked ? 'Unpin names' : 'Keep names visible'}
          className={`mt-2 flex h-7 w-7 items-center justify-center rounded-lg text-[#FFE59A] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE59A] ${
            isLocked ? 'bg-white/10' : ''
          }`}
        >
          <img
            src="/sidebar-icons/sidebar-toggle.png"
            alt=""
            className="h-[18px] w-[18px] object-contain"
          />
        </button>
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
              labelsBelowIcon={isAdmin}
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
                  labelsBelowIcon={isStudent}
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
            <span className={`${isStudent ? 'text-[8px]' : 'text-[10px]'} font-black text-[#FFE59A] uppercase tracking-wider`}>Sir MV ERP v2.4</span>
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
