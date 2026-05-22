import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import api, { getMediaUrl, getProductImage } from '../utils/api';
import { categories, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSite } from '../context/SiteContext';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');
  const collectionParam = searchParams.get('collection');
  
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { collections, refreshSiteData } = useSite();

  // Shop States
  const [filters, setFilters] = useState({
    metal: '',
    priceRange: '',
    gemstone: '',
    gender: '',
    occasion: '',
    style: '',
    customizable: ''
  });
  const [sortBy, setSortBy] = useState(sortParam || 'featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(4); // 4-col default, supports 3-col and 2-col
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick View States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSizeOption, setSelectedSizeOption] = useState('');

  // Fetch Products from API on Mount
  useEffect(() => {
    refreshSiteData();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/products?limit=200');
        if (data.success) {
          setProducts(data.data.products || []);
        } else {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync category parameter if it changes via routing links
  useEffect(() => {
    if (categoryParam) {
      clearFilters();
    }
  }, [categoryParam]);

  // Compute Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter (via URL)
    if (categoryParam) {
      result = result.filter(p => 
        p.category.toLowerCase().replace(/['\s]/g, '-') === categoryParam || 
        p.subcategory?.toLowerCase().replace(/['\s]/g, '-') === categoryParam
      );
    }

    // 1b. Collection Filter (via URL)
    if (collectionParam) {
      const selectedCol = collections.find(c => c.name.toLowerCase() === collectionParam.toLowerCase());
      if (selectedCol) {
        const colProductIds = (selectedCol.resolvedProducts || selectedCol.products || []).map(p => {
          const id = p._id || p.id || p.product?._id || p.product;
          return id?.toString();
        }).filter(Boolean);
        result = result.filter(p => colProductIds.includes(p._id?.toString()));
      }
    }

    // 2. Metal Filter
    if (filters.metal) {
      result = result.filter(p => p.metal.toLowerCase().includes(filters.metal.toLowerCase()));
    }

    // 3. Gemstone Filter
    if (filters.gemstone) {
      if (filters.gemstone === 'None') {
        result = result.filter(p => !p.gemstone || p.gemstone === 'None');
      } else {
        result = result.filter(p => p.gemstone && p.gemstone.toLowerCase().includes(filters.gemstone.toLowerCase()));
      }
    }

    // 4. Gender Filter
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender);
    }

    // 5. Occasion Filter
    if (filters.occasion) {
      result = result.filter(p => p.occasion === filters.occasion);
    }

    // 6. Style Vibe Filter
    if (filters.style) {
      result = result.filter(p => p.style.toLowerCase() === filters.style.toLowerCase());
    }

    // 7. Customizable status
    if (filters.customizable) {
      result = result.filter(p => p.customizable === (filters.customizable === 'Yes'));
    }

    // 8. Price Range Filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && (!max || p.price <= max));
    }

    // 9. Sort options
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break;
      case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break; // Featured / Default
    }

    return result;
  }, [products, categoryParam, collectionParam, collections, filters, sortBy]);

  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(([_, value]) => value !== '');
  }, [filters]);

  const activeFilterCount = activeFilters.length;

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearFilters = () => {
    setFilters({
      metal: '',
      priceRange: '',
      gemstone: '',
      gender: '',
      occasion: '',
      style: '',
      customizable: ''
    });
  };

  // Open Quick View Overlay
  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    // Set default size depending on category
    if (product.category === 'Rings') {
      setSelectedSizeOption('7');
    } else if (product.category === 'Necklaces' || product.category === 'Chains') {
      setSelectedSizeOption('18 inches');
    } else if (product.category === 'Bangles') {
      setSelectedSizeOption('2.4 inches');
    } else {
      setSelectedSizeOption('One Size');
    }
  };

  // Handle Quick Add in Drawer
  const handleQuickAdd = () => {
    if (!quickViewProduct) return;
    const customizedProduct = {
      ...quickViewProduct,
      name: `${quickViewProduct.name} (${selectedSizeOption})`
    };
    addToCart(customizedProduct, 1);
    setQuickViewProduct(null);
    setIsCartOpen(true); // Open the cart drawer instantly to showcase the product is added!
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Editorial Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2d2520 100%)',
        padding: '60px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '8px', fontSize: 'var(--text-base)' }}>Browse Atelier</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-white)', marginBottom: '12px' }}>
            {collectionParam 
              ? (collections.find(c => c.name.toLowerCase() === collectionParam.toLowerCase())?.name || collectionParam) 
              : (categoryParam ? categories.find(c => c.slug === categoryParam)?.name || 'The Curation' : 'Timeless Collections')}
          </h1>
          <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Link to="/" style={{ color: 'var(--color-gray-400)' }}>Home</Link> / <span style={{ color: 'var(--color-gold)' }}>Shop</span>
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '40px 0 80px' }}>
        
        {/* Luxury Action Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-gray-200)',
          paddingBottom: '20px'
        }}>
          {/* Left panel: filter button & result stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setIsFilterOpen(true)} className="btn btn-secondary btn-sm" style={{
              display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-charcoal)', borderRadius: 'var(--radius-sm)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              <span>FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', fontWeight: 500 }}>
              Showing {filteredProducts.length} certified designs
            </span>
          </div>

          {/* Right panel: grid toggles & sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Grid Density Layout Controllers */}
            <div className="grid-layout-toggles" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--color-gray-200)', paddingRight: '20px' }}>
              {[
                { count: 2, label: 'II' },
                { count: 3, label: 'III' },
                { count: 4, label: 'IV' }
              ].map(opt => (
                <button key={opt.count} onClick={() => setGridColumns(opt.count)} style={{
                  width: '32px', height: '32px', border: '1px solid var(--color-gray-300)',
                  borderRadius: 'var(--radius-sm)', background: gridColumns === opt.count ? 'var(--color-charcoal)' : 'var(--color-white)',
                  color: gridColumns === opt.count ? 'var(--color-white)' : 'var(--color-charcoal)',
                  fontSize: 'var(--text-xs)', fontWeight: 'bold', transition: 'all var(--transition-fast)'
                }}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort selectors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input form-select" style={{
                width: 'auto', padding: '6px 32px 6px 12px', fontSize: 'var(--text-sm)', backgroundPosition: 'right 8px center',
                borderColor: 'var(--color-gray-300)', borderRadius: 'var(--radius-sm)', background: 'var(--color-white)'
              }}>
                <option value="featured">Featured Curation</option>
                <option value="newest">New Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Best Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic dismissible active filter pills */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Active Filters:</span>
            {activeFilters.map(([key, value]) => {
              let label = value;
              if (key === 'priceRange') {
                if (value === '0-25000') label = 'Under ₹25K';
                else if (value === '25000-100000') label = '₹25K - ₹1L';
                else if (value === '100000-500000') label = '₹1L - ₹5L';
                else if (value === '500000-') label = 'Above ₹5L';
              }
              if (key === 'customizable') {
                label = 'Customizable Only';
              }
              return (
                <button key={key} onClick={() => removeFilter(key)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                  borderRadius: 'var(--radius-full)', background: 'var(--color-white)', color: 'var(--color-charcoal)',
                  border: '1px solid var(--color-gray-300)', fontSize: 'var(--text-xs)', fontWeight: 500,
                  transition: 'all var(--transition-fast)'
                }}>
                  {label}
                  <span style={{ color: 'var(--color-gray-400)', fontSize: '10px' }}>✕</span>
                </button>
              );
            })}
            <button onClick={clearFilters} style={{
              fontSize: 'var(--text-xs)', color: 'var(--color-gold-dark)', fontWeight: 600,
              textDecoration: 'underline', border: 'none', background: 'transparent'
            }}>
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '120px 0' }}>
              <div style={{ fontSize: '48px', animation: 'fadeIn 1s infinite alternate', marginBottom: '16px' }}>⏳</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>Analyzing goldsmiths Inventory...</h3>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '8px' }}>Retrieving GIA, IGI, and hallmarked certifications.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)`, gap: '24px' }}>
              {filteredProducts.map(p => (
                <ProductCard key={p._id || p.id} product={p} onQuickView={handleOpenQuickView} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '120px 0', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>No Designs Match Your Selection</h3>
              <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px', fontSize: 'var(--text-sm)', maxWidth: '400px', margin: '8px auto 24px' }}>
                Try adjusting or removing your luxury filters to browse standard stock designs.
              </p>
              <button onClick={clearFilters} className="btn btn-primary">Reset Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* FILTER DRAWER SLIDE-OUT PANEL */}
      {isFilterOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', display: 'flex', animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Backdrop */}
          <div onClick={() => setIsFilterOpen(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(8px)'
          }} />

          {/* Drawer Body */}
          <div style={{
            position: 'relative', width: '350px', maxWidth: '85vw', height: '100%',
            backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-2xl)', display: 'flex',
            flexDirection: 'column', animation: 'slideInLeft 0.3s ease-out'
          }} className="filter-drawer-body">
            
            {/* Header */}
            <div style={{
              padding: '24px 28px', borderBottom: '1px solid var(--color-gray-100)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Filter Collection</h3>
              <button onClick={() => setIsFilterOpen(false)} style={{ fontSize: '20px', color: 'var(--color-gray-500)' }} aria-label="Close filters">✕</button>
            </div>

            {/* Scrollable Filters List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              {[
                {
                  label: 'Metal Vibe',
                  key: 'metal',
                  options: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Sterling Silver']
                },
                {
                  label: 'Certified Gemstone',
                  key: 'gemstone',
                  options: ['Diamond', 'Emerald', 'Ruby', 'Blue Sapphire', 'Pearl', 'None']
                },
                {
                  label: 'Price Range',
                  key: 'priceRange',
                  options: [
                    { label: 'Under ₹25K', value: '0-25000' },
                    { label: '₹25K - ₹1L', value: '25000-100000' },
                    { label: '₹1L - ₹5L', value: '100000-500000' },
                    { label: 'Above ₹5L', value: '500000-' }
                  ]
                },
                {
                  label: 'Curation Style',
                  key: 'style',
                  options: ['Classic', 'Modern', 'Traditional', 'Heritage', 'Romantic', 'Minimal', 'Playful', 'Bohemian']
                },
                {
                  label: 'Occasion Suite',
                  key: 'occasion',
                  options: ['Bridal', 'Wedding', 'Engagement', 'Anniversary', 'Daily Wear', 'Party', 'Festive', 'Gifting']
                },
                {
                  label: 'Customizable Designs',
                  key: 'customizable',
                  options: ['Yes', 'No']
                },
                {
                  label: 'Gender Fit',
                  key: 'gender',
                  options: ['Women', 'Men', 'Unisex', 'Kids']
                }
              ].map(filter => (
                <div key={filter.key} style={{ marginBottom: '28px' }}>
                  <h4 style={{
                    fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.12em', color: 'var(--color-charcoal)', marginBottom: '12px'
                  }}>{filter.label}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {filter.options.map(opt => {
                      const value = typeof opt === 'string' ? opt : opt.value;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      const isActive = filters[filter.key] === value;
                      return (
                        <button key={value} onClick={() => setFilters(prev => ({ ...prev, [filter.key]: isActive ? '' : value }))} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)', border: '1px solid',
                          borderColor: isActive ? 'var(--color-gold)' : 'var(--color-gray-100)',
                          background: isActive ? 'var(--color-cream)' : 'transparent',
                          color: isActive ? 'var(--color-gold-dark)' : 'var(--color-gray-700)',
                          fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 400,
                          textAlign: 'left', transition: 'all var(--transition-fast)'
                        }}>
                          <span>{label}</span>
                          {isActive && <span style={{ color: 'var(--color-gold)', fontSize: '10px' }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky bottom submit/reset bar */}
            <div style={{
              padding: '20px 28px', borderTop: '1px solid var(--color-gray-100)', display: 'grid',
              gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--color-gray-50)'
            }}>
              <button onClick={clearFilters} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Reset</button>
              <button onClick={() => setIsFilterOpen(false)} className="btn btn-primary btn-sm" style={{ width: '100%' }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW DRAWER OVERLAY (SLIDE-OUT FROM RIGHT) */}
      {quickViewProduct && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', display: 'flex', justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Backdrop */}
          <div onClick={() => setQuickViewProduct(null)} style={{
            position: 'absolute', inset: 0, background: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(8px)'
          }} />

          {/* Drawer Body */}
          <div style={{
            position: 'relative', width: '550px', maxWidth: '90vw', height: '100%',
            backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-2xl)', display: 'flex',
            flexDirection: 'column', animation: 'slideInRight 0.3s ease-out'
          }} className="quick-view-drawer">
            
            {/* Header */}
            <div style={{
              padding: '20px 28px', borderBottom: '1px solid var(--color-gray-100)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Quick Design Atelier</h3>
              <button onClick={() => setQuickViewProduct(null)} style={{ fontSize: '20px', color: 'var(--color-gray-500)' }} aria-label="Close quick view">✕</button>
            </div>

            {/* Scrollable Details */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              
              {/* Product preview and metadata highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', marginBottom: '28px' }} className="quick-view-split">
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-beige) 0%, var(--color-pearl) 100%)',
                  borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '64px', height: '180px', position: 'relative', border: '1px solid var(--color-gray-200)',
                  overflow: 'hidden'
                }}>
                  {/* Fallback Emoji */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {quickViewProduct.category === 'Rings' ? '💍' : quickViewProduct.category === 'Earrings' ? '✨' : quickViewProduct.category === 'Necklaces' ? '📿' : quickViewProduct.category === 'Bracelets' ? '⭐' : quickViewProduct.category === 'Bangles' ? '🔅' : quickViewProduct.category === 'Chains' ? '🔗' : quickViewProduct.category === 'Pendants' ? '💎' : '💎'}
                  </div>
                  {/* Dynamic Image Overlay */}
                  {getProductImage(quickViewProduct) && (
                    <img 
                      src={getMediaUrl(getProductImage(quickViewProduct))} 
                      alt={quickViewProduct.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                    />
                  )}
                </div>
                
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {quickViewProduct.category} · {quickViewProduct.sku}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, margin: '6px 0 12px', lineHeight: 1.3 }}>
                    {quickViewProduct.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                      {formatPrice(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-gray-400)', fontSize: 'var(--text-sm)' }}>
                        {formatPrice(quickViewProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Jewelry parameters breakdown */}
              <div style={{
                background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)',
                padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Metal composition</span>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', marginTop: '2px' }}>{quickViewProduct.metal}</p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Estimated Weight</span>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', marginTop: '2px' }}>{quickViewProduct.weight}</p>
                </div>
                {quickViewProduct.gemstoneDetails && (
                  <>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Gemstone selection</span>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', marginTop: '2px' }}>{quickViewProduct.gemstoneDetails.type}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Gemstone details</span>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', marginTop: '2px' }}>
                        {quickViewProduct.gemstoneDetails.cut} Cut · {quickViewProduct.gemstoneDetails.carat}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Certification</span>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gold-dark)', marginTop: '2px' }}>
                    {quickViewProduct.certification !== 'N/A' ? quickViewProduct.certification : 'BIS Hallmarked'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Bespoke Customization</span>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-success)', marginTop: '2px' }}>
                    {quickViewProduct.customizable ? 'Available' : 'Standard Ready-to-Ship'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Design Overview</h4>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{quickViewProduct.description}</p>
              </div>

              {/* Sizing options selector panel */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{
                  fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '12px'
                }}>
                  {quickViewProduct.category === 'Rings' ? 'Select Ring Size' : quickViewProduct.category === 'Necklaces' || quickViewProduct.category === 'Chains' ? 'Select Necklace Length' : quickViewProduct.category === 'Bangles' ? 'Select Diameter' : 'Options'}
                </h4>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {quickViewProduct.category === 'Rings' ? (
                    ['6', '7', '8', '9', '10', '11'].map(size => (
                      <button key={size} onClick={() => setSelectedSizeOption(size)} style={{
                        width: '40px', height: '40px', borderRadius: '50%', border: '1px solid',
                        borderColor: selectedSizeOption === size ? 'var(--color-gold)' : 'var(--color-gray-300)',
                        background: selectedSizeOption === size ? 'var(--color-charcoal)' : 'transparent',
                        color: selectedSizeOption === size ? 'var(--color-white)' : 'var(--color-charcoal)',
                        fontSize: 'var(--text-sm)', fontWeight: 'bold', transition: 'all var(--transition-fast)'
                      }}>{size}</button>
                    ))
                  ) : quickViewProduct.category === 'Necklaces' || quickViewProduct.category === 'Chains' ? (
                    ['16 inches', '18 inches', '20 inches', '22 inches'].map(len => (
                      <button key={len} onClick={() => setSelectedSizeOption(len)} style={{
                        padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid',
                        borderColor: selectedSizeOption === len ? 'var(--color-gold)' : 'var(--color-gray-300)',
                        background: selectedSizeOption === len ? 'var(--color-charcoal)' : 'transparent',
                        color: selectedSizeOption === len ? 'var(--color-white)' : 'var(--color-charcoal)',
                        fontSize: 'var(--text-xs)', fontWeight: 'bold', transition: 'all var(--transition-fast)'
                      }}>{len}</button>
                    ))
                  ) : quickViewProduct.category === 'Bangles' ? (
                    ['2.2 inches', '2.4 inches', '2.6 inches', '2.8 inches'].map(dia => (
                      <button key={dia} onClick={() => setSelectedSizeOption(dia)} style={{
                        padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid',
                        borderColor: selectedSizeOption === dia ? 'var(--color-gold)' : 'var(--color-gray-300)',
                        background: selectedSizeOption === dia ? 'var(--color-charcoal)' : 'transparent',
                        color: selectedSizeOption === dia ? 'var(--color-white)' : 'var(--color-charcoal)',
                        fontSize: 'var(--text-xs)', fontWeight: 'bold', transition: 'all var(--transition-fast)'
                      }}>{dia}</button>
                    ))
                  ) : (
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', fontStyle: 'italic' }}>Standard Fit (Adjustable)</span>
                  )}
                </div>
              </div>

              {/* Delivery and returns badge */}
              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)' }}>
                <span>📦 Tamper-Proof Packaging</span>
                <span>🛡️ 1-Year Warranty Included</span>
                <span>🚚 Free Insured Shipping</span>
              </div>
            </div>

            {/* Bottom Add-to-bag / Wishlist action bar */}
            <div style={{
              padding: '24px 32px', borderTop: '1px solid var(--color-gray-100)', display: 'grid',
              gridTemplateColumns: 'auto 1fr', gap: '16px', background: 'var(--color-gray-50)', flexShrink: 0
            }}>
              {/* Wishlist toggle */}
              <button onClick={() => toggleWishlist(quickViewProduct)} style={{
                width: '52px', height: '52px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-white)',
                color: isInWishlist(quickViewProduct._id || quickViewProduct.id) ? 'var(--color-ruby)' : 'var(--color-charcoal)',
                transition: 'all var(--transition-fast)'
              }} aria-label="Toggle wishlist">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={isInWishlist(quickViewProduct._id || quickViewProduct.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {/* Add to cart */}
              <button onClick={handleQuickAdd} className="btn btn-primary" style={{
                height: '52px', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>ADD TO BAG · {formatPrice(quickViewProduct.price)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled slide animations */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 992px) {
          .grid-layout-toggles { display: none !important; }
        }
        @media (max-width: 768px) {
          .quick-view-split {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .quick-view-split div:first-child {
            height: 140px !important;
          }
          div[style*="grid-template-columns: repeat"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns: repeat"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
