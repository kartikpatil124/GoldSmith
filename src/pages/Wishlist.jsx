import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Silk from '../components/ui/Silk';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../data/products';
import { getMediaUrl, getProductImage } from '../utils/api';
import InquiryModal from '../components/shop/InquiryModal';
import './Wishlist.css';

const WHATSAPP_PHONE = '919106251842';

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

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedInquiryProduct, setSelectedInquiryProduct] = useState(null);

  // Distinct categories available in current wishlist
  const availableCategories = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return [];
    const cats = new Set(wishlistItems.map(item => item.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [wishlistItems]);

  // Filtered items based on active chip
  const filteredItems = useMemo(() => {
    if (!wishlistItems) return [];
    if (selectedCategory === 'All') return wishlistItems;
    return wishlistItems.filter(item => item.category === selectedCategory);
  }, [wishlistItems, selectedCategory]);

  // Total valuation calculation
  const totalValuation = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return 0;
    return wishlistItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [wishlistItems]);

  // Build collective WhatsApp concierge message for entire vault
  const collectiveWhatsAppUrl = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return '#';
    let text = `Hello Goldsmiths Concierge! ✨\n\nI have curated a personal wishlist of ${wishlistItems.length} masterpiece${wishlistItems.length > 1 ? 's' : ''} on your website (Total Valuation: ${formatPrice(totalValuation)}):\n\n`;
    
    wishlistItems.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (${formatPrice(item.price)})`;
      if (item.metal || item.purity) {
        text += ` - ${item.purity || ''} ${item.metal || ''}`.trim();
      }
      text += `\n`;
    });

    text += `\nI would love to arrange a private consultation or check atelier availability for these pieces.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  }, [wishlistItems, totalValuation]);

  // Build individual WhatsApp inquiry message
  const getItemWhatsAppUrl = (item) => {
    const text = `Hello Goldsmiths Concierge! 💎\n\nI am interested in this piece from my wishlist:\n*${item.name}*\nPrice: ${formatPrice(item.price)}\nSKU: ${item.sku || item._id || item.id}\n\nPlease share further details regarding customization, certification, and atelier delivery.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you wish to clear all saved pieces from your vault?')) {
      wishlistItems.forEach(item => {
        removeFromWishlist(item._id || item.id);
      });
    }
  };

  return (
    <div className="wishlist-page-wrapper">
      {/* ── Fixed Silk WebGL Background ── */}
      <div className="wishlist-silk-bg" aria-hidden="true">
        <Silk
          speed={5}
          scale={1}
          color="#8c5fb3"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="wishlist-silk-overlay" />
      </div>

      <div className="wishlist-content-container">
        {/* ── Hero Vault Header ── */}
        <section className="wishlist-hero-card">
          <div className="wishlist-eyebrow">
            <span className="wishlist-sparkle">✦</span>
            <span>Private Atelier Vault</span>
            <span className="wishlist-sparkle">✦</span>
          </div>

          <h1 className="wishlist-title">My Wishlist</h1>

          <p className="wishlist-subtitle">
            Your handpicked selection of bespoke gold and diamond treasures. Send inquiries directly to our master jewellers or track consultation progress.
          </p>

          <div className="wishlist-stats-bar">
            {wishlistItems.length > 0 && (
              <>
                <div className="wishlist-stat-pill">
                  <span>Total Pieces:</span>
                  <span className="wishlist-stat-value">{wishlistItems.length}</span>
                </div>

                <div className="wishlist-stat-pill">
                  <span>Vault Valuation:</span>
                  <span className="wishlist-stat-value">{formatPrice(totalValuation)}</span>
                </div>
              </>
            )}

            <Link
              to="/enquiry"
              className="wishlist-my-enquiries-btn"
              title="View products with sent enquiries and check status"
            >
              <span>📋 My Enquiries</span>
            </Link>

            {wishlistItems.length > 0 && (
              <a
                href={collectiveWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wishlist-consult-btn"
                title="Send whole wishlist to master jeweller on WhatsApp"
              >
                <span>💬 Consult Concierge</span>
              </a>
            )}
          </div>
        </section>

        {/* ── Items Available View ── */}
        {wishlistItems.length > 0 ? (
          <>
            {/* Category Filter Toolbar */}
            <div className="wishlist-toolbar">
              <div className="wishlist-category-chips">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`wishlist-chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="wishlist-actions-right">
                <button
                  type="button"
                  className="wishlist-clear-btn"
                  onClick={handleClearWishlist}
                  title="Remove all items from wishlist"
                >
                  Clear Vault
                </button>
              </div>
            </div>

            {/* Wishlist Cards Grid */}
            <div className="wishlist-grid">
              {filteredItems.map(item => {
                const itemId = item._id || item.id;
                const rawImg = getProductImage(item);
                const imageUrl = rawImg ? getMediaUrl(rawImg) : null;
                const itemLink = `/product/${item.slug || itemId}`;

                return (
                  <article key={itemId} className="wishlist-card">
                    {/* Visual Media Frame */}
                    <div className="wishlist-img-frame">
                      <Link to={itemLink} className="wishlist-img-link">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="wishlist-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="wishlist-img-placeholder">
                            {categoryEmoji(item.category)}
                          </div>
                        )}
                      </Link>

                      {/* Category or Metal Badge */}
                      <span className="wishlist-badge">
                        {item.metal || item.category || 'Fine Jewellery'}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        onClick={() => removeFromWishlist(itemId)}
                        title="Remove from wishlist"
                        aria-label="Remove item"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Card Content Details */}
                    <div className="wishlist-card-body">
                      <div>
                        <div className="wishlist-item-meta">
                          {item.purity ? `${item.purity} • ` : ''}{item.category || 'Masterpiece'}
                        </div>

                        <Link to={itemLink} className="wishlist-item-title" title={item.name}>
                          {item.name}
                        </Link>

                        <div className="wishlist-item-specs">
                          <span>{item.inStock !== false ? 'In Stock' : 'Made to Order'}</span>
                          <span className="wishlist-spec-dot" />
                          <span>Certified BIS Hallmark</span>
                        </div>
                      </div>

                      <div>
                        {/* Price Display */}
                        <div className="wishlist-price-row">
                          <span className="wishlist-current-price">
                            {formatPrice(item.price)}
                          </span>
                          {(item.originalPrice || item.mrp) && Number(item.originalPrice || item.mrp) > Number(item.price) && (
                            <span className="wishlist-orig-price">
                              {formatPrice(item.originalPrice || item.mrp)}
                            </span>
                          )}
                        </div>

                        {/* Card Action Buttons: Enquiry Only */}
                        <div className="wishlist-card-actions">
                          <button
                            type="button"
                            className="wishlist-inquire-card-btn"
                            onClick={() => setSelectedInquiryProduct(item)}
                          >
                            <span>✨ Send Enquiry</span>
                          </button>

                          <a
                            href={getItemWhatsAppUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wishlist-wa-card-btn"
                            title="Inquire via WhatsApp"
                            aria-label="Inquire via WhatsApp"
                          >
                            💬
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          /* ── Empty Vault Card ── */
          <div className="wishlist-empty-card">
            <div className="wishlist-empty-icon" aria-hidden="true">
              💎
            </div>
            <h2 className="wishlist-empty-title">Your Vault is Empty</h2>
            <p className="wishlist-empty-desc">
              Your bespoke wishlist is currently empty. Explore our handcrafted jewellery collections and save your favourite creations for private consultations and bespoke orders.
            </p>
            <Link to="/shop" className="wishlist-explore-btn">
              Explore Collections →
            </Link>

            <div className="wishlist-quick-categories">
              <span className="wishlist-quick-cat-label">Popular:</span>
              <Link to="/shop?category=Rings" className="wishlist-quick-pill">💍 Rings</Link>
              <Link to="/shop?category=Necklaces" className="wishlist-quick-pill">📿 Necklaces</Link>
              <Link to="/shop?category=Earrings" className="wishlist-quick-pill">✨ Earrings</Link>
              <Link to="/shop?category=Bangles" className="wishlist-quick-pill">🔅 Bangles</Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Liquid-Glass Floating Summary Bar ── */}
      {wishlistItems.length > 0 && (
        <aside className="wishlist-mobile-floating-bar" aria-label="Wishlist Summary">
          <div className="wishlist-mobile-bar-info">
            <span className="wishlist-mobile-bar-count">
              {wishlistItems.length} Piece{wishlistItems.length > 1 ? 's' : ''} Saved
            </span>
            <span className="wishlist-mobile-bar-val">
              {formatPrice(totalValuation)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link to="/enquiry" className="wishlist-mobile-bar-inquiries">
              <span>📋 Enquiries</span>
            </Link>
            <a
              href={collectiveWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wishlist-mobile-bar-cta"
            >
              <span>💬 Concierge</span>
            </a>
          </div>
        </aside>
      )}

      {/* ── Modal for Direct Product Enquiry ── */}
      {selectedInquiryProduct && (
        <InquiryModal
          isOpen={!!selectedInquiryProduct}
          onClose={() => setSelectedInquiryProduct(null)}
          product={selectedInquiryProduct}
          initialInquiryType="Price Inquiry"
        />
      )}
    </div>
  );
}
