import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExpand.css';

gsap.registerPlugin(ScrollTrigger);

/*
  ScrollExpand — Pinned GSAP ScrollTrigger Cinematic Reveal
  ─────────────────────────────────────────────────────────────────
  Pins the stage firmly in the viewport and drives a smooth frame
  expansion & zoom-out from the initial jewelry crop to full bleed.
*/

export default function ScrollExpand({
  mediaSrc,
  alt = 'Cinematic Image Reveal',
  startWidth = '82vw',
  startHeight = '40vh',
  startRadius = 34,
  mediaZoom = 1.38,
  focalPosition = 'center 38%',
  scrollDistanceVh = 160,
  holdDistanceVh = 40,
  title = '',
  subtitle = '',
  tagline = 'SCROLL TO REVEAL',
}) {
  const runwayRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const overlayRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    if (!runwayRef.current || !stageRef.current || !frameRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate scroll distance in pixels relative to viewport height
      const totalScrollPx = (scrollDistanceVh + holdDistanceVh) * (window.innerHeight / 100);

      // Create Pinned ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: runwayRef.current,
          start: 'top top',
          end: `+=${totalScrollPx}`,
          pin: stageRef.current,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Total timeline duration = 1.0 (78% reveal, 22% hold)
      const revealDuration = 0.78;

      // 1. Frame Expansion: from initial dimensions -> 100vw × 100dvh, radius -> 0
      tl.fromTo(
        frameRef.current,
        {
          width: startWidth,
          height: startHeight,
          borderRadius: `${startRadius}px`,
        },
        {
          width: '100vw',
          height: '100dvh',
          borderRadius: '0px',
          duration: revealDuration,
          ease: 'power2.inOut',
        },
        0
      );

      // 2. Image Zoom-Out: from mediaZoom -> 1.0
      if (mediaRef.current) {
        tl.fromTo(
          mediaRef.current,
          {
            scale: mediaZoom,
          },
          {
            scale: 1.0,
            duration: revealDuration,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // 3. Text Overlay Fade-Out in early stage
      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          {
            opacity: 0,
            y: -30,
            duration: revealDuration * 0.35,
            ease: 'power1.out',
          },
          0
        );
      }

      // 4. Scroll prompt indicator fade-out immediately
      if (indicatorRef.current) {
        tl.to(
          indicatorRef.current,
          {
            opacity: 0,
            duration: 0.12,
            ease: 'power1.out',
          },
          0
        );
      }

      // 5. Hold Phase: stage stays pinned at 100% full-screen display
      tl.to({}, { duration: 1.0 - revealDuration }, revealDuration);
    }, runwayRef);

    return () => ctx.revert();
  }, [scrollDistanceVh, holdDistanceVh, startWidth, startHeight, startRadius, mediaZoom]);

  return (
    <div ref={runwayRef} className="scroll-expand-runway">
      {/* Pinned Viewport Stage */}
      <div ref={stageRef} className="scroll-expand-stage">
        {/* Animated Expanding Frame */}
        <div
          ref={frameRef}
          className="scroll-expand-frame"
          style={{
            width: startWidth,
            height: startHeight,
            borderRadius: `${startRadius}px`,
          }}
        >
          <img
            ref={mediaRef}
            src={mediaSrc}
            alt={alt}
            className="scroll-expand-media"
            style={{
              objectPosition: focalPosition,
              transform: `scale(${mediaZoom})`,
            }}
          />

          {/* Ambient Frame Vignette */}
          <div className="scroll-expand-vignette" />

          {/* Overlay Text */}
          {(title || subtitle) && (
            <div ref={overlayRef} className="scroll-expand-overlay">
              {subtitle && <span className="scroll-expand-tag">{subtitle}</span>}
              {title && <h2 className="scroll-expand-title">{title}</h2>}
            </div>
          )}
        </div>

        {/* Scroll Prompt Indicator */}
        <div ref={indicatorRef} className="scroll-expand-indicator">
          <span className="scroll-indicator-label">{tagline}</span>
          <div className="scroll-indicator-mouse">
            <div className="scroll-indicator-wheel" />
          </div>
        </div>
      </div>
    </div>
  );
}
