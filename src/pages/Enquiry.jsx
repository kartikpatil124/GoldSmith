import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Silk from '../components/ui/Silk';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import api, { getMediaUrl, getProductImage } from '../utils/api';
import { getLocalInquiries } from '../utils/inquiryStorage';
import { socket, joinUserRoom } from '../utils/socketClient';
import './Enquiry.css';

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

const getStatusBadgeConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return { label: 'Enquiry Received', className: 'status-new', icon: '●', stepIndex: 1 };
    case 'viewed':
      return { label: 'Specialist Review', className: 'status-viewed', icon: '👁️', stepIndex: 2 };
    case 'in progress':
      return { label: 'In Consultation', className: 'status-in-progress', icon: '⚙️', stepIndex: 2 };
    case 'quoted':
      return { label: 'Quote Ready', className: 'status-quoted', icon: '✨', stepIndex: 3 };
    case 'customization sent':
      return { label: 'CAD Design Sent', className: 'status-customization-sent', icon: '🎨', stepIndex: 3 };
    case 'waiting for customer reply':
      return { label: 'Awaiting Your Reply', className: 'status-waiting-for-customer-reply', icon: '⏳', stepIndex: 3 };
    case 'completed':
      return { label: 'Completed', className: 'status-completed', icon: '✓', stepIndex: 4 };
    case 'closed':
    case 'archived':
      return { label: 'Closed', className: 'status-closed', icon: '✖', stepIndex: 4 };
    default:
      return { label: 'In Review', className: 'status-new', icon: '●', stepIndex: 1 };
  }
};

