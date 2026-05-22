import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import api from '../utils/api';

export default function Account() {
  const { user, login, register, logout, loading, error, updateProfile } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', currentPassword: '', password: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [addrForm, setAddrForm] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', postalCode: '', phone: '', isDefault: false });
  const [showAddrForm, setShowAddrForm] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (isLogin) { await login(form.email, form.password); }
      else { await register(form.name, form.email, form.password, form.phone); }
    } catch (err) { setFormError(err.message || 'Authentication failed'); }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', currentPassword: '', password: '' });
      if (activeTab === 'Orders') fetchOrders();
      if (activeTab === 'Addresses') fetchAddresses();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    try { setLoadingData(true); const res = await api.get('/orders/myorders'); setOrders(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoadingData(false); }
  };

  const fetchAddresses = async () => {
    try { setLoadingData(true); const res = await api.get('/addresses'); setAddresses(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoadingData(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profileForm);
      setProfileMsg('Profile updated!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) { setProfileMsg('Error: ' + (err.message || 'Unknown')); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try { await api.post('/addresses', addrForm); setShowAddrForm(false); setAddrForm({ firstName: '', lastName: '', street: '', city: '', state: '', postalCode: '', phone: '', isDefault: false }); fetchAddresses(); }
    catch (err) { alert('Error: ' + (err.message || 'Unknown')); }
  };

  const handleDeleteAddr = async (id) => {
    if (window.confirm('Delete address?')) {
      try { await api.delete(`/addresses/${id}`); fetchAddresses(); } catch (e) { console.error(e); }
    }
  };

  const statusColors = { Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#22c55e', Cancelled: '#ef4444' };
  const tabs = ['Dashboard', 'Orders', 'Wishlist', 'Addresses', 'Settings', ...(user?.role === 'Super Admin' || user?.role === 'Admin' ? ['Admin Panel'] : []), 'Logout'];

  if (user) return (
    <div>
      <div style={{ background: 'var(--color-gray-50)', padding: '40px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <div className="container"><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>My Account</h1></div>
      </div>
      <div className="container" style={{ padding: '48px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(item => (
              <button key={item} onClick={item === 'Logout' ? logout : item === 'Admin Panel' ? () => window.location.href = '/admin' : () => setActiveTab(item)} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-md)', background: activeTab === item ? 'var(--color-gold)' : item === 'Admin Panel' ? 'var(--color-charcoal)' : 'transparent', color: activeTab === item ? 'white' : item === 'Admin Panel' ? 'white' : item === 'Logout' ? 'var(--color-ruby)' : 'var(--color-gray-700)', border: 'none', cursor: 'pointer', fontWeight: 500, transition: 'all var(--transition-fast)' }}>
                {item}
              </button>
            ))}
          </nav>
          <div>
            {activeTab === 'Dashboard' && (
              <div>
                <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '32px' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '8px' }}>Welcome back, {user.name}!</h2>
                  <p style={{ color: 'var(--color-gray-500)' }}>Manage your orders, wishlist, and account settings.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[{ icon: '📦', label: 'Orders', value: orders.length || '—', tab: 'Orders' },
                    { icon: '❤️', label: 'Wishlist', link: '/wishlist' },
                    { icon: '📍', label: 'Addresses', value: addresses.length || '—', tab: 'Addresses' }
                  ].map(stat => (
                    <button key={stat.label} onClick={() => stat.tab ? setActiveTab(stat.tab) : stat.link && (window.location.href = stat.link)} style={{ padding: '24px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--color-gray-100)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '4px' }}>{stat.value || '→'}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Orders' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>My Orders</h2>
                {loadingData ? <p>Loading orders...</p> : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div><p style={{ color: 'var(--color-gray-500)' }}>No orders yet.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>Start Shopping</Link>
                  </div>
                ) : orders.map(o => (
                  <div key={o._id} style={{ border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div><span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>#{o._id?.slice(-8).toUpperCase()}</span><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginLeft: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</span></div>
                      <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, color: statusColors[o.orderStatus] || '#666', background: (statusColors[o.orderStatus] || '#666') + '15' }}>{o.orderStatus}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                      <span style={{ color: 'var(--color-gray-500)' }}>{o.orderItems?.length || 0} items</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(o.totalPrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Wishlist' && (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>❤️</div>
                <p style={{ marginBottom: '16px' }}>View and manage your saved items.</p>
                <Link to="/wishlist" className="btn btn-primary">Go to Wishlist</Link>
              </div>
            )}

            {activeTab === 'Addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>My Addresses</h2>
                  <button onClick={() => setShowAddrForm(true)} className="btn btn-primary btn-sm">+ Add Address</button>
                </div>
                {loadingData ? <p>Loading...</p> : addresses.length === 0 ? <p style={{ color: 'var(--color-gray-500)' }}>No saved addresses.</p> : addresses.map(a => (
                  <div key={a._id} style={{ border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '12px', position: 'relative' }}>
                    {a.isDefault && <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', background: 'var(--color-gold)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>Default</span>}
                    <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{a.firstName} {a.lastName}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{a.street}, {a.city}, {a.state} - {a.postalCode}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{a.phone}</p>
                    <button onClick={() => handleDeleteAddr(a._id)} style={{ marginTop: '8px', background: 'none', border: 'none', color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>Remove</button>
                  </div>
                ))}
                {showAddrForm && (
                  <form onSubmit={handleAddAddress} style={{ padding: '24px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', marginTop: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group"><label className="form-label">First Name</label><input value={addrForm.firstName} onChange={e => setAddrForm(p => ({ ...p, firstName: e.target.value }))} className="form-input" required /></div>
                      <div className="form-group"><label className="form-label">Last Name</label><input value={addrForm.lastName} onChange={e => setAddrForm(p => ({ ...p, lastName: e.target.value }))} className="form-input" required /></div>
                      <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Street</label><input value={addrForm.street} onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))} className="form-input" required /></div>
                      <div className="form-group"><label className="form-label">City</label><input value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} className="form-input" required /></div>
                      <div className="form-group"><label className="form-label">State</label><input value={addrForm.state} onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} className="form-input" required /></div>
                      <div className="form-group"><label className="form-label">Postal Code</label><input value={addrForm.postalCode} onChange={e => setAddrForm(p => ({ ...p, postalCode: e.target.value }))} className="form-input" required /></div>
                      <div className="form-group"><label className="form-label">Phone</label><input value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} className="form-input" required /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button type="button" onClick={() => setShowAddrForm(false)} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Address</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'Settings' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Account Settings</h2>
                {profileMsg && <div style={{ padding: '12px', background: profileMsg.includes('Error') ? 'rgba(220,53,69,0.1)' : 'rgba(45,106,79,0.1)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: 'var(--text-sm)', color: profileMsg.includes('Error') ? 'var(--color-ruby)' : 'var(--color-success)' }}>{profileMsg}</div>}
                <form onSubmit={handleProfileUpdate} style={{ maxWidth: '500px' }}>
                  <div className="form-group"><label className="form-label">Full Name</label><input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Email</label><input value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} className="form-input" type="email" /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="form-input" /></div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: '24px 0 12px', color: 'var(--color-gray-600)' }}>Change Password</h4>
                  <div className="form-group"><label className="form-label">Current Password</label><input value={profileForm.currentPassword} onChange={e => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))} className="form-input" type="password" /></div>
                  <div className="form-group"><label className="form-label">New Password</label><input value={profileForm.password} onChange={e => setProfileForm(p => ({ ...p, password: e.target.value }))} className="form-input" type="password" /></div>
                  <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>Update Profile</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .container > div[style*="250px 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--color-white)', borderRadius: 'var(--radius-2xl)', padding: '48px', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>GOLDSMITHS</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '16px' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>{isLogin ? 'Sign in to your account' : 'Join the goldsmiths family'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {formError && <div style={{ padding: '12px', background: 'var(--color-ruby)15', color: 'var(--color-ruby)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: 'var(--text-sm)' }}>{formError}</div>}
          {!isLogin && <div className="form-group"><label className="form-label">Full Name</label><input name="name" value={form.name} onChange={handleChange} className="form-input" required /></div>}
          {!isLogin && <div className="form-group"><label className="form-label">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="form-input" required /></div>}
          <div className="form-group"><label className="form-label">Email Address</label><input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" required /></div>
          <div className="form-group"><label className="form-label">Password</label><input name="password" type="password" value={form.password} onChange={handleChange} className="form-input" required /></div>
          {isLogin && <div style={{ textAlign: 'right', marginBottom: '16px' }}><a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)' }}>Forgot password?</a></div>}
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--color-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>{isLogin ? 'Sign Up' : 'Sign In'}</button>
        </p>
      </div>
    </div>
  );
}
