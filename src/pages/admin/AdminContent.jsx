import { useState, useEffect } from 'react';
import api from '../../utils/api';

const SECTIONS = [
  { key: 'hero', label: 'Hero Section', icon: '🏠' },
  { key: 'banners', label: 'Homepage Banners', icon: '🖼️' },
  { key: 'about', label: 'About Page', icon: '📖' },
  { key: 'testimonials', label: 'Testimonials', icon: '⭐' },
  { key: 'promotions', label: 'Promotional Blocks', icon: '🎯' },
  { key: 'store_message', label: 'Store Message', icon: '📢' },
  { key: 'footer', label: 'Footer Content', icon: '📋' },
];

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({ title: '', subtitle: '', content: '', items: [], isActive: true });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchContent = async (section) => {
    try {
      setLoading(true);
      const res = await api.get(`/content/${section}`);
      const data = res.data || res;
      setContent(data || { title: '', subtitle: '', content: '', items: [], isActive: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeSection);
  }, [activeSection]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/content/${activeSection}`, content);
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving content: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...(content.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setContent(prev => ({
      ...prev,
      items: [...(prev.items || []), { title: '', description: '', image: '', link: '', isActive: true, order: (prev.items || []).length }]
    }));
  };

  const removeItem = (index) => {
    setContent(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Content Management</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage homepage banners, hero sections, and static page content.</p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: message.includes('Error') ? 'rgba(220,53,69,0.1)' : 'rgba(45,106,79,0.1)', color: message.includes('Error') ? 'var(--color-ruby)' : 'var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
          {message}
        </div>
      )}

      <div className="admin-content-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        {/* Section Tabs */}
        <div className="admin-content-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {SECTIONS.map(sec => (
            <button key={sec.key} onClick={() => setActiveSection(sec.key)} style={{
              padding: '12px 16px', fontSize: 'var(--text-sm)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px',
              background: activeSection === sec.key ? 'var(--color-gold)' : 'var(--color-white)',
              color: activeSection === sec.key ? 'white' : 'var(--color-gray-700)',
              border: '1px solid ' + (activeSection === sec.key ? 'var(--color-gold)' : 'var(--color-gray-100)'),
              cursor: 'pointer', fontWeight: 500, transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}>
              <span>{sec.icon}</span> {sec.label}
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '32px' }} className="admin-content-editor-card">
          {loading ? <p>Loading...</p> : (
            <form onSubmit={handleSave}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '24px' }}>
                {SECTIONS.find(s => s.key === activeSection)?.label}
              </h3>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input value={content.title || ''} onChange={e => setContent(p => ({ ...p, title: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input value={content.subtitle || ''} onChange={e => setContent(p => ({ ...p, subtitle: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Content / Description</label>
                <textarea value={content.content || ''} onChange={e => setContent(p => ({ ...p, content: e.target.value }))} className="form-input" rows="4" />
              </div>

              {/* Items / Banners */}
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Items / Banners</h4>
                  <button type="button" onClick={addItem} className="btn btn-outline-gold" style={{ fontSize: 'var(--text-xs)' }}>+ Add Item</button>
                </div>
                {(content.items || []).map((item, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', marginBottom: '12px' }}>
                    <div className="responsive-form-grid" style={{ marginBottom: '8px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Title</label>
                        <input value={item.title || ''} onChange={e => handleItemChange(i, 'title', e.target.value)} className="form-input" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Link</label>
                        <input value={item.link || ''} onChange={e => handleItemChange(i, 'link', e.target.value)} className="form-input" />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Description</label>
                      <input value={item.description || ''} onChange={e => handleItemChange(i, 'description', e.target.value)} className="form-input" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)' }}>
                        <input type="checkbox" checked={item.isActive !== false} onChange={e => handleItemChange(i, 'isActive', e.target.checked)} />
                        Active
                      </label>
                      <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: 'var(--color-ruby)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                  <input type="checkbox" checked={content.isActive !== false} onChange={e => setContent(p => ({ ...p, isActive: e.target.checked }))} />
                  Section Active
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ marginTop: '24px', width: '100%', maxWidth: '300px' }}>
                {saving ? 'Saving...' : 'Save Content'}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-content-layout {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .admin-content-tabs {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .admin-content-tabs button {
            flex-shrink: 0 !important;
          }
          .admin-content-editor-card {
            padding: 20px !important;
          }
          form button[type="submit"] {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
