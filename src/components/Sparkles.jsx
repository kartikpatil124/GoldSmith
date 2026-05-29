import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Sparkles() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sparkles = containerRef.current.querySelectorAll('.sparkle-element');
    const dustParticles = containerRef.current.querySelectorAll('.dust-element');

    sparkles.forEach((sparkle) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 180 + 45;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius - 20;
      const scale = Math.random() * 0.55 + 0.25;
      const rotation = Math.random() * 90;

      gsap.set(sparkle, {
        x,
        y,
        scale,
        rotation,
        opacity: 0,
      });

      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 3 });

      tl.to(sparkle, {
        opacity: Math.random() * 0.55 + 0.25,
        scale: scale * 1.25,
        rotation: '+=45',
        duration: Math.random() * 1.2 + 0.8,
        ease: 'power2.out',
      }).to(sparkle, {
        opacity: 0,
        scale: scale * 0.85,
        rotation: '+=40',
        duration: Math.random() * 1.8 + 1.2,
        ease: 'power1.in',
      });

      gsap.to(sparkle, {
        x: `+=${Math.random() * 30 - 15}`,
        y: `+=${Math.random() * 30 - 15}`,
        duration: Math.random() * 7 + 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    dustParticles.forEach((dust) => {
      const startX = Math.random() * window.innerWidth - window.innerWidth / 2;
      const startY = Math.random() * window.innerHeight - window.innerHeight / 2;
      const size = Math.random() * 2.5 + 1;

      gsap.set(dust, {
        x: startX,
        y: startY,
        width: size,
        height: size,
        opacity: Math.random() * 0.3 + 0.08,
      });

      gsap.to(dust, {
        y: `+=${Math.random() * 160 - 80}`,
        x: `+=${Math.random() * 160 - 80}`,
        opacity: Math.random() * 0.35 + 0.08,
        duration: Math.random() * 11 + 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, []);

  const sparkleCount = 12;
  const dustCount = 16;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[32] pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {Array.from({ length: dustCount }).map((_, index) => (
        <div
          key={`dust-${index}`}
          className="dust-element absolute rounded-full bg-amber-100/35"
          style={{
            boxShadow: '0 0 6px 1px rgba(255, 235, 180, 0.35)',
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {Array.from({ length: sparkleCount }).map((_, index) => (
        <div
          key={`sparkle-${index}`}
          className="sparkle-element absolute w-7 h-7 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full text-amber-100 drop-shadow-[0_0_8px_rgba(245,230,184,0.8)]"
          >
            <path
              d="M12 0L14.3 9.7L24 12L14.3 14.3L12 24L9.7 14.3L0 12L9.7 9.7L12 0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
