import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
    <div className="relative h-[174px] w-full">
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
          borderColor: isExpanded ? '#E5BD55' : '#EEF0F4',
          boxShadow: isExpanded
            ? '0 16px 30px -8px rgba(101, 0, 0, 0.14), 0 4px 18px rgba(229, 189, 85, 0.14)'
            : '0 2px 6px rgba(31, 41, 55, 0.025)',
          y: isExpanded ? -1 : 0,
        }}
        transition={{
          borderColor: { duration: 0.2 },
          boxShadow: { duration: 0.2 },
          y: { duration: 0.18, ease: 'easeOut' },
        }}
        className="group relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[26px] border bg-white p-4 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A60000]"
        style={{ borderWidth: '1px' }}
      >
        <motion.div
          animate={{
            y: isExpanded ? [0, -2, 0] : 0,
            scale: isExpanded ? [1, 1.02, 1] : 1,
          }}
          transition={{
            y: { duration: 0.5, repeat: isExpanded ? Infinity : 0, repeatDelay: 0.26, ease: 'easeOut' },
            scale: { duration: 0.5, repeat: isExpanded ? Infinity : 0, repeatDelay: 0.26, ease: 'easeOut' },
          }}
          className="mb-5 flex h-[68px] w-[68px] items-center justify-center"
        >
          <img
            src={card.iconSrc}
            alt=""
            className="h-full w-full object-contain transition-[filter] duration-300"
            style={{
              filter: isExpanded
                ? 'drop-shadow(0 0 11px rgba(229, 189, 85, 0.7))'
                : undefined,
            }}
          />
        </motion.div>

        <motion.h3
          animate={{
            y: isExpanded ? -8 : 0,
          }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`text-[15px] font-bold tracking-tight transition-colors ${
            isExpanded ? 'text-[#A60000]' : 'text-[#3D405B]'
          }`}
        >
          {card.title}
        </motion.h3>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute inset-x-0 bottom-0 flex h-8 items-center justify-center gap-2 bg-[#A60000] text-xs font-bold text-white"
            >
              <span>Open</span>
              <motion.span animate={{ x: 2 }} transition={{ duration: 0.18 }}>
                <ArrowRight size={16} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
