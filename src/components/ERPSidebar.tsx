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
  activeAdminSectionId?: string | null;
  onSelectAdminSection: (sectionId: string) => void;
}

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
        className={`relative transition-all duration-200 cursor-pointer ${
          isExpanded
            ? 'w-full py-2.5 px-3 rounded-2xl flex flex-row items-center gap-3 text-left'
            : 'w-[68px] mx-auto py-2 px-1 rounded-2xl flex flex-col items-center justify-center text-center'
        } ${
          isActive
            ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#BFDBFE] shadow-xs'
            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50/90'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeVerticalIndicator"
            className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#1A73E8]"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}

        <div className={`flex items-center justify-center shrink-0 transition-all ${isExpanded ? 'w-6 h-6' : 'w-8 h-8 mb-1'}`}>
          <Icon size={isExpanded ? 19 : 28} />
        </div>

        <span className={`leading-tight transition-all block ${
          isExpanded
            ? 'text-[13px] font-black tracking-normal text-stone-900 flex-1 truncate'
            : 'text-[9.5px] font-bold tracking-tight text-center truncate max-w-[62px]'
        } ${isActive ? 'text-[#1A73E8] font-black' : ''}`}>
          {item.label}
        </span>

        {item.badge && (
          <span className={`font-black uppercase shadow-2xs border ${
            isExpanded
              ? 'ml-auto text-[10px] px-2 py-0.5 rounded-full'
              : 'absolute top-0.5 right-1 text-[9px] px-1.5 rounded-full'
          } ${
            isActive
              ? 'bg-[#1A73E8] text-white border-white'
              : item.badge === 'Live' || item.badge === 'LIVE'
              ? 'bg-[#EF4444] text-white border-white animate-pulse'
              : 'bg-[#EF4444] text-white border-white'
          }`}>
            {item.badge}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {!isExpanded && hovered && (
          <motion.div
            initial={{ opacity: 0, x: 6, scale: 0.95 }}
            animate={{ opacity: 1, x: 76, scale: 1 }}
            exit={{ opacity: 0, x: 4, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:flex items-center"
          >
            <div className="bg-stone-900 text-white text-xs font-black py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-stone-800">
              <span>{item.label}</span>
              <ChevronRight size={12} className="text-stone-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const isActive =
    activeAdminSectionId === section.sectionId ||
    section.items.some((i) => i.id === activeModule);
  const SectionIcon = section.sectionIcon;

  return (
    <button
      onClick={() => onSelectSection(section.sectionId)}
      aria-current={isActive ? 'page' : undefined}
      className={`relative w-full transition-all duration-150 rounded-xl ${
        sidebarExpanded
          ? 'px-2 py-2 flex items-center gap-2 text-left'
          : 'flex-col px-1 py-2 flex items-center justify-center'
      } ${
        isActive
          ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#BFDBFE] shadow-xs'
          : 'hover:bg-stone-50'
      }`}
      title={section.sectionLabel}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#1A73E8]" />
      )}
      <span className="shrink-0" style={{ color: isActive ? '#1A73E8' : section.sectionColor }}>
        <SectionIcon size={sidebarExpanded ? 20 : 26} />
      </span>
      {sidebarExpanded ? (
        <>
          <span
            className="flex-1 text-left text-[11px] font-black uppercase tracking-wider truncate"
            style={{ color: isActive ? '#1A73E8' : section.sectionColor }}
          >
            {section.sectionLabel}
          </span>
          <ChevronRight size={13} className="shrink-0" style={{ color: isActive ? '#1A73E8' : section.sectionColor }} />
        </>
      ) : (
        <span className="text-[8px] font-black uppercase tracking-tight leading-tight text-center" style={{ color: isActive ? '#1A73E8' : section.sectionColor, maxWidth: 62 }}>
          {section.sectionLabel.split(' ')[0]}
        </span>
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
      className={`shrink-0 bg-white border-r border-stone-200/90 h-screen sticky top-0 flex flex-col justify-between py-3 select-none z-[60] shadow-[1px_0_8px_rgba(0,0,0,0.02)] overflow-x-hidden ${
        isExpanded ? 'w-[236px] min-w-[236px]' : 'w-[86px] min-w-[86px]'
      }`}
    >
      {/* ── TOP HEADER ───────────────────────────────────────────── */}
      <div className="pt-1 pb-3 px-2 flex flex-col items-center border-b border-stone-100 w-full transition-all">
        {isExpanded ? (
          <div className="w-full flex items-center px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-9 h-9 rounded-2xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-xs hover:border-[#650000] transition shrink-0"
                onClick={() => onSelectModule('dashboard')}
                title="Dashboard"
              >
                <img src="/logo.png" alt="Sir MV College" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </motion.div>
              <div className="leading-tight text-left overflow-hidden">
                <span className="font-black text-xs text-stone-900 tracking-tight block truncate uppercase">Sir MV PU College</span>
                <span className="text-[9px] font-black text-[#A60000] uppercase tracking-wider block">Campus ERP</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer w-9 h-9 rounded-2xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-xs hover:border-[#650000] transition"
              onClick={() => onSelectModule('dashboard')}
              title="Dashboard"
            >
              <img src="/logo.png" alt="Sir MV College" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </motion.div>
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

            {/* Thin divider */}
            <div className="border-t border-stone-100 my-1" />

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
              className="p-1.5 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
              title="Return to Dashboard"
            >
              <IconVNavPower size={20} />
            </motion.button>
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Sir MV ERP v2.4</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectModule('dashboard')}
              className="p-1.5 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
              title="Return to Dashboard"
            >
              <IconVNavPower size={24} />
            </motion.button>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">v2.4 ERP</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
