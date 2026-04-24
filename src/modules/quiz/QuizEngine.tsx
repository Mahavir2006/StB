import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  { q: "What is Stuti's go-to comfort food at 2am?", options: ["Maggi", "Ice Cream", "Leftover Pizza", "Chips"], correct: 0 },
  { q: "Which South Indian film would she rewatch forever?", options: ["Sita Ramam", "Baahubali", "RRR", "K.G.F"], correct: 0 },
  { q: "Stuti's signature reaction to something genuinely surprising?", options: ["Silence", "Loud gasp", "Laughing uncontrollably", "Eye roll"], correct: 1 },
  { q: "If she were a film genre, she'd be...?", options: ["Rom-Com", "Psychological Thriller", "Action", "Documentary"], correct: 0 },
  { q: "What would Stuti do if someone has done bad to her?", options: ["Confront", "Revenge", "Spread hate about that person", "Forgive the person"], correct: 3 },
  { q: "What would Stuti prefer?", options: ["Chaotic Bowling", "Partying", "Beach walks", "Evil Gossips"], correct: 2 },
  { q: "Who would Stuti pick to ragebait until the person cries off?", options: ["Mahfrin", "Mahavir", "Arti", "Sakshi"], correct: 1 },
  { q: "Never have you ever......", options: ["Cried over your result", "Excite over small things", "Snitched from your parents", "Scored good marks"], correct: 2 },
  { q: "The dumbest person Stuti has ever met in her life.", options: ["Mahavir", "Rupesh", "Mahfrin", "Radhika"], correct: 1 },
  { q: "Who would you pick as your current closest person?", options: ["Mahavir", "Mahfrin", "Radhika", "Sakshi"], correct: [0, 1] },
];

export function QuizEngine() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isDone, setIsDone] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  useEffect(() => {
    if (isDone || selectedOpt !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIdx, isDone, selectedOpt]);

  const handleTimeUp = () => {
    setSelectedOpt(-1); // denotes time up
    gsap.to('.quiz-card', { keyframes: { x: [-10, 10, -10, 10, 0] }, duration: 0.4 });
  };

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);

    const correctVal = QUESTIONS[currentIdx].correct;
    const isCorrect = Array.isArray(correctVal) ? correctVal.includes(idx) : idx === correctVal;

    if (isCorrect) {
      setScore(s => s + 1);
      gsap.fromTo('.score-hud', { scale: 1.5, color: '#4ade80' }, { scale: 1, color: '', duration: 0.5 });
      // Play ding sound placeholder
    } else {
      gsap.to('.quiz-card', { keyframes: { x: [-10, 10, -10, 10, 0] }, duration: 0.4 });
      // Play buzzer sound placeholder
    }

    setTimeout(nextQuestion, 1500);
  };

  const nextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
      setTimeLeft(20);
    } else {
      setIsDone(true);
      if (score >= 8) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#a78bfa', '#38bdf8', '#f472b6'] });
      }
    }
  };

  if (isDone) {
    let msg = "Maybe re-read the whole site.";
    if (score >= 8) msg = "You ARE Stuti.";
    else if (score >= 5) msg = "Pretty close.";

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <motion.div 
          className="text-center glassmorphism p-12 rounded-3xl max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">{score}/{QUESTIONS.length}</h2>
          <p className="text-2xl font-ui font-medium text-[var(--text-primary)] mb-8">{msg}</p>
          <button 
            onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setSelectedOpt(null); setTimeLeft(20); }}
            className="px-6 py-3 rounded-full bg-[var(--surface-raised-color)] hover:bg-[var(--border-color)] transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  const q = QUESTIONS[currentIdx];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Score HUD */}
      <div className="absolute top-8 right-8 score-hud px-4 py-1.5 rounded-full glassmorphism text-lg font-bold font-mono">
        ★ {score}/{QUESTIONS.length}
      </div>

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="quiz-card w-full max-w-2xl glassmorphism rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Timer Ring */}
        <div className="absolute top-6 right-6 w-12 h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="var(--border-color)" strokeWidth="4" fill="none" />
            <circle 
              cx="24" cy="24" r="20" 
              stroke={timeLeft < 5 ? '#ef4444' : 'var(--accent-primary-start)'} 
              strokeWidth="4" fill="none" 
              strokeDasharray="125.6" 
              strokeDashoffset={125.6 - (125.6 * timeLeft) / 20} 
              className="transition-all duration-1000 linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold">
            {timeLeft}
          </div>
        </div>

        <div className="mb-4 text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--accent-primary-start)' }}>
          Question {currentIdx + 1}
        </div>
        <h2 className="text-2xl font-ui font-medium text-[var(--text-primary)] mb-8 pr-16 leading-relaxed">
          {q.q}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {q.options.map((opt, i) => {
            const correctVal = q.correct;
            const isCorrect = Array.isArray(correctVal) ? correctVal.includes(i) : i === correctVal;
            let stateClass = "border-[var(--border-color)] hover:border-[var(--color-accent-purple-start)]/50";
            if (selectedOpt !== null) {
              if (isCorrect) stateClass = "bg-green-500/20 border-green-500 text-green-400";
              else if (i === selectedOpt) stateClass = "bg-red-500/20 border-red-500 text-red-400";
              else stateClass = "opacity-50 border-[var(--border-color)]";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedOpt !== null}
                className={`text-left px-6 py-4 rounded-xl border-[0.5px] bg-[var(--surface-color)]/60 transition-all duration-200 group relative ${stateClass}`}
              >
                <span className="relative z-10">{opt}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Progress indicators bottom */}
      <div className="flex gap-2 mt-8">
        {QUESTIONS.map((_, i) => (
          <div 
            key={i} 
            className={`w-2.5 h-2.5 rounded-full transition-colors`}
            style={{
              backgroundColor: i < currentIdx
                ? 'var(--accent-primary-start)'
                : i === currentIdx
                ? 'var(--accent-secondary-start)'
                : 'var(--border-color)'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
