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

          {/* Floating Glass Wishlist Heart Button (Top Right) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`product-card-heart-action ${wishlisted ? 'active' : ''}`}
            aria-label="Add to wishlist"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Card Info Section */}
        <div className="product-card-body">
          <div>
            {/* Category & Metal Tag */}
            {gridMode !== '3-col' && (
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
            )}

            {/* Product Headline Title */}
            <h3 className="product-card-title">
              {product.name}
            </h3>
          </div>

          {/* Price & Action Bottom Row */}
          <div className="product-card-price-row">
            <div className="product-card-price-block">
              <div className="product-card-current-price">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && gridMode !== '3-col' && (
                <div className="product-card-orig-price">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
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
           MOBILE STYLES (unchanged — original design)
           ============================================= */
        .product-card-glass {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border-radius: 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.04), 0 3px 10px rgba(201, 168, 76, 0.08);
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
          height: 100%;
          min-width: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
          position: relative;
          overflow: hidden;
        }

        .product-card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          min-width: 0 !important;
          width: 100% !important;
        }

        .product-card-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(245, 242, 236, 0.6);
          margin-bottom: 10px;
          min-width: 0;
        }

        .product-card-fallback-emoji {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(245,242,236,0.9) 0%, rgba(235,230,220,0.9) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          z-index: 0;
        }

        .product-card-main-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
          transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 10;
          padding: 3px 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(188, 156, 108, 0.3);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-gold-dark);
        }

        .product-card-inset-preview-box {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          z-index: 5;
          background: rgba(255,255,255,0.8);
        }

        .product-card-inset-preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-card-heart-action {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          color: rgba(26,26,26,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .product-card-heart-action.active {
          background: var(--color-ruby);
          color: #FFF;
        }

        .product-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          min-width: 0 !important;
          width: 100% !important;
        }

        .product-card-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3px;
          min-width: 0;
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
          min-width: 0;
        }

        .product-card-metal-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
          margin-left: 4px;
        }

        .product-card-title {
          font-family: var(--font-display);
          font-size: 13.5px;
          font-weight: 700;
          color: var(--color-charcoal);
          line-height: 1.3;
          margin: 0 0 8px;
          height: 35px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          min-width: 0;
        }

        .product-card-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
          border-top: 1px solid rgba(0,0,0,0.05);
          min-width: 0;
          gap: 4px;
        }

        .product-card-current-price {
          font-family: var(--font-display);
          font-size: 14.5px;
          font-weight: 700;
          color: var(--color-charcoal);
          white-space: nowrap;
        }

        .product-card-orig-price {
          font-size: 10.5px;
          color: rgba(26,26,26,0.4);
          text-decoration: line-through;
          white-space: nowrap;
        }

        .product-card-cta-tag {
          font-size: 10px;
          font-weight: 700;
          color: #1a1a1a;
          background: linear-gradient(135deg, #e6c875 0%, #d4af37 50%, #aa7c11 100%);
          padding: 4px 10px;
          border-radius: 9999px;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.4);
          letter-spacing: 0.04em;
        }

        /* 3-COLUMN DENSE OVERRIDES */
        .product-card-3-col,
        .product-card-3col {
          padding: 6px !important;
          border-radius: 12px !important;
        }

        .product-card-3-col .product-card-img-box,
        .product-card-3col .product-card-img-box {
          border-radius: 8px !important;
          margin-bottom: 4px !important;
        }

        .product-card-3-col .product-card-title,
        .product-card-3col .product-card-title {
          font-size: 10.5px !important;
          height: 15px !important;
          margin-bottom: 2px !important;
          -webkit-line-clamp: 1 !important;
          display: block !important;
          white-space: nowrap !important;
        }

        .product-card-3-col .product-card-current-price,
        .product-card-3col .product-card-current-price {
          font-size: 11.5px !important;
        }

        .product-card-3-col .product-card-badge,
        .product-card-3col .product-card-badge {
          top: 3px !important;
          left: 3px !important;
          padding: 2px 4px !important;
          font-size: 7px !important;
          border-radius: 6px !important;
        }

        .product-card-3-col .product-card-heart-action,
        .product-card-3col .product-card-heart-action {
          top: 3px !important;
          right: 3px !important;
          width: 22px !important;
          height: 22px !important;
        }

        .product-card-3-col .product-card-heart-action svg,
        .product-card-3col .product-card-heart-action svg {
          width: 10px !important;
          height: 10px !important;
        }

        .product-card-3-col .product-card-cta-tag,
        .product-card-3col .product-card-cta-tag {
          display: none !important;
        }

        /* 1-COLUMN SHOWCASE OVERRIDES */
        .product-card-1-col,
        .product-card-1col {
          padding: 16px !important;
          border-radius: 24px !important;
        }

        .product-card-1-col .product-card-img-box,
        .product-card-1col .product-card-img-box {
          border-radius: 18px !important;
          margin-bottom: 12px !important;
        }

        .product-card-1-col .product-card-title,
        .product-card-1col .product-card-title {
          font-size: 17px !important;
          height: auto !important;
          margin-bottom: 6px !important;
          -webkit-line-clamp: 2 !important;
        }

        .product-card-1-col .product-card-current-price,
        .product-card-1col .product-card-current-price {
          font-size: 19px !important;
        }

        .product-card-cta-full {
          padding: 8px 18px !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.06em !important;
          text-transform: uppercase !important;
          border-radius: 9999px !important;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4) !important;
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
            transition: none;
            cursor: pointer;
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

          /* Desktop image box enhancements */
          .pc-desktop .product-card-img-box {
            border-radius: 16px;
            overflow: hidden;
          }

          .pc-desktop .product-card-main-img {
            transition: none;
            will-change: transform;
          }

          /* Desktop body section */
          .pc-desktop .product-card-body {
            padding-top: 4px;
          }

          .pc-desktop .product-card-meta-text {
            font-size: 10px;
            letter-spacing: 0.12em;
          }

          .pc-desktop .product-card-title {
            font-size: 15px;
            height: 40px;
            margin: 2px 0 10px;
            transition: color 0.3s ease;
          }

          .pc-desktop:hover .product-card-title {
            color: var(--color-gold-dark);
          }

          .pc-desktop .product-card-current-price {
            font-size: 16px;
          }

          .pc-desktop .product-card-price-row {
            padding-top: 8px;
            border-top: 1px solid rgba(201, 168, 76, 0.12);
          }

          .pc-desktop .product-card-cta-tag {
            font-size: 11px;
            padding: 5px 12px;
            border-radius: 12px;
            background: rgba(201, 168, 76, 0.1);
            transition: all 0.25s ease;
          }

          .pc-desktop:hover .product-card-cta-tag {
            background: rgba(201, 168, 76, 0.2);
            color: var(--color-charcoal);
          }

          /* Desktop heart button */
          .pc-desktop .product-card-heart-action {
            width: 34px;
            height: 34px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .pc-desktop .product-card-heart-action:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          }

          /* Desktop badge */
          .pc-desktop .product-card-badge {
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 12px;
          }

          /* Desktop inset preview */
          .pc-desktop .product-card-inset-preview-box {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            bottom: 8px;
            right: 8px;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          }

          .pc-desktop:hover .product-card-inset-preview-box {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
