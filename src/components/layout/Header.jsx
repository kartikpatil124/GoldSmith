import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { products, categories } from '../../data/products';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); setIsSearchOpen(false); }, [location]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q) || (p.gemstone && p.gemstone.toLowerCase().includes(q)) ||
        p.occasion.toLowerCase().includes(q) || p.style.toLowerCase().includes(q)
      ).slice(0, 6);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
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

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <>
      {/* Top Bar */}
      <div style={{ background: 'var(--color-charcoal)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', padding: '8px 0', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <span>✨ Free Shipping on Orders Above ₹50,000</span>
          <span style={{ display: 'none' }} className="desktop-only">|</span>
          <span style={{ display: 'none' }} className="desktop-only">🔒 100% Certified & Hallmarked</span>
          <span style={{ display: 'none' }} className="desktop-only">|</span>
          <span style={{ display: 'none' }} className="desktop-only">📞 +91 98765 43210</span>
        </div>
      </div>

      {/* Main Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
        background: isScrolled ? 'rgba(255,255,255,0.97)' : 'var(--color-white)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all var(--transition-base)',
        borderBottom: isScrolled ? 'none' : '1px solid var(--color-gray-100)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }} className="mobile-menu-btn" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isMobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)', letterSpacing: '0.05em', lineHeight: 1 }}>GOLDSMITHS</span>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-xs)', color: 'var(--color-gold)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2px' }}>Jewels</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {navLinks.map((link) => (
              <div key={link.name} style={{ position: 'relative' }} className="nav-item-wrapper">
                <Link to={link.path} style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500,
                  color: location.pathname === link.path ? 'var(--color-gold)' : 'var(--color-charcoal)',
                  letterSpacing: '0.05em', textTransform: 'uppercase', padding: '8px 0',
                  borderBottom: location.pathname === link.path ? '2px solid var(--color-gold)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}>
                  {link.name}
                </Link>
                {link.submenu && (
                  <div className="nav-dropdown" style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: '16px',
                    boxShadow: 'var(--shadow-xl)', minWidth: '200px', opacity: 0, pointerEvents: 'none',
                    transition: 'all var(--transition-fast)', zIndex: 'var(--z-dropdown)'
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

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSearchOpen ? 'var(--color-gray-50)' : 'transparent', transition: 'all var(--transition-fast)' }} aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
              {isSearchOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2xl)', width: '380px', maxWidth: '90vw', zIndex: 'var(--z-dropdown)', animation: 'fadeInUp 0.2s ease-out' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-gray-100)' }}>
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search jewellery, gemstones, collections..." autoFocus style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', outline: 'none' }} />
                  </div>
                  {searchResults.length > 0 && (
                    <div style={{ padding: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                      {searchResults.map(p => (
                        <button key={p.id} onClick={() => { navigate(`/product/${p.slug}`); setIsSearchOpen(false); setSearchQuery(''); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', width: '100%', textAlign: 'left', borderRadius: 'var(--radius-md)', transition: 'background var(--transition-fast)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>💎</div>
                          <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-charcoal)' }}>{p.name}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)' }}>{formatPrice(p.price)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>No results found. Try "rings", "diamond", or "gold"</div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              {wishlistCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-gold)', color: 'var(--color-white)', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>}
            </Link>

            {/* Account */}
            <div style={{ position: 'relative' }} className="nav-item-wrapper hide-mobile">
              {user ? (
                <Link to={(user.role === 'Super Admin' || user.role === 'Admin') ? '/admin' : '/account'} style={{
                  width: '40px',
                  height: '40px',
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
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-fast)'
                }} aria-label="Account">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName || user.email} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span>{(user.fullName || user.email || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </Link>
              ) : (
                <Link to="/account" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-charcoal)' }} aria-label="Account">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </Link>
              )}

              {user && (
                <div className="nav-dropdown" style={{
                  position: 'absolute', top: '100%', right: '0%', transform: 'translateX(20%)',
                  background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: '16px',
                  boxShadow: 'var(--shadow-xl)', minWidth: '240px', opacity: 0, pointerEvents: 'none',
                  transition: 'all var(--transition-fast)', zIndex: 'var(--z-dropdown)',
                  border: '1px solid var(--color-gray-100)'
                }}>
                  <div style={{ padding: '0 8px 12px 8px', borderBottom: '1px solid var(--color-gray-100)', marginBottom: '8px' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Welcome</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName || user.email}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-gray-500)', textTransform: 'capitalize' }}>{user.role} Privilege User</div>
                  </div>

                  {(user.role === 'Super Admin' || user.role === 'Admin') ? (
                    <Link to="/admin" style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: 'var(--text-sm)',
                      color: 'var(--color-charcoal)', borderRadius: 'var(--radius-md)', fontWeight: 500,
                      transition: 'all var(--transition-fast)'
                    }}>
                      🛠️ Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link to="/account" style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: 'var(--text-sm)',
                        color: 'var(--color-charcoal)', borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-fast)'
                      }}>
                        👤 My Account
                      </Link>
                      <Link to="/account?tab=orders" style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: 'var(--text-sm)',
                        color: 'var(--color-charcoal)', borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-fast)'
                      }}>
                        📦 My Orders
                      </Link>
                      <Link to="/wishlist" style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: 'var(--text-sm)',
                        color: 'var(--color-charcoal)', borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-fast)'
                      }}>
                        ❤️ My Wishlist
                      </Link>
                      <Link to="/account?tab=settings" style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: 'var(--text-sm)',
                        color: 'var(--color-charcoal)', borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-fast)'
                      }}>
                        ⚙️ Settings
                      </Link>
                    </>
                  )}
                  
                  <button onClick={logout} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: 'var(--text-sm)',
                    color: 'var(--color-ruby)', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent',
                    width: '100%', textAlign: 'left', cursor: 'pointer', marginTop: '8px', borderTop: '1px solid var(--color-gray-100)',
                    paddingTop: '12px', fontWeight: 500
                  }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-ruby)', color: 'var(--color-white)', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" style={{ position: 'fixed', inset: 0, zIndex: 999, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setIsMobileMenuOpen(false)} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '300px', maxWidth: '85vw', background: 'var(--color-white)', boxShadow: 'var(--shadow-2xl)', overflowY: 'auto', animation: 'slideInRight 0.3s ease-out', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>GOLDSMITHS</span>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} style={{ display: 'block', padding: '14px 0', fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-charcoal)', borderBottom: '1px solid var(--color-gray-100)', letterSpacing: '0.05em' }}>{link.name}</Link>
            ))}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-gray-200)' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--color-gray-100)', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-cream)',
                      border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)'
                    }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span>{(user.fullName || user.email || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '10px', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Privilege Account</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '180px' }}>{user.fullName || user.email}</div>
                    </div>
                  </div>
                  <Link to={(user.role === 'Super Admin' || user.role === 'Admin') ? '/admin' : '/account'} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    {(user.role === 'Super Admin' || user.role === 'Admin') ? 'Admin Panel' : 'My Account'}
                  </Link>
                </>
              ) : (
                <Link to="/account" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  My Account / Login
                </Link>
              )}
              <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                Blog & Guides
              </Link>
              <Link to="/faq" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                FAQs
              </Link>
              {user && (
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', fontSize: 'var(--text-sm)', color: 'var(--color-ruby)', border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid var(--color-gray-100)', marginTop: '8px', paddingTop: '16px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .desktop-only { display: inline !important; }
        }
        .nav-item-wrapper:hover .nav-dropdown {
          opacity: 1 !important;
          pointer-events: all !important;
        }
        .nav-item-wrapper .nav-dropdown a:hover {
          background: var(--color-gray-50);
          color: var(--color-gold);
        }
      `}</style>
    </>
  );
}
