import { Link } from 'react-router-dom';
import { useState } from 'react';
import { categories } from '../../data/products';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 4000); }
  };

  return (
    <footer style={{ background: 'var(--color-charcoal)', color: 'var(--color-white)' }}>
      {/* Newsletter Section */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '60px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600, marginBottom: '8px' }}>Join the goldsmiths Circle</h3>
            <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>Be the first to know about new collections, exclusive offers, and jewellery styling tips.</p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px', flex: '1 1 400px', maxWidth: '500px' }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required style={{ flex: 1, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', color: 'var(--color-white)', fontSize: 'var(--text-sm)', outline: 'none' }} />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {subscribed ? '✓ Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container" style={{ padding: '64px 0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '0.05em' }}>GOLDSMITHS</span>
              <span style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-xs)', color: 'var(--color-gold)', letterSpacing: '0.3em', display: 'block', marginTop: '2px' }}>JEWELS</span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', lineHeight: 1.8, marginBottom: '20px' }}>Crafting timeless elegance since 1985. Each piece tells a story of heritage, artistry, and uncompromising quality.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Instagram', 'Facebook', 'Pinterest', 'YouTube'].map(social => (
                <a key={social} href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', transition: 'all var(--transition-fast)' }} aria-label={social}>
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', color: 'var(--color-gold)' }}>Quick Links</h4>
            {[{ name: 'Shop All', path: '/shop' }, { name: 'New Arrivals', path: '/shop?sort=newest' }, { name: 'Best Sellers', path: '/shop?sort=popular' }, { name: 'Bridal Collection', path: '/bridal' }, { name: 'Gift Guide', path: '/shop?category=gifts' }, { name: 'Custom Orders', path: '/custom-order' }].map(link => (
              <Link key={link.name} to={link.path} style={{ display: 'block', padding: '6px 0', fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', transition: 'color var(--transition-fast)' }}>{link.name}</Link>
            ))}
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', color: 'var(--color-gold)' }}>Customer Care</h4>
            {[{ name: 'My Account', path: '/account' }, { name: 'Order Tracking', path: '/account' }, { name: 'FAQs', path: '/faq' }, { name: 'Shipping Policy', path: '/policies/shipping' }, { name: 'Return Policy', path: '/policies/returns' }, { name: 'Privacy Policy', path: '/policies/privacy' }].map(link => (
              <Link key={link.name} to={link.path} style={{ display: 'block', padding: '6px 0', fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', transition: 'color var(--transition-fast)' }}>{link.name}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', color: 'var(--color-gold)' }}>Visit Us</h4>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)', lineHeight: 2 }}>
              <p>📍 123 Jewellers Lane, Zaveri Bazaar</p>
              <p style={{ paddingLeft: '24px' }}>Mumbai, Maharashtra 400002</p>
              <p style={{ marginTop: '8px' }}>📞 +91 98765 43210</p>
              <p>📧 hello@goldsmithsjewels.com</p>
              <p style={{ marginTop: '8px' }}>🕐 Mon-Sat: 10:00 AM - 8:00 PM</p>
              <p style={{ paddingLeft: '24px' }}>Sun: 11:00 AM - 6:00 PM</p>
            </div>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 20px', background: '#25D366', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500, transition: 'transform var(--transition-fast)' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', padding: '40px 0', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { icon: '🔒', text: 'Secure Payments' },
            { icon: '✅', text: 'BIS Hallmarked' },
            { icon: '🚚', text: 'Insured Shipping' },
            { icon: '↩️', text: '15-Day Returns' },
            { icon: '📜', text: 'Certified Diamonds' },
          ].map(badge => (
            <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)' }}>
              <span style={{ fontSize: '18px' }}>{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>© 2026 goldsmiths Jewels. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {['Visa', 'MC', 'UPI', 'PayPal'].map(method => (
              <span key={method} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', fontSize: '10px', color: 'var(--color-gray-500)', fontWeight: 600 }}>{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
