import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import shopBg from '../../../images/shopbg.png';

export default function AdminLogin() {
  const { user, login, adminLogin, loading } = useAuth();
  const [form, setForm] = useState({ email: 'admin@goldsmithsjewels.com', password: 'password123' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // If already logged in as Admin, redirect immediately
  const isAdmin = user && (
    user.role === 'Super Admin' || 
    user.role === 'Admin' || 
    user.email?.toLowerCase() === 'admin@goldsmithsjewels.com'
  );

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      // 1. Try dedicated admin login endpoint
      let resUser = null;
      try {
        resUser = await adminLogin(form.email, form.password);
      } catch (e) {
        // 2. Fallback to standard login endpoint
        resUser = await login(form.email, form.password);
      }

      if (resUser && (resUser.role === 'Super Admin' || resUser.role === 'Admin' || form.email.toLowerCase() === 'admin@goldsmithsjewels.com')) {
        navigate('/admin');
      } else {
        setFormError('Account authenticated, but does not have Administrator privileges.');
      }
    } catch (err) {
      setFormError(err.message || 'Admin authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setForm({ email: 'admin@goldsmithsjewels.com', password: 'password123' });
    setFormError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${shopBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(35px) saturate(200%)',
        WebkitBackdropFilter: 'blur(35px) saturate(200%)',
        borderRadius: '32px',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.12), 0 10px 30px rgba(201,168,76,0.15)',
        padding: '44px 40px'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(188, 156, 108, 0.15)',
            border: '1px solid rgba(188, 156, 108, 0.3)',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-dark)',
            fontWeight: 700,
            marginBottom: '10px'
          }}>
            SECURE CONCIERGE PORTAL
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0 0 6px' }}>
            Goldsmiths Admin
          </h2>
          <p style={{ color: 'rgba(26,26,26,0.6)', fontSize: '13px', margin: 0 }}>
            Sign in with administrator credentials to manage inventory & inquiries
          </p>
        </div>

        {formError && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#DC2626',
            borderRadius: '16px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600
          }}>
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-charcoal)', marginBottom: '6px' }}>
              Admin Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@goldsmithsjewels.com"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0, 0, 0, 0.12)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-charcoal)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0, 0, 0, 0.12)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #2C2621 100%)',
              color: 'var(--color-gold)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              marginBottom: '14px'
            }}
          >
            {submitting || loading ? 'Authenticating...' : 'Access Admin Dashboard →'}
          </button>
        </form>

        {/* Demo Quick Auto-Fill */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={fillDemoAdmin}
            style={{
              background: 'rgba(188, 156, 108, 0.12)',
              border: '1px solid rgba(188, 156, 108, 0.3)',
              borderRadius: '9999px',
              padding: '8px 18px',
              color: 'var(--color-gold-dark)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            ⚡ One-Click Demo Admin Credentials
          </button>

          <div>
            <Link to="/account" style={{ fontSize: '12px', color: 'rgba(26,26,26,0.6)', textDecoration: 'none', fontWeight: 600 }}>
              ← Return to Customer Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
