import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

const SECRET_WORD = 'stuti'; // Change this to your secret word

interface SecretUnlockProps {
  onClose: () => void;
}

export function SecretUnlock({ onClose }: SecretUnlockProps) {
  const [word, setWord] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (word.toLowerCase().trim() === SECRET_WORD.toLowerCase()) {
      setUnlocked(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#a78bfa', '#38bdf8', '#f472b6', '#ffffff'],
      });
    } else {
      setError(true);
      gsap.fromTo('.secret-card', { x: -8 }, { x: 8, duration: 0.05, yoyo: true, repeat: 5, onComplete: () => gsap.set('.secret-card', { x: 0 }) });
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="locked"
            className="secret-card glassmorphism rounded-3xl p-8 w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]
                flex items-center justify-center shadow-[0_0_30px_rgba(255,154,134,0.5)]">
                <Lock size={24} className="text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-2">
                  Secret Section
                </h3>
                <p className="text-[var(--text-secondary)] text-sm font-ui">
                  Type the word only she would know.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={word}
                    onChange={e => setWord(e.target.value)}
                    placeholder="The secret word..."
                    className={`w-full bg-[var(--surface-color)]/50 border rounded-xl px-4 py-3
                      text-center text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                      outline-none transition-colors text-lg tracking-widest
                      ${error
                        ? 'border-red-500/50 text-red-400'
                        : 'border-[var(--border-color)] focus:border-[var(--color-accent-purple-start)]/50'
                      }`}
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-400"
                      >
                        Nope. Try again. 😏
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-3 rounded-xl font-medium text-white
                    bg-gradient-to-r from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]
                    shadow-[0_4px_20px_rgba(255,154,134,0.4)]"
                >
                  Unlock →
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            className="glassmorphism rounded-3xl p-8 w-full max-w-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Aurora glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[var(--color-accent-purple-start)]/20 blur-[80px]" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[var(--color-accent-pink-start)]/20 blur-[80px]" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]
                  flex items-center justify-center shadow-[0_0_40px_rgba(255,154,134,0.6)]"
              >
                <Unlock size={24} className="text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text
                  bg-gradient-to-r from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)] mb-4">
                  You found it. ✦
                </h3>
                <div className="text-left glassmorphism rounded-2xl p-6 border-[0.5px] border-[var(--color-accent-purple-start)]/20">
                  <p className="font-emotional italic text-xl text-[var(--text-primary)] leading-loose">
                    "There are people who come into your life and quietly rearrange everything —
                    not with grand gestures, but with the way they laugh, the way they listen,
                    the way they make ordinary moments feel like they matter.
                    <br /><br />
                    You are that person for me.
                    <br /><br />
                    Happy Birthday, Stuti. You deserve every beautiful thing."
                  </p>
                  <p className="text-right font-bold mt-4" style={{ color: 'var(--accent-primary-start)' }}>
                    — With love ✦
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
