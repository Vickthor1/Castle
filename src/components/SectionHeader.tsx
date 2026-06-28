import React from 'react';
import clsx from 'clsx';

export default function SectionHeader({
  title,
  subtitle,
  actions,
  className = '',
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-500/80">Castle</p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            {title}
          </h1>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {subtitle && <p className="max-w-3xl text-sm leading-6 text-white/65">{subtitle}</p>}
    </div>
  );
}
