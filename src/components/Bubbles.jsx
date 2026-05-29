import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Bubbles() {
  const containerRef = useRef(null);

  // Bubble config: each has a fixed position, size, and animation offset
  const bubbles = [
    { x: '18%',  y: '10%', size: 80,  delay: 0 },
    { x: '11%',  y: '38%', size: 52,  delay: 0.6 },
    { x: '8%',   y: '62%', size: 68,  delay: 1.2 },
    { x: '14%',  y: '80%', size: 40,  delay: 0.3 },
    { x: '78%',  y: '8%',  size: 62,  delay: 0.9 },
    { x: '88%',  y: '28%', size: 44,  delay: 0.4 },
    { x: '92%',  y: '55%', size: 58,  delay: 1.5 },
    { x: '82%',  y: '72%', size: 36,  delay: 0.7 },
    { x: '50%',  y: '5%',  size: 30,  delay: 1.1 },
    { x: '35%',  y: '88%', size: 48,  delay: 0.2 },
  ];

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('.bubble-item');
    if (!els) return;

    els.forEach((el, i) => {
      const cfg = bubbles[i];
      // start invisible
      gsap.set(el, { opacity: 0, y: 20 });
      // fade in staggered
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 1.6 + cfg.delay,
        ease: 'power2.out',
      });
      // subtle continuous float
      gsap.to(el, {
        y: `+=${6 + (i % 3) * 4}`,
        duration: 3.5 + (i % 4) * 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2 + cfg.delay,
        force3D: true,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[35] pointer-events-none overflow-hidden"
    >
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble-item absolute will-change-transform"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer glass sphere */}
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 32%, rgba(255,255,255,0.55) 0%, rgba(255,220,255,0.18) 35%, rgba(200,180,255,0.08) 60%, transparent 80%)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow:
                'inset -3px -3px 10px rgba(255,255,255,0.2), inset 2px 2px 6px rgba(255,200,255,0.15), 0 4px 20px rgba(180,130,255,0.12)',
              backdropFilter: 'blur(1px)',
            }}
          >
            {/* Inner highlight */}
            <div
              className="absolute rounded-full"
              style={{
                width: '28%',
                height: '28%',
                top: '14%',
                left: '16%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.85) 0%, transparent 70%)',
                filter: 'blur(1px)',
              }}
            />
            {/* Bottom soft reflection */}
            <div
              className="absolute rounded-full"
              style={{
                width: '40%',
                height: '12%',
                bottom: '12%',
                left: '30%',
                background: 'rgba(255,220,255,0.25)',
                filter: 'blur(2px)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
