/**
 * THE GALLERY — A private art gallery dedicated entirely to Stuti.
 * Dark room, spotlit frames, CSS-generated abstract paintings.
 * Each painting is a portrait of a quality, a memory, a feeling.
 *
 * THE UNFINISHED CANVAS — integrated as the final room.
 * Mouse movement reveals a watercolour portrait made of words.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PAINTING DATA                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

interface Painting {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  medium: string;
  /* CSS gradient that generates the abstract painting */
  gradient: string;
  accentColor: string;
  size: 'small' | 'medium' | 'large' | 'wide';
}

const PAINTINGS: Painting[] = [
  {
    id: 'p1',
    title: 'Portrait of Someone Who Laughs Too Loud',
    subtitle: 'Study in Joy, Unrestrained',
    description: 'The kind of laugh that fills a room before the joke is even finished. The kind that makes strangers smile without knowing why. This is that laugh, captured in the moment before it becomes a snort.',
    year: '2024',
    medium: 'Oil on canvas, laughter on memory',
    gradient: 'radial-gradient(ellipse at 30% 40%, #FFD6A6 0%, #FF9A86 35%, #c0392b 65%, #2D1200 100%)',
    accentColor: '#FF9A86',
    size: 'large',
  },
  {
    id: 'p2',
    title: 'The 2AM Philosopher',
    subtitle: 'Mixed media on sleeplessness',
    description: 'There is a version of her that only exists after midnight — sharper, more honest, funnier than she admits. This painting lives in that hour.',
    year: '2024',
    medium: 'Acrylic, midnight oil, unfinished thoughts',
    gradient: 'linear-gradient(135deg, #0a0818 0%, #2D1200 30%, #7A3D1A 60%, #FFB399 100%)',
    accentColor: '#FFB399',
    size: 'medium',
  },
  {
    id: 'p3',
    title: 'Chaos, Organised',
    subtitle: 'Abstract expressionism',
    description: 'She has a system. Nobody else understands it. It works perfectly. This is what that looks like from the inside.',
    year: '2023',
    medium: 'Watercolour, controlled entropy',
    gradient: 'conic-gradient(from 45deg at 60% 40%, #FF9A86, #FFD6A6, #c0392b, #7A3D1A, #FF9A86)',
    accentColor: '#FFD6A6',
    size: 'small',
  },
  {
    id: 'p4',
    title: 'The Argument She Won',
    subtitle: 'Every single one of them',
    description: 'Painted in the exact shade of the look she gives when she knows she is right — which is always. The brushstrokes are confident. They do not apologise.',
    year: '2024',
    medium: 'Bold strokes, zero compromise',
    gradient: 'linear-gradient(160deg, #c0392b 0%, #e67e22 40%, #FFD6A6 70%, #FFF0BE 100%)',
    accentColor: '#e67e22',
    size: 'wide',
  },
  {
    id: 'p5',
    title: 'Study in Empathy',
    subtitle: 'The way she listens',
    description: 'Most people hear. She listens with her whole body — leaning in, eyes tracking, already thinking about what you need before you finish saying it. This is that quality, made visible.',
    year: '2024',
    medium: 'Soft pastel, genuine attention',
    gradient: 'radial-gradient(circle at 50% 30%, #FFF0BE 0%, #FFD6A6 40%, #FFB399 70%, #7A3D1A 100%)',
    accentColor: '#FFF0BE',
    size: 'medium',
  },
  {
    id: 'p6',
    title: 'The Painter\'s Eye',
    subtitle: 'Self-portrait, unposed',
    description: 'She sees the world differently. Not better or worse — differently. She notices the light on a wall, the colour of a mood, the texture of a moment. This is what the world looks like through her eyes.',
    year: '2025',
    medium: 'Canvas, pigment, perception',
    gradient: 'linear-gradient(45deg, #2D1200 0%, #7A3D1A 25%, #c0392b 50%, #FF9A86 75%, #FFF0BE 100%)',
    accentColor: '#c0392b',
    size: 'large',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  UNFINISHED CANVAS — watercolour word-portrait                               */
/* ─────────────────────────────────────────────────────────────────────────── */

const WORDS = [
  { text: 'painter',      x: 48, y: 22, size: 2.8, opacity: 0.9, color: '#c0392b' },
  { text: 'chaotic',      x: 22, y: 35, size: 1.8, opacity: 0.7, color: '#e67e22' },
  { text: 'beautiful',    x: 65, y: 18, size: 2.2, opacity: 0.85, color: '#FF9A86' },
  { text: 'stubborn',     x: 35, y: 55, size: 1.6, opacity: 0.65, color: '#7A3D1A' },
  { text: 'kind',         x: 72, y: 42, size: 2.0, opacity: 0.8, color: '#FFB399' },
  { text: 'loud',         x: 18, y: 65, size: 1.5, opacity: 0.6, color: '#c0392b' },
  { text: 'honest',       x: 55, y: 70, size: 1.7, opacity: 0.75, color: '#e67e22' },
  { text: 'creative',     x: 80, y: 60, size: 2.4, opacity: 0.88, color: '#FF9A86' },
  { text: 'warm',         x: 30, y: 80, size: 1.9, opacity: 0.72, color: '#FFD6A6' },
  { text: 'fierce',       x: 60, y: 85, size: 1.6, opacity: 0.68, color: '#c0392b' },
  { text: 'curious',      x: 12, y: 48, size: 1.4, opacity: 0.55, color: '#7A3D1A' },
  { text: 'real',         x: 85, y: 30, size: 2.6, opacity: 0.92, color: '#FFB399' },
  { text: 'laughing',     x: 42, y: 42, size: 1.8, opacity: 0.7, color: '#e67e22' },
  { text: 'unstoppable',  x: 25, y: 20, size: 1.5, opacity: 0.6, color: '#FF9A86' },
  { text: 'Stuti',        x: 50, y: 50, size: 4.5, opacity: 1.0, color: '#c0392b' },
  { text: 'artist',       x: 70, y: 75, size: 2.0, opacity: 0.78, color: '#FFD6A6' },
  { text: 'dreamer',      x: 15, y: 82, size: 1.7, opacity: 0.65, color: '#e67e22' },
  { text: 'force',        x: 88, y: 50, size: 1.9, opacity: 0.72, color: '#c0392b' },
  { text: 'light',        x: 40, y: 15, size: 2.1, opacity: 0.82, color: '#FFF0BE' },
  { text: 'whole',        x: 58, y: 32, size: 1.6, opacity: 0.65, color: '#FFB399' },
];

function UnfinishedCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(0); // 0–1
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number>(0);
  const targetReveal = useRef(0);
  const currentReveal = useRef(0);

  /* Smooth lerp toward target */
  useEffect(() => {
    const tick = () => {
      currentReveal.current += (targetReveal.current - currentReveal.current) * 0.04;
      setReveal(currentReveal.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    targetReveal.current = Math.min(targetReveal.current + 0.012, 1);
  }, []);

  const handleScroll = useCallback(() => {
    targetReveal.current = Math.min(targetReveal.current + 0.008, 1);
  }, []);

  /* Each word's visibility = reveal + proximity to mouse */
  const wordVisibility = (word: typeof WORDS[0]) => {
    const dx = word.x - mousePos.x;
    const dy = word.y - mousePos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / 35);
    return Math.min(1, reveal * word.opacity + proximity * 0.6);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onScroll={handleScroll}
      className="relative w-full rounded-3xl overflow-hidden cursor-crosshair select-none"
      style={{
        height: '520px',
        background: 'linear-gradient(135deg, #FFF0BE 0%, #FFD6A6 40%, #FFB399 70%, #FF9A86 100%)',
        border: '1px solid rgba(45,18,0,0.12)',
        boxShadow: '0 8px 40px rgba(45,18,0,0.15), inset 0 0 80px rgba(255,240,190,0.4)',
      }}
    >
      {/* Canvas texture — linen weave via repeating gradient */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(45,18,0,0.5) 0px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(45,18,0,0.5) 0px, transparent 1px, transparent 4px)',
        backgroundSize: '5px 5px',
      }} />

      {/* Watercolour wash blobs — reveal with mouse */}
      {[
        { cx: 30, cy: 35, r: 28, color: 'rgba(192,57,43,0.12)' },
        { cx: 65, cy: 25, r: 22, color: 'rgba(230,126,34,0.10)' },
        { cx: 50, cy: 60, r: 35, color: 'rgba(255,154,134,0.15)' },
        { cx: 20, cy: 70, r: 20, color: 'rgba(122,61,26,0.08)' },
        { cx: 80, cy: 65, r: 25, color: 'rgba(192,57,43,0.09)' },
      ].map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${blob.cx - blob.r}%`,
            top: `${blob.cy - blob.r}%`,
            width: `${blob.r * 2}%`,
            height: `${blob.r * 2}%`,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            opacity: Math.min(1, reveal * 1.5),
            transform: `scale(${0.6 + reveal * 0.4})`,
            transition: 'none',
          }}
        />
      ))}

      {/* Word portrait */}
      {WORDS.map((word, i) => {
        const vis = wordVisibility(word);
        return (
          <div
            key={i}
            className="absolute font-emotional italic pointer-events-none"
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${word.size}rem`,
              color: word.color,
              opacity: vis,
              fontWeight: word.text === 'Stuti' ? 700 : 300,
              textShadow: vis > 0.5 ? `0 2px 12px ${word.color}40` : 'none',
              letterSpacing: word.text === 'Stuti' ? '0.08em' : '0.02em',
              transition: 'none',
            }}
          >
            {word.text}
          </div>
        );
      })}

      {/* Hint text — fades out as canvas reveals */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: Math.max(0, 1 - reveal * 4) }}
      >
        <p className="font-emotional italic text-2xl text-[#7A3D1A]/60 text-center px-8">
          Move your mouse across the canvas...
        </p>
        <p className="font-ui text-xs text-[#7A3D1A]/40 mt-3 tracking-widest uppercase">
          A portrait reveals itself
        </p>
      </div>

      {/* Corner signature */}
      <div
        className="absolute bottom-5 right-6 font-emotional italic text-sm pointer-events-none"
        style={{ color: '#7A3D1A', opacity: Math.min(1, reveal * 2) }}
      >
        — an unfinished portrait, 2025
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PAINTING CARD — the frame on the gallery wall                              */
/* ─────────────────────────────────────────────────────────────────────────── */

