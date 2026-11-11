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
  parent_connect: '/student-section-icons/parent-connect.png',
};

/* ─────────────────────────────────────────────────────────────────────────────
   FLAT NAV ITEM BUTTON (used for student + non-admin roles)
───────────────────────────────────────────────────────────────────────────── */
function FlatNavItem({
  item,
  isActive,
  isExpanded,
  stackedLayout = false,
  disableAnimations = false,
  labelsBelowIcon = false,
  onSelectModule,
}: {
  item: NavItemConfig;
  isActive: boolean;
  isExpanded: boolean;
  stackedLayout?: boolean;
  disableAnimations?: boolean;
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
        aria-label={item.label}
        title={disableAnimations && !isExpanded ? item.label : undefined}
        onMouseEnter={disableAnimations ? undefined : () => setHovered(true)}
        onMouseLeave={disableAnimations ? undefined : () => setHovered(false)}
        onClick={() => onSelectModule(item.id)}
        whileHover={disableAnimations ? undefined : { boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)' }}
        whileTap={disableAnimations ? undefined : { scale: 0.96 }}
        transition={disableAnimations ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 24, mass: 0.5 }}
        className={`group relative cursor-pointer ${disableAnimations ? '' : 'transition-all duration-200'} ${
          stackedLayout
            ? 'w-full mx-auto px-1 py-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center'
            : isExpanded
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
          disableAnimations ? (
            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#FFE59A]" />
          ) : (
            <motion.div
              layoutId="activeVerticalIndicator"
              className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#610000]"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )
        )}

        {stackedLayout ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
            {iconImage ? (
              <img src={iconImage} alt="" className="h-full w-full object-contain" />
            ) : (
              <Icon size={28} className="text-[#610000]" />
            )}
          </span>
        ) : iconImage ? labelsBelowIcon ? (
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

        {!stackedLayout && !isExpanded && (
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

        <AnimatePresence>
          {isExpanded && (
            <motion.span
              key="expanded-label"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.14, delay: 0.1, ease: 'easeOut' }}
              className={`block leading-tight text-white group-hover:text-[#FFE59A] ${
                stackedLayout
                  ? 'w-full flex-none whitespace-normal px-0.5 text-center text-[10px] font-semibold'
                  : `transition-colors text-[13px] font-black tracking-normal ${
                    labelsBelowIcon
                      ? 'w-full flex-none whitespace-normal text-center text-[9px]'
                      : 'flex-1 truncate max-[480px]:w-full max-[480px]:flex-none max-[480px]:whitespace-normal max-[480px]:overflow-visible max-[480px]:text-[10px]'
                  }`
              }`}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {item.badge && isExpanded && !stackedLayout && (
          <span className={`ml-auto ${labelsBelowIcon ? 'text-[8px]' : 'text-[10px]'} px-2 py-0.5 rounded-full font-black uppercase shadow-2xs border ${
            isActive
              ? 'bg-[#610000] text-white border-[#610000]'
              : item.badge === 'Live' || item.badge === 'LIVE'
              ? `bg-[#EF4444] text-white border-white ${disableAnimations ? '' : 'animate-pulse'}`
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
  stackedLayout = false,
  disableAnimations = false,
  onSelectSection,
}: {
  section: AdminNavSection;
  activeModule: ERPModuleId;
  activeAdminSectionId: string | null;
  isExpanded: boolean;
  stackedLayout?: boolean;
  disableAnimations?: boolean;
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
      onMouseEnter={disableAnimations ? undefined : () => setHovered(true)}
      onMouseLeave={disableAnimations ? undefined : () => setHovered(false)}
      aria-current={isActive ? 'page' : undefined}
      aria-label={section.sectionLabel}
      className={`group relative w-full rounded-xl ${disableAnimations ? '' : 'transition-all duration-150'} ${
        stackedLayout
          ? sidebarExpanded
            ? 'px-1 py-2 flex flex-col items-center justify-center gap-1 text-center'
            : 'px-1 py-2 flex flex-col items-center justify-center gap-1 text-center'
          : sidebarExpanded
            ? 'px-1 py-2 flex flex-col items-center justify-center gap-1 text-center'
            : 'flex-col px-1 py-2 flex items-center justify-center gap-1'
      } ${
        isActive
          ? 'bg-white/10 text-white border border-white/20 shadow-xs'
          : 'text-white border border-transparent hover:bg-white/10 hover:text-[#FFE59A]'
      }`}
      title={stackedLayout
        ? !sidebarExpanded ? section.sectionLabel : undefined
        : sidebarExpanded ? section.sectionLabel : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#FFE59A]" />
      )}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
        {section.sidebarIconSrc ? (
          <img
            src={section.sidebarIconSrc}
            alt=""
            className={`h-full w-full object-contain ${disableAnimations ? '' : 'transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]'}`}
          />
        ) : (
          <SectionIcon
            size={28}
            className={`text-[#610000] ${disableAnimations ? '' : 'transition-[filter] group-hover:drop-shadow-[0_0_8px_#E6C28F]'}`}
          />
        )}
      </span>
      {sidebarExpanded ? (
        <span className={`text-white group-hover:text-[#FFE59A] ${
          stackedLayout
            ? 'w-full flex-none whitespace-normal px-0.5 text-center text-[10px] font-semibold leading-tight'
            : 'w-full flex-none whitespace-normal text-center text-[9px] font-black uppercase leading-tight tracking-wide'
        }`}>
          {section.sectionLabel}
        </span>
      ) : !stackedLayout ? (
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
      ) : null}
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
  const disableAnimations = isAdmin;
  const sidebarWidth = isCompactPortal ? 76 : 86;
  const expandedSidebarWidth = isCompactPortal ? 126 : 236;
  const sidebarToggleLabel = isLocked
    ? 'Collapse sidebar'
    : isExpanded ? 'Keep sidebar expanded' : 'Expand sidebar';

  // For non-admin, non-student roles use ALL_NAV_ITEMS flat list
  const flatItems = isStudent ? STUDENT_NAV_ITEMS : ALL_NAV_ITEMS;

  const sidebarToggleButton = (
    <button
      type="button"
      onClick={onToggleLock}
      aria-label={sidebarToggleLabel}
      aria-pressed={isLocked}
      title={sidebarToggleLabel}
      className={`flex h-7 w-7 items-center justify-center rounded-lg text-[#FFE59A] ${
        disableAnimations ? '' : 'transition'
      } hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE59A] ${
        !isCompactPortal || !isExpanded ? 'mt-2' : ''
      } ${isLocked ? 'bg-white/10' : ''}`}
    >
      <img
        src="/sidebar-icons/sidebar-toggle.png"
        alt=""
        className="h-[18px] w-[18px] object-contain"
      />
    </button>
  );

  return (
    <motion.aside
      animate={{ width: isExpanded ? expandedSidebarWidth : sidebarWidth }}
      transition={disableAnimations ? { duration: 0 } : { type: 'tween', duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      onPointerEnter={isTabMode ? undefined : () => onHoverChange?.(true)}
      onPointerLeave={isTabMode ? undefined : () => onHoverChange?.(false)}
      className={`shrink-0 border-r border-white/10 h-full flex flex-col justify-between py-3 select-none z-[60] shadow-[1px_0_8px_rgba(0,0,0,0.06)] overflow-x-hidden ${
        isCompactPortal ? 'bg-[#8F1016]' : 'bg-[#610000]'
      } ${
        isExpanded
          ? isCompactPortal ? 'w-[126px] min-w-[126px]' : 'w-[236px] min-w-[236px]'
          : isCompactPortal ? 'w-[76px] min-w-[76px]' : 'w-[86px] min-w-[86px]'
      }`}
    >
      {/* ── TOP HEADER ───────────────────────────────────────────── */}
      <div className={`pt-1 pb-3 px-2 flex flex-col items-center border-b border-stone-100 w-full ${disableAnimations ? '' : 'transition-all'}`}>
        {isCompactPortal ? (
          <div className={`w-full ${isExpanded ? 'flex items-center justify-center gap-1' : 'flex flex-col items-center'}`}>
            {disableAnimations ? (
              <div className={`shrink-0 overflow-hidden rounded-[22%] border border-white/30 bg-white p-1 shadow-xs ${
                isExpanded ? 'h-12 w-12' : 'h-10 w-10'
              }`}>
                <img src="/updated_logo.png" alt="Sir MV College" className="h-full w-full object-contain" />
              </div>
            ) : (
              <motion.div
                animate={{ width: isExpanded ? 48 : 40, height: isExpanded ? 48 : 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="shrink-0 overflow-hidden rounded-[22%] border border-white/30 bg-white p-1 shadow-xs"
              >
                <img src="/updated_logo.png" alt="Sir MV College" className="h-full w-full object-contain" />
              </motion.div>
            )}
            {sidebarToggleButton}
          </div>
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
        {!isCompactPortal && sidebarToggleButton}
      </div>

      {/* ── NAVIGATION ───────────────────────────────────────────── */}
      <nav className={`flex-1 w-full overflow-y-auto overflow-x-hidden py-2 px-1.5 no-scrollbar ${disableAnimations ? 'scroll-auto' : 'scroll-smooth'}`}>
        {isAdmin ? (
          /* ── ADMIN: 5 Grouped Sections ── */
          <div className="space-y-1">
            {/* Dashboard shortcut */}
            <FlatNavItem
              item={{ id: 'dashboard', label: 'Dashboard', icon: IconVNavDashboard }}
              isActive={activeModule === 'dashboard' && !activeAdminSectionId}
              isExpanded={isExpanded}
              stackedLayout={isCompactPortal}
              disableAnimations={disableAnimations}
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
                stackedLayout={isCompactPortal}
                disableAnimations={disableAnimations}
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
                  stackedLayout={isCompactPortal}
                  disableAnimations={disableAnimations}
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
              whileHover={disableAnimations ? undefined : { scale: 1.15, rotate: 180 }}
              whileTap={disableAnimations ? undefined : { scale: 0.92 }}
              transition={disableAnimations ? { duration: 0 } : undefined}
              onClick={() => onSelectModule('dashboard')}
              className={`p-1.5 rounded-full hover:bg-red-50 text-[#FFE59A] hover:text-[#FFE59A] ${disableAnimations ? '' : 'transition'}`}
              title="Return to Dashboard"
            >
              <IconVNavPower size={20} />
            </motion.button>
            <span className={`${isStudent ? 'text-[8px]' : 'text-[10px]'} font-black text-[#FFE59A] uppercase tracking-wider`}>Sir MV ERP v2.4</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={disableAnimations ? undefined : { scale: 1.15, rotate: 180 }}
              whileTap={disableAnimations ? undefined : { scale: 0.92 }}
              transition={disableAnimations ? { duration: 0 } : undefined}
              onClick={() => onSelectModule('dashboard')}
              className={`p-1.5 rounded-full hover:bg-red-50 text-[#FFE59A] hover:text-[#FFE59A] ${disableAnimations ? '' : 'transition'}`}
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
