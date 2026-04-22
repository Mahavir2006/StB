import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  src: string;
  /** For video cards: a photo used as the thumbnail in the grid */
  thumb: string;
  caption: string;
  date: string;
}

const MEDIA: MediaItem[] = [
  { id: 1,  type: 'photo', src: '/memories/Photo_1.jpg',                                    thumb: '/memories/Photo_1.jpg',   caption: 'A moment worth keeping forever.',                    date: 'April 2026'       },
  { id: 2,  type: 'photo', src: '/memories/Photo_2.jpg',                                    thumb: '/memories/Photo_2.jpg',   caption: 'Every picture tells a story.',                       date: 'April 2026'       },
  { id: 3,  type: 'photo', src: '/memories/Photo_3.jpg',                                    thumb: '/memories/Photo_3.jpg',   caption: 'The best kind of chaos.',                            date: 'April 2026'       },
  { id: 4,  type: 'photo', src: '/memories/Photo_4.jpg',                                    thumb: '/memories/Photo_4.jpg',   caption: 'Frozen in time, perfectly.',                         date: 'April 2026'       },
  { id: 5,  type: 'photo', src: '/memories/IMG_20241013_161439_583@-689708039.jpg',          thumb: '/memories/IMG_20241013_161439_583@-689708039.jpg', caption: 'October 2024 — a good day.', date: 'October 2024'  },
  { id: 6,  type: 'photo', src: '/memories/IMG_20260415_180607_807@954554821.jpg',           thumb: '/memories/IMG_20260415_180607_807@954554821.jpg',  caption: 'April 15 — golden hour.',    date: 'April 15, 2026' },
  { id: 7,  type: 'photo', src: '/memories/Screenshot_20260411-154447.jpg',                 thumb: '/memories/Screenshot_20260411-154447.jpg',         caption: 'A screenshot worth saving.', date: 'April 11, 2026' },
  { id: 8,  type: 'video', src: '/memories/VID-20260418-WA0035.mp4',                        thumb: '/memories/Photo_1.jpg',   caption: 'April 18 — you had to be there.',                    date: 'April 18, 2026'   },
  { id: 9,  type: 'video', src: '/memories/Screen_Recording_20260411_160231.mp4',           thumb: '/memories/Photo_2.jpg',   caption: 'April 11 — screen recording of something chaotic.',  date: 'April 11, 2026'   },
  { id: 10, type: 'video', src: '/memories/IMG_20260420_203643_081.mp4',                    thumb: '/memories/Photo_3.jpg',   caption: 'April 20 — late night energy.',                      date: 'April 20, 2026'   },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Card — Optimized for Zero-JS Hover Effects                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function TiltCard({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative w-full aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group bg-[var(--surface-color)] p-[2px]"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      {/* Gradient border — CSS only, no JS */}
      <div
        className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, var(--accent-primary-start), var(--accent-secondary-start))' }}
      />

      <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[var(--surface-color)] z-10 transition-transform duration-300 group-hover:scale-[0.98]">
        {/* Always render a plain <img> — no video decode on the grid */}
        <img
          src={item.thumb}
          alt={item.caption}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
        />

        {/* Video badge */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors">
            <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white border border-white/25 backdrop-blur-none">
              <Play size={16} className="ml-0.5" />
            </div>
          </div>
        )}

        {/* Caption — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/75 to-transparent
          translate-y-full group-hover:translate-y-0 transition-transform duration-300 will-change-transform">
          <p className="text-white/90 font-emotional italic text-sm line-clamp-2">{item.caption}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Modal — video only loads when the modal is open                            */
/* ─────────────────────────────────────────────────────────────────────────── */
function MediaModal({ item, onClose, onPrev, onNext, hasPrev, hasNext, currentIdx }: {
  item: MediaItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIdx: number;
}) {
  const [hearted, setHearted] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft'  && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const handleHeart = () => {
    setHearted(true);
    setHeartAnim(true);
    confetti({ particleCount: 70, spread: 55, origin: { y: 0.6 }, colors: ['#ef4444', '#FF9A86', '#FFB399'] });
    setTimeout(() => setHeartAnim(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.96)' }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ background: 'rgba(0,0,0,0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            text-white hover:text-white bg-white/15 hover:bg-white/25
            border border-white/20 hover:border-white/35 transition-all group"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M8.5 2L3.5 6.5L8.5 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cinema Vault
        </button>

        <span className="text-white/70 text-xs font-mono tabular-nums">
          {currentIdx + 1} / {MEDIA.length}
        </span>

        <button onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50
            hover:text-white hover:bg-white/15 transition-all"
          aria-label="Close">
          <X size={17} />
        </button>
      </div>

      {/* ── Media area ── */}
      <div className="flex-1 flex items-center justify-center relative px-14 min-h-0">
        {hasPrev && (
          <button onClick={onPrev}
            className="absolute left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center
              text-white/50 hover:text-white bg-white/8 hover:bg-white/18
              border border-white/10 transition-all"
            aria-label="Previous">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M9.5 3L5 7.5L9.5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-4xl max-h-full flex items-center justify-center"
        >
          {item.type === 'video' ? (
            /* preload="metadata" — only fetches duration/dimensions, not the full file */
            <video
              key={item.src}
              src={item.src}
              poster={item.thumb}
              controls
              autoPlay
              preload="metadata"
              className="w-full max-h-[65vh] rounded-xl object-contain shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
            />
          ) : (
            <img
              src={item.src}
              alt={item.caption}
              className="w-full max-h-[65vh] rounded-xl object-contain shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
            />
          )}
        </motion.div>

        {hasNext && (
          <button onClick={onNext}
            className="absolute right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center
              text-white/50 hover:text-white bg-white/8 hover:bg-white/18
              border border-white/10 transition-all"
            aria-label="Next">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M5.5 3L10 7.5L5.5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Bottom: caption + heart + thumbnails ── */}
      <div className="shrink-0 px-5 pt-4 pb-4"
        style={{ background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Caption row */}
        <div className="flex items-center justify-between mb-3 max-w-4xl mx-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest block mb-1 text-[#FF9A86]">
              {item.date}
            </span>
            <p className="text-white font-emotional italic text-base leading-snug max-w-lg">
              {item.caption}
            </p>
          </div>
          <button
            onClick={handleHeart}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shrink-0 ml-4 text-sm"
            style={{
              borderColor: hearted ? 'rgba(239,68,68,0.6)'  : 'rgba(255,255,255,0.25)',
              background:   hearted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.10)',
              color:        hearted ? '#ef4444'              : '#ffffff',
            }}
          >
            <motion.div animate={heartAnim ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart size={14} fill={hearted ? 'currentColor' : 'none'} />
            </motion.div>
            Core Memory
          </button>
        </div>

        {/* Thumbnail strip — photos only (no video decode) */}
        <div className="flex gap-1.5 justify-center overflow-x-auto pb-0.5 max-w-4xl mx-auto">
          {MEDIA.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                const diff = idx - currentIdx;
                if (diff < 0) for (let i = 0; i < -diff; i++) onPrev();
                else if (diff > 0) for (let i = 0; i < diff; i++) onNext();
              }}
              className="shrink-0 w-10 h-10 rounded-md overflow-hidden border-2 transition-all"
              style={{
                borderColor: m.id === item.id ? 'var(--accent-primary-start)' : 'transparent',
                opacity: m.id === item.id ? 1 : 0.4,
              }}
            >
              <img src={m.thumb} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              {m.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={8} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
export function CinemaVault() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const go = useCallback((idx: number) => setSelectedIdx(idx), []);
  const close = useCallback(() => setSelectedIdx(null), []);
  const prev  = useCallback(() => setSelectedIdx(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const next  = useCallback(() => setSelectedIdx(i => (i !== null && i < MEDIA.length - 1 ? i + 1 : i)), []);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-4xl font-display font-bold text-center mb-3 uppercase tracking-widest text-[var(--text-primary)]">
        Cinema Vault
      </h2>
      <p className="text-[var(--text-secondary)] text-center mb-10 max-w-lg font-ui text-sm">
        A collection of moments perfectly frozen in time — every chaotic, beautiful detail of our story.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl pb-16">
        {MEDIA.map((item, idx) => (
          <TiltCard key={item.id} item={item} onClick={() => go(idx)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <MediaModal
            key="modal"
            item={MEDIA[selectedIdx]}
            currentIdx={selectedIdx}
            onClose={close}
            onPrev={prev}
            onNext={next}
            hasPrev={selectedIdx > 0}
            hasNext={selectedIdx < MEDIA.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
