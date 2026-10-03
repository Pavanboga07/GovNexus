import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Layers, MapPin, MessageCircleQuestion, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import IndiaMap, { LAYERS, type MapLayer } from '../components/maps/IndiaMap';
import { Card, MetricRow, SeverityBadge } from '../components/ui';
import { districts, highCoverageLowEfficiency } from '../data/districts';
import { insights } from '../data/intelligence';
import { schemes } from '../data/schemes';
import type { District } from '../types';

const metrics = [
  { label: 'Active Schemes', value: '12', sub: 'across 8 ministries', delta: '+2 this quarter' },
  { label: 'Districts Covered', value: '36', sub: 'across 5 states', delta: '100% reporting' },
  { label: 'Beneficiaries', value: '1.2M', sub: 'tracked households', delta: '+11.4% YoY' },
  { label: 'Funds Tracked', value: '₹842 Cr', sub: 'FY 2025–26 released', delta: '68% utilized' },
];

const examples = [
  { label: 'Find implementation gaps', query: 'Find regions where scheme coverage is high but implementation efficiency is low' },
  { label: 'Compare programme performance', query: 'Compare PM-KISAN and MGNREGA' },
  { label: 'Find low fund utilization', query: 'Show regions with low fund utilization' },
  { label: 'Show scheme overlaps', query: 'Show overlapping schemes in Maharashtra' },
];

