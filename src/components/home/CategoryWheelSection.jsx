import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotField from '../ui/DotField';
import main1Img from '../../../images/main1.png';
import img2 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_39 AM.png';
import img3 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_43 AM.png';
import img4 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_46 AM.png';
import img5 from '../../../images/ChatGPT Image Jul 26, 2026, 12_22_37 AM.png';
import img6 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_57 AM.png';
import img7 from '../../../images/ChatGPT Image Jul 27, 2026, 12_01_59 AM.png';
import img8 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_01 AM.png';
import img9 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_03 AM.png';
import './CategoryWheelSection.css';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { name: 'Rings', image: main1Img, slug: 'rings', subtitle: 'Handcrafted Solitaires & Bands' },
  { name: 'Necklaces', image: img2, slug: 'necklaces', subtitle: 'Kundan, Polki & Diamond Chrs' },
  { name: 'Earrings', image: img5, slug: 'earrings', subtitle: 'Emerald & Diamond Drops' },
  { name: 'Bracelets', image: img3, slug: 'bracelets', subtitle: 'Artisan Tennis & Charm Pieces' },
  { name: 'Pendants', image: img4, slug: 'pendants', subtitle: 'Certified Diamond Solitaires' },
  { name: 'Timepieces', image: img6, slug: 'timepieces', subtitle: 'Jewelled Heritage Watches' },
  { name: 'High Jewelry', image: img7, slug: 'high-jewelry', subtitle: 'Exclusive Master Suites' },
  { name: 'Solitaires', image: img8, slug: 'solitaires', subtitle: 'GIA & IGI Graded Diamonds' },
  { name: 'Bespoke', image: img9, slug: 'bespoke', subtitle: 'Custom Atelier Creations' }
];

