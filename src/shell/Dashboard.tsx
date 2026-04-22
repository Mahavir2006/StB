import { useState, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BentoGrid } from './BentoGrid';

/* ─── Lazy-load every section — none of these load until first navigation ─── */
const CinemaVault    = lazy(() => import('../modules/vault/CinemaVault').then(m => ({ default: m.CinemaVault })));
const QuizEngine     = lazy(() => import('../modules/quiz/QuizEngine').then(m => ({ default: m.QuizEngine })));
const TypewriterLetter = lazy(() => import('../modules/letter/TypewriterLetter').then(m => ({ default: m.TypewriterLetter })));
const WrappedStats   = lazy(() => import('../modules/wrapped/WrappedStats').then(m => ({ default: m.WrappedStats })));
const InfiniteReasons = lazy(() => import('../modules/reasons/InfiniteReasons').then(m => ({ default: m.InfiniteReasons })));
const PlaylistPlayer = lazy(() => import('../modules/playlist/PlaylistPlayer').then(m => ({ default: m.PlaylistPlayer })));
const WishWall       = lazy(() => import('../modules/wishes/WishWall').then(m => ({ default: m.WishWall })));
const GlobeScene     = lazy(() => import('../modules/globe/GlobeScene').then(m => ({ default: m.GlobeScene })));
const FinaleScene    = lazy(() => import('../modules/finale/FinaleScene').then(m => ({ default: m.FinaleScene })));
const SecretUnlock   = lazy(() => import('../modules/unlock/SecretUnlock').then(m => ({ default: m.SecretUnlock })));
/* Optimized native Canvas algorithm replaces heavy tsparticles */
const CanvasBackground = lazy(() => import('../components/ui/CanvasBackground').then(m => ({ default: m.CanvasBackground })));


/* Simple fade — NO blur filter (blur transitions are expensive) */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn'  as const } },
};

/* Minimal loading placeholder — no spinner animation */
function SectionLoader() {
  return <div className="w-full h-32" />;
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUnlock, setShowUnlock] = useState(false);

  const isHome = activeTab === 'overview';

  const navigate = useCallback((id: string) => {
    if (id === 'unlock') { setShowUnlock(true); return; }
    setActiveTab(id);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg-color)' }}>
      <Sidebar activeId={activeTab} onSelect={navigate} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden"
        style={{ background: 'var(--canvas-bg)' }}>

        {/* Canvas Background — Optimized lightweight canvas logic for both theme modes */}
        <Suspense fallback={null}>
          <CanvasBackground />
        </Suspense>

        {/* Aurora blobs — CSS only, GPU transform, no blur on body */}
        <div className="aurora-blob w-[60vw] h-[60vw] top-[-10vh] left-[-10vw]"
          style={{ backgroundColor: 'var(--color-accent-purple-start)' }} />
        <div className="aurora-blob w-[50vw] h-[50vw] top-[40vh] right-[-5vw]"
          style={{ backgroundColor: 'var(--color-accent-blue-start)', animationDuration: '25s', animationDirection: 'reverse' }} />
        <div className="aurora-blob w-[40vw] h-[40vw] bottom-[-10vh] left-[20vw]"
          style={{ backgroundColor: 'var(--color-accent-pink-start)', animationDuration: '22s', animationDirection: 'alternate-reverse' }} />

        <TopBar onMenuClick={() => {}} />

        {/* Back button */}
        <AnimatePresence>
          {!isHome && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[72px] left-4 md:left-8 z-20"
            >
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                  border border-[var(--border-color)] transition-colors duration-150 group"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'var(--surface-color)',
                }}
                aria-label="Back to home"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className={`flex-1 overflow-y-auto relative z-10 custom-scrollbar
          ${!isHome ? 'pt-14 md:pt-12 px-4 md:px-8 pb-8' : 'p-4 md:p-8'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Suspense fallback={<SectionLoader />}>
                {activeTab === 'overview'  && <BentoGrid onSelect={navigate} />}
                {activeTab === 'vault'     && <CinemaVault />}
                {activeTab === 'quiz'      && <QuizEngine />}
                {activeTab === 'story'     && <TypewriterLetter />}
                {activeTab === 'stats'     && <WrappedStats />}
                {activeTab === 'reasons'   && <InfiniteReasons />}
                {activeTab === 'playlist'  && <PlaylistPlayer />}
                {activeTab === 'wishes'    && <WishWall />}
                {activeTab === 'places'    && <GlobeScene />}
                {activeTab === 'finale'    && <FinaleScene />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showUnlock && (
          <Suspense fallback={null}>
            <SecretUnlock onClose={() => setShowUnlock(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
