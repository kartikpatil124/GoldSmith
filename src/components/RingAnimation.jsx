import React from 'react';

/**
 * RingAnimation renders the luxury diamond ring PNG.
 * The outer div (ringRef) is controlled by GSAP for all entrance and float tweens.
 * The diamond flare highlight is purely CSS — no GSAP on it to keep perf clean.
 */
export default function RingAnimation({ ringRef }) {
  return (
    <div className="absolute inset-0 z-[20] pointer-events-none select-none flex items-center justify-center overflow-hidden">
      {/* Soft glow behind the ring — pure CSS, no animation needed */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '420px',
          height: '420px',
          background:
            'radial-gradient(circle, rgba(255, 210, 230, 0.25) 0%, rgba(220, 180, 255, 0.12) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* GSAP target: all entrance animation runs on this wrapper */}
      <div
        ref={ringRef}
        className="relative will-change-transform"
        style={{
          transform: 'translate3d(0,0,0)',
          width: 'clamp(260px, 36vw, 520px)',
          height: 'clamp(260px, 36vw, 520px)',
        }}
      >
        <img
          src="/layers/ring.png"
          alt="Luxury Diamond Ring"
          className="w-full h-full object-contain"
          style={{
            filter:
              'drop-shadow(0 8px 30px rgba(255, 200, 220, 0.35)) drop-shadow(0 2px 12px rgba(200, 160, 90, 0.4))',
          }}
        />

        {/* Diamond flare — sits at center-top of ring stone */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: '30%',
            left: '44%',
            width: '12%',
            height: '12%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 70%)',
            filter: 'blur(3px)',
            boxShadow:
              '0 0 20px 8px rgba(255,255,255,0.5), 0 0 50px 20px rgba(255, 220, 180, 0.25)',
          }}
        />
      </div>
    </div>
  );
}
