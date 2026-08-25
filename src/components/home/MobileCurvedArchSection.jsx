import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api, { getProductImage, getMediaUrl } from '../../utils/api';
import { products as fallbackProducts, formatPrice } from '../../data/products';
import './MobileCurvedArchSection.css';

/*
  Mobile Infinite 360° Curved Squircle Product Ring
  ─────────────────────────────────────────────────────────────
  Pure, full-bleed real product imagery on squircle cards circulating
  in a continuous tight infinite 360-degree loop across the top convex arch.
  Tapping any card directly navigates to that exact product's page.
*/

export default function MobileCurvedArchSection() {
  const [productsList, setProductsList] = useState(() => fallbackProducts.slice(0, 12));
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

  // Fetch live shop products with fallback
  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const res = await api.get('/products?limit=16');
        const list = res && res.success && res.data && res.data.products ? res.data.products : res?.products;
        if (list && list.length >= 4) {
          setProductsList(list.slice(0, 12));
        }
      } catch (err) {
        console.error('Error fetching arch products, using catalog fallback:', err);
      }
    };
    fetchShopProducts();
  }, []);

  // Format real products with clean images, real slugs, and formatted prices
  const realProducts = useMemo(() => {
    return productsList.map((p, idx) => {
      const rawImg = getProductImage(p);
      const imgSrc = rawImg ? getMediaUrl(rawImg) : null;
      return {
        id: p._id || p.id || idx,
        name: p.name,
        slug: p.slug,
        category: `${p.category || 'Atelier'} · ${p.metal || 'Certified Gold'}`,
        price: formatPrice(p.price),
        image: imgSrc,
      };
    });
  }, [productsList]);

  // 18 slots around 360° circle for a tight, elegant fanned arch with minimal gap
  const totalSlots = 18;
  const angleStep = 360 / totalSlots; // 20° per card slot

  // Continuous 60fps animation loop
  useEffect(() => {
    if (realProducts.length === 0) return;

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

      // Calculate position, scale, opacity, and rotation for all slots
      let closestProductIdx = 0;
      let minApexDist = 999;

      const updated = Array.from({ length: totalSlots }).map((_, slotIdx) => {
        const product = realProducts[slotIdx % realProducts.length];
        const baseAngle = slotIdx * angleStep;
        
        // Current angle position on the 360-degree circle
        const rawAngle = (baseAngle - currentRot + 360) % 360;
        // Normalize angle relative to top apex (0°) to range [-180°, +180°]
        const normDeg = ((rawAngle + 180) % 360) - 180;
        const normRad = (normDeg * Math.PI) / 180;

        const absDeg = Math.abs(normDeg);

        if (absDeg < minApexDist) {
          minApexDist = absDeg;
          closestProductIdx = slotIdx % realProducts.length;
        }

        // Visible only on the upper convex arch (-95° to +95°)
        if (absDeg <= 95) {
          const arcRadius = 390;
          const x = Math.sin(normRad) * arcRadius;
          const y = (1 - Math.cos(normRad)) * arcRadius * 0.74; // Convex arch drop
          const rotZ = normDeg;
          const rotY = -normDeg * 0.20;

          const scale = Math.max(0.78, 1.04 - (absDeg / 85) * 0.26);
          // Smooth fade at outer flanks
          const opacity = Math.max(0, 1 - Math.pow(absDeg / 76, 2.2));
          const zIndex = Math.round(100 - absDeg);
          const isApex = absDeg < angleStep / 2;

          return {
            ...product,
            slotKey: `slot-${slotIdx}`,
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
          slotKey: `slot-${slotIdx}`,
          visible: false,
          opacity: 0,
        };
      });

      setCardsState(updated);
      setActiveCardIndex(closestProductIdx);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [realProducts, totalSlots, angleStep]);

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
    const angleDelta = (deltaX / 300) * 45;
    angleRef.current -= angleDelta;
    velocityRef.current = -angleDelta / (dt / 16.66);

    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
  };

  const activeProduct = realProducts[activeCardIndex] || realProducts[0] || {};

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
          {cardsState.map((card) => {
            if (!card.visible) return null;

            return (
              <Link
                key={card.slotKey}
                to={`/product/${card.slug}`}
                className={`arch-squircle-card ${card.isApex ? 'is-apex' : ''}`}
                style={{
                  transform: `translate3d(calc(-50% + ${card.x}px), ${card.y}px, 0) rotateZ(${card.rotZ}deg) rotateY(${card.rotY}deg) scale(${card.scale})`,
                  opacity: card.opacity,
                  zIndex: card.zIndex,
                }}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                  }
                }}
                aria-label={`View ${card.name}`}
              >
                {/* Full-bleed real product image inside squircle */}
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="arch-card-product-img"
                    loading="lazy"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Centered Product Info & Direct Navigation */}
      {activeProduct.name && (
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
      )}
    </section>
  );
}
