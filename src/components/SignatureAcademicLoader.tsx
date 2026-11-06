import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SignatureAcademicLoaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function SignatureAcademicLoader({
  onComplete,
  minDuration = 1400,
}: SignatureAcademicLoaderProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, minDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [minDuration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl select-none"
    >
      {/* Just the animated wave bar loader in center with institutional colors (Red, Gold, White, Dark Yellow, Maroon) */}
      <div
        className="loading"
        style={
          {
            '--speed-of-animation': '0.9s',
            '--gap': '6px',
            '--first-color': '#A60000', // Red
            '--second-color': '#E5BD55', // Gold
            '--third-color': '#FFFFFF', // White
            '--fourth-color': '#F59E0B', // Dark Yellow
            '--fifth-color': '#650000', // Maroon
          } as React.CSSProperties
        }
      >
        <span style={{ background: '#A60000', boxShadow: '0 0 10px rgba(166,0,0,0.5)' }} />
        <span style={{ background: '#E5BD55', boxShadow: '0 0 10px rgba(229,189,85,0.5)' }} />
        <span style={{ background: '#FFFFFF', boxShadow: '0 0 12px rgba(255,255,255,0.9)' }} />
        <span style={{ background: '#F59E0B', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }} />
        <span style={{ background: '#650000', boxShadow: '0 0 10px rgba(101,0,0,0.5)' }} />
      </div>
    </motion.div>
  );
}
