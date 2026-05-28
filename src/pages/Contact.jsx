import { useState } from 'react';
import api from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/enquiries', form);
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting enquiry: ' + (err.message || 'Please try again'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2d2520)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '12px' }}>Get in Touch</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-white)' }}>Contact Us</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600, marginBottom: '24px' }}>We'd Love to Hear From You</h2>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '32px' }}>Whether you have a question about our collection, need help choosing the perfect piece, or want to discuss a custom order — our team is here to help.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { icon: '📍', title: 'Visit Our Showroom', info: '123 Jewellers Lane, Zaveri Bazaar\nMumbai, Maharashtra 400002' },
                  { icon: '📞', title: 'Call Us', info: '+91 91062 51842\nMon-Sat: 10 AM - 8 PM' },
                  { icon: '📧', title: 'Email Us', info: 'goldsmithvesu@gmail.com\nWe reply within 24 hours' },
                  { icon: '💬', title: 'WhatsApp', info: '+91 91062 51842\nInstant support available' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>{item.title}</h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div style={{ marginTop: '32px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '200px', background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
                📍 Google Maps Integration
              </div>

              {/* Social */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Instagram', 'Facebook', 'Pinterest', 'YouTube'].map(s => (
                    <a key={s} href="#" style={{ padding: '8px 16px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', fontWeight: 500, transition: 'all var(--transition-fast)' }}>{s}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--color-gray-500)' }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', padding: '40px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Send Us a Message</h3>
                  <div className="form-group"><label className="form-label">Full Name *</label><input name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="form-input" required /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group"><label className="form-label">Email *</label><input name="email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="form-input" required /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input name="phone" type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="form-input" /></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select name="subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="form-input form-select" required>
                      <option value="">Select a subject</option>
                      <option value="general">General Enquiry</option>
                      <option value="product">Product Enquiry</option>
                      <option value="custom">Custom Order</option>
                      <option value="repair">Repair / Service</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Message *</label><textarea name="message" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="form-input form-textarea" required /></div>
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>{submitting ? 'Sending...' : 'Send Message'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media (max-width: 768px) { .container > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
