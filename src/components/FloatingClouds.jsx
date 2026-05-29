import React from 'react';

export default function FloatingClouds({ layer, cloudRef }) {
  let imgSrc = '';
  let zIndexClass = '';
  let altText = '';
  let sizeClass = 'h-[55%] md:h-[62%] lg:h-[68%]';
  let opacityClass = 'opacity-70';
  let blurStyle = 'drop-shadow(0 0 24px rgba(255, 235, 210, 0.10)) blur(0.35px)';

  switch (layer) {
    case 'back':
      imgSrc = '/layers/cloud-back.png';
      zIndexClass = 'z-[5]';
      altText = 'Distant Sunset Clouds';
      sizeClass = 'h-[42%] md:h-[48%] lg:h-[52%]';
      opacityClass = 'opacity-55';
      blurStyle = 'drop-shadow(0 0 18px rgba(255, 235, 210, 0.08)) blur(0.2px)';
      break;
    case 'middle':
      imgSrc = '/layers/cloud-middle.png';
      zIndexClass = 'z-[10]';
      altText = 'Atmospheric Midground Clouds';
      sizeClass = 'h-[50%] md:h-[58%] lg:h-[64%]';
      opacityClass = 'opacity-65';
      blurStyle = 'drop-shadow(0 0 22px rgba(255, 235, 210, 0.10)) blur(0.25px)';
      break;
    case 'front':
      imgSrc = '/layers/cloud-front.png';
      zIndexClass = 'z-[30]';
      altText = 'Dreamy Foreground Clouds';
      // Front cloud must partially frame the ring and NEVER cover the ring center
      sizeClass = 'h-[38%] md:h-[42%] lg:h-[46%]';
      opacityClass = 'opacity-65';
      blurStyle = 'drop-shadow(0 0 20px rgba(255, 235, 210, 0.12)) blur(0.2px)';
      break;
    default:
      imgSrc = '/layers/cloud-middle.png';
      zIndexClass = 'z-[10]';
      altText = 'Clouds';
  }

  return (
    <div
      ref={cloudRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${zIndexClass} will-change-transform`}
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      <img
        src={imgSrc}
        alt={altText}
        className={`absolute bottom-0 left-0 w-full ${sizeClass} object-cover object-bottom ${opacityClass} scale-105 will-change-transform`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          filter: blurStyle,
        }}
      />
    </div>
  );
}
