import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string | number;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 35,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -25,
  },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 28,
  mass: 0.8,
  duration: 0.4,
};

export default function PageTransition({ children, pageKey }: PageTransitionProps) {
  return (
    <motion.div
      key={pageKey}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
