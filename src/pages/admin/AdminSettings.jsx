import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    storeName: '', tagline: '', email: '', phone: '', whatsapp: '', address: '', city: '', state: '', pincode: '', country: 'India',
    shippingRate: 500, freeShippingThreshold: 50000, expressShippingRate: 1500,
    codEnabled: true, upiEnabled: true, cardEnabled: true,
    gstRate: 3, gstNumber: '',
    metaTitle: '', metaDescription: '', metaKeywords: '',
    instagram: '', facebook: '', pinterest: '', youtube: '', twitter: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings');
        const data = res.data || res;
        if (data) setForm(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/settings', form);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving settings: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading settings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Settings</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage store configuration, shipping, payments, and SEO.</p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: message.includes('Error') ? 'rgba(220,53,69,0.1)' : 'rgba(45,106,79,0.1)', color: message.includes('Error') ? 'var(--color-ruby)' : 'var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Store Information */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '32px', marginBottom: '24px' }} className="admin-settings-card">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '24px' }}>Store Information</h3>
          <div className="responsive-form-grid">
            <div className="form-group"><label className="form-label">Store Name</label><input name="storeName" value={form.storeName} onChange={handleFormChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Tagline</label><input name="tagline" value={form.tagline} onChange={handleFormChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Contact Email</label><input name="email" type="email" value={form.email} onChange={handleFormChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Contact Phone</label><input name="phone" value={form.phone} onChange={handleFormChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">WhatsApp Number</label><input name="whatsapp" value={form.whatsapp} onChange={handleFormChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Country</label><input name="country" value={form.country} onChange={handleFormChange} className="form-input" /></div>
            <div className="form-group store-address-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Store Address</label><input name="address" value={form.address} onChange={handleFormChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">City</label><input name="city" value={form.city} onChange={handleFormChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">State</label><input name="state" value={form.state} onChange={handleFormChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">PIN Code</label><input name="pincode" value={form.pincode} onChange={handleFormChange} className="form-input" /></div>
          </div>
        </div>

        {/* Shipping Rules */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '32px', marginBottom: '24px' }} className="admin-settings-card">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '24px' }}>Shipping Settings</h3>
          <div className="responsive-form-grid">
            <div className="form-group"><label className="form-label">Default Shipping Rate (₹)</label><input name="shippingRate" type="number" value={form.shippingRate} onChange={handleFormChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Free Shipping Threshold (₹)</label><input name="freeShippingThreshold" type="number" value={form.freeShippingThreshold} onChange={handleFormChange} className="form-input" required /></div>
            <div className="form-group"><label className="form-label">Express Shipping Rate (₹)</label><input name="expressShippingRate" type="number" value={form.expressShippingRate} onChange={handleFormChange} className="form-input" /></div>
          </div>
        </div>

        {/* Payment Settings */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '32px', marginBottom: '24px' }} className="admin-settings-card">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '24px' }}>Payment & Tax</h3>
          <div className="responsive-form-grid">
            <div className="form-group"><label className="form-label">GST Rate (%)</label><input name="gstRate" type="number" value={form.gstRate} onChange={handleFormChange} className="form-input" /></div>
            <div className="form-group"><label className="form-label">GSTIN Number</label><input name="gstNumber" value={form.gstNumber} onChange={handleFormChange} className="form-input" /></div>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}><input type="checkbox" name="codEnabled" checked={form.codEnabled} onChange={handleFormChange} /> Cash on Delivery</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}><input type="checkbox" name="upiEnabled" checked={form.upiEnabled} onChange={handleFormChange} /> UPI Payments</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}><input type="checkbox" name="cardEnabled" checked={form.cardEnabled} onChange={handleFormChange} /> Card Payments</label>
          </div>
        </div>

        {/* SEO Settings */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '32px', marginBottom: '24px' }} className="admin-settings-card">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '24px' }}>SEO Defaults</h3>
          <div className="form-group"><label className="form-label">Meta Title</label><input name="metaTitle" value={form.metaTitle} onChange={handleFormChange} className="form-input" /></div>
          <div className="form-group"><label className="form-label">Meta Description</label><textarea name="metaDescription" value={form.metaDescription} onChange={handleFormChange} className="form-input" rows="3" /></div>
          <div className="form-group"><label className="form-label">Meta Keywords</label><input name="metaKeywords" value={form.metaKeywords} onChange={handleFormChange} className="form-input" placeholder="comma separated" /></div>
        </div>

        {/* Social Links */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '32px', marginBottom: '24px' }} className="admin-settings-card">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '24px' }}>Social Links</h3>
          <div className="responsive-form-grid">
            <div className="form-group"><label className="form-label">Instagram</label><input name="instagram" value={form.instagram} onChange={handleFormChange} className="form-input" placeholder="https://instagram.com/..." /></div>
            <div className="form-group"><label className="form-label">Facebook</label><input name="facebook" value={form.facebook} onChange={handleFormChange} className="form-input" placeholder="https://facebook.com/..." /></div>
            <div className="form-group"><label className="form-label">Pinterest</label><input name="pinterest" value={form.pinterest} onChange={handleFormChange} className="form-input" placeholder="https://pinterest.com/..." /></div>
            <div className="form-group"><label className="form-label">YouTube</label><input name="youtube" value={form.youtube} onChange={handleFormChange} className="form-input" placeholder="https://youtube.com/..." /></div>
            <div className="form-group"><label className="form-label">Twitter / X</label><input name="twitter" value={form.twitter} onChange={handleFormChange} className="form-input" placeholder="https://x.com/..." /></div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ width: '100%', maxWidth: '300px' }}>{saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
      <style>{`
        @media (max-width: 768px) {
          .admin-settings-card {
            padding: 20px !important;
          }
          .store-address-group {
            grid-column: span 1 !important;
          }
          form button[type="submit"] {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
