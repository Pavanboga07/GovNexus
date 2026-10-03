import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader, SeverityBadge } from '../components/ui';
import { schemes } from '../data/schemes';

const ministries = ['All', ...Array.from(new Set(schemes.map((s) => s.ministry)))];
const categories = ['All', ...Array.from(new Set(schemes.map((s) => s.category)))];

export default function Schemes() {
  const [q, setQ] = useState('');
  const [ministry, setMinistry] = useState('All');
  const [category, setCategory] = useState('All');
  const [perf, setPerf] = useState('All');
  const nav = useNavigate();

  const list = useMemo(() => {
    return schemes.filter((s) => {
      if (ministry !== 'All' && s.ministry !== ministry) return false;
      if (category !== 'All' && s.category !== category) return false;
      if (perf === 'On track' && s.utilization < 68) return false;
      if (perf === 'Watch' && (s.utilization >= 68 || s.utilization < 55)) return false;
      if (perf === 'Needs attention' && s.utilization >= 55) return false;
      if (q && !(s.name + s.fullName + s.ministry).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, ministry, category, perf]);

  return (
    <div>
      <PageHeader
        kicker="PROGRAMME DIRECTORY · 12 PROGRAMMES"
        title="PROGRAMME OVERVIEW"
        sub="Browse every programme: who it serves, how it is performing, and where it is active."
        right={
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <Search size={15} className="text-[#5b6474]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search schemes…" className="w-52 bg-transparent text-[13px] outline-none placeholder:text-[#5b6474]" />
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Filter label="Ministry" value={ministry} options={ministries} onChange={setMinistry} />
        <Filter label="Category" value={category} options={categories} onChange={setCategory} />
        <Filter label="Performance" value={perf} options={['All', 'On track', 'Watch', 'Needs attention']} onChange={setPerf} />
        <div className="ml-auto self-center font-mono text-[11px] text-[#5b6474]">{list.length} / 12 SCHEMES</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}>
            <Card className="card-hover cursor-pointer" >
              <div onClick={() => nav(`/schemes/${s.id}`)}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[16px] font-bold">{s.name}</div>
                    <div className="max-w-[260px] truncate text-[11.5px] text-[#8b94a3]">{s.fullName}</div>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                </div>
                <div className="mt-1 text-[11px] text-[#5b6474]">{s.ministry}</div>
                <div className="mt-1 text-[11px] text-[#8b94a3]">Serves {s.beneficiaries} beneficiaries</div>
                <div className="mt-2"><SeverityBadge severity={s.utilization >= 68 ? 'healthy' : s.utilization >= 55 ? 'medium' : 'high'} /></div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <MiniStat label="Coverage" value={`${s.coverage}%`} />
                  <MiniStat label="Implementation" value={`${s.utilization}%`} />
                </div>
                <div className="mt-3">
                  <Bar label="Coverage" v={s.coverage} c={s.color} />
                  <Bar label="Implementation" v={s.utilization} c="#fbbf24" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-[12px]">
                  <span className="font-mono text-[#5b6474]">₹{(s.utilized / 1000).toFixed(1)}k Cr / ₹{(s.allocated / 1000).toFixed(1)}k Cr</span>
                  <span className="flex items-center gap-1 font-semibold text-[#7aa5ff]">Open <ArrowRight size={13} /></span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {list.length === 0 && <div className="card mt-2 p-10 text-center text-[13px] text-[#8b94a3]">No schemes match these filters. Clear search to reset.</div>}
    </div>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px]">
      <span className="text-[#5b6474]">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-[220px] bg-transparent font-medium outline-none [&>option]:bg-[#11161e]">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/30 p-2">
      <div className="tick text-[13.5px] font-bold">{value}</div>
      <div className="text-[10px] text-[#8b94a3]">{label}</div>
    </div>
  );
}

function Bar({ label, v, c }: { label: string; v: number; c: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-2 text-[11px]">
      <span className="w-[70px] text-[#8b94a3]">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
        <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} className="h-full rounded-full" style={{ background: c }} />
      </div>
      <span className="tick w-8 text-right font-semibold">{v}%</span>
    </div>
  );
}
