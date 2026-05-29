import React from 'react';

/**
 * HeroTextBack: Large campaign-style words "POWERFUL." and "PURE."
 * Positioned behind the ring at z-[15].
 * Bold, white, large — clearly visible against the sky.
 */
export function HeroTextBack({ textRef }) {
  return (
    <div
      ref={textRef}
      className="absolute inset-0 z-[15] pointer-events-none select-none will-change-transform overflow-hidden"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      {/* Positioned toward center-left of hero, matching reference image */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          textAlign: 'left',
          lineHeight: 1.0,
          whiteSpace: 'nowrap',
        }}
      >
        {/* POWERFUL. */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 'clamp(52px, 9.5vw, 140px)',
            color: 'rgba(255, 255, 255, 0.92)',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 30px rgba(180, 120, 255, 0.2)',
            lineHeight: 1.05,
          }}
        >
          POWERFUL.
        </div>

        {/* PURE. — slightly indented right per the reference */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 'clamp(52px, 9.5vw, 140px)',
            color: 'rgba(255, 255, 255, 0.88)',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 30px rgba(180, 120, 255, 0.15)',
            lineHeight: 1.05,
            paddingLeft: '2%',
          }}
        >
          PURE.
        </div>
      </div>
    </div>
  );
}

/**
 * HeroTextFront: Italic "Gentle" — floats in front of the ring at z-[25].
 * Warm white with gold glow, script/italic style.
 */
export function HeroTextFront({ textRef }) {
  return (
    <div
      ref={textRef}
      className="absolute inset-0 z-[25] pointer-events-none select-none will-change-transform overflow-hidden"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      {/* Positioned center-right, overlapping the ring — matches reference */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '58%',
          transform: 'translate(0, -10%)',
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(48px, 8.5vw, 128px)',
            color: 'rgba(255, 248, 240, 0.95)',
            letterSpacing: '0.02em',
            textShadow:
              '0 4px 24px rgba(220, 160, 90, 0.4), 0 0 60px rgba(255, 200, 150, 0.2)',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Gentle
        </div>
      </div>
    </div>
  );
}
