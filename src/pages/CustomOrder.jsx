import { useState } from 'react';
import api from '../utils/api';

export default function CustomOrder() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', metal: '', gemstone: '', budget: '', size: '', description: '' });
  const [refImage, setRefImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let referenceImage = '';
      if (refImage) {
        const fd = new FormData();
        fd.append('image', refImage);
        const uploadRes = await api.post('/upload', fd);
        referenceImage = uploadRes.data || uploadRes || '';
      }
      await api.post('/custom-requests', { ...form, referenceImage });
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting request: ' + (err.message || 'Please try again'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Custom Order Received!</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '8px' }}>Our design team will review your requirements and get back to you within 48 hours.</p>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '32px' }}>For urgent requests, call us at +91 98765 43210</p>
    </div>
  );

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2d2520)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '12px' }}>Bespoke Creations</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-white)', marginBottom: '16px' }}>Custom Jewellery Design</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>Transform your vision into a masterpiece. Our artisans will craft a unique piece tailored exclusively for you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Process Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '60px' }}>
            {[{ step: '01', title: 'Share Your Vision', desc: 'Tell us your design idea' }, { step: '02', title: '3D Preview', desc: 'We create a CAD render' }, { step: '03', title: 'Crafting', desc: 'Master artisans at work' }, { step: '04', title: 'Delivery', desc: 'Your dream piece arrives' }].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-gold)', color: 'white', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{s.step}</div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>{s.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', padding: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Design Request Form</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label className="form-label">Your Name *</label><input name="name" value={form.name} onChange={handleChange} className="form-input" required /></div>
              <div className="form-group"><label className="form-label">Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" required /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" required /></div>
              <div className="form-group">
                <label className="form-label">Jewellery Type *</label>
                <select name="type" value={form.type} onChange={handleChange} className="form-input form-select" required>
                  <option value="">Select type</option>
                  {['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Pendant', 'Bangle', 'Bridal Set', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Metal *</label>
                <select name="metal" value={form.metal} onChange={handleChange} className="form-input form-select" required>
                  <option value="">Select metal</option>
                  {['22K Yellow Gold', '18K Yellow Gold', '18K White Gold', '18K Rose Gold', '14K Gold', 'Platinum', 'Sterling Silver'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gemstone (if any)</label>
                <select name="gemstone" value={form.gemstone} onChange={handleChange} className="form-input form-select">
                  <option value="">Select gemstone</option>
                  {['Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Pearl', 'Polki', 'Other', 'None'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Budget Range *</label><input name="budget" placeholder="e.g., ₹50,000 - ₹1,00,000" value={form.budget} onChange={handleChange} className="form-input" required /></div>
              <div className="form-group"><label className="form-label">Size (if applicable)</label><input name="size" placeholder="e.g., Ring size 7" value={form.size} onChange={handleChange} className="form-input" /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Describe Your Design *</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="form-input form-textarea" placeholder="Describe your dream piece — design style, inspiration, any specific details..." required style={{ minHeight: '150px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Reference Image (optional)</label>
              <div style={{ border: '2px dashed var(--color-gray-300)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'border-color var(--transition-fast)', position: 'relative' }}>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setRefImage(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{refImage ? refImage.name : 'Click to upload or drag and drop'}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: '4px' }}>PNG, JPG up to 10MB</p>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>{submitting ? 'Submitting...' : 'Submit Custom Order Request'}</button>
          </form>
        </div>
      </section>
      <style>{`@media (max-width: 768px) { div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}
