import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bot, Loader2, Map as MapIcon, FileCheck2, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisSteps, answerQuery, suggestedQueries, type AIAnswer } from '../../services/aiQueryEngine';
import { cn } from '../../lib/cn';

export default function Copilot({ initialQuery, onClose }: { initialQuery?: string; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<string | null>(null);
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const nav = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const run = (q: string) => {
    if (!q.trim() || analyzing) return;
    setAnalyzing(true);
    setQuery(q);
    setAnswer(null);
    setPhase(analysisSteps[0]);
    let i = 0;
    const tick = () => {
      i++;
      if (i < analysisSteps.length) {
        setPhase(analysisSteps[i]);
        setTimeout(tick, 380);
      } else {
        setPhase(null);
        setAnswer(answerQuery(q));
        setAnalyzing(false);
        setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100);
      }
    };
    setTimeout(tick, 380);
  };

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      run(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        data-tour="copilot"
        className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col border-l border-white/10 bg-[#0b0e14]"
      >
        {/* header */}
        <div className="border-b border-white/8 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f8cff]/15 text-[#7aa5ff]"><Bot size={20} /></div>
              <div>
                <div className="text-[15px] font-semibold">Analysis Assistant</div>
                <div className="text-[12px] text-[#8b94a3]">Ask about schemes, regions and implementation.</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-[#8b94a3] hover:bg-white/5 hover:text-white"><X size={18} /></button>
          </div>
          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); run(input); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, regions, implementation..."
              disabled={analyzing}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[13px] outline-none placeholder:text-[#5b6474] focus:border-[#4f8cff]/50 disabled:opacity-60"
            />
            <button disabled={analyzing} className="grid h-11 w-11 place-items-center rounded-xl bg-[#4f8cff] text-white hover:bg-[#3b76e6] disabled:opacity-60">
              {analyzing ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            </button>
          </form>
          {analyzing && (
            <div className="mt-2 font-mono text-[11px] text-[#7aa5ff]">Analyzing…</div>
          )}
          {!answer && !phase && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((q) => (
                <button key={q} onClick={() => { setInput(q); run(q); }} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-[11.5px] text-[#8b94a3] hover:border-[#4f8cff]/40 hover:text-white">
                  {q.length > 52 ? q.slice(0, 52) + '…' : q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5">
          {!phase && !answer && (
            <div>
              <div className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-[#5b6474]">SUGGESTED QUERIES</div>
              <div className="space-y-2">
                {suggestedQueries.map((q) => (
                  <button key={q} onClick={() => { setInput(q); run(q); }} className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 text-left text-[12.5px] text-[#c6ccd6] hover:border-[#4f8cff]/40">
                    {q}<ArrowRight size={14} className="shrink-0 text-[#5b6474] group-hover:text-[#7aa5ff]" />
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11.5px] text-emerald-200/80">
                Demonstration using representative data. Every number shown comes from the 36-district demo dataset.
              </div>
            </div>
          )}

          {phase && (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-1 text-[12px] text-[#8b94a3]">Analyzing: “{query}”</div>
              <div className="space-y-2.5">
                {analysisSteps.map((s, i) => {
                  const active = analysisSteps.indexOf(phase) === i;
                  const done = analysisSteps.indexOf(phase) > i;
                  return (
                    <div key={s} className="flex items-center gap-2.5 text-[13px]">
                      {done ? <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-[11px] text-emerald-300">✓</span>
                        : active ? <Loader2 size={16} className="animate-spin text-[#7aa5ff]" />
                        : <span className="h-5 w-5 rounded-full border border-white/10" />}
                      <span className={cn(done ? 'text-[#8b94a3]' : active ? 'text-white' : 'text-[#5b6474]')}>{s}{active ? '…' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence>
            {answer && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="text-[11px] font-semibold tracking-[0.15em] text-emerald-300">HERE'S WHAT I FOUND</div>
                <div className="rounded-xl border border-[#4f8cff]/25 bg-[#4f8cff]/8 p-4">
                  <div className="text-[15px] font-semibold leading-snug">{answer.headline}</div>
                  <div className="mt-1 text-[12px] text-[#8b94a3]">{answer.sub}</div>
                </div>
                {answer.cards.map((c) => (
                  <div key={c.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[13.5px]">{c.title}</div>
                      <span className={cn('h-2 w-2 rounded-full', c.tone === 'red' ? 'bg-red-400' : c.tone === 'amber' ? 'bg-amber-400' : c.tone === 'green' ? 'bg-emerald-400' : 'bg-blue-400')} />
                    </div>
                    <div className="mb-2.5 text-[11.5px] text-[#8b94a3]">{c.subtitle}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {c.metrics.map((m) => (
                        <div key={m.label} className="rounded-lg bg-black/30 p-2 text-center">
                          <div className="tick text-[13px] font-bold">{m.value}</div>
                          <div className="text-[10px] text-[#8b94a3]">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    {(c.districtId || c.schemeId) && (
                      <div className="mt-2 flex gap-2">
                        {c.districtId && <button onClick={() => { onClose(); nav(`/geography?district=${c.districtId}`); }} className="text-[11.5px] font-semibold text-[#7aa5ff] hover:underline">Open district →</button>}
                        {c.schemeId && <button onClick={() => { onClose(); nav(`/schemes/${c.schemeId}`); }} className="text-[11.5px] font-semibold text-[#7aa5ff] hover:underline">Open scheme →</button>}
                      </div>
                    )}
                  </div>
                ))}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="mb-1 text-[11px] font-semibold tracking-[0.15em] text-amber-300">KEY OBSERVATION</div>
                  <p className="text-[12.5px] leading-relaxed text-[#c6ccd6]">{answer.observation}</p>
                </div>
                <div className="flex gap-2">
                  {answer.actions.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => { onClose(); nav(a.href); }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] px-3 py-2.5 text-[12.5px] font-semibold text-white hover:bg-[#3b76e6]"
                    >
                      {a.label.includes('map') ? <MapIcon size={14} /> : <FileCheck2 size={14} />}{a.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
