/**
 * MIX YOUR COLOURS
 * Drag colour blobs onto the canvas. They blend together.
 * Each colour = a trait of Stuti's.
 * Specific combinations reveal hidden messages.
 * Pure canvas + pointer events — zero external deps.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DATA                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

interface ColourBlob {
  id: string;
  label: string;
  color: string;       // hex
  r: number;           // g: number;           // b: number;           // rgb components
  g: number;
  b: number;
  trait: string;
}

const BLOBS: ColourBlob[] = [
  { id: 'warmth',      label: 'Warmth',      color: '#FF9A86', r: 255, g: 154, b: 134, trait: 'The way she makes everyone feel at home' },
  { id: 'chaos',       label: 'Chaos',       color: '#c0392b', r: 192, g: 57,  b: 43,  trait: 'Beautiful, productive, entirely hers' },
  { id: 'creativity',  label: 'Creativity',  color: '#e67e22', r: 230, g: 126, b: 34,  trait: 'She sees colour where others see grey' },
  { id: 'honesty',     label: 'Honesty',     color: '#FFD6A6', r: 255, g: 214, b: 166, trait: 'She will tell you the truth, kindly' },
  { id: 'stubbornness',label: 'Stubbornness',color: '#7A3D1A', r: 122, g: 61,  b: 26,  trait: 'She calls it conviction. She is right.' },
  { id: 'joy',         label: 'Joy',         color: '#FFF0BE', r: 255, g: 240, b: 190, trait: 'Loud, contagious, completely genuine' },
  { id: 'depth',       label: 'Depth',       color: '#2D1200', r: 45,  g: 18,  b: 0,   trait: 'There is always more beneath the surface' },
  { id: 'fierceness',  label: 'Fierceness',  color: '#FFB399', r: 255, g: 179, b: 153, trait: 'She protects what she loves, always' },
];

/* Hidden messages — triggered when two specific blobs overlap on canvas */
interface SecretMessage {
  a: string;
  b: string;
  message: string;
  color: string;
}