export default function Enquiry() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchAllInquiries = useCallback(async () => {
    try {
      setLoading(true);
      let serverInquiries = [];

      // 1. Fetch from server if user is logged in
      if (user && user.token) {
        try {
          const res = await api.get('/me/inquiries');
          const data = res.data || res || [];
          serverInquiries = Array.isArray(data) ? data : [];
        } catch (err) {
          console.warn('Could not fetch user inquiries from server:', err);
        }
      }

      // 2. Fetch from local persistent storage (captures guest & offline inquiries)
      const localInquiries = getLocalInquiries();

      // 3. Merge & deduplicate by inquiryId or _id
      const map = new Map();
      serverInquiries.forEach(item => {
        const key = item.inquiryId || item._id;
        if (key) map.set(key, item);
      });
      localInquiries.forEach(item => {
        const key = item.inquiryId || item._id;
        if (key && !map.has(key)) {
          map.set(key, item);
        }
      });

      const merged = Array.from(map.values()).sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setInquiries(merged);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllInquiries();

    // Event listener for inquiries submitted on current tab
    const handleLocalSubmit = () => {
      fetchAllInquiries();
    };
    window.addEventListener('inquirySubmitted', handleLocalSubmit);

    // Socket.IO real-time sync
    if (user?._id) {
      joinUserRoom(user._id);
    }

    const handleSocketUpdate = () => {
      fetchAllInquiries();
    };

    socket.on('inquiry:created', handleSocketUpdate);
    socket.on('inquiry:updated', handleSocketUpdate);
    socket.on('inquiry:deleted', handleSocketUpdate);

    return () => {
      window.removeEventListener('inquirySubmitted', handleLocalSubmit);
      socket.off('inquiry:created', handleSocketUpdate);
      socket.off('inquiry:updated', handleSocketUpdate);
      socket.off('inquiry:deleted', handleSocketUpdate);
    };
  }, [fetchAllInquiries, user?._id]);

  // Tab filtering
  const filteredInquiries = useMemo(() => {
    if (activeTab === 'All') return inquiries;
    if (activeTab === 'In Review') {
      return inquiries.filter(i => ['new', 'viewed', 'in progress'].includes(i.status?.toLowerCase()));
    }
    if (activeTab === 'Quotes Ready') {
      return inquiries.filter(i => ['quoted', 'customization sent', 'waiting for customer reply'].includes(i.status?.toLowerCase()));
    }
    if (activeTab === 'Completed') {
      return inquiries.filter(i => ['completed', 'closed'].includes(i.status?.toLowerCase()));
    }
    return inquiries;
  }, [inquiries, activeTab]);

  // Metrics
  const activeCount = useMemo(() => {
    return inquiries.filter(i => !['completed', 'closed', 'archived'].includes(i.status?.toLowerCase())).length;
  }, [inquiries]);

  const quotedCount = useMemo(() => {
    return inquiries.filter(i => ['quoted', 'customization sent'].includes(i.status?.toLowerCase())).length;
  }, [inquiries]);

  // Direct WhatsApp follow up builder
  const getInquiryWhatsAppUrl = (inquiry) => {
    const ref = inquiry.inquiryId || inquiry._id;
    const prodName = inquiry.productName || (typeof inquiry.product === 'object' ? inquiry.product?.name : '') || 'Fine Jewellery';
    const text = `Hello Goldsmiths Atelier! ✨\n\nI am checking the status of my product enquiry:\n*Reference ID:* ${ref}\n*Product:* ${prodName}\n*Current Status:* ${inquiry.status || 'Under Review'}\n\nPlease share any design updates or consultation details.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="enquiry-page-wrapper">
      {/* ── Fixed Silk WebGL Background ── */}
      <div className="enquiry-silk-bg" aria-hidden="true">
        <Silk
          speed={5}
          scale={1}
          color="#8c5fb3"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="enquiry-silk-overlay" />
      </div>

      <div className="enquiry-content-container">
        {/* ── Hero Vault Card ── */}
        <section className="enquiry-hero-card">
          <div className="enquiry-eyebrow">
            <span className="enquiry-sparkle">✦</span>
            <span>Atelier Consultation Vault</span>
            <span className="enquiry-sparkle">✦</span>
          </div>

          <h1 className="enquiry-title">Product Enquiries</h1>

          <p className="enquiry-subtitle">
            Track real-time specialist review, bespoke quotes, and atelier progress for every masterpiece you have inquired about.
          </p>

          <div className="enquiry-stats-bar">
            <div className="enquiry-stat-pill">
              <span>Total Enquiries:</span>
              <span className="enquiry-stat-value">{inquiries.length}</span>
            </div>

            <div className="enquiry-stat-pill">
              <span>In Progress:</span>
              <span className="enquiry-stat-value">{activeCount}</span>
            </div>

            {quotedCount > 0 && (
              <div className="enquiry-stat-pill">
                <span>Quotes Ready:</span>
                <span className="enquiry-stat-value">{quotedCount}</span>
              </div>
            )}

            <div className="enquiry-live-indicator">
              <span className="enquiry-pulse-dot" />
              <span>Live Atelier Sync</span>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello Goldsmiths Atelier! I would like to consult with a jewellery specialist regarding my active product enquiries.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="enquiry-concierge-btn"
            >
              <span>💬 Concierge Support</span>
            </a>
          </div>
        </section>

        {/* ── Enquiries Content ── */}
        {inquiries.length > 0 ? (
          <>
            {/* Filter Tabs */}
            <div className="enquiry-toolbar">
              <div className="enquiry-filter-chips">
                {['All', 'In Review', 'Quotes Ready', 'Completed'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    className={`enquiry-tab-chip ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            <div className="enquiry-list">
              {filteredInquiries.map(inq => {
                const inqId = inq.inquiryId || inq._id;
                const product = typeof inq.product === 'object' && inq.product ? inq.product : null;
                const prodName = inq.productName || product?.name || 'Bespoke Masterpiece';
                const prodPrice = product?.price || inq.price;
                const rawImg = product ? getProductImage(product) : inq.attachmentUrls?.[0];
                const imageUrl = rawImg ? getMediaUrl(rawImg) : null;
                const prodLink = product ? `/product/${product.slug || product._id || product.id}` : '#';
                const statusConfig = getStatusBadgeConfig(inq.status);
                const stepIndex = statusConfig.stepIndex;

                return (
                  <article key={inqId} className="enquiry-card">
                    {/* 1. Card Top Meta Header */}
                    <div className="enquiry-card-top-bar">
                      <div className="enquiry-ref-group">
                        <span className="enquiry-id-badge">{inqId}</span>
                        <span className="enquiry-date-pill">📅 {formatDate(inq.createdAt)}</span>
                      </div>
                      <span className={`enquiry-status-badge ${statusConfig.className}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{statusConfig.label}</span>
                      </span>
                    </div>

                    {/* 2. Product Summary Row */}
                    <div className="enquiry-product-row">
                      <div className="enquiry-product-media">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={prodName}
                            className="enquiry-product-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="enquiry-product-fallback">
                            {categoryEmoji(product?.category)}
                          </div>
                        )}
                      </div>

                      <div className="enquiry-product-details">
                        <h2 className="enquiry-product-name">
                          {product ? (
                            <Link to={prodLink}>{prodName}</Link>
                          ) : (
                            prodName
                          )}
                        </h2>

                        <div className="enquiry-product-meta">
                          {prodPrice && (
                            <span className="enquiry-product-price">
                              {formatPrice(prodPrice)}
                            </span>
                          )}
                          {inq.inquiryType && (
                            <span className="enquiry-type-tag">
                              • {inq.inquiryType}
                            </span>
                          )}
                          {inq.preferredContactMethod && (
                            <span className="enquiry-channel-tag">
                              • Via {inq.preferredContactMethod}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3. Full-Width Stepper Tracker */}
                    <div className="enquiry-stepper-tracker" aria-label="Consultation Status Milestones">
                      <div className="enquiry-stepper-progress-bg" />
                      <div
                        className="enquiry-stepper-progress-fill"
                        style={{ width: `${Math.min(100, Math.max(0, (stepIndex - 1) * 33.33))}%` }}
                      />

                      <div className={`enquiry-step ${stepIndex >= 1 ? (stepIndex === 1 ? 'current' : 'completed') : ''}`}>
                        <div className="enquiry-step-circle">{stepIndex > 1 ? '✓' : '1'}</div>
                        <span className="enquiry-step-label">Submitted</span>
                      </div>

                      <div className={`enquiry-step ${stepIndex >= 2 ? (stepIndex === 2 ? 'current' : 'completed') : ''}`}>
                        <div className="enquiry-step-circle">{stepIndex > 2 ? '✓' : '2'}</div>
                        <span className="enquiry-step-label">In Review</span>
                      </div>

                      <div className={`enquiry-step ${stepIndex >= 3 ? (stepIndex === 3 ? 'current' : 'completed') : ''}`}>
                        <div className="enquiry-step-circle">{stepIndex > 3 ? '✓' : '3'}</div>
                        <span className="enquiry-step-label">Quoted</span>
                      </div>

                      <div className={`enquiry-step ${stepIndex >= 4 ? 'completed' : ''}`}>
                        <div className="enquiry-step-circle">{stepIndex >= 4 ? '✓' : '4'}</div>
                        <span className="enquiry-step-label">Completed</span>
                      </div>
                    </div>

                    {/* 4. Client's Original Consultation Notes */}
                    {inq.message && (
                      <p className="enquiry-client-msg">
                        <strong>Your Consultation Request:</strong> "{inq.message}"
                      </p>
                    )}

                    {/* 5. Official Atelier / Specialist Response if available */}
                    {inq.adminResponse && (
                      <div className="enquiry-admin-response">
                        <div className="enquiry-admin-response-title">
                          <span>👑 Official Atelier Update</span>
                          {inq.responseSentVia && inq.responseSentVia !== 'None' && (
                            <span style={{ opacity: 0.7, fontWeight: 500 }}>
                              (via {inq.responseSentVia})
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0 }}>{inq.adminResponse}</p>
                      </div>
                    )}

                    {/* 6. Action Buttons */}
                    <div className="enquiry-card-actions">
                      <a
                        href={getInquiryWhatsAppUrl(inq)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="enquiry-wa-btn"
                        title="Chat with jewellery specialist about this enquiry"
                      >
                        💬 WhatsApp Status
                      </a>

                      {product && (
                        <Link to={prodLink} className="enquiry-view-pdp-btn">
                          View Masterpiece →
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          /* ── Empty State ── */
          <div className="enquiry-empty-card">
            <div className="enquiry-empty-icon" aria-hidden="true">
              📋
            </div>
            <h2 className="enquiry-empty-title">No Enquiries Sent Yet</h2>
            <p className="enquiry-empty-desc">
              You haven't requested consultations for any masterpieces yet. Explore our handcrafted jewellery collections and send an inquiry for private pricing, custom sizing, and atelier delivery.
            </p>
            <Link to="/shop" className="enquiry-explore-btn">
              Explore Masterpieces →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
