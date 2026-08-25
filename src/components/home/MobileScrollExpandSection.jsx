import React from 'react';
import { Link } from 'react-router-dom';
import ScrollExpand from '../ui/ScrollExpand';
import main1Img from '../../../images/main1.png';
import './MobileScrollExpandSection.css';

/*
  Mobile ScrollExpand Section
  ─────────────────────────────────────────────────────────────
  Scroll-driven expanding showcase featuring the Elysian Diamond
  Necklace portrait. The starting frame zooms in on the neck &
  necklace detail, expanding seamlessly to full-bleed on scroll.
*/

export default function MobileScrollExpandSection() {
  return (
    <section className="mobile-scroll-expand-section">
      <ScrollExpand
        src={main1Img}
        alt="Elysian Diamond Suite"
        title="Elysian Diamond Suite"
        scrollHint="Scroll to Reveal"
        startWidth={64}
        startHeight={56}
        startRadius={28}
        endRadius={0}
        mediaZoom={1.55}
        mediaOrigin="center 62%"
        scrollDistance={1.3}
        holdDistance={0.4}
        smoothing={0.12}
        overlayScrim={0.55}
        useWindowScroll={true}
      >
        <div className="mobile-expand-content">
          <span className="expand-gold-badge">BESPOKE HIGH JEWELLERY</span>
          <h3 className="expand-heading">The Elysian Diamond Choker</h3>
          <p className="expand-desc">
            Handcrafted in 18K White Gold with 52.4 Carats of Individually Certified Pear &amp; Brilliant Cut Diamonds.
          </p>
          <div className="expand-actions">
            <Link to="/product/celestial-diamond-solitaire-ring" className="expand-cta-btn">
              <span>Inquire at Atelier</span>
              <span className="expand-arrow">→</span>
            </Link>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
}
