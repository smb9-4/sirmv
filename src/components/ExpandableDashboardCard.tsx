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
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
  count: string;
  badgeBg: string;
  badgeColor: string;
  previews: CardPreviewItem[];
  actionLabel: string;
  onAction: () => void;
}

interface ExpandableDashboardCardProps {
  card: DashboardCardConfig;
  isExpanded: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggleTap: () => void;
}

export default function ExpandableDashboardCard({
  card,
  isExpanded,
  onHoverStart,
  onHoverEnd,
  onToggleTap,
}: ExpandableDashboardCardProps) {
  const Icon = card.icon;

  return (
    // Outer slot maintains exact grid cell footprint so sibling cards and lower rows NEVER move or stretch!
    <div className="relative min-h-[185px] w-full">
      <motion.div
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onClick={onToggleTap}
        animate={{
          scale: isExpanded ? 1.02 : 1,
          y: isExpanded ? -4 : 0,
          borderColor: isExpanded ? '#E5BD55' : 'rgba(229, 231, 235, 0.9)',
          boxShadow: isExpanded
            ? '0 25px 45px -10px rgba(101, 0, 0, 0.2), 0 10px 25px -5px rgba(229, 189, 85, 0.28)'
            : '0 2px 10px -2px rgba(0, 0, 0, 0.05)',
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 26,
          mass: 0.7,
        }}
        className={`bg-white rounded-3xl p-5 md:p-6 border cursor-pointer select-none overflow-hidden flex flex-col justify-between ${
          isExpanded
            ? 'absolute top-0 left-0 right-0 z-30'
            : 'relative w-full h-full'
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
          <div className="flex items-center justify-between mb-3.5">
            {/* Animated Icon with subtle bounce/rotation ONLY on the hovered card */}
            <motion.div
              animate={
                isExpanded
                  ? {
                      rotate: [0, -5, 5, 0],
                      scale: 1.12,
                      backgroundColor: '#FFE59A',
                      color: '#650000',
                    }
                  : { rotate: 0, scale: 1, backgroundColor: '#FFF0F0', color: '#650000' }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
            >
              <Icon size={22} />
            </motion.div>

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

          <p className="text-xs text-stone-500 mt-1 leading-relaxed font-medium">
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
              className="overflow-hidden mt-3.5 pt-3 border-t border-[#E5BD55]/40 space-y-2.5"
            >
              <div className="space-y-1.5 text-xs">
                {card.previews.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-0.5 text-stone-700"
                  >
                    <span className="text-[11px] text-stone-500">{item.label}:</span>
                    <span
                      className={`font-bold text-[11px] ${
                        item.highlight ? 'text-[#A60000]' : 'text-stone-900'
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button inside Expanded Panel with iOS Physics */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 4px 15px rgba(166, 0, 0, 0.35)',
                  backgroundColor: '#A60000',
                }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.stopPropagation();
                  card.onAction();
                }}
                className="w-full mt-2 py-2 px-3 rounded-full text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                style={{ backgroundColor: '#650000' }}
              >
                <span>{card.actionLabel}</span>
                <ArrowRight size={13} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle indicator bar for non-expanded state */}
        {!isExpanded && (
          <div className="mt-3.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-[#A60000] opacity-80">
            <span>Hover to preview</span>
            <ArrowRight size={13} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
