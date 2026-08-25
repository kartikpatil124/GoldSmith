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
import img10 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_05 AM.png';
import img11 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_08 AM.png';
import img12 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_10 AM.png';
import img13 from '../../../images/ChatGPT Image Jul 27, 2026, 12_02_12 AM.png';
import './Mobile3DCardFieldSection.css';

gsap.registerPlugin(ScrollTrigger);

/*
  Mobile 3D Perspective Card Conveyor Corridor
  ─────────────────────────────────────────────────────────────
  Continuous 3-track 3D perspective card wall.
  Cards move continuously through upper, middle, and lower
  depth tracks with diagonal offset and natural viewport clipping.
*/

const UPPER_TRACK_CARDS = [
  { id: 'u1', title: 'Emerald Tear Drops', tag: '18K WHITE GOLD', slug: 'royal-emerald-drop-earrings', image: img2 },
  { id: 'u2', title: 'Sapphire Heart Gem', tag: '18K ROSE GOLD', slug: 'sapphire-heart-pendant', image: img4 },
  { id: 'u3', title: 'Elysian Heritage Choker', tag: 'TEMPLE GOLD', slug: 'maharani-bridal-necklace-set', image: img6 },
  { id: 'u4', title: 'Floral Heritage Bangles', tag: '22K HANDCRAFTED', slug: 'floral-gold-bangle-set', image: img8 },
  { id: 'u5', title: 'Solitaire Platinum Drop', tag: 'CERTIFIED VS1', slug: 'celestial-diamond-solitaire-ring', image: img10 },
];

const MIDDLE_TRACK_CARDS = [
  { id: 'm1', title: 'Celestial Solitaire Ring', tag: '18K YELLOW GOLD', slug: 'celestial-diamond-solitaire-ring', image: main1Img },
  { id: 'm2', title: 'Infinity Diamond Tennis', tag: 'BRILLIANT CUT', slug: 'infinity-diamond-tennis-bracelet', image: img3 },
  { id: 'm3', title: 'Maharani Bridal Suite', tag: '22K RUBY & GOLD', slug: 'maharani-bridal-necklace-set', image: img5 },
  { id: 'm4', title: 'Serpentine Gold Rope', tag: 'HIGH POLISH 916', slug: 'serpentine-gold-chain', image: img9 },
  { id: 'm5', title: 'Diamond Line Bracelet', tag: '18K WHITE GOLD', slug: 'infinity-diamond-tennis-bracelet', image: img11 },
  { id: 'm6', title: 'Masterpiece Gold Choker', tag: 'ROYAL BRIDAL', slug: 'maharani-bridal-necklace-set', image: img13 },
];

const LOWER_TRACK_CARDS = [
  { id: 'l1', title: 'Sapphire Heart Gem', tag: '18K ROSE GOLD', slug: 'sapphire-heart-pendant', image: img4 },
  { id: 'l2', title: 'Floral Gold Bangles', tag: '22K TRADITIONAL', slug: 'floral-gold-bangle-set', image: img8 },
  { id: 'l3', title: 'Imperial Cascade Earrings', tag: 'ATELIER 08', slug: 'royal-emerald-drop-earrings', image: img12 },
  { id: 'l4', title: 'Emerald Tear Drops', tag: '18K WHITE GOLD', slug: 'royal-emerald-drop-earrings', image: img2 },
  { id: 'l5', title: 'Maharani Bridal Suite', tag: '22K RUBY & GOLD', slug: 'maharani-bridal-necklace-set', image: img5 },
];

export default function Mobile3DCardFieldSection() {
  const runwayRef = useRef(null);
  const stageRef = useRef(null);
  const upperTrackRef = useRef(null);
  const middleTrackRef = useRef(null);
  const lowerTrackRef = useRef(null);

  useEffect(() => {
    if (!runwayRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const scrollDistancePx = window.innerHeight * 2.2; // 220vh scroll runway

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

      // Track A: Upper / Background Track (Speed 0.75x)
      if (upperTrackRef.current) {
        tl.fromTo(
          upperTrackRef.current,
          { xPercent: 12, yPercent: -8 },
          { xPercent: -48, yPercent: 14, duration: 1.0, ease: 'none' },
          0
        );
      }

      // Track B: Middle / Main Track (Speed 1.00x)
      if (middleTrackRef.current) {
        tl.fromTo(
          middleTrackRef.current,
          { xPercent: -42, yPercent: 12 },
          { xPercent: 28, yPercent: -26, duration: 1.0, ease: 'none' },
          0
        );
      }

      // Track C: Lower / Foreground Track (Speed 0.85x)
      if (lowerTrackRef.current) {
        tl.fromTo(
          lowerTrackRef.current,
          { xPercent: 22, yPercent: -10 },
          { xPercent: -42, yPercent: 18, duration: 1.0, ease: 'none' },
          0
        );
      }
    }, runwayRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mobile-3d-card-field-section">
      <div ref={runwayRef} className="corridor-scroll-runway">
        {/* Pinned Viewport Stage */}
        <div ref={stageRef} className="corridor-pinned-stage">
          {/* Header Title */}
          <div className="corridor-header">
            <span className="corridor-badge">PERSPECTIVE CORRIDOR</span>
            <h2 className="corridor-title">The Atelier Archive</h2>
            <p className="corridor-subtitle">Continuous 3D spatial exhibition</p>
          </div>

          {/* 3D Perspective Corridor Container */}
          <div className="corridor-3d-stage">
            {/* Track 1: Upper / Background Track */}
            <div ref={upperTrackRef} className="corridor-track track-upper">
              {UPPER_TRACK_CARDS.map((card) => (
                <Link
                  key={card.id}
                  to={`/product/${card.slug}`}
                  className="corridor-card card-upper"
                  aria-label={`View ${card.title}`}
                >
                  <div className="corridor-card-img-wrap">
                    <img src={card.image} alt={card.title} loading="lazy" />
                    <div className="corridor-card-gradient" />
                  </div>
                  <div className="corridor-card-info">
                    <span className="corridor-card-tag">{card.tag}</span>
                    <h3 className="corridor-card-name">{card.title}</h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Track 2: Middle / Main Track */}
            <div ref={middleTrackRef} className="corridor-track track-middle">
              {MIDDLE_TRACK_CARDS.map((card) => (
                <Link
                  key={card.id}
                  to={`/product/${card.slug}`}
                  className="corridor-card card-middle"
                  aria-label={`View ${card.title}`}
                >
                  <div className="corridor-card-img-wrap">
                    <img src={card.image} alt={card.title} loading="lazy" />
                    <div className="corridor-card-gradient" />
                  </div>
                  <div className="corridor-card-info">
                    <span className="corridor-card-tag">{card.tag}</span>
                    <h3 className="corridor-card-name">{card.title}</h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Track 3: Lower / Foreground Track */}
            <div ref={lowerTrackRef} className="corridor-track track-lower">
              {LOWER_TRACK_CARDS.map((card) => (
                <Link
                  key={card.id}
                  to={`/product/${card.slug}`}
                  className="corridor-card card-lower"
                  aria-label={`View ${card.title}`}
                >
                  <div className="corridor-card-img-wrap">
                    <img src={card.image} alt={card.title} loading="lazy" />
                    <div className="corridor-card-gradient" />
                  </div>
                  <div className="corridor-card-info">
                    <span className="corridor-card-tag">{card.tag}</span>
                    <h3 className="corridor-card-name">{card.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
