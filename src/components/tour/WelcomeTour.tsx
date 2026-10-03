import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, MessageCircleQuestion, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';

export const TOUR_QUERY = 'Find regions where scheme coverage is high but implementation efficiency is low';

export function WelcomeOverlay({ onTour, onExplore }: { onTour: () => void; onExplore: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.96, y: 14 }} animate={{ scale: 1, y: 0 }}
        className="card w-full max-w-[600px] p-8 text-center"
      >
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#4f8cff]/12 text-[#7aa5ff]">
          <Sparkles size={22} />
        </div>
        <h1 className="text-[28px] font-bold tracking-tight">Welcome to GOVNEXUS</h1>
        <p className="mt-1 text-[14px] text-[#7aa5ff]">Understand government programme performance in seconds.</p>
        <p className="mx-auto mt-3 max-w-[480px] text-[13.5px] leading-relaxed text-[#8b94a3]">
          GOVNEXUS brings programme performance, geography and evidence together so decision-makers can quickly
          understand what is happening, where it is happening, and why.
        </p>
        <div className="mx-auto mt-6 grid max-w-[480px] gap-2 text-left sm:grid-cols-3">
          {[
            { icon: MessageCircleQuestion, t: 'ASK', d: 'Ask a question in plain language.' },
            { icon: MapPin, t: 'SEE', d: 'See the answer across regions.' },
            { icon: ShieldCheck, t: 'VERIFY', d: 'Trace findings back to evidence.' },
          ].map((s) => (
            <div key={s.t} className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
              <s.icon size={17} className="text-[#7aa5ff]" />
              <div className="mt-2 text-[12px] font-bold tracking-[0.12em]">{s.t}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-[#8b94a3]">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button onClick={onTour} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4f8cff] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#3b76e6]">
            Show me how it works <ArrowRight size={16} />
          </button>
          <button onClick={onExplore} className="rounded-xl border border-white/12 px-6 py-3 text-[14px] font-semibold text-[#c6ccd6] hover:border-[#4f8cff]/40 hover:text-white">
            Explore GOVNEXUS
          </button>
        </div>
        <p className="mt-4 font-mono text-[10.5px] text-[#5b6474]">DEMONSTRATION USING REPRESENTATIVE DATA</p>
      </motion.div>
    </motion.div>
  );
}

interface TourStep {
  target?: string;
  title: string;
  body: string;
  cta: string;
}

const STEPS: TourStep[] = [
  {
    target: 'ask',
    title: 'Step 1 of 6 · Ask a question',
    body: 'Type a plain-language question. Try: “Find regions where scheme coverage is high but implementation efficiency is low.”',
    cta: 'Run this example',
  },
  {
    target: 'copilot',
    title: 'Step 2 of 6 · See what it found',
    body: 'GOVNEXUS identifies the regions matching your question, with the numbers behind each finding.',
    cta: 'Next',
  },
  {
    target: 'map',
    title: 'Step 3 of 6 · Explore geographically',
    body: 'The highlighted regions match your question. Each dot is a district — select one to dig in.',
    cta: 'Open Solapur',
  },
  {
    target: 'district',
    title: 'Step 4 of 6 · Read the district',
    body: 'Coverage, utilization and completion at a glance — plus why this district needs attention.',
    cta: 'Next',
  },
  {
    target: 'why',
    title: 'Step 5 of 6 · Understand why',
    body: '“Why is this flagged?” compares the district against its regional benchmark.',
    cta: 'View evidence',
  },
  {
    target: 'evidence',
    title: 'Step 6 of 6 · Verify the evidence',
    body: 'Every finding traces back: what was observed, the benchmark, the difference, and the source.',
    cta: 'Finish',
  },
];

export function TourCoach({ step, onEnd }: { step: number; onEnd: () => void }) {
  const nav = useNavigate();
  const s = STEPS[step];

  useEffect(() => {
    const apply = () => {
      document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow'));
      if (!s?.target) return false;
      const el = document.querySelector(`[data-tour="${s.target}"]`);
      if (el) {
        el.classList.add('tour-glow');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      return false;
    };
    apply();
    const t = setTimeout(apply, 1000);
    return () => {
      clearTimeout(t);
      document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow'));
    };
  }, [step, s]);

  const advance = () => {
    if (step === 0) {
      window.dispatchEvent(new CustomEvent('govnexus:tour-ask', { detail: { query: TOUR_QUERY } }));
      onEndStep(1);
    } else if (step === 1) {
      window.dispatchEvent(new Event('govnexus:close-copilot'));
      onEndStep(2);
    } else if (step === 2) {
      window.dispatchEvent(new CustomEvent('govnexus:tour-select', { detail: { district: 'solapur' } }));
      onEndStep(3);
    } else if (step === 3) {
      onEndStep(4);
    } else if (step === 4) {
      nav('/evidence?focus=ev-solapur');
      onEndStep(5);
    } else {
      onEnd();
    }
  };

  const onEndStep = (n: number) => {
    window.dispatchEvent(new CustomEvent('govnexus:tour-step', { detail: { step: n } }));
  };

  if (!s) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2">
        <div className="card p-5 text-center">
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/12 text-emerald-300"><CheckCircle2 size={20} /></div>
          <div className="text-[16px] font-bold">You've seen the core GOVNEXUS workflow.</div>
          <p className="mt-1 text-[12.5px] text-[#8b94a3]">Ask → See → Investigate → Verify. The demo uses representative data.</p>
          <button onClick={() => { nav('/'); onEnd(); }} className="mt-4 w-full rounded-xl bg-[#4f8cff] py-2.5 text-[13.5px] font-bold text-white hover:bg-[#3b76e6]">
            Start Exploring
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold tracking-[0.15em] text-[#7aa5ff]">{s.title}</div>
          <button onClick={onEnd} className="flex items-center gap-1 text-[11.5px] text-[#5b6474] hover:text-white">
            Skip tour <X size={13} />
          </button>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#c6ccd6]">{s.body}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span key={i} className={cn('h-1.5 w-5 rounded-full', i <= step ? 'bg-[#4f8cff]' : 'bg-white/10')} />
            ))}
          </div>
          <button onClick={advance} className="ml-auto flex items-center gap-1.5 rounded-xl bg-[#4f8cff] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#3b76e6]">
            {s.cta} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function useTourGlowCleanup(active: boolean) {
  useEffect(() => {
    if (!active) document.querySelectorAll('.tour-glow').forEach((el) => el.classList.remove('tour-glow'));
  }, [active]);
}
