import React from 'react';

/**
 * FloatingClouds renders one of three cloud layers.
 * Each layer has fixed opacity, height, and z-index matching the reference image.
 * Refs are passed up to HomeHeroOverlay for GSAP control.
 */
export default function FloatingClouds({ layer, cloudRef }) {
  // Layer-specific configuration
  const config = {
    back: {
      src: '/layers/cloud-back.png',
      zIndex: 'z-[5]',
      alt: 'Back clouds',
      // Back cloud: fills lower 45% of hero, softer opacity
      className: 'h-[45%] opacity-60',
    },
    middle: {
      src: '/layers/cloud-middle.png',
      zIndex: 'z-[10]',
      alt: 'Middle clouds',
      // Middle cloud: fills lower 60%, slightly denser
      className: 'h-[60%] opacity-70',
    },
    front: {
      src: '/layers/cloud-front.png',
      zIndex: 'z-[30]',
      alt: 'Front clouds',
      // Front cloud: CRITICAL — max 42% height so it only hides the ring base,
      // never the ring center or diamond. Opacity 0 at start; GSAP fades it in.
      className: 'h-[42%] opacity-0',
    },
  }[layer] || {};

  return (
    <div
      ref={cloudRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${config.zIndex} will-change-transform`}
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      <img
        src={config.src}
        alt={config.alt}
        className={`absolute bottom-0 left-0 w-full object-cover object-bottom scale-[1.04] will-change-transform ${config.className}`}
        style={{
          transform: 'translate3d(0,0,0)',
          // Very minimal filter — no fog/blur treatment
          filter: 'none',
        }}
      />
    </div>
  );
}
