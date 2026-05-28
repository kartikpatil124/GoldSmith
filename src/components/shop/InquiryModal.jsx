import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function InquiryModal({ isOpen, onClose, product, initialInquiryType = 'Price Inquiry' }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    sameAsPhone: true,
    preferredContactMethod: 'WhatsApp',
    inquiryType: 'Price Inquiry',
    message: '',
    budgetRange: '',
    customizationNotes: '',
    sizeRequirements: '',
    occasion: '',
    metalPreference: '',
    stonePreference: '',
  });

  const [refImage, setRefImage] = useState(null);
  const [refImagePreview, setRefImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-fill user information if logged in
  useEffect(() => {
    if (user && isOpen) {
      setForm(prev => ({
        ...prev,
        customerName: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        whatsappNumber: user.phone || '',
      }));
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (initialInquiryType && isOpen) {
      setForm(prev => ({ ...prev, inquiryType: initialInquiryType }));
      if (initialInquiryType === 'Customization Inquiry') {
        setForm(prev => ({
          ...prev,
          message: `I am interested in requesting a customized version of this exquisite ${product?.name || 'piece'}. Please let me know the customization options and process.`,
        }));
      } else {
        setForm(prev => ({
          ...prev,
          message: `I would like to inquire about the details, pricing, and availability of the ${product?.name || 'piece'}.`,
        }));
      }
    }
  }, [initialInquiryType, product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'phone' && prev.sameAsPhone) {
        updated.whatsappNumber = value;
      }
      if (name === 'sameAsPhone' && checked) {
        updated.whatsappNumber = prev.phone;
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Attachment file size must be less than 5MB.');
        return;
      }
      setRefImage(file);
      setRefImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      let attachmentUrls = [];
      if (refImage) {
        const fd = new FormData();
        fd.append('image', refImage);
        const uploadRes = await api.post('/upload', fd);
        const url = uploadRes.data || uploadRes || '';
        if (url) {
          attachmentUrls.push(url);
        }
      }

      const submissionData = {
        ...form,
        productName: product?.name || 'General Inquiry',
        productId: product?._id || product?.id || null,
        productSku: product?.sku || '',
        attachmentUrls,
      };

      await api.post('/inquiries', submissionData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    const cleanPhone = "919876543210"; // goldsmiths business whatsapp number
    const msg = `*Goldsmiths Jewels - Premium Consultation Request*\n\n` +
      `Hello, I would like to consult with a jewellery expert regarding:\n` +
      `*Product:* ${product?.name || 'General Inquiry'}\n` +
      `*Sku:* ${product?.sku || 'N/A'}\n\n` +
      `*Customer details:*\n` +
      `- Name: ${form.customerName || 'N/A'}\n` +
      `- Email: ${form.email || 'N/A'}\n` +
      `- Phone: ${form.phone || 'N/A'}\n\n` +
      `*Consultation Preference:*\n` +
      `- Budget Target: ${form.budgetRange || 'Not specified'}\n` +
      `- Metal preference: ${form.metalPreference || 'Not specified'}\n` +
      `- Occasion: ${form.occasion || 'Not specified'}\n\n` +
      `*My Message:*\n` +
      `"${form.message}"`;
    
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const getEmailMailto = () => {
    const businessEmail = "inquiries@goldsmithsjewels.com";
    const subject = `Goldsmiths Jewels Consultation - ${product?.name || 'Bespoke'}`;
    const body = `Dear Goldsmiths Jewels Design Team,\n\n` +
      `I would like to request a premium consultation regarding the ${product?.name || 'Bespoke design'}.\n\n` +
      `*Customer details:*\n` +
      `- Name: ${form.customerName || 'N/A'}\n` +
      `- Email: ${form.email || 'N/A'}\n` +
      `- Phone: ${form.phone || 'N/A'}\n\n` +
      `*Inquiry specifications:*\n` +
      `- Type of Inquiry: ${form.inquiryType}\n` +
      `- Metal preference: ${form.metalPreference || 'N/A'}\n` +
      `- Gemstone: ${form.stonePreference || 'N/A'}\n` +
      `- Size requirements: ${form.sizeRequirements || 'N/A'}\n` +
      `- Target Budget: ${form.budgetRange || 'N/A'}\n` +
      `- Occasion: ${form.occasion || 'N/A'}\n\n` +
      `*Consultation Notes:*\n` +
      `"${form.message}"\n\n` +
      `Kind regards,\n` +
      `${form.customerName || 'Customer'}`;
    
    return `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Backdrop */}
          <motion.div 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(26, 21, 18, 0.65)',
              backdropFilter: 'blur(8px)',
            }} 
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inquiry-modal-container"
            style={{
              position: 'relative',
              width: '100%',
              background: '#FAF8F5',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid rgba(188, 156, 108, 0.3)',
            }}
          >
            {/* Header */}
            <div className="inquiry-modal-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 32px',
              borderBottom: '1px solid rgba(188, 156, 108, 0.15)',
              background: '#FAF8F5',
            }}>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '0.02em'
                }}>
                  Bespoke Consultation
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-gray-500)',
                  marginTop: '4px'
                }}>
                  Regarding: <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{product?.name}</span>
                </p>
              </div>
              <button 
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F3EFE9',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-charcoal)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E5DEC9'}
                onMouseLeave={e => e.currentTarget.style.background = '#F3EFE9'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '32px',
            }}>
              {submitted ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 0',
                }}>
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '24px',
                    animation: 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}>
                    ✨
                  </div>
                  <h4 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    color: 'var(--color-charcoal)',
                    fontWeight: 600,
                    marginBottom: '12px',
                  }}>
                    Consultation Requested
                  </h4>
                  <p style={{
                    color: 'var(--color-gray-600)',
                    maxWidth: '480px',
                    margin: '0 auto 32px',
                    lineHeight: 1.6,
                  }}>
                    Thank you. A master consultant has been assigned to your inquiry for the **{product?.name}** and will reach out shortly via your preferred channel (**{form.preferredContactMethod}**).
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <a 
                      href={getWhatsAppLink()}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-dark"
                      style={{
                        background: '#25D366',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>💬 Chat on WhatsApp</span>
                    </a>
                    <button 
                      onClick={onClose} 
                      className="btn btn-secondary"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {error && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      color: '#EF4444',
                      fontSize: '0.875rem',
                    }}>
                      {error}
                    </div>
                  )}

                  {/* SECTION 1: Customer Information */}
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '18px' }}>
                      I. Customer Information
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="inquiry-grid-2">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Full Name *</label>
                        <input name="customerName" value={form.customerName} onChange={handleChange} className="form-input" required placeholder="Enter your name" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Address *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" required placeholder="Enter your email" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Phone Number *</label>
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" required placeholder="Enter phone number" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>WhatsApp Number</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'normal', color: 'var(--color-gold)' }}>
                            <input type="checkbox" name="sameAsPhone" checked={form.sameAsPhone} onChange={handleChange} style={{ accentColor: 'var(--color-gold)' }} />
                            Same as Phone
                          </label>
                        </label>
                        <input 
                          name="whatsappNumber" 
                          type="tel" 
                          value={form.whatsappNumber} 
                          onChange={handleChange} 
                          className="form-input" 
                          disabled={form.sameAsPhone} 
                          placeholder="WhatsApp number" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Inquiry Information */}
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '18px' }}>
                      II. Consultation Settings
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="inquiry-grid-2">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Inquiry Type *</label>
                        <select name="inquiryType" value={form.inquiryType} onChange={handleChange} className="form-input form-select" required>
                          <option value="Price Inquiry">Price & Availability</option>
                          <option value="Customization Inquiry">Request Customization / Size</option>
                          <option value="Bridal Inquiry">Bridal Suite Consultation</option>
                          <option value="Bulk Order Inquiry">Bulk / Corporate Order</option>
                          <option value="Gift Inquiry">Gifting Assistance</option>
                          <option value="Appointment Inquiry">Boutique Appointment</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Preferred Contact Method *</label>
                        <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange} className="form-input form-select" required>
                          <option value="WhatsApp">WhatsApp Messaging</option>
                          <option value="Email">Email Thread</option>
                          <option value="Both">Both Email and WhatsApp</option>
                          <option value="Phone Call">Bespoke Phone Consultation</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Target Budget Range *</label>
                        <select name="budgetRange" value={form.budgetRange} onChange={handleChange} className="form-input form-select" required>
                          <option value="">Select budget range</option>
                          <option value="Below ₹50,000">Below ₹50,000</option>
                          <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                          <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                          <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                          <option value="₹5,00,000+">₹5,00,000+ (High Luxury)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Occasion *</label>
                        <select name="occasion" value={form.occasion} onChange={handleChange} className="form-input form-select" required>
                          <option value="">Select occasion</option>
                          <option value="Wedding">Bridal / Wedding</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Anniversary">Anniversary Celebration</option>
                          <option value="Birthday">Birthday Gift</option>
                          <option value="Everyday Luxury">Personal Collection / Everyday</option>
                          <option value="Other Gift">Special Gift Selection</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Customization */}
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '18px' }}>
                      III. Customization Specifications
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }} className="inquiry-grid-2">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Preferred Metal Choice</label>
                        <select name="metalPreference" value={form.metalPreference} onChange={handleChange} className="form-input form-select">
                          <option value="">Select metal</option>
                          <option value="18K Yellow Gold">18K Yellow Gold</option>
                          <option value="18K Rose Gold">18K Rose Gold</option>
                          <option value="18K White Gold">18K White Gold</option>
                          <option value="22K Yellow Gold">22K Yellow Gold (High Purity)</option>
                          <option value="Platinum">Platinum (Premium Plat 950)</option>
                          <option value="Satin/Antique Finish">Satin Finished Gold</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Gemstone Preference</label>
                        <select name="stonePreference" value={form.stonePreference} onChange={handleChange} className="form-input form-select">
                          <option value="">Select gemstone</option>
                          <option value="Natural Diamond (IF/VVS)">Natural Diamond (VVS Cert)</option>
                          <option value="Lab-Grown Diamond (VVS/VS)">Lab-Grown Diamond (Eco)</option>
                          <option value="Royal Emerald">Natural Colombian Emerald</option>
                          <option value="Pigeon Blood Ruby">Burmese Ruby</option>
                          <option value="Kashmir Sapphire">Blue Kashmir Sapphire</option>
                          <option value="No Stones">Plain Metal (No Gemstones)</option>
                        </select>
                      </div>
                      <div className="form-group inquiry-span-full" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                        <label className="form-label">Size / Length Requirements (Optional)</label>
                        <input name="sizeRequirements" value={form.sizeRequirements} onChange={handleChange} className="form-input" placeholder="e.g. Ring Size 6, Chain Length 18 inches" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Design Request Details *</label>
                      <textarea 
                        name="message" 
                        value={form.message} 
                        onChange={handleChange} 
                        className="form-input form-textarea" 
                        required 
                        placeholder="Draft your specifications or consultation query here..."
                        style={{ minHeight: '100px' }}
                      />
                    </div>

                    {/* Reference Photo Upload */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Upload Inspiration / Reference Image</label>
                      <div style={{
                        border: '1px dashed var(--color-gold)',
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        background: 'rgba(188, 156, 108, 0.04)',
                        transition: 'background var(--transition-fast)'
                      }}>
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                        {refImagePreview ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                            <img src={refImagePreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div style={{ textAlign: 'left' }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>{refImage.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{(refImage.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>📷</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Click to upload reference design (Max 5MB)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: CTAs */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderTop: '1px solid rgba(188, 156, 108, 0.15)',
                    paddingTop: '24px'
                  }}>
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="btn btn-primary btn-lg" 
                      style={{ width: '100%', height: '52px', fontWeight: 700, letterSpacing: '0.08em' }}
                    >
                      {submitting ? 'Sending Request...' : 'Send Official Inquiry'}
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="inquiry-cta-grid-2">
                      <a 
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{
                          borderColor: '#25D366',
                          color: '#25D366',
                          background: 'rgba(37, 211, 102, 0.02)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 600,
                          fontSize: 'var(--text-sm)'
                        }}
                      >
                        💬 Consult via WhatsApp
                      </a>
                      <a 
                        href={getEmailMailto()}
                        className="btn btn-secondary"
                        style={{
                          borderColor: 'var(--color-gold)',
                          color: 'var(--color-gold)',
                          background: 'rgba(188, 156, 108, 0.02)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 600,
                          fontSize: 'var(--text-sm)'
                        }}
                      >
                        ✉️ Consult via Email
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Styled Responsive Classes */}
      <style>{`
        .inquiry-modal-container {
          max-height: 85vh;
          border-radius: 20px;
          max-width: 720px;
        }

        .inquiry-grid-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }

        @media (max-width: 768px) {
          .inquiry-modal-container {
            max-height: 100vh !important;
            height: 100vh !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            border: none !important;
          }
          
          .inquiry-modal-header {
            padding: 16px 20px !important;
          }
          
          .inquiry-grid-2 {
            grid-template-columns: 1fr !important;
          }
          
          .inquiry-span-full {
            grid-column: span 1 !important;
          }

          .inquiry-cta-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
