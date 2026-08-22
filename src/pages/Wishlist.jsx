import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopBg from '../../images/shopbg.png';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products, categories } from '../data/products';
import { getMediaUrl, getProductImage } from '../utils/api';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [addedItems, setAddedItems] = useState({});
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [salonModalItem, setSalonModalItem] = useState(null);
  const [salonForm, setSalonForm] = useState({ name: '', phone: '', date: '', time: '14:00' });
  const [salonBooked, setSalonBooked] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Valuation calculation
  const totalValuation = wishlistItems.reduce((acc, p) => acc + (p.price || 0), 0);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product._id || product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product._id || product.id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item, 1);
    });
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 3000);
  };

  const handleShareVault = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSalonSubmit = (e) => {
    e.preventDefault();
    setSalonBooked(true);
    setTimeout(() => {
      setSalonBooked(false);
      setSalonModalItem(null);
      setSalonForm({ name: '', phone: '', date: '', time: '14:00' });
    }, 2500);
  };

  // Complementary recommendations
  const savedIds = new Set(wishlistItems.map(p => String(p._id || p.id)));
  const complementaryItems = products.filter(p => !savedIds.has(String(p.id))).slice(0, 4);

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
      <div className="glass-floating-wishlist-pill" onMouseMove={handleMouseMove}>
        <span className="glass-floating-shop-text">
          MY WISHLIST
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
                Bespoke Portfolio Vault
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Your Personal Vault
              </h1>
              <p style={{
                fontSize: '15px',
                color: 'rgba(26,26,26,0.65)',
                maxWidth: '560px',
                margin: '10px auto 0',
                fontFamily: 'var(--font-body)'
              }}>
                Curate, compare, and reserve your favorite 22K gold, diamond, and bridal solitaire masterpieces.
              </p>
            </div>

            {wishlistItems.length === 0 ? (
              /* Empty Vault State */
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
                    💎
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-charcoal)' }}>
                    Your Vault is Currently Empty
                  </h2>
                  <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                    Save pieces you fall in love with to easily compare designs, request VIP salon appointments, or move to your shopping bag.
                  </p>

                  {/* Quick Category Navigation Tags */}
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
                    Explore Masterpiece Collection →
                  </Link>
                </div>
              </div>
            ) : (
              /* Vault Main Content */
              <>
                {/* Vault Analytics & Quick Actions Bar */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  borderRadius: '24px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.06), 0 6px 18px rgba(201,168,76,0.1)',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  {/* Metric Statistics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.5)', fontWeight: 600 }}>Saved Masterpieces</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-charcoal)', fontFamily: 'var(--font-display)' }}>{wishlistItems.length} Items</div>
                    </div>
                    <div style={{ width: '1px', height: '32px', background: 'rgba(0,0,0,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.5)', fontWeight: 600 }}>Portfolio Valuation</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-gold-dark)', fontFamily: 'var(--font-display)' }}>{formatPrice(totalValuation)}</div>
                    </div>
                    <div style={{ width: '1px', height: '32px', background: 'rgba(0,0,0,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.5)', fontWeight: 600 }}>Certification</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span>✓</span> 100% BIS Hallmarked
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleShareVault}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '16px',
                        border: '1px solid rgba(188, 156, 108, 0.35)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--color-charcoal)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>📜</span> {copiedLink ? 'Link Copied!' : 'Share Vault'}
                    </button>

                    <button
                      onClick={handleAddAllToCart}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)',
                        color: 'var(--color-gold)',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🛍️</span> {batchSuccess ? 'All Items Added!' : 'Add All to Shopping Bag'}
                    </button>
                  </div>
                </div>

                {/* Saved Items Liquid Glass Grid */}
                <div className="wishlist-product-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '24px'
                }}>
                  {wishlistItems.map(product => {
                    const pId = product._id || product.id;
                    const rawImg = getProductImage(product);
                    const pImg = rawImg ? getMediaUrl(rawImg) : null;

                    return (
                      <div
                        key={pId}
                        style={{
                          background: 'rgba(255, 255, 255, 0.82)',
                          backdropFilter: 'blur(20px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                          borderRadius: '24px',
                          border: '1.5px solid rgba(255, 255, 255, 0.95)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.06), 0 4px 16px rgba(201,168,76,0.08)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }}
                      >
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromWishlist(pId)}
                          style={{
                            position: 'absolute',
                            top: '14px',
                            right: '14px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: 'rgba(26,26,26,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                          }}
                          aria-label="Remove item"
                        >
                          ✕
                        </button>

                        {/* Image Header */}
                        <div
                          onClick={() => navigate(`/product/${product.slug}`)}
                          style={{
                            height: '240px',
                            background: 'rgba(245,242,236,0.7)',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer'
                          }}
                        >
                          {pImg ? (
                            <img
                              src={pImg}
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px' }}>
                              💎
                            </div>
                          )}
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.88)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-gold-dark)'
                          }}>
                            {product.metal || '22K Gold'}
                          </div>
                        </div>

                        {/* Details Body */}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.45)', fontWeight: 600, marginBottom: '4px' }}>
                            {product.category}
                          </div>
                          <h3
                            onClick={() => navigate(`/product/${product.slug}`)}
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '17px',
                              fontWeight: 700,
                              margin: '0 0 8px',
                              color: 'var(--color-charcoal)',
                              cursor: 'pointer',
                              lineHeight: 1.3
                            }}
                          >
                            {product.name}
                          </h3>

                          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-gold-dark)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
                            {formatPrice(product.price)}
                          </div>

                          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                              onClick={() => handleMoveToCart(product)}
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '14px',
                                border: 'none',
                                background: addedItems[pId] ? '#10B981' : 'var(--color-charcoal)',
                                color: '#FFF',
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <span>🛍️</span> {addedItems[pId] ? 'Added to Bag!' : 'Move to Shopping Bag'}
                            </button>

                            <button
                              onClick={() => setSalonModalItem(product)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '14px',
                                border: '1px solid rgba(188, 156, 108, 0.4)',
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: 'var(--color-gold-dark)',
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                cursor: 'pointer'
                              }}
                            >
                              Book VIP Salon Try-On 📅
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Personal Stylist & Complementary Pairings Tray */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  borderRadius: '32px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.06), 0 8px 24px rgba(201,168,76,0.1)',
                  padding: '36px'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', marginBottom: '6px' }}>
                      Curated Ensemble Recommendations
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>
                      Pieces That Complement Your Vault Selection
                    </h2>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '20px'
                  }}>
                    {complementaryItems.map(p => {
                      const rawImg = getProductImage(p);
                      const pImg = rawImg ? getMediaUrl(rawImg) : null;
                      return (
                        <div
                          key={p.id}
                          onClick={() => navigate(`/product/${p.slug}`)}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '20px',
                            border: '1px solid rgba(188, 156, 108, 0.25)',
                            padding: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ width: '100%', height: '140px', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px', background: 'rgba(245,242,236,0.6)' }}>
                            {pImg ? <img src={pImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '32px' }}>💎</div>}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '4px' }}>{p.name}</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-dark)' }}>{formatPrice(p.price)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Salon Booking Modal */}
      {salonModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3000,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFF',
            borderRadius: '28px',
            padding: '36px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSalonModalItem(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: 'rgba(0,0,0,0.5)' }}
            >
              ✕
            </button>

            {salonBooked ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', margin: '0 0 8px' }}>Salon Appointment Confirmed!</h3>
                <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '13px' }}>
                  Our Concierge desk look forward to hosting you for trying on <strong>{salonModalItem.name}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSalonSubmit}>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', marginBottom: '4px' }}>
                  Flagship Salon Reservation
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-charcoal)' }}>
                  Book Private Try-On Session
                </h3>
                <div style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', marginBottom: '20px' }}>
                  Reserving: <strong>{salonModalItem.name}</strong> ({formatPrice(salonModalItem.price)})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={salonForm.name}
                    onChange={(e) => setSalonForm({ ...salonForm, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={salonForm.phone}
                    onChange={(e) => setSalonForm({ ...salonForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="date"
                      required
                      value={salonForm.date}
                      onChange={(e) => setSalonForm({ ...salonForm, date: e.target.value })}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', outline: 'none' }}
                    />
                    <select
                      value={salonForm.time}
                      onChange={(e) => setSalonForm({ ...salonForm, time: e.target.value })}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'var(--color-charcoal)',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Salon Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
