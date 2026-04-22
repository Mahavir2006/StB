import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function NativeParticleText({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- 1. Generate text targets ---
    const textCanvas = document.createElement('canvas');
    const tCtx = textCanvas.getContext('2d', { willReadFrequently: true });
    if (!tCtx) return;
    
    textCanvas.width = width;
    textCanvas.height = height;
    tCtx.fillStyle = 'white';
    // Use a bold font to get blocky, dense particles
    const fontSize = Math.min(width * 0.25, 200);
    tCtx.font = `900 ${fontSize}px sans-serif`;
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText('STUTI', width / 2, height / 2);

    const imgData = tCtx.getImageData(0, 0, width, height).data;
    const targets: { x: number; y: number }[] = [];
    
    // Sample every 4th pixel to save math, keeping dense enough resolution
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const i = (y * width + x) * 4;
        const a = imgData[i + 3];
        if (a > 128) {
          targets.push({ x, y });
        }
      }
    }

    // --- 2. Initialize Particles ---
    const particleCount = 2000;
    const particles = Array.from({ length: particleCount }).map(() => {
      // Pick a random target from the text shape
      const target = targets.length > 0 
          ? targets[Math.floor(Math.random() * targets.length)] 
          : { x: width/2, y: height/2 };

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        targetX: target.x,
        targetY: target.y,
        size: Math.random() * 2 + 1,
        vx: 0,
        vy: 0,
      };
    });

    let phase: 'scatter' | 'gather' | 'explode' = 'scatter';
    
    // Timings
    const t1 = setTimeout(() => { phase = 'gather'; }, 800);
    const t2 = setTimeout(() => { phase = 'explode'; }, 3000);
    const t3 = setTimeout(() => { onComplete(); }, 3500);

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#a78bfa'; // Matches our accent purple
      ctx.beginPath();

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        if (phase === 'scatter') {
          // Drift slowly like stars
          p.x += (Math.random() - 0.5) * 0.5;
          p.y += (Math.random() - 0.5) * 0.5;
        } else if (phase === 'gather') {
          // Snap tightly to the target text shape
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.vx += dx * 0.02;     // spring
          p.vy += dy * 0.02;
          p.vx *= 0.85;          // friction
          p.vy *= 0.85;
          
          p.x += p.vx;
          p.y += p.vy;
          
          // Slight wobble to keep it feeling alive
          p.x += (Math.random() - 0.5) * 1.5;
          p.y += (Math.random() - 0.5) * 1.5;
        } else if (phase === 'explode') {
          // Explode outwards rapidly
          const cx = width / 2;
          const cy = height / 2;
          const angle = Math.atan2(p.y - cy, p.x - cx);
          p.vx += Math.cos(angle) * 5;
          p.vy += Math.sin(angle) * 5;
          
          p.x += p.vx;
          p.y += p.vy;
        }

        // We use rect instead of arc for massive perf boost on 2000 items
        ctx.rect(p.x, p.y, p.size, p.size);
      }
      
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function ParticleIntro({ onFinished }: { onFinished: () => void }) {
  const [showHappyBirthday, setShowHappyBirthday] = useState(false);
  const [done, setDone] = useState(false);

  const handleSkip = () => {
    setDone(true);
    setTimeout(onFinished, 500);
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-black text-white overflow-hidden flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Skip Button */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5 }}
            onClick={handleSkip}
            className="absolute bottom-10 right-10 text-sm font-ui border-b border-white/20 pb-0.5 hover:opacity-100 z-50 cursor-pointer"
          >
            Skip Intro
          </motion.button>

          {/* High-Performance Native Canvas Instead of WebGL */}
          <div className="absolute inset-0 pointer-events-none">
             <NativeParticleText onComplete={() => setShowHappyBirthday(true)} />
          </div>

          <AnimatePresence>
            {showHappyBirthday && (
              <motion.h1 
                className="text-7xl md:text-9xl font-display font-bold text-center z-10 leading-tight"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    handleSkip();
                  }, 1800);
                }}
              >
                <span className="text-gradient block">Happy</span>
                <span className="text-white block mt-2">Birthday</span>
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
