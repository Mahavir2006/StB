import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const LETTER_TEXT = [
  "Dear Stuti,",
  "I wanted to build something that reflects how it feels to know you. Something a little chaotic, a little overwhelming, but mostly, just beautiful.",
  "From the moment we first talked, you've been a force of nature. An absolute whirlwind of ideas, laughter, and an energy that makes the world feel more alive.",
  "You are the main character, the director, and the star of your own incredible cinematic universe.",
  "Thank you for letting me be a part of the audience.",
  "Happy Birthday.",
  "With all my heart,",
];

const MILESTONES = [
  { date: "Day 1",   desc: "The first conversation that felt like we'd known each other forever." },
  { date: "Month 2", desc: "Realizing our shared love for the exact same weird food combos." },
  { date: "Month 6", desc: "The great movie marathon that ended in chaos." },
  { date: "Year 1",  desc: "A year of surviving each other's terrible jokes." },
  { date: "Today",   desc: "Celebrating the absolute legend that you are." },
];

export function TypewriterLetter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-idx'));
            const el  = textRefs.current[idx];
            if (el && el.innerHTML === '') {
              gsap.to(el, {
                duration: LETTER_TEXT[idx].length * 0.045,
                text: LETTER_TEXT[idx],
                ease: 'none',
              });
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    textRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 flex flex-col gap-24 relative">

      <section className="relative px-6" ref={containerRef}>
        <div className="glassmorphism p-8 md:p-16 rounded-3xl relative overflow-hidden">
          <div className="flex flex-col gap-8 text-xl md:text-2xl font-emotional italic leading-loose text-[var(--text-primary)] drop-shadow-sm">
            {LETTER_TEXT.map((_, i) => (
              <p key={i} ref={el => { textRefs.current[i] = el; }} data-idx={i} className="min-h-[2rem]" />
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-12">
        <div className="absolute left-1/2 top-0 bottom-0 w-px
          bg-gradient-to-b from-[var(--accent-primary-start)] via-[var(--accent-secondary-start)] to-transparent
          -translate-x-1/2" />

        <h2 className="text-4xl font-display font-bold text-center mb-16 uppercase tracking-widest text-[var(--text-secondary)]">
          The Timeline
        </h2>

        <div className="flex flex-col gap-12 relative z-10 w-full">
          {MILESTONES.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'} w-full relative group`}
              >
                <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full
                  bg-[var(--surface-color)] border-2 -translate-x-1/2 -translate-y-1/2
                  group-hover:scale-150 transition-all z-20"
                  style={{ borderColor: 'var(--accent-primary-start)' }} />

                <div className={`w-[calc(50%-2rem)] ${isLeft ? 'text-right' : 'text-left'}`}>
                  <div className="glassmorphism p-6 rounded-2xl inline-block text-left
                    hover:-translate-y-1 transition-transform border-[0.5px] border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold
                        border border-[var(--accent-primary-start)]/40
                        text-[var(--accent-primary-start)]"
                        style={{ background: 'rgba(192,57,43,0.08)' }}>
                        {item.date}
                      </span>
                    </div>
                    <p className="font-ui text-[var(--text-primary)] text-sm md:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
