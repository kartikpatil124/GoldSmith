import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../data/products';
import { getMediaUrl, getProductImage } from '../../utils/api';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id || product.id);

  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  
  // Robust image path extraction
  const imageUrl = getProductImage(product);

  return (
    <div className="product-card">
      <div className="product-card-image">

        {/* Placeholder with gradient */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, var(--color-beige) 0%, var(--color-cream) 50%, var(--color-pearl) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
          {product.category === 'Rings' ? '💍' : product.category === 'Earrings' ? '✨' : product.category === 'Necklaces' ? '📿' : product.category === 'Bracelets' ? '⭐' : product.category === 'Bangles' ? '🔅' : product.category === 'Chains' ? '🔗' : product.category === 'Pendants' ? '💎' : product.category === 'Nose Pins' ? '✧' : product.category === 'Anklets' ? '🌙' : product.category === 'Bridal Sets' ? '👑' : product.category === 'Kids' ? '🌟' : '💎'}
        </div>

        {/* Dynamic Image Overlay */}
        {imageUrl && (
          <img 
            src={getMediaUrl(imageUrl)} 
            alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />
        )}

        {/* Badges */}
        <div className="product-card-badges" style={{ zIndex: 2 }}>
          {product.badge === 'new' && <span className="badge badge-new">New</span>}
          {product.badge === 'sale' && <span className="badge badge-sale">{product.discount}% Off</span>}
          {product.badge === 'trending' && <span className="badge badge-trending">Trending</span>}
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions" style={{ zIndex: 2 }}>
          <button className={`product-card-action-btn ${wishlisted ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleWishlist(product); }} aria-label="Add to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
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

        {/* Quick Add */}
        <div className="product-card-quick-add" style={{ zIndex: 2 }}>
          <button onClick={(e) => { e.preventDefault(); addToCart(product); }}>Add to Bag</button>
        </div>
      </div>

      <Link to={`/product/${product.slug}`}>
        <div className="product-card-info">
          <div className="product-card-category">{product.category}</div>
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-material">{product.metal} · {product.weight}</div>
          <div className="product-card-price">
            <span className="current">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="original">{formatPrice(product.originalPrice)}</span>}
            {product.discount > 0 && <span className="discount">{product.discount}% off</span>}
          </div>
          <div className="product-card-rating">
            <span className="stars">{stars}</span>
            <span className="count">({product.reviewCount})</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
