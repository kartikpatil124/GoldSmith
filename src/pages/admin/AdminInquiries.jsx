import { useState, useEffect } from 'react';
import api, { getMediaUrl } from '../../utils/api';
import { formatPrice } from '../../data/products';
import { socket, joinAdminRoom } from '../../utils/socketClient';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());
  
  // Response states
  const [replyMessage, setReplyMessage] = useState('');
  const [replyVia, setReplyVia] = useState('WhatsApp');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statuses = [
    'new', 
    'viewed', 
    'in progress', 
    'quoted', 
    'customization sent', 
    'waiting for customer reply', 
    'completed', 
    'closed', 
    'archived'
  ];

  const quickTemplates = {
    price: "Dear customer, thank you for your interest in our fine jewellery. The bespoke pricing for this design is approximately ₹[Price], including certified hallmarked gold and insured express transit. Let us know if you would like us to begin crafting your piece.",
    custom: "Dear customer, thank you for submitting your custom design request. Our master goldsmith has reviewed your specifications. We can craft this custom piece for ₹[Price] with a 3D CAD preview provided prior to casting.",
    bridal: "Dear customer, congratulations on your upcoming celebration! We would love to invite you for a private bridal suite consultation with our senior design specialist.",
    availability: "Dear customer, we are delighted to inform you that this masterpiece is currently available at our flagship boutique. We can reserve it for you for 48 hours.",
  };

  const fetchInquiries = async () => {
    try {
      let url = `/admin/inquiries?`;
      if (filterStatus) url += `status=${encodeURIComponent(filterStatus)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await api.get(url);
      const data = res.data || res || [];
      const inquiryList = Array.isArray(data) ? data : (data.data || []);

      setInquiries(inquiryList);
      setLastSync(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();

    // Join admin broadcast room
    joinAdminRoom();

    const handleInquiryEvent = () => {
      fetchInquiries();
    };

    socket.on('inquiry:created', handleInquiryEvent);
    socket.on('inquiry:updated', handleInquiryEvent);
    socket.on('inquiry:deleted', handleInquiryEvent);

    // Fallback 30s polling
    const interval = setInterval(fetchInquiries, 30000);

    return () => {
      clearInterval(interval);
      socket.off('inquiry:created', handleInquiryEvent);
      socket.off('inquiry:updated', handleInquiryEvent);
      socket.off('inquiry:deleted', handleInquiryEvent);
    };
  }, [filterStatus, searchQuery]);

  const handleSelectInquiry = async (inq) => {
    setSelectedInquiry(inq);
    setReplyMessage(inq.adminResponse || '');
    setReplyVia(inq.preferredContactMethod === 'Phone Call' ? 'WhatsApp' : inq.preferredContactMethod || 'WhatsApp');
    
    // Mark viewed persistently if status is new
    if (inq.status === 'new') {
      handleStatusChange(inq._id || inq.inquiryId, 'viewed');
    }
  };

  const handleStatusChange = async (inqId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/admin/inquiries/${inqId}/status`, { status: newStatus });
      if (res && res.data) {
        setSelectedInquiry(res.data);
      } else {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
      fetchInquiries();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + (err.message || 'Server error'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedInquiry) return;
    const inqId = selectedInquiry._id || selectedInquiry.inquiryId;

    try {
      setSendingReply(true);
      const res = await api.patch(`/admin/inquiries/${inqId}/respond`, {
        responseMessage: replyMessage,
        sendVia: replyVia
      });

      if (res && res.data) {
        setSelectedInquiry(res.data);
      }

      fetchInquiries();

      if (replyVia === 'WhatsApp' || replyVia === 'Both') {
        const phone = selectedInquiry.phone || selectedInquiry.whatsappNumber || '919106251842';
        const cleanPhone = phone.replace(/\D/g, '');
        const waMsg = `*Goldsmiths Jewels - Response to Inquiry #${selectedInquiry.inquiryId || inqId}*\n\n` +
          `Dear ${selectedInquiry.customerName || 'Valued Client'},\n\n` +
          `${replyMessage}\n\n` +
          `Regarding: *${selectedInquiry.productName}*`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');
      }

      alert('Response dispatched successfully!');
    } catch (err) {
      alert('Error sending response: ' + (err.message || 'Server error'));
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteInquiry = async (inqId) => {
    if (window.confirm('Are you sure you want to permanently delete this customer inquiry?')) {
      try {
        await api.delete(`/admin/inquiries/${inqId}`);
        setSelectedInquiry(null);
        fetchInquiries();
      } catch (err) {
        alert('Error deleting inquiry: ' + (err.message || 'Server error'));
      }
    }
  };

  const applyTemplate = (key) => {
    let tpl = quickTemplates[key] || '';
    if (selectedInquiry?.product?.price) {
      tpl = tpl.replace('[Price]', selectedInquiry.product.price.toLocaleString('en-IN'));
    }
    setReplyMessage(tpl);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-charcoal)', margin: 0 }}>
              Customer Inquiries ({inquiries.length})
            </h1>
            <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '12px', background: '#10B98115', color: '#10B981', fontWeight: 700, letterSpacing: '0.05em' }}>
              🟢 LIVE ({lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '4px' }}>
            Consultation, Customization, and Price Quotation Center
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedInquiry ? '1.1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Inquiries List Column */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              placeholder="Search by ID, name, email, product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '10px 16px',
                border: '1px solid var(--color-gray-200)',
                borderRadius: '8px',
                outline: 'none',
                fontSize: 'var(--text-sm)'
              }}
            />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid var(--color-gray-200)',
                borderRadius: '8px',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>

          {loading ? (
            <p>Loading inquiries...</p>
          ) : inquiries.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '40px' }}>No inquiries found matching criteria.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {inquiries.map(inq => {
                const isSelected = selectedInquiry && selectedInquiry._id === inq._id;
                return (
                  <div 
                    key={inq._id} 
                    onClick={() => handleSelectInquiry(inq)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--color-gray-150)',
                      background: isSelected ? 'rgba(188, 156, 108, 0.05)' : '#FAFAF9',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-charcoal)' }}>{inq.inquiryId}</span>
                      <span style={{ 
                        fontSize: '9px', 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-full)', 
                        textTransform: 'uppercase', 
                        fontWeight: 700,
                        color: inq.status === 'new' ? '#3b82f6' : inq.status === 'quoted' || inq.status === 'customization sent' ? '#22c55e' : '#f59e0b',
                        background: (inq.status === 'new' ? '#3b82f6' : inq.status === 'quoted' || inq.status === 'customization sent' ? '#22c55e' : '#f59e0b') + '15'
                      }}>{inq.status}</span>
                    </div>

                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>{inq.customerName}</h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: '8px' }}>Product: <strong>{inq.productName}</strong></p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-gray-400)' }}>
                      <span>Type: {inq.inquiryType}</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Response Column */}
        {selectedInquiry && (
          <div style={{ 
            background: 'white', 
            borderRadius: 'var(--radius-xl)', 
            padding: '28px', 
            boxShadow: 'var(--shadow-md)', 
            border: '1px solid rgba(188, 156, 108, 0.15)',
            position: 'sticky',
            top: '20px'
          }}>
            {/* Header details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(188, 156, 108, 0.15)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  Inquiry Details
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>Submitted: {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => handleDeleteInquiry(selectedInquiry._id || selectedInquiry.inquiryId)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#DC2626', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  🗑️ Delete Inquiry
                </button>
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', fontSize: '14px', padding: '4px 8px' }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Customer Contact */}
            <div style={{ marginBottom: '20px', padding: '16px', background: '#FAFAF9', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '8px' }}>Customer Contact</h4>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedInquiry.customerName}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '4px' }}>📧 {selectedInquiry.email} | 📞 {selectedInquiry.phone}</p>
              {selectedInquiry.whatsappNumber && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>💬 WhatsApp: {selectedInquiry.whatsappNumber}</p>}
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', marginTop: '6px', fontWeight: 500 }}>Preferred Contact Channel: <strong style={{ color: 'var(--color-gold)' }}>{selectedInquiry.preferredContactMethod}</strong></p>
            </div>

            {/* Product Details */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', padding: '16px', background: '#FAF8F5', borderRadius: '10px', border: '1px solid rgba(188, 156, 108, 0.1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '6px', background: 'var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, overflow: 'hidden' }}>
                💎
                {selectedInquiry.product?.featuredImage && (
                  <img src={getMediaUrl(selectedInquiry.product.featuredImage)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedInquiry.productName}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>SKU: {selectedInquiry.productSku || 'N/A'} | Price: {selectedInquiry.product?.price ? formatPrice(selectedInquiry.product.price) : 'N/A'}</p>
                {selectedInquiry.product && (
                  <p style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '2px' }}>Specs: {selectedInquiry.product.metal} · {selectedInquiry.product.purity} · {selectedInquiry.product.size}</p>
                )}
              </div>
            </div>

            {/* Customer Message */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '6px' }}>Message Details</h4>
              <div style={{ background: '#F3EFE9', padding: '12px 16px', borderRadius: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5 }}>
                <p><strong>Query:</strong> {selectedInquiry.message}</p>
                {selectedInquiry.budgetRange && <p style={{ marginTop: '8px' }}><strong>Target Budget:</strong> {selectedInquiry.budgetRange}</p>}
                {selectedInquiry.sizeRequirements && <p style={{ marginTop: '4px' }}><strong>Size Requirements:</strong> {selectedInquiry.sizeRequirements}</p>}
                {selectedInquiry.metalPreference && <p style={{ marginTop: '4px' }}><strong>Metal Pref:</strong> {selectedInquiry.metalPreference}</p>}
                {selectedInquiry.stonePreference && <p style={{ marginTop: '4px' }}><strong>Stone Pref:</strong> {selectedInquiry.stonePreference}</p>}
                {selectedInquiry.customizationNotes && <p style={{ marginTop: '8px', color: 'var(--color-gold)', fontWeight: 500 }}><strong>Customization Requirements:</strong> {selectedInquiry.customizationNotes}</p>}
              </div>

              {/* Inspiration Image Attachment */}
              {selectedInquiry.attachmentUrls && selectedInquiry.attachmentUrls.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '6px' }}>Inspiration / Reference Image</h5>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedInquiry.attachmentUrls.map((url, idx) => (
                      <a href={getMediaUrl(url)} target="_blank" rel="noopener noreferrer" key={idx}>
                        <img 
                          src={getMediaUrl(url)} 
                          alt="Reference" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-gray-200)' }} 
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Workflow */}
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--color-gray-100)', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '8px' }}>Inquiry Workflow Status</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select 
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                  disabled={updatingStatus}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-gray-200)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    background: 'white',
                    flex: 1
                  }}
                >
                  {statuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
                {updatingStatus && <span style={{ fontSize: '12px', color: 'var(--color-gold)' }}>Updating...</span>}
              </div>
            </div>

            {/* Admin Response message editor */}
            <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '8px' }}>Send Consultation Reply</h4>
              
              {/* Template shortcuts */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => applyTemplate('price')} style={{ fontSize: '10px', padding: '4px 8px', background: '#F3EFE9', border: '1px solid var(--color-gray-200)', borderRadius: '4px', cursor: 'pointer' }}>🏷️ Price Quote</button>
                <button type="button" onClick={() => applyTemplate('custom')} style={{ fontSize: '10px', padding: '4px 8px', background: '#F3EFE9', border: '1px solid var(--color-gray-200)', borderRadius: '4px', cursor: 'pointer' }}>🎨 Custom Plan</button>
                <button type="button" onClick={() => applyTemplate('bridal')} style={{ fontSize: '10px', padding: '4px 8px', background: '#F3EFE9', border: '1px solid var(--color-gray-200)', borderRadius: '4px', cursor: 'pointer' }}>👑 Bridal Consult</button>
                <button type="button" onClick={() => applyTemplate('availability')} style={{ fontSize: '10px', padding: '4px 8px', background: '#F3EFE9', border: '1px solid var(--color-gray-200)', borderRadius: '4px', cursor: 'pointer' }}>🛍️ Stock In-Flagship</button>
              </div>

              <form onSubmit={handleSendResponse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Draft your customized quotation or response message here..."
                  required
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-gray-200)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    lineHeight: 1.5
                  }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '10px' }}>Delivery Channel</label>
                    <select 
                      value={replyVia} 
                      onChange={(e) => setReplyVia(e.target.value)}
                      className="form-input form-select"
                      style={{ padding: '8px 12px', fontSize: 'var(--text-sm)' }}
                    >
                      <option value="WhatsApp">WhatsApp Message Link</option>
                      <option value="Email">Clean Email response</option>
                      <option value="Both">Both Email and WhatsApp</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={sendingReply}
                    className="btn btn-primary"
                    style={{ alignSelf: 'end', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {sendingReply ? 'Sending Reply...' : replyVia === 'WhatsApp' ? '💬 Launch WhatsApp' : '✨ Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
