import React from 'react';
import { Link } from 'react-router-dom';
import Silk from '../components/ui/Silk';
import './Collections.css';

export default function Collections() {
  return (
    <div className="collections-page-wrapper">
      {/* ── Dynamic Silk WebGL Shader Background (Exact same background as Shop Page) ── */}
      <div className="shop-silk-bg">
        <Silk
          speed={5}
          scale={1}
          color="#8c5fb3"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="shop-silk-overlay" />
      </div>

      {/* ── Centered Coming Soon Showcase ── */}
      <div className="collections-center-content">
        <div className="collections-tag">
          <span className="collections-tag-sparkle">✦</span>
          <span>HAUTE JOAILLERIE ATELIER</span>
          <span className="collections-tag-sparkle">✦</span>
        </div>

        <h1 className="collections-heading">
          Coming Soon
        </h1>

        <div className="collections-gold-divider">
          <span className="gold-divider-line" />
          <span className="gold-divider-diamond">◆</span>
          <span className="gold-divider-line" />
        </div>

        <p className="collections-subtext">
          Our curated high-jewellery collections and bespoke suites are currently being sculpted.
        </p>

        <div className="collections-cta-wrapper">
          <Link to="/shop" className="collections-explore-btn">
            Explore All Masterpieces
            <span className="collections-btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
