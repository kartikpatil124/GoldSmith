import React from 'react';

/**
 * HeroTextBack: "POWERFUL." and "PURE." — large campaign words behind the ring.
 * These sit on the LEFT side of the hero, ring fills the gap between them.
 * z-[15] — behind the ring.
 */
export function HeroTextBack({ textRef }) {
  return (
    <div
      ref={textRef}
      className="absolute inset-0 z-[15] pointer-events-none select-none will-change-transform"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      {/*
        "POWERFUL." — top-left quadrant, above the ring's center line.
        "PURE."     — below it, shifted slightly right so the ring fits between them.
        In the reference the text block starts around 26% from left, centered ~40-60% vertically.
      */}
      <div
        className="absolute"
        style={{
          /* Vertical midpoint of the hero area */
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -54%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          lineHeight: 1.0,
          /* The whole text block is shifted left relative to center */
          marginLeft: '-10vw',
        }}
      >
        {/* POWERFUL. */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: 'clamp(56px, 10vw, 148px)',
            color: 'rgba(255, 255, 255, 0.96)',
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
            textShadow: '0 0 60px rgba(200, 140, 255, 0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          POWERFUL.
        </div>

        {/* PURE. — indented slightly right per reference */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: 'clamp(56px, 10vw, 148px)',
            color: 'rgba(255, 255, 255, 0.90)',
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
            textShadow: '0 0 60px rgba(200, 140, 255, 0.2)',
            whiteSpace: 'nowrap',
            paddingLeft: '0.05em',
          }}
        >
          PURE.
        </div>
      </div>
    </div>
  );
}

/**
 * HeroTextFront: Italic "Gentle" — large cursive word to the RIGHT of the ring.
 * z-[25] — in front of the ring.
 * In the reference: starts where the ring ends on its right side (~60% from left),
 * vertically aligned at the ring's center line.
 */
export function HeroTextFront({ textRef }) {
  return (
    <div
      ref={textRef}
      className="absolute inset-0 z-[25] pointer-events-none select-none will-change-transform"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      <div
        className="absolute"
        style={{
          /* Align to ring's vertical center, right portion of screen */
          top: '50%',
          right: '4%',
          transform: 'translateY(-58%)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', Georgia, serif",
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(56px, 9.5vw, 140px)',
            color: 'rgba(255, 252, 248, 0.97)',
            letterSpacing: '0.01em',
            lineHeight: 1,
            textShadow:
              '0 4px 30px rgba(255, 180, 120, 0.35), 0 0 80px rgba(255, 210, 180, 0.15)',
          }}
        >
          Gentle
        </div>
      </div>
    </div>
  );
}
