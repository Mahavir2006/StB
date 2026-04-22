import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Highly optimized, zero-dependency canvas background algorithm.
 * Replaces heavy 'tsparticles' and 'react-three-fiber' libraries.
 * Handles both light and dark themes efficiently using native RequestAnimationFrame
 * and batch path drawing.
 */
export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    let animationFrameId: number;
    let resizeObserver: ResizeObserver;

    const isDark = theme === 'dark';
    const particleCount = isDark ? 40 : 20; // Fewer particles for light mode, aesthetic choice
    
    // Theme-based fluid color
    const baseColor = isDark ? '167, 139, 250' : '230, 126, 34'; 

    const initParticles = () => {
      particles = Array.from({ length: particleCount }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * (isDark ? 1.5 : 2.5) + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
      }
    };

    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Batch drawing for performance
      ctx.fillStyle = `rgba(${baseColor}, 1)`;
      ctx.beginPath();
      
      for (const p of particles) {
        // Move
        p.x += p.dx;
        p.y += p.dy;
        
        // Wrap edges smoothly
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Pause animation when not visible to save CPU
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    
    resizeObserver = new ResizeObserver(() => {
      // Debounce slightly if resizing
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
      resizeObserver.disconnect();
    };
  }, [theme]);

  // Contain layout and tell browser to keep on same layer
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        contain: 'strict',
        opacity: theme === 'dark' ? 0.6 : 0.3
      }}
    />
  );
}
