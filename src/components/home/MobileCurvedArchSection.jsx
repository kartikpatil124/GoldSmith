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
import './MobileCurvedArchSection.css';

/*
  Mobile Curved Squircle Arch Carousel
  ─────────────────────────────────────────────────────────────
  Curved arc wheel of stylized squircle cards fanning out in a
  convex semi-circular trajectory with smooth touch/drag physics,
  tangential rotation, and luxury Goldsmiths brand storytelling.
*/

const ARCH_CARDS = [
  {
    id: 1,
    type: 'noir-text',
    bg: '#141412',
    color: '#FFFFFF',
    topText: 'SEVILLA',
    bottomText: 'BARCELONA',
    image: main1Img,
    badge: 'HALO · 01',
    slug: 'celestial-diamond-solitaire-ring',
  },
  {
    id: 2,
    type: 'split-archival',
    bg: '#EAE6DF',
    color: '#1A1A1A',
    image: img2,
    codeTop: '0034',
    codeBottom: '0095',
    tag: 'HERITAGE',
    slug: 'royal-emerald-drop-earrings',
  },
  {
    id: 3,
    type: 'portrait-mood',
    bg: '#1E251E',
    color: '#EAE6DF',
    image: img4,
    centerText: 'ATELIER',
    badge: 'BESPOKE 03',
    slug: 'infinity-diamond-tennis-bracelet',
  },
  {
    id: 4,
    type: 'polaroid-frame',
    bg: '#2C3428',
    color: '#FFFFFF',
    image: img5,
    caption: 'north ave',
    badge: 'COLOMBIAN',
    slug: 'maharani-bridal-necklace-set',
  },
  {
    id: 5,
    type: 'oval-quote',
    bg: '#F2EFE9',
    color: '#1C1C1A',
    image: img3,
    quote: 'Maple Street is a lovely avenue with lush gold',
    dash: '—',
    slug: 'solitaire-diamond-pendant',
  },
  {
    id: 6,
    type: 'bokeh-vertical',
    bg: '#EFEBE2',
    color: '#263024',
    verticalText: 'ULTIMATE TASTE',
    image: img8,
    slug: 'elysian-bridal-heritage-choker',
  },
  {
    id: 7,
    type: 'noir-gold',
    bg: '#121210',
    color: '#F4D099',
    topText: 'ATELIER',
    bottomText: 'IMPERIAL',
    image: img9,
    badge: 'BIS · 916',
    slug: 'celestial-diamond-solitaire-ring',
  },
  {
    id: 8,
    type: 'archival-date',
    bg: '#252D23',
    color: '#FFFFFF',
    image: img6,
    caption: 'NOV',
    badge: 'ARCHIVE 08',
    slug: 'maharani-bridal-necklace-set',
  },
];

