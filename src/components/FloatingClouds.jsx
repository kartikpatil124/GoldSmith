import React from 'react';

/**
 * FloatingClouds — three layers that frame the ring.
 *
 * REFERENCE IMAGE analysis:
 *  - Clouds fill the bottom ~45% of the hero
 *  - They are pink/purple tinted, quite opaque and fluffy
 *  - The ring sits IN the clouds — its lower half is hidden by front cloud
 *  - Back/middle clouds are soft, front cloud is denser at the very bottom
 */
export default function FloatingClouds({ layer, cloudRef }) {
  const config = {
    back: {
      src: '/layers/cloud-back.png',
      zIndex: 5,
      // Back cloud fills 50% from bottom — lightest layer
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        objectFit: 'cover',
        objectPosition: 'top center',
        transform: 'translate3d(0,0,0) scale(1.03)',
        opacity: 0,           // GSAP controls final: 0.65
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: 'transform',
      },
    },
    middle: {
      src: '/layers/cloud-middle.png',
      zIndex: 10,
      // Middle cloud fills 58% from bottom — medium density
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '58%',
        objectFit: 'cover',
        objectPosition: 'top center',
        transform: 'translate3d(0,0,0) scale(1.03)',
        opacity: 0,           // GSAP controls final: 0.78
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: 'transform',
      },
    },
    front: {
      src: '/layers/cloud-front.png',
      zIndex: 30,
      // Front cloud: ONLY fills bottom 38% — hides ring's base/band, NOT the diamond.
      // This is the critical layer that creates the "ring emerging from clouds" illusion.
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '38%',
        objectFit: 'cover',
        objectPosition: 'top center',
        transform: 'translate3d(0,0,0) scale(1.03)',
        opacity: 0,           // GSAP controls final: 0.72
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: 'transform',
      },
    },
  }[layer] || {};

  return (
    <div
      ref={cloudRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: config.zIndex, transform: 'translate3d(0,0,0)', willChange: 'transform' }}
    >
      <img
        src={config.src}
        alt={`${layer} cloud layer`}
        style={config.style}
        draggable={false}
      />
    </div>
  );
}
