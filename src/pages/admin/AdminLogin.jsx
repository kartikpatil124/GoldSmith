import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { user, adminLogin, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  if (user && (user.role === 'Super Admin' || user.role === 'Admin')) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await adminLogin(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setFormError(err.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-charcoal)', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--color-white)', borderRadius: 'var(--radius-2xl)', padding: '48px', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>GOLDSMITHS ADMIN</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '16px' }}>Secure Login</h2>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Enter your credentials to access the dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          {formError && <div style={{ padding: '12px', background: 'var(--color-ruby)15', color: 'var(--color-ruby)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: 'var(--text-sm)' }}>{formError}</div>}
          <div className="form-group"><label className="form-label">Admin Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" required /></div>
          <div className="form-group"><label className="form-label">Password</label><input name="password" type="password" value={form.password} onChange={handleChange} className="form-input" required /></div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', background: 'var(--color-charcoal)', borderColor: 'var(--color-charcoal)' }}>{loading ? 'Authenticating...' : 'Access Dashboard'}</button>
        </form>
      </div>
    </div>
  );
}
