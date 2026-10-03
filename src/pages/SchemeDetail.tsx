import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, FileCheck2, Network } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import IndiaMap from '../components/maps/IndiaMap';
import { Card, MetricRow, SeverityBadge } from '../components/ui';
import { districts } from '../data/districts';
import { evidences } from '../data/intelligence';
import { schemeById, schemes } from '../data/schemes';

export default function SchemeDetail() {
  const { id = 'pm-kisan' } = useParams();
  const nav = useNavigate();
  const s = schemeById(id) ?? schemeById('pm-kisan')!;

  // Related programmes derived from the mock dataset: same ministry, then same category.
  const rels = useMemo(() => {
    const sameMinistry = schemes.filter((o) => o.id !== s.id && o.ministry === s.ministry).map((o) => ({ name: o.name, type: `Same ministry · ${o.beneficiaries} served`, id: o.id }));
    const sameCategory = schemes.filter((o) => o.id !== s.id && o.ministry !== s.ministry && o.category === s.category).map((o) => ({ name: o.name, type: `Shared focus · ${o.category}`, id: o.id }));
    const picked = [...sameMinistry, ...sameCategory].slice(0, 4);
    if (picked.length > 0) return picked;
    return [...schemes].sort((a, b) => b.beneficiariesNum - a.beneficiariesNum).filter((o) => o.id !== s.id).slice(0, 3)
      .map((o) => ({ name: o.name, type: `Largest reach · ${o.beneficiaries} served`, id: o.id }));
  }, [s]);

  // Insights derived from the mock dataset: regional low-utilization count + scheme's own trend.
  const insightItems = useMemo(() => {
    const lowUtil = districts.filter((d) => d.utilization < 55).length;
    const first = s.trend[0].coverage;
    const last = s.trend[s.trend.length - 1].coverage;
    const delta = (last - first).toFixed(1);
    return [
      { t: `${lowUtil} districts show low utilization`, icon: '⚠', href: '/evidence?focus=ev-solapur' },
      { t: '14 districts overlap with MGNREGA', icon: '◉', href: '/relationships?focus=pm-kisan' },
      { t: `Coverage ${Number(delta) >= 0 ? 'increased' : 'changed'} ${delta}pp this season`, icon: '↗', href: '/geography' },
    ];
  }, [s]);
  const ev = evidences[0];

  return (
    <div>
      <button onClick={() => nav('/schemes')} className="mb-4 flex items-center gap-1.5 text-[12.5px] text-[#8b94a3] hover:text-white">
        <ArrowLeft size={14} /> Back to schemes
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[30px] font-bold tracking-tight">{s.name}</h1>
          <SeverityBadge severity={s.utilization < 60 ? 'medium' : 'healthy'} />
        </div>
        <div className="text-[14px] text-[#c6ccd6]">{s.fullName}</div>
        <div className="text-[12.5px] text-[#8b94a3]">{s.ministry} · {s.category}</div>
      </motion.div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Card className="!p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7aa5ff]">What is this scheme?</div><p className="mt-1 text-[12.5px] leading-relaxed text-[#c6ccd6]">{s.description}</p></Card>
        <Card className="!p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7aa5ff]">Who does it serve?</div><p className="mt-1 text-[12.5px] leading-relaxed text-[#c6ccd6]">{s.beneficiaries} beneficiaries · {s.category} · active in {s.states.length} states.</p></Card>
        <Card className="!p-4"><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7aa5ff]">How is it performing?</div><p className="mt-1 text-[12.5px] leading-relaxed text-[#c6ccd6]">Coverage {s.coverage}%, utilization {s.utilization}%, completion {s.completion}% — {s.utilization >= 68 ? 'tracking well against peers.' : s.utilization >= 55 ? 'mixed progress, some districts lagging.' : 'needs attention in several districts.'}</p></Card>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { l: 'Allocated', v: `₹${s.allocated.toLocaleString('en-IN')} Cr` },
          { l: 'Utilized', v: `₹${s.utilized.toLocaleString('en-IN')} Cr` },
          { l: 'Beneficiaries', v: s.beneficiaries },
          { l: 'Coverage', v: `${s.coverage}%` },
        ].map((m, i) => (
          <motion.div key={m.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card><div className="text-[11px] uppercase tracking-[0.12em] text-[#8b94a3]">{m.l}</div><div className="tick mt-1 text-[24px] font-bold">{m.v}</div></Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 px-1 text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">GEOGRAPHIC COVERAGE</div>
          <IndiaMap districts={districts} layer="coverage" onSelect={(d) => nav(`/geography?district=${d.id}`)} height={380} />
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="mb-1 text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">PERFORMANCE TREND · APR–SEP</div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.trend} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity={0.4} /><stop offset="100%" stopColor="#4f8cff" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#5b6474', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5b6474', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 95]} />
                  <Tooltip contentStyle={{ background: '#11161e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                  <Area dataKey="coverage" stroke="#4f8cff" fill="url(#g1)" strokeWidth={2.5} />
                  <Area dataKey="utilization" stroke="#fbbf24" fill="none" strokeWidth={2} strokeDasharray="5 4" />
                  <Area dataKey="completion" stroke="#34d399" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-[11px] text-[#8b94a3]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-[#4f8cff]" /> Coverage</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-amber-400" /> Utilization</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-emerald-400" /> Completion</span>
            </div>
          </Card>
          <Card>
            <div className="mb-3 text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">FUND UTILIZATION & IMPLEMENTATION</div>
            <div className="space-y-3">
              <MetricRow label={`Utilized ₹${s.utilized.toLocaleString('en-IN')} Cr of ₹${s.allocated.toLocaleString('en-IN')} Cr`} value={`${s.utilization}%`} pct={s.utilization} tone="amber" />
              <MetricRow label="Coverage" value={`${s.coverage}%`} pct={s.coverage} tone="blue" />
              <MetricRow label="Completion" value={`${s.completion}%`} pct={s.completion} tone="green" />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]"><Network size={14} className="text-[#7aa5ff]" /> RELATED PROGRAMMES</div>
          <p className="mb-3 text-[12px] text-[#8b94a3]">Programmes operating in related areas — representative links from the demo dataset.</p>
          <div className="flex flex-col items-center">
            <div className="rounded-xl border border-[#4f8cff]/30 bg-[#4f8cff]/10 px-5 py-2.5 text-[13px] font-bold">{s.name}</div>
            <div className="h-5 w-px bg-white/15" />
            <div className="grid w-full gap-2 sm:grid-cols-2">
              {rels.map((r) => (
                <button key={r.name} onClick={() => nav(`/relationships?focus=${r.id}`)} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left hover:border-[#4f8cff]/40">
                  <div className="text-[13px] font-semibold">+ {r.name}</div>
                  <div className="text-[11px] text-[#8b94a3]">{r.type}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
        <Card className="border-amber-500/20">
          <div className="mb-3 text-[12px] font-semibold tracking-[0.15em] text-amber-300">WHAT THE DATA SHOWS — CLICK TO TRACE</div>
          <div className="space-y-2">
            {insightItems.map((k) => (
              <button key={k.t} onClick={() => nav(k.href)} className="group flex w-full items-center justify-between rounded-xl bg-white/[0.03] p-3 text-left text-[13px] hover:bg-white/[0.06]">
                <span><span className="mr-2 text-amber-300">{k.icon}</span>{k.t}</span>
                <ArrowUpRight size={14} className="text-[#5b6474] group-hover:text-white" />
              </button>
            ))}
            <div className="rounded-xl bg-black/30 p-3 font-mono text-[11px] text-[#8b94a3]">
              Deviation −28pp · Benchmark 71% · Confidence {ev.confidence}% · {ev.records} districts
            </div>
            <button onClick={() => nav('/evidence?focus=ev-solapur')} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] py-2.5 text-[13px] font-semibold hover:bg-[#3b76e6]">
              <FileCheck2 size={15} /> OPEN EVIDENCE TRAIL
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
