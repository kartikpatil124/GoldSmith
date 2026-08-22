import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import shopBg from '../../images/shopbg.png';
import api, { getMediaUrl, getProductImage } from '../utils/api';
import { useSite } from '../context/SiteContext';
import { formatPrice } from '../data/products';

export default function Collections() {
  const { collections: siteCollections, refreshSiteData } = useSite();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    refreshSiteData();
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

  // Featured Collection Suites
  const curatedSuites = [
    {
      id: 'royal-heritage',
      name: 'The Royal Heritage Suite',
      subtitle: 'Antique 22K Gold · Handcrafted Kundan & Polki',
      description: 'Inspired by royal dynasties, each piece embodies centuries of master craftsmanship, intricate filigree, and unyielding grandeur.',
      categoryFilter: 'Bridal Sets',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'solitaire-elegance',
      name: 'Solitaire & Diamond Atelier',
      subtitle: 'GIA & IGI Certified Diamonds · Platinum Settings',
      description: 'Flawless cuts and luminescent solitaires engineered to catch light from every angle with unprecedented brilliance.',
      categoryFilter: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'bridal-grandeur',
      name: 'Bridal Grandeur Trousseau',
      subtitle: 'Complete Heritage Wedding Suites',
      description: 'Bespoke bridal heirlooms designed to define your unforgettable day and be treasured for generations.',
      categoryFilter: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist 18K',
      subtitle: 'Sleek 18K Gold & Rose Gold Daily Luxury',
      description: 'Understated elegance crafted for everyday sophistication. Clean geometric lines meet subtle diamond accents.',
      categoryFilter: 'Earrings',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop'
    }
  ];

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
      <div className="glass-floating-collections-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          COLLECTIONS
        </span>
      </div>

      {/* Big Liquid Glass Box in Display Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          
          {/* Collection Showcase List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '120px' }}>
            
            {curatedSuites.map((suite) => {
              // Find preview items for this suite
              const suiteProducts = products
                .filter(p => p.category?.toLowerCase() === suite.categoryFilter.toLowerCase() || p.metal?.toLowerCase().includes('gold'))
                .slice(0, 3);

              return (
                <div 
                  key={suite.id}
                  id={suite.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(30px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                    borderRadius: '32px',
                    border: '1.5px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)',
                    padding: '32px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}
                  className="collection-suite-card"
                >
                  
                  {/* Suite Header Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ maxWidth: '640px' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-gold-dark)',
                        display: 'block',
                        marginBottom: '6px'
                      }}>
                        {suite.subtitle}
                      </span>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '26px',
                        fontWeight: 700,
                        color: '#1A1A1A',
                        lineHeight: 1.15,
                        marginBottom: '8px'
                      }}>
                        {suite.name}
                      </h2>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'rgba(26, 26, 26, 0.7)',
                        lineHeight: 1.5,
                        margin: 0
                      }}>
                        {suite.description}
                      </p>
                    </div>

                    {/* Explore Button */}
                    <Link 
                      to={`/shop?category=${suite.categoryFilter.toLowerCase().replace(/\s+/g, '-')}`}
                      className="glass-load-more-btn"
                      style={{ textDecoration: 'none', display: 'inline-flex', padding: '12px 28px', whiteSpace: 'nowrap' }}
                    >
                      <span>EXPLORE COLLECTION</span>
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Content Showcase Grid: Left Editorial Banner + Right 3 Highlight Cards */}
                  <div className="suite-grid-showcase" style={{ display: 'grid', gridTemplateColumns: '1.1fr 2fr', gap: '24px', alignItems: 'stretch' }}>
                    
                    {/* Left: Editorial Hero Banner */}
                    <div style={{
                      position: 'relative',
                      minHeight: '220px',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                      border: '2px solid rgba(255, 255, 255, 0.9)'
                    }}>
                      <img 
                        src={suite.image} 
                        alt={suite.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '20px',
                        color: '#fff',
                        fontFamily: 'var(--font-display)',
                        fontSize: '16px',
                        fontWeight: 700
                      }}>
                        {suite.name}
                      </div>
                    </div>

                    {/* Right: 3 Highlight Product Cards (Square 1:1 Aspect Ratios & Uniform Heights) */}
                    <div className="suite-mini-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {suiteProducts.map((prod) => {
                        const rawImg = getProductImage(prod);
                        const pImg = rawImg ? getMediaUrl(rawImg) : null;
                        return (
                          <Link 
                            key={prod._id || prod.id}
                            to={`/product/${prod.slug}`}
                            style={{
                              textDecoration: 'none',
                              color: 'inherit',
                              background: 'rgba(255, 255, 255, 0.65)',
                              backdropFilter: 'blur(16px)',
                              borderRadius: '20px',
                              border: '1.5px solid rgba(255, 255, 255, 0.85)',
                              padding: '12px',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              height: '100%',
                              boxSizing: 'border-box'
                            }}
                          >
                            {/* Square Aspect Ratio Image Container */}
                            <div style={{
                              width: '100%',
                              aspectRatio: '1 / 1',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              marginBottom: '10px',
                              background: 'rgba(245,242,236,0.6)',
                              position: 'relative'
                            }}>
                              {pImg ? (
                                <img src={pImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '28px' }}>💎</div>
                              )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                              <div style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1A1A1A',
                                lineHeight: 1.3,
                                height: '32px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginBottom: '6px'
                              }}>
                                {prod.name}
                              </div>

                              <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: 'var(--color-gold-dark)'
                              }}>
                                {formatPrice(prod.price)}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>

      {/* Bottom-Right Floating Glass Navigation Pill for Collections */}
      <div className="glass-floating-controls-pill" onMouseMove={handleMouseMove}>
        {curatedSuites.map((suite) => (
          <a 
            key={suite.id}
            href={`#${suite.id}`}
            className="glass-control-btn"
            style={{ fontSize: '10px', textDecoration: 'none' }}
          >
            {suite.name.split(' ')[0]}
          </a>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .collection-suite-card {
            padding: 18px 14px !important;
            border-radius: 20px !important;
          }

          .suite-grid-showcase {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .suite-grid-showcase > div:nth-child(2) {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
