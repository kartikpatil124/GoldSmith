import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/products';
import { getMediaUrl, getProductImage } from '../../utils/api';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      {/* Backdrop */}
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,21,18,0.5)', backdropFilter: 'blur(4px)' }} 
        onClick={() => setIsCartOpen(false)} 
      />

      <div style={{ 
        position: 'absolute', 
        right: 0, 
        top: 0, 
        bottom: 0, 
        width: '420px', 
        maxWidth: '100vw', 
        background: '#FAF8F5', 
        boxShadow: 'var(--shadow-2xl)', 
        display: 'flex', 
        flexDirection: 'column', 
        animation: 'slideInRight 0.3s ease-out',
        borderLeft: '1px solid rgba(188, 156, 108, 0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(188, 156, 108, 0.15)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
            Inquiry Basket ({cartCount})
          </h3>
          <button onClick={() => setIsCartOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3EFE9', border: 'none', cursor: 'pointer', color: 'var(--color-charcoal)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💎</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: '8px', color: 'var(--color-charcoal)' }}>Your basket is empty</h4>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginBottom: '24px' }}>Select pieces to request custom consultations.</p>
              <Link to="/shop" onClick={() => setIsCartOpen(false)} className="btn btn-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore Collections</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map(item => (
                <div key={item._id || item.id} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#F3EFE9', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(188, 156, 108, 0.15)' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, overflow: 'hidden' }}>
                    <div>💎</div>
                    {getProductImage(item) && (
                      <img 
                        src={getMediaUrl(getProductImage(item))} 
                        alt={item.name} 
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} 
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px', color: 'var(--color-charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: '8px' }}>{item.metal}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(188, 156, 108, 0.3)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#FAF8F5' }}>
                        <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>−</button>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>+</button>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gold)' }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id || item.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(188, 156, 108, 0.15)', background: '#F3EFE9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: 'var(--text-base)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-charcoal)' }}>
              <span>Estimated Value</span>
              <span style={{ color: 'var(--color-gold)' }}>{formatPrice(cartTotal)}</span>
            </div>
            <Link to="/cart" onClick={() => setIsCartOpen(false)} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✨ Request Consultation for All
            </Link>
            <button onClick={() => setIsCartOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
              Continue Browsing
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
