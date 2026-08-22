import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import api from '../utils/api';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', payment: 'upi' });
  const shipping = cartTotal >= 50000 ? 0 : 500;
  const tax = Math.round(cartTotal * 0.03);
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => { 
    if (!user) {
      alert("Please login to place an order");
      return;
    }
    
    try {
      setLoading(true);
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.featuredImage || '/images/sample.jpg',
          price: item.price,
          product: item._id || item.id
        })),
        shippingAddress: {
          fullName: `${form.firstName} ${form.lastName}`,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: 'India',
          phone: form.phone,
          email: form.email
        },
        paymentMethod: form.payment,
        itemsPrice: cartTotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const data = await api.post('/orders', orderData);
      
      if (data.success || data._id) {
        setOrderPlaced(true); 
        clearCart(); 
      }
    } catch (err) {
      alert("Error placing order: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success)', color: 'white', fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>✓</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Order Confirmed!</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '8px' }}>Order #LJ-{Date.now().toString().slice(-8)}</p>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '32px' }}>We'll send you a confirmation email with tracking details shortly.</p>
      <Link to="/shop" className="btn btn-primary btn-lg">Continue Shopping</Link>
    </div>
  );

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>No Items to Checkout</h2>
      <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'var(--color-gray-50)', padding: '40px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '24px' }}>Checkout</h1>
          {/* Steps */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Shipping', 'Payment', 'Review'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step > i + 1 ? 'var(--color-success)' : step === i + 1 ? 'var(--color-gold)' : 'var(--color-gray-300)', color: 'white', fontSize: 'var(--text-xs)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step > i + 1 ? '✓' : i + 1}</div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--color-charcoal)' : 'var(--color-gray-500)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: '48px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
          <div>
            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Shipping Address</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">Phone *</label><input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Address *</label><input name="address" value={form.address} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">City *</label><input name="city" value={form.city} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">State *</label><input name="state" value={form.state} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">PIN Code *</label><input name="pincode" value={form.pincode} onChange={handleChange} className="form-input" required /></div>
                </div>
                <button onClick={() => setStep(2)} className="btn btn-primary btn-lg" style={{ marginTop: '16px' }}>Continue to Payment</button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Payment Method</h3>
                {[{ id: 'upi', label: 'UPI (Google Pay, PhonePe, Paytm)', icon: '📱' }, { id: 'card', label: 'Credit / Debit Card', icon: '💳' }, { id: 'netbanking', label: 'Net Banking', icon: '🏦' }, { id: 'wallet', label: 'Wallet', icon: '👛' }, { id: 'cod', label: 'Cash on Delivery', icon: '💵' }].map(method => (
                  <label key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', border: form.payment === method.id ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', marginBottom: '12px', cursor: 'pointer', background: form.payment === method.id ? 'rgba(201,168,76,0.05)' : 'transparent', transition: 'all var(--transition-fast)' }}>
                    <input type="radio" name="payment" value={method.id} checked={form.payment === method.id} onChange={handleChange} style={{ accentColor: 'var(--color-gold)' }} />
                    <span style={{ fontSize: '20px' }}>{method.icon}</span>
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>{method.label}</span>
                  </label>
                ))}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary btn-lg">Review Order</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Review Your Order</h3>
                <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>Shipping To</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: 1.8 }}>
                    {form.firstName} {form.lastName}<br />{form.address}<br />{form.city}, {form.state} - {form.pincode}<br />{form.phone} · {form.email}
                  </p>
                </div>
                <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>Items ({cartItems.length})</h4>
                  {cartItems.map(item => (
                    <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 'var(--text-sm)' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary btn-lg">
                    {loading ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Order Summary Sidebar */}
          <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', padding: '32px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '20px' }}>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item._id || item.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>💎</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '16px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--color-success)' : undefined }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span>Tax</span><span>{formatPrice(tax)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-display)', paddingTop: '12px', borderTop: '1px solid var(--color-gray-200)' }}><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .container > div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
