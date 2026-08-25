import React, { useState, useRef, useEffect } from 'react';
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
  Mobile Infinite 360° Curved Squircle Product Ring
  ─────────────────────────────────────────────────────────────
  Pure, full-bleed real product imagery on squircle cards circulating
  in a continuous infinite 360-degree loop across the top convex arch.
  Tapping any card directly navigates to its product page.
*/

const REAL_PRODUCTS = [
  {
    id: 1,
    name: 'Celestial Diamond Solitaire Ring',
    slug: 'celestial-diamond-solitaire-ring',
    category: 'Rings · 18K Yellow Gold',
    price: '₹2,85,000',
    image: main1Img,
  },
  {
    id: 2,
    name: 'Royal Emerald Drop Earrings',
    slug: 'royal-emerald-drop-earrings',
    category: 'Earrings · 18K White Gold',
    price: '₹1,65,000',
    image: img2,
  },
  {
    id: 3,
    name: 'Infinity Diamond Tennis Bracelet',
    slug: 'infinity-diamond-tennis-bracelet',
    category: 'Bracelets · 18K White Gold',
    price: '₹4,25,000',
    image: img3,
  },
  {
    id: 4,
    name: 'Maharani Bridal Necklace Set',
    slug: 'maharani-bridal-necklace-set',
    category: 'Necklaces · 22K Yellow Gold',
    price: '₹8,50,000',
    image: img5,
  },
  {
    id: 5,
    name: 'Sapphire Heart Pendant',
    slug: 'sapphire-heart-pendant',
    category: 'Pendants · 18K Rose Gold',
    price: '₹78,000',
    image: img4,
  },
  {
    id: 6,
    name: 'Floral Gold Bangle Set',
    slug: 'floral-gold-bangle-set',
    category: 'Bangles · 22K Gold',
    price: '₹1,85,000',
    image: img8,
  },
  {
    id: 7,
    name: 'Serpentine Gold Chain',
    slug: 'serpentine-gold-chain',
    category: 'Chains · 22K Gold',
    price: '₹95,000',
    image: img9,
  },
  {
    id: 8,
    name: 'Elysian Heritage Choker',
    slug: 'maharani-bridal-necklace-set',
    category: 'Bridal · 22K Temple Gold',
    price: '₹6,40,000',
    image: img6,
  },
  {
    id: 9,
    name: 'Solitaire Diamond Pendant',
    slug: 'celestial-diamond-solitaire-ring',
    category: 'Pendants · Platinum & Gold',
    price: '₹1,95,000',
    image: img10,
  },
  {
    id: 10,
    name: 'Royal Diamond Line Bracelet',
    slug: 'infinity-diamond-tennis-bracelet',
    category: 'Bracelets · 18K White Gold',
    price: '₹3,40,000',
    image: img11,
  },
  {
    id: 11,
    name: 'Imperial Gemstone Earrings',
    slug: 'royal-emerald-drop-earrings',
    category: 'Earrings · 18K Rose Gold',
    price: '₹1,45,000',
    image: img12,
  },
  {
    id: 12,
    name: 'Masterpiece Gold Necklace',
    slug: 'maharani-bridal-necklace-set',
    category: 'Necklaces · 22K Gold',
    price: '₹7,20,000',
    image: img13,
  },
];

export default function MobileCurvedArchSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardsState, setCardsState] = useState([]);

  // Animation state references
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(false);

  const numCards = REAL_PRODUCTS.length; // 12 real products around 360° circle
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

      const updated = REAL_PRODUCTS.map((product, i) => {
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
          // Smooth fade at outer flanks
          const opacity = Math.max(0, 1 - Math.pow(absDeg / 72, 2.2));
          const zIndex = Math.round(100 - absDeg);
          const isApex = absDeg < angleStep / 2;

          return {
            ...product,
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
          ...product,
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

  // Touch / Pointer Drag Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
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
    const totalDist = Math.abs(clientX - startXRef.current);
    if (totalDist > 6) {
      hasDraggedRef.current = true;
    }

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

  const activeProduct = REAL_PRODUCTS[activeCardIndex] || REAL_PRODUCTS[0];

  return (
    <section className="mobile-curved-arch-section">
      {/* Header Badge & Title */}
      <div className="arch-header">
        <span className="arch-badge">FEATURED COLLECTION</span>
        <h2 className="arch-title">Masterpiece Orbit</h2>
        <p className="arch-subtitle">Tap any piece to explore details</p>
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
          {cardsState.map((product, i) => {
            if (!product.visible) return null;

            return (
              <Link
                key={`${product.id}-${i}`}
                to={`/product/${product.slug}`}
                className={`arch-squircle-card ${product.isApex ? 'is-apex' : ''}`}
                style={{
                  transform: `translate3d(calc(-50% + ${product.x}px), ${product.y}px, 0) rotateZ(${product.rotZ}deg) rotateY(${product.rotY}deg) scale(${product.scale})`,
                  opacity: product.opacity,
                  zIndex: product.zIndex,
                }}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                  }
                }}
                aria-label={`View ${product.name}`}
              >
                {/* Full-bleed real product image inside squircle */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="arch-card-product-img"
                  loading="lazy"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Centered Product Info & Direct Navigation */}
      <div className="arch-action-footer">
        <div className="arch-active-product-info">
          <span className="arch-active-category">{activeProduct.category}</span>
          <h3 className="arch-active-name">{activeProduct.name}</h3>
          <span className="arch-active-price">{activeProduct.price}</span>
        </div>

        <Link
          to={`/product/${activeProduct.slug}`}
          className="arch-explore-cta"
        >
          <span>View Product Details</span>
          <span className="arch-cta-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
