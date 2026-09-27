import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import shopBg from '../../images/shopbg.png';
import { products as fallbackProducts, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/shop/ProductCard';
import api, { getMediaUrl, getProductImage } from '../utils/api';
import InquiryModal from '../components/shop/InquiryModal';

const getYouTubeEmbedId = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeMedia, setActiveMedia] = useState(null);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomActive, setZoomActive] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);

  // Inquiry Modal States
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState('Price Inquiry');

  // Sticky Bottom Bar Auto-Scroll Visibility (RAF smooth tracking with threshold & ref protection)
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    let ticking = false;
    let previousScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    const TOP_THRESHOLD = 60; // Near-top buffer (always show bar when near top)
    const SCROLL_THRESHOLD = 12; // Minimum scroll delta threshold to ignore micro-jitters

    const updateVisibility = (visible) => {
      if (isVisibleRef.current !== visible) {
        isVisibleRef.current = visible;
        setIsStickyBarVisible(visible);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
          const maxScrollY = Math.max(0, (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight);

          // 1. TOP OF SCREEN: Always visible when near top
          if (currentScrollY <= TOP_THRESHOLD) {
            updateVisibility(true);
            previousScrollY = currentScrollY;
          }
          // 2. Ignore bottom rubber-band overscroll on iOS
          else if (currentScrollY > maxScrollY) {
            // Retain state during overscroll bounce
          }
          // 3. SCROLL DOWN: deliberate downward movement beyond threshold -> hide
          else if (currentScrollY > previousScrollY + SCROLL_THRESHOLD) {
            updateVisibility(false);
            previousScrollY = currentScrollY;
          }
          // 4. SCROLL UP: deliberate upward movement beyond threshold -> reveal
          else if (currentScrollY < previousScrollY - SCROLL_THRESHOLD) {
            updateVisibility(true);
            previousScrollY = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${slug}`);
        const productData = data && data.success ? data.data : data;
        
        if (productData && (productData._id || productData.id || productData.name)) {
          setProduct(productData);
          const primaryImg = getProductImage(productData);
          setActiveMedia(primaryImg || null);
          
          if (productData.category) {
            const related = await api.get(`/products?category=${productData.category}&limit=4`);
            const relatedList = related && related.success ? related.data.products : related?.products;
            setRelatedProducts(relatedList ? relatedList.filter(p => (p._id || p.id) !== (productData._id || productData.id)) : []);
          }
        } else {
          // Fallback to static catalog products
          const fallback = fallbackProducts.find(p => p.slug === slug || String(p.id) === slug);
          if (fallback) {
            setProduct(fallback);
            setActiveMedia(getProductImage(fallback) || null);
            const related = fallbackProducts.filter(p => p.category === fallback.category && p.slug !== fallback.slug).slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error('API fetch failed, checking fallback catalog:', err);
        const fallback = fallbackProducts.find(p => p.slug === slug || String(p.id) === slug);
        if (fallback) {
          setProduct(fallback);
          setActiveMedia(getProductImage(fallback) || null);
          const related = fallbackProducts.filter(p => p.category === fallback.category && p.slug !== fallback.slug).slice(0, 4);
          setRelatedProducts(related);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2200);
  };

  const getWhatsAppLink = () => {
    if (!product) return '';
    const phone = '919106251842';
    const text = encodeURIComponent(
      `Hello Goldsmiths Jewels, I am interested in "${product.name}" (SKU: ${product.sku || 'GSM-2024'}). Please connect me with a consultant for details.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const openInquiryModal = (type) => {
    setInquiryType(type);
    setIsInquiryOpen(true);
  };

  if (loading) return (
    <div 
      style={{
        minHeight: '80vh',
        backgroundImage: `url(${shopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(30px)',
        borderRadius: '28px',
        padding: '40px 30px',
        border: '1.5px solid rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        maxWidth: '360px',
        width: '100%'
      }}>
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>⏳</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-charcoal)', margin: 0 }}>
          Loading Masterpiece...
        </h2>
      </div>
    </div>
  );

  if (!product) return (
    <div 
      style={{
        minHeight: '80vh',
        backgroundImage: `url(${shopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(30px)',
        borderRadius: '28px',
        padding: '40px 30px',
        border: '1.5px solid rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        maxWidth: '360px',
        width: '100%'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>💎</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--color-charcoal)', marginBottom: '8px' }}>
          Masterpiece Not Found
        </h2>
        <p style={{ color: 'rgba(26,26,26,0.6)', marginBottom: '20px', fontSize: '13px' }}>
          The piece you are seeking may have been moved or reserved.
        </p>
        <Link to="/shop" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '9999px', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
          Explore Collection →
        </Link>
      </div>
    </div>
  );

  const wishlisted = product ? isInWishlist(product._id || product.id) : false;
  const productReviews = product?.reviews || [];

  const tabs = [
    { id: 'description', label: 'Description & Care' },
    { id: 'details', label: 'Details & Specifications' },
    { id: 'shipping', label: 'Insured Delivery & Returns' },
    { id: 'reviews', label: `Reviews (${productReviews.length})` },
  ];

  return (
    <div className="pdp-page-container">
      
      {/* Main Liquid Glass Showcase Grid */}
      <div className="container">
        <div className="pdp-open-grid">
          
          {/* LEFT: Ultra-Frosted Refractive Glass Showcase Gallery */}
          <div className="pdp-gallery-col">
            <div 
              onClick={() => setZoomActive(!zoomActive)}
              className="pdp-main-media-frame"
              style={{
                transform: zoomActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {/* Main Media Render */}
              {activeMedia === 'video' && product.video ? (
                getYouTubeEmbedId(product.video) ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${getYouTubeEmbedId(product.video)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeEmbedId(product.video)}&modestbranding=1&rel=0`}
                    title={product.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, border: 'none' }}
                  />
                ) : (
                  <video 
                    src={getMediaUrl(product.video)} 
                    controls 
                    autoPlay 
                    muted 
                    loop 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                  />
                )
              ) : activeMedia ? (
                <img 
                  src={getMediaUrl(activeMedia)} 
                  alt={product.name} 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                />
              ) : (
                <div style={{ fontSize: '80px', opacity: 0.3 }}>
                  {product.category === 'Rings' ? '💍' : product.category === 'Earrings' ? '✨' : product.category === 'Necklaces' ? '📿' : product.category === 'Bracelets' ? '⭐' : '💎'}
                </div>
              )}

              {product.badge && (
                <span className="pdp-media-badge">
                  {product.badge === 'sale' ? `${product.discount}% Off` : product.badge.toUpperCase()}
                </span>
              )}

              {/* Wishlist Button on Gallery */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`pdp-media-heart ${wishlisted ? 'active' : ''}`}
                aria-label="Add to Wishlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Carousel Pills */}
            <div className="pdp-thumbnails-strip">
              {(Array.isArray(product.images) ? product.images : (typeof product.images === 'string' && product.images.length > 1 ? [product.images] : (product.featuredImage || product.image ? [product.featuredImage || product.image] : []))).map((img, idx) => {
                const resolvedImgUrl = img?.url || img;
                const isActive = activeMedia === resolvedImgUrl;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setActiveMedia(resolvedImgUrl)}
                    className={`pdp-thumb-item ${isActive ? 'active' : ''}`}
                  >
                    <img 
                      src={getMediaUrl(resolvedImgUrl)} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                );
              })}
              {product.video && (
                <div 
                  onClick={() => setActiveMedia('video')}
                  className={`pdp-thumb-item pdp-thumb-video ${activeMedia === 'video' ? 'active' : ''}`}
                >
                  ▶️
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Translucent Liquid Glass Conversion Card */}
          <div className="pdp-details-card">
            {/* Header Category & Certification */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-gold-dark)', fontWeight: 700 }}>
                {product.category}
              </span>
              {product.certification && (
                <span style={{ fontSize: '10px', padding: '3px 10px', background: '#10B981', color: 'white', borderRadius: '12px', fontWeight: 600 }}>
                  ✓ {product.certification}
                </span>
              )}
            </div>

            <h1 className="pdp-product-title">
              {product.name}
            </h1>

            {/* Rating Bar & SKU */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--color-gold)', fontSize: '13px' }}>{'★'.repeat(Math.floor(product.rating || 5))}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-charcoal)' }}>{product.rating || 5.0}</span>
                <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>({product.reviewCount || 12} reviews)</span>
              </div>
              <span style={{ fontSize: '10px', color: 'rgba(26,26,26,0.4)', fontWeight: 600 }}>SKU: {product.sku || 'GSM-2024'}</span>
            </div>

            {/* Formatted Price Box */}
            <div className="pdp-price-box">
              <span className="pdp-main-price">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="pdp-orig-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 10px', borderRadius: '10px' }}>
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="pdp-description-text">
              {product.description}
            </p>

            {/* Liquid Glass Specs Grid */}
            <div className="pdp-specs-grid">
              {[
                { label: 'Metal', value: product.metal || '22K Gold' },
                { label: 'Purity', value: product.purity || '916 Hallmark' },
                { label: 'Weight', value: product.weight || '14.2g' },
                { label: 'Hallmark', value: product.hallmark || 'BIS Certified' },
                ...(product.gemstoneDetails ? [
                  { label: 'Gemstone', value: product.gemstoneDetails.type },
                  { label: 'Carat', value: product.gemstoneDetails.carat },
                ] : []),
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,26,26,0.45)', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-charcoal)', marginTop: '2px' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Unified Action Controls */}
            <div className="pdp-actions-container">
              {/* Stepper + Add to Bag */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className="pdp-stepper-pill">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="pdp-stepper-btn"
                  >
                    −
                  </button>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="pdp-stepper-btn"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="pdp-add-bag-btn"
                  style={{
                    background: addedToBag ? '#10B981' : 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)',
                    color: addedToBag ? '#FFF' : 'var(--color-gold)',
                  }}
                >
                  {addedToBag ? '✓ Added to Inquiry Bag' : '🛍️ Add to Inquiry Bag'}
                </button>
              </div>

              {/* Consultation & WhatsApp Primary Actions */}
              <div className="pdp-inquiry-btns-row">
                <button
                  onClick={() => openInquiryModal('Price Inquiry')}
                  className="pdp-primary-inquiry-btn"
                >
                  ✨ Request Bespoke Consultation
                </button>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdp-whatsapp-action-btn"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* Trust Badges Strip */}
            <div className="pdp-trust-strip">
              <div className="pdp-trust-item">
                <span>🛡️</span>
                <span>BIS 916 Certified</span>
              </div>
              <div className="pdp-trust-item">
                <span>📦</span>
                <span>Free Insured Shipping</span>
              </div>
              <div className="pdp-trust-item">
                <span>🔄</span>
                <span>15-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tabbed Specifications & Descriptions */}
        <div className="pdp-tabs-container">
          <div className="pdp-tabs-header">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pdp-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pdp-tab-content">
            {activeTab === 'description' && (
              <div style={{ maxWidth: '820px', lineHeight: 1.8, color: 'rgba(26,26,26,0.75)', fontSize: '14px' }}>
                <p>{product.description}</p>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)', marginTop: '20px', marginBottom: '8px', fontSize: '15px' }}>Atelier Care Guide</h4>
                <p>To preserve luster, avoid direct contact with perfumes, chlorinated water, or chemicals. Store in your complimentary Goldsmiths velvet case when not in wear.</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                {[
                  ['SKU', product.sku || 'GSM-2024'], ['Metal Specification', product.metal || '22K Gold'], ['Gold Purity', product.purity || '916 Hallmark'], ['Net Weight', product.weight || '14.2g'],
                  ['Size / Fitting', product.size || 'Standard Fit'], ['Surface Finish', product.finish || 'High Polish Gold'], ['Hallmark Certification', product.hallmark || 'BIS Certified'], ['Guarantee', product.certification || '100% Certified']
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.75)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.9)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>{label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-charcoal)' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ maxWidth: '820px', lineHeight: 1.8, color: 'rgba(26,26,26,0.75)', fontSize: '14px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)', marginBottom: '8px', fontSize: '15px' }}>Complimentary Insured Delivery</h4>
                <p>Estimated transit time: {product.deliveryEstimate || '3-5 Business Days'}. All parcels are shipped via armored transit with full insurance coverage until hand-delivered with OTP signature verification.</p>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)', marginTop: '20px', marginBottom: '8px', fontSize: '15px' }}>15-Day Inspection & Exchange Guarantee</h4>
                <p>{product.returnPolicy || '15-Day Full Return & Exchange'}. Items must be unworn and returned with original security seals and BIS certificates intact.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ maxWidth: '820px' }}>
                {productReviews.length > 0 ? productReviews.map(r => (
                  <div key={r.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.75)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--color-gold)', fontSize: '12px' }}>{'★'.repeat(r.rating)}</span>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-charcoal)' }}>{r.name}</span>
                      {r.verified && <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>✓ Verified Purchase</span>}
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.75)', margin: 0, lineHeight: 1.5 }}>{r.text}</p>
                  </div>
                )) : <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px' }}>No client reviews recorded yet. Be the first to share your experience with this masterpiece.</p>}
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Masterpieces Grid */}
        {relatedProducts.length > 0 && (
          <div className="pdp-related-section">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', marginBottom: '4px' }}>
                Complementary Pairings
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--color-charcoal)', margin: 0 }}>
                Related Masterpieces
              </h2>
            </div>
            <div className="pdp-related-grid">
              {relatedProducts.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>

      {/* 5. Sticky Bottom Inquiry Bar on Mobile */}
      <div className={`pdp-mobile-sticky-bar ${isStickyBarVisible ? 'visible' : 'hidden'}`}>
        <div className="pdp-mobile-sticky-price">
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--color-gray-500)', fontWeight: 600 }}>Direct Atelier</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--color-charcoal)' }}>{formatPrice(product.price)}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
          <button 
            onClick={() => openInquiryModal('Price Inquiry')}
            className="pdp-mobile-sticky-btn"
          >
            Send Inquiry
          </button>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="pdp-mobile-sticky-wa"
            aria-label="WhatsApp"
          >
            💬
          </a>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        product={product} 
        initialInquiryType={inquiryType}
      />

      <style>{`
        .pdp-page-container {
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          padding-top: 100px;
          padding-bottom: 120px;
          margin: 0;
          overflow-x: hidden;
        }

        .pdp-page-container::before {
          content: '';
          position: fixed;
          inset: -30px;
          background-image: url(${shopBg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: blur(28px) saturate(140%) brightness(0.96);
          -webkit-filter: blur(28px) saturate(140%) brightness(0.96);
          transform: scale(1.12);
          z-index: 0;
          pointer-events: none;
        }

        .pdp-page-container > * {
          position: relative;
          z-index: 1;
        }

        .pdp-open-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .pdp-main-media-frame {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(30px) saturate(190%);
          -webkit-backdrop-filter: blur(30px) saturate(190%);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 25px 60px rgba(0,0,0,0.06), 0 8px 24px rgba(201,168,76,0.12);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
        }

        .pdp-media-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 2;
          padding: 6px 16px;
          borderRadius: 20px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(188, 156, 108, 0.35);
          color: var(--color-gold-dark);
          fontSize: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .pdp-media-heart {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 2;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-charcoal);
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }

        .pdp-media-heart.active {
          background: var(--color-ruby);
          color: #FFF;
        }

        .pdp-thumbnails-strip {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .pdp-thumb-item {
          aspect-ratio: 1;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.75);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }

        .pdp-thumb-item.active {
          border: 2px solid var(--color-gold);
          box-shadow: 0 6px 18px rgba(201,168,76,0.25);
        }

        .pdp-thumb-video {
          background: var(--color-charcoal);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: white;
        }

        .pdp-details-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(35px) saturate(200%);
          -webkit-backdrop-filter: blur(35px) saturate(200%);
          border-radius: 32px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 30px 80px rgba(0,0,0,0.08), 0 10px 30px rgba(201,168,76,0.12);
          padding: 36px 40px;
        }

        .pdp-product-title {
          font-family: var(--font-display);
          font-size: 30px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 10px;
          color: var(--color-charcoal);
        }

        .pdp-price-box {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .pdp-main-price {
          font-family: var(--font-display);
          font-size: 34px;
          font-weight: 700;
          color: var(--color-gold-dark);
        }

        .pdp-orig-price {
          font-size: 18px;
          color: rgba(26,26,26,0.4);
          text-decoration: line-through;
        }

        .pdp-description-text {
          color: rgba(26,26,26,0.7);
          line-height: 1.6;
          margin-bottom: 24px;
          font-size: 14px;
          font-family: var(--font-body);
        }

        .pdp-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          margin-bottom: 24px;
        }

        .pdp-actions-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .pdp-stepper-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.8);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          height: 46px;
          box-sizing: border-box;
        }

        .pdp-stepper-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
        }

        .pdp-add-bag-btn {
          flex: 1;
          height: 46px;
          border-radius: 16px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pdp-inquiry-btns-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 12px;
        }

        .pdp-primary-inquiry-btn {
          padding: 14px 20px;
          border-radius: 16px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          background: linear-gradient(135deg, #F5E6B8 0%, #E0BB55 40%, #C9A84C 70%, #A38832 100%);
          color: #0F0D0A;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(201, 168, 76, 0.35);
        }

        .pdp-whatsapp-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 18px;
          border-radius: 16px;
          background: #25D366;
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
        }

        .pdp-trust-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding-top: 18px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        .pdp-trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(26,26,26,0.65);
        }

        .pdp-tabs-container {
          margin-top: 48px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(30px);
          border-radius: 28px;
          padding: 32px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
        }

        .pdp-tabs-header {
          display: flex;
          gap: 12px;
          border-bottom: 1.5px solid rgba(0,0,0,0.06);
          padding-bottom: 16px;
          margin-bottom: 24px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .pdp-tab-btn {
          padding: 10px 20px;
          border-radius: 9999px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          color: rgba(26,26,26,0.6);
          cursor: pointer;
          white-space: nowrap;
        }

        .pdp-tab-btn.active {
          background: var(--color-charcoal);
          color: #FFF;
        }

        .pdp-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .pdp-mobile-sticky-bar {
          display: none;
        }

        /* Mobile specific styling */
        @media (max-width: 768px) {
          .pdp-page-container {
            padding-top: 75px !important;
            padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px)) !important;
          }

          .pdp-open-grid {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }

          .pdp-main-media-frame {
            border-radius: 24px;
          }

          .pdp-details-card {
            border-radius: 24px;
            padding: 20px 18px;
          }

          .pdp-product-title {
            font-size: 22px;
          }

          .pdp-main-price {
            font-size: 26px;
          }

          .pdp-specs-grid {
            padding: 12px;
            gap: 8px;
            border-radius: 16px;
          }

          .pdp-inquiry-btns-row {
            grid-template-columns: 1fr;
          }

          .pdp-trust-strip {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .pdp-tabs-container {
            border-radius: 20px;
            padding: 20px 16px;
            margin-top: 24px;
          }

          .pdp-related-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }

          /* Liquid Glass Floating Product Action Bar on Mobile — positioned with perfect optical gap above Bottom Navigation */
          .pdp-mobile-sticky-bar {
            position: fixed;
            bottom: calc(76px + env(safe-area-inset-bottom, 0px));
            left: 12px;
            right: 12px;
            max-width: 440px;
            margin: 0 auto;
            z-index: 1040;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(35px) saturate(200%) brightness(1.06);
            -webkit-backdrop-filter: blur(35px) saturate(200%) brightness(1.06);
            border-radius: 9999px;
            border: 1.5px solid rgba(255, 255, 255, 0.95);
            box-shadow:
              0 14px 40px rgba(0, 0, 0, 0.14),
              0 4px 18px rgba(201, 168, 76, 0.22),
              inset 0 1.5px 2px rgba(255, 255, 255, 0.95);
            padding: 6px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            will-change: transform, opacity;
            transform: translate3d(0, 0, 0);
            opacity: 1;
            pointer-events: auto;
            transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .pdp-mobile-sticky-bar.hidden {
            transform: translate3d(0, calc(100% + 95px), 0) !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          .pdp-mobile-sticky-price {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 80px;
          }

          .pdp-mobile-sticky-btn {
            padding: 9px 18px;
            border-radius: 9999px;
            background: linear-gradient(135deg, #F5E6B8 0%, #E0BB55 40%, #C9A84C 70%, #A38832 100%);
            border: 1px solid rgba(255, 255, 255, 0.9);
            color: #0F0D0A;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(201, 168, 76, 0.38);
            white-space: nowrap;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .pdp-mobile-sticky-btn:active {
            transform: scale(0.96);
          }

          .pdp-mobile-sticky-wa {
            width: 36px;
            height: 36px;
            min-width: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 17px;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.38);
            transition: transform 0.2s ease;
          }

          .pdp-mobile-sticky-wa:active {
            transform: scale(0.92);
          }
        }
      `}</style>
    </div>
  );
}
