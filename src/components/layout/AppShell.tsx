import { AnimatePresence } from 'framer-motion';
import { Bell, CircleDot, Command, Crosshair, FileCheck2, Home, Network, Search, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';
import Copilot from '../ai/Copilot';
import { TourCoach, WelcomeOverlay } from '../tour/WelcomeTour';

const nav = [
  { to: '/', label: 'Command Center', icon: Home },
  { to: '/schemes', label: 'Schemes', icon: Command },
  { to: '/geography', label: 'Geography', icon: CircleDot },
  { to: '/relationships', label: 'Relationships', icon: Network },
  { to: '/intelligence', label: 'Insights', icon: TriangleAlert },
  { to: '/evidence', label: 'Evidence', icon: FileCheck2 },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotKey, setCopilotKey] = useState(0);
  const [welcomed, setWelcomed] = useState(() => {
    try { return localStorage.getItem('govnexus-welcomed') === '1'; } catch { return true; }
  });
  const [tourStep, setTourStep] = useState<number | null>(null);
  const loc = useLocation();
  const nav2 = useNavigate();

  const openCopilot = (q = '') => {
    setCopilotQuery(q);
    setCopilotKey((k) => k + 1);
    setCopilotOpen(true);
  };

  const endTour = () => {
    setTourStep(null);
    try { localStorage.setItem('govnexus-welcomed', '1'); } catch { /* ignore */ }
    setWelcomed(true);
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent).detail?.query ?? '';
      openCopilot(q);
    };
    const onClose = () => setCopilotOpen(false);
    const onStep = (e: Event) => setTourStep((e as CustomEvent).detail?.step ?? null);
    const onStartTour = () => {
      if (loc.pathname !== '/') nav2('/');
      setTimeout(() => setTourStep(0), loc.pathname !== '/' ? 400 : 0);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCopilot();
      }
    };
    window.addEventListener('govnexus:open-copilot', onOpen);
    window.addEventListener('govnexus:close-copilot', onClose);
    window.addEventListener('govnexus:tour-step', onStep);
    window.addEventListener('govnexus:start-tour', onStartTour);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('govnexus:open-copilot', onOpen);
      window.removeEventListener('govnexus:close-copilot', onClose);
      window.removeEventListener('govnexus:tour-step', onStep);
      window.removeEventListener('govnexus:start-tour', onStartTour);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen bg-[#06080c] text-[#f2f4f8]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[232px] flex-col border-r border-white/8 bg-[#0a0d12]">
        <div className="px-5 pb-4 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#4f8cff]/15 text-[#7aa5ff]">
              <Crosshair size={20} />
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-[0.08em]">GOVNEXUS</div>
              <div className="text-[10.5px] text-[#8b94a3]">Cross-Ministry Intelligence</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors',
                  isActive ? 'bg-[#4f8cff]/12 text-white' : 'text-[#8b94a3] hover:bg-white/5 hover:text-white'
                )
              }
            >
              <n.icon size={16} className={loc.pathname === n.to ? 'text-[#7aa5ff]' : ''} />
              {n.label}
              {n.label === 'Insights' && (
                <span className="ml-auto rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-300">4</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="m-3 rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            SYSTEM ONLINE
          </div>
          <div className="mt-1.5 text-[11px] text-[#8b94a3]">Demo Environment</div>
          <div className="mt-0.5 text-[11px] text-[#5b6474]">Last synchronized: 03 Oct 2026</div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[232px] flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#06080c]/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-6 py-3.5">
            <button
              onClick={() => openCopilot()}
              className="group flex h-10 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-left transition-colors hover:border-[#4f8cff]/40"
            >
              <Search size={16} className="text-[#5b6474] group-hover:text-[#7aa5ff]" />
              <span className="text-[13px] text-[#5b6474]">Ask about schemes, regions and implementation… <span className="ml-1 rounded bg-white/8 px-1.5 py-0.5 font-mono text-[10px] text-[#8b94a3]">AI COPILOT</span></span>
              <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#8b94a3]">⌘K</kbd>
            </button>
            <button onClick={() => nav2('/intelligence')} className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[#8b94a3] hover:text-white">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
            </button>
            <div className="hidden items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[11px] font-semibold tracking-wide text-amber-300 md:flex">
              DEMO · REPRESENTATIVE DATA
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#4f8cff] to-[#7aa5ff] text-[13px] font-bold">AS</div>
          </div>
        </header>

        <main className="relative flex-1 px-6 py-6">
          <div className="pointer-events-none absolute inset-0 grid-bg" />
          <div className="relative mx-auto max-w-[1280px]">{children}</div>
        </main>
      </div>

      <AnimatePresence>
        {copilotOpen && <Copilot key={copilotKey} initialQuery={copilotQuery} onClose={() => setCopilotOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {!welcomed && tourStep === null && (
          <WelcomeOverlay
            onTour={() => { if (loc.pathname !== '/') nav2('/'); setTimeout(() => setTourStep(0), loc.pathname !== '/' ? 400 : 0); }}
            onExplore={endTour}
          />
        )}
      </AnimatePresence>
      {tourStep !== null && <TourCoach step={tourStep} onEnd={endTour} />}
    </div>
  );
}
