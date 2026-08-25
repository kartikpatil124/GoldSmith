import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import main1Img from '../../../images/main1.png';
import img2 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_39 AM.png';
import img3 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_43 AM.png';
import img4 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_46 AM.png';
import img5 from '../../../images/ChatGPT Image Jul 26, 2026, 12_22_37 AM.png';
import img6 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_57 AM.png';
import img8 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_01 AM.png';
import img9 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_03 AM.png';
import img10 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_05 AM.png';
import img13 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_12 AM.png';
import './MobileArcGallerySection.css';

/*
  Mobile Arc Gallery Section
  ─────────────────────────────────────────────────────────────
  Curved arch product lineup spanning from bottom-left corner,
  arching over the top center, and descending to the bottom-right corner.
  Supports smooth touch-drag / swipe rotation with inertia physics.
*/

const ARC_CARDS = [
  {
    id: 'arc-1',
    title: 'Halo Solitaire',
    tag: '0034 - 0095',
    edition: 'IMPERIAL',
    metal: '18K Yellow Gold',
    price: '₹2,85,000',
    image: main1Img,
    theme: 'card-theme-cream',
    slug: 'celestial-diamond-solitaire-ring',
  },
  {
    id: 'arc-2',
    title: 'Emerald Suite',
    tag: 'ROYAL DESK',
    edition: 'HERITAGE',
    metal: '22K Gold & Emerald',
    price: '₹8,50,000',
    image: img5,
    theme: 'card-theme-olive',
    slug: 'maharani-bridal-necklace-set',
  },
  {
    id: 'arc-3',
    title: 'Tennis Diamond',
    tag: 'NORTH AVE',
    edition: 'LIMITED',
    metal: '18K White Gold',
    price: '₹4,25,000',
    image: img8,
    theme: 'card-theme-sage',
    slug: 'infinity-diamond-tennis-bracelet',
  },
  {
    id: 'arc-4',
    title: 'Drop Solitaire',
    tag: 'ULTIMATE TASTE',
    edition: 'ATELIER',
    metal: '18K Rose Gold',
    price: '₹1,65,000',
    image: img10,
    theme: 'card-theme-cream',
    slug: 'royal-emerald-drop-earrings',
  },
  {
    id: 'arc-5',
    title: 'Aura Pendant',
    tag: 'EST. 1924',
    edition: 'FINE GOLD',
    metal: 'Platinum & Gold',
    price: '₹1,95,000',
    image: img9,
    slug: 'celestial-diamond-solitaire-ring',
  },
  {
    id: 'arc-6',
    title: 'Bridal Choker',
    tag: 'ROYAL SUITE',
    edition: 'BESPOKE',
    metal: '22K Temple Gold',
    price: '₹6,40,000',
    image: img13,
    theme: 'card-theme-olive',
    slug: 'maharani-bridal-necklace-set',
  },
  {
    id: 'arc-7',
    title: 'Luxe Bangle',
    tag: 'NOV 2026',
    edition: 'SIGNATURE',
    metal: '18K Solid Gold',
    price: '₹3,10,000',
    image: img2,
    theme: 'card-theme-sage',
    slug: 'infinity-diamond-tennis-bracelet',
  },
  {
    id: 'arc-8',
    title: 'Pavé Band',
    tag: 'BARCELONA',
    edition: 'CHIC',
    metal: '18K Yellow Gold',
    price: '₹1,45,000',
    image: img3,
    theme: 'card-theme-dark',
    slug: 'celestial-diamond-solitaire-ring',
  },
];

export default function MobileArcGallerySection() {
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const animFrame = useRef(null);
  const currentRotation = useRef(0);

  const numCards = ARC_CARDS.length;
  const angleSpread = 26; // degrees between cards along the arch

  // Arc physics parameters
  // Circle center placed below the viewport to create the convex arch spanning left-to-right
  const RADIUS = 340; // pixel radius of the arch
  const CENTER_Y = 430; // vertical offset of arc center

  const applyInertia = useCallback(() => {
    if (Math.abs(velocity.current) > 0.05) {
      currentRotation.current += velocity.current;
      velocity.current *= 0.94; // friction
      setRotation(currentRotation.current);
      animFrame.current = requestAnimationFrame(applyInertia);
    }
  }, []);

  // Touch & Pointer Gesture Handlers
  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    lastX.current = startX.current;
    velocity.current = 0;
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - lastX.current;
    lastX.current = clientX;

    // Convert horizontal pixel drag into rotational angular displacement
    const angleDelta = deltaX * 0.18;
    currentRotation.current += angleDelta;
    velocity.current = angleDelta;
    setRotation(currentRotation.current);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    applyInertia();
  };

  useEffect(() => {
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <section className="mobile-arc-gallery-section">
      {/* Header HUD */}
      <div className="mobile-arc-header">
        <span className="mobile-arc-badge">01 • CURATED ARCH</span>
        <h2 className="mobile-arc-title">Atelier Masterpieces</h2>
        <p className="mobile-arc-subtitle">Swipe across the arc to explore</p>
      </div>

      {/* Interactive Curved Arc Stage */}
      <div
        ref={containerRef}
        className="mobile-arc-stage"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div className="mobile-arc-track">
          {ARC_CARDS.map((card, i) => {
            // Calculate card position along the convex arc
            const baseAngleDeg = (i - (numCards - 1) / 2) * angleSpread;
            const totalAngleDeg = baseAngleDeg + rotation;
            const rad = (totalAngleDeg * Math.PI) / 180;

            // Mathematical circular coordinates
            const x = Math.sin(rad) * RADIUS;
            const y = CENTER_Y - Math.cos(rad) * RADIUS;

            // Tangential rotation (curves naturally along the path)
            const cardRotate = totalAngleDeg;

            // Distance from center for subtle scale/opacity falloff
            const normalizedAngle = Math.abs(totalAngleDeg);
            const isVisible = normalizedAngle < 110;
            const scale = Math.max(0.75, 1 - (normalizedAngle / 130) * 0.28);
            const opacity = normalizedAngle > 85 ? Math.max(0, 1 - (normalizedAngle - 85) / 25) : 1;

            if (!isVisible) return null;

            return (
              <div
                key={card.id}
                className={`mobile-arc-card ${card.theme}`}
                style={{
                  transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0px) rotate(${cardRotate.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                  opacity: opacity.toFixed(3),
                  zIndex: Math.round(100 - normalizedAngle),
                }}
              >
                <Link to={`/product/${card.slug}`} className="mobile-arc-card-link">
                  {/* Top Header Row of Card */}
                  <div className="mobile-arc-card-top">
                    <span className="mobile-arc-card-tag">{card.tag}</span>
                    <span className="mobile-arc-card-edition">{card.edition}</span>
                  </div>

                  {/* Product Visual Centerpiece */}
                  <div className="mobile-arc-card-visual">
                    <img src={card.image} alt={card.title} className="mobile-arc-card-img" />
                  </div>

                  {/* Bottom Info Details */}
                  <div className="mobile-arc-card-bottom">
                    <h3 className="mobile-arc-card-name">{card.title}</h3>
                    <div className="mobile-arc-card-price-row">
                      <span className="mobile-arc-card-metal">{card.metal}</span>
                      <span className="mobile-arc-card-price">{card.price}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Swipe Indicator */}
      <div className="mobile-arc-drag-hint">
        <span className="mobile-arc-drag-arrow">←</span>
        <span className="mobile-arc-drag-label">SWIPE OR DRAG THE ARC</span>
        <span className="mobile-arc-drag-arrow">→</span>
      </div>
    </section>
  );
}
