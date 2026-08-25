import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import main1Img from '../../../images/main1.png';
import img2 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_39 AM.png';
import img3 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_43 AM.png';
import img4 from '../../../images/ChatGPT Image Jul 26, 2026, 12_18_46 AM.png';
import img5 from '../../../images/ChatGPT Image Jul 26, 2026, 12_22_37 AM.png';
import img8 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_01 AM.png';
import img9 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_03 AM.png';
import './Mobile3DCardFieldSection.css';

gsap.registerPlugin(ScrollTrigger);

/*
  Mobile Cinematic 3D Floating Card Scroll Section
  ─────────────────────────────────────────────────────────────
  Spatial 3D card field suspended in virtual perspective space.
  Scroll progress drives continuous 3D translations (X, Y, Z),
  subtle rotations, scale adjustments, and dynamic hero focus.
*/

const SPATIAL_CARDS = [
  {
    id: 'card-1',
    title: 'Emerald Tear Drops',
    tag: 'ROYAL EMERALD',
    slug: 'royal-emerald-drop-earrings',
    image: img2,
  },
  {
    id: 'card-2',
    title: 'Celestial Solitaire Ring',
    tag: '18K YELLOW GOLD',
    slug: 'celestial-diamond-solitaire-ring',
    image: main1Img,
  },
  {
    id: 'card-3',
    title: 'Maharani Bridal Suite',
    tag: '22K RUBY & GOLD',
    slug: 'maharani-bridal-necklace-set',
    image: img5,
  },
  {
    id: 'card-4',
    title: 'Infinity Diamond Tennis',
    tag: '18K WHITE GOLD',
    slug: 'infinity-diamond-tennis-bracelet',
    image: img3,
  },
  {
    id: 'card-5',
    title: 'Sapphire Heart Gem',
    tag: '18K ROSE GOLD',
    slug: 'sapphire-heart-pendant',
    image: img4,
  },
  {
    id: 'card-6',
    title: 'Floral Heritage Bangles',
    tag: '22K HANDCRAFTED',
    slug: 'floral-gold-bangle-set',
    image: img8,
  },
  {
    id: 'card-7',
    title: 'Serpentine Gold Rope',
    tag: 'HIGH POLISH 916',
    slug: 'serpentine-gold-chain',
    image: img9,
  },
];

