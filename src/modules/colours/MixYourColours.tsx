/**
 * MIX YOUR COLOURS — fully unified canvas implementation.
 * Single canvas handles all rendering AND pointer events.
 * No React state for blob positions — everything lives in a ref
 * so the canvas loop and pointer events are always in sync.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ─── */
const BLOBS_DATA = [
  { id: 'warmth',       label: 'Warmth',       hex: '#FF9A86', r: 255, g: 154, b: 134, trait: 'The way she makes everyone feel at home' },
  { id: 'chaos',        label: 'Chaos',        hex: '#c0392b', r: 192, g: 57,  b: 43,  trait: 'Beautiful, productive, entirely hers' },
  { id: 'creativity',   label: 'Creativity',   hex: '#e67e22', r: 230, g: 126, b: 34,  trait: 'She sees colour where others see grey' },
  { id: 'honesty',      label: 'Honesty',      hex: '#FFD6A6', r: 255, g: 214, b: 166, trait: 'She will tell you the truth, kindly' },
  { id: 'stubbornness', label: 'Stubbornness', hex: '#7A3D1A', r: 122, g: 61,  b: 26,  trait: 'She calls it conviction. She is right.' },
  { id: 'joy',          label: 'Joy',          hex: '#FFF0BE', r: 255, g: 240, b: 190, trait: 'Loud, contagious, completely genuine' },
  { id: 'depth',        label: 'Depth',        hex: '#2D1200', r: 45,  g: 18,  b: 0,   trait: 'There is always more beneath the surface' },
  { id: 'fierceness',   label: 'Fierceness',   hex: '#FFB399', r: 255, g: 179, b: 153, trait: 'She protects what she loves, always' },
];

const SECRETS: { a: string; b: string; message: string; color: string }[] = [
  { a: 'warmth',       b: 'chaos',        message: 'This is exactly what it feels like to know her.', color: '#FF9A86' },
  { a: 'creativity',   b: 'honesty',      message: 'She makes art the way she speaks — without filters.', color: '#e67e22' },
  { a: 'joy',          b: 'depth',        message: 'She laughs the loudest and feels the deepest.', color: '#FFD6A6' },
  { a: 'stubbornness', b: 'warmth',       message: 'She will argue with you and then make sure you are okay.', color: '#c0392b' },
  { a: 'fierceness',   b: 'creativity',   message: 'A painter who fights for every brushstroke.', color: '#FFB399' },
  { a: 'chaos',        b: 'depth',        message: 'The most interesting people always are.', color: '#7A3D1A' },
  { a: 'joy',          b: 'honesty',      message: 'Happy Birthday, Stuti. This one is for you.', color: '#FFF0BE' },
];

interface BlobState {
  id: string;
  label: string;
  hex: string;
  r: number; g: number; b: number;
  trait: string;
  x: number;
  y: number;
  radius: number;
}

interface Secret { a: string; b: string; message: string; color: string }