export default function CommandCenter() {
  const [layer, setLayer] = useState<MapLayer>('efficiency');
  const [selected, setSelected] = useState<District | null>(districts.find((d) => d.id === 'solapur') ?? null);
  const [perfScheme, setPerfScheme] = useState('pm-kisan');
  const [askInput, setAskInput] = useState('');
  const nav = useNavigate();

  const scheme = schemes.find((s) => s.id === perfScheme)!;
  const chartData = scheme.trend;

  const ask = (q: string) => {
    const query = q.trim() || examples[0].query;
    window.dispatchEvent(new CustomEvent('govnexus:open-copilot', { detail: { query } }));
  };

  useEffect(() => {
    const onTourAsk = (e: Event) => {
      const q = (e as CustomEvent).detail?.query ?? examples[0].query;
      setAskInput(q);
      setTimeout(() => ask(q), 900);
    };
    const onTourSelect = (e: Event) => {
      const id = (e as CustomEvent).detail?.district ?? 'solapur';
      setSelected(districts.find((d) => d.id === id) ?? null);
    };
    window.addEventListener('govnexus:tour-ask', onTourAsk);
    window.addEventListener('govnexus:tour-select', onTourSelect);
    return () => {
      window.removeEventListener('govnexus:tour-ask', onTourAsk);
      window.removeEventListener('govnexus:tour-select', onTourSelect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[11px] font-semibold tracking-[0.22em] text-[#4f8cff]">GOVNEXUS · HOME</div>
        <h1 className="mt-1 text-[30px] font-semibold tracking-tight">Understand programme performance</h1>
        <p className="mt-1 text-[13.5px] text-[#8b94a3]">Ask a question, see the relevant regions, and trace every finding back to evidence. <span className="text-[#5b6474]">Demonstration using representative data.</span></p>
      </motion.div>

      {/* ASK FIRST */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card data-tour="ask" className="mt-5 border-[#4f8cff]/25 p-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#4f8cff]/12 text-[#7aa5ff]"><MessageCircleQuestion size={19} /></div>
            <div>
              <div className="text-[17px] font-bold">What would you like to understand?</div>
              <div className="text-[12.5px] text-[#8b94a3]">Ask in plain language — GOVNEXUS finds the regions and shows the evidence.</div>
            </div>
            <button onClick={() => window.dispatchEvent(new Event('govnexus:start-tour'))} className="ml-auto hidden items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-[12px] font-semibold text-[#8b94a3] hover:border-[#4f8cff]/40 hover:text-white sm:flex">
              <Sparkles size={14} /> Show me how it works
            </button>
          </div>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); ask(askInput); }}>
            <input
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="e.g. Find regions where coverage is high but implementation is low"
              className="h-12 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 text-[14px] outline-none placeholder:text-[#5b6474] focus:border-[#4f8cff]/50"
            />
            <button type="submit" className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] px-6 text-[14px] font-bold text-white hover:bg-[#3b76e6]">
              <Send size={15} /> Ask GOVNEXUS
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button key={ex.label} onClick={() => ask(ex.query)} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[12px] text-[#c6ccd6] hover:border-[#4f8cff]/40 hover:text-white">
                {ex.label}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8b94a3]">{m.label}</div>
              <div className="tick mt-1 text-[30px] font-bold tracking-tight">{m.value}</div>
              <div className="mt-1 flex items-center justify-between text-[11.5px]">
                <span className="text-[#5b6474]">{m.sub}</span>
                <span className="flex items-center gap-1 text-emerald-300"><ArrowUpRight size={12} />{m.delta}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* map + side panel */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card data-tour="map" className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-[13px] font-semibold"><Layers size={15} className="text-[#7aa5ff]" /> Regions — where should I look?</div>
            <div className="flex flex-wrap gap-1.5">
              {LAYERS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayer(l.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${layer === l.id ? 'bg-[#4f8cff] text-white' : 'bg-white/5 text-[#8b94a3] hover:text-white'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <IndiaMap
            districts={districts}
            layer={layer}
            selectedId={selected?.id}
            highlightIds={highCoverageLowEfficiency.map((d) => d.id)}
            onSelect={setSelected}
            height={480}
          />
          <div className="flex items-center gap-2 px-1 pt-3 text-[11.5px] text-[#5b6474]">
            <MapPin size={13} /> Click any district dot for a live brief — Solapur is pre-selected for the demo path.
          </div>
        </Card>

        {/* side panel */}
        <motion.div layout>
          {selected ? (
            <Card data-tour="district" className="flex h-full flex-col border-[#4f8cff]/20">
              <div className="flex items-center justify-between">
                <SeverityBadge severity={selected.status} />
                <span className="font-mono text-[10.5px] text-[#5b6474]">Needs attention: {selected.anomalyScore >= 0.7 ? 'High' : selected.anomalyScore >= 0.4 ? 'Medium' : 'Low'}</span>
              </div>
              <h3 className="mt-2 text-[22px] font-bold">{selected.name}</h3>
              <div className="text-[12px] text-[#8b94a3]">{selected.state} · {selected.schemesActive} programmes active</div>
              <div className="mt-4 space-y-3.5">
                <MetricRow label="Coverage" value={`${selected.coverage}%`} pct={selected.coverage} tone={selected.coverage > 70 ? 'green' : 'amber'} />
                <MetricRow label="Utilization" value={`${selected.utilization}%`} pct={selected.utilization} tone={selected.utilization < 55 ? 'red' : 'blue'} />
                <MetricRow label="Completion" value={`${selected.completion}%`} pct={selected.completion} tone={selected.completion < 55 ? 'red' : 'green'} />
              </div>
              <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <div className="text-[11px] font-bold tracking-[0.12em] text-[#8b94a3]">WHY THIS NEEDS ATTENTION</div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#c6ccd6]">
                  Implementation is {Math.abs(selected.benchmark - selected.utilization)} percentage points {selected.utilization <= selected.benchmark ? 'below' : 'above'} the benchmark.
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                  <div className="rounded-lg bg-black/30 p-2"><div className="tick text-[14px] font-bold text-white">{selected.utilization}%</div><div className="text-[#8b94a3]">Actual</div></div>
                  <div className="rounded-lg bg-black/30 p-2"><div className="tick text-[14px] font-bold text-white">{selected.benchmark}%</div><div className="text-[#8b94a3]">Benchmark</div></div>
                  <div className="rounded-lg bg-black/30 p-2"><div className={`tick text-[14px] font-bold ${selected.utilization <= selected.benchmark ? 'text-red-300' : 'text-emerald-300'}`}>{selected.utilization - selected.benchmark}pp</div><div className="text-[#8b94a3]">Difference</div></div>
                </div>
              </div>
              <div className="mt-auto space-y-2 pt-4">
                <button onClick={() => nav(`/geography?district=${selected.id}`)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] py-2.5 text-[13px] font-semibold hover:bg-[#3b76e6]">
                  Investigate <ArrowRight size={15} />
                </button>
                <button data-tour="why" onClick={() => nav(`/evidence?focus=ev-${selected.id}`)} className="w-full rounded-xl border border-white/10 py-2.5 text-[13px] font-semibold text-[#c6ccd6] hover:border-[#4f8cff]/40 hover:text-white">
                  Why is this flagged?
                </button>
              </div>
            </Card>
          ) : (
            <Card className="grid h-full place-items-center text-[13px] text-[#5b6474]">Select a district on the map</Card>
          )}
        </motion.div>
      </div>

      {/* lower section */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {/* priority intelligence */}
        <Card>
          <div className="mb-3 text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">INSIGHTS — WHAT NEEDS ATTENTION?</div>
          <div className="space-y-3">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
              <SeverityBadge severity="high" />
              <div className="mt-1.5 font-semibold">Solapur <span className="font-normal text-[#8b94a3]">· Implementation gap detected</span></div>
              <div className="mt-1 font-mono text-[11px] text-[#8b94a3]">Coverage 82% · Utilization 43% · Completion 48%</div>
              <button onClick={() => nav('/geography?district=solapur')} className="mt-2.5 w-full rounded-lg bg-red-500/15 py-2 text-[12px] font-bold text-red-200 hover:bg-red-500/25">INVESTIGATE</button>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
              <SeverityBadge severity="medium" />
              <div className="mt-1.5 font-semibold">Nashik <span className="font-normal text-[#8b94a3]">· Geographic coverage gap</span></div>
              <div className="mt-1 font-mono text-[11px] text-[#8b94a3]">Coverage 48% · 312 habitations pending</div>
              <button onClick={() => nav('/geography?district=nashik')} className="mt-2.5 w-full rounded-lg bg-amber-500/15 py-2 text-[12px] font-bold text-amber-200 hover:bg-amber-500/25">VIEW REGION</button>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
              <SeverityBadge severity="info" />
              <div className="mt-1.5 font-semibold">Cross-scheme overlap <span className="font-normal text-[#8b94a3]">· PM-KISAN × MGNREGA</span></div>
              <div className="mt-1 font-mono text-[11px] text-[#8b94a3]">14 districts · overlap &gt; 60%</div>
              <button onClick={() => nav('/relationships?focus=pm-kisan')} className="mt-2.5 w-full rounded-lg bg-blue-500/15 py-2 text-[12px] font-bold text-blue-200 hover:bg-blue-500/25">EXPLORE</button>
            </div>
          </div>
        </Card>

        {/* programme performance */}
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">PROGRAMMES — HOW ARE THEY PERFORMING?</div>
            <select value={perfScheme} onChange={(e) => setPerfScheme(e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[11px] outline-none">
              {schemes.slice(0, 6).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="mb-2 text-[12px] text-[#5b6474]">{scheme.fullName} · monthly trend, Apr–Sep (demonstration data)</div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#5b6474', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5b6474', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#11161e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="Coverage" fill="#4f8cff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Utilization" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completion" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 text-[11px] text-[#8b94a3]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-[#4f8cff]" /> Coverage</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-amber-400" /> Utilization</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-emerald-400" /> Completion</span>
          </div>
        </Card>

        {/* recent intelligence */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">LATEST INSIGHTS</div>
            <button onClick={() => nav('/intelligence')} className="text-[11.5px] font-semibold text-[#7aa5ff] hover:underline">View all</button>
          </div>
          <div className="relative space-y-0">
            {insights.slice(0, 5).map((ins) => (
              <button key={ins.id} onClick={() => nav(`/intelligence?focus=${ins.id}`)} className="group relative flex w-full gap-3 border-l border-white/10 py-3 pl-4 text-left last:pb-0 hover:border-[#4f8cff]/50">
                <span className={`absolute -left-[5px] top-4 h-2.5 w-2.5 rounded-full ${ins.severity === 'high' || ins.severity === 'critical' ? 'bg-red-400' : ins.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                <span>
                  <span className="block text-[12.5px] font-semibold group-hover:text-white">{ins.title} <span className="font-normal text-[#5b6474]">· {ins.region}</span></span>
                  <span className="mt-0.5 block text-[11.5px] text-[#8b94a3]">{ins.summary.slice(0, 72)}…</span>
                  <span className="mt-0.5 block font-mono text-[10.5px] text-[#5b6474]">{ins.time} · {ins.scheme}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
