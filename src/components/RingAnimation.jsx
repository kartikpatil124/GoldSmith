import React from 'react';

export default function RingAnimation({ ringRef }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center">
      {/* 
        We use an outer wrapper for initial animation & float, 
        and an inner container to mount the image. This keeps
        GSAP transform offsets clean and conflict-free!
      */}
      <div 
        ref={ringRef}
        className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[580px] lg:h-[580px] flex items-center justify-center will-change-transform"
        style={{
          // Hardware acceleration for ultra-smooth 60fps movement
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <img 
          src="/layers/ring.png" 
          alt="Luxury Solitaire Diamond Ring" 
          className="w-full h-full object-contain filter drop-shadow-[0_15px_50px_rgba(255,230,184,0.35)]"
          style={{
            // Ambient particle glow effect reflecting from sunset sky
            filter: 'drop-shadow(0 20px 60px rgba(201, 168, 76, 0.25)) drop-shadow(0 0 100px rgba(255, 255, 255, 0.15))',
          }}
        />

        {/* Soft magical flare inside the ring diamond */}
        <div 
          className="absolute w-[20%] h-[20%] rounded-full bg-white/40 blur-[8px] pointer-events-none"
          style={{
            top: '32%',
            left: '46%',
            boxShadow: '0 0 40px 15px rgba(255, 255, 255, 0.6), 0 0 80px 30px rgba(201, 168, 76, 0.3)',
          }}
        />
      </div>
    </div>
  );
}
