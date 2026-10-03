import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import CommandCenter from './pages/CommandCenter';
import Evidence from './pages/Evidence';
import Geography from './pages/Geography';
import Intelligence from './pages/Intelligence';
import Relationships from './pages/Relationships';
import SchemeDetail from './pages/SchemeDetail';
import Schemes from './pages/Schemes';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

function Animated({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <motion.div key={loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Animated><CommandCenter /></Animated>} />
            <Route path="/schemes" element={<Animated><Schemes /></Animated>} />
            <Route path="/schemes/:id" element={<Animated><SchemeDetail /></Animated>} />
            <Route path="/geography" element={<Animated><Geography /></Animated>} />
            <Route path="/relationships" element={<Animated><Relationships /></Animated>} />
            <Route path="/intelligence" element={<Animated><Intelligence /></Animated>} />
            <Route path="/evidence" element={<Animated><Evidence /></Animated>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </AppShell>
    </BrowserRouter>
  );
}
