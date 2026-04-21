/**
 * CyberneticGrid — pure CSS animated grid background.
 * Zero JS animation loop, zero WebGL, zero Three.js.
 * Visually matches the original: dark grid with blue lines + pink energy pulses.
 * GPU-composited via CSS animations on transform/opacity only.
 */

export default function CyberneticGridShader() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#050510',
      }}
    >
      <style>{`
        @keyframes cgrid-pulse {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.38; }
        }
        @keyframes cgrid-energy-h {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes cgrid-energy-v {
          0%   { transform: translateX(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        @keyframes cgrid-glow {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50%       { opacity: 0.6; transform: scale(1.2); }
        }
        .cgrid-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(30,120,255,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,120,255,0.18) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: cgrid-pulse 4s ease-in-out infinite;
          will-change: opacity;
        }
        .cgrid-grid-fine {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(30,120,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,120,255,0.07) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .cgrid-energy-h {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f472b6, #a78bfa, transparent);
          will-change: transform, opacity;
        }
        .cgrid-energy-v {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, #38bdf8, #a78bfa, transparent);
          will-change: transform, opacity;
        }
        .cgrid-glow {
          position: absolute;
          border-radius: 50%;
          will-change: opacity, transform;
        }
      `}</style>

      {/* Base grid layers */}
      <div className="cgrid-grid-fine" />
      <div className="cgrid-grid" />

      {/* Horizontal energy sweeps */}
      {[
        { top: '15%', duration: '6s', delay: '0s'   },
        { top: '42%', duration: '8s', delay: '2.5s' },
        { top: '68%', duration: '7s', delay: '4.8s' },
        { top: '85%', duration: '9s', delay: '1.2s' },
      ].map((s, i) => (
        <div
          key={`h${i}`}
          className="cgrid-energy-h"
          style={{
            top: s.top,
            animation: `cgrid-energy-h ${s.duration} linear ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Vertical energy sweeps */}
      {[
        { left: '20%', duration: '7s',  delay: '1s'   },
        { left: '55%', duration: '10s', delay: '3.5s' },
        { left: '78%', duration: '8s',  delay: '0.5s' },
      ].map((s, i) => (
        <div
          key={`v${i}`}
          className="cgrid-energy-v"
          style={{
            left: s.left,
            animation: `cgrid-energy-v ${s.duration} linear ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Intersection glow nodes */}
      {[
        { top: '15%', left: '20%', size: 120, duration: '4s', delay: '0s'   },
        { top: '42%', left: '55%', size: 160, duration: '5s', delay: '1.5s' },
        { top: '68%', left: '78%', size: 100, duration: '3s', delay: '3s'   },
        { top: '85%', left: '20%', size: 140, duration: '6s', delay: '0.8s' },
      ].map((g, i) => (
        <div
          key={`g${i}`}
          className="cgrid-glow"
          style={{
            top: g.top,
            left: g.left,
            width: g.size,
            height: g.size,
            marginTop: -g.size / 2,
            marginLeft: -g.size / 2,
            background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
            animation: `cgrid-glow ${g.duration} ease-in-out ${g.delay} infinite`,
          }}
        />
      ))}

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,16,0.85) 100%)',
      }} />
    </div>
  );
}
