import { Link } from 'react-router-dom';
import { blogPosts } from '../data/products';

export default function Blog() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2d2520)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '12px' }}>Knowledge</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-white)' }}>Blog & Guides</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px' }}>Expert advice on jewellery selection, care, and trends</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {blogPosts.map(post => (
              <article key={post.id} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-100)', transition: 'all var(--transition-base)', cursor: 'pointer' }} className="blog-card">
                <div style={{ height: '200px', background: 'linear-gradient(135deg, var(--color-beige), var(--color-cream))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                  {post.category === 'Guides' ? '📖' : post.category === 'Education' ? '🎓' : post.category === 'Trends' ? '🔥' : '💡'}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', padding: '4px 10px', background: 'var(--color-cream)', borderRadius: 'var(--radius-full)', color: 'var(--color-gold)', fontWeight: 600 }}>{post.category}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{post.readTime} read</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6, marginBottom: '16px' }}>{post.excerpt}</p>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', fontWeight: 500 }}>Read More →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        .blog-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        @media (max-width: 768px) { div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
