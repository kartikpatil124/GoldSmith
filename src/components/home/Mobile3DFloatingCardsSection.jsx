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
import './Mobile3DFloatingCardsSection.css';

gsap.registerPlugin(ScrollTrigger);

/*
  Mobile3DFloatingCardsSection
  ─────────────────────────────────────────────────────────────
  Spatial 3D card field suspended in perspective space.
  Driven by a pinned GSAP ScrollTrigger timeline where cards glide
  along 3D trajectories with depth scaling, asymmetric positioning,
  subtle tilts, and smooth focal transitions.
*/

const CARDS_DATA = [
  {
    id: 1,
    name: 'Celestial Diamond Solitaire',
    tag: 'SOLITAIRE · 18K',
    slug: 'celestial-diamond-solitaire-ring',
    image: main1Img,
    width: 160,
    height: 200,
  },
  {
    id: 2,
    name: 'Emerald Cascade Drops',
    tag: 'COLOMBIAN EMERALD',
    slug: 'royal-emerald-drop-earrings',
    image: img2,
    width: 140,
    height: 175,
  },
  {
    id: 3,
    name: 'Infinity Diamond Tennis',
    tag: 'BRILLIANT LINE',
    slug: 'infinity-diamond-tennis-bracelet',
    image: img3,
    width: 145,
    height: 180,
  },
  {
    id: 4,
    name: 'Sapphire Heart Pendant',
    tag: '18K ROSE GOLD',
    slug: 'sapphire-heart-pendant',
    image: img4,
    width: 135,
    height: 168,
  },
  {
    id: 5,
    name: 'Maharani Bridal Suite',
    tag: '22K ROYAL GOLD',
    slug: 'maharani-bridal-necklace-set',
    image: img5,
    width: 165,
    height: 210,
  },
  {
    id: 6,
    name: 'Elysian Temple Choker',
    tag: 'HERITAGE CRAFT',
    slug: 'maharani-bridal-necklace-set',
    image: img6,
    width: 140,
    height: 175,
  },
  {
    id: 7,
    name: 'Floral Gold Bangles',
    tag: '22K HANDCRAFTED',
    slug: 'floral-gold-bangle-set',
    image: img8,
    width: 135,
    height: 165,
  },
  {
    id: 8,
    name: 'Serpentine Gold Rope',
    tag: 'HIGH POLISH',
    slug: 'serpentine-gold-chain',
    image: img9,
    width: 140,
    height: 175,
  },
];

