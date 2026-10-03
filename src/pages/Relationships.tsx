import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, PageHeader } from '../components/ui';
import { relationships } from '../data/intelligence';
import { cn } from '../lib/cn';

const typeColor: Record<string, string> = {
  ministry: '#7aa5ff',
  scheme: '#4f8cff',
  district: '#f87171',
  beneficiary: '#a78bfa',
  project: '#34d399',
};

export default function Relationships() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string | null>(params.get('focus') ?? 'pm-kisan');

  const sel = relationships.find((r) => r.id === selected);
  const connected = useMemo(() => {
    if (!sel) return new Set<string>();
    const s = new Set<string>([sel.id, ...sel.links]);
    relationships.forEach((r) => { if (r.links.includes(sel.id)) s.add(r.id); });
    return s;
  }, [sel]);

  const dim = (id: string) => selected && !connected.has(id);

  return (
    <div>
      <PageHeader
        kicker="PROGRAMME OVERLAP · 18 ENTITIES"
        title="RELATED PROGRAMMES"
        sub="Ministries, schemes, districts and beneficiary groups as one network. Programmes can overlap geographically — seeing these relationships helps identify where multiple interventions reach the same communities."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <Card className="relative overflow-hidden p-2">
          <svg viewBox="0 0 100 100" className="h-[560px] w-full">
            {/* edges */}
            {relationships.flatMap((r) =>
              r.links.flatMap((t) => {
                const target = relationships.find((x) => x.id === t);
                if (!target) return [];
                const active = selected && (connected.has(r.id) && connected.has(t));
                return (
                  <motion.line
                    key={`${r.id}-${t}`}
                    x1={r.x} y1={r.y} x2={target.x} y2={target.y}
                    stroke={active ? '#7aa5ff' : 'rgba(255,255,255,0.12)'}
                    strokeWidth={active ? 0.5 : 0.25}
                    strokeDasharray={active ? 'none' : '1 1'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                  />
                );
              })
            )}
            {/* nodes */}
            {relationships.map((r, i) => (
              <motion.g
                key={r.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: dim(r.id) ? 0.3 : 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(r.id === selected ? null : r.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={r.x} cy={r.y}
                  r={r.type === 'ministry' ? 5.2 : r.type === 'scheme' ? 4.6 : 3.6}
                  fill={selected === r.id ? r.color : '#0c1016'}
                  stroke={r.color}
                  strokeWidth={selected === r.id ? 0.4 : 0.6}
                />
                {selected === r.id && (
                  <circle cx={r.x} cy={r.y} r={6.4} fill="none" stroke={r.color} strokeWidth="0.25" opacity="0.5">
                    <animate attributeName="r" values="5.4;7;5.4" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                )}
                <text x={r.x} y={r.y - (r.type === 'ministry' ? 6.4 : 5.6)} textAnchor="middle" fill={selected === r.id ? '#fff' : 'rgba(255,255,255,0.8)'} fontSize="2.5" fontWeight="700">
                  {r.label}
                </text>
                {r.sub && (
                  <text x={r.x} y={r.y + 6.4} textAnchor="middle" fill="rgba(139,148,163,0.9)" fontSize="1.9">
                    {r.sub}
                  </text>
                )}
              </motion.g>
            ))}
          </svg>
          <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-[10.5px] backdrop-blur">
            {Object.entries({ ministry: 'Ministry', scheme: 'Scheme', district: 'District', beneficiary: 'Beneficiaries' }).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5 text-[#8b94a3]"><span className="h-2 w-2 rounded-full" style={{ background: typeColor[k] }} />{v}</span>
            ))}
          </div>
        </Card>

        <Card className="h-fit">
          <div className="text-[12px] font-semibold tracking-[0.15em] text-[#8b94a3]">NODE INSPECTOR</div>
          {sel ? (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: sel.color }} />
                <span className="text-[16px] font-bold">{sel.label}</span>
              </div>
              <div className="text-[12px] capitalize text-[#8b94a3]">{sel.type} {sel.sub ? `· ${sel.sub}` : ''}</div>
              <div className="mt-3 text-[11px] font-semibold tracking-[0.12em] text-[#5b6474]">CONNECTED ({connected.size - 1})</div>
              <div className="mt-1.5 space-y-1.5">
                {[...connected].filter((id) => id !== sel.id).map((id) => {
                  const n = relationships.find((r) => r.id === id);
                  if (!n) return null;
                  return (
                    <button key={id} onClick={() => setSelected(id)} className="flex w-full items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-left text-[12.5px] hover:bg-white/[0.06]">
                      <span>{n.label}</span>
                      <span className={cn('rounded px-1.5 py-0.5 font-mono text-[10px]')} style={{ color: n.color, background: `${n.color}18` }}>{n.type}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setSelected(null)} className="mt-3 w-full rounded-xl border border-white/10 py-2 text-[12px] font-semibold text-[#8b94a3] hover:text-white">Clear selection</button>
              <div className="mt-3 rounded-xl bg-[#4f8cff]/8 p-3 text-[11.5px] leading-relaxed text-[#8b94a3]">
                {sel.id === 'pm-kisan'
                  ? 'PM-KISAN is the highest-degree node: MGNREGA (beneficiaries), JJM (geography), PMAY-G (households) all converge on Solapur.'
                  : `Selecting ${sel.label} highlights ${connected.size - 1} directly linked entities in the governance graph.`}
              </div>
            </div>
          ) : (
            <div className="mt-2 text-[13px] text-[#5b6474]">Click any node in the graph to inspect its connections.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
