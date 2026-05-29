import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Bubbles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const bubbles = containerRef.current.querySelectorAll('.bubble-element');
    
    bubbles.forEach((bubble) => {
      // Set random initial positions
      const startX = Math.random() * 100;
      const startY = Math.random() * 100 + 100; // start below the viewport
      const size = Math.random() * 40 + 15; // sizes between 15px and 55px
      const duration = Math.random() * 15 + 15; // duration between 15s and 30s
      const delay = Math.random() * -20; // negative delay to distribute initially

      gsap.set(bubble, {
        xPercent: startX,
        yPercent: startY,
        width: size,
        height: size,
        opacity: Math.random() * 0.3 + 0.1, // opacity between 0.1 and 0.4
      });

      // Floating up animation
      gsap.to(bubble, {
        yPercent: -120, // float past the top of the container
        xPercent: `+=${Math.random() * 30 - 15}`, // drift horizontally
        duration: duration,
        delay: delay,
        repeat: -1,
        ease: 'power1.inOut',
        // Slight rotation for bubble sheen/reflection dynamic effect
        rotation: Math.random() * 360,
      });

      // Subtly animate rotation separately for natural feel
      gsap.to(bubble, {
        rotation: '+=360',
        duration: Math.random() * 20 + 20,
        repeat: -1,
        ease: 'none',
      });
    });
  }, []);

  // Create an array of 10 bubbles
  const bubbleArray = Array.from({ length: 10 });

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
    >
      {bubbleArray.map((_, index) => (
        <div
          key={index}
          className="bubble-element absolute rounded-full border border-white/30 backdrop-blur-[1px]"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(201, 168, 76, 0.1) 100%)',
            boxShadow: 'inset -2px -2px 6px rgba(255, 255, 255, 0.3), inset 2px 2px 6px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Glass light reflection highlight inside the bubble */}
          <div 
            className="absolute rounded-full bg-white/60"
            style={{
              top: '15%',
              left: '15%',
              width: '25%',
              height: '25%',
              filter: 'blur(0.5px)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
