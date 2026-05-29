import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Sparkles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const sparkles = containerRef.current.querySelectorAll('.sparkle-element');
    const dustParticles = containerRef.current.querySelectorAll('.dust-element');
    
    // Twinkling & Floating animation for four-pointed star sparkles
    sparkles.forEach((sparkle) => {
      // Place randomly near the center area (where the ring will be)
      const angle = Math.random() * Math.PI * 2;
      // Distance from center (we concentrate them around the ring)
      const radius = Math.random() * 200 + 50; 
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius - 20; // Slightly higher to cluster near ring center

      const scale = Math.random() * 0.7 + 0.3;
      const rotation = Math.random() * 90;

      gsap.set(sparkle, {
        x: x,
        y: y,
        scale: scale,
        rotation: rotation,
        opacity: 0,
      });

      // Luxurious twinkling loop
      const tl = gsap.timeline({
        repeat: -1,
        delay: Math.random() * 4,
      });

      tl.to(sparkle, {
        opacity: Math.random() * 0.7 + 0.3,
        scale: scale * 1.3,
        rotation: '+=45',
        duration: Math.random() * 1.5 + 1,
        ease: 'power2.out',
      })
      .to(sparkle, {
        opacity: 0,
        scale: scale * 0.8,
        rotation: '+=45',
        duration: Math.random() * 2 + 1.5,
        ease: 'power1.in',
      });
      
      // Gentle floating drift
      gsap.to(sparkle, {
        x: `+=${Math.random() * 40 - 20}`,
        y: `+=${Math.random() * 40 - 20}`,
        duration: Math.random() * 8 + 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Animate glowing dust particles
    dustParticles.forEach((dust) => {
      // Scatter these all over the full screen
      const startX = Math.random() * window.innerWidth - window.innerWidth / 2;
      const startY = Math.random() * window.innerHeight - window.innerHeight / 2;
      const size = Math.random() * 3 + 1;

      gsap.set(dust, {
        x: startX,
        y: startY,
        width: size,
        height: size,
        opacity: Math.random() * 0.4 + 0.1,
      });

      // Float infinitely
      gsap.to(dust, {
        y: `+=${Math.random() * 200 - 100}`,
        x: `+=${Math.random() * 200 - 100}`,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 12 + 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, []);

  const sparkleCount = 14;
  const dustCount = 20;

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {/* Volumetric ambient particles / light dust */}
      {Array.from({ length: dustCount }).map((_, index) => (
        <div
          key={`dust-${index}`}
          className="dust-element absolute rounded-full bg-amber-100/40"
          style={{
            boxShadow: '0 0 6px 1px rgba(255, 235, 180, 0.4)',
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Four-pointed diamond star sparkles */}
      {Array.from({ length: sparkleCount }).map((_, index) => (
        <div
          key={`sparkle-${index}`}
          className="sparkle-element absolute w-8 h-8 flex items-center justify-center"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-full h-full text-amber-100 drop-shadow-[0_0_8px_rgba(245,230,184,0.85)]"
          >
            {/* Standard elegant luxury star path */}
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
