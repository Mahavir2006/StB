import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function TopBar({ activeLabel, onMenuClick }: { activeLabel: string; onMenuClick: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="topbar-shell h-16 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8"
      style={{ borderBottom: '1px solid var(--topbar-border)' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu size={20} />
        </button>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          <span className="opacity-60">stuti.world / </span>
          <span style={{ color: 'var(--text-primary)' }}>{activeLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all relative overflow-hidden"
          style={{
            color: 'var(--text-secondary)',
            background: 'rgba(45,18,0,0.08)',
          }}
          aria-label="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 0 : -90, scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon size={16} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'light' ? 0 : 90, scale: theme === 'light' ? 1 : 0, opacity: theme === 'light' ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun size={16} />
          </motion.div>
        </button>

        {/* Bell */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all relative"
          style={{ color: 'var(--text-secondary)', background: 'rgba(45,18,0,0.08)' }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--accent-primary-start)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform shadow-md"
          style={{ background: 'linear-gradient(135deg, var(--accent-primary-start), var(--accent-secondary-start))' }}
        >
          S
        </div>
      </div>
    </header>
  );
}
