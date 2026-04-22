import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  vx: number;
  vy: number;
  isBokeh: boolean;
  driftX: number;
  driftY: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

function NativeParticleText({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // false for performance on full bg redraws
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- 1. Pre-render Glowing Textures ---
    const createParticleTexture = (radius: number, coreColor: string, haloColor: string) => {
      const c = document.createElement('canvas');
      c.width = radius * 2;
      c.height = radius * 2;
      const xCtx = c.getContext('2d');
      if (xCtx) {
        const grad = xCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        grad.addColorStop(0, coreColor);
        grad.addColorStop(0.2, haloColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)'); // Transparent outer edges
        xCtx.fillStyle = grad;
        xCtx.beginPath();
        xCtx.arc(radius, radius, radius, 0, Math.PI * 2);
        xCtx.fill();
      }
      return c;
    };

    // Sharp Astrophage Organsims: blinding white core, intense red-crimson aura
    const sharpTexture = createParticleTexture(8, 'rgba(255, 255, 255, 1)', 'rgba(255, 20, 20, 0.8)');
    // Out-of-focus background cells (Bokeh) - extremely faint to add depth without clogging legibility
    const bokehTexture = createParticleTexture(64, 'rgba(255, 50, 50, 0.25)', 'rgba(100, 10, 10, 0.05)');

    // --- 2. Generate text targets ---
    const textCanvas = document.createElement('canvas');
    const tCtx = textCanvas.getContext('2d', { willReadFrequently: true });
    if (!tCtx) return;
    
    textCanvas.width = width;
    textCanvas.height = height;
    tCtx.fillStyle = 'white';
    
    // MASSIVE imposing font to ensure perfect legibility when formed by particles
    const fontSize = Math.min(width * 0.35, 450);
    // Use an ultra-black weight to give a thick surface area for the swarm
    tCtx.font = `900 ${fontSize}px "Inter", sans-serif`; 
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.letterSpacing = '10px';
    tCtx.fillText('STUTI', width / 2, height / 2);

    const imgData = tCtx.getImageData(0, 0, width, height).data;
    const targets: { x: number; y: number }[] = [];
    
    // Sample densely to form perfect, solid crisp boundaries
    const sampleStep = window.innerWidth > 768 ? 4 : 3; 
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const i = (y * width + x) * 4;
        // Strict alpha threshold for exact letter edges
        if (imgData[i + 3] > 150) {
          targets.push({ x, y });
        }
      }
    }

    // --- 3. Initialize Astrophage Swarm ---
    // Massive particle swarm for density
    const particleCount = Math.min(targets.length, window.innerWidth > 768 ? 4000 : 2000);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const target = targets.length > 0 
          ? targets[Math.floor(Math.random() * targets.length)] 
          : { x: width/2, y: height/2 };

      // Only exactly 3% bokeh so they look like massive deep-space entities passing, without muddying the text
      const isBokeh = Math.random() > 0.97;
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: target.x,
        targetY: target.y,
        // Sharp particles stay incredibly tiny so the swarm resolution is ultra-high definition
        size: isBokeh ? Math.random() * 40 + 15 : Math.random() * 2 + 0.5,
        vx: 0,
        vy: 0,
        isBokeh,
        driftX: (Math.random() - 0.5) * (isBokeh ? 0.3 : 1.0), 
        driftY: (Math.random() - 0.5) * (isBokeh ? 0.3 : 1.0),
        wobbleSpeed: Math.random() * 0.04 + 0.01,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    let phase: 'scatter' | 'gather' | 'explode' = 'scatter';
    let time = 0;
    
    // Slowed down timings to match a cinematic deep space vibe
    const t1 = setTimeout(() => { phase = 'gather'; }, 1500);  // Drifting in space
    const t2 = setTimeout(() => { phase = 'explode'; }, 7000); // Hold the text
    const t3 = setTimeout(() => { onComplete(); }, 8500);      // Explode outwards

    let animationFrameId: number;

    const draw = () => {
      time++;
      
      // Standard composite logic for clearing background
      ctx.globalCompositeOperation = 'source-over';
      // Fill deep dark space, wiping motion trails smoothly
      ctx.fillStyle = 'rgba(5, 0, 0, 0.4)'; 
      ctx.fillRect(0, 0, width, height);

      // ADDITIVE BLENDING: This is the secret magic for glowing sci-fi energy
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        if (phase === 'scatter') {
          p.x += p.driftX;
          p.y += p.driftY;
          p.x += Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.3;
          p.y += Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * 0.3;
          
        } else if (phase === 'gather') {
          // Extremely slow organic swarm homing
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          
          p.vx += dx * 0.002; 
          p.vy += dy * 0.002;
          p.vx *= 0.94; // Thick fluid friction
          p.vy *= 0.94;
          
          p.x += p.vx;
          p.y += p.vy;
          
          // Organic vibration
          p.x += Math.sin(time * p.wobbleSpeed * 2.5 + p.wobbleOffset) * 0.6;
          p.y += Math.cos(time * p.wobbleSpeed * 2.5 + p.wobbleOffset) * 0.6;
          
        } else if (phase === 'explode') {
          const cx = width / 2;
          const cy = height / 2;
          const angle = Math.atan2(p.y - cy, p.x - cx);
          
          // Blast force varies to create depth during explosion
          const blastForce = p.isBokeh ? 3 : 8 + Math.random() * 10;
          p.vx += Math.cos(angle) * blastForce;
          p.vy += Math.sin(angle) * blastForce;
          
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Extremely fast blitting from off-screen canvases!
        const img = p.isBokeh ? bokehTexture : sharpTexture;
        ctx.drawImage(img, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      }

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
          className="fixed inset-0 z-[9999] bg-[#050000] text-white overflow-hidden flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {/* Skip Button */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2.5 }}
            onClick={handleSkip}
            className="absolute bottom-10 right-10 text-xs font-ui tracking-[0.2em] uppercase border-b border-white/20 pb-0.5 hover:opacity-100 z-50 cursor-pointer text-[#ff8080]"
          >
            Skip Intro
          </motion.button>

          {/* High-Performance Canvas Swarm */}
          <div className="absolute inset-0 pointer-events-none">
             <NativeParticleText onComplete={() => setShowHappyBirthday(true)} />
          </div>

          <AnimatePresence>
            {showHappyBirthday && (
              <motion.h1 
                className="text-7xl md:text-9xl font-display font-medium text-center z-10 leading-tight tracking-wide"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(30px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(15px)' }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    handleSkip();
                  }, 2500);
                }}
              >
                <span className="text-white block" style={{ textShadow: '0 0 40px rgba(220, 20, 20, 0.8)' }}>Happy</span>
                <span className="text-[#ff4d4d] block mt-2" style={{ textShadow: '0 0 40px rgba(255, 60, 60, 0.6)' }}>Birthday</span>
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