export default function Mobile3DFloatingCardsSection() {
  const runwayRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!runwayRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const scrollDistancePx = window.innerHeight * 2.6; // 260vh scroll runway

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: runwayRef.current,
          start: 'top top',
          end: `+=${scrollDistancePx}`,
          pin: stageRef.current,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3D Spatial Choreography for 8 suspended cards
      // Card 1: Center Hero in Phase 1 -> glides forward and parts upward
      if (cardsRef.current[0]) {
        tl.fromTo(
          cardsRef.current[0],
          { x: 0, y: 0, z: 60, rotateX: 2, rotateY: -3, rotateZ: -2, scale: 1.08, opacity: 1 },
          { x: 15, y: -240, z: 220, rotateX: -8, rotateY: 5, rotateZ: -6, scale: 1.25, opacity: 0.15, duration: 0.45, ease: 'power1.inOut' },
          0
        );
      }

      // Card 2: Upper Left -> drifts across and zooms in
      if (cardsRef.current[1]) {
        tl.fromTo(
          cardsRef.current[1],
          { x: -110, y: -130, z: -140, rotateX: 6, rotateY: 10, rotateZ: 5, scale: 0.85, opacity: 0.75 },
          { x: -75, y: -40, z: 40, rotateX: 0, rotateY: 2, rotateZ: 2, scale: 1.05, opacity: 1, duration: 0.50, ease: 'power1.inOut' },
          0
        ).to(
          cardsRef.current[1],
          { x: -140, y: 120, z: -80, rotateX: -4, rotateY: -8, rotateZ: 6, scale: 0.8, opacity: 0.2, duration: 0.50, ease: 'power1.inOut' },
          0.50
        );
      }

      // Card 3: Upper Right -> swoops into upper-center focus
      if (cardsRef.current[2]) {
        tl.fromTo(
          cardsRef.current[2],
          { x: 120, y: -140, z: -200, rotateX: 8, rotateY: -12, rotateZ: -5, scale: 0.8, opacity: 0.65 },
          { x: 80, y: -30, z: 60, rotateX: -2, rotateY: -4, rotateZ: -2, scale: 1.08, opacity: 1, duration: 0.52, ease: 'power1.inOut' },
          0.05
        ).to(
          cardsRef.current[2],
          { x: 150, y: 140, z: -100, rotateX: -6, rotateY: 10, rotateZ: -7, scale: 0.75, opacity: 0.15, duration: 0.43, ease: 'power1.inOut' },
          0.57
        );
      }

      // Card 4: Mid Left -> drifts toward center
      if (cardsRef.current[3]) {
        tl.fromTo(
          cardsRef.current[3],
          { x: -140, y: 80, z: -240, rotateX: -6, rotateY: 14, rotateZ: -4, scale: 0.75, opacity: 0.5 },
          { x: -50, y: 15, z: 80, rotateX: 2, rotateY: 4, rotateZ: 1, scale: 1.06, opacity: 1, duration: 0.48, ease: 'power1.inOut' },
          0.20
        ).to(
          cardsRef.current[3],
          { x: -160, y: -120, z: 200, rotateX: 8, rotateY: 12, rotateZ: -5, scale: 1.2, opacity: 0, duration: 0.32, ease: 'power1.in' },
          0.68
        );
      }

      // Card 5: Main Center Hero in Phase 2 -> Rises from deep space to become dominant center focus
      if (cardsRef.current[4]) {
        tl.fromTo(
          cardsRef.current[4],
          { x: 0, y: 180, z: -320, rotateX: -12, rotateY: 0, rotateZ: 4, scale: 0.65, opacity: 0.3 },
          { x: 0, y: -10, z: 120, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.22, opacity: 1, duration: 0.45, ease: 'power2.out' },
          0.35
        ).to(
          cardsRef.current[4],
          { x: 20, y: -160, z: 240, rotateX: -6, rotateY: 6, rotateZ: -3, scale: 1.3, opacity: 0.2, duration: 0.20, ease: 'power1.in' },
          0.80
        );
      }

      // Card 6: Lower Center -> Enters from below in phase 2/3
      if (cardsRef.current[5]) {
        tl.fromTo(
          cardsRef.current[5],
          { x: 90, y: 160, z: -220, rotateX: -8, rotateY: -10, rotateZ: 5, scale: 0.75, opacity: 0.4 },
          { x: 60, y: 30, z: 70, rotateX: 1, rotateY: -2, rotateZ: 1, scale: 1.05, opacity: 1, duration: 0.42, ease: 'power1.inOut' },
          0.45
        ).to(
          cardsRef.current[5],
          { x: 120, y: -80, z: -60, rotateX: 4, rotateY: 8, rotateZ: 4, scale: 0.85, opacity: 0.3, duration: 0.13, ease: 'power1.out' },
          0.87
        );
      }

      // Card 7: Lower Left -> Enters in late phase
      if (cardsRef.current[6]) {
        tl.fromTo(
          cardsRef.current[6],
          { x: -120, y: 200, z: -300, rotateX: -10, rotateY: 12, rotateZ: -6, scale: 0.65, opacity: 0 },
          { x: -70, y: 20, z: 90, rotateX: 0, rotateY: 2, rotateZ: -1, scale: 1.1, opacity: 1, duration: 0.35, ease: 'power1.out' },
          0.58
        );
      }

      // Card 8: Lower Right -> Final climax focus piece
      if (cardsRef.current[7]) {
        tl.fromTo(
          cardsRef.current[7],
          { x: 60, y: 220, z: -350, rotateX: -14, rotateY: -8, rotateZ: 7, scale: 0.6, opacity: 0 },
          { x: 0, y: 0, z: 130, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.2, opacity: 1, duration: 0.35, ease: 'power2.out' },
          0.62
        );
      }
    }, runwayRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mobile-3d-floating-cards-section">
      <div ref={runwayRef} className="floating-cards-runway">
        {/* Pinned 3D Viewport Stage */}
        <div ref={stageRef} className="floating-cards-stage">
          {/* Section Editorial Header */}
          <div className="floating-cards-header">
            <span className="floating-cards-badge">SPATIAL GALLERY</span>
            <h2 className="floating-cards-title">Atelier in Motion</h2>
            <p className="floating-cards-subtitle">3D Spatial Exhibition • Scroll to Fly</p>
          </div>

          {/* 3D Perspective Universe */}
          <div className="floating-cards-universe">
            {CARDS_DATA.map((card, idx) => (
              <Link
                key={card.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                to={`/product/${card.slug}`}
                className="floating-3d-card"
                style={{
                  width: `${card.width}px`,
                  height: `${card.height}px`,
                }}
                aria-label={`View ${card.name}`}
              >
                <div className="floating-card-inner">
                  <div className="floating-card-img-wrap">
                    <img src={card.image} alt={card.name} loading="lazy" />
                    <div className="floating-card-gradient" />
                  </div>
                  <div className="floating-card-info">
                    <span className="floating-card-tag">{card.tag}</span>
                    <h3 className="floating-card-name">{card.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Background Ambient Glows */}
          <div className="floating-cards-glow top-right" />
          <div className="floating-cards-glow bottom-left" />
        </div>
      </div>
    </section>
  );
}
