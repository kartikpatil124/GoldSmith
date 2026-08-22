import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="goldsmiths-footer">
      {/* Top Bar: Motto & Back-To-Top Button */}
      <div className="footer-top-bar">
        <h2 className="footer-motto">
          HERITAGE BY<br />TRADITION
        </h2>
        <button 
          className="footer-back-to-top" 
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>

      {/* Main 3-Column Editorial Grid */}
      <div className="footer-content-grid">
        {/* Column 1: Headquarters */}
        <div>
          <h4 className="footer-column-title">GOLDSMITHS</h4>
          <div className="footer-address-block">
            VIA GOLDSMITHS AVENUE, 108<br />
            <span className="footer-address-symbol">↳</span> 390001, GUJARAT<br />
            INDIA — SURAT
          </div>
        </div>

        {/* Column 2: Navigation Links (3 Subcolumns) */}
        <div>
          <h4 className="footer-column-title">NAVIGATION</h4>
          <div className="footer-nav-subgrid">
            <div>
              <Link to="/" className="footer-nav-link">HOME</Link>
              <Link to="/collections" className="footer-nav-link">COLLECTIONS</Link>
              <Link to="/shop" className="footer-nav-link">SHOWROOM</Link>
            </div>
            <div>
              <Link to="/bridal" className="footer-nav-link">BRIDAL</Link>
              <Link to="/custom-order" className="footer-nav-link">CUSTOM ORDERS</Link>
              <Link to="/about" className="footer-nav-link">ABOUT US</Link>
            </div>
            <div>
              <Link to="/shop?category=diamonds" className="footer-nav-link">ATELIER</Link>
              <Link to="/faq" className="footer-nav-link">FAQ</Link>
              <Link to="/contact" className="footer-nav-link">CONTACT</Link>
            </div>
          </div>
        </div>

        {/* Column 3: Follow & Socials */}
        <div>
          <h4 className="footer-column-title">FOLLOW</h4>
          <div className="footer-social-subgrid">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-nav-link">INSTAGRAM</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="footer-nav-link">PINTEREST</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-nav-link">FACEBOOK</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-nav-link">LINKEDIN</a>
            <a href="https://wa.me/919106251842" target="_blank" rel="noreferrer" className="footer-nav-link">WHATSAPP</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-nav-link">YOUTUBE</a>
          </div>
        </div>
      </div>

      {/* Giant Full-Bleed Watermark Brand Logo */}
      <div className="footer-watermark-wrapper">
        <h1 className="footer-watermark-text">goldsmiths</h1>
      </div>

      {/* Bottom Bar Capsule */}
      <div className="footer-bottom-capsule">
        <span>©2026 GOLDSMITHS JEWELS</span>
        <span>REG NO. GSTIN24AAACG1234F1Z — BIS HALLMARKED</span>
        <div>
          <Link to="/policies/privacy" className="footer-bottom-link">LEGAL</Link>
          {' — '}
          <Link to="/policies/privacy" className="footer-bottom-link">PRIVACY</Link>
          {' — '}
          <Link to="/policies/terms" className="footer-bottom-link">COOKIES</Link>
        </div>
      </div>
    </footer>
  );
}
