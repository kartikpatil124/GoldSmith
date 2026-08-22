import React, { useState } from 'react';
import shopBg from '../../images/shopbg.png';
import api from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/enquiries', form);
      setTicketRef('ENQ-' + Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting enquiry: ' + (err.message || 'Please try again'));
    } finally {
      setSubmitting(false);
    }
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
      <div className="glass-floating-contact-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          CONCIERGE & SALON
        </span>
      </div>

      {/* Big Liquid Glass Box in Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '120px' }}>

            {/* 1. CONCIERGE HERO BANNER */}
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
              gap: '16px'
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-dark)',
                display: 'block'
              }}>
                Flagship Boutique & Private Salon
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '34px',
                fontWeight: 700,
                color: '#1A1A1A',
                lineHeight: 1.15,
                margin: 0
              }}>
                Connect With Our Master Goldsmiths
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'rgba(26, 26, 26, 0.75)',
                lineHeight: 1.6,
                maxWidth: '750px',
                margin: 0
              }}>
                Whether inquiring about custom solitaires, scheduling a private bridal salon appointment, or seeking expert care advice for your heirlooms — our concierge team is at your service.
              </p>
            </div>


            {/* 2. TWO-COLUMN SPATIAL CONTACT GRID */}
            <div className="contact-main-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '28px',
              alignItems: 'stretch'
            }}>
              
              {/* Left Column: Direct Contact Cards & Map */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 4 Liquid Glass Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {[
                    { icon: '📍', title: 'Flagship Showroom', info: 'Goldsmith Jewels, Vesu, Surat, Gujarat 395007' },
                    { icon: '📞', title: 'Concierge Hotline', info: '+91 91062 51842\nMon - Sat: 10 AM - 8 PM' },
                    { icon: '📧', title: 'Email Support', info: 'goldsmithvesu@gmail.com\n24-Hour Desk Reply' },
                    { icon: '💬', title: 'WhatsApp VIP Desk', info: '+91 91062 51842\nInstant Virtual Salon' }
                  ].map((card, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.55)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '22px',
                        border: '1.5px solid rgba(255, 255, 255, 0.85)',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{card.icon}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.65)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                          {card.info}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Map Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(30px) saturate(190%)',
                  borderRadius: '24px',
                  border: '1.5px solid rgba(255, 255, 255, 0.8)',
                  padding: '14px',
                  height: '220px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <iframe
                    title="Goldsmith Jewels Vesu Surat Flagship Showroom"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.080191529638!2d72.77013707974727!3d21.149206730329496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d005dde21d7%3A0x61c74d78abd31707!2sGoldsmith%20Jewels!5e0!3m2!1sen!2sin!4v1786020164564!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '16px', filter: 'contrast(1.05) saturate(1.1)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>

                {/* Social Channels Pills */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>
                    Social Atelier:
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Instagram', 'Facebook', 'Pinterest', 'YouTube'].map((s) => (
                      <a 
                        key={s} 
                        href={`https://${s.toLowerCase()}.com`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          background: 'rgba(255,255,255,0.7)',
                          color: '#1A1A1A',
                          fontSize: '11px',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Concierge Inquiry Form */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(30px) saturate(190%)',
                borderRadius: '32px',
                border: '1.5px solid rgba(255, 255, 255, 0.85)',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '36px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>
                      Enquiry Submitted
                    </h3>
                    <p style={{ color: 'rgba(26,26,26,0.7)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                      Thank you for contacting goldsmiths Concierge. Your reference ticket is <strong>{ticketRef}</strong>. Our advisor will reach out within 24 hours.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="glass-load-more-btn"
                    >
                      <span>SEND ANOTHER MESSAGE</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                      Send Us a Direct Message
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', marginBottom: '24px' }}>
                      Fill out your request below and our senior advisor will respond promptly.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                      <input 
                        type="text" 
                        placeholder="Full Name *" 
                        required 
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                      />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <input 
                          type="email" 
                          placeholder="Email Address *" 
                          required 
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px' }}
                        />
                      </div>

                      <select 
                        value={form.subject} 
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', background: '#fff' }}
                      >
                        <option value="general">General Jewellery Inquiry</option>
                        <option value="product">Product Specification & Pricing</option>
                        <option value="custom">Bespoke Custom Order</option>
                        <option value="bridal">Private Bridal Salon Booking</option>
                        <option value="repair">Maintenance & Polishing Service</option>
                      </select>

                      <textarea 
                        placeholder="Write your message or specific enquiry details..." 
                        rows={4} 
                        required 
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', resize: 'none' }}
                      />
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
                      {submitting ? 'SENDING ENQUIRY...' : 'SUBMIT ENQUIRY ✦'}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom-Right Floating Glass Bar */}
      <div className="glass-floating-controls-pill" onMouseMove={handleMouseMove}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#1A1A1A' }}>
          VIP WHATSAPP DESK
        </span>
        <div className="glass-control-divider" />
        <a 
          href="https://wa.me/919106251842"
          target="_blank"
          rel="noreferrer"
          className="glass-control-btn"
          style={{ color: 'var(--color-gold-dark)', fontWeight: 700, textDecoration: 'none' }}
        >
          CHAT INSTANTLY 💬
        </a>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .contact-main-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .contact-main-grid input,
          .contact-main-grid select,
          .contact-main-grid textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
