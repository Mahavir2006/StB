import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        alpha: Math.random(),
        speed: 0.002 + Math.random() * 0.005,
      });
    }

    let animId: number;
    const draw = () => {
      if (document.hidden) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,154,134,${s.alpha * 0.8})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const LETTERS = ['S', 'T', 'U', 'T', 'I'];

export function FinaleScene() {
  const [fired, setFired] = useState(false);

  const handleFireworks = () => {
    setFired(true);

    const colors = ['#FF9A86', '#FFB399', '#FFD6A6', '#ffffff', '#c0392b'];

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...opts,
        origin: { y: 0.7 },
        colors,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => {
      fire(0.3, { spread: 80, startVelocity: 60 });
      fire(0.2, { spread: 120 });
    }, 600);

    setTimeout(() => setFired(false), 4000);
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden py-16">
      <StarField />

      {/* Aurora blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-primary-start) 15%, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-secondary-start) 15%, transparent)' }} />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center px-4">
        {/* STUTI constellation */}
        <div className="flex items-center gap-3 md:gap-6">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="text-6xl md:text-9xl font-display font-bold text-transparent bg-clip-text
                bg-gradient-to-b from-white to-[var(--accent-primary-start)]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 100, damping: 12 }}
              style={{
                textShadow: '0 0 40px rgba(255,154,134,0.6)',
                filter: 'drop-shadow(0 0 20px rgba(255,179,153,0.5))',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="text-2xl md:text-3xl font-emotional italic text-[var(--text-primary)]/90 leading-relaxed">
            "She is not just a person. She is a whole universe —
            chaotic, beautiful, and entirely her own."
          </p>
          <footer className="mt-4 font-bold tracking-widest text-sm uppercase" style={{ color: 'var(--accent-primary-start)' }}>
            Happy Birthday
          </footer>
        </motion.blockquote>

        {/* CTA Button */}
        <motion.button
          onClick={handleFireworks}
          disabled={fired}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-10 py-4 rounded-full text-white font-bold text-lg
            bg-gradient-to-r from-[var(--accent-primary-start)] via-[var(--accent-highlight)] to-[var(--accent-secondary-start)]
            shadow-[0_0_40px_rgba(255,154,134,0.5)] disabled:opacity-70 disabled:cursor-not-allowed
            overflow-hidden group"
        >
          <span className="relative z-10">
            {fired ? 'Celebrating...' : 'Send Her Love'}
          </span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>

        {/* Decorative stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex gap-4 text-2xl"
          style={{ color: 'var(--accent-primary-start)' }}
        >
          {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
