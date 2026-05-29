import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Gem, Clock } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { getMediaUrl } from '../utils/api';
import ProductCard from '../components/shop/ProductCard';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const categories = [
  { id: 1, name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmluZ3xlbnwwfHwwfHx8MA%3D%3D', link: '/shop?category=rings' },
  { id: 2, name: 'Necklaces', image: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5lY2tsYWNlfGVufDB8fDB8fHww', link: '/shop?category=necklaces' },
  { id: 3, name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80', link: '/shop?category=earrings' },
  { id: 4, name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80', link: '/shop?category=bracelets' }
];

export default function Home() {
  const { homepageConfig, banners, loading, refreshSiteData } = useSite();

  useEffect(() => {
    refreshSiteData();
  }, []);

  // Find active hero banner for background customization
  const activeHeroBanner = banners?.find(
    b => b.pageKey === 'home' && b.position === 'hero' && b.isActive
  );
  
  const heroBgImage = (activeHeroBanner?.image && activeHeroBanner.image.trim())
    ? getMediaUrl(activeHeroBanner.image.trim())
    : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&auto=format&fit=crop&q=80";

  // Use dynamic homepage configuration or fallback defaults
  const heroTitle = homepageConfig?.heroTitle || 'Elegance Forged in Eternity';
  const heroSubtitle = homepageConfig?.heroSubtitle || 'Discover our exclusive collection of handcrafted fine jewellery, designed to celebrate your most precious moments.';
  const heroCTAText = homepageConfig?.heroCTAText || 'Explore Collection';
  const heroCTALink = homepageConfig?.heroCTALink || '/shop';
  const heroSecondaryCTAText = homepageConfig?.heroSecondaryCTAText || 'Bespoke Design';
  const heroSecondaryCTALink = homepageConfig?.heroSecondaryCTALink || '/custom-order';

  const sections = homepageConfig?.sections || [];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <img 
            src={heroBgImage} 
            alt={activeHeroBanner?.title || "Luxury Jewellery"}
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&auto=format&fit=crop&q=80"; }}
          />
          <div className="home-hero-overlay"></div>
        </div>
        
        <div className="home-hero-content container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span variants={fadeUp} className="text-uppercase text-gold mb-4 block" style={{letterSpacing: '0.3em'}}>
              {activeHeroBanner?.subtitle || 'Welcome to goldsmiths'}
            </motion.span>
            <motion.h1 variants={fadeUp} className="home-hero-title heading-display" style={{ whiteSpace: 'pre-line' }}>
              {heroTitle}
            </motion.h1>
            <motion.p variants={fadeUp} className="home-hero-desc">
              {heroSubtitle}
            </motion.p>
            <motion.div variants={fadeUp} className="home-hero-actions">
              <Link to={heroCTALink} className="btn btn-primary btn-lg">
                {heroCTAText}
              </Link>
              <Link to={heroSecondaryCTALink} className="btn btn-white btn-lg">
                {heroSecondaryCTAText}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features/Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: Shield, title: 'Certified Authenticity', desc: '100% genuine hallmarked jewellery' },
              { icon: Gem, title: 'Ethical Sourcing', desc: 'Conflict-free diamonds & metals' },
              { icon: Star, title: 'Lifetime Warranty', desc: 'On all manufacturing defects' },
              { icon: Clock, title: 'Secure Delivery', desc: 'Fully insured express shipping' }
            ].map((feature, i) => (
              <div key={i} className="trust-item">
                <feature.icon className="trust-icon" />
                <h3 className="trust-title">{feature.title}</h3>
                <p className="trust-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-cream">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Curated Collections</span>
            <h2>Shop by Category</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category.id} to={category.link} className="category-card">
                <img 
                  src={category.image} 
                  alt={category.name} 
                />
                <div className="category-overlay">
                  <h3 className="category-title">{category.name}</h3>
                  <span className="category-link-text">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About/Story Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="about-layout">
            <div className="about-image-wrapper">
              <div className="about-image-inner">
                <img 
                  src="https://images.unsplash.com/photo-1601121141418-c1caa10a2a0b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZG1hZGUlMjBqZXdlbGxlcnl8ZW58MHx8MHx8fDA%3D" 
                  alt="Jewellery Crafting" 
                />
              </div>
            </div>
            <div className="about-content">
              <span className="about-subtitle">Our Heritage</span>
              <h2 className="about-title">Masterpieces of Unparalleled Beauty</h2>
              <p className="about-text">
                For over three generations, goldsmiths has been synonymous with exquisite craftsmanship and timeless design. Every piece in our collection tells a story of passion, precision, and the relentless pursuit of perfection.
              </p>
              <p className="about-text">
                We blend traditional artistry with modern innovation to create jewellery that transcends generations. From sourcing the finest gemstones to the final polish, our master artisans pour their heart into every detail.
              </p>
              <Link to="/about" className="btn btn-outline-gold btn-lg mt-4" style={{display: 'inline-flex'}}>
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Merchandising Sections from HomepageConfig */}
      {sections.filter(sec => sec.isVisible).sort((a, b) => a.order - b.order).map((section) => {
        const products = section.resolvedProducts || [];
        const isDark = section.bgStyle === 'dark';
        
        return (
          <section key={section.sectionKey} className={`section bg-${section.bgStyle || 'cream'}`}>
            <div className="container">
              <div className="section-header">
                <span className="subtitle" style={{ color: isDark ? 'var(--color-gold-light)' : 'var(--color-gold)' }}>
                  {section.subtitle}
                </span>
                <h2 style={{ color: isDark ? 'var(--color-white)' : 'var(--color-charcoal)' }}>
                  {section.title}
                </h2>
                <div className="section-divider"></div>
              </div>
              
              {products.length === 0 ? (
                <p style={{ textAlign: 'center', color: isDark ? 'var(--color-gray-400)' : 'var(--color-gray-500)', fontSize: 'var(--text-sm)', padding: '40px' }}>
                  New items arriving soon. Explore our other luxury collections.
                </p>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>
              )}
              
              {section.showViewAll && (
                <div className="text-center mt-12">
                  <Link to={section.viewAllLink || '/shop'} className={`btn btn-${isDark ? 'white' : 'primary'} btn-lg`}>
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Newsletter / CTA */}
      <section className="section newsletter-section">
        <div className="newsletter-bg">
          <img 
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80" 
            alt="Background Overlay" 
          />
        </div>
        <div className="container newsletter-content">
          <Star className="newsletter-icon" />
          <h2 className="newsletter-title">Join the goldsmiths Privilege Club</h2>
          <p className="newsletter-desc">
            Subscribe to receive insider access to new collections, exclusive events, and bespoke styling advice.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button type="submit" className="btn btn-primary btn-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}