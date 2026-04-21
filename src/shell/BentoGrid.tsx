import { motion } from 'framer-motion';

const bentoItems = [
  { i: 'vault',    title: 'Cinema Vault',  desc: 'Photos & videos',         span: 'md:col-span-2 md:row-span-2' },
  { i: 'quiz',     title: 'Stuti Quiz',    desc: 'How well do you know me?', span: '' },
  { i: 'story',    title: 'Our Story',     desc: 'A handwritten letter',     span: 'md:row-span-2' },
  { i: 'places',   title: 'Places',        desc: "Where we've been",         span: '' },
  { i: 'stats',    title: 'Wrapped',       desc: 'Our stats this year',      span: 'md:col-span-2' },
  { i: 'playlist', title: 'Playlist',      desc: 'Our songs',                span: '' },
  { i: 'reasons',  title: 'Reasons',       desc: 'Why I love you',           span: '' },
  { i: 'wishes',   title: 'Friends Wall',  desc: 'Wishes from friends',      span: 'md:col-span-2' },
  { i: 'finale',   title: 'Grand Finale',  desc: 'The big moment',           span: '' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function BentoGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-2">
      <div className="bento-canvas rounded-3xl p-5">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[180px]"
        >
          {bentoItems.map((item) => (
            <motion.div
              key={item.i}
              variants={itemVariants}
              className={`glassmorphism rounded-3xl p-6 flex flex-col justify-between group cursor-pointer
                hover:shadow-[0_8px_32px_rgba(45,18,0,0.18)] transition-all duration-300
                border-[0.5px] border-[var(--border-color)] overflow-hidden relative
                ${item.span}`}
              onClick={() => onSelect(item.i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none rounded-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(192,57,43,0.06), rgba(230,126,34,0.04))' }} />

              <div className="relative z-10">
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </div>

              <div className="relative z-10 flex justify-end">
                <span
                  className="group-hover:translate-x-1.5 transition-transform font-medium text-sm"
                  style={{ color: 'var(--accent-primary-start)' }}
                >
                  Open →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
