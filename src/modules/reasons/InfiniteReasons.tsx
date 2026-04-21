import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const REASONS = [
  "The way you snort when you laugh too hard.",
  "Your unbelievable ability to remember exactly what I wore 3 years ago.",
  "How you automatically know when I'm lying about being 'fine'.",
  "The fact that you'll debate a movie's plot hole for 3 hours.",
  "Your weirdly specific playlist for every mood.",
  "How you always offer me food even when you're hungry.",
  "You never judge my terrible life choices (mostly).",
  "The way you get so excited about small things.",
  "Your absolute refusal to lose an argument.",
  "Because you actually listen when people talk.",
  "Your unapologetic love for drama.",
  "How you panic over nothing and are calm during chaos.",
  "You're the only person who gets my references.",
  "The dramatic pauses you take before telling a story.",
  "Because even in silence, it's not awkward with you.",
  "Your weird talent for predicting movie endings.",
  "How you text exactly the way you talk.",
  "Because you make ordinary days feel like memories."
];

export function InfiniteReasons() {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!col1Ref.current || !col2Ref.current) return;

    const tween1 = gsap.to(col1Ref.current, { yPercent: -50, ease: 'none', duration: 30, repeat: -1 });
    const tween2 = gsap.to(col2Ref.current, { yPercent: -50, ease: 'none', duration: 40, repeat: -1 });

    // Pause when tab is hidden — saves CPU
    const onVisibility = () => {
      if (document.hidden) { tween1.pause(); tween2.pause(); }
      else { tween1.resume(); tween2.resume(); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      tween1.kill();
      tween2.kill();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const repeatReasons = [...REASONS, ...REASONS, ...REASONS];
  const half = Math.floor(repeatReasons.length / 2);
  const leftCol = repeatReasons.slice(0, half);
  const rightCol = repeatReasons.slice(half);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Edge Fades for the infinite scroll effect */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />

      <h2 className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-display font-bold tracking-widest z-20 shrink-0 bg-[var(--bg-color)] px-6 py-2 rounded-full border border-[var(--border-color)] shadow-lg uppercase" style={{ color: 'var(--accent-primary-start)' }}>
        Reasons I Love You
      </h2>

      <div className="flex gap-8 w-full max-w-5xl h-[120%] -mt-[10%] opacity-80">
         <div className="flex-1 overflow-hidden">
            <div ref={col1Ref} className="flex flex-col gap-6 pt-10">
              {leftCol.map((r, i) => (
                <div key={i} className="text-xl md:text-2xl font-emotional italic text-center p-4 transition-colors hover:scale-105 transform origin-center cursor-default" style={{ '--tw-text-opacity': 1 } as React.CSSProperties} onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary-start)')} onMouseLeave={e => (e.currentTarget.style.color = '')}>
                  {r}
                </div>
              ))}
            </div>
         </div>
         
         <div className="flex-1 overflow-hidden hidden md:block">
            <div ref={col2Ref} className="flex flex-col gap-8 pt-40">
              {rightCol.map((r, i) => (
                <div key={i} className="text-xl md:text-3xl font-emotional italic text-center text-[var(--text-secondary)] p-4 hover:text-[var(--color-accent-pink-start)] transition-colors hover:scale-105 transform origin-center cursor-default">
                  {r}
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
