import React, { useState, useEffect, useMemo } from 'react';
import shopBg from '../../images/shopbg.png';
import ProductCard from '../components/shop/ProductCard';
import OptionWheel from '../components/ui/OptionWheel';
import api from '../utils/api';
import { products as fallbackProducts, formatPrice } from '../data/products';

const CATEGORIES = [
  'All Masterpieces',
  'Rings',
  'Earrings',
  'Necklaces',
  'Bracelets',
  'Bangles',
  'Chains',
  'Pendants'
];

export default function Shop() {
  const [products, setProducts] = useState(fallbackProducts || []);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryWheelOpen, setIsCategoryWheelOpen] = useState(false);
  
  const [sortBy, setSortBy] = useState('featured');
  const [gridMode, setGridMode] = useState('2-col'); // '2-col', '3-col', '1-col'
  const [filters, setFilters] = useState({
    metal: '',
    category: '',
    priceRange: '',
    gemstone: ''
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/products?limit=200');
        if (data && data.success && data.data && data.data.products) {
          setProducts(data.data.products);
        } else if (data && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and Sort Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (filters.category) {
      result = result.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
    }

    // Metal Filter
    if (filters.metal) {
      result = result.filter(p => p.metal?.toLowerCase().includes(filters.metal.toLowerCase()));
    }

    // Gemstone Filter
    if (filters.gemstone) {
      result = result.filter(p => p.gemstone?.toLowerCase().includes(filters.gemstone.toLowerCase()));
    }

    // Price Range Filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && (!max || p.price <= max));
    }

    // Sort options
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break;
      case 'popular': result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break;
      default: break;
    }

    return result;
  }, [products, filters, sortBy]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const visibleProducts = processedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < processedProducts.length;

  const clearFilters = () => {
    setFilters({ metal: '', category: '', priceRange: '', gemstone: '' });
  };

  const currentCategoryIndex = useMemo(() => {
    if (!filters.category) return 0;
    const idx = CATEGORIES.findIndex(c => c.toLowerCase() === filters.category.toLowerCase());
    return idx >= 0 ? idx : 0;
  }, [filters.category]);

  return (
    <div 
      className="shop-page-wrapper"
      style={{ 
        backgroundImage: `url(${shopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Top Center Liquid Glass UI Capsule Header */}
      <div className="glass-floating-shop-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          SHOP
        </span>
      </div>

      {/* Big Liquid Glass Box in Display Center with Internal Product Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          
          {/* Active Category Header Pill Indicator */}
          {filters.category && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '12px 20px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(188, 156, 108, 0.3)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                FILTERED BY CATEGORY: <strong style={{ color: 'var(--color-gold-dark)' }}>{filters.category.toUpperCase()}</strong> ({processedProducts.length} DESIGNS)
              </span>
              <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))} style={{ background: 'none', border: 'none', color: 'var(--color-ruby)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                Clear Category ✕
              </button>
            </div>
          )}

          {/* 3 Grid Style Switcher & Filter Toolbar */}
          <div className="shop-grid-toolbar">
            {/* Left: 3 Grid Layout Options (Matching reference) */}
            <div className="shop-grid-switcher">
              {/* 1. 2-Column Grid (4 squares 2x2) */}
              <button 
                onClick={() => setGridMode('2-col')} 
                className={`shop-grid-btn ${gridMode === '2-col' ? 'active' : ''}`}
                aria-label="2 Column Grid View"
                title="2 Columns Grid"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" fill={gridMode === '2-col' ? 'currentColor' : 'none'} />
                  <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" fill={gridMode === '2-col' ? 'currentColor' : 'none'} />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" fill={gridMode === '2-col' ? 'currentColor' : 'none'} />
                  <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" fill={gridMode === '2-col' ? 'currentColor' : 'none'} />
                </svg>
              </button>

              {/* 2. 3-Column Dense Grid (9 squares 3x3) */}
              <button 
                onClick={() => setGridMode('3-col')} 
                className={`shop-grid-btn ${gridMode === '3-col' ? 'active' : ''}`}
                aria-label="3 Column Dense Grid View"
                title="3 Columns Dense Grid"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="9.75" y="2.5" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="17" y="2.5" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="2.5" y="9.75" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="17" y="9.75" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="2.5" y="17" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="9.75" y="17" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                  <rect x="17" y="17" width="4.5" height="4.5" rx="1" fill={gridMode === '3-col' ? 'currentColor' : 'none'} />
                </svg>
              </button>

              {/* 3. 1-Column Showcase (2 stacked horizontal bars) */}
              <button 
                onClick={() => setGridMode('1-col')} 
                className={`shop-grid-btn ${gridMode === '1-col' ? 'active' : ''}`}
                aria-label="1 Column Large Showcase View"
                title="1 Column Showcase"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="6.5" rx="1.5" fill={gridMode === '1-col' ? 'currentColor' : 'none'} />
                  <rect x="3" y="13.5" width="18" height="6.5" rx="1.5" fill={gridMode === '1-col' ? 'currentColor' : 'none'} />
                </svg>
              </button>
            </div>

            {/* Right: Quick Category Wheel + Filter Trigger & Count */}
            <div className="shop-grid-actions">
              <button 
                onClick={() => setIsCategoryWheelOpen(true)}
                className="shop-quick-wheel-btn"
                aria-label="Open 3D Category Wheel"
                title="3D Category Wheel"
              >
                <span>🌐</span>
                <span className="shop-wheel-btn-text">{filters.category ? filters.category.toUpperCase() : 'WHEEL'}</span>
              </button>

              <button 
                onClick={() => setIsFilterOpen(true)}
                className="shop-quick-filter-btn"
                aria-label="Open Filters"
                title="Filter & Sort"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="14" y1="18" x2="20" y2="18" />
                  <circle cx="8" cy="6" r="2.5" fill="currentColor" />
                  <circle cx="14" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="8" cy="18" r="2.5" fill="currentColor" />
                </svg>
                {activeFilterCount > 0 && <span className="shop-filter-badge">{activeFilterCount}</span>}
              </button>

              <span className="shop-count-label">
                {processedProducts.length} Designs
              </span>
            </div>
          </div>

          {/* Scrollable Liquid Glass Product Grid */}
          <div 
            className={`shop-product-grid shop-grid-${gridMode}`}
            style={{
              display: 'grid',
              gridTemplateColumns: gridMode === '3-col' 
                ? 'repeat(3, minmax(0, 1fr))' 
                : gridMode === '1-col' 
                  ? '1fr' 
                  : 'repeat(2, minmax(0, 1fr))',
              gap: gridMode === '3-col' ? '6px' : gridMode === '1-col' ? '16px' : '10px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {visibleProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} gridMode={gridMode} />
            ))}
          </div>

          {/* Liquid Glass Load More Button */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '48px', marginBottom: '80px' }}>
              <button 
                onClick={() => setVisibleCount((prev) => prev + 20)}
                className="glass-load-more-btn"
              >
                <span>LOAD MORE DESIGNS ({processedProducts.length - visibleCount} REMAINING)</span>
                <span style={{ fontSize: '14px', lineHeight: 1 }}>↓</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM-LEFT FLOATING LIQUID GLASS CATEGORY WHEEL TRIGGER BUTTON */}
      <button 
        onClick={() => setIsCategoryWheelOpen(true)}
        className="glass-floating-category-trigger"
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '28px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          borderRadius: '9999px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 14px rgba(201, 168, 76, 0.18)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          color: 'var(--color-charcoal)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-label="Open Category Wheel"
      >
        <span style={{ fontSize: '16px' }}>🌐</span>
        <span>{filters.category ? `CATEGORY: ${filters.category.toUpperCase()}` : 'CATEGORY WHEEL'}</span>
      </button>

      {/* CURVED POP-OUT OPTION WHEEL OVERLAY */}
      {isCategoryWheelOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
          
          {/* Blurred Ambient Backdrop Overlay */}
          <div 
            onClick={() => setIsCategoryWheelOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              animation: 'fadeIn 0.3s ease'
            }}
          />

          {/* Transparent Floating Left Wheel Container */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 'min(460px, 90vw)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10001,
            animation: 'slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none'
          }}>
            {/* Header Controls (Close Button & Title) */}
            <div style={{
              padding: '95px 36px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'auto'
            }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}>
                  CURVED CATEGORY WHEEL
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '2px 0 0', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  Select Category
                </h3>
              </div>
              <button 
                onClick={() => setIsCategoryWheelOpen(false)} 
                style={{
                  border: '1.5px solid rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                ✕
              </button>
            </div>

            {/* OptionWheel Interactive Wheel Area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', pointerEvents: 'auto' }}>
              <OptionWheel
                items={CATEGORIES}
                defaultSelected={currentCategoryIndex}
                textColor="rgba(255, 255, 255, 0.45)"
                activeColor="#FFFFFF"
                side="left"
                fontSize={2.5}
                spacing={1.6}
                curve={1.25}
                tilt={8}
                blur={2}
                fade={0.25}
                smoothing={70}
                inset={60}
                draggable
                onChange={(index, item) => {
                  const selectedCat = item === 'All Masterpieces' ? '' : item;
                  React.startTransition(() => {
                    setFilters(prev => ({ ...prev, category: selectedCat }));
                  });
                }}
              />
            </div>

            {/* Footer Controls (Shifted right of WhatsApp bubble & stacked cleanly at bottom) */}
            <div style={{
              padding: '12px 36px 28px 105px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
              pointerEvents: 'auto'
            }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.04em' }}>
                ↕ Scroll or drag wheel to select
              </span>
              <button
                onClick={() => setIsCategoryWheelOpen(false)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)',
                  color: 'var(--color-gold)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
                }}
              >
                Confirm Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Right Floating Glass Capsule: Filter & Sort Controls */}
      <div className="glass-floating-controls-pill" onMouseMove={handleMouseMove}>
        
        {/* Filter Button */}
        <button 
          onClick={() => setIsFilterOpen(true)} 
          className="glass-control-btn"
          aria-label="Open Filters"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          <span>FILTER {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        </button>

        {/* Divider */}
        <div className="glass-control-divider" />

        {/* Sort Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)} 
            className="glass-control-btn"
            aria-label="Open Sort Menu"
          >
            <span>SORT</span>
            <span style={{ fontSize: '10px' }}>▼</span>
          </button>

          {/* Sort Dropdown Menu */}
          {isSortOpen && (
            <div style={{
              position: 'absolute',
              bottom: '48px',
              right: '0',
              width: '180px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(24px)',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 1001
            }}>
              {[
                { label: 'Featured', value: 'featured' },
                { label: 'Price: Low to High', value: 'price-low' },
                { label: 'Price: High to Low', value: 'price-high' },
                { label: 'New Arrivals', value: 'newest' },
                { label: 'Most Popular', value: 'popular' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: sortBy === opt.value ? 'rgba(188, 156, 108, 0.18)' : 'transparent',
                    color: sortBy === opt.value ? 'var(--color-gold-dark)' : '#1A1A1A',
                    fontSize: '11px',
                    fontWeight: sortBy === opt.value ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Slide-out Liquid Glass Filter Drawer */}
      {isFilterOpen && (
        <div className="glass-filter-drawer">
          <div className="glass-filter-drawer-backdrop" onClick={() => setIsFilterOpen(false)} />
          
          <div className="glass-filter-drawer-body">
            
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                Filter Collection
              </h3>
              <button onClick={() => setIsFilterOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#1A1A1A' }}>
                ✕
              </button>
            </div>

            {/* Filter Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              {[
                {
                  label: 'Metal Vibe',
                  key: 'metal',
                  options: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Sterling Silver']
                },
                {
                  label: 'Gemstone',
                  key: 'gemstone',
                  options: ['Diamond', 'Emerald', 'Ruby', 'Blue Sapphire', 'Pearl']
                },
                {
                  label: 'Price Range',
                  key: 'priceRange',
                  options: [
                    { label: 'Under ₹25,000', value: '0-25000' },
                    { label: '₹25,000 - ₹1,00,000', value: '25000-100000' },
                    { label: '₹1,00,000 - ₹5,00,000', value: '100000-500000' },
                    { label: 'Above ₹5,00,000', value: '500000-' }
                  ]
                }
              ].map((group) => (
                <div key={group.key} style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '10px' }}>
                    {group.label}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {group.options.map((opt) => {
                      const val = typeof opt === 'string' ? opt : opt.value;
                      const lbl = typeof opt === 'string' ? opt : opt.label;
                      const isActive = filters[group.key] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setFilters(prev => ({ ...prev, [group.key]: isActive ? '' : val }))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: isActive ? 'var(--color-gold)' : 'rgba(0,0,0,0.06)',
                            background: isActive ? 'rgba(201, 168, 76, 0.15)' : 'rgba(255,255,255,0.6)',
                            color: isActive ? 'var(--color-gold-dark)' : '#1A1A1A',
                            fontSize: '13px',
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>{lbl}</span>
                          {isActive && <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Footer */}
            <div style={{
              padding: '20px 28px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.95)'
            }}>
              <button 
                onClick={clearFilters}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  background: 'transparent',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'var(--color-charcoal)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        /* 3-Option Grid Toolbar */
        .shop-grid-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          margin-bottom: 18px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(201, 168, 76, 0.08);
        }

        .shop-grid-switcher {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .shop-grid-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: rgba(26, 26, 26, 0.45);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          -webkit-tap-highlight-color: transparent;
        }

        .shop-grid-btn:hover {
          color: var(--color-charcoal);
          background: rgba(0, 0, 0, 0.04);
        }

        .shop-grid-btn.active {
          background: rgba(201, 168, 76, 0.18);
          color: var(--color-charcoal);
          border: 1px solid rgba(201, 168, 76, 0.35);
          box-shadow: 0 2px 8px rgba(201, 168, 76, 0.2);
        }

        .shop-grid-btn:active {
          transform: scale(0.92);
        }

        .shop-grid-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .shop-count-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-gold-dark);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .shop-quick-wheel-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(188, 156, 108, 0.3);
          color: #1A1A1A;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .shop-quick-wheel-btn:active {
          transform: scale(0.94);
        }

        .shop-quick-filter-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(188, 156, 108, 0.3);
          color: #1A1A1A;
          cursor: pointer;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .shop-quick-filter-btn:active {
          transform: scale(0.92);
        }

        .shop-filter-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--color-gold);
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* 3 Dynamic Grid Layout Modes */
        .shop-product-grid {
          display: grid;
          transition: all 0.3s ease;
        }

        /* Option 1: 2-Column Grid */
        .shop-product-grid.shop-grid-2col {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        /* Option 2: 3-Column Dense Grid */
        .shop-product-grid.shop-grid-3col {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        /* Option 3: 1-Column Showcase */
        .shop-product-grid.shop-grid-1col {
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 680px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .shop-product-grid.shop-grid-2col {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }

          .shop-product-grid.shop-grid-3col {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          .shop-product-grid.shop-grid-1col {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            max-width: 100% !important;
          }

          .shop-grid-toolbar {
            padding: 6px 10px;
            margin-bottom: 12px;
          }

          .shop-grid-btn {
            width: 32px;
            height: 32px;
          }

          .shop-quick-filter-btn {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}
