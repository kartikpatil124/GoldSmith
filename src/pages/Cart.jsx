import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopBg from '../../images/shopbg.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories, formatPrice } from '../data/products';
import api, { getMediaUrl, getProductImage } from '../utils/api';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    sameAsPhone: true,
    preferredContactMethod: 'WhatsApp',
    inquiryType: 'Price Inquiry',
    occasion: '',
    message: 'Hello, I would like to consult a jewellery expert about these selected pieces. Please provide details regarding pricing, metal choices, and custom fitting options.',
    budgetRange: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        customerName: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        whatsappNumber: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'phone' && prev.sameAsPhone) {
        updated.whatsappNumber = value;
      }
      if (name === 'sameAsPhone' && checked) {
        updated.whatsappNumber = prev.phone;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      // Send inquiry for each item in basket — backend is source of truth
      const promises = cartItems.map(item => {
        const payload = {
          ...form,
          productName: item.name,
          productId: item._id || item.id,
          productSku: item.sku || '',
          customizationNotes: `Inquiry Quantity: ${item.quantity} | Metal: ${item.metal || '22K Gold'}`,
          message: `${form.message}\n\n[Inquired Quantity: ${item.quantity}]`,
        };
        return api.post('/inquiries', payload);
      });

      const results = await Promise.allSettled(promises);
      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0 && failed.length === results.length) {
        throw new Error(`Failed to submit ${failed.length} consultation request(s). Please try again.`);
      }

      clearCart();
      setSubmitted(true);

      if (failed.length > 0) {
        setError(`${results.length - failed.length} of ${results.length} inquiries submitted. Some items failed — please check your account.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit consultation request. Please try again.');
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
      {/* Top Floating Glass Header Capsule */}
      <div className="glass-floating-cart-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          SHOPPING BAG
        </span>
      </div>

      {/* Big Liquid Glass Box in Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '120px' }}>

            {/* Hero Header Banner */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 18px',
                borderRadius: '20px',
                background: 'rgba(188, 156, 108, 0.15)',
                border: '1px solid rgba(188, 156, 108, 0.3)',
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-dark)',
                marginBottom: '12px'
              }}>
                Concierge Selection
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Shopping Bag & Vault Inquiry
              </h1>
              <p style={{
                fontSize: '15px',
                color: 'rgba(26,26,26,0.65)',
                maxWidth: '560px',
                margin: '10px auto 0',
                fontFamily: 'var(--font-body)'
              }}>
                Review your curated designs and request a private consultation or bespoke quotation.
              </p>
            </div>

            {submitted ? (
              /* Submitted Success Screen */
              <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  borderRadius: '32px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.08), 0 10px 30px rgba(201,168,76,0.12)',
                  padding: '60px 40px'
                }}>
                  <div style={{ fontSize: '54px', marginBottom: '16px' }}>✨</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0 0 12px' }}>
                    Consultation Request Registered!
                  </h2>
                  <p style={{ color: 'rgba(26,26,26,0.7)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                    A Senior Jewellery Specialist has been assigned to your request and will connect with you via <strong>{form.preferredContactMethod}</strong> shortly.
                  </p>
                  <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px', marginBottom: '32px' }}>
                    Confirmation details have also been dispatched to <strong>{form.email}</strong>.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a 
                      href="https://wa.me/919106251842?text=Hello%20Goldsmiths%20Jewels,%20I%20have%20just%20submitted%20a%20VIP%20consultation%20request.%20Please%20assist%20me." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 28px',
                        borderRadius: '9999px',
                        background: '#25D366',
                        color: '#FFF',
                        fontWeight: 700,
                        fontSize: '13px',
                        textDecoration: 'none',
                        boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)'
                      }}
                    >
                      💬 Connect via WhatsApp Desk
                    </a>
                    <Link
                      to="/shop"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 28px',
                        borderRadius: '9999px',
                        background: 'var(--color-charcoal)',
                        color: '#FFF',
                        fontWeight: 700,
                        fontSize: '13px',
                        textDecoration: 'none',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                      }}
                    >
                      Explore More Masterpieces →
                    </Link>
                  </div>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Bag State */
              <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  borderRadius: '32px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.08), 0 10px 30px rgba(201,168,76,0.1)',
                  padding: '60px 32px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(244, 215, 155, 0.3) 0%, rgba(201, 168, 76, 0.15) 100%)',
                    border: '1px solid rgba(188, 156, 108, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    margin: '0 auto 24px'
                  }}>
                    🛍️
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-charcoal)' }}>
                    Your Shopping Bag is Currently Empty
                  </h2>
                  <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                    Explore our fine jewellery collections and save your chosen designs to request custom pricing and fittings.
                  </p>

                  {/* Category Navigation Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                    {categories.slice(0, 5).map(cat => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.slug}`}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(188, 156, 108, 0.25)',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-charcoal)',
                          textDecoration: 'none'
                        }}
                      >
                        {cat.name} →
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/shop"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 36px',
                      borderRadius: '9999px',
                      background: 'var(--color-charcoal)',
                      color: '#FFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  >
                    Browse Full Collection →
                  </Link>
                </div>
              </div>
            ) : (
              /* Cart Main Grid Layout */
              <div className="cart-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '36px', alignItems: 'start' }}>
                
                {/* Left Column: Selected Items List */}
                <div>
                  {/* List Header Bar */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '16px 24px',
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-charcoal)', fontFamily: 'var(--font-display)' }}>
                      Selected Designs ({cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'})
                    </div>
                    <button
                      onClick={clearCart}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-ruby)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Clear Bag 🗑️
                    </button>
                  </div>

                  {/* Items Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cartItems.map(item => {
                      const itemId = item._id || item.id;
                      const rawImg = getProductImage(item);
                      const pImg = rawImg ? getMediaUrl(rawImg) : null;

                      return (
                        <div
                          key={itemId}
                          style={{
                            background: 'rgba(255, 255, 255, 0.82)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            borderRadius: '24px',
                            border: '1.5px solid rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 16px 36px rgba(0,0,0,0.05), 0 4px 14px rgba(201,168,76,0.08)',
                            padding: '20px',
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center'
                          }}
                        >
                          {/* Thumbnail Image */}
                          <div
                            onClick={() => navigate(`/product/${item.slug}`)}
                            style={{
                              width: '110px',
                              height: '110px',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              background: 'rgba(245,242,236,0.7)',
                              position: 'relative',
                              flexShrink: 0,
                              cursor: 'pointer'
                            }}
                          >
                            {pImg ? (
                              <img src={pImg} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px' }}>💎</div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.45)', fontWeight: 600 }}>
                                {item.category || 'Jewellery'}
                              </span>
                              <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', fontWeight: 600 }}>
                                SKU: {item.sku || 'GSM-2024'}
                              </span>
                            </div>

                            <h3
                              onClick={() => navigate(`/product/${item.slug}`)}
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '16px',
                                fontWeight: 700,
                                color: 'var(--color-charcoal)',
                                margin: '0 0 6px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {item.name}
                            </h3>

                            <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', marginBottom: '12px' }}>
                              {item.metal || '22K Yellow Gold'} {item.weight ? `· ${item.weight}` : ''}
                            </div>

                            {/* Stepper & Price Row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                              {/* Quantity Stepper */}
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '14px',
                                background: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(188, 156, 108, 0.3)'
                              }}>
                                <button
                                  onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
                                >
                                  −
                                </button>
                                <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
                                >
                                  +
                                </button>
                              </div>

                              {/* Item Price */}
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-gold-dark)', fontFamily: 'var(--font-display)' }}>
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                                {item.quantity > 1 && (
                                  <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)' }}>
                                    {formatPrice(item.price)} each
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remove Link */}
                            <button
                              onClick={() => removeFromCart(itemId)}
                              style={{
                                marginTop: '10px',
                                fontSize: '11px',
                                color: 'var(--color-ruby)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                textDecoration: 'underline'
                              }}
                            >
                              Remove from bag
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Sticky VIP Concierge Request Form */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  borderRadius: '28px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(201,168,76,0.12)',
                  padding: '28px'
                }}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', marginBottom: '4px' }}>
                    VIP Private Desk
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: '0 0 6px', color: 'var(--color-charcoal)' }}>
                    Request Consultation
                  </h2>
                  <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', marginBottom: '20px' }}>
                    A dedicated jewellery specialist will review your items and assist with sizing, customization, and pricing.
                  </p>

                  {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#EF4444', fontSize: '12px', marginBottom: '16px' }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.7)', marginBottom: '4px' }}>Full Name *</label>
                      <input
                        name="customerName"
                        required
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.7)', marginBottom: '4px' }}>Email *</label>
                        <input
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Email"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.7)', marginBottom: '4px' }}>Phone *</label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Phone"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.7)', marginBottom: '4px' }}>Preferred Channel *</label>
                      <select
                        name="preferredContactMethod"
                        value={form.preferredContactMethod}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
                      >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                        <option value="Phone Call">Bespoke Phone Call</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.7)', marginBottom: '4px' }}>Target Budget (Optional)</label>
                      <select
                        name="budgetRange"
                        value={form.budgetRange}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
                      >
                        <option value="">Select budget range</option>
                        <option value="Below ₹1,00,000">Below ₹1,00,000</option>
                        <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                        <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</option>
                        <option value="₹5,00,000+">₹5,00,000+</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.7)', marginBottom: '4px' }}>Custom Sizing / Instructions</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        style={{ width: '100%', minHeight: '60px', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px', outline: 'none', background: 'rgba(255,255,255,0.9)', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Subtotal & Insured Shipping Summary */}
                    <div style={{ margin: '8px 0 0', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(26,26,26,0.6)', marginBottom: '6px' }}>
                        <span>Insured Express Delivery</span>
                        <span style={{ color: '#10B981', fontWeight: 700 }}>COMPLIMENTARY ✨</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)' }}>
                        <span>Est. Order Value</span>
                        <span style={{ color: 'var(--color-gold-dark)' }}>{formatPrice(cartTotal)}</span>
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
                        color: '#FFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        marginTop: '4px'
                      }}
                    >
                      {submitting ? 'Submitting Request...' : '✨ Place VIP Consultation Request'}
                    </button>

                    <a
                      href="https://wa.me/919106251842?text=Hello%20Goldsmiths%20Jewels,%20I%20would%20like%20to%20inquire%20about%20my%20shopping%20bag%20selections."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        borderRadius: '14px',
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        background: 'rgba(37, 211, 102, 0.08)',
                        color: '#128C7E',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        marginTop: '4px'
                      }}
                    >
                      💬 Chat Instantly on WhatsApp Desk
                    </a>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .cart-main-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }

          .cart-main-grid input,
          .cart-main-grid textarea,
          .cart-main-grid select {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