/* ─────────────────────────────────────────────────────────────────────────── */
/*  THE ULTIMATE CONFESSION                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

const MOMENTS = [
  'When I was at Kedarnath',
  'When I was at Badrinath',
  'When I spotted the leopard family',
  'When I faced death multiple times',
  'When things were seriously terrible',
  'When things went all well',
  'In my best days',
  'In my not so good days',
];

const TEMPLES = [
  'Kedarnath', 'Badrinath', 'Triyambakeshwar',
  'Ujjain', 'Sarangpur', 'Gondal',
  'Ahmedabad', 'Mumbai', 'Gadhda',
];

const CONFESSION_PARAS = [
  "How much do you matter to me? Well, there would have been a parameter to measure how much you matter to me — the scale for measurement would easily break.",
  "I thought about Stuti when...",
  "Where did I pray for you? Every temple I went to...",
  "Every temple I visited still echoes with the prayers of your name. And I feel that is why I found you — that is why I found my Stuti. Despite having 4–5 reasons to doubt upon us, I have infinite reasons to be sure about us. I would always be grateful to two people: one is me, for being here and for the first time in my life stretching, waiting and cherishing every phase. Obviously the second is you — for being there. In my highs and especially in my lows, where I never honestly needed someone, but now it feels as if whenever something terribly wrong happens, it is me who always feels like — rukk, Stuti ne kau.",
  "Thank you for making your importance in my life.",
  "You will always be the person I cherish the most. Always the person whose care would matter to me the most. Because Stuti, it is you who is the person.",
  "Until the very end, Happy Birthday My Love.",
];

function TheUltimateConfession() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={revealed ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      {/* Divider */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-color))' }} />
        <p className="font-emotional italic text-[var(--text-secondary)] text-sm whitespace-nowrap tracking-wide">
          The Ultimate Confession
        </p>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--border-color))' }} />
      </div>

      {/* Letter card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #FFF0BE 0%, #FFD6A6 50%, #FFB399 100%)',
          border: '1px solid rgba(45,18,0,0.12)',
          boxShadow: '0 12px 60px rgba(45,18,0,0.15), inset 0 0 80px rgba(255,240,190,0.5)',
        }}
      >
        {/* Linen texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(45,18,0,1) 0,transparent 1px,transparent 6px),repeating-linear-gradient(90deg,rgba(45,18,0,1) 0,transparent 1px,transparent 6px)',
          backgroundSize: '7px 7px',
        }} />

        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(45,18,0,0.08) 39px, rgba(45,18,0,0.08) 40px)',
          backgroundSize: '100% 40px',
          backgroundPositionY: '60px',
        }} />

        <div className="relative z-10 px-8 md:px-16 py-12 md:py-16 flex flex-col gap-8">

          {/* Opening */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-emotional italic text-2xl md:text-3xl leading-relaxed"
            style={{ color: '#2D1200' }}
          >
            {CONFESSION_PARAS[0]}
          </motion.p>

          {/* I thought about Stuti when... */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col gap-3"
          >
            <p className="font-emotional italic text-xl" style={{ color: '#7A3D1A' }}>
              {CONFESSION_PARAS[1]}
            </p>
            <div className="flex flex-col gap-2 pl-6 border-l-2" style={{ borderColor: '#c0392b' }}>
              {MOMENTS.map((m, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={revealed ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                  className="font-emotional italic text-lg"
                  style={{ color: '#2D1200' }}
                >
                  {m}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Temples */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="flex flex-col gap-3"
          >
            <p className="font-emotional italic text-xl" style={{ color: '#7A3D1A' }}>
              {CONFESSION_PARAS[2]}
            </p>
            <div className="flex flex-wrap gap-2 pl-2">
              {TEMPLES.map((t, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={revealed ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 2.1 + i * 0.09, duration: 0.4 }}
                  className="px-3 py-1 rounded-full text-sm font-medium font-ui"
                  style={{
                    background: 'rgba(192,57,43,0.12)',
                    border: '1px solid rgba(192,57,43,0.3)',
                    color: '#c0392b',
                  }}
                >
                  {t}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={revealed ? { opacity: 1 } : {}}
                transition={{ delay: 3.0, duration: 0.6 }}
                className="font-emotional italic text-lg self-center"
                style={{ color: '#7A3D1A' }}
              >
                ...and every temple in between.
              </motion.span>
            </div>
          </motion.div>

          {/* Main body */}
          {[CONFESSION_PARAS[3], CONFESSION_PARAS[4], CONFESSION_PARAS[5]].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 3.2 + i * 0.5, duration: 0.8 }}
              className="font-emotional italic leading-loose"
              style={{ color: '#2D1200', fontSize: i === 2 ? '1.1rem' : '1.2rem' }}
            >
              {para}
            </motion.p>
          ))}

          {/* Closing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 4.8, duration: 1 }}
            className="pt-6 border-t"
            style={{ borderColor: 'rgba(45,18,0,0.12)' }}
          >
            <p
              className="font-emotional italic text-3xl md:text-4xl font-bold text-right"
              style={{ color: '#c0392b', textShadow: '0 2px 20px rgba(192,57,43,0.2)' }}
            >
              {CONFESSION_PARAS[6]}
            </p>
            <p className="font-emotional italic text-right mt-2 text-lg" style={{ color: '#7A3D1A' }}>
              — Mahavir
            </p>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export function MixYourColours() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const blobsRef    = useRef<BlobState[]>([]);
  const dragRef     = useRef<{ idx: number; ox: number; oy: number } | null>(null);
  const seenRef     = useRef<Set<string>>(new Set());
  const rafRef      = useRef<number>(0);

  const [secret, setSecret]           = useState<Secret | null>(null);
  const [discovered, setDiscovered]   = useState<Secret[]>([]);
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  /* ── Init blobs in a circle ── */
  const initBlobs = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const ringR = Math.min(W, H) * 0.33;
    const RAD = Math.min(W, H) * 0.11;

    blobsRef.current = BLOBS_DATA.map((b, i) => {
      const angle = (i / BLOBS_DATA.length) * Math.PI * 2 - Math.PI / 2;
      return { ...b, x: cx + Math.cos(angle) * ringR, y: cy + Math.sin(angle) * ringR, radius: RAD };
    });
    setInitialized(true);
  }, []);

  /* ── Canvas render loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initBlobs();
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const blobs = blobsRef.current;

      /* Paint blobs with additive-style blending */
      ctx.globalCompositeOperation = 'source-over';
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        g.addColorStop(0,    `rgba(${b.r},${b.g},${b.b},0.82)`);
        g.addColorStop(0.45, `rgba(${b.r},${b.g},${b.b},0.45)`);
        g.addColorStop(0.75, `rgba(${b.r},${b.g},${b.b},0.18)`);
        g.addColorStop(1,    `rgba(${b.r},${b.g},${b.b},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Draw blend zones where blobs overlap */
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i], b = blobs[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const overlap = a.radius * 0.7 + b.radius * 0.7 - dist;
          if (overlap > 0) {
            /* Blend colour at midpoint */
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const blendR = Math.round((a.r + b.r) / 2);
            const blendG = Math.round((a.g + b.g) / 2);
            const blendB = Math.round((a.b + b.b) / 2);
            const blendAlpha = Math.min(0.7, overlap / (a.radius * 0.5));
            const blendRad = overlap * 0.8;
            const bg = ctx.createRadialGradient(mx, my, 0, mx, my, blendRad);
            bg.addColorStop(0,   `rgba(${blendR},${blendG},${blendB},${blendAlpha})`);
            bg.addColorStop(1,   `rgba(${blendR},${blendG},${blendB},0)`);
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.arc(mx, my, blendRad, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* Labels */
      ctx.globalCompositeOperation = 'source-over';
      for (const b of blobs) {
        const isDark = b.r < 100 || (b.r < 150 && b.g < 100);
        ctx.font = `bold 12px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        /* Shadow for readability */
        ctx.shadowColor = isDark ? 'rgba(255,240,190,0.6)' : 'rgba(45,18,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = isDark ? '#FFF0BE' : '#2D1200';
        ctx.fillText(b.label, b.x, b.y);
        ctx.shadowBlur = 0;
      }

      /* Check secrets */
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i], b = blobs[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          /* Trigger when centres are within 55% of combined radii */
          if (dist < (a.radius + b.radius) * 0.55) {
            const key = [a.id, b.id].sort().join('|');
            if (!seenRef.current.has(key)) {
              const s = SECRETS.find(
                s => (s.a === a.id && s.b === b.id) || (s.a === b.id && s.b === a.id)
              );
              if (s) {
                seenRef.current.add(key);
                setSecret(s);
                setDiscovered(prev => [...prev, s]);
                setTimeout(() => setSecret(null), 5000);
              }
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initBlobs]);

  /* ── Pointer events directly on canvas ── */
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getPos(e);
    const blobs = blobsRef.current;
    /* Find topmost blob under cursor (reverse order = top first) */
    for (let i = blobs.length - 1; i >= 0; i--) {
      const b = blobs[i];
      const dx = x - b.x, dy = y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < b.radius * 0.75) {
        dragRef.current = { idx: i, ox: dx, oy: dy };
        canvasRef.current!.setPointerCapture(e.pointerId);
        break;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const { x, y } = getPos(e);
    const { idx, ox, oy } = dragRef.current;
    const canvas = canvasRef.current!;
    const b = blobsRef.current[idx];
    /* Clamp within canvas */
    b.x = Math.max(b.radius * 0.3, Math.min(canvas.width  - b.radius * 0.3, x - ox));
    b.y = Math.max(b.radius * 0.3, Math.min(canvas.height - b.radius * 0.3, y - oy));
  };

  const onPointerUp = () => { dragRef.current = null; };

  const reset = () => {
    seenRef.current.clear();
    setDiscovered([]);
    setSecret(null);
    initBlobs();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 flex flex-col gap-8">

      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <p className="font-ui text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)]">
          An Interactive Experience
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--text-primary)]">
          Mix Your Colours
        </h1>
        <p className="font-emotional italic text-xl text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Every colour is a part of her. Drag them together — some combinations reveal something hidden.
        </p>
      </div>

      {/* Colour legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {BLOBS_DATA.map(b => (
          <motion.button
            key={b.id}
            onHoverStart={() => setHoveredTrait(b.id)}
            onHoverEnd={() => setHoveredTrait(null)}
            whileHover={{ scale: 1.06, y: -2 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: `rgba(${b.r},${b.g},${b.b},0.18)`,
              borderColor: `rgba(${b.r},${b.g},${b.b},0.5)`,
              color: 'var(--text-primary)',
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.hex }} />
            {b.label}
          </motion.button>
        ))}
      </div>

      {/* Trait tooltip */}
      <AnimatePresence>
        {hoveredTrait && (
          <motion.p
            key={hoveredTrait}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center font-emotional italic text-lg text-[var(--text-secondary)] -mt-4"
          >
            "{BLOBS_DATA.find(b => b.id === hoveredTrait)?.trait}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          height: '460px',
          background: 'linear-gradient(135deg, #FFF0BE 0%, #FFD6A6 55%, #FFB399 100%)',
          border: '1px solid rgba(45,18,0,0.12)',
          boxShadow: '0 8px 40px rgba(45,18,0,0.12)',
        }}
      >
        {/* Linen texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(45,18,0,1) 0,transparent 1px,transparent 6px),repeating-linear-gradient(90deg,rgba(45,18,0,1) 0,transparent 1px,transparent 6px)',
          backgroundSize: '7px 7px',
        }} />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {/* Hint — only before first drag */}
        {initialized && discovered.length === 0 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
            <p className="font-ui text-xs text-[#7A3D1A]/50 uppercase tracking-widest">
              Drag the colours together to mix them
            </p>
          </div>
        )}

        {/* Reset */}
        <button
          onClick={reset}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium border hover:scale-105 transition-transform"
          style={{ background: 'rgba(255,240,190,0.85)', borderColor: 'rgba(45,18,0,0.15)', color: '#7A3D1A' }}
        >
          Reset
        </button>

        {/* Progress */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium border"
          style={{ background: 'rgba(255,240,190,0.85)', borderColor: 'rgba(45,18,0,0.15)', color: '#7A3D1A' }}>
          {discovered.length} / {SECRETS.length} secrets
        </div>
      </div>

      {/* Secret message */}
      <AnimatePresence mode="wait">
        {secret && (
          <motion.div
            key={secret.a + secret.b}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="mx-auto max-w-lg w-full rounded-2xl p-6 text-center"
            style={{
              background: `${secret.color}22`,
              border: `1.5px solid ${secret.color}55`,
              boxShadow: `0 8px 32px ${secret.color}25`,
            }}
          >
            <p className="font-ui text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: secret.color }}>
              Hidden message revealed
            </p>
            <p className="font-emotional italic text-2xl text-[var(--text-primary)] leading-relaxed">
              "{secret.message}"
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-3 h-3 rounded-full" style={{ background: BLOBS_DATA.find(b => b.id === secret.a)?.hex }} />
              <span className="font-ui text-xs text-[var(--text-secondary)]">
                {BLOBS_DATA.find(b => b.id === secret.a)?.label}
                {' + '}
                {BLOBS_DATA.find(b => b.id === secret.b)?.label}
              </span>
              <span className="w-3 h-3 rounded-full" style={{ background: BLOBS_DATA.find(b => b.id === secret.b)?.hex }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovered log */}
      {discovered.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-ui text-xs uppercase tracking-widest text-center text-[var(--text-secondary)]">
            Discovered
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {discovered.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ background: `${s.color}18`, borderColor: `${s.color}45`, color: 'var(--text-primary)' }}
              >
                {BLOBS_DATA.find(b => b.id === s.a)?.label} + {BLOBS_DATA.find(b => b.id === s.b)?.label}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── The Ultimate Confession ── */}
      <TheUltimateConfession />

    </div>
  );
}
