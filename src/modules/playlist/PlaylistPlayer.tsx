import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  memory: string;
  spotifyUrl: string;
  color: string;
}

const TRACKS: Track[] = [
  { id: 1, title: 'Enna Sona', artist: 'Arijit Singh', album: 'OK Jaanu', memory: 'The song that plays in my head when I think of you.', spotifyUrl: 'https://open.spotify.com/track/4Km5HrUvYTaSUfiSGPJeQR', color: '#a78bfa' },
  { id: 2, title: 'Kesariya', artist: 'Arijit Singh', album: 'Brahmastra', memory: 'You hummed this for an entire week straight.', spotifyUrl: 'https://open.spotify.com/track/0Oe4sMFJFBQbYqofRCCArk', color: '#f472b6' },
  { id: 3, title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', memory: 'The one song you know every single word to.', spotifyUrl: 'https://open.spotify.com/track/0pqnGHJpmpxLKifKRmU6WP', color: '#38bdf8' },
  { id: 4, title: 'Naatu Naatu', artist: 'Rahul Sipligunj', album: 'RRR', memory: 'You tried to learn the dance. Emphasis on tried.', spotifyUrl: 'https://open.spotify.com/track/3eekarcy7kvN4yt5ZFzltW', color: '#4ade80' },
  { id: 5, title: 'Vaan Varuvaan', artist: 'A.R. Rahman', album: 'Sita Ramam', memory: 'This one hits different at 2am.', spotifyUrl: 'https://open.spotify.com/track/1Gg3Gg3Gg3Gg3Gg3Gg3Gg', color: '#fb923c' },
  { id: 6, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', memory: 'Our chaotic late-night drive anthem.', spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b', color: '#facc15' },
];

function WaveformBars({ color, active }: { color: string; active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full origin-bottom"
          style={{ backgroundColor: color, height: '100%', willChange: 'transform' }}
          animate={active ? {
            scaleY: [0.4, 0.3 + Math.random() * 0.7, 0.4],
          } : { scaleY: 0.2 }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function PlaylistPlayer() {
  const [activeTrack, setActiveTrack] = useState<number>(0);
  const track = TRACKS[activeTrack];

  return (
    <div className="w-full max-w-3xl mx-auto py-8 flex flex-col gap-6">
      <h2 className="text-4xl font-display font-bold text-center uppercase tracking-widest
        text-transparent bg-clip-text bg-gradient-to-r
        from-[var(--accent-primary-start)] to-[var(--accent-secondary-start)]">
        Our Playlist
      </h2>
      <p className="text-center text-[var(--text-secondary)] font-ui text-sm mb-4">
        Songs that mean something. Click to preview.
      </p>

      {/* Now Playing Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="glassmorphism rounded-3xl p-6 relative overflow-hidden"
        >
          {/* Blurred color bg */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle at 30% 50%, ${track.color}, transparent 70%)` }}
          />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                  Now Playing
                </div>
                <h3 className="text-2xl font-display font-bold text-[var(--text-primary)]">{track.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-0.5">{track.artist} · {track.album}</p>
              </div>
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30
                  hover:bg-[#1DB954]/30 transition-colors shrink-0"
              >
                <ExternalLink size={14} />
                Spotify
              </a>
            </div>

            <WaveformBars color={track.color} active={true} />

            <p className="text-sm font-emotional italic text-[var(--text-secondary)] border-l-2 pl-3"
              style={{ borderColor: track.color }}>
              {track.memory}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Track List */}
      <div className="flex flex-col gap-2">
        {TRACKS.map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => setActiveTrack(i)}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all
              border-[0.5px] ${activeTrack === i
                ? 'bg-[var(--surface-raised-color)] border-[var(--color-accent-purple-start)]/30'
                : 'border-transparent hover:bg-[var(--surface-color)]/50 hover:border-[var(--border-color)]'
              }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${t.color}20`, color: t.color }}>
              {activeTrack === i ? <Music size={14} /> : <span className="text-xs font-mono">{i + 1}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${activeTrack === i ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {t.title}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{t.artist}</p>
            </div>
            {activeTrack === i && (
              <WaveformBars color={t.color} active={true} />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
