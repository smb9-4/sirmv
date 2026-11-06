import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconVNavPower, IconVNavDashboard } from './VerticalNavIcons';
import { Menu, ChevronRight, ChevronDown } from 'lucide-react';
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
  onToggleExpand?: () => void;
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
  isExpanded: sidebarExpanded,
  onSelectModule,
}: {
  section: AdminNavSection;
  activeModule: ERPModuleId;
  isExpanded: boolean;
  onSelectModule: (id: ERPModuleId) => void;
}) {
  const hasActiveChild = section.items.some((i) => i.id === activeModule);
  const [open, setOpen] = useState(hasActiveChild || section.sectionNumber === 1);
  const SectionIcon = section.sectionIcon;

  return (
    <div className="w-full">
      {/* ── Section Header Button ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center gap-2 transition-all duration-150 rounded-xl ${
          sidebarExpanded ? 'px-2 py-2' : 'flex-col px-1 py-2 justify-center'
        } ${hasActiveChild ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
        title={section.sectionLabel}
      >
        {/* Number badge */}
        <span
          className="shrink-0 flex items-center justify-center rounded-lg font-black text-white"
          style={{
            backgroundColor: section.sectionColor,
            width: sidebarExpanded ? 22 : 28,
            height: sidebarExpanded ? 22 : 28,
            fontSize: sidebarExpanded ? 10 : 12,
          }}
        >
          {section.sectionNumber}
        </span>

        {sidebarExpanded && (
          <>
            <span
              className="flex-1 text-left text-[11px] font-black uppercase tracking-wider truncate"
              style={{ color: section.sectionColor }}
            >
              {section.sectionLabel}
            </span>
            <ChevronDown
              size={13}
              className="shrink-0 transition-transform duration-200"
              style={{
                color: section.sectionColor,
                transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
          </>
        )}

        {!sidebarExpanded && (
          <span className="text-[8px] font-black uppercase tracking-tight leading-tight text-center" style={{ color: section.sectionColor, maxWidth: 62 }}>
            {section.sectionLabel.split(' ')[0]}
          </span>
        )}
      </button>

      {/* ── Collapsible Items ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`space-y-0.5 ${sidebarExpanded ? 'pl-2' : 'pl-0'}`}>
              {section.items.map((item) => {
                const isActive = activeModule === item.id;
                const Icon = item.icon;

                return (
                  <div key={item.id} className="relative w-full px-0.5">
                    <motion.button
                      onClick={() => onSelectModule(item.id)}
                      whileHover={{ scale: sidebarExpanded ? 1.01 : 1.04, x: sidebarExpanded ? 2 : 0 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      className={`relative transition-all duration-150 cursor-pointer ${
                        sidebarExpanded
                          ? 'w-full py-2 px-2.5 rounded-xl flex flex-row items-center gap-2.5 text-left'
                          : 'w-[64px] mx-auto py-1.5 px-1 rounded-xl flex flex-col items-center justify-center text-center'
                      } ${
                        isActive
                          ? 'shadow-xs border'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: `${section.sectionColor}18`,
                              borderColor: `${section.sectionColor}50`,
                              color: section.sectionColor,
                            }
                          : {}
                      }
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeAdminIndicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                          style={{ backgroundColor: section.sectionColor }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}

                      <div className={`flex items-center justify-center shrink-0 ${sidebarExpanded ? 'w-5 h-5' : 'w-7 h-7 mb-0.5'}`}>
                        <Icon size={sidebarExpanded ? 17 : 24} />
                      </div>

                      <span className={`leading-tight block ${
                        sidebarExpanded
                          ? 'text-[12px] font-bold flex-1 truncate'
                          : 'text-[8.5px] font-bold tracking-tight text-center truncate max-w-[58px]'
                      } ${isActive ? 'font-black' : ''}`}>
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className={`font-black uppercase text-white text-[9px] px-1.5 rounded-full ${
                          sidebarExpanded ? 'ml-auto' : 'absolute top-0 right-1'
                        } ${item.badge === 'LIVE' ? 'animate-pulse bg-[#EF4444]' : 'bg-[#EF4444]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  onToggleExpand,
}: ERPSidebarProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const handleToggleExpand = onToggleExpand || (() => setInternalExpanded((prev) => !prev));

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
          <div className="w-full flex items-center justify-between px-1">
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
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#FFE59A', color: '#650000' }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleExpand}
              className="p-1.5 rounded-xl text-stone-700 bg-stone-100 hover:bg-[#FFE59A] transition apple-button shrink-0 border border-stone-200 shadow-2xs"
              title="Collapse Sidebar"
            >
              <Menu size={18} className="stroke-[2.5]" />
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#FFE59A', color: '#650000' }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleExpand}
              className="w-10 h-9 rounded-xl flex items-center justify-center text-stone-700 bg-stone-50 hover:bg-[#FFE59A] hover:text-[#650000] border border-stone-200 transition apple-button shadow-2xs"
              title="Expand Sidebar"
            >
              <Menu size={19} className="stroke-[2.5]" />
            </motion.button>
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
              isActive={activeModule === 'dashboard'}
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
                isExpanded={isExpanded}
                onSelectModule={onSelectModule}
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
