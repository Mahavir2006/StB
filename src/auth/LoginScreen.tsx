import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import gsap from 'gsap';
import CyberneticGridShader from '../components/ui/cybernetic-grid-shader';

export function LoginScreen() {
  const { login } = useAuth();
  const [password, setPassword]           = useState('');
  const [error, setError]                 = useState(false);
  const [cooldown, setCooldown]           = useState(0);
  const [success, setSuccess]             = useState(false);
  const [focused, setFocused]             = useState(false);
  const [_attempts, setAttempts]          = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    if (login(password)) {
      setSuccess(true);
    } else {
      setError(true);
      setAttempts(prev => {
        const next = prev + 1;
        if (next >= 5) { setCooldown(30); return 0; }
        return next;
      });
      gsap.fromTo(
        '.login-card',
        { x: -10 },
        { x: 10, duration: 0.05, yoyo: true, repeat: 7,
          onComplete: () => gsap.set('.login-card', { x: 0 }) }
      );
      setTimeout(() => setError(false), 2500);
    }
  };

  /* Cooldown ring */
  const RING_R = 18;
  const CIRC   = 2 * Math.PI * RING_R;

  return (
    <AnimatePresence>
      {!success && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Cybernetic Grid Shader background ── */}
          <CyberneticGridShader />

          {/* Dark overlay so card pops */}
          <div className="absolute inset-0 bg-black/55 z-[1]" />

          {/* Radial aurora halo */}
          <motion.div
            className="absolute z-[2] w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,154,134,0.35) 0%, rgba(255,179,153,0.15) 45%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-[3] flex flex-col items-center gap-8 px-4 w-full max-w-sm">

            {/* Name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.span
                  className="text-2xl"
                  style={{ color: '#FF9A86' }}
                  animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >✦</motion.span>

                <h1
                  className="text-6xl font-display font-bold text-white"
                  style={{
                    textShadow: '0 0 40px rgba(255,154,134,0.9), 0 0 80px rgba(255,179,153,0.5)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Stuti
                </h1>

                <motion.span
                  className="text-2xl"
                  style={{ color: '#FFD6A6' }}
                  animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >✦</motion.span>
              </div>
              <p className="text-white/35 text-xs tracking-[0.35em] uppercase font-ui">
                A private universe
              </p>
            </motion.div>

            {/* Card */}
            <motion.div
              className="login-card w-full rounded-3xl relative overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: 'rgba(8, 6, 20, 0.92)',
                border: '0.5px solid rgba(255,154,134,0.30)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
              }}
            >
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,154,134,0.8), rgba(255,214,166,0.5), transparent)' }} />

              <div className="p-8 flex flex-col items-center gap-6">
                {/* Lock badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-ui
                  text-white/40 border border-white/10 bg-white/5">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <rect x="1" y="5" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Private experience
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      disabled={cooldown > 0}
                      placeholder="Enter password"
                      className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-white text-sm
                        font-ui outline-none transition-all duration-300 text-center tracking-widest
                        placeholder:text-white/20 placeholder:tracking-normal disabled:opacity-40"
                      style={{
                        border: error
                          ? '1px solid rgba(239,68,68,0.6)'
                          : focused
                          ? '1px solid rgba(255,154,134,0.60)'
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: focused && !error
                          ? '0 0 0 3px rgba(255,154,134,0.15), inset 0 0 20px rgba(255,154,134,0.06)'
                          : 'none',
                      }}
                    />
                    {/* Animated glow underline */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px rounded-full"
                      style={{ background: 'linear-gradient(to right, #FF9A86, #FFB399, #FFD6A6)' }}
                      animate={{ width: focused ? '75%' : '0%', opacity: focused ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-400 text-xs text-center -mt-2 font-ui"
                      >
                        Not quite. Try again. ✗
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Button / Cooldown */}
                  {cooldown > 0 ? (
                    <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10
                      flex items-center justify-center gap-3 text-white/50 text-sm font-ui">
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                        <motion.circle
                          cx="20" cy="20" r={RING_R}
                          fill="none" stroke="#ef4444" strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray={CIRC}
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: CIRC }}
                          transition={{ duration: 30, ease: 'linear' }}
                          style={{ transformOrigin: '20px 20px', transform: 'rotate(-90deg)' }}
                        />
                      </svg>
                      Wait {cooldown}s
                    </div>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 rounded-xl text-white font-medium text-sm font-ui
                        relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #FF9A86 0%, #FFB399 50%, #FFD6A6 100%)',
                        boxShadow: '0 4px 24px rgba(255,154,134,0.50)',
                      }}
                    >
                      {/* Shimmer on hover */}
                      <motion.div
                        className="absolute inset-0 bg-white/15"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative z-10 tracking-wide">Enter her world →</span>
                    </motion.button>
                  )}
                </form>
              </div>

              {/* Bottom shimmer line */}
              <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.4), transparent)' }} />
            </motion.div>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/20 text-xs font-ui text-center"
            >
              Built with love, for one person only.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