const SECRETS: SecretMessage[] = [
  { a: 'warmth',       b: 'chaos',       message: 'This is exactly what it feels like to know her.', color: '#FF9A86' },
  { a: 'creativity',   b: 'honesty',     message: 'She makes art the way she speaks — without filters.', color: '#e67e22' },
  { a: 'joy',          b: 'depth',       message: 'She laughs the loudest and feels the deepest.', color: '#FFD6A6' },
  { a: 'stubbornness', b: 'warmth',      message: 'She will argue with you and then make sure you are okay.', color: '#c0392b' },
  { a: 'fierceness',   b: 'creativity',  message: 'A painter who fights for every brushstroke.', color: '#FFB399' },
  { a: 'chaos',        b: 'depth',       message: 'The most interesting people always are.', color: '#7A3D1A' },
  { a: 'joy',          b: 'honesty',     message: 'Happy Birthday, Stuti. This one is for you.', color: '#FFF0BE' },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CANVAS ENGINE                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

interface CanvasBlob {
  id: string;
  x: number;
  y: number;
  radius: number;
  r: number; g: number; b: number;
  label: string;
  vx: number; vy: number;   // gentle drift
}

function MixCanvas({
  blobs,
  onSecret,
}: {
  blobs: CanvasBlob[];
  onSecret: (msg: SecretMessage) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef  = useRef<CanvasBlob[]>(blobs);
  const rafRef    = useRef<number>(0);
  const seenRef   = useRef<Set<string>>(new Set());

  // Keep ref in sync
  useEffect(() => { blobsRef.current = blobs; }, [blobs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const bs = blobsRef.current;

      // Draw each blob as a radial gradient (watercolour feel)
      for (const b of bs) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0,   `rgba(${b.r},${b.g},${b.b},0.75)`);
        grad.addColorStop(0.5, `rgba(${b.r},${b.g},${b.b},0.35)`);
        grad.addColorStop(1,   `rgba(${b.r},${b.g},${b.b},0)`);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = `600 13px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(${b.r > 200 ? 45 : 255},${b.r > 200 ? 18 : 240},${b.r > 200 ? 0 : 190},0.9)`;
        ctx.fillText(b.label, b.x, b.y + 5);
      }

      // Check overlaps → secrets
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], b = bs[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const overlap = (a.radius * 0.6 + b.radius * 0.6) - dist;
          if (overlap > 40) {
            const key = [a.id, b.id].sort().join('|');
            if (!seenRef.current.has(key)) {
              const secret = SECRETS.find(
                s => (s.a === a.id && s.b === b.id) || (s.a === b.id && s.b === a.id)
              );
              if (secret) {
                seenRef.current.add(key);
                onSecret(secret);
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
  }, [onSecret]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DRAGGABLE BLOB OVERLAY                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

function DraggableBlob({
  blob,
  containerRef,
  onMove,
}: {
  blob: CanvasBlob;
  containerRef: React.RefObject<HTMLDivElement>;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const dragging = useRef(false);
  const offset   = useRef({ x: 0, y: 0 });

  const getXY = (e: PointerEvent | React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: blob.x, y: blob.y };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    const pos = getXY(e);
    offset.current = { x: pos.x - blob.x, y: pos.y - blob.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const pos = getXY(e);
    onMove(blob.id, pos.x - offset.current.x, pos.y - offset.current.y);
  };

  const onPointerUp = () => { dragging.current = false; };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing select-none"
      style={{
        left: blob.x - 36,
        top:  blob.y - 36,
        width: 72,
        height: 72,
        background: `radial-gradient(circle, rgba(${blob.r},${blob.g},${blob.b},0.9) 0%, rgba(${blob.r},${blob.g},${blob.b},0.4) 100%)`,
        border: `2px solid rgba(${blob.r},${blob.g},${blob.b},0.6)`,
        boxShadow: `0 4px 20px rgba(${blob.r},${blob.g},${blob.b},0.4)`,
        touchAction: 'none',
        zIndex: 10,
      }}
    >
      <span
        className="font-ui text-[10px] font-bold text-center leading-tight px-1"
        style={{ color: blob.r > 200 ? '#2D1200' : '#FFF0BE' }}
      >
        {blob.label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

export function MixYourColours() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasBlobs, setCanvasBlobs] = useState<CanvasBlob[]>([]);
  const [secret, setSecret] = useState<SecretMessage | null>(null);
  const [secretHistory, setSecretHistory] = useState<SecretMessage[]>([]);
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);

  // Place blobs in a circle when container mounts
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth || 600;
    const h = el.clientHeight || 400;
    const cx = w / 2, cy = h / 2;
    const r  = Math.min(w, h) * 0.32;

    setCanvasBlobs(BLOBS.map((b, i) => {
      const angle = (i / BLOBS.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id:     b.id,
        label:  b.label,
        x:      cx + Math.cos(angle) * r,
        y:      cy + Math.sin(angle) * r,
        radius: 90,
        r: b.r, g: b.g, b: b.b,
        vx: 0, vy: 0,
      };
    }));
  }, []);

  const handleMove = useCallback((id: string, x: number, y: number) => {
    setCanvasBlobs(prev => prev.map(b => b.id === id ? { ...b, x, y } : b));
  }, []);

  const handleSecret = useCallback((msg: SecretMessage) => {
    setSecret(msg);
    setSecretHistory(prev => prev.find(s => s.a === msg.a && s.b === msg.b) ? prev : [...prev, msg]);
    setTimeout(() => setSecret(null), 4000);
  }, []);

  const reset = () => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth || 600;
    const h = el.clientHeight || 400;
    const cx = w / 2, cy = h / 2;
    const r  = Math.min(w, h) * 0.32;
    setCanvasBlobs(BLOBS.map((b, i) => {
      const angle = (i / BLOBS.length) * Math.PI * 2 - Math.PI / 2;
      return { id: b.id, label: b.label, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, radius: 90, r: b.r, g: b.g, b: b.b, vx: 0, vy: 0 };
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 flex flex-col gap-10">

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
      <div className="flex flex-wrap gap-3 justify-center">
        {BLOBS.map(b => (
          <motion.button
            key={b.id}
            onHoverStart={() => setHoveredTrait(b.id)}
            onHoverEnd={() => setHoveredTrait(null)}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              background: `rgba(${b.r},${b.g},${b.b},0.15)`,
              borderColor: `rgba(${b.r},${b.g},${b.b},0.4)`,
              color: 'var(--text-primary)',
            }}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: b.color }}
            />
            {b.label}
          </motion.button>
        ))}
      </div>

      {/* Trait tooltip */}
      <AnimatePresence>
        {hoveredTrait && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center -mt-6"
          >
            <p className="font-emotional italic text-lg text-[var(--text-secondary)]">
              "{BLOBS.find(b => b.id === hoveredTrait)?.trait}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          height: '480px',
          background: 'linear-gradient(135deg, #FFF0BE 0%, #FFD6A6 60%, #FFB399 100%)',
          border: '1px solid rgba(45,18,0,0.12)',
          boxShadow: '0 8px 40px rgba(45,18,0,0.12), inset 0 0 60px rgba(255,240,190,0.3)',
        }}
      >
        {/* Linen texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(45,18,0,0.8) 0px, transparent 1px, transparent 5px), repeating-linear-gradient(90deg, rgba(45,18,0,0.8) 0px, transparent 1px, transparent 5px)',
          backgroundSize: '6px 6px',
        }} />

        {/* Canvas paint layer */}
        {canvasBlobs.length > 0 && (
          <MixCanvas blobs={canvasBlobs} onSecret={handleSecret} />
        )}

        {/* Draggable handles */}
        {canvasBlobs.map(blob => (
          <DraggableBlob
            key={blob.id}
            blob={blob}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
            onMove={handleMove}
          />
        ))}

        {/* Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="font-ui text-xs text-[#7A3D1A]/50 uppercase tracking-widest whitespace-nowrap">
            Drag the colours together
          </p>
        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105"
          style={{
            background: 'rgba(255,240,190,0.8)',
            borderColor: 'rgba(45,18,0,0.15)',
            color: '#7A3D1A',
          }}
        >
          Reset
        </button>
      </div>

      {/* Secret message toast */}
      <AnimatePresence>
        {secret && (
          <motion.div
            key={secret.a + secret.b}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mx-auto max-w-lg rounded-2xl p-6 text-center"
            style={{
              background: `rgba(${BLOBS.find(b => b.id === secret.a)?.r ?? 255},${BLOBS.find(b => b.id === secret.a)?.g ?? 154},${BLOBS.find(b => b.id === secret.a)?.b ?? 134},0.15)`,
              border: `1px solid ${secret.color}40`,
              boxShadow: `0 8px 32px ${secret.color}20`,
            }}
          >
            <p className="font-ui text-xs uppercase tracking-widest mb-3" style={{ color: secret.color }}>
              A hidden message revealed
            </p>
            <p className="font-emotional italic text-2xl text-[var(--text-primary)] leading-relaxed">
              "{secret.message}"
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-3 h-3 rounded-full" style={{ background: BLOBS.find(b => b.id === secret.a)?.color }} />
              <span className="font-ui text-xs text-[var(--text-secondary)]">
                {BLOBS.find(b => b.id === secret.a)?.label} + {BLOBS.find(b => b.id === secret.b)?.label}
              </span>
              <span className="w-3 h-3 rounded-full" style={{ background: BLOBS.find(b => b.id === secret.b)?.color }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovered secrets log */}
      {secretHistory.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-ui text-xs uppercase tracking-widest text-center text-[var(--text-secondary)]">
            Discovered — {secretHistory.length} of {SECRETS.length}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {secretHistory.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  background: `${s.color}18`,
                  borderColor: `${s.color}40`,
                  color: 'var(--text-primary)',
                }}
              >
                {BLOBS.find(b => b.id === s.a)?.label} + {BLOBS.find(b => b.id === s.b)?.label}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
