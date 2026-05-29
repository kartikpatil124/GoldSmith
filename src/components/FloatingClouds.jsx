import React from 'react';

export default function FloatingClouds({ layer, cloudRef }) {
  // Determine source image and z-index based on the layer prop
  let imgSrc = '';
  let zIndexClass = '';
  let altText = '';

  switch (layer) {
    case 'back':
      imgSrc = '/layers/cloud-back.png';
      zIndexClass = 'z-5';
      altText = 'Distant Sunset Clouds';
      break;
    case 'middle':
      imgSrc = '/layers/cloud-middle.png';
      zIndexClass = 'z-10';
      altText = 'Atmospheric Midground Clouds';
      break;
    case 'front':
      imgSrc = '/layers/cloud-front.png';
      zIndexClass = 'z-30';
      altText = 'Dreamy Foreground Clouds';
      break;
    default:
      imgSrc = '/layers/cloud-middle.png';
      zIndexClass = 'z-10';
      altText = 'Clouds';
  }

  return (
    <div 
      ref={cloudRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${zIndexClass}`}
    >
      <img 
        src={imgSrc} 
        alt={altText}
        className="absolute bottom-0 left-0 w-full h-[60%] md:h-[70%] lg:h-[80%] object-cover object-bottom opacity-90 scale-105 will-change-transform"
        style={{
          // Hardware acceleration for ultra-smooth 60fps parallax
          transform: 'translate3d(0, 0, 0)',
          // Soft bloom & fog integration
          filter: 'drop-shadow(0 0 30px rgba(255, 235, 210, 0.15)) blur(0.5px)',
        }}
      />
    </div>
  );
}
