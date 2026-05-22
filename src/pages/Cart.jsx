import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { getMediaUrl, getProductImage } from '../utils/api';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const shipping = cartTotal >= 50000 ? 0 : 500;
  const tax = Math.round(cartTotal * 0.03);
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛍️</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Your Bag is Empty</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>Discover our exquisite collections and find something you love.</p>
      <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'var(--color-gray-50)', padding: '40px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <div className="container"><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Shopping Bag ({cartItems.length})</h1></div>
      </div>
      <div className="container" style={{ padding: '48px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
          <div>
            {cartItems.map(item => (
              <div key={item._id || item.id} style={{ display: 'flex', gap: '24px', padding: '24px', borderBottom: '1px solid var(--color-gray-100)' }}>
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
                  <Link to={`/product/${item.slug}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>{item.name}</Link>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>{item.metal} · {item.weight}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: '12px' }}>SKU: {item.sku}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{formatPrice(item.price)} each</p>}
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id || item.id)} style={{ marginTop: '12px', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          {/* Order Summary */}
          <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', padding: '32px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--color-gray-200)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--color-success)' : undefined }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span>Tax (GST 3%)</span><span>{formatPrice(tax)}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '24px' }}><span>Total</span><span>{formatPrice(total)}</span></div>
            {/* Coupon */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input placeholder="Coupon code" className="form-input" style={{ padding: '10px 14px', fontSize: 'var(--text-sm)' }} />
              <button className="btn btn-secondary btn-sm">Apply</button>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '12px' }}>Proceed to Checkout</Link>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '8px' }}>Continue Shopping</Link>
            {/* Trust badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-gray-200)' }}>
              {['🔒 Secure', '🚚 Insured', '↩️ Returns'].map(b => (
                <span key={b} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .container > div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
