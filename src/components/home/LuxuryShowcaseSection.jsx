import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Silk from '../ui/Silk';
import main1Img from '../../../images/main1.png';
import img2 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_39 AM.png';
import img3 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_43 AM.png';
import img4 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_46 AM.png';
import img5 from '../../../images/ChatGPT Image Jul 26, 2026, 12_22_37 AM.png';
import img6 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_57 AM.png';
import img7 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_59 AM.png';
import img8 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_01 AM.png';
import img9 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_03 AM.png';
import img10 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_05 AM.png';
import img11 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_08 AM.png';
import img12 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_10 AM.png';
import img13 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_12 AM.png';
import './LuxuryShowcaseSection.css';

gsap.registerPlugin(ScrollTrigger);

/*
  Anti-Gravity Scroll Section — With React Bits Silk Background
  ─────────────────────────────────────────────────────────────
  Desktop:
    Chapter 1 (0%–25%):   Hero card pinned, scatter pieces visible around it over Silk shader.
    Chapter 2 (25%–55%):  Breakdown → scatter pieces fly outward with parallax depth
                          → settle into 6-tile mosaic grid over Silk shader.
    Chapter 3 (55%–100%): Emerald necklace mosaic tile detaches & slides gracefully
                          into equal 50/50 split layout.

  Mobile:
    Scroll-driven 3D Card Ring Orbiting in real 3D space around the user.
*/

const SCATTER_IMAGES = [img2, img3, img4, img5, img6, img7];
// Tile 4 (index 4: img5 Emerald Necklace) is the picked tile that slides right
const MOSAIC_IMAGES = [img8, img9, img10, img11, img5, img13];
const PICKED_TILE_INDEX = 4;

const SCATTER_TARGETS = [
  { x: -320, y: -220, rotate: -18, scale: 0.85 },
  { x: 300, y: -250, rotate: 14, scale: 0.9 },
  { x: -350, y: 200, rotate: 22, scale: 0.8 },
  { x: 330, y: 230, rotate: -16, scale: 0.85 },
  { x: -420, y: 0, rotate: -10, scale: 0.75 },
  { x: 400, y: -20, rotate: 12, scale: 0.78 },
];

const MOBILE_RING_CARDS = [
  {
    id: 1,
    title: 'Imperial Halo Solitaire',
    category: 'Rings',
    metal: '18K Yellow Gold',
    price: '₹2,85,000',
    badge: '01 · HALO RING',
    image: main1Img,
    slug: 'celestial-diamond-solitaire-ring',
  },
  {
    id: 2,
    title: 'Royal Emerald Heritage',
    category: 'Necklaces',
    metal: '22K Gold & Emerald',
    price: '₹8,50,000',
    badge: '02 · ROYAL SUITE',
    image: img5,
    slug: 'maharani-bridal-necklace-set',
  },
  {
    id: 3,
    title: 'Starlight Diamond Line',
    category: 'Bracelets',
    metal: '18K White Gold',
    price: '₹4,25,000',
    badge: '03 · BRACELET',
    image: img8,
    slug: 'infinity-diamond-tennis-bracelet',
  },
  {
    id: 4,
    title: 'Celestial Drop Solitaire',
    category: 'Earrings',
    metal: '18K Rose Gold',
    price: '₹1,65,000',
    badge: '04 · EARRINGS',
    image: img10,
    slug: 'royal-emerald-drop-earrings',
  },
  {
    id: 5,
    title: 'Aura Diamond Pendant',
    category: 'Pendants',
    metal: 'Platinum & Gold',
    price: '₹1,95,000',
    badge: '05 · PENDANT',
    image: img9,
    slug: 'celestial-diamond-solitaire-ring',
  },
  {
    id: 6,
    title: 'Elysian Bridal Choker',
    category: 'Bridal',
    metal: '22K Temple Gold',
    price: '₹6,40,000',
    badge: '06 · BRIDAL',
    image: img13,
    slug: 'maharani-bridal-necklace-set',
  },
];