function PaintingCard({ painting, index, onClick }: {
  painting: Painting;
  index: number;
  onClick: () => void;
}) {
  const sizeClasses: Record<string, string> = {
    small:  'md:col-span-1 row-span-1',
    medium: 'md:col-span-1 row-span-1',
    large:  'md:col-span-2 row-span-2',
    wide:   'md:col-span-2 row-span-1',
  };

  const heightMap: Record<string, string> = {
    small:  '200px',
    medium: '240px',
    large:  '420px',
    wide:   '200px',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      className={`${sizeClasses[painting.size]} cursor-pointer group`}
      onClick={onClick}
    >
      {/* Frame */}
      <div
        className="relative w-full rounded-sm overflow-hidden"
        style={{
          height: heightMap[painting.size],
          /* Ornate frame effect */
          border: '3px solid rgba(45,18,0,0.25)',
          boxShadow: `
            0 0 0 1px rgba(255,240,190,0.4),
            0 0 0 6px rgba(45,18,0,0.12),
            0 0 0 7px rgba(255,214,166,0.3),
            0 12px 40px rgba(45,18,0,0.35),
            inset 0 0 0 1px rgba(255,240,190,0.2)
          `,
        }}
      >
        {/* The painting itself */}
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: painting.gradient }}
        />

        {/* Varnish sheen */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)',
          }}
        />

        {/* Spotlight from above */}
        <div
          className="absolute inset-x-0 top-0 h-1/3 opacity-30"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,240,190,0.4), transparent)',
          }}
        />

        {/* Title plate — slides up on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'rgba(45,18,0,0.85)' }}
        >
          <p className="font-display text-sm font-semibold text-[#FFF0BE] leading-tight">{painting.title}</p>
          <p className="font-ui text-xs text-[#FFB399] mt-0.5 opacity-80">{painting.medium} · {painting.year}</p>
        </div>
      </div>

      {/* Label below frame */}
      <div className="mt-3 px-1">
        <p className="font-display text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">
          {painting.title}
        </p>
        <p className="font-ui text-xs text-[var(--text-secondary)] mt-0.5">{painting.subtitle}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LIGHTBOX — full painting detail view                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

