import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

export interface CardPreviewItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface DashboardCardConfig {
  id: string;
  title: string;
  iconSrc: string;
  desc: string;
  count: string;
  badgeBg: string;
  badgeColor: string;
  previews: CardPreviewItem[];
  onAction: () => void;
}

interface ExpandableDashboardCardProps {
  card: DashboardCardConfig;
  isExpanded: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export default function ExpandableDashboardCard({
  card,
  isExpanded,
  onHoverStart,
  onHoverEnd,
}: ExpandableDashboardCardProps) {
  return (
    // Outer slot maintains exact grid cell footprint so sibling cards and lower rows NEVER move or stretch!
    <div className="relative h-[218px] w-full">
      <motion.button
        type="button"
        aria-label={`Open ${card.title} module`}
        data-dashboard-card="student"
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        onClick={() => {
          onHoverEnd();
          card.onAction();
        }}
        animate={{
          borderColor: isExpanded ? '#E5BD55' : 'rgba(229, 231, 235, 0.9)',
          boxShadow: isExpanded
            ? '0 25px 45px -10px rgba(101, 0, 0, 0.2), 0 10px 25px -5px rgba(229, 189, 85, 0.28)'
            : '0 2px 10px -2px rgba(0, 0, 0, 0.05)',
        }}
        transition={{
          borderColor: { duration: 0.2 },
          boxShadow: { duration: 0.2 },
        }}
        className={`group appearance-none bg-white rounded-3xl border cursor-pointer select-none overflow-hidden flex h-full w-full flex-col justify-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A60000] ${
          isExpanded
            ? 'absolute inset-0 z-30 px-4 pt-3 pb-10'
            : 'relative p-5 md:p-6'
        }`}
        style={{
          borderWidth: isExpanded ? '2px' : '1px',
        }}
      >
        {/* Top Accent line */}
        <motion.div
          animate={{
            backgroundColor: isExpanded ? '#A60000' : '#650000',
            height: isExpanded ? 5 : 3,
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-0 right-0"
        />

        {/* Main Visible Card Face */}
        <div>
          <div className={`flex items-center justify-between ${isExpanded ? 'mb-0' : 'mb-3.5'}`}>
            {/* Animated Icon with subtle bounce/rotation ONLY on the hovered card */}
            <div className={`flex items-center justify-center ${isExpanded ? 'h-12 w-12' : 'h-16 w-16'}`}>
              <img
                src={card.iconSrc}
                alt=""
                className={`h-full w-full object-contain transition-[filter] ${
                  isExpanded ? 'drop-shadow-[0_0_8px_#E6C28F]' : ''
                } group-focus-visible:drop-shadow-[0_0_8px_#E6C28F]`}
              />
            </div>

            <span
              className="text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-black/5"
              style={{ backgroundColor: card.badgeBg, color: card.badgeColor }}
            >
              {card.count}
            </span>
          </div>

          <h3 className="font-black text-base md:text-[17px] text-stone-950 uppercase tracking-tight flex items-center justify-between">
            <span>{card.title}</span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-stone-300 md:hidden"
            >
              <ChevronDown size={14} />
            </motion.span>
          </h3>

          <p className={`text-xs text-stone-500 ${isExpanded ? 'mt-0.5 leading-4 line-clamp-1' : 'mt-1 leading-relaxed'} font-medium`}>
            {card.desc}
          </p>
        </div>

        {/* Smoothly Expanding Information Panel Below - Only in the hovered card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 28,
                opacity: { duration: 0.18 },
              }}
              className="mt-3 overflow-hidden pt-1 border-t border-[#E5BD55]/40 space-y-0.5"
            >
              <div className="space-y-4">
                {card.previews.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 text-stone-700"
                  >
                    <span className="truncate text-[11px] leading-4 text-stone-500">{item.label}:</span>
                    <span
                      className={`max-w-[65%] truncate text-[11px] leading-4 font-bold ${
                        item.highlight ? 'text-[#A60000]' : 'text-stone-900'
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center gap-2 bg-[#A60000] text-xs font-black text-white"
            >
              <span>Open</span>
              <ArrowRight size={15} className={`transition-transform ${isExpanded ? 'translate-x-1' : ''}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
