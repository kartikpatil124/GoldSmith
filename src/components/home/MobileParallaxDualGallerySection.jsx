import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
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
import './MobileParallaxDualGallerySection.css';

/*
  Mobile 2-Column Counter-Parallax Gallery Section
  ─────────────────────────────────────────────────────────────
  Exact 2-column scroll-driven parallax gallery where Left Column
  moves upward and Right Column moves downward in opposite
  vertical directions with calibrated translation speeds.
*/

const LEFT_ITEMS = [
  {
    title: 'Emerald Tear Drops',
    tag: 'ROYAL EMERALD',
    slug: 'royal-emerald-drop-earrings',
    image: img2,
  },
  {
    title: 'Sapphire Heart Gem',
    tag: '18K ROSE GOLD',
    slug: 'sapphire-heart-pendant',
    image: img4,
  },
  {
    title: 'Elysian Heritage Choker',
    tag: 'TEMPLE GOLD',
    slug: 'maharani-bridal-necklace-set',
    image: img6,
  },
  {
    title: 'Solitaire Platinum Drop',
    tag: 'CERTIFIED VS1',
    slug: 'celestial-diamond-solitaire-ring',
    image: img10,
  },
  {
    title: 'Imperial Cascade Earrings',
    tag: 'ATELIER 08',
    slug: 'royal-emerald-drop-earrings',
    image: img12,
  },
];

const RIGHT_ITEMS = [
  {
    title: 'Infinity Diamond Tennis',
    tag: '18K WHITE GOLD',
    slug: 'infinity-diamond-tennis-bracelet',
    image: img3,
  },
  {
    title: 'Maharani Bridal Suite',
    tag: '22K RUBY & GOLD',
    slug: 'maharani-bridal-necklace-set',
    image: img5,
  },
  {
    title: 'Floral Heritage Bangles',
    tag: '22K HANDCRAFTED',
    slug: 'floral-gold-bangle-set',
    image: img8,
  },
  {
    title: 'Serpentine Gold Rope',
    tag: 'HIGH POLISH',
    slug: 'serpentine-gold-chain',
    image: img9,
  },
  {
    title: 'Diamond Line Bracelet',
    tag: 'BRILLIANT CUT',
    slug: 'infinity-diamond-tennis-bracelet',
    image: img11,
  },
  {
    title: 'Masterpiece Gold Choker',
    tag: 'ROYAL BRIDAL',
    slug: 'maharani-bridal-necklace-set',
    image: img13,
  },
];

export default function MobileParallaxDualGallerySection() {
  const containerRef = useRef(null);

  // Measure scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // LEFT Column: moves UPWARD as user scrolls down (enters from bottom, moves upward)
  const yLeft = useTransform(scrollYProgress, [0, 1], ['14%', '-38%']);

  // RIGHT Column: moves DOWNWARD in opposite direction (enters from top, moves downward)
  const yRight = useTransform(scrollYProgress, [0, 1], ['-36%', '14%']);

  return (
    <section ref={containerRef} className="mobile-parallax-gallery-section">
      {/* Editorial Header */}
      <div className="parallax-gallery-header">
        <span className="parallax-badge">DUAL PARALLAX EXHIBITION</span>
        <h2 className="parallax-title">The Atelier Archive</h2>
        <p className="parallax-subtitle">Counter-flowing curated gallery</p>
      </div>

      {/* Dual Column Parallax Container */}
      <div className="parallax-dual-track-wrapper">
        {/* Left Column — Moves Upward */}
        <motion.div
          className="parallax-column col-left"
          style={{ y: yLeft }}
        >
          {LEFT_ITEMS.map((item, idx) => (
            <Link
              key={`left-${idx}`}
              to={`/product/${item.slug}`}
              className="parallax-gallery-card"
              aria-label={`View ${item.title}`}
            >
              <div className="parallax-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="parallax-img"
                />
                <div className="parallax-card-gradient" />
              </div>
              <div className="parallax-card-info">
                <span className="parallax-card-tag">{item.tag}</span>
                <h3 className="parallax-card-name">{item.title}</h3>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Right Column — Moves Downward */}
        <motion.div
          className="parallax-column col-right"
          style={{ y: yRight }}
        >
          {RIGHT_ITEMS.map((item, idx) => (
            <Link
              key={`right-${idx}`}
              to={`/product/${item.slug}`}
              className="parallax-gallery-card"
              aria-label={`View ${item.title}`}
            >
              <div className="parallax-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="parallax-img"
                />
                <div className="parallax-card-gradient" />
              </div>
              <div className="parallax-card-info">
                <span className="parallax-card-tag">{item.tag}</span>
                <h3 className="parallax-card-name">{item.title}</h3>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
