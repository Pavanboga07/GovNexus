import { motion } from 'framer-motion';
import { ArrowDown, Calculator, Database, Eye, FileCheck2, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, PageHeader } from '../components/ui';
import { evidences } from '../data/intelligence';
import { cn } from '../lib/cn';

export default function Evidence() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const focusId = params.get('focus') ?? 'ev-solapur';
  const [showSource, setShowSource] = useState(true);
  const [showCalc, setShowCalc] = useState(false);
  const ev = evidences.find((e) => e.id === focusId);

  if (!ev) {
    return (
      <div>
        <PageHeader
          kicker="EVIDENCE · TRACEABLE INSIGHTS"
          title="EVIDENCE & TRACEABILITY"
          sub="Every insight traces back to its source data and analysis."
        />
        <Card className="mx-auto max-w-[560px] p-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#4f8cff]/12 text-[#7aa5ff]"><Database size={22} /></div>
          <h2 className="text-[20px] font-bold">Detailed evidence is not available for this district in the current demo dataset.</h2>
          <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-relaxed text-[#8b94a3]">
            The demonstration dataset includes full evidence trails for Solapur, Nashik and Beed. You can view the available regional analysis below.
          </p>
          <button onClick={() => { nav('/evidence?focus=ev-solapur'); }} className="mx-auto mt-5 flex items-center gap-1.5 rounded-xl bg-[#4f8cff] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#3b76e6]">
            <FileCheck2 size={15} /> View available regional analysis
          </button>
          <button onClick={() => nav('/geography')} className="mx-auto mt-2 block py-2 text-[12.5px] font-semibold text-[#7aa5ff] hover:underline">
            Back to map
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="EVIDENCE · TRACEABLE INSIGHTS"
        title="WHY THIS WAS FLAGGED"
        sub="Here is the number. Here is the benchmark. Here is the difference. Here is where it came from."
      />

      <div className="mb-4 flex gap-2">
        {evidences.map((e) => (
          <button key={e.id} onClick={() => nav(`/evidence?focus=${e.id}`)} className={cn('rounded-xl px-4 py-2.5 text-[12.5px] font-semibold', focusId === e.id ? 'bg-[#4f8cff] text-white' : 'bg-white/5 text-[#8b94a3] hover:text-white')}>
            {e.districtName} · {e.schemeId === 'jjm' ? 'JJM' : 'PM-KISAN'}
          </button>
        ))}
      </div>

      <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* pipeline */}
        <div className="mb-4 flex items-center justify-center gap-1.5 overflow-x-auto py-1 text-[11px] font-bold tracking-wide">
          {['OBSERVED', 'BENCHMARK', 'DIFFERENCE', 'FINDING', 'SOURCE'].map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={cn('rounded-lg border px-3 py-1.5', i === 4 ? 'border-[#4f8cff]/40 bg-[#4f8cff]/10 text-white' : 'border-white/10 bg-white/[0.03] text-[#8b94a3]')}>{s}</span>
              {i < 4 && <ArrowDown size={13} className="-rotate-90 text-[#5b6474]" />}
            </span>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <Card data-tour="evidence" className="border-[#4f8cff]/20">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#7aa5ff]"><Lightbulb size={13} /> WHY {ev.districtName.toUpperCase()} WAS FLAGGED</div>
              <p className="mt-2 text-[14px] leading-relaxed text-[#c6ccd6]">
                {ev.id === 'ev-solapur' && (
                  <>
                    1. <strong className="text-white">What we observed:</strong> fund utilization in Solapur is 43%.
                    <br />2. <strong className="text-white">What we compared it against:</strong> the regional benchmark of 71%.
                    <br />3. <strong className="text-white">What the difference was:</strong> Solapur is 28 percentage points below the benchmark.
                    <br />4. <strong className="text-white">Where the data came from:</strong> PM-KISAN District Statistics, Apr–Sep 2025–26.
                  </>
                )}
                {ev.id === 'ev-nashik' && (
                  <>
                    1. <strong className="text-white">What we observed:</strong> coverage in Nashik is 48%.
                    <br />2. <strong className="text-white">What we compared it against:</strong> the state median of 70%.
                    <br />3. <strong className="text-white">What the difference was:</strong> 312 habitations are still waiting for tap connections, mostly in two tribal blocks.
                    <br />4. <strong className="text-white">Where the data came from:</strong> JJM Habitation Coverage, Apr–Sep 2025–26.
                  </>
                )}
                {ev.id === 'ev-beed' && (
                  <>
                    1. <strong className="text-white">What we observed:</strong> project completion in Beed is 49%.
                    <br />2. <strong className="text-white">What we compared it against:</strong> a 21-day release-to-spend benchmark.
                    <br />3. <strong className="text-white">What the difference was:</strong> Beed takes 47 days on average — more than twice the benchmark.
                    <br />4. <strong className="text-white">Where the data came from:</strong> PM-KISAN District Statistics, 2025–26.
                  </>
                )}
              </p>
            </Card>
            <Card className="border-white/8">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#8b94a3]"><Lightbulb size={13} /> INSIGHT</div>
              <p className="mt-1.5 text-[19px] font-semibold leading-snug">“{ev.insight}”</p>
              <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-[#8b94a3]">
                <span className="rounded bg-white/5 px-2 py-1">{ev.districtName}</span>
                <span className="rounded bg-white/5 px-2 py-1">{ev.schemeName}</span>
                <span className="rounded bg-white/5 px-2 py-1">{ev.period}</span>
              </div>
            </Card>

            <Card>
              <div className="mb-3 text-[11px] font-semibold tracking-[0.15em] text-[#8b94a3]">SUPPORTING FACTORS</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {ev.factors.map((f) => (
                  <div key={f.label} className={cn('rounded-xl border p-3', f.tone === 'bad' ? 'border-red-500/20 bg-red-500/5' : f.tone === 'good' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/8 bg-white/[0.02]')}>
                    <div className="text-[11px] text-[#8b94a3]">{f.label}</div>
                    <div className={cn('tick text-[20px] font-bold', f.tone === 'bad' ? 'text-red-300' : f.tone === 'good' ? 'text-emerald-300' : 'text-white')}>{f.value}</div>
                    {f.delta && <div className="text-[11px] text-[#8b94a3]">{f.delta}</div>}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#8b94a3]"><Database size={13} /> SOURCE DATA · {ev.dataset.toUpperCase()}</div>
                <button onClick={() => setShowSource(!showSource)} className="flex items-center gap-1 text-[12px] font-semibold text-[#7aa5ff]"><Eye size={13} /> {showSource ? 'Hide' : 'View source data'}</button>
              </div>
              {showSource && (
                <div className="overflow-x-auto rounded-xl border border-white/8">
                  <table className="w-full text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-white/8 bg-black/30 text-[10.5px] uppercase tracking-wider text-[#5b6474]">
                        <th className="px-3 py-2.5">District</th><th className="px-3 py-2.5 text-right">Coverage</th><th className="px-3 py-2.5 text-right">Utilization</th><th className="px-3 py-2.5 text-right">Completion</th><th className="px-3 py-2.5 text-right">Benchmark</th><th className="px-3 py-2.5 text-right">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ev.sourceRows.map((r) => (
                        <tr key={r.district} className={cn('border-b border-white/5 last:border-0', r.district === ev.districtName ? 'bg-[#4f8cff]/8' : 'hover:bg-white/[0.02]')}>
                          <td className="px-3 py-2 font-semibold">{r.district}</td>
                          <td className="tick px-3 py-2 text-right">{r.coverage}%</td>
                          <td className={cn('tick px-3 py-2 text-right font-bold', r.utilization < 55 ? 'text-red-300' : '')}>{r.utilization}%</td>
                          <td className="tick px-3 py-2 text-right">{r.completion}%</td>
                          <td className="tick px-3 py-2 text-right text-[#8b94a3]">{r.benchmark}%</td>
                          <td className="px-3 py-2 text-right"><span className={cn('rounded px-1.5 py-0.5 font-mono text-[10px] font-bold', r.flag === 'FLAGGED' ? 'bg-red-500/15 text-red-300' : r.flag === 'OK' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300')}>{r.flag}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {[
                  { l: 'Dataset', v: ev.dataset },
                  { l: 'Records analyzed', v: `${ev.records} districts` },
                  { l: 'Period', v: ev.period },
                  { l: 'Analysis', v: ev.analysis },
                ].map((m) => (
                  <div key={m.l} className="rounded-lg bg-black/30 p-2.5"><div className="text-[10px] uppercase tracking-wider text-[#5b6474]">{m.l}</div><div className="mt-0.5 text-[12px] font-semibold">{m.v}</div></div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-emerald-500/20">
              <div className="text-[11px] font-semibold tracking-[0.15em] text-emerald-300">CONFIDENCE</div>
              <div className="tick mt-1 text-[36px] font-bold">{ev.confidence}%</div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8"><motion.div initial={{ width: 0 }} animate={{ width: `${ev.confidence}%` }} className="h-full rounded-full bg-emerald-400" /></div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-[#8b94a3]">Full district reporting ({ev.records}/{ev.records}), variance σ = 9.4pp. No imputation.</p>
            </Card>
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-[#8b94a3]"><Calculator size={13} /> CALCULATION</div>
                <button onClick={() => setShowCalc(!showCalc)} className="text-[12px] font-semibold text-[#7aa5ff]">{showCalc ? 'Hide' : 'View calculation'}</button>
              </div>
              {showCalc ? (
                <ol className="space-y-2 font-mono text-[11.5px] leading-relaxed text-[#c6ccd6]">
                  {ev.calculation.map((c, i) => <li key={i} className="rounded-lg bg-black/30 p-2.5">{c}</li>)}
                </ol>
              ) : (
                <p className="font-mono text-[11.5px] text-[#8b94a3]">Deviation = 43% − 71% = −28pp · median benchmark · isolation-forest anomaly 0.87</p>
              )}
              <div className="mt-3 space-y-2">
                <button onClick={() => setShowSource(true)} className="w-full rounded-xl bg-[#4f8cff] py-2.5 text-[12.5px] font-bold hover:bg-[#3b76e6]">VIEW SOURCE DATA</button>
                <button onClick={() => setShowCalc(true)} className="w-full rounded-xl border border-white/10 py-2.5 text-[12.5px] font-bold hover:border-[#4f8cff]/40">VIEW CALCULATION</button>
                <button onClick={() => nav('/relationships?focus=pm-kisan')} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2.5 text-[12.5px] font-bold text-[#c6ccd6] hover:border-[#4f8cff]/40 hover:text-white">
                  <FileCheck2 size={14} /> RELATED SCHEMES
                </button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
