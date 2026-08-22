import React, { useState, useMemo } from 'react';
import shopBg from '../../images/shopbg.png';
import api from '../utils/api';
import { formatPrice } from '../data/products';

export default function CustomOrder() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Ring',
    metal: '18K Yellow Gold',
    gemstone: 'Diamond',
    budget: '₹1,00,000 - ₹2,50,000',
    size: '',
    engraving: '',
    description: ''
  });

  const [refImage, setRefImage] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketRef, setTicketRef] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefImage(file);
      setRefPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let referenceImage = '';
      if (refImage) {
        const fd = new FormData();
        fd.append('image', refImage);
        const uploadRes = await api.post('/upload', fd);
        referenceImage = uploadRes.data || uploadRes || '';
      }
      await api.post('/custom-requests', { ...form, referenceImage });
      setTicketRef('CAD-' + Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting request: ' + (err.message || 'Please try again'));
    } finally {
      setSubmitting(false);
    }
  };

  // Estimated Custom Weight & Price Calculator
  const estimatedEstimate = useMemo(() => {
    const baseMap = {
      'Ring': 85000,
      'Necklace': 320000,
      'Earrings': 95000,
      'Bracelet': 140000,
      'Pendant': 65000,
      'Bangle': 180000,
      'Bridal Set': 550000,
      'Other': 100000
    };
    const metalMultiplier = form.metal.includes('22K') ? 1.25 : form.metal.includes('Platinum') ? 1.35 : 1.0;
    const base = baseMap[form.type] || 100000;
    return Math.round(base * metalMultiplier);
  }, [form.type, form.metal]);

  // Masterpiece Case Studies
  const pastMasterpieces = [
    {
      title: 'The Empress Emerald Choker',
      type: 'Bespoke Bridal Suite',
      metal: '22K Kundan Gold',
      gem: 'Zambian Emerald & Polki',
      beforeImg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Celestial Oval Solitaire Band',
      type: 'Engagement Ring',
      metal: 'Platinum 950',
      gem: '3.2ct D-IF GIA Diamond',
      beforeImg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'
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
      {/* Top Center Liquid Glass Header Capsule */}
      <div className="glass-floating-custom-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          BESPOKE ATELIER
        </span>
      </div>

      {/* Big Liquid Glass Box in Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '120px' }}>

            {/* 1. BESPOKE ATELIER HERO BANNER */}
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
                  Artisan Custom Craftsmanship
                </span>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  lineHeight: 1.15,
                  marginBottom: '12px'
                }}>
                  Transform Your Vision Into a Masterpiece
                </h1>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'rgba(26, 26, 26, 0.75)',
                  lineHeight: 1.6,
                  maxWidth: '750px',
                  margin: 0
                }}>
                  Collaborate directly with senior goldsmiths and master gemologists. From initial 3D photorealistic CAD renders to hand-setting rare certified gemstones, we bring your bespoke dream to life.
                </p>
              </div>

              {/* 4-Step Bespoke Atelier Journey */}
              <div className="custom-journey-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0,0,0,0.08)'
              }}>
                {[
                  { step: '01', title: 'Design Consultation', desc: 'Share your vision or upload sketch' },
                  { step: '02', title: '3D Photorealistic CAD', desc: 'Inspect renders from every angle' },
                  { step: '03', title: 'Artisan Hand-Crafting', desc: 'Master goldsmiths set rare gems' },
                  { step: '04', title: 'White-Glove Delivery', desc: 'Certified & hallmarked to your door' }
                ].map((s) => (
                  <div 
                    key={s.step} 
                    style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '20px',
                      border: '1.5px solid rgba(255, 255, 255, 0.85)',
                      padding: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--color-charcoal)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px'
                    }}>
                      {s.step}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.6)', lineHeight: 1.4 }}>
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* 2. INTERACTIVE BESPOKE PIECE CONFIGURATOR & REQUEST FORM */}
            <div className="custom-configurator-card" style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(30px) saturate(190%)',
              borderRadius: '32px',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              padding: '36px'
            }}>
              
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎨</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>
                    Bespoke Request Received
                  </h2>
                  <p style={{ color: 'rgba(26,26,26,0.7)', fontSize: '14px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
                    Thank you for trusting goldsmiths Atelier. Your custom commission code is <strong>{ticketRef}</strong>. Our senior CAD designer will prepare your initial renders within 48 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="glass-load-more-btn"
                  >
                    <span>START ANOTHER COMMISSION</span>
                  </button>
                </div>
              ) : (
                <form className="custom-order-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '36px', alignItems: 'flex-start' }}>
                  
                  {/* Left Column: Form Controls */}
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                      Bespoke Specification Form
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', marginBottom: '24px' }}>
                      Configure your desired metal, gemstone, and style parameters to generate a live estimate.
                    </p>

                    {/* Step 1: Category Selector Pills */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', display: 'block', marginBottom: '8px' }}>
                        1. Ornament Type:
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Pendant', 'Bangle', 'Bridal Set', 'Other'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, type: t }))}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '14px',
                              border: '1px solid',
                              borderColor: form.type === t ? 'var(--color-gold)' : 'rgba(0,0,0,0.1)',
                              background: form.type === t ? 'var(--color-charcoal)' : 'rgba(255,255,255,0.7)',
                              color: form.type === t ? '#fff' : '#1A1A1A',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Metal Preference */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', display: 'block', marginBottom: '8px' }}>
                        2. Metal Choice:
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['22K Yellow Gold', '18K Yellow Gold', '18K White Gold', '18K Rose Gold', 'Platinum 950'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, metal: m }))}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '14px',
                              border: '1px solid',
                              borderColor: form.metal === m ? 'var(--color-gold)' : 'rgba(0,0,0,0.1)',
                              background: form.metal === m ? 'rgba(201, 168, 76, 0.2)' : 'rgba(255,255,255,0.7)',
                              color: form.metal === m ? 'var(--color-gold-dark)' : '#1A1A1A',
                              fontSize: '12px',
                              fontWeight: form.metal === m ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Contact & Specification Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Your Full Name *" 
                        required 
                        value={form.name} 
                        onChange={handleChange} 
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address *" 
                        required 
                        value={form.email} 
                        onChange={handleChange} 
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Phone Number *" 
                        required 
                        value={form.phone} 
                        onChange={handleChange} 
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                      <input 
                        type="text" 
                        name="budget" 
                        placeholder="Budget Target (e.g. ₹1,50,000) *" 
                        required 
                        value={form.budget} 
                        onChange={handleChange} 
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <input 
                        type="text" 
                        name="size" 
                        placeholder="Ring / Wrist Size (optional)" 
                        value={form.size} 
                        onChange={handleChange} 
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                      <input 
                        type="text" 
                        name="engraving" 
                        placeholder="Custom Inner Engraving Text (optional)" 
                        value={form.engraving} 
                        onChange={handleChange} 
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                    </div>

                    <textarea 
                      name="description" 
                      placeholder="Describe your dream piece in detail — design style, inspiration, stone cuts..." 
                      rows={3} 
                      required 
                      value={form.description} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', resize: 'none', marginBottom: '20px', boxSizing: 'border-box' }}
                    />

                    {/* Image Upload Area */}
                    <div style={{
                      border: '2px dashed rgba(0,0,0,0.15)',
                      borderRadius: '18px',
                      padding: '20px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.6)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                      />
                      {refPreview ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <img src={refPreview} alt="Reference Preview" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gold-dark)' }}>Reference image attached ✓</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)' }}>
                          📷 Drag & drop or click to upload reference sketch / photo (optional)
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Live Estimate & Action Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    padding: '28px',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.06)'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', display: 'block', marginBottom: '8px' }}>
                      Bespoke Custom Summary
                    </span>

                    <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', marginBottom: '4px' }}>Selected Commission:</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                        Custom {form.type} in {form.metal}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>
                        Calculated Estimate Starting From:
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                        {formatPrice(estimatedEstimate)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', marginTop: '4px' }}>
                        Includes 3D CAD modeling, hallmarked metal & certified gemstones
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'var(--color-charcoal)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: submitting ? 'wait' : 'pointer'
                      }}
                    >
                      {submitting ? 'PROCESSING COMMISSION...' : 'SUBMIT BESPOKE REQUEST ✦'}
                    </button>
                  </div>

                </form>
              )}

            </div>


            {/* 3. PAST BESPOKE MASTERPIECES SHOWCASE */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>
                Recent Bespoke Masterpieces
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {pastMasterpieces.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(30px) saturate(190%)',
                      borderRadius: '26px',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      padding: '24px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ width: '130px', height: '130px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                      <img src={item.afterImg} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                        {item.type} · {item.metal}
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                        {item.title}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.65)', lineHeight: 1.4 }}>
                        {item.gem}
                      </div>
                    </div>
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
          BESPOKE DESIGN STUDIO
        </span>
        <div className="glass-control-divider" />
        <a 
          href="tel:+919106251842"
          className="glass-control-btn"
          style={{ color: 'var(--color-gold-dark)', fontWeight: 700, textDecoration: 'none' }}
        >
          CALL ARTISAN 📞
        </a>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .custom-journey-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .custom-configurator-card {
            padding: 20px 16px !important;
            border-radius: 20px !important;
          }

          .custom-order-form {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }

          .custom-order-form > div div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }

          .custom-order-form input,
          .custom-order-form textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
