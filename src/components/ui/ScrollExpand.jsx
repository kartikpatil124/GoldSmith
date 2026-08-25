import React, { useRef, useState, useEffect } from 'react';
import './ScrollExpand.css';

/*
  ScrollExpand — React Bits Sticky Scroll-Driven Clip-Path Expansion
  ─────────────────────────────────────────────────────────────────
  Transforms a tight macro-focused image crop into a full-bleed
  cinematic experience driven by smooth window scroll progress.
*/

export default function ScrollExpand({
  mediaSrc,
  alt = 'Cinematic Image Reveal',
  startWidth = '80vw',
  startHeight = '42vh',
  startRadius = 36,
  endRadius = 0,
  mediaZoom = 1.35,
  focalPosition = 'center 40%',
  scrollDistanceVh = 160,
  holdDistanceVh = 40,
  title = '',
  subtitle = '',
  tagline = 'SCROLL TO REVEAL',
}) {
  const containerRef = useRef(null);
  const [animProgress, setAnimProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameRef = useRef(null);

  // Measure window scroll against container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const rawProgress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 60 FPS smooth progress dampening loop
    const smoothLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.12;

      if (Math.abs(diff) < 0.0008) {
        currentProgressRef.current = targetProgressRef.current;
      }

      setAnimProgress(currentProgressRef.current);
      animFrameRef.current = requestAnimationFrame(smoothLoop);
    };

    animFrameRef.current = requestAnimationFrame(smoothLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute normalized reveal progress before the hold phase
  const expansionEndThreshold = 0.82;
  const revealRatio = Math.min(1, animProgress / expansionEndThreshold);

  // Easing curve for smooth luxury deceleration
  const easeProgress = 1 - Math.pow(1 - revealRatio, 2.5);

  // Current values
  const currentScale = mediaZoom - (mediaZoom - 1.0) * easeProgress;
  const currentRadius = startRadius * (1 - easeProgress) + endRadius * easeProgress;

  // Title fade out in stage 1 & 2
  const textOpacity = Math.max(0, 1 - revealRatio * 3.2);
  const textTranslateY = -revealRatio * 30;

  // Calculate dynamic inset clipping
  const totalContainerHeight = scrollDistanceVh + holdDistanceVh + 100;

  return (
    <div
      ref={containerRef}
      className="scroll-expand-container"
      style={{ height: `${totalContainerHeight}vh` }}
    >
      <div className="scroll-expand-sticky">
        {/* Animated Expanding Frame */}
        <div
          className="scroll-expand-frame"
          style={{
            width: `calc(${startWidth} + (100vw - ${startWidth}) * ${easeProgress})`,
            height: `calc(${startHeight} + (100vh - ${startHeight}) * ${easeProgress})`,
            borderRadius: `${currentRadius.toFixed(1)}px`,
          }}
        >
          <img
            src={mediaSrc}
            alt={alt}
            className="scroll-expand-media"
            style={{
              transform: `scale(${currentScale.toFixed(3)})`,
              objectPosition: focalPosition,
            }}
          />

          {/* Ambient Frame Vignette */}
          <div
            className="scroll-expand-vignette"
            style={{ opacity: (1 - easeProgress * 0.7).toFixed(2) }}
          />

          {/* Overlay Text */}
          {(title || subtitle) && (
            <div
              className="scroll-expand-overlay"
              style={{
                opacity: textOpacity.toFixed(2),
                transform: `translateY(${textTranslateY.toFixed(1)}px)`,
                pointerEvents: textOpacity <= 0.05 ? 'none' : 'auto',
              }}
            >
              {subtitle && <span className="scroll-expand-tag">{subtitle}</span>}
              {title && <h2 className="scroll-expand-title">{title}</h2>}
            </div>
          )}
        </div>

        {/* Scroll Prompt Indicator */}
        <div
          className="scroll-expand-indicator"
          style={{
            opacity: Math.max(0, 1 - revealRatio * 4).toFixed(2),
            pointerEvents: 'none',
          }}
        >
          <span className="scroll-indicator-label">{tagline}</span>
          <div className="scroll-indicator-mouse">
            <div className="scroll-indicator-wheel" />
          </div>
        </div>
      </div>
    </div>
  );
}
