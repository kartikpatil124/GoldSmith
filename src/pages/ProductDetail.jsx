import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/shop/ProductCard';
import api, { getMediaUrl, getProductImage } from '../utils/api';

const getYouTubeEmbedId = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${slug}`);
        const productData = data.success ? data.data : data;
        setProduct(productData);
        
        // Extract and set initial active media
        if (productData) {
          const primaryImg = getProductImage(productData);
          setActiveMedia(primaryImg || null);
        }
        
        // Fetch related products
        if (productData && productData.category) {
          const related = await api.get(`/products?category=${productData.category}&limit=4`);
          const relatedList = related.success ? related.data.products : related.products;
          setRelatedProducts(relatedList ? relatedList.filter(p => p._id !== productData._id) : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: '12px' }}>Loading...</h2>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>💎</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Product Not Found</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>The piece you're looking for may have been moved or sold.</p>
      <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );

  const wishlisted = product ? isInWishlist(product._id || product.id) : false;
  const productReviews = product?.reviews || [];

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details & Specs' },
    { id: 'shipping', label: 'Shipping & Returns' },
    { id: 'reviews', label: `Reviews (${productReviews.length})` },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--color-gray-50)', padding: '12px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <div className="container" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', display: 'flex', gap: '8px' }}>
          <Link to="/" style={{ color: 'var(--color-gray-500)' }}>Home</Link> /
          <Link to="/shop" style={{ color: 'var(--color-gray-500)' }}>Shop</Link> /
          <Link to={`/shop?category=${product.category.toLowerCase()}`} style={{ color: 'var(--color-gray-500)' }}>{product.category}</Link> /
          <span style={{ color: 'var(--color-charcoal)' }}>{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            {/* Image Gallery */}
            <div>
              <div onClick={() => setZoomActive(!zoomActive)} style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'linear-gradient(135deg, var(--color-beige), var(--color-cream), var(--color-pearl))', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', cursor: 'zoom-in', transition: 'transform var(--transition-slow)', transform: zoomActive ? 'scale(1.15)' : 'scale(1)', zIndex: 10 }}>
                {/* Fallback emoji */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  {product.category === 'Rings' ? '💍' : product.category === 'Earrings' ? '✨' : product.category === 'Necklaces' ? '📿' : product.category === 'Bracelets' ? '⭐' : '💎'}
                </div>

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
                ) : null}

                {product.badge && (
                  <span className={`badge badge-${product.badge === 'new' ? 'new' : product.badge === 'sale' ? 'sale' : 'trending'}`} style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                    {product.badge === 'sale' ? `${product.discount}% Off` : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
                {(Array.isArray(product.images) ? product.images : (typeof product.images === 'string' && product.images.length > 1 ? [product.images] : (product.featuredImage || product.image ? [product.featuredImage || product.image] : []))).map((img, idx) => {
                  const resolvedImgUrl = img?.url || img;
                  const isActive = activeMedia === resolvedImgUrl;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setActiveMedia(resolvedImgUrl)}
                      style={{ 
                        aspectRatio: '1', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--color-gray-50)', 
                        border: isActive ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-100)', 
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
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
                    style={{ 
                      aspectRatio: '1', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--color-gray-900)', 
                      border: activeMedia === 'video' ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-100)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: 'white'
                    }}
                  >
                    ▶️
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold)', fontWeight: 600 }}>{product.category}</span>
                {product.certification && <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', background: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-sm)' }}>{product.certification}</span>}
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, lineHeight: 1.2, marginBottom: '8px' }}>{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-gold)', fontSize: 'var(--text-sm)' }}>{'★'.repeat(Math.floor(product.rating))}</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{product.rating}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>({product.reviewCount} reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--color-gray-100)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>{formatPrice(product.price)}</span>
                {product.originalPrice && <span style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-400)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>}
                {product.discount > 0 && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-success)', background: 'rgba(45,106,79,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>Save {product.discount}%</span>}
              </div>

              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '24px', fontSize: 'var(--text-base)' }}>{product.description}</p>

              {/* Key Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', padding: '20px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)' }}>
                {[
                  { label: 'Metal', value: product.metal },
                  { label: 'Purity', value: product.purity },
                  { label: 'Weight', value: product.weight },
                  { label: 'Hallmark', value: product.hallmark },
                  ...(product.gemstoneDetails ? [
                    { label: 'Gemstone', value: product.gemstoneDetails.type },
                    { label: 'Carat', value: product.gemstoneDetails.carat },
                  ] : []),
                ].map(detail => (
                  <div key={detail.label}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{detail.label}</span>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginTop: '2px' }}>{detail.value}</p>
                  </div>
                ))}
              </div>

              {/* Size */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Size</span>
                  <Link to="/blog" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)' }}>Size Guide</Link>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>{product.size}</p>
              </div>

              {/* Quantity & Actions */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>−</button>
                  <span style={{ width: '44px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>+</button>
                </div>
                <button onClick={() => addToCart(product, quantity)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>Add to Bag</button>
                <button onClick={() => toggleWishlist(product)} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: wishlisted ? 'var(--color-ruby)' : 'transparent', color: wishlisted ? 'white' : 'var(--color-gray-600)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </button>
              </div>

              <button className="btn btn-dark btn-lg" style={{ width: '100%', marginBottom: '24px' }}>Buy Now</button>

              {/* Trust Indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { icon: '🚚', text: product.deliveryEstimate || '5-7 Business Days' },
                  { icon: '↩️', text: product.returnPolicy || '15-Day Returns' },
                  { icon: '🔒', text: 'Secure Payment' },
                  { icon: '📜', text: product.hallmark || 'Certified' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>
                    <span>{item.icon}</span>{item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: '80px' }}>
            <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--color-gray-100)', marginBottom: '32px' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 24px', fontSize: 'var(--text-sm)', fontWeight: 500, color: activeTab === tab.id ? 'var(--color-gold)' : 'var(--color-gray-500)', borderBottom: activeTab === tab.id ? '2px solid var(--color-gold)' : '2px solid transparent', marginBottom: '-2px', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all var(--transition-fast)' }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'description' && <div style={{ maxWidth: '800px', lineHeight: 2, color: 'var(--color-gray-600)' }}><p>{product.description}</p><h4 style={{ fontFamily: 'var(--font-display)', marginTop: '24px', marginBottom: '8px', color: 'var(--color-charcoal)' }}>Care Instructions</h4><p>{product.careInstructions || 'Keep away from moisture and harsh chemicals. Store in the provided box.'}</p></div>}

            {activeTab === 'details' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '800px' }}>
                {[
                  ['SKU', product.sku], ['Metal', product.metal], ['Purity', product.purity], ['Weight', product.weight],
                  ['Size', product.size], ['Finish', product.finish], ['Hallmark', product.hallmark], ['Certification', product.certification],
                  ...(product.gemstoneDetails ? [['Gemstone Type', product.gemstoneDetails.type], ['Cut', product.gemstoneDetails.cut], ['Clarity', product.gemstoneDetails.clarity], ['Color', product.gemstoneDetails.color], ['Carat', product.gemstoneDetails.carat]] : [])
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{label}</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ maxWidth: '800px', lineHeight: 2, color: 'var(--color-gray-600)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)', marginBottom: '8px' }}>Delivery</h4>
                <p>Estimated delivery: {product.deliveryEstimate || '5-7 Business Days'}. All orders are fully insured during transit with tamper-proof packaging.</p>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)', marginTop: '24px', marginBottom: '8px' }}>Returns</h4>
                <p>{product.returnPolicy || '15-Day Returns'}. Items must be unused and in original packaging. Custom-made pieces are non-returnable.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ maxWidth: '800px' }}>
                {productReviews.length > 0 ? productReviews.map(r => (
                  <div key={r.id} style={{ padding: '20px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--color-gold)', fontSize: 'var(--text-sm)' }}>{'★'.repeat(r.rating)}</span>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.name}</span>
                      {r.verified && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>✓ Verified</span>}
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{r.text}</p>
                  </div>
                )) : <p style={{ color: 'var(--color-gray-500)' }}>No reviews yet. Be the first to review this product!</p>}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '80px' }}>
              <div className="section-header"><p className="subtitle">You May Also Like</p><h2>Related Products</h2><div className="section-divider" /></div>
              <div className="product-grid">{relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}</div>
            </div>
          )}
        </div>
      </section>
      <style>{`@media (max-width: 768px) { .container > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
