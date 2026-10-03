import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, PageHeader, SeverityBadge } from '../components/ui';
import { insights } from '../data/intelligence';
import { cn } from '../lib/cn';
import type { Severity } from '../types';

const cats: ('all' | Severity)[] = ['all', 'critical', 'high', 'medium', 'info'];

export default function Intelligence() {
  const [params] = useSearchParams();
  const [cat, setCat] = useState<'all' | Severity>('all');
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState<string | null>(params.get('focus'));
  const nav = useNavigate();

  const list = useMemo(() => insights.filter((i) => (cat === 'all' || i.severity === cat) && (!q || (i.title + i.region + i.scheme).toLowerCase().includes(q.toLowerCase()))), [cat, q]);
  const focused = insights.find((i) => i.id === focus);

  return (
    <div>
      <PageHeader
        kicker="KEY INSIGHTS · 8 THIS WEEK"
        title="KEY INSIGHTS"
        sub="Coverage gaps, utilization shortfalls and programme overlaps — each with a path to the underlying evidence."
        right={
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <Search size={15} className="text-[#5b6474]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter alerts…" className="w-44 bg-transparent text-[13px] outline-none placeholder:text-[#5b6474]" />
          </div>
        }
      />

      <div className="mb-4 flex gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn('rounded-lg px-3.5 py-2 text-[12px] font-semibold capitalize', cat === c ? 'bg-[#4f8cff] text-white' : 'bg-white/5 text-[#8b94a3] hover:text-white')}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-[11px] text-[#5b6474]">{list.length} ALERTS</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((ins, i) => (
          <motion.div key={ins.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4) }}>
            <Card className="card-hover">
              <div className="flex items-center justify-between">
                <SeverityBadge severity={ins.severity} />
                <span className="font-mono text-[10.5px] text-[#5b6474]">{ins.time}</span>
              </div>
              <div className="mt-2 text-[15px] font-bold">{ins.title}</div>
              <div className="text-[12px] text-[#8b94a3]">{ins.region} · {ins.scheme}</div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#c6ccd6]">{ins.summary}</p>
              <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px]">
                <span className="rounded bg-white/5 px-2 py-1 text-white">{ins.metric}</span>
                {ins.secondaryMetric && <span className="rounded bg-white/5 px-2 py-1 text-[#8b94a3]">{ins.secondaryMetric}</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setFocus(ins.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] py-2.5 text-[12.5px] font-bold hover:bg-[#3b76e6]">
                  {ins.severity === 'medium' ? 'VIEW REGION' : 'EXPLORE'} <ArrowRight size={14} />
                </button>
                {ins.evidenceId && (
                  <button onClick={() => nav(`/evidence?focus=${ins.evidenceId}`)} className="rounded-xl border border-white/10 px-4 py-2.5 text-[12.5px] font-semibold hover:border-[#4f8cff]/40">Evidence</button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {focused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setFocus(null)}>
            <motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()} className="card w-full max-w-[560px] p-6">
              <div className="flex items-start justify-between">
                <SeverityBadge severity={focused.severity} />
                <button onClick={() => setFocus(null)} className="rounded-lg p-1 text-[#8b94a3] hover:bg-white/5 hover:text-white"><X size={17} /></button>
              </div>
              <h3 className="mt-2 text-[20px] font-bold">{focused.title}</h3>
              <div className="text-[13px] text-[#8b94a3]">{focused.region} · {focused.scheme} · {focused.time}</div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#c6ccd6]">{focused.detail}</p>
              <div className="mt-3 rounded-xl bg-black/30 p-3 font-mono text-[11.5px] text-[#8b94a3]">{focused.summary}</div>
              <div className="mt-4 flex gap-2">
                {focused.districtId && <button onClick={() => nav(`/geography?district=${focused.districtId}`)} className="flex-1 rounded-xl bg-[#4f8cff] py-2.5 text-[13px] font-bold hover:bg-[#3b76e6]">OPEN ON MAP</button>}
                {focused.evidenceId && <button onClick={() => nav(`/evidence?focus=${focused.evidenceId}`)} className="flex-1 rounded-xl border border-white/15 py-2.5 text-[13px] font-bold hover:border-[#4f8cff]/50">VIEW EVIDENCE</button>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
