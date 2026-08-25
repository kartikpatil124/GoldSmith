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
import img11 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_08 AM.png';
import img12 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_10 AM.png';
import img13 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_12 AM.png';
import './MobileCurvedArchSection.css';

/*
  Mobile Infinite Continuous 360° Curved Squircle Arch
  ─────────────────────────────────────────────────────────────
  Endless circulating 360-degree orbital ring of squircle cards.
  Cards seamlessly rotate across the top convex arch in an infinite
  smooth loop with zero ends, auto-rotation, and touch drag momentum.
*/

const BASE_CARDS = [
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
  {
    id: 9,
    type: 'oval-quote',
    bg: '#EBE7DE',
    color: '#1A1A1A',
    image: img10,
    quote: 'Royal brilliance set in high polish 18K white gold',
    dash: '—',
    slug: 'royal-emerald-drop-earrings',
  },
  {
    id: 10,
    type: 'noir-text',
    bg: '#161614',
    color: '#F4D099',
    topText: 'GENEVA',
    bottomText: 'LONDON',
    image: img13,
    badge: 'EDITION · 10',
    slug: 'elysian-bridal-heritage-choker',
  },
  {
    id: 11,
    type: 'split-archival',
    bg: '#ECE8E1',
    color: '#1A1A1A',
    image: img11,
    codeTop: '0142',
    codeBottom: '0288',
    tag: 'SOLITAIRE',
    slug: 'infinity-diamond-tennis-bracelet',
  },
  {
    id: 12,
    type: 'polaroid-frame',
    bg: '#273024',
    color: '#FFFFFF',
    image: img12,
    caption: 'mayfair suite',
    badge: 'BESPOKE',
    slug: 'maharani-bridal-necklace-set',
  },
];

export default function MobileCurvedArchSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardsState, setCardsState] = useState([]);
  
  // Animation state references
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(false);

  const numCards = BASE_CARDS.length; // 12 cards around 360° circle
  const angleStep = 360 / numCards; // 30° per card

  // Continuous 60fps animation loop
  useEffect(() => {
    let lastTimestamp = performance.now();
    const autoSpeed = 0.12; // Continuous smooth rotation speed (deg per frame)

    const loop = (now) => {
      const dt = Math.min(32, now - lastTimestamp);
      lastTimestamp = now;

      if (!isDraggingRef.current) {
        // Apply residual drag velocity or steady auto-scroll
        if (Math.abs(velocityRef.current) > 0.01) {
          angleRef.current += velocityRef.current;
          velocityRef.current *= 0.94; // Smooth momentum damping
        } else if (!isPausedRef.current) {
          // Smooth continuous auto-rotation
          angleRef.current += autoSpeed * (dt / 16.66);
        }
      }

      // Infinite modulo normalization to [0, 360)
      const currentRot = ((angleRef.current % 360) + 360) % 360;

      // Calculate position, scale, opacity, and rotation for all 12 cards
      let closestIdx = 0;
      let minApexDist = 999;

      const updated = BASE_CARDS.map((card, i) => {
        const baseAngle = i * angleStep;
        // Current angle position on the 360-degree circle
        const rawAngle = (baseAngle - currentRot + 360) % 360;
        // Normalize angle relative to top apex (0°) to range [-180°, +180°]
        const normDeg = ((rawAngle + 180) % 360) - 180;
        const normRad = (normDeg * Math.PI) / 180;

        const absDeg = Math.abs(normDeg);

        if (absDeg < minApexDist) {
          minApexDist = absDeg;
          closestIdx = i;
        }

        // Visible only on the upper convex arch (-90° to +90°)
        if (absDeg <= 95) {
          const arcRadius = 420;
          const x = Math.sin(normRad) * arcRadius;
          const y = (1 - Math.cos(normRad)) * arcRadius * 0.72; // Convex arch drop
          const rotZ = normDeg;
          const rotY = -normDeg * 0.22;
          
          const scale = Math.max(0.78, 1.05 - (absDeg / 85) * 0.28);
          // Quadratic fade at outer flanks
          const opacity = Math.max(0, 1 - Math.pow(absDeg / 72, 2.2));
          const zIndex = Math.round(100 - absDeg);
          const isApex = absDeg < angleStep / 2;

          return {
            ...card,
            visible: true,
            x: x.toFixed(1),
            y: y.toFixed(1),
            rotZ: rotZ.toFixed(1),
            rotY: rotY.toFixed(1),
            scale: scale.toFixed(3),
            opacity: opacity.toFixed(3),
            zIndex,
            isApex,
          };
        }

        return {
          ...card,
          visible: false,
          opacity: 0,
        };
      });

      setCardsState(updated);
      setActiveCardIndex(closestIdx);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [numCards, angleStep]);

  // Center on clicked card
  const handleCardClick = (index) => {
    const targetRot = index * angleStep;
    // Shortest angular path
    let diff = (targetRot - (angleRef.current % 360) + 540) % 360 - 180;
    velocityRef.current = -diff * 0.08;
  };

  // Touch / Pointer Drag Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastXRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);

    // Convert horizontal pixel drag into angle rotation
    const angleDelta = (deltaX / 320) * 45;
    angleRef.current -= angleDelta;
    velocityRef.current = -angleDelta / (dt / 16.66);

    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
  };

  return (
    <section className="mobile-curved-arch-section">
      {/* Header Badge & Title */}
      <div className="arch-header">
        <span className="arch-badge">CONTINUOUS 360° ATELIER</span>
        <h2 className="arch-title">Orbit of Masterpieces</h2>
        <p className="arch-subtitle">Seamless Endless Ring • Swipe or Watch</p>
      </div>

      {/* Infinite Arc Wheel Canvas */}
      <div
        className="arch-wheel-viewport"
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => {
          isPausedRef.current = false;
          handlePointerUp();
        }}
      >
        <div className="arch-cards-track">
          {cardsState.map((card, i) => {
            if (!card.visible) return null;

            return (
              <div
                key={`${card.id}-${i}`}
                className={`arch-squircle-card ${card.isApex ? 'is-apex' : ''}`}
                style={{
                  transform: `translate3d(calc(-50% + ${card.x}px), ${card.y}px, 0) rotateZ(${card.rotZ}deg) rotateY(${card.rotY}deg) scale(${card.scale})`,
                  opacity: card.opacity,
                  zIndex: card.zIndex,
                  backgroundColor: card.bg,
                  color: card.color,
                }}
                onClick={() => handleCardClick(i)}
              >
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
          {BASE_CARDS.map((_, i) => (
            <button
              key={i}
              className={`arch-dot ${i === activeCardIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(i)}
              aria-label={`Jump to piece ${i + 1}`}
            />
          ))}
        </div>

        <Link
          to={`/product/${BASE_CARDS[activeCardIndex]?.slug || 'celestial-diamond-solitaire-ring'}`}
          className="arch-explore-cta"
        >
          <span>Explore Piece #{activeCardIndex + 1}</span>
          <span className="arch-cta-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
