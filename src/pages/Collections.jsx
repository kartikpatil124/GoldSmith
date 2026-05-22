import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { useSite } from '../context/SiteContext';
import { getMediaUrl } from '../utils/api';

export default function Collections() {
  const { collections, loading, refreshSiteData } = useSite();

  useEffect(() => {
    window.scrollTo(0, 0);
    refreshSiteData();
  }, []);

  const getGradColor = (color, idx) => {
    if (!color || color === '#C9A84C') {
      const defaults = [
        'linear-gradient(145deg, #1f1412 0%, #2f1d19 100%)', // Dark Gold
        'linear-gradient(145deg, #1B3A5C 0%, #0a1128 100%)', // Sapphire
        'linear-gradient(145deg, #2d262b 0%, #1e151a 100%)'  // Rose Gold
      ];
      return defaults[idx % defaults.length];
    }
    // Convert hex color to custom linear gradient towards black for luxurious look
    return `linear-gradient(145deg, ${color} 0%, #0c0a08 100%)`;
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Editorial Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2d2520 100%)',
        padding: '100px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '60%',
          border: '1px solid rgba(201, 168, 76, 0.08)', borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-5%', width: '35%', height: '55%',
          border: '1px solid rgba(201, 168, 76, 0.08)', borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-gold)',
            fontSize: 'var(--text-lg)',
            fontStyle: 'italic',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>Editorial Curation</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'calc(var(--text-4xl) + 8px)',
            fontWeight: 700,
            color: 'var(--color-white)',
            letterSpacing: '0.04em',
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            The goldsmiths Collections
          </h1>
          <p style={{
            color: 'var(--color-gray-300)',
            fontSize: 'var(--text-base)',
            maxWidth: '650px',
            margin: '0 auto 32px',
            lineHeight: 1.8,
            fontWeight: 300
          }}>
            Explore our curated worlds of master craftsmanship. From the majestic grandeur of antique gold to the timeless brilliance of perfect solitaires, discover pieces crafted to tell your unique story.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {collections.map(col => (
              <a key={col._id} href={`#${col.slug}`} className="btn btn-outline-gold btn-sm" style={{ textTransform: 'capitalize' }}>
                {col.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Rendered Collections */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--color-gold)', fontSize: 'var(--text-lg)' }}>Loading fine collections...</div>
      ) : collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--color-gray-500)', fontSize: 'var(--text-lg)' }}>No collections are currently visible. Check back soon.</div>
      ) : (
        collections.map((col, idx) => {
          const isEven = idx % 2 === 0;
          const displayProducts = col.resolvedProducts || [];
          
          return (
            <section
              key={col._id}
              id={col.slug}
              className="section"
              style={{
                backgroundColor: isEven ? 'transparent' : 'var(--color-white)',
                borderBottom: '1px solid var(--color-gray-200)',
                scrollMarginTop: '80px'
              }}
            >
              <div className="container">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '1fr 2fr' : '2fr 1fr',
                  gap: '48px',
                  alignItems: 'center'
                }} className={`collection-grid-layout ${!isEven ? 'reverse-layout' : ''}`}>
                  
                  {/* Story Card (Left/Right placement based on alternate indexing) */}
                  {isEven ? (
                    <div style={{
                      background: getGradColor(col.themeColor, idx),
                      color: 'var(--color-white)',
                      padding: '48px 36px',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute', top: '16px', right: '16px', fontSize: '24px', opacity: 0.15, color: 'var(--color-gold)'
                      }}>{col.icon || '👑'}</div>
                      <span style={{
                        color: 'var(--color-gold)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'block',
                        marginBottom: '12px'
                      }}>{col.shortDescription || 'EXQUISITE QUALITY'}</span>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-3xl)',
                        fontWeight: 700,
                        marginBottom: '20px',
                        color: 'var(--color-white)'
                      }}>{col.name}</h2>
                      <p style={{
                        fontFamily: 'var(--font-accent)',
                        color: 'var(--color-gold-light)',
                        fontStyle: 'italic',
                        fontSize: 'var(--text-lg)',
                        marginBottom: '20px',
                        lineHeight: 1.4
                      }}>
                        "{col.description}"
                      </p>
                      <Link to={`/shop?collection=${encodeURIComponent(col.name)}`} className="btn btn-primary" style={{ width: '100%' }}>
                        Explore Collection Suite
                      </Link>
                    </div>
                  ) : null}

                  {/* Products Grid */}
                  <div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-charcoal)'
                      }}>Featured Masterpieces</h3>
                      <span style={{ fontSize: 'var(--text-xs)', color: col.themeColor || 'var(--color-gold)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        AUTHENTIC HALLMARKED ASSETS
                      </span>
                    </div>

                    {displayProducts.length === 0 ? (
                      <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-sm)', padding: '20px' }}>Items are currently being curated for this collection.</p>
                    ) : (
                      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {displayProducts.slice(0, 3).map(p => (
                          <ProductCard key={p._id || p.id} product={p} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Story Card (Reverse placement) */}
                  {!isEven ? (
                    <div style={{
                      background: getGradColor(col.themeColor, idx),
                      color: 'var(--color-white)',
                      padding: '48px 36px',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute', top: '16px', right: '16px', fontSize: '24px', opacity: 0.15, color: 'var(--color-white)'
                      }}>{col.icon || '💎'}</div>
                      <span style={{
                        color: 'var(--color-gold-light)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'block',
                        marginBottom: '12px'
                      }}>{col.shortDescription || 'ELITE BRANDS'}</span>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-3xl)',
                        fontWeight: 700,
                        marginBottom: '20px',
                        color: 'var(--color-white)'
                      }}>{col.name}</h2>
                      <p style={{
                        fontFamily: 'var(--font-accent)',
                        color: 'var(--color-gold-shine)',
                        fontStyle: 'italic',
                        fontSize: 'var(--text-lg)',
                        marginBottom: '20px',
                        lineHeight: 1.4
                      }}>
                        "{col.description}"
                      </p>
                      <Link to={`/shop?collection=${encodeURIComponent(col.name)}`} className="btn btn-primary" style={{ width: '100%' }}>
                        Explore Collection Suite
                      </Link>
                    </div>
                  ) : null}

                </div>
              </div>
            </section>
          );
        })
      )}

      {/* Styled Responsive Overlay Layout */}
      <style>{`
        @media (max-width: 992px) {
          .collection-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .collection-grid-layout.reverse-layout {
            display: flex !important;
            flex-direction: column-reverse !important;
          }
          .collection-grid-layout .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .collection-grid-layout .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
