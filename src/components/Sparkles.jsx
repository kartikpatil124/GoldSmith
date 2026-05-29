import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// 6 sparkles precisely clustered around the ring center with elegant 4-point star design
const SPARKLE_POSITIONS = [
  { x: -130, y: -90,  size: 18, delay: 0 },
  { x: 140,  y: -120, size: 14, delay: 0.4 },
  { x: -160, y: 20,   size: 10, delay: 0.8 },
  { x: 170,  y: 60,   size: 16, delay: 0.2 },
  { x: 20,   y: -150, size: 12, delay: 0.6 },
  { x: -20,  y: 130,  size: 10, delay: 1.0 },
];

export default function Sparkles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('.sparkle-item');
    if (!els) return;

    els.forEach((el, i) => {
      const cfg = SPARKLE_POSITIONS[i];

      gsap.set(el, { opacity: 0, scale: 0.5 });

      // Delayed entrance after ring appears
      const tl = gsap.timeline({
        repeat: -1,
        delay: 2.0 + cfg.delay,
      });

      tl.to(el, {
        opacity: 0.75,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
      })
      .to(el, {
        opacity: 0,
        scale: 0.6,
        duration: 1.4,
        ease: 'power1.in',
      })
      .to(el, {
        opacity: 0,
        duration: 1.0 + cfg.delay * 0.5,
      });

      // Subtle floating drift
      gsap.to(el, {
        x: `+=${8}`,
        y: `+=${-6}`,
        duration: 4 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.0 + cfg.delay,
        force3D: true,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[33] pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {SPARKLE_POSITIONS.map((cfg, i) => (
        <div
          key={i}
          className="sparkle-item absolute will-change-transform"
          style={{
            transform: `translate3d(${cfg.x}px, ${cfg.y}px, 0)`,
            width: cfg.size,
            height: cfg.size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(255, 240, 200, 0.9))',
            }}
          >
            <path
              d="M12 0 L13.8 9.2 L23 12 L13.8 14.8 L12 24 L10.2 14.8 L1 12 L10.2 9.2 Z"
              fill="rgba(255, 250, 230, 0.95)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
