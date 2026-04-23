import { motion } from 'framer-motion';
import { Home, Film, HelpCircle, BookHeart, BarChart2, Globe, Palette, Heart, Users, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { id: 'overview', label: 'Home',          icon: <Home size={18} /> },
  { id: 'vault',    label: 'Cinema Vault',  icon: <Film size={18} /> },
  { id: 'quiz',     label: 'Stuti Quiz',    icon: <HelpCircle size={18} /> },
  { id: 'story',    label: 'Our Story',     icon: <BookHeart size={18} /> },
  { id: 'stats',    label: 'Wrapped Stats', icon: <BarChart2 size={18} /> },
  { id: 'places',   label: 'Places',        icon: <Globe size={18} /> },
  { id: 'gallery',  label: 'The Gallery',  icon: <Palette size={18} /> },
  { id: 'reasons',  label: 'Reasons',       icon: <Heart size={18} /> },
  { id: 'wishes',   label: 'Friends Wall',  icon: <Users size={18} /> },
  { id: 'finale',   label: 'Finale',        icon: <Sparkles size={18} /> },
];

export function Sidebar({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <div
      className="sidebar-shell w-[240px] h-full flex flex-col hidden md:flex shrink-0"
      style={{ borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5">
        <h2 className="text-xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--accent-primary-start)' }}>✦</span> stuti.world
        </h2>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-0.5 overflow-y-auto pb-6 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative'
              )}
              style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'rgba(255,154,134,0.25)',
                    border: '0.5px solid rgba(255,154,134,0.45)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <span
                  className="transition-transform group-hover:scale-110"
                  style={{ color: isActive ? 'var(--accent-primary-start)' : 'inherit' }}
                >
                  {item.icon}
                </span>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 flex justify-center" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => onSelect('unlock')}
          aria-label="Unlock Secret"
        >
          <span className="opacity-60 hover:opacity-100 transition-opacity text-sm">?</span>
        </button>
      </div>
    </div>
  );
}
