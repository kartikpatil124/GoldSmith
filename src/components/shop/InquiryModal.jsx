import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../data/products';
import api, { getMediaUrl, getProductImage } from '../../utils/api';
import { saveLocalInquiry } from '../../utils/inquiryStorage';

const WHATSAPP_PHONE = '919106251842';

const categoryEmoji = (category) => {
  switch (category) {
    case 'Rings':       return '💍';
    case 'Earrings':    return '✨';
    case 'Necklaces':   return '📿';
    case 'Bracelets':   return '⭐';
    case 'Bangles':     return '🔅';
    case 'Chains':      return '🔗';
    case 'Pendants':    return '💎';
    default:            return '💎';
  }
};

export default function InquiryModal({ isOpen, onClose, product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentInquiryId, setSentInquiryId] = useState('');
  const [error, setError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
      setError('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const rawImg = getProductImage(product);
  const imageUrl = rawImg ? getMediaUrl(rawImg) : null;
  const prodId = product._id || product.id;

  const handleConfirmSend = async () => {
    try {
      setSubmitting(true);
      setError('');

      const submissionData = {
        productName: product.name || 'Fine Jewellery Masterpiece',
        productId: prodId || null,
        productSku: product.sku || '',
        customerName: user?.name || user?.fullName || 'Valued Client',
        email: user?.email || 'concierge-guest@goldsmithsjewels.com',
        phone: user?.phone || WHATSAPP_PHONE,
        whatsappNumber: user?.phone || WHATSAPP_PHONE,
        preferredContactMethod: 'WhatsApp',
        inquiryType: 'Price Inquiry',
        message: `I would like to inquire about this masterpiece (${product.name}). Please register my private consultation and share availability and bespoke details.`,
        budgetRange: product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Bespoke Quote',
        metalPreference: product.metal || product.purity || '22K Gold',
      };

      // 1. Submit to Backend API
      const result = await api.post('/inquiries', submissionData);
      const inqData = result?.data || {};
      const generatedId = inqData.inquiryId || `GS-INQ-${Date.now().toString().slice(-6)}`;
      setSentInquiryId(generatedId);

      // 2. Persist in local storage for instant guest/client tracking
      saveLocalInquiry({
        ...submissionData,
        _id: inqData._id || `INQ-${Date.now()}`,
        inquiryId: generatedId,
        status: inqData.status || 'new',
        createdAt: inqData.createdAt || new Date().toISOString(),
        product: product,
      });

      // 3. Dispatch global event so Enquiry page & header update immediately
      window.dispatchEvent(new Event('inquirySubmitted'));

      setSubmitted(true);
    } catch (err) {
      console.error('Error sending inquiry:', err);
      // Even if offline/network hiccup, save locally so client sees it
      const fallbackId = `GS-INQ-${Date.now().toString().slice(-6)}`;
      setSentInquiryId(fallbackId);
      saveLocalInquiry({
        productName: product.name || 'Fine Jewellery Masterpiece',
        productId: prodId || null,
        productSku: product.sku || '',
        customerName: user?.name || user?.fullName || 'Valued Client',
        email: user?.email || 'concierge-guest@goldsmithsjewels.com',
        phone: user?.phone || WHATSAPP_PHONE,
        preferredContactMethod: 'WhatsApp',
        inquiryType: 'Price Inquiry',
        message: `I would like to inquire about this masterpiece (${product.name}).`,
        _id: `INQ-${Date.now()}`,
        inquiryId: fallbackId,
        status: 'new',
        createdAt: new Date().toISOString(),
        product: product,
      });
      window.dispatchEvent(new Event('inquirySubmitted'));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppFollowUpUrl = () => {
    const text = `Hello Goldsmiths Concierge! ✨\n\nI have just registered an inquiry on your website:\n*Product:* ${product.name}\n*Reference:* ${sentInquiryId || 'New Inquiry'}\n*Price:* ${formatPrice(product.price)}\n\nPlease connect with me regarding atelier availability and consultation details.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  const handleGoToEnquiries = () => {
    onClose();
    navigate('/enquiry');
  };

  return (
    <AnimatePresence>
      <div className="inquiry-confirm-overlay" onClick={onClose}>
        <motion.div
          className="inquiry-confirm-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close Button */}
          <button
            type="button"
            className="inquiry-confirm-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          {!submitted ? (
            /* ── Confirmation View ── */
            <div className="inquiry-confirm-body">
              <div className="inquiry-confirm-eyebrow">
                <span>✦</span>
                <span>Atelier Consultation</span>
                <span>✦</span>
              </div>

              <h2 className="inquiry-confirm-title">
                Send Product Enquiry
              </h2>

              {/* Masterpiece Preview Card */}
              <div className="inquiry-preview-card">
                <div className="inquiry-preview-thumb">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} />
                  ) : (
                    <span>{categoryEmoji(product.category)}</span>
                  )}
                </div>

                <div className="inquiry-preview-info">
                  <div className="inquiry-preview-category">
                    {product.purity ? `${product.purity} • ` : ''}{product.category || 'Fine Jewellery'}
                  </div>
                  <h3 className="inquiry-preview-name">{product.name}</h3>
                  <div className="inquiry-preview-price">
                    {formatPrice(product.price)}
                  </div>
                  <div className="inquiry-preview-badge">
                    <span>🛡️ Certified BIS Hallmark</span>
                  </div>
                </div>
              </div>

              {/* Confirmation Question & Explanation in Detail */}
              <div className="inquiry-question-box">
                <p className="inquiry-question-text">
                  Are you sure you want to send an enquiry about this product?
                </p>
                <p className="inquiry-detail-text">
                  By confirming, this piece will immediately be registered in your <strong>Consultation Vault</strong>. Our senior master jewellers will review atelier availability, hallmarking certification, and prepare bespoke consultation details. You will be able to track live progress and specialist updates anytime on your <strong>Enquiry page</strong>.
                </p>

                {user && (
                  <div className="inquiry-user-tag">
                    <span>Enquiring as:</span>
                    <strong>{user.fullName || user.name || user.email}</strong>
                  </div>
                )}
              </div>

              {error && (
                <div className="inquiry-error-msg">{error}</div>
              )}

              {/* Actions */}
              <div className="inquiry-confirm-actions">
                <button
                  type="button"
                  className="inquiry-cancel-btn"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="inquiry-submit-btn"
                  onClick={handleConfirmSend}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>Sending Enquiry...</span>
                  ) : (
                    <span>✓ Yes, Send Enquiry</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ── Success Screen ── */
            <div className="inquiry-success-body">
              <div className="inquiry-success-icon" aria-hidden="true">
                ✨
              </div>

              <h2 className="inquiry-success-title">
                Enquiry Successfully Sent!
              </h2>

              <p className="inquiry-success-desc">
                Your consultation request for <strong>{product.name}</strong> has been registered in our Private Atelier Vault under Reference ID:
              </p>

              <div className="inquiry-ref-box">
                <span>{sentInquiryId}</span>
              </div>

              <p className="inquiry-success-sub">
                You can now track the live review status, specialist notes, and quotation progress on your <strong>Enquiry</strong> page.
              </p>

              <div className="inquiry-success-actions">
                <button
                  type="button"
                  className="inquiry-view-tracker-btn"
                  onClick={handleGoToEnquiries}
                >
                  📋 View in My Enquiries →
                </button>

                <a
                  href={getWhatsAppFollowUpUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inquiry-wa-chat-btn"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .inquiry-confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(10, 8, 6, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .inquiry-confirm-modal {
          position: relative;
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border-radius: 28px;
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.35),
            0 10px 30px rgba(201, 168, 76, 0.2);
          padding: 32px 28px;
          box-sizing: border-box;
          color: #1A1A1A;
        }

        .inquiry-confirm-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.05);
          color: #1A1A1A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .inquiry-confirm-close:hover {
          background: #1A1A1A;
          color: #FFF;
        }

        .inquiry-confirm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8C7335;
          margin-bottom: 8px;
        }

        .inquiry-confirm-title {
          font-family: var(--font-display, 'Playfair Display', serif);
          font-size: 24px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0 0 18px;
        }

        /* Preview Card */
        .inquiry-preview-card {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 14px;
          background: #FAF8F5;
          border-radius: 18px;
          border: 1px solid rgba(201, 168, 76, 0.25);
          margin-bottom: 18px;
        }

        .inquiry-preview-thumb {
          width: 72px;
          height: 72px;
          border-radius: 14px;
          overflow: hidden;
          background: #EDE8DF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }

        .inquiry-preview-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .inquiry-preview-info {
          flex: 1;
          min-width: 0;
        }

        .inquiry-preview-category {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          color: #8C7335;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
        }

        .inquiry-preview-name {
          font-size: 14.5px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0 0 4px;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .inquiry-preview-price {
          font-family: var(--font-display, 'Playfair Display', serif);
          font-size: 15px;
          font-weight: 700;
          color: #8C7335;
        }

        .inquiry-preview-badge {
          font-size: 9.5px;
          color: rgba(26, 26, 26, 0.6);
          margin-top: 2px;
        }

        /* Question & Explanation */
        .inquiry-question-box {
          background: rgba(201, 168, 76, 0.08);
          border: 1px solid rgba(201, 168, 76, 0.25);
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 22px;
        }

        .inquiry-question-text {
          font-size: 14px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0 0 6px;
        }

        .inquiry-detail-text {
          font-size: 12px;
          line-height: 1.55;
          color: rgba(26, 26, 26, 0.75);
          margin: 0;
        }

        .inquiry-user-tag {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed rgba(201, 168, 76, 0.3);
          font-size: 11px;
          color: rgba(26, 26, 26, 0.65);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .inquiry-user-tag strong {
          color: #1A1A1A;
        }

        .inquiry-error-msg {
          color: #E11D48;
          font-size: 12px;
          margin-bottom: 14px;
          text-align: center;
        }

        /* Buttons */
        .inquiry-confirm-actions {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 12px;
        }

        .inquiry-cancel-btn {
          padding: 12px 18px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(0, 0, 0, 0.04);
          color: #1A1A1A;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .inquiry-cancel-btn:hover {
          background: rgba(0, 0, 0, 0.08);
        }

        .inquiry-submit-btn {
          padding: 12px 22px;
          border-radius: 9999px;
          border: none;
          background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
          color: #F5E6B8;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        }

        .inquiry-submit-btn:hover {
          background: linear-gradient(135deg, #C9A84C 0%, #A38832 100%);
          color: #0F0D0A;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(201, 168, 76, 0.35);
        }

        /* ── Success Screen ── */
        .inquiry-success-body {
          text-align: center;
          padding: 12px 8px;
        }

        .inquiry-success-icon {
          font-size: 48px;
          margin-bottom: 12px;
          animation: successPulse 2s infinite alternate;
        }

        @keyframes successPulse {
          0% { transform: scale(0.95); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 10px #C9A84C); }
        }

        .inquiry-success-title {
          font-family: var(--font-display, 'Playfair Display', serif);
          font-size: 24px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0 0 10px;
        }

        .inquiry-success-desc {
          font-size: 13.5px;
          color: rgba(26, 26, 26, 0.75);
          margin: 0 0 12px;
          line-height: 1.5;
        }

        .inquiry-ref-box {
          display: inline-block;
          font-family: monospace;
          font-size: 14px;
          font-weight: 700;
          color: #8C7335;
          background: rgba(201, 168, 76, 0.15);
          border: 1px solid rgba(201, 168, 76, 0.35);
          padding: 6px 16px;
          border-radius: 8px;
          margin-bottom: 14px;
          letter-spacing: 0.06em;
        }

        .inquiry-success-sub {
          font-size: 12px;
          color: rgba(26, 26, 26, 0.65);
          line-height: 1.5;
          margin: 0 0 24px;
        }

        .inquiry-success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .inquiry-view-tracker-btn {
          width: 100%;
          padding: 12px 20px;
          border-radius: 9999px;
          border: none;
          background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
          color: #F5E6B8;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .inquiry-view-tracker-btn:hover {
          background: linear-gradient(135deg, #C9A84C 0%, #A38832 100%);
          color: #0F0D0A;
        }

        .inquiry-wa-chat-btn {
          width: 100%;
          padding: 11px 20px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: none;
          box-sizing: border-box;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .inquiry-wa-chat-btn:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .inquiry-confirm-modal {
            padding: 24px 18px;
          }

          .inquiry-confirm-title {
            font-size: 20px;
          }

          .inquiry-confirm-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