export default function MobileCurvedArchSection() {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(3);
  const [currentAngle, setCurrentAngle] = useState(0);

  // Drag physics state refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const targetAngleRef = useRef(0);
  const animFrameRef = useRef(null);

  const numCards = ARCH_CARDS.length;
  // Angular step between cards (approx 18 degrees)
  const angleStepDeg = 18;
  const maxAngleDeg = ((numCards - 1) * angleStepDeg) / 2;

  // Center on card index
  const centerOnIndex = useCallback((index) => {
    const target = (Math.floor(numCards / 2) - index) * angleStepDeg;
    targetAngleRef.current = target;
    setActiveIdx(index);
  }, [numCards, angleStepDeg]);

  // Spring / Momentum physics loop
  useEffect(() => {
    let current = currentAngle;

    const animate = () => {
      if (!isDraggingRef.current) {
        // Smooth spring interpolation toward target angle
        const diff = targetAngleRef.current - current;
        current += diff * 0.12;

        if (Math.abs(diff) < 0.05) {
          current = targetAngleRef.current;
        }

        setCurrentAngle(current);

        // Compute closest active card at apex
        const offsetFromCenter = current / angleStepDeg;
        const centerIdx = Math.round(Math.floor(numCards / 2) - offsetFromCenter);
        const clampedIdx = Math.max(0, Math.min(numCards - 1, centerIdx));
        setActiveIdx(clampedIdx);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentAngle, numCards, angleStepDeg]);

  // Touch / Mouse Drag handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    lastAngleRef.current = targetAngleRef.current;
    velocityRef.current = 0;
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startXRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);

    // Convert horizontal pixel drag into angle rotation
    const angleDelta = (deltaX / 300) * 45;
    let newAngle = lastAngleRef.current + angleDelta;

    // Elastic damping past boundaries
    if (newAngle > maxAngleDeg) {
      newAngle = maxAngleDeg + (newAngle - maxAngleDeg) * 0.3;
    } else if (newAngle < -maxAngleDeg) {
      newAngle = -maxAngleDeg + (newAngle - (-maxAngleDeg)) * 0.3;
    }

    velocityRef.current = angleDelta / dt;
    lastTimeRef.current = now;
    targetAngleRef.current = newAngle;
    setCurrentAngle(newAngle);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Apply momentum with snap to nearest card
    let projectedAngle = targetAngleRef.current + velocityRef.current * 80;
    projectedAngle = Math.max(-maxAngleDeg, Math.min(maxAngleDeg, projectedAngle));

    // Snap to nearest integer angle step
    const snappedStep = Math.round(projectedAngle / angleStepDeg);
    targetAngleRef.current = snappedStep * angleStepDeg;
  };

  return (
    <section className="mobile-curved-arch-section">
      {/* Header Badge & Title */}
      <div className="arch-header">
        <span className="arch-badge">CURATED MOOD BOARD</span>
        <h2 className="arch-title">Atelier Masterpieces</h2>
        <p className="arch-subtitle">Swipe through the orbital story</p>
      </div>

      {/* Interactive Arc Wheel Canvas */}
      <div
        ref={containerRef}
        className="arch-wheel-viewport"
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        <div className="arch-cards-track">
          {ARCH_CARDS.map((card, i) => {
            // Calculate angle for this card
            const baseAngleDeg = (i - Math.floor(numCards / 2)) * angleStepDeg;
            const totalAngleDeg = baseAngleDeg + currentAngle;
            const totalAngleRad = (totalAngleDeg * Math.PI) / 180;

            // Convex Arch Math (Circle Arc)
            const arcRadius = 420; // Arc radius in px
            const x = Math.sin(totalAngleRad) * arcRadius;
            const y = (1 - Math.cos(totalAngleRad)) * arcRadius * 0.75; // Arch curve drop

            // Tangential Z-rotation & subtle 3D tilt
            const rotZ = totalAngleDeg;
            const rotY = -totalAngleDeg * 0.22;

            // Distance from apex for scale & opacity
            const distFromApex = Math.abs(totalAngleDeg);
            const scale = Math.max(0.82, 1.04 - (distFromApex / 90) * 0.28);
            const opacity = Math.max(0.65, 1 - (distFromApex / 100) * 0.45);
            const isApex = distFromApex < angleStepDeg / 2;

            return (
              <div
                key={card.id}
                className={`arch-squircle-card ${isApex ? 'is-apex' : ''}`}
                style={{
                  transform: `translate3d(calc(-50% + ${x.toFixed(1)}px), ${y.toFixed(1)}px, 0) rotateZ(${rotZ.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                  opacity: opacity.toFixed(2),
                  zIndex: Math.round(100 - distFromApex),
                  backgroundColor: card.bg,
                  color: card.color,
                }}
                onClick={() => centerOnIndex(i)}
              >
                {/* Render distinct squircle card variations matching reference aesthetic */}
                {card.type === 'noir-text' && (
                  <div className="card-layout-noir-text">
                    <span className="card-top-tag">{card.topText}</span>
                    <div className="card-img-wrap">
                      <img src={card.image} alt={card.bottomText} />
                    </div>
                    <span className="card-bottom-tag">{card.bottomText}</span>
                  </div>
                )}

                {card.type === 'split-archival' && (
                  <div className="card-layout-split">
                    <div className="card-split-left">
                      <img src={card.image} alt="Jewel Bloom" />
                    </div>
                    <div className="card-split-right">
                      <span className="card-code-num">{card.codeTop}</span>
                      <span className="card-code-dash">-</span>
                      <span className="card-code-num">{card.codeBottom}</span>
                    </div>
                  </div>
                )}

                {card.type === 'portrait-mood' && (
                  <div className="card-layout-portrait">
                    <img src={card.image} alt="Mood Portrait" className="card-bg-img" />
                    <div className="card-portrait-overlay">
                      <div className="card-flower-mosaic" />
                    </div>
                  </div>
                )}

                {card.type === 'polaroid-frame' && (
                  <div className="card-layout-polaroid">
                    <div className="card-polaroid-frame">
                      <img src={card.image} alt={card.caption} />
                    </div>
                    <span className="card-polaroid-caption">{card.caption}</span>
                  </div>
                )}

                {card.type === 'oval-quote' && (
                  <div className="card-layout-oval-quote">
                    <div className="card-oval-frame">
                      <img src={card.image} alt="Floral gem" />
                    </div>
                    <p className="card-quote-text">{card.quote}</p>
                    <span className="card-quote-dash">{card.dash}</span>
                  </div>
                )}

                {card.type === 'bokeh-vertical' && (
                  <div className="card-layout-bokeh">
                    <div className="card-bokeh-dots">
                      <div className="bokeh-dot d1" />
                      <div className="bokeh-dot d2" />
                      <div className="bokeh-dot d3" />
                      <div className="bokeh-dot d4" />
                      <div className="bokeh-dot d5" />
                      <div className="bokeh-dot d6" />
                    </div>
                    <span className="card-vertical-text">{card.verticalText}</span>
                  </div>
                )}

                {card.type === 'noir-gold' && (
                  <div className="card-layout-noir-text">
                    <span className="card-top-tag" style={{ color: '#F4D099' }}>{card.topText}</span>
                    <div className="card-img-wrap">
                      <img src={card.image} alt={card.bottomText} />
                    </div>
                    <span className="card-bottom-tag" style={{ color: '#F4D099' }}>{card.bottomText}</span>
                  </div>
                )}

                {card.type === 'archival-date' && (
                  <div className="card-layout-polaroid">
                    <div className="card-polaroid-frame">
                      <img src={card.image} alt={card.caption} />
                    </div>
                    <span className="card-polaroid-caption">{card.caption}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Card Indicator & Action Bar */}
      <div className="arch-action-footer">
        <div className="arch-dots-indicator">
          {ARCH_CARDS.map((_, i) => (
            <button
              key={i}
              className={`arch-dot ${i === activeIdx ? 'active' : ''}`}
              onClick={() => centerOnIndex(i)}
              aria-label={`Jump to slide ${i + 1}`}
            />
          ))}
        </div>

        <Link
          to={`/product/${ARCH_CARDS[activeIdx].slug}`}
          className="arch-explore-cta"
        >
          <span>Explore Masterpiece</span>
          <span className="arch-cta-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
