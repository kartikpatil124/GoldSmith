import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../data/products';
import { getMediaUrl, getProductImage } from '../../utils/api';
import InquiryModal from './InquiryModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categoryEmoji = (category) => {
  switch (category) {
    case 'Rings':       return '💍';
    case 'Earrings':    return '✨';
    case 'Necklaces':   return '📿';
    case 'Bracelets':   return '⭐';
    case 'Bangles':     return '🔅';
    case 'Chains':      return '🔗';
    case 'Pendants':    return '💎';
    default:            return '💎';
  }
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 769 : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export default function ProductCard({ product, gridMode = '2-col' }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id || product.id);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [secondaryImgError, setSecondaryImgError] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const isDesktop = useIsDesktop();
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glowRef = useRef(null);
  const overlayRef = useRef(null);
  const shimmerRef = useRef(null);

  const rawImageUrl = getProductImage(product);
  const imageUrl = rawImageUrl && !imgError ? getMediaUrl(rawImageUrl) : null;
  const rawSecondary = product.images?.[1] ? (product.images[1].url || product.images[1]) : null;
  const secondaryImageUrl = rawSecondary && !secondaryImgError ? getMediaUrl(rawSecondary) : null;

  // GSAP entrance animation using IntersectionObserver (works perfectly inside internal scroll container)
  useEffect(() => {
    if (!isDesktop || !cardRef.current) return;

    const el = cardRef.current;
    
    // Ensure element is visible by default
    el.style.opacity = '1';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              el,
              { opacity: 0.3, y: 30, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
              }
            );
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  // Desktop mouse handlers for magnetic tilt + glow + parallax
  const handleMouseMove = useCallback((e) => {
    if (!isDesktop || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    // Magnetic tilt
    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
      transformOrigin: 'center center',
    });

    // Image parallax (opposite direction)
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: ((x - centerX) / centerX) * -12,
        y: ((y - centerY) / centerY) * -12,
        scale: 1.08,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    // Glow spotlight
    if (glowRef.current) {
      glowRef.current.style.opacity = '1';
      glowRef.current.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 40%, transparent 70%)`;
    }
  }, [isDesktop]);

  const handleMouseEnter = useCallback(() => {
    if (!isDesktop || !cardRef.current) return;

    // Shimmer border
    if (shimmerRef.current) {
      gsap.to(shimmerRef.current, { opacity: 1, duration: 0.3 });
    }

    // Reveal overlay
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    }

    // Card lift
    gsap.to(cardRef.current, {
      boxShadow: '0 25px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(201,168,76,0.15)',
      duration: 0.35,
      ease: 'power2.out',
    });
  }, [isDesktop]);

  const handleMouseLeave = useCallback(() => {
    if (!isDesktop || !cardRef.current) return;

    // Reset tilt
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0 10px 28px rgba(0, 0, 0, 0.04), 0 3px 10px rgba(201, 168, 76, 0.08)',
      duration: 0.5,
      ease: 'power3.out',
    });

    // Reset image parallax
    if (imgRef.current) {
      gsap.to(imgRef.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    }

    // Hide glow
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }

    // Hide shimmer
    if (shimmerRef.current) {
      gsap.to(shimmerRef.current, { opacity: 0, duration: 0.3 });
    }

    // Hide overlay
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [isDesktop]);

  return (
    <div
      ref={cardRef}
      className={`product-card-glass product-card-${gridMode} ${isDesktop ? 'pc-desktop' : ''}`}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseEnter={isDesktop ? handleMouseEnter : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
    >
      {/* Desktop-only shimmer border overlay */}
      {isDesktop && (
        <div ref={shimmerRef} className="pc-shimmer-border" aria-hidden="true" />
      )}

      <Link 
        to={`/product/${product.slug}`} 
        className="product-card-link"
      >
        {/* Main Product Image Area */}
        <div className="product-card-img-box">
          {/* Fallback Emoji */}
          <div className="product-card-fallback-emoji">
            {categoryEmoji(product.category)}
          </div>

          {/* Primary Product Image */}
          {imageUrl && (
            <img 
              ref={isDesktop ? imgRef : undefined}
              src={imageUrl}
              alt={product.name}
              onError={() => { setImgError(true); setImgLoaded(true); }}
              onLoad={() => setImgLoaded(true)}
              className="product-card-main-img"
              style={{ opacity: imgLoaded ? 1 : 0 }}
            />
          )}

          {/* Desktop-only glow spotlight */}
          {isDesktop && (
            <div ref={glowRef} className="pc-glow-spotlight" aria-hidden="true" />
          )}

          {/* Badge (Top Left) */}
          {product.badge && (
            <span className="product-card-badge">
              {product.badge === 'sale' ? `${product.discount}% Off` : product.badge.toUpperCase()}
            </span>
          )}

          {/* Optional Secondary Inset Preview (Hidden in dense 3-col mode) */}
          {secondaryImageUrl && !secondaryImgError && gridMode !== '3-col' && (
            <div className="product-card-inset-preview-box">
              <img 
                src={secondaryImageUrl}
                alt={`${product.name} preview`}
                onError={() => setSecondaryImgError(true)}
              />
            </div>
          )}

          {/* Desktop-only frosted reveal overlay */}
          {isDesktop && (
            <div ref={overlayRef} className="pc-reveal-overlay">
              <span className="pc-reveal-category">
                {product.category || 'Atelier'} · {product.metal || 'Gold'}
              </span>
              <span className="pc-reveal-cta">View Details →</span>
            </div>
          )}

          {/* Minimalist Floating Wishlist Heart Button (Top Right) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`product-card-heart-action ${wishlisted ? 'active' : ''}`}
            aria-label="Add to wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#e11d48' : 'none'} stroke={wishlisted ? '#e11d48' : '#1a1a1a'} strokeWidth="1.6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Card Info Section */}
        <div className="product-card-body">
          {/* Category & Metal Tag (Desktop Only) */}
          <div className="product-card-meta-row">
            <span className="product-card-meta-text">
              {product.category || 'Atelier'} · {product.metal || 'Certified Gold'}
            </span>
            <span 
              className="product-card-metal-dot"
              style={{
                background: product.metal?.includes('Rose') ? '#e8a598' : product.metal?.includes('White') ? '#cbd5e1' : '#d97706'
              }} 
            />
          </div>

          {/* Product Headline Title */}
          <h3 className="product-card-title">
            {product.name}
          </h3>

          {/* Price & Action Bottom Row */}
          <div className="product-card-price-row">
            <div className="product-card-price-block">
              {product.originalPrice && (
                <span className="product-card-orig-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="product-card-current-price">
                {formatPrice(product.price)}
              </span>
            </div>

            {gridMode === '1-col' ? (
              <span className="product-card-cta-tag product-card-cta-full">
                View Masterpiece Details →
              </span>
            ) : gridMode !== '3-col' ? (
              <span className="product-card-cta-tag">
                Details →
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        product={product} 
        initialInquiryType="Price Inquiry"
      />

      <style>{`
        /* =============================================
           MOBILE EDITORIAL CARD STYLES (Matching Reference)
           ============================================= */
        .product-card-glass {
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-radius: 0;
          border: none;
          box-shadow: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          height: 100%;
          min-width: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
          position: relative;
          overflow: visible;
          text-align: left;
        }

        .product-card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0 !important;
          width: 100% !important;
        }

        /* Portrait 3:4 aspect ratio matching reference */
        .product-card-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 4px;
          overflow: hidden;
          background: #f2f0ec;
          margin-bottom: 6px;
          min-width: 0;
        }

        .product-card-fallback-emoji {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f5f2ec 0%, #ebe6dc 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          z-index: 0;
        }

        .product-card-main-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
          transition: opacity 0.3s ease-out;
        }

        /* Minimal badge */
        .product-card-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          z-index: 10;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.95);
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #111;
        }

        /* Minimalist Heart Icon (Outline stroke matching reference) */
        .product-card-heart-action {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: none;
          transition: transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .product-card-heart-action:active {
          transform: scale(1.25);
        }

        .product-card-heart-action.active {
          color: var(--color-ruby, #e11d48);
        }

        .product-card-body {
          display: flex;
          flex-direction: column;
          min-width: 0 !important;
          width: 100% !important;
          padding: 2px 0 0 0;
        }

        /* Hide clutter elements on mobile */
        .product-card-meta-row,
        .product-card-inset-preview-box,
        .product-card-cta-tag {
          display: none;
        }

        /* Clean sans-serif title like reference image */
        .product-card-title {
          font-family: inherit;
          font-size: 13px;
          font-weight: 400;
          color: #1f2937;
          line-height: 1.3;
          margin: 0 0 2px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        /* Price row beneath title */
        .product-card-price-row {
          display: flex;
          align-items: baseline;
          justify-content: flex-start;
          gap: 6px;
          padding-top: 0;
          border-top: none;
          min-width: 0;
        }

        .product-card-price-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .product-card-orig-price {
          font-size: 11.5px;
          color: #9ca3af;
          text-decoration: line-through;
          white-space: nowrap;
          order: 1;
        }

        .product-card-current-price {
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          order: 2;
        }

        /* 3-COLUMN DENSE OVERRIDES */
        .product-card-3-col .product-card-title,
        .product-card-3col .product-card-title {
          font-size: 10.5px !important;
          margin-bottom: 1px !important;
        }

        .product-card-3-col .product-card-current-price,
        .product-card-3col .product-card-current-price {
          font-size: 11.5px !important;
        }

        .product-card-3-col .product-card-orig-price,
        .product-card-3col .product-card-orig-price {
          font-size: 9.5px !important;
        }

        /* 1-COLUMN SHOWCASE OVERRIDES */
        .product-card-1-col .product-card-img-box,
        .product-card-1col .product-card-img-box {
          aspect-ratio: 3 / 4 !important;
          border-radius: 8px !important;
          margin-bottom: 8px !important;
        }

        .product-card-1-col .product-card-title,
        .product-card-1col .product-card-title {
          font-size: 15px !important;
          font-weight: 500 !important;
          margin-bottom: 4px !important;
        }

        .product-card-1-col .product-card-current-price,
        .product-card-1col .product-card-current-price {
          font-size: 16px !important;
        }

        .product-card-1-col .product-card-cta-full {
          display: inline-flex !important;
          margin-left: auto;
          padding: 5px 12px !important;
          font-size: 11px !important;
          border-radius: 8px;
          background: rgba(201, 168, 76, 0.15);
          color: var(--color-charcoal);
          font-weight: 600;
        }

        /* =============================================
           DESKTOP-ONLY STYLES (>=769px)
           ============================================= */
        @media (min-width: 769px) {
          .pc-desktop.product-card-glass {
            will-change: transform, box-shadow;
            transform-style: preserve-3d;
            perspective: 800px;
            padding: 14px;
            border-radius: 22px;
            border: 1.5px solid rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(30px) saturate(200%);
            -webkit-backdrop-filter: blur(30px) saturate(200%);
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.04), 0 3px 10px rgba(201, 168, 76, 0.08);
            transition: none;
            cursor: pointer;
            overflow: hidden;
          }

          /* Shimmer border overlay */
          .pc-shimmer-border {
            position: absolute;
            inset: -1px;
            border-radius: 23px;
            background: linear-gradient(
              135deg,
              rgba(201, 168, 76, 0.0) 0%,
              rgba(201, 168, 76, 0.25) 25%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(201, 168, 76, 0.25) 75%,
              rgba(201, 168, 76, 0.0) 100%
            );
            background-size: 300% 300%;
            animation: pc-shimmer-anim 3s ease infinite;
            opacity: 0;
            z-index: 0;
            pointer-events: none;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            padding: 2px;
          }

          @keyframes pc-shimmer-anim {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Glow spotlight overlay */
          .pc-glow-spotlight {
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: inherit;
          }

          /* Frosted reveal overlay */
          .pc-reveal-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 6;
            padding: 16px 14px 14px;
            background: linear-gradient(
              to top,
              rgba(255, 255, 255, 0.92) 0%,
              rgba(255, 255, 255, 0.7) 60%,
              transparent 100%
            );
            backdrop-filter: blur(12px) saturate(160%);
            -webkit-backdrop-filter: blur(12px) saturate(160%);
            display: flex;
            flex-direction: column;
            gap: 6px;
            opacity: 0;
            transform: translateY(30px);
            pointer-events: none;
          }

          .pc-reveal-category {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--color-gold-dark);
          }

          .pc-reveal-cta {
            font-size: 12px;
            font-weight: 700;
            color: var(--color-charcoal);
            letter-spacing: 0.04em;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          /* Desktop image box square */
          .pc-desktop .product-card-img-box {
            aspect-ratio: 1 !important;
            border-radius: 16px !important;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .pc-desktop .product-card-main-img {
            transition: none;
            will-change: transform;
          }

          /* Desktop body section */
          .pc-desktop .product-card-body {
            display: flex;
            flex-direction: column;
            flex: 1;
            justify-content: space-between;
            padding-top: 4px;
          }

          .pc-desktop .product-card-meta-row {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 3px;
          }

          .product-card-meta-text {
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-gold-dark);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .product-card-metal-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
            margin-left: 4px;
          }

          .pc-desktop .product-card-title {
            font-family: var(--font-display) !important;
            font-size: 14.5px !important;
            font-weight: 700 !important;
            color: var(--color-charcoal) !important;
            height: 38px !important;
            margin: 2px 0 8px !important;
            white-space: normal !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            transition: color 0.3s ease;
          }

          .pc-desktop:hover .product-card-title {
            color: var(--color-gold-dark) !important;
          }

          .pc-desktop .product-card-price-row {
            padding-top: 6px !important;
            border-top: 1px solid rgba(201, 168, 76, 0.12) !important;
            justify-content: space-between !important;
          }

          .pc-desktop .product-card-current-price {
            font-family: var(--font-display) !important;
            font-size: 15.5px !important;
            font-weight: 700 !important;
            order: 1 !important;
          }

          .pc-desktop .product-card-orig-price {
            order: 2 !important;
          }

          .pc-desktop .product-card-cta-tag {
            display: inline-block !important;
            font-size: 10.5px;
            padding: 4px 10px;
            border-radius: 10px;
            background: rgba(201, 168, 76, 0.12);
            color: var(--color-gold-dark);
            font-weight: 700;
            white-space: nowrap;
            transition: all 0.25s ease;
          }

          .pc-desktop:hover .product-card-cta-tag {
            background: rgba(201, 168, 76, 0.22);
            color: var(--color-charcoal);
          }

          /* Desktop heart button */
          .pc-desktop .product-card-heart-action {
            width: 32px;
            height: 32px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .pc-desktop .product-card-heart-action:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          }

          /* Desktop badge */
          .pc-desktop .product-card-badge {
            font-size: 9.5px;
            padding: 3px 8px;
            border-radius: 10px;
            border: 1px solid rgba(188, 156, 108, 0.3);
            color: var(--color-gold-dark);
          }

          /* Desktop inset preview */
          .pc-desktop .product-card-inset-preview-box {
            display: block !important;
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 52px;
            height: 52px;
            border-radius: 10px;
            border: 1.5px solid rgba(255, 255, 255, 0.95);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            z-index: 5;
            background: rgba(255,255,255,0.8);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .pc-desktop .product-card-inset-preview-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .pc-desktop:hover .product-card-inset-preview-box {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