export default function CategoryWheelSection() {
  const outerRef = useRef(null);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const imageItemsRef = useRef([]);
  const navigate = useNavigate();
  
  // Physics & Animation state refs for zero-re-render 60fps loop
  const currentIndexRef = useRef(0);
  const targetIndexRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const lastInteractionTimeRef = useRef(0);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrameId = null;

    const updateItemsTransform = () => {
      const current = currentIndexRef.current;
      const isMobile = window.innerWidth <= 768;

      const angleStep = isMobile ? 0.21 : 0.155;
      const textRadius = isMobile ? 260 : 620;
      const imgRadius = isMobile ? 1200 : 3200;
      const maxDelta = isMobile ? 2.5 : 2.4;

      CATEGORIES.forEach((catObj, index) => {
        const textEl = itemsRef.current[index];
        const imageEl = imageItemsRef.current[index];

        const delta = index - current;
        const absDelta = Math.abs(delta);

        if (absDelta > maxDelta) {
          if (textEl) {
            textEl.style.opacity = '0';
            textEl.style.pointerEvents = 'none';
            textEl.style.transform = isMobile 
              ? 'translate3d(-80px, 0, -500px)' 
              : 'translate3d(-200px, 0, -1000px)';
          }
          if (imageEl) {
            imageEl.style.opacity = '0';
            imageEl.style.pointerEvents = 'none';
            imageEl.style.transform = isMobile 
              ? 'translate3d(80px, 0, -500px)' 
              : 'translate3d(200px, 0, -1000px)';
          }
          return;
        }

        const angle = delta * angleStep;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const scale    = Math.max(isMobile ? 0.76 : 0.7, Math.cos(angle * 0.7));
        const opacity  = Math.max(0, Math.cos(angle * 1.1) ** (isMobile ? 1.8 : 2.2));
        const blur     = Math.min(isMobile ? 4 : 6, absDelta * 1.4);
        const depthZ   = (cosAngle - 1) * (isMobile ? 50 : 80);
        const rotZ     = angle * (180 / Math.PI);
        const rotY     = -angle * (isMobile ? 6 : 8);

        const filterStr = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
        const opacityStr = opacity.toFixed(3);

        if (textEl) {
          const tx = textRadius * (cosAngle - 1);
          const ty = textRadius * sinAngle;

          textEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${depthZ.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          textEl.style.opacity = opacityStr;
          textEl.style.filter = filterStr;
          textEl.style.pointerEvents = absDelta < 1.5 ? 'auto' : 'none';

          if (absDelta < 0.35) {
            textEl.classList.add('active');
            textEl.classList.remove('inactive');
          } else {
            textEl.classList.add('inactive');
            textEl.classList.remove('active');
          }
        }

        if (imageEl) {
          const tx = -(imgRadius * (cosAngle - 1));
          const ty = imgRadius * sinAngle;

          imageEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${depthZ.toFixed(2)}px) rotateZ(${(-rotZ).toFixed(2)}deg) rotateY(${(-rotY).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          imageEl.style.opacity = opacityStr;
          imageEl.style.filter = filterStr;
          imageEl.style.pointerEvents = absDelta < 1.5 ? 'auto' : 'none';

          if (absDelta < 0.35) {
            imageEl.classList.add('active');
            imageEl.classList.remove('inactive');
          } else {
            imageEl.classList.add('inactive');
            imageEl.classList.remove('active');
          }
        }
      });
    };

    const animatePhysics = () => {
      if (!isDraggingRef.current) {
        const diff = targetIndexRef.current - currentIndexRef.current;
        velocityRef.current += diff * 0.08;
        velocityRef.current *= 0.82;
        currentIndexRef.current += velocityRef.current;

        if (Math.abs(diff) < 0.001 && Math.abs(velocityRef.current) < 0.001) {
          currentIndexRef.current = targetIndexRef.current;
        }
      }

      const rawNearest = Math.round(currentIndexRef.current);
      const clampedIndex = Math.max(0, Math.min(CATEGORIES.length - 1, rawNearest));
      if (clampedIndex !== selectedIndex) {
        setSelectedIndex(clampedIndex);
      }

      updateItemsTransform();
      animFrameId = requestAnimationFrame(animatePhysics);
    };

    animFrameId = requestAnimationFrame(animatePhysics);

    const st = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        const exactIndex = p * (CATEGORIES.length - 1);
        targetIndexRef.current = exactIndex;
      },
    });

    // Pointer events (Desktop & Touch)
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      lastPointerYRef.current = e.clientY;
      velocityRef.current = 0;
      lastInteractionTimeRef.current = performance.now();
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaY = lastPointerYRef.current - e.clientY;
      lastPointerYRef.current = e.clientY;
      const sensitivity = window.innerWidth <= 768 ? 95 : 120;
      const indexDelta = deltaY / sensitivity;
      currentIndexRef.current += indexDelta;
      currentIndexRef.current = Math.max(0, Math.min(CATEGORIES.length - 1, currentIndexRef.current));
      targetIndexRef.current = currentIndexRef.current;
      lastInteractionTimeRef.current = performance.now();
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      targetIndexRef.current = Math.max(0, Math.min(CATEGORIES.length - 1, Math.round(currentIndexRef.current)));
      lastInteractionTimeRef.current = performance.now();
    };

    // Touch events for ultra-responsive mobile swipe
    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      isDraggingRef.current = true;
      lastPointerYRef.current = e.touches[0].clientY;
      velocityRef.current = 0;
      lastInteractionTimeRef.current = performance.now();
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      if (e.cancelable) {
        e.preventDefault();
      }
      const currentY = e.touches[0].clientY;
      const deltaY = lastPointerYRef.current - currentY;
      lastPointerYRef.current = currentY;
      const sensitivity = 95;
      const indexDelta = deltaY / sensitivity;
      currentIndexRef.current += indexDelta;
      currentIndexRef.current = Math.max(0, Math.min(CATEGORIES.length - 1, currentIndexRef.current));
      targetIndexRef.current = currentIndexRef.current;
      lastInteractionTimeRef.current = performance.now();
    };

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      targetIndexRef.current = Math.max(0, Math.min(CATEGORIES.length - 1, Math.round(currentIndexRef.current)));
      lastInteractionTimeRef.current = performance.now();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      st?.kill();
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  const handleItemClick = (index, slug) => {
    lastInteractionTimeRef.current = performance.now();
    velocityRef.current = 0;
    
    // If clicking on the already active item, navigate to shop
    if (Math.round(currentIndexRef.current) === index) {
      navigate(`/shop?category=${slug}`);
      return;
    }
    
    targetIndexRef.current = index;
  };

  const activeCategory = CATEGORIES[selectedIndex] || CATEGORIES[0];

  return (
    <div className="category-wheel-outer" ref={outerRef}>
      <section 
        className="category-wheel-section" 
        ref={containerRef} 
        tabIndex={0}
        aria-label="Synchronized Category & Image Selector Wheel"
      >
        {/* Luxury DotField Shader Background */}
        <div className="category-wheel-dotfield-bg">
          <DotField
            dotRadius={1.5}
            dotSpacing={16}
            bulgeStrength={70}
            glowRadius={180}
            gradientFrom="rgba(244, 208, 153, 0.35)"
            gradientTo="rgba(188, 156, 108, 0.15)"
            glowColor="rgba(201, 168, 76, 0.25)"
          />
        </div>

        {/* Floating Atelier Header */}
        <div className="category-wheel-floating-header">
          <span className="cat-wheel-tag">COLLECTIONS ATELIER</span>
          <h2 className="cat-wheel-title">Explore By Category</h2>
          <p className="cat-wheel-subtitle">
            <span className="cat-wheel-sub-desktop">Scroll, drag or click to discover handcrafted fine jewellery suites</span>
            <span className="cat-wheel-sub-mobile">Swipe or tap to explore bespoke collections</span>
          </p>
        </div>

        <div className="category-wheel-sr-only">
          Current selected category: {activeCategory.name}
        </div>

        {/* Dual Wheel Stage Container */}
        <div className="category-wheel-stage">
          {/* LEFT WHEEL: Text Categories */}
          <div className="category-wheel-viewport">
            <div className="category-wheel-track">
              {CATEGORIES.map((catObj, idx) => (
                <div
                  key={catObj.name}
                  ref={(el) => (itemsRef.current[idx] = el)}
                  className="category-wheel-item"
                  onClick={() => handleItemClick(idx, catObj.slug)}
                >
                  <span className="category-wheel-indicator" />
                  <span className="category-wheel-text">{catObj.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT WHEEL: Vertical drum image cylinder */}
          <div className="category-wheel-image-viewport">
            <div className="category-wheel-image-track">
              {CATEGORIES.map((catObj, idx) => (
                <div
                  key={`img-${catObj.name}`}
                  ref={(el) => (imageItemsRef.current[idx] = el)}
                  className="category-wheel-image-item"
                  onClick={() => handleItemClick(idx, catObj.slug)}
                >
                  <img src={catObj.image} alt={catObj.name} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Swipe Guidance Micro-Indicator */}
        <div className="cat-wheel-mobile-guidance">
          <div className="cat-wheel-scroll-pill">
            <span className="cat-wheel-drag-dot" />
            <span>Swipe or scroll to rotate</span>
          </div>
        </div>
      </section>
    </div>
  );
}
