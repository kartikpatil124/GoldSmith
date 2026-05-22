import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2d2520)', padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '12px', fontSize: 'var(--text-lg)' }}>Our Story</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.75rem)', fontWeight: 700, color: 'var(--color-white)', marginBottom: '20px' }}>Three Generations of Excellence</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>Since 1985, we've been crafting timeless pieces that celebrate life's most precious moments.</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '8px' }}>Heritage</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '20px' }}>A Legacy of Craftsmanship</h2>
            <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '16px' }}>Founded in the heart of Mumbai's historic Zaveri Bazaar, goldsmiths Jewels began as a small family workshop dedicated to the art of fine jewellery making. Our founder, Master Craftsman Rajesh Mehta, envisioned a brand that would bring together traditional Indian artistry with contemporary design sensibilities.</p>
            <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '16px' }}>Today, three generations later, we continue to uphold his vision — creating jewellery that tells stories, marks milestones, and becomes treasured family heirlooms. Every piece that leaves our atelier carries the warmth of handcrafted excellence and the precision of modern technology.</p>
            <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8 }}>We source our gems ethically, work with certified metals, and employ master artisans who bring decades of expertise to every creation. Our commitment to authenticity, quality, and customer satisfaction remains unwavering.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '450px', aspectRatio: '4/5', borderRadius: 'var(--radius-2xl)', background: 'linear-gradient(135deg, var(--color-beige), var(--color-cream))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>🏛️</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div className="section-header">
            <p className="subtitle">What We Stand For</p>
            <h2>Our Values</h2>
            <div className="section-divider" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: '✨', title: 'Exceptional Craftsmanship', desc: 'Every piece is meticulously handcrafted by our master artisans, blending traditional techniques with modern precision.' },
              { icon: '🔍', title: 'Uncompromising Quality', desc: 'We use only BIS hallmarked metals and certified gemstones, ensuring every product meets the highest standards.' },
              { icon: '🌿', title: 'Ethical Sourcing', desc: 'Our diamonds are conflict-free and our gems are ethically sourced from trusted partners worldwide.' },
              { icon: '🤝', title: 'Customer Trust', desc: 'With over 10,000 happy customers and a legacy spanning 38+ years, trust is the foundation of everything we do.' },
              { icon: '🎨', title: 'Innovative Design', desc: 'Our design team blends heritage motifs with contemporary aesthetics, creating pieces that are both timeless and modern.' },
              { icon: '💝', title: 'Personal Touch', desc: 'From custom designs to personal consultations, we treat every customer as family, ensuring a memorable experience.' },
            ].map(value => (
              <div key={value.title} style={{ padding: '32px', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-100)', transition: 'all var(--transition-base)' }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{value.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '12px' }}>{value.title}</h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 0', background: 'var(--color-charcoal)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '12px', fontSize: 'var(--text-lg)' }}>Our Mission</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-white)', marginBottom: '20px' }}>To Create Jewellery That Becomes Legacy</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 'var(--text-lg)' }}>We believe that jewellery is more than adornment — it's an expression of love, a celebration of milestones, and a bridge between generations. Our mission is to craft pieces that carry emotions, tell stories, and become cherished family heirlooms.</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-white)', marginBottom: '16px' }}>Visit Our Showroom</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>Experience our collection in person and let our experts guide you to the perfect piece.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/contact" className="btn btn-dark btn-lg">Contact Us</Link>
            <Link to="/shop" className="btn btn-white btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>Shop Online</Link>
          </div>
        </div>
      </section>

      <style>{`@media (max-width: 768px) { .container[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