export default function Mobile3DCardFieldSection() {
  const runwayRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!runwayRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const scrollDistancePx = window.innerHeight * 2.4; // 240vh scroll runway

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

      const cards = cardsRef.current;

      // ── Card 1 (Emerald): Starts top-left, takes hero focus at 30%, exits upper-left ──
      if (cards[0]) {
        tl.fromTo(
          cards[0],
          {
            xPercent: -42,
            yPercent: -35,
            z: -90,
            rotationX: 4,
            rotationY: 8,
            rotationZ: -5,
            scale: 0.86,
            opacity: 0.85,
          },
          {
            xPercent: 0,
            yPercent: 0,
            z: 80,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1.10,
            opacity: 1,
            duration: 0.32,
            ease: 'power2.out',
          },
          0
        ).to(
          cards[0],
          {
            xPercent: -70,
            yPercent: -50,
            z: -180,
            rotationX: 6,
            rotationY: 12,
            rotationZ: -8,
            scale: 0.74,
            opacity: 0.35,
            duration: 0.38,
            ease: 'power2.in',
          },
          0.38
        );
      }

      // ── Card 2 (Solitaire): Starts lower-right, takes hero focus at 62%, exits upper-right ──
      if (cards[1]) {
        tl.fromTo(
          cards[1],
          {
            xPercent: 55,
            yPercent: 42,
            z: -140,
            rotationX: -5,
            rotationY: -8,
            rotationZ: 6,
            scale: 0.78,
            opacity: 0.7,
          },
          {
            xPercent: 0,
            yPercent: 0,
            z: 88,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1.12,
            opacity: 1,
            duration: 0.36,
            ease: 'power2.inOut',
          },
          0.26
        ).to(
          cards[1],
          {
            xPercent: 65,
            yPercent: -45,
            z: -160,
            rotationX: -6,
            rotationY: -10,
            rotationZ: 6,
            scale: 0.78,
            opacity: 0.35,
            duration: 0.32,
            ease: 'power2.in',
          },
          0.66
        );
      }

      // ── Card 3 (Maharani Bridal): Starts lower-left, takes hero focus at 90% ──
      if (cards[2]) {
        tl.fromTo(
          cards[2],
          {
            xPercent: -55,
            yPercent: 48,
            z: -170,
            rotationX: 5,
            rotationY: 6,
            rotationZ: 4,
            scale: 0.75,
            opacity: 0.6,
          },
          {
            xPercent: 0,
            yPercent: 0,
            z: 85,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1.10,
            opacity: 1,
            duration: 0.40,
            ease: 'power2.out',
          },
          0.54
        );
      }

      // ── Card 4 (Tennis Bracelet): Starts upper-right, drifts toward upper-left depth ──
      if (cards[3]) {
        tl.fromTo(
          cards[3],
          {
            xPercent: 48,
            yPercent: -42,
            z: -80,
            rotationX: -4,
            rotationY: -6,
            rotationZ: 7,
            scale: 0.84,
            opacity: 0.8,
          },
          {
            xPercent: -50,
            yPercent: -35,
            z: -140,
            rotationX: 5,
            rotationY: 8,
            rotationZ: -4,
            scale: 0.75,
            opacity: 0.45,
            duration: 0.70,
            ease: 'none',
          },
          0.10
        );
      }

      // ── Card 5 (Sapphire Heart): Starts center-bottom, recedes into depth ──
      if (cards[4]) {
        tl.fromTo(
          cards[4],
          {
            xPercent: 12,
            yPercent: 52,
            z: -110,
            rotationX: -6,
            rotationY: 4,
            rotationZ: -3,
            scale: 0.82,
            opacity: 0.75,
          },
          {
            xPercent: -35,
            yPercent: 40,
            z: -200,
            rotationX: -8,
            rotationY: 6,
            rotationZ: -5,
            scale: 0.70,
            opacity: 0.3,
            duration: 0.65,
            ease: 'none',
          },
          0.20
        );
      }

      // ── Card 6 (Floral Bangles): Enters from bottom-left flank ──
      if (cards[5]) {
        tl.fromTo(
          cards[5],
          {
            xPercent: -60,
            yPercent: 65,
            z: -60,
            rotationX: 4,
            rotationY: -5,
            rotationZ: 5,
            scale: 0.80,
            opacity: 0.65,
          },
          {
            xPercent: 45,
            yPercent: 35,
            z: -120,
            rotationX: -4,
            rotationY: 6,
            rotationZ: -4,
            scale: 0.78,
            opacity: 0.5,
            duration: 0.75,
            ease: 'none',
          },
          0.15
        );
      }

      // ── Card 7 (Serpentine Rope): Enters from upper-center flank ──
      if (cards[6]) {
        tl.fromTo(
          cards[6],
          {
            xPercent: -15,
            yPercent: -60,
            z: -130,
            rotationX: 6,
            rotationY: -4,
            rotationZ: -6,
            scale: 0.76,
            opacity: 0.6,
          },
          {
            xPercent: 50,
            yPercent: -30,
            z: -80,
            rotationX: -3,
            rotationY: 5,
            rotationZ: 4,
            scale: 0.85,
            opacity: 0.75,
            duration: 0.70,
            ease: 'none',
          },
          0.25
        );
      }

      // Final brief hold
      tl.to({}, { duration: 0.05 }, 0.95);
    }, runwayRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mobile-3d-card-field-section">
      <div ref={runwayRef} className="spatial-scroll-runway">
        {/* Pinned Viewport Stage */}
        <div ref={stageRef} className="spatial-pinned-stage">
          {/* Header Title */}
          <div className="spatial-header">
            <span className="spatial-badge">SPATIAL DIMENSION</span>
            <h2 className="spatial-title">Floating Atelier</h2>
            <p className="spatial-subtitle">Scroll through the 3D constellation</p>
          </div>

          {/* 3D Perspective Canvas */}
          <div className="spatial-3d-stage">
            {SPATIAL_CARDS.map((card, idx) => (
              <Link
                key={card.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                to={`/product/${card.slug}`}
                className="spatial-card"
                aria-label={`View ${card.title}`}
              >
                <div className="spatial-card-img-wrap">
                  <img src={card.image} alt={card.title} loading="lazy" />
                  <div className="spatial-card-gradient" />
                </div>
                <div className="spatial-card-info">
                  <span className="spatial-card-tag">{card.tag}</span>
                  <h3 className="spatial-card-name">{card.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Ambient Lighting Accents */}
          <div className="spatial-ambient-glow" />
        </div>
      </div>
    </section>
  );
}
