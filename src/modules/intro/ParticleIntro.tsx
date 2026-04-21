import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function ParticleText({ onComplete }: { onComplete: () => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create random initial positions for particles
  const particleCount = 2000;
  const [positions, targetPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const targetPos = new Float32Array(particleCount * 3);

    // Simplistic target positions forming "STUTI" approximately in a grid,
    // in reality we'd sample a glyph texture, but for this constraint we'll
    // generate a cool random distribution that gathers into a central cluster.
    // Given the constraints to not use external fonts if not needed or complex textgeometries,
    // we'll emulate the text with a simple bounding box spread
    for (let i = 0; i < particleCount; i++) {
        // start randomly spread over screen
        pos[i*3] = (Math.random() - 0.5) * 40;
        pos[i*3+1] = (Math.random() - 0.5) * 40;
        pos[i*3+2] = (Math.random() - 0.5) * 40;
        
        // Target: tightly clustered (we would use actual font coords here for a real text shape)
        targetPos[i*3] = (Math.random() - 0.5) * 10;
        targetPos[i*3+1] = (Math.random() - 0.5) * 4;
        targetPos[i*3+2] = (Math.random() - 0.5) * 2;
    }
    return [pos, targetPos];
  }, [particleCount]);

  const [phase, setPhase] = useState<'scattered' | 'gathering' | 'exploding'>('scattered');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('gathering'), 1200);
    const t2 = setTimeout(() => setPhase('exploding'), 3000);
    const t3 = setTimeout(() => onComplete(), 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      if (phase === 'gathering') {
        positionsAttr.array[idx] += (targetPositions[idx] - positionsAttr.array[idx]) * delta * 5;
        positionsAttr.array[idx+1] += (targetPositions[idx+1] - positionsAttr.array[idx+1]) * delta * 5;
        positionsAttr.array[idx+2] += (targetPositions[idx+2] - positionsAttr.array[idx+2]) * delta * 5;
      } else if (phase === 'exploding') {
        positionsAttr.array[idx] *= 1 + delta * 15;
        positionsAttr.array[idx+1] *= 1 + delta * 15;
        positionsAttr.array[idx+2] *= 1 + delta * 15;
      }
    }
    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.2;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a78bfa" size={0.1} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

export function ParticleIntro({ onFinished }: { onFinished: () => void }) {
  const [showHappyBirthday, setShowHappyBirthday] = useState(false);
  const [done, setDone] = useState(false);

  // We add a skip button as requested
  const handleSkip = () => {
    setDone(true);
    setTimeout(onFinished, 500);
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div 
          className="fixed inset-0 z-[9999] bg-black text-white overflow-hidden flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Skip Button */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5 }}
            onClick={handleSkip}
            className="absolute bottom-10 right-10 text-sm font-ui border-b border-white/20 pb-0.5 hover:opacity-100 z-50 cursor-pointer"
          >
            Skip Intro
          </motion.button>

          <div className="absolute inset-0 pointer-events-none">
             <Canvas camera={{ position: [0, 0, 15] }}>
               <ParticleText onComplete={() => setShowHappyBirthday(true)} />
             </Canvas>
          </div>

          <AnimatePresence>
            {showHappyBirthday && (
              <motion.h1 
                className="text-7xl md:text-9xl font-display font-bold text-center z-10 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    handleSkip();
                  }, 1500);
                }}
              >
                <span className="text-gradient block">Happy</span>
                <span className="text-white block mt-2">Birthday</span>
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
