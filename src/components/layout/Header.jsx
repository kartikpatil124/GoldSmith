import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { products, categories } from '../../data/products';
import api, { getMediaUrl, getProductImage } from '../../utils/api';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allBackendProducts, setAllBackendProducts] = useState([]);
  const [isCollectionsExpanded, setIsCollectionsExpanded] = useState(false);
  
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const avatarUrl = user ? (user.avatar?.url || (typeof user.avatar === 'string' ? user.avatar : '') || user.googleAvatarUrl || '') : '';
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    const fetchSearchProducts = async () => {
      try {
        const data = await api.get('/products?limit=200');
        if (data && data.success && data.data && data.data.products) {
          setAllBackendProducts(data.data.products);
        } else if (data && data.products) {
          setAllBackendProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSearchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => { 
    setIsMobileMenuOpen(false); 
    setIsSearchOpen(false); 
  }, [location]);

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Auto focus input on search open
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        if (window.innerWidth <= 768) {
          mobileInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery('');
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isMobileMenuOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const pool = allBackendProducts.length > 0 ? allBackendProducts : products;
      const results = pool.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.metal?.toLowerCase().includes(q) ||
        (p.gemstone && p.gemstone.toLowerCase().includes(q)) ||
        (p.occasion && p.occasion.toLowerCase().includes(q)) ||
        (p.style && p.style.toLowerCase().includes(q))
      ).slice(0, 8);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allBackendProducts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth > 768 && searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections', submenu: categories.slice(0, 8).map(c => ({ name: c.name, path: `/shop?category=${c.slug}` })) },
    { name: 'Bridal', path: '/bridal' },
    { name: 'Custom', path: '/custom-order' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const formatPriceLocal = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <>
      {/* ============================================================
          1. DESKTOP HEADER (Screens > 768px) — 100% Preserved
          ============================================================ */}
      <div className="desktop-header-only">
        {/* Top-Left Floating Glass Capsule: Logo */}
        <div className="glass-floating-logo-pill" onMouseMove={handleMouseMove} style={{
          position: 'fixed',
          top: '20px',
          left: '24px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 20px',
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '40px',
          border: '1px solid rgba(188, 156, 108, 0.35)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(188, 156, 108, 0.15)',
          transition: 'all var(--transition-base)'
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-charcoal)', letterSpacing: '0.05em', lineHeight: 1 }}>GOLDSMITHS</span>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', color: 'var(--color-gold)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2px' }}>Jewels</span>
          </Link>
        </div>

        {/* Top-Right Floating Glass Capsule: Actions */}
        <div 
          className="glass-floating-actions-pill" 
          onMouseMove={handleMouseMove} 
          ref={searchRef}
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            height: '52px',
            background: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '40px',
            border: '1.5px solid rgba(188, 156, 108, 0.35)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(188, 156, 108, 0.15)',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* Default Action Icons Group */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isSearchOpen ? 0 : 1,
            pointerEvents: isSearchOpen ? 'none' : 'auto',
            transition: 'opacity 250ms ease'
          }}>
            {/* Search Button */}
            <button 
              type="button"
              onClick={() => setIsSearchOpen(true)} 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--color-charcoal)'
              }} 
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: 'var(--color-charcoal)', flexShrink: 0 }} aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              {wishlistCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-gold)', color: 'var(--color-white)', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>}
            </Link>

            {/* Profile / Account */}
            <div style={{ position: 'relative', flexShrink: 0 }} className="nav-item-wrapper">
              {user ? (
                <Link to={(user.role === 'Super Admin' || user.role === 'Admin') ? '/admin' : '/account'} style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-cream)',
                  border: '2px solid var(--color-gold)',
                  color: 'var(--color-charcoal)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }} aria-label="Account">
                  {avatarUrl ? (
                    <img src={getMediaUrl(avatarUrl)} alt={user.fullName || user.email} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)',
                      color: 'var(--color-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)'
                    }}>
                      {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              ) : (
                <Link to="/account" style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-charcoal)' }} aria-label="Account">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </Link>
              )}
            </div>

            {/* Cart / Inquiry Drawer Icon */}
            <button onClick={() => setIsCartOpen(true)} style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-charcoal)', flexShrink: 0 }} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-gold)', color: 'var(--color-white)', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </button>
          </div>

          {/* Desktop Search Input Overlay */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                setIsSearchOpen(false);
              }
            }}
            style={{
              position: 'absolute',
              inset: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '40px',
              background: 'rgba(255, 255, 255, 0.95)',
              transformOrigin: 'left center',
              transform: isSearchOpen ? 'scaleX(1)' : 'scaleX(0)',
              opacity: isSearchOpen ? 1 : 0,
              pointerEvents: isSearchOpen ? 'auto' : 'none',
              transition: 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease',
              zIndex: 5
            }}
          >
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-charcoal)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </div>
            <input 
              ref={inputRef}
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search rings, 22K gold..." 
              style={{
                width: '100%',
                height: '100%',
                paddingLeft: '44px',
                paddingRight: '36px',
                border: 'none',
                borderRadius: '40px',
                background: 'transparent',
                fontSize: '13px',
                color: '#1A1A1A',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-body)'
              }} 
            />
            <button
              type="button"
              className="glass-search-close-btn"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              style={{
                position: 'absolute',
                right: '8px',
                top: 0,
                bottom: 0,
                margin: 'auto 0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.06)',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'rgba(26,26,26,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ✕
            </button>
          </form>
        </div>

        {/* Desktop Results Dropdown */}
        {isSearchOpen && (searchResults.length > 0 || searchQuery.trim().length > 1) && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(36px) saturate(190%)',
            WebkitBackdropFilter: 'blur(36px) saturate(190%)',
            borderRadius: '24px',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18), 0 8px 30px rgba(201, 168, 76, 0.15)',
            width: '360px',
            maxWidth: 'calc(100vw - 48px)',
            zIndex: 2000,
            padding: '12px',
            boxSizing: 'border-box'
          }}>
            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '340px', overflowY: 'auto' }}>
                {searchResults.map(p => {
                  const rawImg = getProductImage(p);
                  const pImg = rawImg ? getMediaUrl(rawImg) : null;
                  return (
                    <button 
                      key={p._id || p.id} 
                      onClick={() => { 
                        navigate(`/product/${p.slug}`); 
                        setIsSearchOpen(false); 
                        setSearchQuery(''); 
                      }} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        width: '100%',
                        textAlign: 'left',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.65)',
                        border: '1px solid rgba(255, 255, 255, 0.85)',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: 'rgba(245,242,236,0.8)' }}>
                        {pImg ? <img src={pImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '18px' }}>💎</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>
                          {p.category} {p.metal ? `· ${p.metal}` : ''}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                        {formatPriceLocal(p.price)}
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'var(--color-charcoal)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  View All Matching Designs →
                </button>
              </div>
            )}

            {searchQuery.length > 1 && searchResults.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(26,26,26,0.6)', fontSize: '13px' }}>
                No matching jewelry designs found.
              </div>
            )}
          </div>
        )}

        {/* Floating Glassmorphism Bottom Navbar (Desktop Dock) */}
        <nav className="glass-floating-bottom-nav desktop-nav" onMouseMove={handleMouseMove} style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 12px',
          borderRadius: '50px',
        }}>
          {navLinks.map((link) => (
            <div key={link.name} style={{ position: 'relative' }} className="nav-item-wrapper">
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}
              >
                {link.name}
              </Link>
              {link.submenu && (
                <div className="nav-dropdown" style={{
                  position: 'absolute', bottom: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)', borderRadius: 'var(--radius-lg)', padding: '16px',
                  boxShadow: 'var(--shadow-xl)', minWidth: '200px', opacity: 0, pointerEvents: 'none',
                  transition: 'all var(--transition-fast)', zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(188, 156, 108, 0.2)'
                }}>
                  {link.submenu.map((sub) => (
                    <Link key={sub.name} to={sub.path} style={{
                      display: 'block', padding: '8px 16px', fontSize: 'var(--text-sm)',
                      color: 'var(--color-gray-700)', borderRadius: 'var(--radius-sm)',
                      transition: 'all var(--transition-fast)'
                    }}>{sub.name}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ============================================================
          2. THREE-SECTION MOBILE LUXURY HEADER (Screens <= 768px)
          1. Toggle  2. Logo in Center  3. Search, Wishlist, and Cart
          ============================================================ */}
      <header className="mobile-app-header-container">
        {/* SECTION 1: Toggle Button Capsule */}
        <div className="mobile-header-pill mobile-header-toggle-pill">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="mobile-header-touch-btn"
            aria-label="Open Navigation Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="16" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* SECTION 2: Logo In Center Capsule */}
        <Link to="/" className="mobile-header-pill mobile-header-logo-pill" aria-label="Goldsmiths Jewels Home">
          <span className="mobile-brand-title">GOLDSMITHS</span>
          <span className="mobile-brand-sub">JEWELS</span>
        </Link>

        {/* SECTION 3: Search, Wishlist, and Cart Button Capsule */}
        <div className="mobile-header-pill mobile-header-actions-pill">
          {/* Quick Search */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="mobile-header-touch-btn"
            aria-label="Search Jewellery"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Quick Wishlist */}
          <Link to="/wishlist" className="mobile-header-touch-btn" aria-label="View Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="mobile-header-badge">{wishlistCount}</span>
            )}
          </Link>

          {/* Shopping Cart Button */}
          <Link to="/cart" className="mobile-header-touch-btn" aria-label="View Shopping Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="mobile-header-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </header>

      {/* ============================================================
          3. FULL-SCREEN MOBILE SEARCH MODAL (App-like overlay)
          ============================================================ */}
      {isSearchOpen && (
        <div className="mobile-search-modal-wrapper">
          {/* Backdrop */}
          <div className="mobile-search-backdrop" onClick={() => setIsSearchOpen(false)} />

          {/* Modal Container */}
          <div className="mobile-search-sheet">
            {/* Header Search Input */}
            <div className="mobile-search-input-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-gold-dark)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rings, 22K gold, bridal..."
                className="mobile-search-field"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsSearchOpen(false);
                  }
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mobile-search-clear-btn"
                  aria-label="Clear Search"
                >
                  ✕
                </button>
              )}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="mobile-search-cancel-btn"
              >
                Done
              </button>
            </div>

            {/* Quick Filter Category Pills */}
            <div className="mobile-search-pills-row">
              {['All', 'Rings', 'Earrings', 'Necklaces', 'Bridal', 'Diamonds', '22K Gold'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => {
                    const targetCategory = pill === 'All' ? '' : pill;
                    navigate(targetCategory ? `/shop?category=${targetCategory.toLowerCase()}` : '/shop');
                    setIsSearchOpen(false);
                  }}
                  className="mobile-search-cat-pill"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Results Area */}
            <div className="mobile-search-results-area">
              {searchResults.length > 0 ? (
                <div className="mobile-search-results-list">
                  <div className="mobile-search-results-title">Matching Jewellery Designs ({searchResults.length})</div>
                  {searchResults.map((p) => {
                    const rawImg = getProductImage(p);
                    const pImg = rawImg ? getMediaUrl(rawImg) : null;
                    return (
                      <div 
                        key={p._id || p.id}
                        onClick={() => {
                          navigate(`/product/${p.slug}`);
                          setIsSearchOpen(false);
                        }}
                        className="mobile-search-result-item"
                      >
                        <div className="mobile-search-result-img">
                          {pImg ? <img src={pImg} alt={p.name} /> : <span>💎</span>}
                        </div>
                        <div className="mobile-search-result-info">
                          <div className="mobile-search-result-name">{p.name}</div>
                          <div className="mobile-search-result-meta">{p.category} {p.metal ? `· ${p.metal}` : ''}</div>
                        </div>
                        <div className="mobile-search-result-price">{formatPriceLocal(p.price)}</div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => {
                      if (searchQuery.trim()) {
                        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                        setIsSearchOpen(false);
                      }
                    }}
                    className="mobile-search-view-all-btn"
                  >
                    View All Results in Shop →
                  </button>
                </div>
              ) : searchQuery.length > 1 ? (
                <div className="mobile-search-empty">
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💍</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>No matching pieces found</div>
                  <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                    Try searching for "Solitaire", "22K Gold", "Emerald", or explore our Shop.
                  </p>
                </div>
              ) : (
                <div className="mobile-search-suggestions">
                  <div className="mobile-search-suggestions-title">Trending Searches</div>
                  <div className="mobile-search-suggestions-list">
                    {['22K Gold Bridal Sets', 'Solitaire Diamond Rings', 'Antique Kundan Necklaces', 'Custom Emerald Bangles'].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setSearchQuery(t);
                          navigate(`/shop?search=${encodeURIComponent(t)}`);
                          setIsSearchOpen(false);
                        }}
                        className="mobile-search-suggestion-item"
                      >
                        <span>🔍</span>
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          4. SLIDE-OUT LUXURY MOBILE APP DRAWER
          ============================================================ */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay">
          {/* Backdrop */}
          <div className="mobile-drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)} />

          {/* Drawer Container */}
          <div className="mobile-drawer-content">
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <span className="mobile-drawer-brand-title">GOLDSMITHS</span>
                <span className="mobile-drawer-brand-sub">JEWELS ATELIER</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-drawer-close-btn"
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            {/* User Profile Quick Banner (if logged in) */}
            {user ? (
              <div className="mobile-drawer-user-card">
                <div className="mobile-drawer-user-avatar">
                  {avatarUrl ? (
                    <img src={getMediaUrl(avatarUrl)} alt={user.fullName || user.email} />
                  ) : (
                    <span>{(user.fullName || user.email || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="mobile-drawer-user-details">
                  <div className="mobile-drawer-user-name">{user.fullName || 'Valued Patron'}</div>
                  <div className="mobile-drawer-user-role">{user.role || 'Member'}</div>
                </div>
                <Link 
                  to={(user.role === 'Super Admin' || user.role === 'Admin') ? '/admin' : '/account'}
                  className="mobile-drawer-user-link"
                >
                  Manage →
                </Link>
              </div>
            ) : (
              <div className="mobile-drawer-auth-card">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-charcoal)' }}>Patron Privilege</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Sign in to track orders & bespoke inquiries</div>
                </div>
                <Link to="/account" className="mobile-drawer-auth-btn">Sign In</Link>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="mobile-drawer-nav">
              <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <span>Home</span>
                <span>→</span>
              </Link>
              
              <Link to="/shop" className={`mobile-nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
                <span>Shop All Jewellery</span>
                <span className="mobile-nav-badge-pill">New 2026</span>
              </Link>

              {/* Expandable Collections Accordion */}
              <div>
                <button 
                  onClick={() => setIsCollectionsExpanded(!isCollectionsExpanded)}
                  className="mobile-nav-accordion-trigger"
                >
                  <span>Curated Collections</span>
                  <span style={{ transform: isCollectionsExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▼</span>
                </button>
                {isCollectionsExpanded && (
                  <div className="mobile-nav-sub-list">
                    {categories.slice(0, 8).map((cat) => (
                      <Link 
                        key={cat.slug} 
                        to={`/shop?category=${cat.slug}`}
                        className="mobile-nav-sub-link"
                      >
                        <span>{cat.name}</span>
                        <span style={{ fontSize: '10px', color: 'var(--color-gold-dark)' }}>Explore</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/bridal" className={`mobile-nav-link ${location.pathname === '/bridal' ? 'active' : ''}`}>
                <span>Royal Bridal Trousseau</span>
                <span style={{ color: 'var(--color-gold-dark)', fontSize: '12px' }}>👑</span>
              </Link>

              <Link to="/custom-order" className={`mobile-nav-link ${location.pathname === '/custom-order' ? 'active' : ''}`}>
                <span>Custom Jewellery Atelier</span>
                <span style={{ color: 'var(--color-gold-dark)', fontSize: '12px' }}>✨</span>
              </Link>

              <Link to="/wishlist" className={`mobile-nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}>
                <span>My Wishlist</span>
                {wishlistCount > 0 && <span className="mobile-nav-count-tag">{wishlistCount}</span>}
              </Link>

              <div style={{ height: '1px', background: 'rgba(188, 156, 108, 0.15)', margin: '14px 0' }} />

              <Link to="/about" className={`mobile-nav-link-secondary ${location.pathname === '/about' ? 'active' : ''}`}>
                About Goldsmiths Heritage
              </Link>
              <Link to="/contact" className={`mobile-nav-link-secondary ${location.pathname === '/contact' ? 'active' : ''}`}>
                Contact & Showrooms
              </Link>
              <Link to="/faq" className={`mobile-nav-link-secondary ${location.pathname === '/faq' ? 'active' : ''}`}>
                Patron FAQ & Authenticity
              </Link>
            </nav>

            {/* Footer Contact Actions */}
            <div className="mobile-drawer-footer">
              <a 
                href="https://wa.me/919106251842" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-drawer-whatsapp-btn"
              >
                <span>💬</span>
                <span>Chat on WhatsApp</span>
              </a>
              <div className="mobile-drawer-phone">
                📞 Concierge: +91 91062 51842
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          5. MOBILE HEADER & DRAWER STYLES
          ============================================================ */}
      <style>{`
        /* Desktop visibility defaults */
        .desktop-header-only { display: contents; }
        .mobile-app-header-container { display: none; }

        @media (max-width: 768px) {
          .desktop-header-only { display: none !important; }
          .desktop-nav { display: none !important; }

          /* Three Distinct Floating Glass Mobile Header Capsules */
          .mobile-app-header-container {
            position: fixed;
            top: 12px;
            left: 12px;
            right: 12px;
            z-index: 1000;
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            pointer-events: none;
            box-sizing: border-box;
          }

          .mobile-header-pill {
            pointer-events: auto;
            height: 44px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(28px) saturate(200%);
            -webkit-backdrop-filter: blur(28px) saturate(200%);
            border-radius: 9999px;
            border: 1.5px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(201, 168, 76, 0.15);
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          /* SECTION 1: Toggle Button Capsule */
          .mobile-header-toggle-pill {
            width: 44px;
            flex-shrink: 0;
          }

          /* SECTION 2: Logo Capsule in Center */
          .mobile-header-logo-pill {
            flex: 1;
            max-width: 170px;
            padding: 0 14px;
            flex-direction: column;
            text-decoration: none;
            user-select: none;
          }

          .mobile-brand-title {
            font-family: var(--font-display);
            font-size: 13px;
            font-weight: 800;
            color: #1A1A1A;
            letter-spacing: 0.08em;
            line-height: 1;
          }

          .mobile-brand-sub {
            font-family: var(--font-accent);
            font-size: 7.5px;
            font-weight: 700;
            color: var(--color-gold-dark);
            letter-spacing: 0.28em;
            margin-top: 2px;
          }

          /* SECTION 3: Search, Wishlist, and Cart Actions Capsule */
          .mobile-header-actions-pill {
            padding: 0 4px;
            gap: 2px;
            flex-shrink: 0;
          }

          .mobile-header-touch-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            color: #1A1A1A;
            position: relative;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            text-decoration: none;
          }

          .mobile-header-touch-btn:active {
            transform: scale(0.92);
          }

          .mobile-header-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            min-width: 15px;
            height: 15px;
            border-radius: 9999px;
            background: var(--color-gold);
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 3px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }

          /* Mobile Search Modal */
          .mobile-search-modal-wrapper {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.2s ease-out;
          }

          .mobile-search-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          .mobile-search-sheet {
            position: relative;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border-bottom: 1.5px solid rgba(201, 168, 76, 0.25);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            padding: 16px 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 85vh;
            max-height: 85dvh;
            border-radius: 0 0 24px 24px;
            overflow: hidden;
            animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .mobile-search-input-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(201, 168, 76, 0.3);
            border-radius: 9999px;
            padding: 4px 12px 4px 14px;
            height: 46px;
          }

          .mobile-search-field {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 16px; /* 16px prevents iOS Safari auto-zoom */
            color: #1A1A1A;
            outline: none;
            font-family: var(--font-body);
          }

          .mobile-search-clear-btn {
            background: rgba(0, 0, 0, 0.1);
            border: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: #333;
            cursor: pointer;
          }

          .mobile-search-cancel-btn {
            background: transparent;
            border: none;
            color: var(--color-gold-dark);
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            padding: 0 4px;
          }

          .mobile-search-pills-row {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 4px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .mobile-search-pills-row::-webkit-scrollbar {
            display: none;
          }

          .mobile-search-cat-pill {
            flex-shrink: 0;
            padding: 6px 14px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(188, 156, 108, 0.35);
            font-size: 12px;
            font-weight: 600;
            color: #1A1A1A;
            cursor: pointer;
          }

          .mobile-search-results-area {
            overflow-y: auto;
            max-height: calc(85dvh - 140px);
            padding-top: 6px;
          }

          .mobile-search-results-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mobile-search-results-title {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-gold-dark);
            margin-bottom: 4px;
          }

          .mobile-search-result-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 10px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(0, 0, 0, 0.04);
            cursor: pointer;
          }

          .mobile-search-result-img {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            overflow: hidden;
            flex-shrink: 0;
            background: #F4F0E8;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-search-result-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mobile-search-result-info {
            flex: 1;
            min-width: 0;
          }

          .mobile-search-result-name {
            font-size: 13px;
            font-weight: 600;
            color: #1A1A1A;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-search-result-meta {
            font-size: 11px;
            color: var(--color-gray-500);
          }

          .mobile-search-result-price {
            font-size: 13px;
            font-weight: 700;
            color: var(--color-gold-dark);
          }

          .mobile-search-view-all-btn {
            width: 100%;
            padding: 12px;
            border-radius: 14px;
            border: none;
            background: var(--color-charcoal);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            margin-top: 8px;
          }

          .mobile-search-suggestions-title {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-gray-500);
            margin-bottom: 8px;
          }

          .mobile-search-suggestions-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .mobile-search-suggestion-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.03);
            border: none;
            font-size: 13px;
            font-weight: 500;
            color: var(--color-charcoal);
            text-align: left;
            cursor: pointer;
          }

          /* Mobile Drawer Navigation */
          .mobile-drawer-overlay {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            animation: fadeIn 0.25s ease-out;
          }

          .mobile-drawer-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(14, 12, 10, 0.65);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          .mobile-drawer-content {
            position: relative;
            width: 320px;
            max-width: 85vw;
            height: 100%;
            height: 100dvh;
            background: #FAF8F5;
            box-shadow: 10px 0 50px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            animation: slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 20px 20px calc(24px + env(safe-area-inset-bottom, 0px));
            box-sizing: border-box;
            border-right: 1.5px solid rgba(201, 168, 76, 0.3);
          }

          .mobile-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(188, 156, 108, 0.2);
            margin-bottom: 16px;
          }

          .mobile-drawer-brand {
            display: flex;
            flex-direction: column;
          }

          .mobile-drawer-brand-title {
            font-family: var(--font-display);
            font-size: 18px;
            font-weight: 800;
            color: #1A1A1A;
            letter-spacing: 0.05em;
          }

          .mobile-drawer-brand-sub {
            font-family: var(--font-accent);
            font-size: 9px;
            font-weight: 600;
            color: var(--color-gold-dark);
            letter-spacing: 0.22em;
          }

          .mobile-drawer-close-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.1);
            background: rgba(0, 0, 0, 0.04);
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #1A1A1A;
          }

          .mobile-drawer-user-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 16px;
            background: #FFFFFF;
            border: 1px solid rgba(201, 168, 76, 0.25);
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          }

          .mobile-drawer-user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background: #1A1A1A;
            color: var(--color-gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 15px;
            border: 1.5px solid var(--color-gold);
          }

          .mobile-drawer-user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mobile-drawer-user-details {
            flex: 1;
            min-width: 0;
          }

          .mobile-drawer-user-name {
            font-size: 13px;
            font-weight: 700;
            color: #1A1A1A;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-drawer-user-role {
            font-size: 11px;
            color: var(--color-gold-dark);
            font-weight: 600;
          }

          .mobile-drawer-user-link {
            font-size: 12px;
            font-weight: 700;
            color: var(--color-gold-dark);
            text-decoration: none;
          }

          .mobile-drawer-auth-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border-radius: 16px;
            background: #FFFFFF;
            border: 1px solid rgba(201, 168, 76, 0.25);
            margin-bottom: 16px;
          }

          .mobile-drawer-auth-btn {
            padding: 8px 16px;
            border-radius: 9999px;
            background: var(--color-gold);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
          }

          .mobile-drawer-nav {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #1A1A1A;
            text-decoration: none;
            transition: background 0.15s ease;
          }

          .mobile-nav-link.active {
            background: rgba(201, 168, 76, 0.15);
            color: var(--color-gold-dark);
            font-weight: 700;
          }

          .mobile-nav-badge-pill {
            font-size: 10px;
            font-weight: 700;
            color: #fff;
            background: var(--color-gold-dark);
            padding: 2px 8px;
            border-radius: 9999px;
          }

          .mobile-nav-count-tag {
            font-size: 11px;
            font-weight: 700;
            color: #fff;
            background: var(--color-ruby);
            padding: 2px 8px;
            border-radius: 9999px;
          }

          .mobile-nav-accordion-trigger {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #1A1A1A;
            background: transparent;
            border: none;
            cursor: pointer;
            text-align: left;
          }

          .mobile-nav-sub-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 4px 0 8px 16px;
            margin-left: 8px;
            border-left: 2px solid rgba(201, 168, 76, 0.3);
          }

          .mobile-nav-sub-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            color: #444;
            text-decoration: none;
          }

          .mobile-nav-link-secondary {
            display: block;
            padding: 8px 14px;
            font-size: 12px;
            color: var(--color-gray-600);
            text-decoration: none;
            font-weight: 500;
          }

          .mobile-nav-link-secondary.active {
            color: var(--color-gold-dark);
            font-weight: 700;
          }

          .mobile-drawer-footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(188, 156, 108, 0.2);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .mobile-drawer-whatsapp-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            border-radius: 12px;
            background: #25D366;
            color: #FFFFFF;
            font-weight: 700;
            font-size: 13px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
          }

          .mobile-drawer-phone {
            font-size: 11px;
            color: var(--color-gray-500);
            text-align: center;
          }
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
