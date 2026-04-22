import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.floor(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

function SmileCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-4xl lg:text-5xl font-bold text-[var(--accent-primary-start)]">{count}</span>
      <button
        onClick={() => setCount(c => c + 1)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl
          font-bold transition-transform active:scale-90 hover:scale-110 select-none"
        style={{ background: 'linear-gradient(135deg, var(--accent-primary-start), var(--accent-secondary-start))' }}
        aria-label="Add smile"
      >+</button>
    </div>
  );
}

interface StatCard {
  id: string;
  label: string;
  value?: number;
  suffix?: string;
  prefix?: string;
  textVal?: string;
  desc?: string;
  colSpan: number;
  isSmile?: boolean;
  textClass?: string;
}

const STATS: StatCard[] = [
  { id: 'days',   label: 'Days known together',   value: 730,   suffix: '+ days',  colSpan: 2 },
  { id: 'laughs', label: 'Laughs had',             textVal: 'Infinite', textClass: 'text-3xl lg:text-4xl', colSpan: 1 },
  { id: 'movies', label: 'Films watched together', value: 5, suffix: ' & counting', textClass: 'text-2xl lg:text-3xl', colSpan: 1 },
  { id: 'msgs',   label: 'Messages sent',          value: 73295, suffix: '+',  colSpan: 2 },
  { id: 'word',   label: 'Most used word',         textVal: '"bhai"',          colSpan: 1 },
  { id: 'reply',  label: 'Avg reply time',         textVal: 'Immediately*', textClass: 'text-2xl', desc: '*when she wants to', colSpan: 1 },
  
  { id: 'rage',   label: 'Ragebaiting Mahavir',    value: 10, suffix: 'M+ times',  colSpan: 2 },
  { id: 'jokes',  label: "Jokes on Mahavir's dad", textVal: 'infinite time', textClass: 'text-xl lg:text-2xl', colSpan: 1 },
  { id: 'fought', label: 'Fought',                 value: 4, prefix: 'Longest for ', suffix: ' months', textClass: 'text-[1.1rem] lg:text-xl', colSpan: 1 },
  { id: 'call',   label: 'Call hours',             value: 2000, suffix: '+ hours', colSpan: 2 },
  
  { id: 'smiles', label: 'Times you smiled today', isSmile: true,              colSpan: 2 },
];

export function WrappedStats() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-display font-bold text-center mb-12 uppercase tracking-widest text-[var(--text-primary)]"
      >
        Stuti Wrapped 2025
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`glassmorphism rounded-3xl p-6 relative overflow-hidden group
              hover:scale-[1.02] transition-transform duration-300
              ${stat.colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'}`}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(to right, var(--accent-primary-start), var(--accent-secondary-start))' }} />

            <div className="mb-6">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                {stat.label}
              </span>
            </div>

            <div className={`font-mono font-bold text-[var(--text-primary)] whitespace-nowrap ${stat.textClass || 'text-4xl lg:text-5xl'}`}>
              {stat.isSmile ? (
                <SmileCounter />
              ) : stat.textVal ? (
                <span style={{ color: 'var(--accent-primary-start)' }}>{stat.textVal}</span>
              ) : (
                <span className="flex items-baseline gap-x-2">
                  {stat.prefix && <span className="text-opacity-70 text-[var(--text-secondary)]" style={{ fontSize: '0.7em' }}>{stat.prefix}</span>}
                  <span style={{ color: 'var(--accent-primary-start)' }}>
                    <AnimatedNumber value={stat.value ?? 0} />
                  </span>
                  {stat.suffix && <span style={{ color: 'var(--accent-secondary-start)', fontSize: '0.7em' }}>{stat.suffix}</span>}
                </span>
              )}
            </div>

            {stat.desc && <p className="text-xs text-[var(--text-secondary)] mt-2 italic">{stat.desc}</p>}

            <motion.div
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 6 + i, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
