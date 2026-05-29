import React from 'react';

/**
 * RingAnimation — the focal point of the hero.
 *
 * REFERENCE IMAGE analysis:
 *  - Ring is centered horizontally, slightly below vertical center
 *  - Ring is a gold halo diamond ring — its lower band is hidden by front cloud
 *  - Ring size is approximately 28-30% of viewport width
 *  - Subtle pink/gold glow behind it from the sky itself (no harsh artificial glow needed)
 *  - Diamond flare: a bright white highlight at the stone center
 *
 * The outer wrapper div (ringRef) is the GSAP target for all animation.
 */
export default function RingAnimation({ ringRef }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* GSAP-animated wrapper — entrance, float, parallax all applied here */}
      <div
        ref={ringRef}
        style={{
          position: 'relative',
          width: 'clamp(240px, 30vw, 460px)',
          height: 'clamp(240px, 30vw, 460px)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
          /* Shift ring slightly down so it sits at cloud level */
          marginTop: '8vh',
        }}
      >
        <img
          src="/layers/ring.png"
          alt="Luxury Diamond Ring"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            // Drop shadow for depth — warm gold + cool pink from sky
            filter:
              'drop-shadow(0 6px 28px rgba(255, 190, 210, 0.45)) drop-shadow(0 2px 10px rgba(210, 160, 80, 0.50))',
          }}
          draggable={false}
        />

        {/* Diamond flare — bright specular highlight at stone center */}
        <div
          style={{
            position: 'absolute',
            /* ~32% from top, ~44% from left — center of the round diamond stone */
            top: '32%',
            left: '44%',
            width: '10%',
            height: '10%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)',
            filter: 'blur(2px)',
            boxShadow:
              '0 0 18px 6px rgba(255,255,255,0.70), 0 0 40px 16px rgba(255,240,200,0.30)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
