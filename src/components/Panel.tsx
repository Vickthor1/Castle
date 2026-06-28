import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type Props = {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function Panel({ title, subtitle, className = '', children }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className={clsx(
        'ds-card border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] shadow-soft',
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4 flex flex-col gap-1">
          {title && <h2 className="text-lg font-semibold tracking-[0.02em] text-white">{title}</h2>}
          {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.section>
  );
}
