import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import api, { getMediaUrl } from '../utils/api';

export default function Account() {
  const {
    user,
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

  // Authentication UI view states: 'login' | 'signup' | 'forgot' | 'reset'
  const [view, setView] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [resetForm, setResetForm] = useState({ password: '', confirmPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [inquiries, setInquiries] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Profile settings states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', currentPassword: '', password: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Address form states
  const [addrForm, setAddrForm] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', postalCode: '', phone: '', isDefault: false });
  const [showAddrForm, setShowAddrForm] = useState(false);

  // Check for reset token or tab in URL on mount
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

  // Update profile inputs once user finishes fetching
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        password: ''
      });
      if (activeTab === 'Inquiries') fetchInquiries();
      if (activeTab === 'Addresses') fetchAddresses();
    }
  }, [user, activeTab]);

  // Handle Google OAuth Credential Response from GIS library securely
  const handleGoogleCredentialResponse = async (response) => {
    setFormError('');
    setFormSuccess('');
    try {
      if (response && response.credential) {
        // Send the secure JWT ID Token to our backend for signature verification
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

  // Initialize Google Identity Services Client ID on view mount
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
                width: 195, // matching the apple button style width
                shape: 'rectangular',
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

  // Handle Apple Sign-In popup trigger using Apple Auth JS SDK
  const handleAppleSignIn = async () => {
    setFormError('');
    setFormSuccess('');
    try {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.goldsmithsjewels.auth.service', // Configured Apple Developer Service ID
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
      // Display clear guidance for local development
      setFormError(err.message || 'Apple Sign-In failed. Apple credentials must be fully configured on developer.apple.com.');
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Main login/signup submit handler
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

  // Forgot password handler
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      const res = await forgotPassword(forgotEmail);
      setFormSuccess(res.message || 'If that email matches an account, a reset code was generated.');
      if (res.token) {
        // Dev log fallback
        console.log(`[DEVELOPER SANDBOX] Generated Reset Token: ${res.token}`);
        setFormSuccess(`Reset link generated! Use code: ${res.token?.slice(0, 8)}... or check console.`);
      }
    } catch (err) {
      setFormError(err.message || 'Error requesting reset.');
    }
  };

  // Reset password handler
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
        // Clear search token in URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3000);
    } catch (err) {
      setFormError(err.message || 'Reset token is invalid or expired.');
    }
  };

  // Fetch Inquiry history
  const fetchInquiries = async () => {
    try {
      setLoadingData(true);
      const res = await api.get('/me/inquiries');
      setInquiries(res.data || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch Saved Addresses
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

  // Handle Profile settings changes
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      await api.put('/auth/profile', profileForm);
      setProfileMsg('✓ Profile settings updated successfully!');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err) {
      setProfileMsg('✕ Error: ' + (err.message || 'Verification failed'));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileMsg('');

    // 1. Client-side Type Validation (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setProfileMsg('✕ Error: Invalid file type. Allowed formats: JPG, JPEG, PNG, WebP.');
      return;
    }

    // 2. Client-side File Size Validation (strictly 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setProfileMsg('✕ Error: File too large. Profile photos must not exceed 2MB in size.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await api.put('/auth/avatar', formData);
      if (res.success && res.data) {
        // Sync frontend session state
        const updatedUser = { ...user, avatar: res.data.avatar };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setProfileMsg('✓ Profile photo updated successfully!');
      } else {
        setProfileMsg(`✕ Error: ${res.message || 'Upload failed'}`);
      }
    } catch (err) {
      const msg = err.message || (typeof err === 'string' ? err : (err.error || 'Server error'));
      setProfileMsg(`✕ Error uploading avatar: ${msg}`);
    } finally {
      setUploading(false);
      e.target.value = ''; // Allow uploading the same file again
    }
  };

  const handleAvatarRemove = async () => {
    if (!window.confirm('Are you sure you want to permanently remove your profile photograph?')) {
      return;
    }

    setProfileMsg('');
    try {
      setUploading(true);
      const res = await api.delete('/auth/avatar');
      if (res.success && res.data) {
        // Sync frontend session state
        const updatedUser = { ...user, avatar: res.data.avatar };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setProfileMsg('✓ Profile photo removed successfully!');
      } else {
        setProfileMsg(`✕ Error: ${res.message || 'Removal failed'}`);
      }
    } catch (err) {
      const msg = err.message || (typeof err === 'string' ? err : (err.error || 'Server error'));
      setProfileMsg(`✕ Error removing avatar: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  // Add Address helper
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

  // Delete Address helper
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

  // Developer Social Auth Sandbox simulation trigger (to demonstrate Account Linking & Oauth live)
  const handleDeveloperSocialSimulate = async (provider, testEmail) => {
    setFormError('');
    setFormSuccess('');
    try {
      const payload = {
        email: testEmail || 'guest@goldsmithsjewels.com',
        googleId: provider === 'google' ? 'google_sandbox_user_12345' : undefined,
        appleId: provider === 'apple' ? 'apple_sandbox_user_54321' : undefined,
        name: testEmail ? testEmail.split('@')[0].toUpperCase() + ' (Linked)' : 'Sandbox Guest User',
        avatar: provider === 'google' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' : ''
      };
      
      let res;
      if (provider === 'google') {
        res = await googleLogin(payload);
      } else {
        res = await appleLogin(payload);
      }
      setFormSuccess(`Successfully authenticated and linked with ${provider.toUpperCase()}!`);
    } catch (err) {
      const msg = err.message || (typeof err === 'string' ? err : (err.error || JSON.stringify(err))) || 'Connection failed. Please ensure the backend server is running and has been restarted.';
      setFormError(`Sandbox linking error: ${msg}`);
    }
  };
  const tabs = ['Dashboard', 'Inquiries', 'Wishlist', 'Addresses', 'Settings', ...(user?.role === 'Super Admin' || user?.role === 'Admin' ? ['Admin Panel'] : []), 'Logout'];

  // ==================== AUTHENTICATED USER DASHBOARD ====================
  if (user) {
    return (
      <div>
        <div style={{ background: 'var(--color-gray-50)', padding: '40px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>My Account</h1>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Welcome to your goldsmiths privilege portal</p>
            </div>
            {user.authProvider !== 'local' && (
              <span style={{ fontSize: 'var(--text-xs)', background: 'var(--color-gray-100)', color: 'var(--color-gray-600)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                Signed in with {user.authProvider.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        
        <div className="container" style={{ padding: '48px 0 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }} className="account-grid">
            {/* Sidebar Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className="account-sidebar">
              {tabs.map(item => (
                <button
                  key={item}
                  onClick={item === 'Logout' ? logout : item === 'Admin Panel' ? () => window.location.href = '/admin' : () => setActiveTab(item)}
                  style={{
                    padding: '14px 18px',
                    textAlign: 'left',
                    fontSize: 'var(--text-sm)',
                    borderRadius: 'var(--radius-lg)',
                    background: activeTab === item ? 'var(--color-gold)' : item === 'Admin Panel' ? 'var(--color-charcoal)' : 'transparent',
                    color: activeTab === item ? 'white' : item === 'Admin Panel' ? 'white' : item === 'Logout' ? 'var(--color-ruby)' : 'var(--color-gray-700)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)'
                  }}
                  className="nav-btn"
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
            <div className="account-content-window">
              {activeTab === 'Dashboard' && (
                <div>
                  <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-2xl)', padding: '36px', marginBottom: '32px', border: '1px solid var(--color-gray-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      {user.avatar && user.avatar.url ? (
                        <img src={getMediaUrl(user.avatar)} alt={user.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }} />
                      ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Hello, {user.name}!</h2>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Email: {user.email} | Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="stats-grid">
                    {[{ icon: '✉️', label: 'My Inquiries', value: inquiries.length || '—', tab: 'Inquiries' },
                      { icon: '❤️', label: 'Wishlist', link: '/wishlist' },
                      { icon: '📍', label: 'Saved Addresses', value: addresses.length || '—', tab: 'Addresses' }
                    ].map(stat => (
                      <button
                        key={stat.label}
                        onClick={() => stat.tab ? setActiveTab(stat.tab) : stat.link && (window.location.href = stat.link)}
                        style={{
                          padding: '28px 20px',
                          background: 'var(--color-gray-50)',
                          borderRadius: 'var(--radius-xl)',
                          textAlign: 'center',
                          border: '1px solid var(--color-gray-100)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        className="stat-card"
                      >
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '6px' }}>{stat.value || '→'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{stat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Inquiries' && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>My Inquiries</h2>
                  {loadingData ? <p>Loading inquiries...</p> : inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-2xl)' }}>
                      <div style={{ fontSize: '56px', marginBottom: '16px' }}>✉️</div>
                      <p style={{ color: 'var(--color-gray-500)', marginBottom: '20px' }}>You haven't submitted any inquiries yet.</p>
                      <Link to="/shop" className="btn btn-primary" style={{ display: 'inline-block' }}>Start Browsing Fine Jewellery</Link>
                    </div>
                  ) : inquiries.map(i => (
                    <div key={i._id || i.inquiryId} style={{ border: '1px solid rgba(188, 156, 108, 0.2)', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '20px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-charcoal)' }}>INQUIRY #{i.inquiryId}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginLeft: '16px' }}>{new Date(i.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span style={{ 
                          padding: '6px 14px', 
                          borderRadius: 'var(--radius-full)', 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          color: i.status === 'new' ? '#3b82f6' : i.status === 'quoted' || i.status === 'customization sent' ? '#22c55e' : '#f59e0b', 
                          background: (i.status === 'new' ? '#3b82f6' : i.status === 'quoted' || i.status === 'customization sent' ? '#22c55e' : '#f59e0b') + '15', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em' 
                        }}>{i.status}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, overflow: 'hidden' }}>💎</div>
                        <div>
                          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{i.productName}</h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>Type: {i.inquiryType} | Preferred Contact: {i.preferredContactMethod}</p>
                        </div>
                      </div>

                      <div style={{ background: 'var(--color-gray-50)', padding: '12px 16px', borderRadius: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: '16px' }}>
                        <strong>Your Message:</strong> {i.message}
                        {i.customizationNotes && <div style={{ marginTop: '8px' }}><strong>Customization Request:</strong> {i.customizationNotes}</div>}
                      </div>

                      {i.adminResponse ? (
                        <div style={{ borderTop: '1px solid rgba(188, 156, 108, 0.15)', paddingTop: '16px' }}>
                          <h5 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '8px' }}>Expert Consultant Response</h5>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', lineHeight: 1.6, fontStyle: 'italic', background: 'rgba(188, 156, 108, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
                            {i.adminResponse}
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', borderTop: '1px solid var(--color-gray-50)', paddingTop: '12px' }}>
                          ⏳ Awaiting response from our design team.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Wishlist' && (
                <div style={{ textAlign: 'center', padding: '64px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-2xl)' }}>
                  <div style={{ fontSize: '56px', marginBottom: '16px' }}>❤️</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '8px' }}>Your Wishlist</h3>
                  <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>Save items to purchase them later or share them.</p>
                  <Link to="/wishlist" className="btn btn-primary">Go to Wishlist Panel</Link>
                </div>
              )}

              {activeTab === 'Addresses' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>Saved Addresses</h2>
                    <button onClick={() => setShowAddrForm(true)} className="btn btn-primary btn-sm">+ Add New Address</button>
                  </div>
                  {loadingData ? <p>Loading address book...</p> : addresses.length === 0 ? <p style={{ color: 'var(--color-gray-500)' }}>No saved delivery addresses.</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {addresses.map(a => (
                        <div key={a._id} style={{ border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-xl)', padding: '24px', position: 'relative', background: '#fff' }}>
                          {a.isDefault && <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px', background: 'var(--color-gold)', color: 'white', padding: '3px 10px', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Default</span>}
                          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', marginBottom: '8px' }}>{a.firstName} {a.lastName}</p>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', lineHeight: 1.5 }}>{a.street}</p>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{a.city}, {a.state} - {a.postalCode}</p>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '8px', fontWeight: 500 }}>📞 {a.phone}</p>
                          <button onClick={() => handleDeleteAddr(a._id)} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Remove Address</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddrForm && (
                    <form onSubmit={handleAddAddress} style={{ padding: '32px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', marginTop: '24px', border: '1px solid var(--color-gray-100)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '20px' }}>Add Shipping Address</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="address-form-grid">
                        <div className="form-group"><label className="form-label">First Name</label><input value={addrForm.firstName} onChange={e => setAddrForm(p => ({ ...p, firstName: e.target.value }))} className="form-input" required /></div>
                        <div className="form-group"><label className="form-label">Last Name</label><input value={addrForm.lastName} onChange={e => setAddrForm(p => ({ ...p, lastName: e.target.value }))} className="form-input" required /></div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Street / Area</label><input value={addrForm.street} onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))} className="form-input" required /></div>
                        <div className="form-group"><label className="form-label">City</label><input value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} className="form-input" required /></div>
                        <div className="form-group"><label className="form-label">State</label><input value={addrForm.state} onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} className="form-input" required /></div>
                        <div className="form-group"><label className="form-label">Postal / Zip Code</label><input value={addrForm.postalCode} onChange={e => setAddrForm(p => ({ ...p, postalCode: e.target.value }))} className="form-input" required /></div>
                        <div className="form-group"><label className="form-label">Contact Phone</label><input value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} className="form-input" required /></div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
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
                  
                  {/* Luxury Profile Photo Editor */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '24px',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    marginBottom: '32px'
                  }} className="profile-photo-editor">
                    
                    {/* Circle Avatar Preview */}
                    <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                      {user.avatar && user.avatar.url ? (
                        <img 
                          src={getMediaUrl(user.avatar)} 
                          alt={user.name} 
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-gold)', boxShadow: 'var(--shadow-md)' }} 
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2A2421 100%)',
                          color: 'var(--color-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '32px',
                          border: '3px solid var(--color-gold)',
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          boxShadow: 'var(--shadow-md)'
                        }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Loading Spinner Overlay */}
                      {uploading && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.6)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-gold)',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          Loading...
                        </div>
                      )}
                    </div>
                    
                    {/* Action Controls */}
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '6px' }}>Profile Photograph</h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', lineHeight: 1.4, marginBottom: '14px' }}>
                        Allowed formats: JPG, JPEG, PNG, or WebP. Maximum size: 2MB.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-outline-gold"
                          onClick={() => document.getElementById('avatarFileInput').click()}
                          disabled={uploading}
                          style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', height: 'auto' }}
                        >
                          {uploading ? 'Processing...' : 'Upload Photo'}
                        </button>
                        
                        {user.avatar && user.avatar.url && (
                          <button
                            type="button"
                            onClick={handleAvatarRemove}
                            disabled={uploading}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-ruby)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: '8px 0',
                              transition: 'color var(--transition-fast)'
                            }}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                      
                      {/* Hidden File Input */}
                      <input 
                        type="file" 
                        id="avatarFileInput" 
                        accept="image/jpeg,image/jpg,image/png,image/webp" 
                        onChange={handleAvatarUpload} 
                        style={{ display: 'none' }} 
                      />
                    </div>
                  </div>
                  {profileMsg && (
                    <div style={{
                      padding: '14px',
                      background: profileMsg.includes('Error') ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '20px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      color: profileMsg.includes('Error') ? 'var(--color-ruby)' : 'var(--color-success)',
                      border: `1px solid ${profileMsg.includes('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}`
                    }}>
                      {profileMsg}
                    </div>
                  )}
                  <form onSubmit={handleProfileUpdate} style={{ maxWidth: '540px' }}>
                    <div className="form-group"><label className="form-label">Full Name</label><input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="form-input" /></div>
                    <div className="form-group"><label className="form-label">Email Address (Locked)</label><input value={profileForm.email} className="form-input" type="email" disabled style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-400)' }} /></div>
                    <div className="form-group"><label className="form-label">Phone Number</label><input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="form-input" /></div>
                    
                    {user.authProvider === 'local' && (
                      <>
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: '32px 0 16px', color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security — Update Password</h4>
                        <div className="form-group"><label className="form-label">Current Password</label><input value={profileForm.currentPassword} onChange={e => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))} className="form-input" type="password" /></div>
                        <div className="form-group"><label className="form-label">New Password</label><input value={profileForm.password} onChange={e => setProfileForm(p => ({ ...p, password: e.target.value }))} className="form-input" type="password" /></div>
                      </>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>Update Profile</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <style>{`
          @media (max-width: 1024px) {
            .account-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
            .account-sidebar {
              flex-direction: row !important;
              overflow-x: auto;
              padding-bottom: 8px;
              border-bottom: 1px solid var(--color-gray-100);
            }
            .account-sidebar .nav-btn {
              white-space: nowrap;
              padding: 10px 16px !important;
            }
          }
          @media (max-width: 576px) {
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
            .address-form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // ==================== LOGGED OUT AUTHENTICATION CARDS ====================
  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: 'var(--color-white)', borderRadius: 'var(--radius-2xl)', padding: '44px', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(212, 175, 55, 0.1)' }} className="auth-card">
        
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-charcoal)' }}>GOLDSMITHS</span>
          
          {view === 'login' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '16px' }}>Welcome Back</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Sign in to access your privilege account</p>
            </>
          )}
          
          {view === 'signup' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '16px' }}>Create Account</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Join the goldsmiths family</p>
            </>
          )}

          {view === 'forgot' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '16px' }}>Reset Password</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Enter your email to receive a reset token</p>
            </>
          )}

          {view === 'reset' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '16px' }}>Choose New Password</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Choose a secure, strong password</p>
            </>
          )}
        </div>

        {/* Global Notifications */}
        {formError && (
          <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--color-ruby)', borderRadius: 'var(--radius-lg)', marginBottom: '20px', fontSize: 'var(--text-sm)', fontWeight: 500, border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            ⚠️ {formError}
          </div>
        )}
        
        {formSuccess && (
          <div style={{ padding: '12px 14px', background: 'rgba(34, 197, 94, 0.08)', color: 'var(--color-success)', borderRadius: 'var(--radius-lg)', marginBottom: '20px', fontSize: 'var(--text-sm)', fontWeight: 500, border: '1px solid rgba(34, 197, 94, 0.15)' }}>
            ✓ {formSuccess}
          </div>
        )}

        {/* ================= VIEW: LOGIN / SIGNUP ================= */}
        {(view === 'login' || view === 'signup') && (
          <form onSubmit={handleSubmit}>
            {view === 'signup' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} className="form-input" placeholder="e.g. Elizabeth Taylor" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder="e.g. +91 98765 43210" required />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="e.g. customer@goldsmiths.com" required />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {view === 'login' && (
                  <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingRight: '48px' }}
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '6px', color: 'var(--color-gray-400)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '🕶️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Processing transaction...' : (view === 'login' ? 'Sign In' : 'Register Account')}
            </button>
          </form>
        )}

        {/* ================= VIEW: FORGOT PASSWORD ================= */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="form-input"
                placeholder="Enter registered email address"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Sending code...' : 'Generate Reset Token'}
            </button>
            <button type="button" onClick={() => setView('login')} className="btn btn-secondary btn-lg" style={{ width: '100%', marginTop: '12px' }}>
              Back to Login
            </button>
          </form>
        )}

        {/* ================= VIEW: RESET PASSWORD ================= */}
        {view === 'reset' && (
          <form onSubmit={handleResetSubmit}>
            {resetToken && (
              <div style={{ background: 'var(--color-gray-50)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '11px', color: 'var(--color-gray-500)', border: '1px dashed var(--color-gray-200)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🔑 Verification Token Staged: {resetToken}
              </div>
            )}
            {!resetToken && (
              <div className="form-group">
                <label className="form-label">Paste Reset Token</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={e => setResetToken(e.target.value)}
                  className="form-input"
                  placeholder="Enter token from email or developer panel"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={resetForm.password}
                onChange={e => setResetForm(prev => ({ ...prev, password: e.target.value }))}
                className="form-input"
                placeholder="Choose strong password"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={resetForm.confirmPassword}
                onChange={e => setResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="form-input"
                placeholder="Confirm password selection"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Updating credentials...' : 'Commit New Password'}
            </button>
          </form>
        )}

        {/* ================= SOCIAL LOGIN PROVIDERS ================= */}
        {(view === 'login' || view === 'signup') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 18px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-gray-100)' }}></div>
              <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', fontWeight: 600 }}>
                Or continue with
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-gray-100)' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
              {/* Google Native Sign-In Button */}
              <div 
                id="googleSignInButton" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '42px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}
              ></div>

              {/* Apple OAuth Trigger Button */}
              <button
                type="button"
                onClick={handleAppleSignIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  height: '40px',
                  padding: '10px 16px',
                  background: '#000000',
                  border: '1px solid #000000',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--text-xs)',
                  color: '#ffffff',
                  transition: 'all var(--transition-fast)'
                }}
                className="social-btn"
              >
                <svg width="15" height="15" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.14-3.09-2.52-6.91-7.05-11.45-13.59-4.54-6.54-8.33-13.88-11.36-22.01-3.03-8.14-5.55-16.8-7.55-25.99-2-9.19-3-18.17-3-26.96 0-14.83 3.51-27.14 10.53-36.95 7.02-9.8 16.32-14.73 27.91-14.78 4.7 0 9.89 1.38 15.58 4.14 5.69 2.76 9.6 4.13 11.74 4.13 1.88 0 5.48-1.28 10.82-3.83 5.34-2.55 10.45-3.89 15.33-4.01 12.83 0 23.63 4.6 32.4 13.78-10.88 6.64-16.22 15.6-16.03 26.89.2 8.79 3.32 16.14 9.38 22.04 6.06 5.9 13.23 9.21 21.52 9.93 2.15 5.56 4.3 11.13 6.45 16.71zm-28.71-118.8c0 7.6-2.73 14.65-8.19 21.13-5.46 6.48-12.06 10.52-19.8 12.11-.78-7.39 2.05-14.47 8.49-21.24 6.44-6.76 13.34-10.74 20.7-11.96.6 2.65.8 4.96.8 7.96z" />
                </svg>
                Apple
              </button>
            </div>
          </div>
        )}

        {/* ================= CARD FOOTER VIEW SWITCHER ================= */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
          {view === 'login' && (
            <>
              Don't have an account?{' '}
              <button onClick={() => setView('signup')} style={{ color: 'var(--color-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sign Up
              </button>
            </>
          )}

          {view === 'signup' && (
            <>
              Already have an account?{' '}
              <button onClick={() => setView('login')} style={{ color: 'var(--color-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sign In
              </button>
            </>
          )}

          {(view === 'forgot' || view === 'reset') && (
            <button onClick={() => setView('login')} style={{ color: 'var(--color-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Return to Sign In
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
