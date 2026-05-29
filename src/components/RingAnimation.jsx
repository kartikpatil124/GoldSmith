import React from 'react';

export default function RingAnimation({ ringRef }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-[20] flex items-center justify-center">
      <div
        ref={ringRef}
        className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[470px] md:h-[470px] lg:w-[560px] lg:h-[560px] flex items-center justify-center will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        <img
          src="/layers/ring.png"
          alt="Luxury Solitaire Diamond Ring"
          className="w-full h-full object-contain"
          style={{
            filter:
              'drop-shadow(0 20px 60px rgba(201, 168, 76, 0.30)) drop-shadow(0 0 100px rgba(255, 255, 255, 0.14))',
          }}
        />

        <div
          className="absolute w-[18%] h-[18%] rounded-full bg-white/35 blur-[8px] pointer-events-none"
          style={{
            top: '33%',
            left: '46%',
            boxShadow:
              '0 0 40px 15px rgba(255, 255, 255, 0.55), 0 0 80px 30px rgba(201, 168, 76, 0.22)',
          }}
        />
      </div>
    </div>
  );
}
