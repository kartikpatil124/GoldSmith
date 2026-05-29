import React from 'react';

export function HeroTextBack({ textBackRef }) {
  return (
    <div
      ref={textBackRef}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-[15] overflow-hidden will-change-transform"
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      <div className="flex flex-col items-center justify-center text-center mt-[-60px] md:mt-[-100px]">
        <h1
          className="text-[12vw] md:text-[9vw] font-bold leading-none tracking-[0.18em] text-white/12 font-display select-none uppercase"
          style={{
            textShadow: '0 0 40px rgba(255, 255, 255, 0.04)',
            fontFamily: 'var(--font-display)',
          }}
        >
          POWERFUL.
        </h1>

        <h1
          className="text-[12vw] md:text-[9vw] font-bold leading-none tracking-[0.25em] text-white/18 font-display select-none uppercase mt-2 md:mt-4"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255, 255, 255, 0.18) 0%, rgba(201, 168, 76, 0.05) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-display)',
          }}
        >
          PURE.
        </h1>
      </div>
    </div>
  );
}

export function HeroTextFront({ textFrontRef }) {
  return (
    <div
      ref={textFrontRef}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-[25] overflow-hidden will-change-transform"
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      <div className="flex flex-col items-center justify-center text-center mt-[92px] md:mt-[160px]">
        <h2
          className="text-[10vw] md:text-[7vw] font-light leading-none tracking-[0.05em] font-accent select-none italic text-amber-100/95"
          style={{
            fontFamily: 'var(--font-accent)',
            textShadow:
              '0 4px 20px rgba(201, 168, 76, 0.35), 0 0 40px rgba(255, 255, 255, 0.18)',
          }}
        >
          Gentle
        </h2>
      </div>
    </div>
  );
}
