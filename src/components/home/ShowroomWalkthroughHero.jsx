import { useState, useEffect, useRef, useCallback } from 'react';
import './ShowroomWalkthroughHero.css';

const TOTAL_FRAMES = 300;
const SCROLL_HEIGHT_VH = 450; // Scroll runway in vh units

// Pre-generate all frame paths
const framePaths = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');
  return `/hero-frames/ezgif-frame-${num}.jpg`;
});

// Text overlay phases: [startProgress, endProgress, headline, subtitle]
const textPhases = [
  [0.0, 0.18, 'Welcome to', 'Goldsmiths Jewellers'],
  [0.24, 0.48, 'Crafted for', 'Eternity & Perfection'],
  [0.54, 0.78, 'Discover Rare', 'Diamonds & Fine Gold'],
  [0.84, 1.0, 'Step Into Our', 'World of Luxury'],
];

export default function ShowroomWalkthroughHero() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [preloaderHidden, setPreloaderHidden] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);

  // ─── Preload all frames ───
  useEffect(() => {
    let mounted = true;
    const images = new Array(TOTAL_FRAMES);
    let loaded = 0;

    const loadImage = (index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          images[index] = img;
          loaded++;
          if (mounted) setLoadedCount(loaded);
          resolve();
        };
        img.onerror = () => {
          // On error, still count it so we don't block forever
          images[index] = null;
          loaded++;
          if (mounted) setLoadedCount(loaded);
          resolve();
        };
        img.src = framePaths[index];
      });
    };

    // Load in batches of 20 for network efficiency
    const loadAll = async () => {
      const batchSize = 20;
      for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }

      if (mounted) {
        imagesRef.current = images;
        setIsLoaded(true);
        // Draw first frame immediately
        drawFrame(0, images);
        // Fade out preloader after a short delay
        setTimeout(() => {
          if (mounted) setPreloaderHidden(true);
        }, 600);
      }
    };

    loadAll();

    return () => { mounted = false; };
  }, []);

  // ─── Draw a frame to the canvas ───
  const drawFrame = useCallback((frameIndex, imageArray) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const images = imageArray || imagesRef.current;
    const img = images[frameIndex];
    if (!img) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Set canvas resolution for high-DPI displays
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Object-fit: cover math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawW, drawH, drawX, drawY;

    if (imgRatio > canvasRatio) {
      // Image is wider — crop sides
      drawH = canvas.height;
      drawW = drawH * imgRatio;
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    } else {
      // Image is taller — crop top/bottom
      drawW = canvas.width;
      drawH = drawW / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // ─── Scroll handler with RAF ───
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableDistance = container.offsetHeight - window.innerHeight;

        // How far into the container are we?
        // rect.top starts positive (below viewport) and goes negative as we scroll
        const scrolled = -rect.top;
        const rawProgress = scrolled / scrollableDistance;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(clampedProgress * (TOTAL_FRAMES - 1))
        );

        setProgress(clampedProgress);
        setCurrentFrame(targetFrame);

        // Only redraw if frame actually changed
        if (targetFrame !== lastDrawnFrameRef.current) {
          drawFrame(targetFrame);
          lastDrawnFrameRef.current = targetFrame;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, drawFrame]);

  // ─── Handle window resize ───
  useEffect(() => {
    if (!isLoaded) return;

    const handleResize = () => {
      // Redraw current frame at new resolution
      drawFrame(lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, drawFrame]);

  // ─── Derived state ───
  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  const circumference = 2 * Math.PI * 52; // r=52 for the SVG ring
  const dashOffset = circumference - (circumference * loadPercent) / 100;

  return (
    <div className="showroom-hero-wrapper">
      {/* ─── Luxury Preloader ─── */}
      <div className={`showroom-preloader ${preloaderHidden ? 'hidden' : ''}`}>
        <div className="preloader-brand">GOLDSMITHS</div>
        <div className="preloader-subtitle">Jewellers</div>
        <div className="preloader-ring-container">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BC9C6C" />
                <stop offset="50%" stopColor="#D4AF7A" />
                <stop offset="100%" stopColor="#BC9C6C" />
              </linearGradient>
            </defs>
            <circle className="preloader-ring-bg" cx="60" cy="60" r="52" />
            <circle
              className="preloader-ring-progress"
              cx="60"
              cy="60"
              r="52"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="preloader-percent">{loadPercent}%</div>
        </div>
        <div className={`preloader-hint ${isLoaded ? 'visible' : ''}`}>
          Scroll to enter the showroom
        </div>
      </div>

      {/* ─── Scroll Container ─── */}
      <div
        ref={containerRef}
        className="showroom-walkthrough-outer"
        style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      >
        {/* Sticky Viewport */}
        <div className="showroom-walkthrough-sticky">
          <canvas ref={canvasRef} />

          {/* Floating Text Overlays */}
          <div className="showroom-overlay-text">
            {textPhases.map(([start, end, line1, line2], i) => {
              const isActive = progress >= start && progress <= end;
              // Fade calculation: fade in during first 15% of range, fade out during last 15%
              const range = end - start;
              const fadeInEnd = start + range * 0.15;
              const fadeOutStart = end - range * 0.15;
              let opacity = 0;
              if (isActive) {
                if (progress < fadeInEnd) {
                  opacity = (progress - start) / (fadeInEnd - start);
                } else if (progress > fadeOutStart) {
                  opacity = (end - progress) / (end - fadeOutStart);
                } else {
                  opacity = 1;
                }
              }

              return (
                <div
                  key={i}
                  className={`showroom-text-block ${isActive ? 'active' : ''}`}
                  style={{
                    opacity: isActive ? opacity : 0,
                    transform: `translateY(${isActive ? 0 : 20}px)`,
                  }}
                >
                  <div className="showroom-text-headline">{line1}</div>
                  <div className="showroom-text-sub">{line2}</div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator — visible only near the beginning */}
          <div
            className={`showroom-scroll-indicator ${
              progress < 0.05 && isLoaded ? 'visible' : ''
            }`}
          >
            <div className="scroll-mouse">
              <div className="scroll-mouse-dot" />
            </div>
            <span className="scroll-indicator-text">Scroll to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