function Lightbox({ painting, onClose, onPrev, onNext, hasPrev, hasNext }: {
  painting: Painting;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12"
      style={{ background: 'rgba(10,8,6,0.96)' }}
      onClick={onClose}
    >
      {/* Prev */}
      {hasPrev && (
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full
            flex items-center justify-center text-white/60 hover:text-white
            bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full
            flex items-center justify-center text-white/60 hover:text-white
            bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center
          text-white/50 hover:text-white hover:bg-white/15 transition-all"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      <motion.div
        key={painting.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col md:flex-row gap-8 max-w-5xl w-full items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Painting */}
        <div
          className="w-full md:w-[55%] rounded-sm flex-shrink-0"
          style={{
            aspectRatio: painting.size === 'wide' ? '2/1' : '3/4',
            background: painting.gradient,
            border: '4px solid rgba(255,240,190,0.15)',
            boxShadow: `0 0 0 1px rgba(255,240,190,0.08), 0 0 0 8px rgba(45,18,0,0.3), 0 24px 80px rgba(0,0,0,0.8)`,
          }}
        />

        {/* Info */}
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: painting.accentColor }}>
              {painting.year} · {painting.medium}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
              {painting.title}
            </h2>
            <p className="font-emotional italic text-[#FFB399] mt-1">{painting.subtitle}</p>
          </div>

          <div
            className="w-12 h-px"
            style={{ background: `linear-gradient(to right, ${painting.accentColor}, transparent)` }}
          />

          <p className="font-emotional italic text-lg text-white/80 leading-relaxed">
            "{painting.description}"
          </p>

          <p className="font-ui text-xs text-white/30 uppercase tracking-widest">
            From the private collection · stuti.world
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN EXPORT                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

export function ArtGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-16">

      {/* ── Gallery header ── */}
      <div className="text-center flex flex-col gap-3">
        <p className="font-ui text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)]">
          A Private Exhibition
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--text-primary)]">
          The Gallery
        </h1>
        <p className="font-emotional italic text-xl text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Six paintings. One subject. An artist who doesn't know she's the muse.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--accent-primary-start))' }} />
          <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">curated 2025</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--accent-primary-start))' }} />
        </div>
      </div>

      {/* ── Paintings grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 auto-rows-auto">
        {PAINTINGS.map((painting, i) => (
          <PaintingCard
            key={painting.id}
            painting={painting}
            index={i}
            onClick={() => setSelectedIdx(i)}
          />
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-6">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-color))' }} />
        <p className="font-emotional italic text-[var(--text-secondary)] text-sm whitespace-nowrap">
          The Unfinished Canvas
        </p>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--border-color))' }} />
      </div>

      {/* ── Unfinished Canvas ── */}
      <div className="flex flex-col gap-5">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            A Work in Progress
          </h2>
          <p className="font-emotional italic text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
            She is always becoming. Move your mouse across the canvas to reveal the portrait.
          </p>
        </div>
        <UnfinishedCanvas />
        <p className="text-center font-ui text-xs text-[var(--text-secondary)] opacity-60 uppercase tracking-widest">
          The most beautiful things are never finished
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <Lightbox
            painting={PAINTINGS[selectedIdx]}
            onClose={() => setSelectedIdx(null)}
            onPrev={() => setSelectedIdx(i => (i !== null && i > 0 ? i - 1 : i))}
            onNext={() => setSelectedIdx(i => (i !== null && i < PAINTINGS.length - 1 ? i + 1 : i))}
            hasPrev={selectedIdx > 0}
            hasNext={selectedIdx < PAINTINGS.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
