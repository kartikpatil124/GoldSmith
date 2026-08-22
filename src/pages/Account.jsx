import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopBg from '../../images/shopbg.png';
import { useAuth } from '../context/AuthContext';
import api, { getMediaUrl } from '../utils/api';
import { socket, joinUserRoom } from '../utils/socketClient';

export default function Account() {
  const {
    user,
    setUser,
    login,
    register,
    logout,
    googleLogin,
    appleLogin,
    forgotPassword,
    resetPassword,
    loading,
    error
  } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = user ? (user.avatar?.url || (typeof user.avatar === 'string' ? user.avatar : '') || user.googleAvatarUrl || '') : '';

  // Auth UI view states: 'login' | 'signup' | 'forgot' | 'reset'
  const [view, setView] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [resetForm, setResetForm] = useState({ password: '', confirmPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mouse position physics for liquid glass lens orb
  const [mousePos, setMousePos] = useState({ x: 120, y: 120 });

  // Dashboard states
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [inquiries, setInquiries] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Inquiry edit states
  const [editingInquiryId, setEditingInquiryId] = useState(null);
  const [editInquiryForm, setEditInquiryForm] = useState({ message: '', preferredContactMethod: 'WhatsApp', budgetRange: '' });
  
  // Profile settings states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', currentPassword: '', password: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Address form states
  const [addrForm, setAddrForm] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', postalCode: '', phone: '', isDefault: false });
  const [showAddrForm, setShowAddrForm] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Check URL parameters for reset token or active tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setView('reset');
    }
    const tabParam = params.get('tab');
    if (tabParam === 'orders' || tabParam === 'inquiries') {
      setActiveTab('Inquiries');
    } else if (tabParam === 'settings') {
      setActiveTab('Settings');
    }
  }, []);

  // Sync profile form once user is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        password: ''
      });
    }
    if (user) {
      fetchInquiries();
    }
    if (user && activeTab === 'Addresses') fetchAddresses();
  }, [user, activeTab]);

  // Socket.IO: Join user room and listen for real-time inquiry events
  useEffect(() => {
    if (!user?._id) return;

    joinUserRoom(user._id);

    const handleInquiryEvent = () => {
      fetchInquiries();
    };

    socket.on('inquiry:created', handleInquiryEvent);
    socket.on('inquiry:updated', handleInquiryEvent);
    socket.on('inquiry:deleted', handleInquiryEvent);

    return () => {
      socket.off('inquiry:created', handleInquiryEvent);
      socket.off('inquiry:updated', handleInquiryEvent);
      socket.off('inquiry:deleted', handleInquiryEvent);
    };
  }, [user]);

  // Handle Google OAuth Response
  const handleGoogleCredentialResponse = async (response) => {
    setFormError('');
    setFormSuccess('');
    try {
      if (response && response.credential) {
        await googleLogin({ idToken: response.credential });
        setFormSuccess('Successfully authenticated with Google!');
      } else {
        throw new Error('No credential returned from Google Identity Services.');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setFormError(err.message || 'Google Sign-In failed.');
    }
  };

  // Initialize Google Sign-In SDK
  useEffect(() => {
    if (!user && (view === 'login' || view === 'signup')) {
      const initGoogle = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: '1082735495934-0gph500c1682ehn681mihnpsvf44ugkf.apps.googleusercontent.com',
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          
          const container = document.getElementById('googleSignInButton');
          if (container) {
            window.google.accounts.id.renderButton(
              container,
              { 
                theme: 'outline', 
                size: 'large', 
                width: 160,
                shape: 'pill',
                text: 'continue_with'
              }
            );
          }
        }
      };

      initGoogle();
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(interval);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [view, user]);

  // Handle Apple Sign-In
  const handleAppleSignIn = async () => {
    setFormError('');
    setFormSuccess('');
    try {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.goldsmithsjewels.auth.service',
          scope: 'name email',
          redirectURI: window.location.origin + '/account',
          state: 'goldsmiths-apple-login',
          usePopup: true
        });

        const response = await window.AppleID.auth.signIn();
        if (response && response.authorization) {
          const payload = {
            identityToken: response.authorization.id_token,
            appleId: response.user?.email || 'apple_user',
            name: response.user?.name ? `${response.user.name.firstName || ''} ${response.user.name.lastName || ''}`.trim() : 'Apple User'
          };
          await appleLogin(payload);
          setFormSuccess('Successfully authenticated with Apple!');
        }
      } else {
        throw new Error('Apple Sign-In SDK is currently loading. Please try again.');
      }
    } catch (err) {
      console.error('Apple Sign-In Error:', err);
      setFormError(err.message || 'Apple Sign-In failed. Apple credentials must be configured.');
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      if (view === 'login') {
        await login(form.email, form.password);
        setFormSuccess('Logged in successfully!');
      } else {
        if (form.password.length < 6) {
          return setFormError('Password must be at least 6 characters.');
        }
        await register(form.name, form.email, form.password, form.phone);
        setFormSuccess('Account created successfully!');
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      const res = await forgotPassword(forgotEmail);
      setFormSuccess(res.message || 'Reset token generated! Check email or console.');
    } catch (err) {
      setFormError(err.message || 'Error requesting reset.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    if (resetForm.password !== resetForm.confirmPassword) {
      return setFormError('Passwords do not match.');
    }
    if (resetForm.password.length < 6) {
      return setFormError('Password must be at least 6 characters.');
    }

    try {
      const res = await resetPassword(resetToken, resetForm.password);
      setFormSuccess(res.message || 'Your password was successfully updated!');
      setTimeout(() => {
        setView('login');
        setResetToken('');
        setResetForm({ password: '', confirmPassword: '' });
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3000);
    } catch (err) {
      setFormError(err.message || 'Reset token is invalid or expired.');
    }
  };

  const fetchInquiries = async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const res = await api.get('/me/inquiries');
      const data = res.data || res || [];
      setInquiries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
      setInquiries([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenEditInquiry = (inq) => {
    const id = inq._id || inq.inquiryId;
    setEditingInquiryId(id);
    setEditInquiryForm({
      message: inq.message || '',
      preferredContactMethod: inq.preferredContactMethod || 'WhatsApp',
      budgetRange: inq.budgetRange || ''
    });
  };

  const handleSaveEditInquiry = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/inquiries/${id}`, editInquiryForm);
      await fetchInquiries();
    } catch (err) {
      console.error('Failed to update inquiry:', err);
    }
    setEditingInquiryId(null);
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Are you sure you want to cancel and delete this consultation inquiry?')) {
      try {
        await api.delete(`/inquiries/${id}`);
        await fetchInquiries();
      } catch (err) {
        console.error('Failed to delete inquiry:', err);
      }
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingData(true);
      const res = await api.get('/addresses');
      setAddresses(res.data || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const updateData = { name: profileForm.name, phone: profileForm.phone };
      if (profileForm.password && profileForm.password.trim() !== '') {
        if (!profileForm.currentPassword || profileForm.currentPassword.trim() === '') {
          setProfileMsg('✕ Error: Current password is required to set a new password.');
          return;
        }
        updateData.password = profileForm.password;
        updateData.currentPassword = profileForm.currentPassword;
      }

      const res = await api.put('/auth/profile', updateData);
      if (res.success && res.data) {
        const updatedUser = { ...user, ...res.data };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setProfileMsg('✓ Profile settings updated successfully!');
        setProfileForm(prev => ({ ...prev, currentPassword: '', password: '' }));
      } else {
        setProfileMsg('✓ Profile settings updated successfully!');
      }
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err) {
      setProfileMsg('✕ Error: ' + (err.message || 'Verification failed'));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileMsg('');
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setProfileMsg('✕ Error: Invalid file type. Allowed formats: JPG, JPEG, PNG, WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg('✕ Error: File too large. Profile photos must not exceed 2MB in size.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.put('/auth/avatar', formData);
      if (res.success && res.data) {
        const updatedUser = { ...user, avatar: res.data.avatar };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setProfileMsg('✓ Profile photo updated successfully!');
      } else {
        setProfileMsg(`✕ Error: ${res.message || 'Upload failed'}`);
      }
    } catch (err) {
      setProfileMsg(`✕ Error uploading avatar: ${err.message || 'Server error'}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAvatarRemove = async () => {
    if (!window.confirm('Are you sure you want to permanently remove your profile photograph?')) return;
    setProfileMsg('');
    try {
      setUploading(true);
      const res = await api.delete('/auth/avatar');
      if (res.success && res.data) {
        const updatedUser = { ...user, avatar: res.data.avatar };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setProfileMsg('✓ Profile photo removed successfully!');
      } else {
        setProfileMsg(`✕ Error: ${res.message || 'Removal failed'}`);
      }
    } catch (err) {
      setProfileMsg(`✕ Error removing avatar: ${err.message || 'Server error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', addrForm);
      setShowAddrForm(false);
      setAddrForm({ firstName: '', lastName: '', street: '', city: '', state: '', postalCode: '', phone: '', isDefault: false });
      fetchAddresses();
    } catch (err) {
      alert('Error saving address: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteAddr = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/addresses/${id}`);
        fetchAddresses();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const tabs = ['Dashboard', 'Inquiries', 'Wishlist', 'Addresses', 'Settings', ...(user?.role === 'Super Admin' || user?.role === 'Admin' ? ['Admin Panel'] : []), 'Logout'];

  return (
    <div 
      className="shop-page-wrapper"
      onMouseMove={handleMouseMove}
      style={{ 
        backgroundImage: `url(${shopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >


      {/* Big Liquid Glass Box in Center with Internal Scroll */}
      <div className="glass-big-center-box-container">
        <div className="glass-big-center-box">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '120px' }}>

            {user ? (
              /* ==================== AUTHENTICATED USER DASHBOARD ==================== */
              <div>
                {/* Header Profile Banner */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  borderRadius: '28px',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.06), 0 8px 24px rgba(201,168,76,0.1)',
                  padding: '28px 36px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {avatarUrl ? (
                      <img src={getMediaUrl(avatarUrl)} alt={user.name || user.fullName} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-gold)' }} />
                    ) : (
                      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, border: '3px solid var(--color-gold)' }}>
                        {(user.name || user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>
                        Welcome, {user.name || user.fullName || 'Valued Client'}
                      </h2>
                      <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '13px', margin: '4px 0 0' }}>
                        {user.email} | Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {user.authProvider && user.authProvider !== 'local' && (
                    <span style={{ fontSize: '12px', background: 'rgba(188, 156, 108, 0.15)', color: 'var(--color-gold-dark)', padding: '6px 16px', borderRadius: '20px', fontWeight: 600, border: '1px solid rgba(188, 156, 108, 0.3)' }}>
                      Authenticated with {user.authProvider.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Main Dashboard Layout Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px' }} className="account-grid">
                  {/* Sidebar Navigation */}
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="account-sidebar">
                    {tabs.map(item => (
                      <button
                        key={item}
                        onClick={item === 'Logout' ? logout : item === 'Admin Panel' ? () => navigate('/admin') : () => setActiveTab(item)}
                        style={{
                          padding: '14px 20px',
                          textAlign: 'left',
                          fontSize: '13px',
                          borderRadius: '16px',
                          background: activeTab === item ? 'var(--color-charcoal)' : item === 'Admin Panel' ? 'var(--color-gold)' : 'rgba(255,255,255,0.8)',
                          color: activeTab === item ? '#FFF' : item === 'Admin Panel' ? '#FFF' : item === 'Logout' ? 'var(--color-ruby)' : 'var(--color-charcoal)',
                          border: activeTab === item ? 'none' : '1px solid rgba(255,255,255,0.9)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                          boxShadow: activeTab === item ? '0 8px 20px rgba(0,0,0,0.15)' : 'none'
                        }}
                      >
                        {item === 'Dashboard' && '👤 '}
                        {item === 'Inquiries' && '✉️ '}
                        {item === 'Wishlist' && '❤️ '}
                        {item === 'Addresses' && '📍 '}
                        {item === 'Settings' && '⚙️ '}
                        {item === 'Admin Panel' && '👑 '}
                        {item === 'Logout' && '🚪 '}
                        {item}
                      </button>
                    ))}
                  </nav>

                  {/* Content Window */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    borderRadius: '28px',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                    padding: '32px'
                  }}>
                    {activeTab === 'Dashboard' && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: '0 0 20px', color: 'var(--color-charcoal)' }}>
                          Privilege Overview
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="stats-grid">
                          {[
                            { icon: '✉️', label: 'My Inquiries', value: inquiries.length || '—', tab: 'Inquiries' },
                            { icon: '❤️', label: 'Vault Wishlist', link: '/wishlist' },
                            { icon: '📍', label: 'Saved Addresses', value: addresses.length || '—', tab: 'Addresses' }
                          ].map(stat => (
                            <button
                              key={stat.label}
                              onClick={() => stat.tab ? setActiveTab(stat.tab) : stat.link && navigate(stat.link)}
                              style={{
                                padding: '24px 16px',
                                background: 'rgba(255,255,255,0.9)',
                                borderRadius: '20px',
                                textAlign: 'center',
                                border: '1px solid rgba(188, 156, 108, 0.25)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '4px' }}>{stat.value || '→'}</div>
                              <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{stat.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Inquiries' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>
                            My Consultation Inquiries ({inquiries.length})
                          </h3>
                          <Link to="/shop" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-dark)', textDecoration: 'none' }}>
                            + Request New Consultation →
                          </Link>
                        </div>

                        {loadingData ? <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)' }}>Loading inquiries...</p> : inquiries.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: '20px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✉️</div>
                            <p style={{ color: 'rgba(26,26,26,0.6)', marginBottom: '20px', fontSize: '14px' }}>You haven't submitted any consultation inquiries yet.</p>
                            <Link to="/shop" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '9999px', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                              Explore Fine Collections →
                            </Link>
                          </div>
                        ) : inquiries.map(i => {
                          const inqId = i._id || i.inquiryId;
                          const isEditing = editingInquiryId === inqId;

                          return (
                            <div key={inqId} style={{ border: '1px solid rgba(188, 156, 108, 0.25)', borderRadius: '20px', padding: '24px', marginBottom: '20px', background: 'rgba(255,255,255,0.92)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                              
                              {/* Header Row: ID, Date, Status */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                <div>
                                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-charcoal)', letterSpacing: '0.04em' }}>INQUIRY #{i.inquiryId || inqId}</span>
                                  <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.4)', marginLeft: '12px' }}>
                                    {i.createdAt ? new Date(i.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently Submitted'}
                                  </span>
                                </div>
                                <span style={{ 
                                  padding: '5px 14px', 
                                  borderRadius: '12px', 
                                  fontSize: '11px', 
                                  fontWeight: 700, 
                                  color: i.status === 'new' || i.status === 'Under Review' ? '#3b82f6' : i.status === 'quoted' || i.status === 'customization sent' ? '#10b981' : '#f59e0b', 
                                  background: (i.status === 'new' || i.status === 'Under Review' ? '#3b82f6' : i.status === 'quoted' || i.status === 'customization sent' ? '#10b981' : '#f59e0b') + '18', 
                                  textTransform: 'uppercase', 
                                  letterSpacing: '0.06em' 
                                }}>{i.status || 'Under Review'}</span>
                              </div>

                              {/* Product Info */}
                              <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'center' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #F8F5F0 0%, #EFE8DC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, border: '1px solid rgba(201,168,76,0.2)' }}>💎</div>
                                <div>
                                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-charcoal)', margin: 0 }}>{i.productName || 'Bespoke Fine Jewellery'}</h4>
                                  <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '3px 0 0' }}>
                                    Type: <strong>{i.inquiryType || 'Price Inquiry'}</strong> | Channel: <strong>{i.preferredContactMethod || 'WhatsApp'}</strong> {i.budgetRange ? `| Budget: ${i.budgetRange}` : ''}
                                  </p>
                                </div>
                              </div>

                              {/* Edit Form OR View Message */}
                              {isEditing ? (
                                <form onSubmit={(e) => handleSaveEditInquiry(e, inqId)} style={{ background: 'rgba(188, 156, 108, 0.08)', padding: '16px', borderRadius: '16px', marginBottom: '14px', border: '1px solid rgba(188, 156, 108, 0.25)' }}>
                                  <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                                      Update Message / Instructions:
                                    </label>
                                    <textarea
                                      value={editInquiryForm.message}
                                      onChange={(e) => setEditInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                                      rows={3}
                                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                      required
                                    />
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                    <div>
                                      <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                                        Preferred Channel:
                                      </label>
                                      <select
                                        value={editInquiryForm.preferredContactMethod}
                                        onChange={(e) => setEditInquiryForm(prev => ({ ...prev, preferredContactMethod: e.target.value }))}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px' }}
                                      >
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Phone Call">Phone Call</option>
                                        <option value="Email">Email</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                                        Target Budget:
                                      </label>
                                      <input
                                        type="text"
                                        value={editInquiryForm.budgetRange}
                                        onChange={(e) => setEditInquiryForm(prev => ({ ...prev, budgetRange: e.target.value }))}
                                        placeholder="e.g. ₹1,50,000 - ₹3,00,000"
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }}
                                      />
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                      type="button"
                                      onClick={() => setEditingInquiryId(null)}
                                      style={{ padding: '8px 16px', borderRadius: '9999px', border: '1px solid rgba(0,0,0,0.15)', background: '#FFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      style={{ padding: '8px 20px', borderRadius: '9999px', border: 'none', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      Save Changes
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <div style={{ background: 'rgba(0,0,0,0.03)', padding: '14px 16px', borderRadius: '14px', fontSize: '12px', color: 'rgba(26,26,26,0.75)', marginBottom: '14px', lineHeight: 1.5 }}>
                                  <strong>Submitted Message:</strong> {i.message}
                                </div>
                              )}

                              {i.adminResponse ? (
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '12px', marginBottom: '14px' }}>
                                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold-dark)', fontWeight: 700, marginBottom: '4px' }}>Expert Consultant Response</div>
                                  <div style={{ fontSize: '12px', color: 'var(--color-charcoal)', lineHeight: 1.5, background: 'rgba(188, 156, 108, 0.08)', padding: '12px 14px', borderRadius: '12px', borderLeft: '3px solid var(--color-gold)' }}>
                                    {i.adminResponse}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontSize: '11px', color: 'rgba(26,26,26,0.45)', marginBottom: '14px' }}>
                                  ⏳ Awaiting response from our senior jewellery design team.
                                </div>
                              )}

                              {/* Action Row: Edit, Delete, WhatsApp */}
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '14px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button
                                    onClick={() => handleOpenEditInquiry(i)}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: '9999px',
                                      border: '1px solid rgba(26,26,26,0.2)',
                                      background: 'rgba(255,255,255,0.9)',
                                      color: 'var(--color-charcoal)',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    ✏️ Edit Inquiry
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInquiry(inqId)}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: '9999px',
                                      border: '1px solid rgba(220, 38, 38, 0.3)',
                                      background: 'rgba(254, 226, 226, 0.5)',
                                      color: '#DC2626',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>

                                <a
                                  href={`https://wa.me/919106251842?text=${encodeURIComponent(`Hello Goldsmiths Jewels, I am checking on my Consultation Inquiry #${i.inquiryId || inqId} for ${i.productName}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '8px 16px',
                                    borderRadius: '9999px',
                                    background: 'rgba(37, 211, 102, 0.12)',
                                    border: '1px solid rgba(37, 211, 102, 0.35)',
                                    color: '#128C7E',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  💬 WhatsApp Desk
                                </a>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeTab === 'Wishlist' && (
                      <div style={{ textAlign: 'center', padding: '48px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: '20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>❤️</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>Your Vault Wishlist</h3>
                        <p style={{ color: 'rgba(26,26,26,0.6)', marginBottom: '20px', fontSize: '13px' }}>View and manage your saved masterpieces anytime.</p>
                        <Link to="/wishlist" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '9999px', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                          Open Vault Panel →
                        </Link>
                      </div>
                    )}

                    {activeTab === 'Addresses' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>Saved Shipping Addresses</h3>
                          <button onClick={() => setShowAddrForm(true)} style={{ padding: '8px 16px', borderRadius: '14px', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add Address</button>
                        </div>

                        {loadingData ? <p>Loading address book...</p> : addresses.length === 0 ? <p style={{ color: 'rgba(26,26,26,0.5)', fontSize: '13px' }}>No saved delivery addresses yet.</p> : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                            {addresses.map(a => (
                              <div key={a._id} style={{ border: '1px solid rgba(188, 156, 108, 0.3)', borderRadius: '16px', padding: '18px', position: 'relative', background: 'rgba(255,255,255,0.9)' }}>
                                {a.isDefault && <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', background: 'var(--color-gold)', color: 'white', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>Default</span>}
                                <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-charcoal)', margin: '0 0 6px' }}>{a.firstName} {a.lastName}</p>
                                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', margin: 0, lineHeight: 1.4 }}>{a.street}</p>
                                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', margin: 0 }}>{a.city}, {a.state} - {a.postalCode}</p>
                                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', marginTop: '6px', fontWeight: 600 }}>📞 {a.phone}</p>
                                <button onClick={() => handleDeleteAddr(a._id)} style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--color-ruby)', fontSize: '11px', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Remove Address</button>
                              </div>
                            ))}
                          </div>
                        )}

                        {showAddrForm && (
                          <form onSubmit={handleAddAddress} style={{ padding: '24px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', marginTop: '20px', border: '1px solid rgba(188, 156, 108, 0.3)' }}>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>Add Shipping Address</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div><label style={{ fontSize: '11px', fontWeight: 600 }}>First Name</label><input value={addrForm.firstName} onChange={e => setAddrForm(p => ({ ...p, firstName: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                              <div><label style={{ fontSize: '11px', fontWeight: 600 }}>Last Name</label><input value={addrForm.lastName} onChange={e => setAddrForm(p => ({ ...p, lastName: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                              <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '11px', fontWeight: 600 }}>Street / Area</label><input value={addrForm.street} onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                              <div><label style={{ fontSize: '11px', fontWeight: 600 }}>City</label><input value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                              <div><label style={{ fontSize: '11px', fontWeight: 600 }}>State</label><input value={addrForm.state} onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                              <div><label style={{ fontSize: '11px', fontWeight: 600 }}>Postal Code</label><input value={addrForm.postalCode} onChange={e => setAddrForm(p => ({ ...p, postalCode: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                              <div><label style={{ fontSize: '11px', fontWeight: 600 }}>Phone</label><input value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', boxSizing: 'border-box' }} required /></div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                              <button type="button" onClick={() => setShowAddrForm(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.2)', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                              <button type="submit" style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'var(--color-charcoal)', color: '#FFF', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Save Address</button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    {activeTab === 'Settings' && (
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: '0 0 20px', color: 'var(--color-charcoal)' }}>
                          Account & Profile Settings
                        </h3>

                        {/* Profile Photo Editor */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', border: '1px solid rgba(188, 156, 108, 0.3)', marginBottom: '24px' }}>
                          <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
                            {avatarUrl ? (
                              <img src={getMediaUrl(avatarUrl)} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--color-charcoal)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700 }}>
                                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px' }}>Profile Photograph</h4>
                            <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)', margin: '0 0 10px' }}>Formats: JPG, PNG, WebP. Max size: 2MB.</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button type="button" onClick={() => document.getElementById('avatarFileInput').click()} style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--color-gold)', background: 'transparent', color: 'var(--color-gold-dark)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                                Upload Photo
                              </button>
                              {user.avatar?.url && (
                                <button type="button" onClick={handleAvatarRemove} style={{ padding: '6px 14px', borderRadius: '10px', border: 'none', background: 'transparent', color: 'var(--color-ruby)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                  Remove
                                </button>
                              )}
                            </div>
                            <input type="file" id="avatarFileInput" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                          </div>
                        </div>

                        {profileMsg && (
                          <div style={{ padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', color: profileMsg.includes('Error') ? 'var(--color-ruby)' : '#10B981', background: profileMsg.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
                            {profileMsg}
                          </div>
                        )}

                        <form onSubmit={handleProfileUpdate} style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Full Name</label><input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }} /></div>
                          <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Email Address (Locked)</label><input value={profileForm.email} disabled style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.04)', fontSize: '13px', boxSizing: 'border-box' }} /></div>
                          <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Phone Number</label><input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }} /></div>
                          
                          {user.authProvider === 'local' && (
                            <>
                              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,26,26,0.4)', marginTop: '12px' }}>Security — Update Password</div>
                              <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Current Password</label><input type="password" value={profileForm.currentPassword} onChange={e => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }} /></div>
                              <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>New Password</label><input type="password" value={profileForm.password} onChange={e => setProfileForm(p => ({ ...p, password: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '13px', boxSizing: 'border-box' }} /></div>
                            </>
                          )}

                          <button type="submit" style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}>
                            Update Profile Settings
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ==================== LOGGED OUT: FIGMA LIQUID GLASS LOGIN PATTERN ==================== */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center', minHeight: '560px', position: 'relative' }} className="account-split-container">
                
                {/* LEFT COLUMN: FIGMA BRANDING & HERO TYPOGRAPHY */}
                <div style={{
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  zIndex: 10
                }}>
                  <div style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-dark)',
                    marginBottom: '10px'
                  }}>
                    GOLDSMITHS JEWELS
                  </div>

                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.8rem, 4vw, 4.2rem)',
                    fontWeight: 700,
                    color: 'var(--color-charcoal)',
                    margin: '0 0 8px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em'
                  }}>
                    Hello there
                  </h1>

                  <div style={{
                    fontSize: 'clamp(1.4rem, 2vw, 2rem)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    color: 'rgba(26,26,26,0.7)',
                    marginBottom: '32px'
                  }}>
                    Privilege Vault Portal
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(26,26,26,0.6)',
                    lineHeight: 1.6,
                    maxWidth: '420px',
                    margin: 0
                  }}>
                    Experience ultra-refractive liquid glass luxury. Access bespoke pricing, reserve private salon try-ons, and consult with Senior Master Goldsmiths.
                  </p>
                </div>

                {/* RIGHT COLUMN: FIGMA LIQUID GLASS FORM CARD */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(35px) saturate(220%)',
                  WebkitBackdropFilter: 'blur(35px) saturate(220%)',
                  borderRadius: '36px',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.08), 0 10px 30px rgba(201,168,76,0.15), inset 0 1.5px 2px rgba(255,255,255,0.95)',
                  padding: '40px 36px',
                  zIndex: 10,
                  boxSizing: 'border-box'
                }}>
                  {/* Segmented Glass Pill View Switcher */}
                  <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.04)',
                    padding: '4px',
                    borderRadius: '9999px',
                    marginBottom: '28px',
                    border: '1px solid rgba(255,255,255,0.6)'
                  }}>
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: view === 'login' ? '#FFF' : 'transparent',
                        color: view === 'login' ? 'var(--color-charcoal)' : 'rgba(26,26,26,0.5)',
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        boxShadow: view === 'login' ? '0 6px 16px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      SIGN IN
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('signup')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: view === 'signup' ? '#FFF' : 'transparent',
                        color: view === 'signup' ? 'var(--color-charcoal)' : 'rgba(26,26,26,0.5)',
                        fontWeight: 700,
                        fontSize: '12px',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        boxShadow: view === 'signup' ? '0 6px 16px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      REGISTER
                    </button>
                  </div>

                  {/* Global Alerts */}
                  {formError && (
                    <div style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '20px', color: '#EF4444', fontSize: '12px', marginBottom: '16px' }}>
                      ⚠️ {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div style={{ padding: '10px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px', color: '#10B981', fontSize: '12px', marginBottom: '16px' }}>
                      ✓ {formSuccess}
                    </div>
                  )}

                  {/* Form Views */}
                  {(view === 'login' || view === 'signup') && (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {view === 'signup' && (
                        <>
                          <div>
                            <input
                              name="name"
                              type="text"
                              required
                              value={form.name}
                              onChange={handleChange}
                              placeholder="Full Name *"
                              style={{
                                width: '100%',
                                padding: '16px 24px',
                                borderRadius: '9999px',
                                border: '1.5px solid rgba(255, 255, 255, 0.75)',
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(20px)',
                                fontSize: '13px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                              }}
                            />
                          </div>
                          <div>
                            <input
                              name="phone"
                              type="tel"
                              required
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="Phone Number *"
                              style={{
                                width: '100%',
                                padding: '16px 24px',
                                borderRadius: '9999px',
                                border: '1.5px solid rgba(255, 255, 255, 0.75)',
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(20px)',
                                fontSize: '13px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                              }}
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <input
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Email address or Username *"
                          style={{
                            width: '100%',
                            padding: '16px 24px',
                            borderRadius: '9999px',
                            border: '1.5px solid rgba(255, 255, 255, 0.75)',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(20px)',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                          }}
                        />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={handleChange}
                          required
                          placeholder="Password *"
                          style={{
                            width: '100%',
                            padding: '16px 48px 16px 24px',
                            borderRadius: '9999px',
                            border: '1.5px solid rgba(255, 255, 255, 0.75)',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(20px)',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'rgba(26,26,26,0.4)' }}
                        >
                          {showPassword ? '👁️' : '🕶️'}
                        </button>
                      </div>

                      {view === 'login' && (
                        <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                          <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--color-gold-dark)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Forgot password?
                          </button>
                        </div>
                      )}

                      {/* Glass Pill Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: '100%',
                          padding: '16px',
                          borderRadius: '9999px',
                          border: '1.5px solid rgba(255, 255, 255, 0.85)',
                          background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)',
                          color: '#FFF',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                          marginTop: '6px'
                        }}
                      >
                        {loading ? 'Processing...' : view === 'login' ? 'Login' : 'Create Account'}
                      </button>
                    </form>
                  )}

                  {view === 'forgot' && (
                    <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="Registered email address"
                        style={{ width: '100%', padding: '16px 24px', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.6)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '9999px', border: 'none', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Sending code...' : 'Generate Reset Token'}
                      </button>
                      <button type="button" onClick={() => setView('login')} style={{ width: '100%', padding: '12px', borderRadius: '9999px', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Back to Login
                      </button>
                    </form>
                  )}

                  {view === 'reset' && (
                    <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {!resetToken && (
                        <input
                          type="text"
                          required
                          value={resetToken}
                          onChange={e => setResetToken(e.target.value)}
                          placeholder="Enter reset token"
                          style={{ width: '100%', padding: '16px 24px', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.6)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                      )}
                      <input
                        type="password"
                        required
                        value={resetForm.password}
                        onChange={e => setResetForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="New password"
                        style={{ width: '100%', padding: '16px 24px', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.6)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <input
                        type="password"
                        required
                        value={resetForm.confirmPassword}
                        onChange={e => setResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm password"
                        style={{ width: '100%', padding: '16px 24px', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.6)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '9999px', border: 'none', background: 'var(--color-charcoal)', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Updating...' : 'Commit New Password'}
                      </button>
                    </form>
                  )}

                  {/* Social Authentication Tray */}
                  {(view === 'login' || view === 'signup') && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0 16px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px', fontWeight: 600 }}>
                          Or continue with
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
                        <div 
                          id="googleSignInButton" 
                          style={{ 
                            width: '100%', 
                            height: '40px', 
                            borderRadius: '9999px', 
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }} 
                        />
                        <button
                          type="button"
                          onClick={handleAppleSignIn}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            height: '40px',
                            padding: '0 16px',
                            background: '#000000',
                            border: '1px solid #000000',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '13px',
                            color: '#ffffff',
                            boxSizing: 'border-box',
                            width: '100%'
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 170 170" fill="currentColor">
                            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.14-3.09-2.52-6.91-7.05-11.45-13.59-4.54-6.54-8.33-13.88-11.36-22.01-3.03-8.14-5.55-16.8-7.55-25.99-2-9.19-3-18.17-3-26.96 0-14.83 3.51-27.14 10.53-36.95 7.02-9.8 16.32-14.73 27.91-14.78 4.7 0 9.89 1.38 15.58 4.14 5.69 2.76 9.6 4.13 11.74 4.13 1.88 0 5.48-1.28 10.82-3.83 5.34-2.55 10.45-3.89 15.33-4.01 12.83 0 23.63 4.6 32.4 13.78-10.88 6.64-16.22 15.6-16.03 26.89.2 8.79 3.32 16.14 9.38 22.04 6.06 5.9 13.23 9.21 21.52 9.93 2.15 5.56 4.3 11.13 6.45 16.71zm-28.71-118.8c0 7.6-2.73 14.65-8.19 21.13-5.46 6.48-12.06 10.52-19.8 12.11-.78-7.39 2.05-14.47 8.49-21.24 6.44-6.76 13.34-10.74 20.7-11.96.6 2.65.8 4.96.8 7.96z" />
                          </svg>
                          Apple
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 960px) {
          .account-split-container { grid-template-columns: 1fr !important; }
          .account-grid { grid-template-columns: 1fr !important; }
          .account-sidebar { flex-direction: row !important; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
          .account-sidebar::-webkit-scrollbar { display: none; }
          .glass-lens-orb { display: none !important; }
        }
        @media (max-width: 768px) {
          .account-grid input,
          .account-grid select,
          .account-grid textarea,
          .account-split-container input,
          .account-split-container select {
            font-size: 16px !important;
          }
        }
        @media (max-width: 576px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
