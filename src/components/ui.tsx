import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { Severity } from '../types';

export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card p-5', className)} {...rest}>{children}</div>;
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const map: Record<Severity, string> = {
    critical: 'bg-red-500/15 text-red-300 border-red-500/30',
    high: 'bg-red-500/10 text-red-300 border-red-500/25',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    info: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
    healthy: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  };
  const label =
    severity === 'healthy' ? 'ON TRACK'
    : severity === 'high' ? 'NEEDS ATTENTION'
    : severity === 'medium' ? 'WATCH'
    : severity === 'critical' ? 'CRITICAL'
    : 'INFO';
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em]', map[severity], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function Progress({ value, tone = 'blue', className }: { value: number; tone?: 'blue' | 'amber' | 'red' | 'green'; className?: string }) {
  const colors = { blue: 'bg-[#4f8cff]', amber: 'bg-amber-400', red: 'bg-red-400', green: 'bg-emerald-400' };
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/8', className)}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} className={cn('h-full rounded-full', colors[tone])} />
    </div>
  );
}

export function MetricRow({ label, value, pct, tone }: { label: string; value: string; pct: number; tone?: 'blue' | 'amber' | 'red' | 'green' }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12px]">
        <span className="text-[#8b94a3]">{label}</span>
        <span className="tick font-semibold text-white">{value}</span>
      </div>
      <Progress value={pct} tone={tone} />
    </div>
  );
}

export function PageHeader({ kicker, title, sub, right }: { kicker: string; title: string; sub: string; right?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-[#4f8cff]">{kicker}</div>
        <h1 className="text-[28px] font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-[#8b94a3]">{sub}</p>
      </div>
      {right}
    </motion.div>
  );
}

export function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <motion.span
      className="tick"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      {value.toLocaleString('en-IN')}
      {suffix}
    </motion.span>
  );
}
