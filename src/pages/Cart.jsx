import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import api, { getMediaUrl, getProductImage } from '../utils/api';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    sameAsPhone: true,
    preferredContactMethod: 'WhatsApp',
    inquiryType: 'Price Inquiry',
    occasion: '',
    message: 'Hello, I would like to consult a jewellery expert about these beautiful pieces. Please provide details regarding pricing, metal choices, and custom fitting options.',
    budgetRange: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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

      // Send an inquiry for EACH item in the basket in parallel
      const promises = cartItems.map(item => {
        const payload = {
          ...form,
          productName: item.name,
          productId: item._id || item.id,
          productSku: item.sku || '',
          customizationNotes: `Inquiry Quantity: ${item.quantity} | Metal preference: ${item.metal}`,
          message: `${form.message}\n\n[Inquired Quantity: ${item.quantity}]`,
        };
        return api.post('/inquiries', payload);
      });

      await Promise.all(promises);
      clearCart();
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '120px 0', background: '#FAF8F5' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>✨</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '12px' }}>
        Consultation Request Placed!
      </h2>
      <p style={{ color: 'var(--color-gray-600)', maxWidth: '540px', margin: '0 auto 8px', lineHeight: 1.6 }}>
        Your inquiry has been registered. An expert designer has been assigned to your request and will contact you via **{form.preferredContactMethod}** shortly.
      </p>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '32px' }}>A confirmation details email has also been sent to **{form.email}**.</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <a 
          href={`https://wa.me/919876543210?text=Hello%20Goldsmiths%20Jewels,%20I%20have%20just%20submitted%20a%20bulk%20consultation%20request.%20Please%20assist%20me.`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ background: '#25D366', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          💬 Chat on WhatsApp
        </a>
        <Link to="/shop" className="btn btn-secondary">Return to Shop</Link>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '120px 0', background: '#FAF8F5' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>💎</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px', color: 'var(--color-charcoal)' }}>Your Inquiry Basket is Empty</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>Explore our timeless fine collections and add pieces to your inquiry basket.</p>
      <Link to="/shop" className="btn btn-primary btn-lg">Browse Collections</Link>
    </div>
  );

  return (
    <div style={{ background: '#FAF8F5' }}>
      {/* Header Banner */}
      <div style={{ background: '#F3EFE9', padding: '40px 0', borderBottom: '1px solid rgba(188, 156, 108, 0.15)' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>
            Inquiry Basket ({cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'})
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '4px' }}>
            Review your selected designs and submit a consultation request.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '48px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'start' }}>
          
          {/* Selected Items List */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '24px' }}>
              Selected Pieces
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cartItems.map(item => (
                <div key={item._id || item.id} style={{ display: 'flex', gap: '24px', padding: '24px', background: '#F3EFE9', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(188, 156, 108, 0.15)' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--color-beige), var(--color-cream))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', flexShrink: 0, overflow: 'hidden' }}>
                    <div>💎</div>
                    {getProductImage(item) && (
                      <img 
                        src={getMediaUrl(getProductImage(item))} 
                        alt={item.name} 
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} 
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.slug}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px', display: 'block' }}>
                      {item.name}
                    </Link>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                      {item.metal} · {item.weight || item.grossWeight}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: '12px' }}>
                      SKU: {item.sku}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(188, 156, 108, 0.3)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#FAF8F5' }}>
                        <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-gold)' }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{formatPrice(item.price)} each</p>}
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id || item.id)} style={{ marginTop: '12px', fontSize: 'var(--text-xs)', color: 'var(--color-ruby)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Remove from basket</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Request Form */}
          <div style={{ background: '#F3EFE9', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid rgba(188, 156, 108, 0.25)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
              Request Consultation
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: '24px' }}>
              Our expert designer will review your selections.
            </p>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#EF4444', fontSize: '12px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Full Name *</label>
                <input name="customerName" value={form.customerName} onChange={handleChange} className="form-input" required placeholder="Enter full name" style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" required placeholder="Enter email" style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Phone Number *</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" required placeholder="Phone number" style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }} />
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px' }}>
                  <span>WhatsApp Number</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input type="checkbox" name="sameAsPhone" checked={form.sameAsPhone} onChange={handleChange} />
                    Same
                  </label>
                </label>
                <input 
                  name="whatsappNumber" 
                  type="tel" 
                  value={form.whatsappNumber} 
                  onChange={handleChange} 
                  className="form-input" 
                  disabled={form.sameAsPhone} 
                  placeholder="WhatsApp number"
                  style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Preferred Contact *</label>
                <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange} className="form-input form-select" required style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Both">Both</option>
                  <option value="Phone Call">Bespoke Phone Call</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Target Budget (Optional)</label>
                <select name="budgetRange" value={form.budgetRange} onChange={handleChange} className="form-input form-select" style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}>
                  <option value="">Select budget range</option>
                  <option value="Below ₹50,000">Below ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                  <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                  <option value="₹5,00,000+">₹5,00,000+</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Message *</label>
                <textarea 
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  className="form-input form-textarea" 
                  required 
                  style={{ minHeight: '60px', padding: '8px 12px', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(188, 156, 108, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)' }}>
                  <span>Est. Value</span>
                  <span style={{ color: 'var(--color-gold)' }}>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary btn-lg" style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {submitting ? 'Submitting Request...' : '✨ Send Consultation Request'}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(188, 156, 108, 0.15)' }}>
              {['✨ Hallmark', '🤵 Expert Help', '💬 Active Chat'].map(b => (
                <span key={b} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .container > div[style*="grid-template-columns: 1fr 400px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
