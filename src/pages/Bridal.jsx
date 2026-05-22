import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { products } from '../data/products';
import api, { getMediaUrl } from '../utils/api';
import { useSite } from '../context/SiteContext';

export default function Bridal() {
  const { pageContent, banners, homepageConfig, fetchPageContent, refreshSiteData } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: 'In-Store Private Salon',
    preferredDate: '',
    preferredTime: '02:00 PM - 04:00 PM',
    metalPreference: '18K Yellow Gold',
    budget: '₹5,00,000 - ₹10,00,000',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('cut');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [liveBridalProducts, setLiveBridalProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch custom page content for bridal
    fetchPageContent('bridal');

    // Make sure we have latest banners and homepage configurations
    refreshSiteData();

    const fetchBridal = async () => {
      try {
        const res = await api.get('/products?limit=200');
        const allProducts = res.products || res.data?.products || res || [];
        // Filter by placement tag 'bridal' or occasion
        const filtered = allProducts.filter(p => 
          (p.placements && p.placements.includes('bridal')) || 
          p.occasion === 'Bridal'
        );
        setLiveBridalProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch bridal products', err);
      }
    };
    fetchBridal();
  }, []);

  const bridalContent = pageContent?.['bridal'] || {};

  // Find active bridal banners
  const activeHeroBanner = banners?.find(
    b => b.pageKey === 'bridal' && b.position === 'hero' && b.isActive
  );
  
  const activeMidBanner = banners?.find(
    b => b.pageKey === 'bridal' && b.position === 'mid' && b.isActive
  );

  // Hero customizable elements
  const heroTitle = bridalContent.hero?.title || activeHeroBanner?.title || 'Where Forever Begins';
  const heroSubtitle = bridalContent.hero?.subtitle || activeHeroBanner?.subtitle || 'The Bridal Salon';
  const heroBody = bridalContent.hero?.body || activeHeroBanner?.body || 'Welcome to a sanctuary of eternal romance. Discover our bespoke wedding bands, heirloom-grade bridal suites, and GIA certified solitaire engagement rings crafted to capture the essence of your devotion.';
  const heroCTAText = bridalContent.hero?.ctaText || activeHeroBanner?.ctaText || 'Book a Private Consultation';

  // Background Image Resolution
  const heroBgImage = activeHeroBanner?.image 
    ? getMediaUrl(activeHeroBanner.image) 
    : (bridalContent.hero?.image 
        ? getMediaUrl(bridalContent.hero.image) 
        : '/bridal-hero-bg.jpg');

  // Showcase section customizable elements
  const showcaseSubtitle = bridalContent.showcase?.subtitle || 'goldsmiths Bridal Curation';
  const showcaseTitle = bridalContent.showcase?.title || 'The Wedding Collections';
  const showcaseBody = bridalContent.showcase?.body || 'Explore an elite curation of high-jewelry necklace sets, royal crowns, and premium platinum wedding bands, each hallmarked and certified to the highest international standards.';

  // Resolve Products (Live Filtered -> Homepage Spotlight Fallback -> Static Data Fallback)
  const spotlightSection = homepageConfig?.sections?.find(s => s.sectionKey === 'bridal_spotlight');
  const spotlightProducts = spotlightSection?.resolvedProducts || [];

  const bridalProducts = liveBridalProducts.length > 0 
    ? liveBridalProducts 
    : (spotlightProducts.length > 0 
        ? spotlightProducts 
        : products.filter(p => [3, 11, 13, 16].includes(p.id)));

  // Diamond quality section text
  const diamondEducationSubtitle = bridalContent.diamond_education?.subtitle || 'Diamond Quality Education';
  const diamondEducationTitle = bridalContent.diamond_education?.title || 'Understanding The 4 Cs';
  const diamondEducationBody = bridalContent.diamond_education?.body || 'Every diamond selected for a goldsmiths setting undergoes rigorous hand-inspection by certified gemologists. Before choosing your ideal stone, learn how each quality attribute shapes its aesthetic character.';

  // Diamond quality details (Standard GIA Guide static data)
  const defaultDiamondGuide = {
    cut: {
      title: 'Diamond Cut',
      subtitle: 'The shape and precision that releases a diamond\'s inner fire.',
      content: 'Cut is widely considered the most critical of the 4 Cs because it directly determines the brilliance, fire, and scintillation of the stone. A diamond cut with precise proportions behaves like a mirror, reflecting light back up to the viewer rather than allowing it to leak out the bottom. goldsmiths features premium GIA certified Ideal and Excellent cuts.',
      badge: 'Brilliance Multiplier: 100%'
    },
    color: {
      title: 'Diamond Color',
      subtitle: 'The subtle presence of natural body color within the gem.',
      content: 'True luxury demands the absolute absence of color. The GIA color scale ranges from D (completely colorless) to Z (light yellow or brown). At goldsmiths, we selectively stock diamonds within the colorless D-F tier and premium near-colorless G-H ranges, ensuring that no trace of nitrogen body color interferes with the pristine reflection of white light.',
      badge: 'D-F Colorless Selection'
    },
    clarity: {
      title: 'Diamond Clarity',
      subtitle: 'The organic signature of crystals and microscopic marks of nature.',
      content: 'Every natural diamond bears the unique markings of its high-pressure origin deep within the Earth. Clarity measures the visibility of these microscopic inclusions. Our standard selections bypass heavy blemishes entirely, offering only internally flawless (IF) down to very slightly included (VS1/VS2) diamonds which remain visually clean to the naked eye.',
      badge: 'VS2 to IF Eye-Clean Guarantee'
    },
    carat: {
      title: 'Carat Weight',
      subtitle: 'The measurement of a diamond\'s volume and physical mass.',
      content: 'Carat represents the weight of the diamond, where 1 carat equals 0.2 grams. Because larger crystals are exponentially rarer in nature, diamond pricing escalates progressively with size. We provide custom procurement, letting you source diamonds from 0.50ct up to magnificent 10ct+ investment-grade solitaires framed in platinum.',
      badge: '0.5ct to 10ct+ Custom Procurement'
    }
  };

  // Convert custom items from PageContent into a Diamond Guide map if configured
  const getDiamondGuide = () => {
    const section = bridalContent.diamond_education;
    if (section && section.items && section.items.length > 0) {
      const guide = {};
      const keys = ['cut', 'color', 'clarity', 'carat'];
      section.items.forEach((item, index) => {
        const key = keys[index] || `c_${index}`;
        guide[key] = {
          title: item.title || defaultDiamondGuide[key]?.title || '',
          subtitle: item.link || defaultDiamondGuide[key]?.subtitle || '',
          content: item.description || defaultDiamondGuide[key]?.content || '',
          badge: item.image || defaultDiamondGuide[key]?.badge || ''
        };
      });
      return { ...defaultDiamondGuide, ...guide };
    }
    return defaultDiamondGuide;
  };

  const currentDiamondGuide = getDiamondGuide();

  // Bespoke section text customization
  const bespokeTitle = bridalContent.bespoke?.title || 'Bespoke Bridal Atelier';
  const bespokeBody = bridalContent.bespoke?.body || 'If you have a specific dream in mind, let our master artisans bring it to life. Work one-on-one with a goldsmiths designer to custom draft your rings, select certified center stones, and watch your heirloom piece materialize from 3D CAD design into precious platinum or gold.';
  const bespokeCTAText = bridalContent.bespoke?.ctaText || 'Book Consultation';
  const bespokeSecondaryCTAText = bridalContent.bespoke?.ctaSecondaryText || 'Submit Custom Design';
  const bespokeSecondaryCTALink = bridalContent.bespoke?.ctaSecondaryLink || '/custom-order';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const compositeDescription = `[BRIDAL APPOINTMENT BOOKING]
- Consultation Type: ${formData.appointmentType}
- Selected Schedule: ${formData.preferredDate} (${formData.preferredTime})
- Metal Preference: ${formData.metalPreference}
- Additional Requirements: ${formData.notes || 'None specified'}`;

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        budget: formData.budget,
        description: compositeDescription
      };

      const response = await api.post('/custom-requests', payload);
      
      setSubmitted(true);
      const generatedRef = response._id || response.id || `LUMI-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketRef(generatedRef);
    } catch (err) {
      console.error(err);
      setErrorMsg('Unable to process your request. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Bridal Hero Section */}
      <section style={{
        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${heroBgImage}") center/cover no-repeat, linear-gradient(135deg, #2d2325 0%, #150f10 100%)`,
        padding: '120px 0',
        textAlign: 'center',
        color: 'var(--color-white)',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            fontFamily: 'var(--font-accent)', color: 'var(--color-gold-shine)', fontSize: 'var(--text-lg)',
            fontStyle: 'italic', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '16px'
          }}>{heroSubtitle}</span>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'calc(var(--text-4xl) + 12px)', fontWeight: 700,
            letterSpacing: '0.05em', marginBottom: '24px', textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            whiteSpace: 'pre-line'
          }}>{heroTitle}</h1>
          <p style={{
            color: 'var(--color-gray-200)', fontSize: 'var(--text-lg)', maxWidth: '700px',
            margin: '0 auto 40px', lineHeight: 1.8, fontWeight: 300
          }}>{heroBody}</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-lg" style={{ animation: 'pulse-gold 2s infinite' }}>
            {heroCTAText}
          </button>
        </div>
      </section>

      {/* Dynamic Products Showcase Curation */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '48px' }}>
            <span className="subtitle" style={{ color: 'var(--color-gold)' }}>{showcaseSubtitle}</span>
            <h2>{showcaseTitle}</h2>
            <div className="section-divider" />
            <p>{showcaseBody}</p>
          </div>

          {bridalProducts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', padding: '40px' }}>
              Special jewelry creations are currently in cataloging. Please visit again soon.
            </p>
          ) : (
            <div className="product-grid">
              {bridalProducts.map(p => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Secondary Layout Banner (Mid-position) */}
      {activeMidBanner && (
        <section style={{
          position: 'relative',
          height: '400px',
          background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${getMediaUrl(activeMidBanner.image)}) center/cover no-repeat fixed`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-white)',
          textAlign: 'center',
          padding: '0 20px',
          borderTop: '1px solid rgba(201, 168, 76, 0.15)',
          borderBottom: '1px solid rgba(201, 168, 76, 0.15)'
        }}>
          <div>
            {activeMidBanner.subtitle && (
              <span style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-gold-shine)',
                fontSize: 'var(--text-md)',
                fontStyle: 'italic',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px'
              }}>{activeMidBanner.subtitle}</span>
            )}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'calc(var(--text-3xl) + 4px)',
              fontWeight: 700,
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>{activeMidBanner.title}</h2>
            {activeMidBanner.body && (
              <p style={{
                maxWidth: '650px',
                margin: '0 auto 28px',
                fontSize: 'var(--text-base)',
                lineHeight: 1.7,
                fontWeight: 300,
                color: 'var(--color-gray-200)'
              }}>{activeMidBanner.body}</p>
            )}
            {activeMidBanner.ctaText && (
              <Link to={activeMidBanner.ctaLink || '/shop'} className="btn btn-primary btn-lg">
                {activeMidBanner.ctaText}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* GIA Diamond Education Portal (The 4 Cs) */}
      <section style={{ background: 'var(--color-white)', padding: '80px 0', borderTop: '1px solid var(--color-gray-200)', borderBottom: '1px solid var(--color-gray-200)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="bridal-layout-cols">
            <div>
              <span style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)', fontSize: 'var(--text-base)', fontStyle: 'italic', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{diamondEducationSubtitle}</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '16px' }}>{diamondEducationTitle}</h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.8, marginBottom: '32px' }}>{diamondEducationBody}</p>

              {/* Tabs list */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '12px', marginBottom: '24px' }}>
                {Object.keys(currentDiamondGuide).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '10px 16px', fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: activeTab === tab ? '2px solid var(--color-gold)' : '2px solid transparent',
                    color: activeTab === tab ? 'var(--color-gold)' : 'var(--color-gray-500)',
                    transition: 'all var(--transition-fast)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Display Panel */}
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {currentDiamondGuide[activeTab]?.badge && (
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', fontSize: 'var(--text-xs)', fontWeight: 600, background: 'var(--color-cream)',
                    color: 'var(--color-gold-dark)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gold-light)', marginBottom: '16px'
                  }}>
                    {currentDiamondGuide[activeTab].badge}
                  </span>
                )}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '12px' }}>
                  {currentDiamondGuide[activeTab]?.title}
                </h3>
                {currentDiamondGuide[activeTab]?.subtitle && (
                  <p style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', color: 'var(--color-gold-dark)', marginBottom: '12px', fontSize: 'var(--text-base)' }}>
                    "{currentDiamondGuide[activeTab].subtitle}"
                  </p>
                )}
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
                  {currentDiamondGuide[activeTab]?.content}
                </p>
              </div>
            </div>

            {/* Interactive Carat/Cut Demonstration Illustration */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #201a1c 100%)',
              padding: '48px',
              borderRadius: 'var(--radius-xl)',
              color: 'var(--color-white)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '16px', left: '24px', color: 'var(--color-gold)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Virtual Atelier</div>
              
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                {activeTab === 'cut' && (
                  <div style={{ animation: 'pulse-gold 3s infinite', fontSize: '100px', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.4))' }}>💎</div>
                )}
                {activeTab === 'color' && (
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '64px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}>💎</div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', display: 'block', marginTop: '8px' }}>D-Colorless</span>
                    </div>
                    <div style={{ textAlign: 'center', opacity: 0.5 }}>
                      <div style={{ fontSize: '64px', filter: 'sepia(0.6) hue-rotate(10deg)' }}>💎</div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', display: 'block', marginTop: '8px' }}>M-Tinted</span>
                    </div>
                  </div>
                )}
                {activeTab === 'clarity' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '96px', filter: 'blur(0.5px)' }}>🔍💎</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-gold)', marginTop: '8px', letterSpacing: '0.05em' }}>NO VISIBLE INCLUSIONS UNDER 10X MAGNIFICATION</div>
                  </div>
                )}
                {activeTab === 'carat' && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-white) 0%, transparent 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 8px' }}>💎</div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>0.50 Carat</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-white) 0%, transparent 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 8px' }}>💎</div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gold)' }}>1.50 Carat</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-white) 0%, transparent 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', margin: '0 auto 8px' }}>💎</div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>3.00 Carat</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', marginTop: '24px' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gold)', marginBottom: '4px' }}>goldsmiths Diamond Certification</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', lineHeight: 1.6 }}>All central diamonds exceed 0.30 carats and feature laser-inscribed certificates of authenticity issued directly by GIA or IGI laboratory councils.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Bespoke Bridal Atelier Intro Section */}
      <section className="section bg-cream" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '16px' }}>{bespokeTitle}</h2>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)', lineHeight: 1.8, marginBottom: '32px' }}>{bespokeBody}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">{bespokeCTAText}</button>
            <Link to={bespokeSecondaryCTALink} className="btn btn-secondary">{bespokeSecondaryCTAText}</Link>
          </div>
        </div>
      </section>

      {/* Consultation Booking Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-modal)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out', padding: '16px'
        }}>
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(10, 10, 10, 0.7)', backdropFilter: 'blur(8px)'
          }} />

          {/* Modal Container */}
          <div style={{
            position: 'relative', width: '100%', maxWidth: '650px', backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-2xl)', overflow: 'hidden', zIndex: 1,
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-charcoal) 0%, #201a1c 100%)',
              padding: '24px 32px', color: 'var(--color-white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>Private Bridal Salon Consultation</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold-light)', marginTop: '4px' }}>Complimentary, personalized bespoke design slot</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--color-white)', fontSize: '24px', cursor: 'pointer', background: 'none', border: 'none' }} aria-label="Close modal">✕</button>
            </div>

            <div style={{ padding: '32px', maxHeight: '75vh', overflowY: 'auto' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px'
                  }}>✓</div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '8px' }}>Your Consultation is Requested</h4>
                  <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: '24px' }}>
                    Thank you, {formData.name}. We have logged your appointment request in the database. A dedicated concierge will review your notes and contact you within 24 hours to confirm your private salon slot.
                  </p>
                  
                  <div style={{
                    background: 'var(--color-gray-50)', border: '1px dashed var(--color-gray-300)', borderRadius: 'var(--radius-lg)',
                    padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left', marginBottom: '24px'
                  }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', display: 'block' }}>Ticket reference</span>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{ticketRef}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', display: 'block' }}>Consultation type</span>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{formData.appointmentType}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', display: 'block' }}>Preferred date</span>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{formData.preferredDate}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', display: 'block' }}>Selected slot</span>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{formData.preferredTime}</strong>
                    </div>
                  </div>

                  <button onClick={() => { setSubmitted(false); setIsModalOpen(false); }} className="btn btn-primary">Return to Salon</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMsg && (
                    <div style={{
                      backgroundColor: 'rgba(155, 27, 48, 0.1)', color: 'var(--color-error)', padding: '12px 16px',
                      borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: '20px', border: '1px solid rgba(155,27,48,0.2)'
                    }}>{errorMsg}</div>
                  )}

                  {/* Dual Grid Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="modal-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-name">Full Name *</label>
                      <input id="bridal-name" type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-email">Email Address *</label>
                      <input id="bridal-email" type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="name@email.com" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="modal-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-phone">Phone Number *</label>
                      <input id="bridal-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" placeholder="+91 99999 99999" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-type">Consultation Type</label>
                      <select id="bridal-type" name="appointmentType" value={formData.appointmentType} onChange={handleChange} className="form-input form-select">
                        <option value="In-Store Private Salon">In-Store Private Salon (Mumbai)</option>
                        <option value="Virtual Video Consultation">Virtual Video Consultation (Zoom)</option>
                        <option value="Standard Telephone Appointment">Telephone Call (Standard)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="modal-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-date">Preferred Date *</label>
                      <input id="bridal-date" type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-time">Preferred Time Slot</label>
                      <select id="bridal-time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} className="form-input form-select">
                        <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                        <option value="12:00 PM - 02:00 PM">Midday (12:00 PM - 02:00 PM)</option>
                        <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                        <option value="04:00 PM - 06:00 PM">Late Afternoon (04:00 PM - 06:00 PM)</option>
                        <option value="06:00 PM - 08:00 PM">Evening (06:00 PM - 08:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="modal-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-metal">Metal Tone Vibe</label>
                      <select id="bridal-metal" name="metalPreference" value={formData.metalPreference} onChange={handleChange} className="form-input form-select">
                        <option value="18K Yellow Gold">18K Yellow Gold</option>
                        <option value="22K Antique Yellow Gold">22K Antique Traditional Gold</option>
                        <option value="18K White Gold">18K White Gold</option>
                        <option value="18K Rose Gold">18K Rose Gold</option>
                        <option value="950 Platinum">Platinum (Pt 950)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="bridal-budget">Estimated Budget Tier</label>
                      <select id="bridal-budget" name="budget" value={formData.budget} onChange={handleChange} className="form-input form-select">
                        <option value="Under ₹2,00,000">Under ₹2,00,000</option>
                        <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
                        <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                        <option value="₹10,00,000 - ₹25,00,000">₹10,00,000 - ₹25,00,000</option>
                        <option value="Above ₹25,00,000">Bespoke (Above ₹25,00,000)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" htmlFor="bridal-notes">Design Notes / Custom Gemstone Cut Ideas</label>
                    <textarea id="bridal-notes" name="notes" value={formData.notes} onChange={handleChange} className="form-input form-textarea" placeholder="E.g. I am seeking a 1.5 carat pear-cut solitaire engagement ring set in platinum with a round brilliant halo..." />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                    {loading ? 'Submitting Appointment...' : 'Request Salon Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styled Responsive Overlay Layout */}
      <style>{`
        @media (max-width: 768px) {
          .bridal-layout-cols {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .modal-form-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
