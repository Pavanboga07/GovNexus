import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '../../lib/cn';
import type { District } from '../../types';

export type MapLayer = 'efficiency' | 'coverage' | 'utilization' | 'gaps';

export const LAYERS: { id: MapLayer; label: string }[] = [
  { id: 'efficiency', label: 'Performance' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'utilization', label: 'Utilization' },
  { id: 'gaps', label: 'Gaps' },
];

function colorFor(d: District, layer: MapLayer): string {
  const v =
    layer === 'coverage' ? d.coverage
    : layer === 'utilization' ? d.utilization
    : layer === 'gaps' ? 100 - d.coverage
    : d.efficiency;
  if (layer === 'gaps') {
    if (v >= 70) return '#f87171';
    if (v >= 45) return '#fbbf24';
    return '#34d399';
  }
  if (v >= 72) return '#34d399';
  if (v >= 60) return '#4f8cff';
  if (v >= 50) return '#fbbf24';
  return '#f87171';
}

function sizeFor(d: District): number {
  const base = 5 + (d.coverage / 100) * 7;
  return d.status === 'high' || d.status === 'critical' ? base + 2 : base;
}

// Simplified India silhouette path (stylised, demo-grade) + state boundary hints.
const INDIA_PATH =
  'M50 4 L56 6 L60 10 L62 16 L64 22 L66 28 L64 34 L62 38 L64 44 L62 50 L60 56 L58 62 L56 68 L54 74 L52 80 L50 86 L47 90 L44 88 L42 84 L40 80 L38 76 L36 72 L34 68 L32 64 L30 60 L28 56 L26 52 L24 48 L22 44 L24 38 L26 32 L28 26 L32 20 L36 14 L42 8 Z';

export default function IndiaMap({
  districts,
  layer,
  selectedId,
  highlightIds,
  onSelect,
  height = 460,
}: {
  districts: District[];
  layer: MapLayer;
  selectedId?: string | null;
  highlightIds?: string[];
  onSelect: (d: District) => void;
  height?: number;
}) {
  const sorted = useMemo(() => [...districts].sort((a, b) => a.anomalyScore - b.anomalyScore), [districts]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/8 bg-[#080b10]" style={{ height }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapglow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#4f8cff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#mapglow)" />
        {/* grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} stroke="rgba(255,255,255,0.05)" strokeWidth="0.15">
            <line x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" />
            <line x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} />
          </g>
        ))}
        <path d={INDIA_PATH} fill="rgba(79,140,255,0.05)" stroke="rgba(122,165,255,0.35)" strokeWidth="0.4" />
        {/* state hint labels */}
        <text x="46" y="40" fill="rgba(255,255,255,0.25)" fontSize="3.2" fontWeight="600">MP</text>
        <text x="30" y="38" fill="rgba(255,255,255,0.25)" fontSize="3.2" fontWeight="600">RJ</text>
        <text x="22" y="47" fill="rgba(255,255,255,0.25)" fontSize="3.2" fontWeight="600">GJ</text>
        <text x="44" y="60" fill="rgba(255,255,255,0.3)" fontSize="3.4" fontWeight="700">MH</text>
        <text x="50" y="78" fill="rgba(255,255,255,0.25)" fontSize="3.2" fontWeight="600">KA</text>

        {sorted.map((d, i) => {
          const isSel = selectedId === d.id;
          const isHi = highlightIds?.includes(d.id);
          const c = colorFor(d, layer);
          return (
            <motion.g
              key={d.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.6) }}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(d)}
            >
              {(isSel || isHi) && (
                <circle cx={d.x} cy={d.y} r={sizeFor(d) * 0.55} fill={c} opacity={0.22}>
                  <animate attributeName="r" values={`${sizeFor(d) * 0.4};${sizeFor(d) * 0.75};${sizeFor(d) * 0.4}`} dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={d.x}
                cy={d.y}
                r={sizeFor(d) * 0.32}
                fill={c}
                fillOpacity={isHi === false ? 0.35 : 0.9}
                stroke={isSel ? '#fff' : 'rgba(0,0,0,0.6)'}
                strokeWidth={isSel ? 0.5 : 0.3}
                opacity={highlightIds && highlightIds.length > 0 && !isHi ? 0.3 : 1}
              />
              {(isSel || d.id === 'solapur' || d.id === 'pune' || d.id === 'nashik') && (
                <text x={d.x + 2.2} y={d.y + 1} fill="rgba(255,255,255,0.75)" fontSize="2.6" fontWeight="600">
                  {d.name}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-[10.5px] text-[#8b94a3] backdrop-blur">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Strong</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#4f8cff]" /> Stable</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Watch</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Critical</span>
      </div>
      <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 font-mono text-[10px] text-[#8b94a3] backdrop-blur">
        36 DISTRICTS · 5 STATES · {layer.toUpperCase()}
      </div>
    </div>
  );
}

export function layerValue(d: District, layer: MapLayer): number {
  if (layer === 'coverage') return d.coverage;
  if (layer === 'utilization') return d.utilization;
  if (layer === 'gaps') return 100 - d.coverage;
  return d.efficiency;
}

export function cn2(...c: (string | false | undefined)[]) {
  return cn(...c);
}
