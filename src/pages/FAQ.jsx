import { useState } from 'react';
import { faqs } from '../data/products';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);
  const [openItem, setOpenItem] = useState(null);

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2d2520)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '12px' }}>Help Center</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-white)' }}>Frequently Asked Questions</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {faqs.map(cat => (
              <button key={cat.category} onClick={() => { setActiveCategory(cat.category); setOpenItem(null); }} style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', border: activeCategory === cat.category ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-200)', background: activeCategory === cat.category ? 'var(--color-gold)' : 'transparent', color: activeCategory === cat.category ? 'white' : 'var(--color-gray-700)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
                {cat.category}
              </button>
            ))}
          </div>
          {/* FAQ Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.find(c => c.category === activeCategory)?.items.map((item, i) => (
              <div key={i} style={{ border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all var(--transition-fast)' }}>
                <button onClick={() => setOpenItem(openItem === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: openItem === i ? 'var(--color-gray-50)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-base)', color: 'var(--color-charcoal)', paddingRight: '16px' }}>{item.q}</span>
                  <span style={{ fontSize: '18px', color: 'var(--color-gold)', transform: openItem === i ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)', flexShrink: 0 }}>▼</span>
                </button>
                {openItem === i && (
                  <div style={{ padding: '0 24px 20px', color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 'var(--text-sm)', animation: 'fadeIn 0.2s ease-out' }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
