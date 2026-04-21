import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  country: string;
  memory: string;
  top: string;
  left: string;
}

const LOCATIONS: Location[] = [
  { id: 'mumbai',    name: 'Mumbai',    country: 'India', memory: 'Where it all began. The city that holds all our chaos.',              top: '42%', left: '62%' },
  { id: 'bangalore', name: 'Bangalore', country: 'India', memory: 'Late nights, filter coffee, and the best conversations.',             top: '46%', left: '63%' },
  { id: 'goa',       name: 'Goa',       country: 'India', memory: 'That one trip where everything went perfectly wrong.',                top: '44%', left: '61%' },
  { id: 'delhi',     name: 'Delhi',     country: 'India', memory: 'Street food, chaos, and somehow finding each other in the crowd.',    top: '38%', left: '62%' },
  { id: 'hyderabad', name: 'Hyderabad', country: 'India', memory: 'Long walks and the best conversations. The perfect combination.',     top: '44%', left: '63%' },
];

export function GlobeScene() {
  const [activePin, setActivePin] = useState<Location | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Places We've Been
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm font-ui">
          Every pin is a memory. Click to remember.
        </p>
      </div>

      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden glassmorphism border-[0.5px] border-[var(--border-color)]">
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 50" preserveAspectRatio="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="50" stroke="var(--accent-primary-start)" strokeWidth="0.1" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="var(--accent-primary-start)" strokeWidth="0.1" />
          ))}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[var(--text-secondary)] text-sm opacity-60 font-ui">
            Interactive map — click the pins below
          </p>
        </div>

        {LOCATIONS.map((loc, i) => (
          <motion.button
            key={loc.id}
            className="absolute flex flex-col items-center gap-1 group"
            style={{ top: loc.top, left: loc.left, transform: 'translate(-50%, -100%)' }}
            onClick={() => setActivePin(activePin?.id === loc.id ? null : loc)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            aria-label={`View memory for ${loc.name}`}
          >
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center
                bg-gradient-to-br from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]
                border-2 border-white/30"
              style={{ boxShadow: '0 0 16px rgba(192,57,43,0.5)' }}
              whileHover={{ scale: 1.3 }}
              animate={activePin?.id === loc.id ? { scale: 1.2 } : { scale: 1 }}
            >
              <MapPin size={14} className="text-white" />
            </motion.div>
            <span className="text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded-full
              opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {loc.name}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activePin && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glassmorphism rounded-3xl p-6 relative border-[0.5px] border-[var(--border-color)]"
          >
            <button onClick={() => setActivePin(null)}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close memory">
              <X size={18} />
            </button>
            <div>
              <h3 className="text-xl font-display font-bold text-[var(--text-primary)]">
                {activePin.name}, {activePin.country}
              </h3>
              <p className="text-[var(--text-secondary)] font-emotional italic text-lg mt-1 leading-relaxed">
                "{activePin.memory}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LOCATIONS.map((loc) => (
          <motion.button
            key={loc.id}
            onClick={() => setActivePin(activePin?.id === loc.id ? null : loc)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all
              border-[0.5px] ${activePin?.id === loc.id
                ? 'border-[var(--accent-primary-start)]/50'
                : 'border-[var(--border-color)] bg-[var(--surface-color)]/40'
              }`}
            style={activePin?.id === loc.id ? { background: 'rgba(192,57,43,0.08)' } : {}}
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{loc.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{loc.country}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
