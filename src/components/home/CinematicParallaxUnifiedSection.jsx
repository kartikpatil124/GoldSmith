import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import main1Img from '../../../images/main1.png';
import img2 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_39 AM.png';
import img3 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_43 AM.png';
import img4 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_46 AM.png';
import img5 from '../../../images/ChatGPT Image Jul 26, 2026, 12_22_37 AM.png';
import img6 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_57 AM.png';
import img8 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_01 AM.png';
import img9 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_03 AM.png';
import img10 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_05 AM.png';
import img11 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_08 AM.png';
import img12 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_10 AM.png';
import img13 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_12 AM.png';
import './CinematicParallaxUnifiedSection.css';

gsap.registerPlugin(ScrollTrigger);

/*
  CinematicParallaxUnifiedSection
  ─────────────────────────────────────────────────────────────
  ONE Continuous Pinned Scroll Timeline:
  1. Scroll-Expand: main1.png expands from tight jewelry crop to full-bleed
  2. Bridge: Same full-screen image seamlessly anchors the transition
  3. Parallax: Dual columns counter-glide (Left UP, Right DOWN) over the atmosphere
*/

const LEFT_ITEMS = [
  {
    title: 'Emerald Tear Drops',
    tag: 'ROYAL EMERALD',
    slug: 'royal-emerald-drop-earrings',
    image: img2,
  },
  {
    title: 'Sapphire Heart Gem',
    tag: '18K ROSE GOLD',
    slug: 'sapphire-heart-pendant',
    image: img4,
  },
  {
    title: 'Elysian Heritage Choker',
    tag: 'TEMPLE GOLD',
    slug: 'maharani-bridal-necklace-set',
    image: img6,
  },
  {
    title: 'Solitaire Platinum Drop',
    tag: 'CERTIFIED VS1',
    slug: 'celestial-diamond-solitaire-ring',
    image: img10,
  },
  {
    title: 'Imperial Cascade Earrings',
    tag: 'ATELIER 08',
    slug: 'royal-emerald-drop-earrings',
    image: img12,
  },
];

const RIGHT_ITEMS = [
  {
    title: 'Infinity Diamond Tennis',
    tag: '18K WHITE GOLD',
    slug: 'infinity-diamond-tennis-bracelet',
    image: img3,
  },
  {
    title: 'Maharani Bridal Suite',
    tag: '22K RUBY & GOLD',
    slug: 'maharani-bridal-necklace-set',
    image: img5,
  },
  {
    title: 'Floral Heritage Bangles',
    tag: '22K HANDCRAFTED',
    slug: 'floral-gold-bangle-set',
    image: img8,
  },
  {
    title: 'Serpentine Gold Rope',
    tag: 'HIGH POLISH',
    slug: 'serpentine-gold-chain',
    image: img9,
  },
  {
    title: 'Diamond Line Bracelet',
    tag: 'BRILLIANT CUT',
    slug: 'infinity-diamond-tennis-bracelet',
    image: img11,
  },
  {
    title: 'Masterpiece Gold Choker',
    tag: 'ROYAL BRIDAL',
    slug: 'maharani-bridal-necklace-set',
    image: img13,
  },
];

