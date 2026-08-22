import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import shopBg from '../../images/shopbg.png';
import api, { getMediaUrl, getProductImage } from '../utils/api';
import { formatPrice } from '../data/products';

export default function Bridal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCeremony, setActiveCeremony] = useState('wedding');
  
  // Interactive Trousseau Builder State
  const [trousseauConfig, setTrousseauConfig] = useState({
    metal: '22K Heritage Gold',
    selectedPieces: ['necklace', 'earrings', 'tikka'],
    budgetTier: 'luxury'
  });

  // Interactive 4Cs Diamond Finder State
  const [diamondShape, setDiamondShape] = useState('Round');
  const [caratWeight, setCaratWeight] = useState(2.0);

  // Salon Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    notes: ''
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const fetchBridal = async () => {
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
    fetchBridal();
  }, []);

  // Trousseau Piece Price Map (Estimated)
  const piecePrices = {
    necklace: 350000,
    earrings: 85000,
    tikka: 45000,
    cuffs: 120000,
    ring: 180000,
    nath: 35000
  };

  const estimatedTrousseauTotal = useMemo(() => {
    return trousseauConfig.selectedPieces.reduce((total, key) => total + (piecePrices[key] || 0), 0);
  }, [trousseauConfig.selectedPieces]);

  const toggleTrousseauPiece = (key) => {
    setTrousseauConfig((prev) => {
      const exists = prev.selectedPieces.includes(key);
      const updated = exists 
        ? prev.selectedPieces.filter(p => p !== key) 
        : [...prev.selectedPieces, key];
      return { ...prev, selectedPieces: updated };
    });
  };

  // Ceremonies Lookbook Data
  const ceremonyLookbooks = {
    wedding: {
      title: 'The Wedding Day · Main Trousseau',
      subtitle: '22K Kundan & Antique Gold Grandeur',
      description: 'The pinnacle of heritage craftsmanship. Multi-layered chokers, certified emerald polki sets, and royal bridal crowns designed for your monumental day.',
      heroImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      category: 'Bridal Sets'
    },
    sangeet: {
      title: 'Sangeet & Mehendi Celebration',
      subtitle: 'Luminescent Rose Gold & Vibrant Gemstones',
      description: 'Flexible, lightweight luxury crafted for movement, dancing, and vibrant festivities. Adorned with rubies, sapphires, and warm rose gold.',
      heroImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      category: 'Earrings'
    },
    reception: {
      title: 'Cocktail & Reception Atelier',
      subtitle: 'GIA Solitaire Diamonds & Platinum Elegance',
      description: 'Sophisticated contemporary silhouettes featuring rare high-carat solitaire diamonds, tennis bracelets, and platinum evening sets.',
      heroImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      category: 'Rings'
    },
    groom: {
      title: "Groom's Signature Suite",
      subtitle: 'Platinum Bands, Royal Kilangi & Gold Chains',
      description: 'Understated masculine elegance featuring comfort-fit wedding bands, pearl strings, and custom gem-set sherwani buttons.',
      heroImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      category: 'Bracelets'
    }
  };

  const activeData = ceremonyLookbooks[activeCeremony];
  const activeProducts = products
    .filter(p => p.category?.toLowerCase() === activeData.category.toLowerCase() || p.occasion === 'Bridal')
    .slice(0, 4);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketRef('BRD-' + Math.floor(100000 + Math.random() * 900000));
    setSubmitted(true);
  };

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
      <div className="glass-floating-bridal-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          BRIDAL SALON
        </span>
      </div>

      {/* Big Liquid Glass Box in Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '120px' }}>

            {/* 1. INTERACTIVE BRIDAL TROUSSEAU BUILDER WIDGET */}
            <div className="bridal-trousseau-card" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(248, 244, 236, 0.55) 100%)',
              backdropFilter: 'blur(36px) saturate(190%)',
              WebkitBackdropFilter: 'blur(36px) saturate(190%)',
              borderRadius: '32px',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)',
              padding: '36px',
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '36px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(201, 168, 76, 0.15)',
                  color: 'var(--color-gold-dark)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  ✦ Interactive Trousseau Customizer
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  lineHeight: 1.15,
                  marginBottom: '10px'
                }}>
                  Build Your Dream Bridal Set
                </h2>

                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.7)', lineHeight: 1.5, marginBottom: '24px' }}>
                  Select your desired bridal ornaments to calculate custom weight estimations and preview your complete trousseau package.
                </p>

                {/* Piece Selector Checkboxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { key: 'necklace', label: 'Choker Set', price: '₹3.5L+' },
                    { key: 'earrings', label: 'Jhumkas', price: '₹85k+' },
                    { key: 'tikka', label: 'Maang Tikka', price: '₹45k+' },
                    { key: 'cuffs', label: 'Bridal Cuffs', price: '₹1.2L+' },
                    { key: 'ring', label: 'Solitaire Ring', price: '₹1.8L+' },
                    { key: 'nath', label: 'Nose Nath', price: '₹35k+' }
                  ].map((item) => {
                    const isSelected = trousseauConfig.selectedPieces.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleTrousseauPiece(item.key)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '16px',
                          border: '1.5px solid',
                          borderColor: isSelected ? 'var(--color-gold)' : 'rgba(0,0,0,0.08)',
                          background: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.45)',
                          boxShadow: isSelected ? '0 6px 20px rgba(201, 168, 76, 0.2)' : 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', marginBottom: '2px' }}>
                          {item.label} {isSelected && '✓'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(26,26,26,0.5)' }}>
                          {item.price}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Metal Selection Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>Metal:</span>
                  {['22K Heritage Gold', '18K Rose Gold', 'Platinum'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTrousseauConfig(prev => ({ ...prev, metal: m }))}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid',
                        borderColor: trousseauConfig.metal === m ? 'var(--color-gold)' : 'rgba(0,0,0,0.1)',
                        background: trousseauConfig.metal === m ? 'var(--color-charcoal)' : 'rgba(255,255,255,0.6)',
                        color: trousseauConfig.metal === m ? '#fff' : '#1A1A1A',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trousseau Summary Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                padding: '28px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.06)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', display: 'block', marginBottom: '8px' }}>
                  Estimated Trousseau Value
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--color-gold-dark)', marginBottom: '8px' }}>
                  {formatPrice(estimatedTrousseauTotal)}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', marginBottom: '20px' }}>
                  Includes {trousseauConfig.selectedPieces.length} custom pieces in {trousseauConfig.metal}
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="glass-load-more-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>RESERVE THIS TROUSSEAU ✦</span>
                </button>
              </div>
            </div>


            {/* 2. CEREMONY LOOKBOOK SPATIAL TABS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
                  Wedding Ceremonies Lookbook
                </h3>

                {/* Interactive Tabs */}
                <div style={{
                  display: 'inline-flex',
                  gap: '6px',
                  padding: '6px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.85)'
                }}>
                  {[
                    { id: 'wedding', label: 'The Wedding Day' },
                    { id: 'sangeet', label: 'Sangeet & Mehendi' },
                    { id: 'reception', label: 'Cocktail & Reception' },
                    { id: 'groom', label: "Groom's Suite" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCeremony(tab.id)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '999px',
                        border: 'none',
                        background: activeCeremony === tab.id ? 'var(--color-charcoal)' : 'transparent',
                        color: activeCeremony === tab.id ? '#fff' : '#1A1A1A',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content Spatial Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(30px) saturate(190%)',
                borderRadius: '32px',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                padding: '32px 36px',
                display: 'grid',
                gridTemplateColumns: '1.1fr 2fr',
                gap: '28px',
                alignItems: 'stretch'
              }}>
                {/* Hero Feature */}
                <div>
                  <div style={{
                    height: '240px',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '2px solid rgba(255,255,255,0.9)'
                  }}>
                    <img src={activeData.heroImage} alt={activeData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                    {activeData.subtitle}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>
                    {activeData.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.7)', lineHeight: 1.5, margin: 0 }}>
                    {activeData.description}
                  </p>
                </div>

                {/* 4 Highlight Products */}
                <div className="bridal-highlight-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  {activeProducts.map((prod) => {
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
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%'
                        }}
                      >
                        <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '14px', overflow: 'hidden', marginBottom: '8px', background: 'rgba(245,242,236,0.6)' }}>
                          {pImg ? <img src={pImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '24px' }}>💎</div>}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, height: '28px', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                          {formatPrice(prod.price)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>


            {/* 3. INTERACTIVE 4Cs SOLITAIRE DIAMOND FINDER WIDGET */}
            <div className="bridal-diamond-card" style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(30px) saturate(190%)',
              borderRadius: '32px',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              padding: '36px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '36px',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '6px' }}>
                  GIA & IGI Certified Solitaires
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>
                  Interactive 4Cs Diamond Selector
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.7)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Understand Carat Weight, Cut geometry, and Certification attributes before selecting your engagement ring solitaire.
                </p>

                {/* Shape Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', display: 'block', marginBottom: '8px' }}>
                    Select Cut Shape:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Round', 'Oval', 'Emerald', 'Pear', 'Princess'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setDiamondShape(s)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '14px',
                          border: '1px solid',
                          borderColor: diamondShape === s ? 'var(--color-gold)' : 'rgba(0,0,0,0.1)',
                          background: diamondShape === s ? 'var(--color-charcoal)' : 'rgba(255,255,255,0.7)',
                          color: diamondShape === s ? '#fff' : '#1A1A1A',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Carat Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>Carat Size:</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-dark)' }}>{caratWeight} Carat</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="5.0" 
                    step="0.1" 
                    value={caratWeight}
                    onChange={(e) => setCaratWeight(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-gold)' }}
                  />
                </div>
              </div>

              {/* Visual Preview Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '56px', marginBottom: '8px' }}>
                  💎
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
                  {caratWeight} Carat {diamondShape} Cut
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', marginBottom: '16px' }}>
                  Color D-F · Clarity VVS1 · GIA & IGI Laser Inscribed
                </div>
                <Link 
                  to="/shop?category=rings"
                  className="glass-load-more-btn"
                  style={{ textDecoration: 'none', display: 'inline-flex', padding: '10px 24px' }}
                >
                  <span>EXPLORE SOLITAIRE RINGS</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom-Right Floating Glass Bar: Book Salon Consultation */}
      <div className="glass-floating-controls-pill" onMouseMove={handleMouseMove}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#1A1A1A' }}>
          VIP BRIDAL SALON
        </span>
        <div className="glass-control-divider" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-control-btn"
          style={{ color: 'var(--color-gold-dark)', fontWeight: 700 }}
        >
          BOOK APPOINTMENT ✦
        </button>
      </div>

      {/* Private Bridal Salon Appointment Modal */}
      {isModalOpen && (
        <div className="glass-filter-drawer" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-filter-drawer-backdrop" onClick={() => setIsModalOpen(false)} />
          
          <div style={{
            position: 'relative',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            borderRadius: '32px',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.25)',
            padding: '36px',
            zIndex: 2001
          }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'transparent', fontSize: '22px', cursor: 'pointer' }}
            >
              ✕
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                  Salon Consultation Reserved
                </h3>
                <p style={{ color: 'rgba(26,26,26,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Thank you for booking with goldsmiths Bridal Salon. Your reservation code is <strong>{ticketRef}</strong>. Our senior bridal consultant will reach out shortly.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setIsModalOpen(false); }}
                  className="glass-load-more-btn"
                >
                  <span>CLOSE WINDOW</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                  Private Bridal Lounge
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', marginBottom: '24px' }}>
                  Reserve an exclusive VIP consultation with senior gemologists and master goldsmiths.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                    />
                  </div>
                  <input 
                    type="date" 
                    required 
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                  />
                  <textarea 
                    placeholder="Specific requests, ceremony date or preferences..." 
                    rows={3} 
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', resize: 'none' }}
                  />
                </div>

                <button 
                  type="submit" 
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'var(--color-charcoal)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  CONFIRM SALON RESERVATION
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .bridal-trousseau-card {
            grid-template-columns: 1fr !important;
            padding: 20px 16px !important;
            gap: 20px !important;
            border-radius: 20px !important;
          }

          .bridal-highlight-products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }

          .bridal-diamond-card {
            grid-template-columns: 1fr !important;
            padding: 20px 16px !important;
            gap: 20px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
