import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  message: string;
  color: string;
  rotation: number;
  timestamp: number;
}

const COLORS = [
  'rgba(255,154,134,0.25)',
  'rgba(255,179,153,0.25)',
  'rgba(255,214,166,0.30)',
  'rgba(255,240,190,0.35)',
  'rgba(192,57,43,0.12)',
];

const SEED_WISHES: Wish[] = [
  { id: 'seed1', name: 'Your Best Friend', message: "Happy Birthday Stuti! You are the most chaotic, wonderful person I know. Here's to another year of your terrible decisions and amazing energy!", color: COLORS[0], rotation: -2, timestamp: Date.now() - 5000 },
  { id: 'seed2', name: 'The Squad', message: 'We love you so much! May your birthday be as extra as you are.', color: COLORS[1], rotation: 1.5, timestamp: Date.now() - 4000 },
  { id: 'seed3', name: 'A Secret Admirer', message: 'You make every room brighter just by walking in. Happy Birthday!', color: COLORS[2], rotation: -1, timestamp: Date.now() - 3000 },
];

function getStoredWishes(): Wish[] {
  try {
    const stored = localStorage.getItem('stuti-wishes');
    return stored ? JSON.parse(stored) as Wish[] : SEED_WISHES;
  } catch {
    return SEED_WISHES;
  }
}

function saveWishes(wishes: Wish[]) {
  try {
    localStorage.setItem('stuti-wishes', JSON.stringify(wishes));
  } catch {
    // ignore
  }
}

export function WishWall() {
  const [wishes, setWishes] = useState<Wish[]>(getStoredWishes);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    saveWishes(wishes);
  }, [wishes]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: (Math.random() - 0.5) * 6,
      timestamp: Date.now(),
    };

    setWishes(prev => [newWish, ...prev]);
    setName('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold uppercase tracking-widest
          text-transparent bg-clip-text bg-gradient-to-r
          from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]">
          Friends Wall
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm font-ui">
          Leave a birthday wish for Stuti
        </p>
      </div>

      {/* Submit Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="glassmorphism rounded-3xl p-6 flex flex-col gap-4 max-w-lg mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={40}
          className="bg-[var(--surface-color)]/50 border border-[var(--border-color)] rounded-xl
            px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
            outline-none focus:border-[var(--color-accent-purple-start)]/50 transition-colors"
        />
        <textarea
          placeholder="Write your birthday wish..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={200}
          rows={3}
          className="bg-[var(--surface-color)]/50 border border-[var(--border-color)] rounded-xl
            px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
            outline-none focus:border-[var(--color-accent-purple-start)]/50 transition-colors resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">{message.length}/200</span>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-green-400"
              >
                <Heart size={14} fill="currentColor" /> Wish sent!
              </motion.div>
            ) : (
              <motion.button
                key="submit"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                  bg-gradient-to-r from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]
                  text-white shadow-[0_4px_20px_rgba(255,154,134,0.4)]"
              >
                <Send size={14} /> Send Wish
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* Wish Notes Masonry */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence>
          {wishes.map((wish) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="break-inside-avoid rounded-2xl p-5 border border-[var(--border-color)]
                cursor-default hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
                transition-all duration-300 group"
              style={{
                background: wish.color,
                transform: `rotate(${wish.rotation}deg)`,
              }}
              whileHover={{ rotate: 0, scale: 1.03 }}
            >
              <p className="text-sm font-emotional italic text-[var(--text-primary)] leading-relaxed mb-3">
                "{wish.message}"
              </p>
              <p className="text-xs font-bold tracking-wide" style={{ color: 'var(--accent-primary-start)' }}>
                — {wish.name}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-[var(--text-secondary)] opacity-50">
        Wishes are saved locally on this device.
      </p>
    </div>
  );
}
