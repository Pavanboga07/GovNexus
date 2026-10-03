import { AnimatePresence, motion } from 'framer-motion';
import { FileCheck2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IndiaMap, { LAYERS, type MapLayer } from '../components/maps/IndiaMap';
import { Card, MetricRow, PageHeader, SeverityBadge } from '../components/ui';
import { districts } from '../data/districts';
import type { District } from '../types';

export default function Geography() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [layer, setLayer] = useState<MapLayer>('efficiency');
  const [schemeF, setSchemeF] = useState('All Schemes');
  const [stateF, setStateF] = useState('All States');
  const [selectedId, setSelectedId] = useState<string | null>(params.get('district') ?? 'solapur');

  const filtered = useMemo(() => districts.filter((d) => stateF === 'All States' || d.state === stateF), [stateF]);
  const highlight = useMemo(() => {
    if (params.get('highlight') === 'inefficiency') return districts.filter((d) => d.coverage >= 76 && d.efficiency <= 55).map((d) => d.id);
    return [];
  }, [params]);

  const selected: District | null = districts.find((d) => d.id === selectedId) ?? null;
  const states = ['All States', ...Array.from(new Set(districts.map((d) => d.state)))];

  return (
    <div>
      <PageHeader
        kicker="REGIONS · 36 DISTRICTS"
        title="REGIONAL PERFORMANCE"
        sub="Where should I look? Select a district to understand what is happening there."
      />

      <div className="mb-3 flex flex-wrap gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px]">
          <span className="text-[#5b6474]">Layer:</span>
          <select value={layer} onChange={(e) => setLayer(e.target.value as MapLayer)} className="bg-transparent font-medium outline-none [&>option]:bg-[#11161e]">
            {LAYERS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px]">
          <span className="text-[#5b6474]">Scheme:</span>
          <select value={schemeF} onChange={(e) => setSchemeF(e.target.value)} className="bg-transparent font-medium outline-none [&>option]:bg-[#11161e]">
            {['All Schemes', 'PM-KISAN', 'MGNREGA', 'Jal Jeevan Mission', 'PMAY-G'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px]">
          <span className="text-[#5b6474]">State:</span>
          <select value={stateF} onChange={(e) => setStateF(e.target.value)} className="bg-transparent font-medium outline-none [&>option]:bg-[#11161e]">
            {states.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="ml-auto self-center font-mono text-[11px] text-[#5b6474]">{filtered.length} DISTRICTS · {schemeF.toUpperCase()}</div>
      </div>

      <div className="relative">
        <Card className="p-4">
          <IndiaMap districts={filtered} layer={layer} selectedId={selectedId} highlightIds={highlight} onSelect={(d) => setSelectedId(d.id)} height={560} />
        </Card>

        <AnimatePresence>
          {selected && (
            <motion.aside
              initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              data-tour="district"
              className="absolute right-4 top-4 bottom-4 flex w-[320px] flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0e14]/95 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <SeverityBadge severity={selected.status} />
                <button onClick={() => setSelectedId(null)} className="rounded-lg p-1 text-[#8b94a3] hover:bg-white/5 hover:text-white"><X size={16} /></button>
              </div>
              <h2 className="mt-2 text-[24px] font-bold uppercase tracking-tight">{selected.name}</h2>
              <div className="text-[12px] text-[#8b94a3]">{selected.state} · {selected.status === 'healthy' ? 'On track' : 'Needs attention'}</div>
              <div className="mt-4 space-y-3.5">
                <MetricRow label="Coverage" value={`${selected.coverage}%`} pct={selected.coverage} tone="blue" />
                <MetricRow label="Utilization" value={`${selected.utilization}%`} pct={selected.utilization} tone={selected.utilization < 55 ? 'red' : 'blue'} />
                <MetricRow label="Completion" value={`${selected.completion}%`} pct={selected.completion} tone={selected.completion < 55 ? 'red' : 'green'} />
                <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                  <div className="rounded-lg bg-black/30 p-2.5"><div className="tick text-[16px] font-bold text-white">{selected.anomalyScore >= 0.7 ? 'High' : selected.anomalyScore >= 0.4 ? 'Medium' : 'Low'}</div><div className="text-[10px] text-[#8b94a3]">Needs attention</div></div>
                  <div className="rounded-lg bg-black/30 p-2.5"><div className="tick text-[16px] font-bold">{selected.benchmark}%</div><div className="text-[10px] text-[#8b94a3]">Regional benchmark</div></div>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1.5 text-[12px] font-semibold">Why this needs attention</div>
                <p className="text-[12px] leading-relaxed text-[#8b94a3]">
                  Implementation is {Math.abs(selected.benchmark - selected.utilization)} percentage points {selected.utilization <= selected.benchmark ? 'below' : 'above'} the benchmark.
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                  <div className="rounded-lg bg-black/30 p-2"><div className="tick text-[13px] font-bold text-white">{selected.utilization}%</div><div className="text-[#8b94a3]">Actual</div></div>
                  <div className="rounded-lg bg-black/30 p-2"><div className="tick text-[13px] font-bold text-white">{selected.benchmark}%</div><div className="text-[#8b94a3]">Benchmark</div></div>
                  <div className="rounded-lg bg-black/30 p-2"><div className={`tick text-[13px] font-bold ${selected.utilization <= selected.benchmark ? 'text-red-300' : 'text-emerald-300'}`}>{selected.utilization - selected.benchmark}pp</div><div className="text-[#8b94a3]">Difference</div></div>
                </div>
              </div>
              <div className="mt-auto space-y-2 pt-4">
                <button data-tour="why" onClick={() => nav(`/evidence?focus=ev-${selected.id}`)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] py-2.5 text-[13px] font-semibold hover:bg-[#3b76e6]">
                  <FileCheck2 size={15} /> View Evidence
                </button>
                <button onClick={() => nav('/relationships?focus=pm-kisan')} className="w-full rounded-xl border border-white/10 py-2.5 text-[13px] font-semibold hover:border-[#4f8cff]/40">
                  Related programmes
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