export default function LuxuryShowcaseSection() {
  const outerRef = useRef(null);
  const stickyRef = useRef(null);
  const heroCardRef = useRef(null);
  const piecesRef = useRef([]);
  const mosaicRef = useRef(null);
  const mosaicTilesRef = useRef([]);
  const productTextRef = useRef(null);
  const imageTargetRef = useRef(null);
  const ringCardsRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia(outerRef);

    // ── DESKTOP VIEW (>= 769px) — Preserved 100% untouched ──
    mm.add('(min-width: 769px)', () => {
      const pickedTile = mosaicTilesRef.current[PICKED_TILE_INDEX];
      const imageTarget = imageTargetRef.current;
      const stickyEl = stickyRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: false,
        },
      });

      // ── CHAPTER 1→2: Hero card shrinks & fades ──
      tl.to(
        heroCardRef.current,
        { scale: 0.5, opacity: 0, y: -80, duration: 35, ease: 'power2.inOut' },
        0
      );

      // ── CHAPTER 2: Scatter pieces fly outward ──
      piecesRef.current.forEach((piece, i) => {
        if (!piece) return;
        const target = SCATTER_TARGETS[i];
        const staggerOffset = i * 1.5;

        tl.to(piece, {
          x: target.x, y: target.y,
          rotation: target.rotate, scale: target.scale,
          opacity: 0.6, duration: 25, ease: 'power2.out',
        }, 5 + staggerOffset);

        tl.to(piece, {
          opacity: 0, scale: 0.4, duration: 15, ease: 'power2.in',
        }, 35);
      });

      // ── CHAPTER 2: Mosaic grid fades in ──
      tl.fromTo(
        mosaicRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 20, ease: 'power2.out' },
        35
      );

      // ── CHAPTER 3: Fade out OTHER mosaic tiles (0, 1, 2, 3, 5) ──
      mosaicTilesRef.current.forEach((tile, i) => {
        if (!tile || i === PICKED_TILE_INDEX) return;
        tl.to(tile, {
          opacity: 0,
          scale: 0.8,
          duration: 15,
          ease: 'power2.in',
        }, 55);
      });

      // ── CHAPTER 3: Absolute Pixel-Perfect Tile Detach & Morph ──
      if (pickedTile && imageTarget && stickyEl) {
        const stickyBox = stickyEl.getBoundingClientRect();
        const tileBox = pickedTile.getBoundingClientRect();
        const targetBox = imageTarget.getBoundingClientRect();

        const initialLeft = tileBox.left - stickyBox.left;
        const initialTop = tileBox.top - stickyBox.top;
        const initialW = tileBox.width;
        const initialH = tileBox.height;

        const targetLeft = targetBox.left - stickyBox.left;
        const targetTop = targetBox.top - stickyBox.top;
        const targetW = targetBox.width;
        const targetH = targetBox.height;

        tl.to(pickedTile, {
          position: 'absolute',
          gridArea: 'auto',
          left: initialLeft,
          top: initialTop,
          width: initialW,
          height: initialH,
          margin: 0,
          duration: 0.1,
        }, 55);

        tl.to(pickedTile, {
          left: targetLeft,
          top: targetTop,
          width: targetW,
          height: targetH,
          borderRadius: '20px',
          zIndex: 35,
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(188, 156, 108, 0.25)',
          duration: 22,
          ease: 'power2.inOut',
        }, 56);
      }

      // ── CHAPTER 3: Slide in left headline, description & CTA button ──
      tl.fromTo(
        productTextRef.current,
        { opacity: 0, x: -70 },
        { opacity: 1, x: 0, duration: 20, ease: 'power2.out' },
        62
      );
    });

    // ── MOBILE VIEW (<= 768px) — 3D Scroll Card Ring ──
    mm.add('(max-width: 768px)', () => {
      const numCards = MOBILE_RING_CARDS.length;
      const angleStep = (2 * Math.PI) / numCards;
      const totalRotationAngle = Math.PI * 2 * 1.8; // 648 degrees rotation journey

      const updateCardPositions = (currentRotation) => {
        // Horizontal radius dynamically tuned to mobile viewport
        const Rx = Math.min(window.innerWidth * 0.36, 140);
        const Rz = 185; // Depth radius

        ringCardsRef.current.forEach((cardEl, idx) => {
          if (!cardEl) return;
          const angle = idx * angleStep + currentRotation;
          
          const x = Math.sin(angle) * Rx;
          const z = Math.cos(angle) * Rz;
          
          // Normalized depth: 1 = closest (front), 0 = farthest (back)
          const depthFactor = (z + Rz) / (2 * Rz);
          
          // Smooth scale based on depth (0.72 at back -> 1.08 at front)
          const scale = 0.72 + 0.36 * Math.pow(depthFactor, 1.15);
          
          // Opacity based on depth (0.32 at back -> 1.0 at front)
          const opacity = 0.32 + 0.68 * Math.pow(depthFactor, 1.3);
          
          // Depth blur (3.5px at back -> 0px at front)
          const blur = Math.max(0, (1 - depthFactor) * 3.5);
          
          // Natural tangential Y-rotation around the 3D ring
          const rotateY = -Math.sin(angle) * 32;
          
          // Dynamic z-index
          const zIndex = Math.round(depthFactor * 100);

          cardEl.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
          cardEl.style.opacity = opacity.toFixed(3);
          cardEl.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
          cardEl.style.zIndex = zIndex;
        });
      };

      // Initial card layout at rotation 0
      updateCardPositions(0);

      // Continuous scroll-driven rotation timeline
      gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: false,
          onUpdate: (self) => {
            const rot = self.progress * totalRotationAngle;
            updateCardPositions(rot);
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={outerRef} className="antigravity-outer">
      <div ref={stickyRef} className="antigravity-sticky">

        {/* ── FULL-SCREEN REACT BITS SILK SHADER BACKGROUND ── */}
        <div className="ag-silk-bg-container">
          <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
        </div>

        {/* ════════════════════════════════════════════════════════════
            MOBILE 3D SCROLL CARD RING (Visible on <= 768px)
            ════════════════════════════════════════════════════════════ */}
        <div className="ag-mobile-3d-ring-stage">
          {/* Header HUD */}
          <div className="ag-mobile-ring-hud">
            <span className="ag-mobile-ring-tag">00 HALO • GOLDSMITHS</span>
            <h3 className="ag-mobile-ring-title">3D Atelier Ring</h3>
            <span className="ag-mobile-ring-subtitle">Scroll to Rotate Orbit</span>
          </div>

          {/* 3D Viewport Track */}
          <div className="ag-mobile-3d-ring-track">
            {MOBILE_RING_CARDS.map((card, i) => (
              <div
                key={card.id}
                ref={el => (ringCardsRef.current[i] = el)}
                className="ag-3d-ring-card"
              >
                <Link to={`/product/${card.slug}`} className="ag-3d-ring-card-inner">
                  {/* Image Box */}
                  <div className="ag-3d-ring-img-box">
                    <img src={card.image} alt={card.title} className="ag-3d-ring-img" />
                    <span className="ag-3d-ring-badge">{card.badge}</span>
                  </div>

                  {/* Card Content */}
                  <div className="ag-3d-ring-card-body">
                    <span className="ag-3d-ring-meta">{card.category} · {card.metal}</span>
                    <h4 className="ag-3d-ring-name">{card.title}</h4>
                    <div className="ag-3d-ring-price-row">
                      <span className="ag-3d-ring-price">{card.price}</span>
                      <span className="ag-3d-ring-cta">Explore →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom HUD Indicator */}
          <div className="ag-mobile-ring-indicator">
            <span className="ag-ring-indicator-dot" />
            <span className="ag-ring-indicator-text">Continuous 3D Orbit</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            DESKTOP SHOWCASE (Visible on >= 769px)
            ════════════════════════════════════════════════════════════ */}

        {/* ── HERO CARD (Chapter 1) ── */}
        <div ref={heroCardRef} className="ag-hero-card">
          <img src={main1Img} alt="Goldsmiths Imperial Collection" />
          <div className="ag-hero-overlay">
            <span className="ag-hero-badge">00 HALO • GOLDSMITHS</span>
            <h2 className="ag-hero-title">Imperial Heritage</h2>
          </div>
        </div>

        {/* ── SCATTER PIECES (Chapter 1 → 2) ── */}
        {SCATTER_TARGETS.map((_, i) => (
          <div
            key={i}
            ref={el => (piecesRef.current[i] = el)}
            className={`ag-scatter-piece ag-piece-${i + 1}`}
          >
            <img
              src={SCATTER_IMAGES[i]}
              alt={`Jewellery piece ${i + 1}`}
              className="ag-piece-img"
            />
          </div>
        ))}

        {/* ── MOSAIC GRID (Chapter 2 → 3 transition) ── */}
        <div ref={mosaicRef} className="ag-mosaic-layer" style={{ opacity: 0 }}>
          {MOSAIC_IMAGES.map((src, i) => (
            <div
              key={i}
              ref={el => (mosaicTilesRef.current[i] = el)}
              className={`ag-mosaic-tile ${i === PICKED_TILE_INDEX ? 'ag-mosaic-tile--picked' : ''}`}
            >
              <img
                src={src}
                alt={`Mosaic tile ${i + 1}`}
                className="ag-mosaic-tile-img"
              />
            </div>
          ))}
        </div>

        {/* ── EQUAL 50/50 SPLIT CONTAINER (Chapter 3) ── */}
        <div className="ag-split-container">
          <div ref={productTextRef} className="ag-split-left" style={{ opacity: 0 }}>
            <span className="ag-product-tag">THE GOLDSMITHS EXPERIENCE</span>
            <h2 className="ag-product-headline">
              Make Live Jewellery at Goldsmiths
            </h2>
            <p className="ag-product-desc">
              Our digital showroom transforms your browsing into an immersive
              luxury experience. Every scroll reveals a new facet of master
              craftsmanship — from initial diamond selection to final polish.
            </p>
            <button className="btn btn-primary ag-product-btn">
              EXPLORE BESPOKE CRAFT
            </button>
          </div>

          {/* Target destination box for the picked mosaic tile */}
          <div ref={imageTargetRef} className="ag-split-right-target" />
        </div>

      </div>
    </div>
  );
}