export default function CinematicParallaxUnifiedSection() {
  const runwayRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const revealOverlayRef = useRef(null);
  const indicatorRef = useRef(null);
  const bgDimmerRef = useRef(null);
  const parallaxGalleryRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    if (!runwayRef.current || !stageRef.current || !frameRef.current) return;

    const ctx = gsap.context(() => {
      const scrollDistancePx = window.innerHeight * 2.8; // 280vh runway

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: runwayRef.current,
          start: 'top top',
          end: `+=${scrollDistancePx}`,
          pin: stageRef.current,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Timeline Duration = 1.0
      // Phase 1 (0.00 -> 0.40): Scroll-Expand Animation
      tl.fromTo(
        frameRef.current,
        {
          width: '82vw',
          height: '40vh',
          borderRadius: '34px',
        },
        {
          width: '100vw',
          height: '100dvh',
          borderRadius: '0px',
          duration: 0.40,
          ease: 'power2.inOut',
        },
        0
      );

      // Image Zoom-Out (1.38 -> 1.0)
      if (mediaRef.current) {
        tl.fromTo(
          mediaRef.current,
          { scale: 1.38 },
          { scale: 1.0, duration: 0.40, ease: 'power2.inOut' },
          0
        );
      }

      // Title Overlay Fade-out
      if (revealOverlayRef.current) {
        tl.to(
          revealOverlayRef.current,
          { opacity: 0, y: -25, duration: 0.15, ease: 'power1.out' },
          0
        );
      }

      // Scroll Prompt Indicator Fade-out
      if (indicatorRef.current) {
        tl.to(
          indicatorRef.current,
          { opacity: 0, duration: 0.10, ease: 'power1.out' },
          0
        );
      }

      // Phase 2 (0.38 -> 0.48): Bridge & Atmospheric Overlay
      // main1.png hits 100% full-bleed and darkens slightly as the gallery fades in
      if (bgDimmerRef.current) {
        tl.fromTo(
          bgDimmerRef.current,
          { opacity: 0 },
          { opacity: 0.88, duration: 0.10, ease: 'power1.inOut' },
          0.38
        );
      }

      if (parallaxGalleryRef.current) {
        tl.fromTo(
          parallaxGalleryRef.current,
          { opacity: 0, pointerEvents: 'none' },
          { opacity: 1, pointerEvents: 'auto', duration: 0.08, ease: 'power1.inOut' },
          0.40
        );
      }

      // Phase 3 (0.44 -> 0.95): 2-Column Counter Parallax
      // LEFT Column moves UPWARD (starts low, glides high)
      if (leftColRef.current) {
        tl.fromTo(
          leftColRef.current,
          { yPercent: 45 },
          { yPercent: -50, duration: 0.51, ease: 'none' },
          0.44
        );
      }

      // RIGHT Column moves DOWNWARD (starts high, glides low)
      if (rightColRef.current) {
        tl.fromTo(
          rightColRef.current,
          { yPercent: -50 },
          { yPercent: 45, duration: 0.51, ease: 'none' },
          0.44
        );
      }

      // Phase 4 (0.95 -> 1.00): Hold before releasing stage
      tl.to({}, { duration: 0.05 }, 0.95);
    }, runwayRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cinematic-parallax-unified-section">
      <div ref={runwayRef} className="unified-scroll-runway">
        {/* Pinned Viewport Stage */}
        <div ref={stageRef} className="unified-pinned-stage">
          {/* Expanding Media Frame (main1.png) */}
          <div ref={frameRef} className="unified-expand-frame">
            <img
              ref={mediaRef}
              src={main1Img}
              alt="Royal Atelier Diamond Masterpiece"
              className="unified-expand-media"
            />

            {/* Ambient Initial Vignette */}
            <div className="unified-initial-vignette" />

            {/* Initial Title Overlay */}
            <div ref={revealOverlayRef} className="unified-reveal-overlay">
              <span className="unified-reveal-tag">ROYAL ATELIER</span>
              <h2 className="unified-reveal-title">The Imperial Diamond Masterpiece</h2>
            </div>
          </div>

          {/* Atmospheric Dimmer over main1.png when Parallax activates */}
          <div ref={bgDimmerRef} className="unified-bg-dimmer" />

          {/* 2-Column Counter-Parallax Gallery Layer */}
          <div ref={parallaxGalleryRef} className="unified-parallax-layer">
            <div className="unified-parallax-header">
              <span className="unified-parallax-badge">DUAL PARALLAX EXHIBITION</span>
              <h3 className="unified-parallax-title">The Atelier Archive</h3>
            </div>

            <div className="unified-dual-track">
              {/* Left Column (Travels Upward) */}
              <div ref={leftColRef} className="unified-column col-left">
                {LEFT_ITEMS.map((item, idx) => (
                  <Link
                    key={`left-${idx}`}
                    to={`/product/${item.slug}`}
                    className="unified-gallery-card"
                    aria-label={`View ${item.title}`}
                  >
                    <div className="unified-card-img-wrap">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className="unified-card-gradient" />
                    </div>
                    <div className="unified-card-info">
                      <span className="unified-card-tag">{item.tag}</span>
                      <h4 className="unified-card-name">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Column (Travels Downward) */}
              <div ref={rightColRef} className="unified-column col-right">
                {RIGHT_ITEMS.map((item, idx) => (
                  <Link
                    key={`right-${idx}`}
                    to={`/product/${item.slug}`}
                    className="unified-gallery-card"
                    aria-label={`View ${item.title}`}
                  >
                    <div className="unified-card-img-wrap">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className="unified-card-gradient" />
                    </div>
                    <div className="unified-card-info">
                      <span className="unified-card-tag">{item.tag}</span>
                      <h4 className="unified-card-name">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Prompt Indicator */}
          <div ref={indicatorRef} className="unified-scroll-indicator">
            <span className="unified-indicator-label">SCROLL TO REVEAL</span>
            <div className="unified-indicator-mouse">
              <div className="unified-indicator-wheel" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
