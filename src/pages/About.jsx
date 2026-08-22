import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shopBg from '../../images/shopbg.png';

export default function About() {
  const [activeEra, setActiveEra] = useState('1985');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const timelineEras = {
    '1985': {
      title: 'The Zaveri Bazaar Atelier Founded',
      subtitle: 'Mumbai Historic Jewelry District',
      desc: 'Master Craftsman Rajesh Mehta established a modest workshop dedicated to traditional Indian Kundan, Polki, and 22K gold craftsmanship. Every ornament was meticulously forged by hand.',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'
    },
    '2002': {
      title: 'High Jewelry & Solitaire Expansion',
      subtitle: 'Pioneering Fine Solitaire Setting',
      desc: 'goldsmiths expanded into high-carat GIA & IGI certified solitaire diamond engagement rings and royal bridal suites, catering to royal families and discerning collectors.',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'
    },
    '2015': {
      title: 'Ethical Sourcing & 3D CAD Innovation',
      subtitle: 'Modernizing Precision Craftsmanship',
      desc: 'Pioneered 100% conflict-free diamond sourcing and integrated photorealistic 3D CAD modeling, allowing clients to preview bespoke designs before master goldsmiths forge them.',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    },
    '2024': {
      title: 'The Spatial Liquid Glass Era',
      subtitle: 'Global Boutique & Digital Atelier',
      desc: 'Today, three generations later, goldsmiths fuses heritage Indian artistry with state-of-the-art liquid glass digital experiences, offering bespoke jewelry to clients worldwide.',
      img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop'
    }
  };

  const activeTimeline = timelineEras[activeEra];

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
      {/* Top Center Liquid Glass Header Capsule */}
      <div className="glass-floating-about-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          OUR HERITAGE
        </span>
      </div>

      {/* Big Liquid Glass Box in Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '120px' }}>

            {/* 1. HERITAGE HERO BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(248, 244, 236, 0.55) 100%)',
              backdropFilter: 'blur(36px) saturate(190%)',
              WebkitBackdropFilter: 'blur(36px) saturate(190%)',
              borderRadius: '32px',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px'
            }}>
              <div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-dark)',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Established 1985 · Zaveri Bazaar, Mumbai
                </span>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '34px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  lineHeight: 1.15,
                  marginBottom: '12px'
                }}>
                  Three Generations of Fine Jewellery Excellence
                </h1>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'rgba(26, 26, 26, 0.75)',
                  lineHeight: 1.6,
                  maxWidth: '800px',
                  margin: 0
                }}>
                  For over nearly four decades, goldsmiths Jewels has remained dedicated to the art of fine jewelry making. We combine time-honored Indian heritage techniques with modern spatial luxury to craft heirlooms that celebrate life's most monumental milestones.
                </p>
              </div>

              {/* 4 Interactive Statistics Cards */}
              <div className="about-stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0,0,0,0.08)'
              }}>
                {[
                  { stat: '38+', label: 'Years of Heritage', sub: 'Est. 1985' },
                  { stat: '10,000+', label: 'Bespoke Creations', sub: 'Handcrafted Masterpieces' },
                  { stat: '100%', label: 'BIS Hallmarked Gold', sub: '22K & 18K Certified' },
                  { stat: 'GIA / IGI', label: 'Certified Solitaires', sub: 'Ethically Sourced' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '20px',
                      border: '1.5px solid rgba(255, 255, 255, 0.85)',
                      padding: '20px 16px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--color-gold-dark)', marginBottom: '4px' }}>
                      {item.stat}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', marginBottom: '2px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(26,26,26,0.5)' }}>
                      {item.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* 2. INTERACTIVE HERITAGE TIMELINE SPATIAL WIDGET */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(30px) saturate(190%)',
              borderRadius: '32px',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              padding: '36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                    Historical Milestones
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                    The goldsmiths Legacy Timeline
                  </h3>
                </div>

                {/* Era Selector Pills */}
                <div style={{
                  display: 'inline-flex',
                  gap: '6px',
                  padding: '6px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.85)'
                }}>
                  {['1985', '2002', '2015', '2024'].map((era) => (
                    <button
                      key={era}
                      onClick={() => setActiveEra(era)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '999px',
                        border: 'none',
                        background: activeEra === era ? 'var(--color-charcoal)' : 'transparent',
                        color: activeEra === era ? '#fff' : '#1A1A1A',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Era Card Display */}
              <div className="about-timeline-card" style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                padding: '28px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '28px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    {activeTimeline.subtitle}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>
                    {activeTimeline.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.75)', lineHeight: 1.6, margin: 0 }}>
                    {activeTimeline.desc}
                  </p>
                </div>

                <div style={{ height: '200px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img src={activeTimeline.img} alt={activeTimeline.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>


            {/* 3. CORE BRAND PILLARS GRID */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>
                Our Core Brand Pillars
              </h3>

              <div className="about-pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                {[
                  { icon: '✨', title: 'Master Craftsmanship', desc: 'Hand-forged by artisan goldsmiths combining ancient Kundan/Polki techniques with CAD precision.' },
                  { icon: '🔍', title: 'BIS 100% Quality', desc: 'Every piece features official hallmarked gold purities (22K/18K) and certified diamonds.' },
                  { icon: '🌿', title: 'Ethical Sourcing', desc: 'Kimberley Process compliant conflict-free diamonds and responsibly mined gemstones.' },
                  { icon: '🤝', title: 'Enduring Trust', desc: 'Over 10,000 satisfied patrons and family legacies built over 38+ distinguished years.' },
                  { icon: '🎨', title: 'Modern Aesthetics', desc: 'Combining timeless cultural motifs with modern luxury silhouettes.' },
                  { icon: '💎', title: 'Bespoke Concierge', desc: 'Private salon consultations and custom one-of-a-kind jewelry design services.' }
                ].map((pillar, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(30px) saturate(190%)',
                      borderRadius: '24px',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      padding: '24px'
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{pillar.icon}</div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.65)', lineHeight: 1.5, margin: 0 }}>
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom-Right Floating Glass Bar */}
      <div className="glass-floating-controls-pill" onMouseMove={handleMouseMove}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#1A1A1A' }}>
          EXPERIENCE OUR BOUTIQUE
        </span>
        <div className="glass-control-divider" />
        <Link 
          to="/contact"
          className="glass-control-btn"
          style={{ color: 'var(--color-gold-dark)', fontWeight: 700, textDecoration: 'none' }}
        >
          CONTACT US ✦
        </Link>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .about-timeline-card {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .about-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
