import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../data/products';
import { getMediaUrl, getProductImage } from '../../utils/api';
import InquiryModal from './InquiryModal';

const categoryEmoji = (category) => {
  switch (category) {
    case 'Rings':       return '💍';
    case 'Earrings':    return '✨';
    case 'Necklaces':   return '📿';
    case 'Bracelets':   return '⭐';
    case 'Bangles':     return '🔅';
    case 'Chains':      return '🔗';
    case 'Pendants':    return '💎';
    case 'Nose Pins':   return '✧';
    case 'Anklets':     return '🌙';
    case 'Bridal Sets': return '👑';
    case 'Kids':        return '🌟';
    default:            return '💎';
  }
};

export default function ProductCard({ product, onQuickView }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id || product.id);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  
  // Robust image path extraction
  const rawImageUrl = getProductImage(product);
  const imageUrl = rawImageUrl && !imgError ? getMediaUrl(rawImageUrl) : null;

  return (
    <div className="product-card">
      <div className="product-card-image">

        {/* Shimmering Skeleton Loader */}
        {imageUrl && !imgLoaded && !imgError && (
          <div className="shimmer-loader" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
          }} />
        )}

        {/* Fallback placeholder (always rendered below) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, var(--color-beige) 0%, var(--color-cream) 50%, var(--color-pearl) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          zIndex: 0,
        }}>
          {categoryEmoji(product.category)}
        </div>

        {/* Product Image (on top of fallback) */}
        {imageUrl && (
          <img 
            src={imageUrl}
            alt={product.name}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            onLoad={() => setImgLoaded(true)}
            className={imgLoaded ? 'fade-in' : ''}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease-out',
            }}
          />
        )}

        {/* Badges */}
        <div className="product-card-badges" style={{ zIndex: 3 }}>
          {product.badge === 'new' && <span className="badge badge-new">New</span>}
          {product.badge === 'sale' && <span className="badge badge-sale">{product.discountPercentage || product.discount}% Off</span>}
          {product.badge === 'trending' && <span className="badge badge-trending">Trending</span>}
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions" style={{ zIndex: 3 }}>
          <button
            className={`product-card-action-btn ${wishlisted ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            aria-label="Add to wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {onQuickView ? (
            <button className="product-card-action-btn" onClick={(e) => { e.preventDefault(); onQuickView(product); }} aria-label="Quick view">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            </button>
          ) : (
            <Link to={`/product/${product.slug}`} className="product-card-action-btn" aria-label="Quick view">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            </Link>
          )}
        </div>

        {/* Quick Inquiry instead of Quick Add */}
        <div className="product-card-quick-add" style={{ zIndex: 3 }}>
          <button onClick={(e) => { e.preventDefault(); setIsInquiryOpen(true); }}>Send Inquiry</button>
        </div>
      </div>

      <Link to={`/product/${product.slug}`}>
        <div className="product-card-info">
          <div className="product-card-category">{product.category}</div>
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-material">{product.metal} · {product.weight || product.grossWeight}</div>
          <div className="product-card-price">
            <span className="current">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="original">{formatPrice(product.originalPrice)}</span>}
            {(product.discountPercentage > 0 || product.discount > 0) && (
              <span className="discount">{product.discountPercentage || product.discount}% off</span>
            )}
          </div>
          <div className="product-card-rating">
            <span className="stars">{stars}</span>
            <span className="count">({product.reviewCount || product.numReviews || 0})</span>
          </div>
        </div>
      </Link>

      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        product={product} 
        initialInquiryType="Price Inquiry"
      />
    </div>
  );
}

