import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNavigation() {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const [isReady, setIsReady] = useState(false);

  const navRef = useRef(null);
  const itemRefs = useRef([]);

  // Do not show bottom navigation bar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    {
      name: 'Home',
      path: '/',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      name: 'Shop',
      path: '/shop',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 3 23 8 23 21 1 21 1 8 5 3" />
          <line x1="23" y1="8" x2="1" y2="8" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      badgeCount: wishlistCount,
      badgeColor: 'var(--color-gold)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    },
    {
      name: 'Inquiries',
      path: '#',
      onClick: (e) => {
        e.preventDefault();
        setIsCartOpen(true);
      },
      badgeCount: cartCount,
      badgeColor: 'var(--color-gold)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      name: 'Account',
      path: user ? ((user.role === 'Super Admin' || user.role === 'Admin') ? '/admin' : '/account') : '/account',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  const activeIndex = items.findIndex(item => !item.onClick && location.pathname === item.path);
  const targetIndex = hoveredIndex !== null ? hoveredIndex : (activeIndex !== -1 ? activeIndex : 0);

  const updateIndicator = () => {
    const currentEl = itemRefs.current[targetIndex];
    const containerEl = navRef.current;
    if (currentEl && containerEl) {
      const elRect = currentEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - containerRect.left,
        top: elRect.top - containerRect.top,
        width: elRect.width,
        height: elRect.height,
        opacity: activeIndex !== -1 || hoveredIndex !== null ? 1 : 0
      });
      setIsReady(true);
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [targetIndex, location.pathname]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="bottom-nav-container" onMouseMove={handleMouseMove}>
      <div 
        className="bottom-nav"
        ref={navRef}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Continuous Traveling Spotlight Highlight */}
        <div 
          className="bottom-nav-traveling-spotlight"
          style={{
            transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.opacity,
            transition: isReady 
              ? 'transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1), width 420ms cubic-bezier(0.34, 1.35, 0.64, 1), height 420ms cubic-bezier(0.34, 1.35, 0.64, 1), opacity 250ms ease'
              : 'opacity 250ms ease'
          }}
        />

        {items.map((item, index) => {
          const isFocused = targetIndex === index;
          const isCurrentRoute = !item.onClick && (location.pathname === item.path);

          const buttonContent = (
            <div className={`bottom-nav-item ${isFocused ? 'focused' : ''} ${isCurrentRoute ? 'current' : ''}`}>
              <div className="bottom-nav-icon-wrapper">
                {item.icon}
                {item.badgeCount > 0 && (
                  <span className="bottom-nav-badge" style={{ backgroundColor: item.badgeColor }}>
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="bottom-nav-label">{item.name}</span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={item.onClick}
                onMouseEnter={() => setHoveredIndex(index)}
                className="bottom-nav-button-wrapper"
                aria-label={item.name}
              >
                {buttonContent}
              </button>
            );
          }

          return (
            <Link
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              to={item.path}
              onMouseEnter={() => setHoveredIndex(index)}
              className="bottom-nav-link-wrapper"
              aria-label={item.name}
            >
              {buttonContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
