import { useState, useEffect } from 'react';
import api, { getMediaUrl } from '../../utils/api';

export default function AdminCustomRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.get('/custom-requests');
      setRequests(data.data || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/custom-requests/${id}/status`, { status: newStatus });
      fetchRequests();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this Custom Design Request? This will remove it from the database entirely.")) {
      return;
    }
    try {
      await api.delete(`/custom-requests/${id}`);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      alert("Error deleting request: " + (error.message || "Please try again"));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Custom Requests</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage personalized jewellery requests from customers.</p>
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-gray-150)' }}>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Jewellery Type</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Budget</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-gray-500)' }}>Loading requests...</td></tr>
            ) : requests.map(r => (
              <tr 
                key={r._id} 
                onClick={() => setSelectedRequest(r)}
                style={{ 
                  borderBottom: '1px solid var(--color-gray-100)', 
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAF8F5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{r.name}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>{r.email}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                  <span style={{ background: '#F3EFE9', padding: '4px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '11px' }}>
                    {r.type || 'Bespoke'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gold)', fontWeight: 600 }}>{r.budget || 'Not specified'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    background: r.status === 'Completed' ? 'rgba(34, 197, 94, 0.12)' : r.status === 'In Progress' ? 'rgba(59, 130, 246, 0.12)' : r.status === 'Rejected' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                    color: r.status === 'Completed' ? 'rgb(34, 197, 94)' : r.status === 'In Progress' ? 'rgb(59, 130, 246)' : r.status === 'Rejected' ? 'rgb(239, 68, 68)' : 'rgb(245, 158, 11)' 
                  }}>
                    {r.status || 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <select 
                      value={r.status || 'Pending'} 
                      onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-gray-200)', 
                        fontSize: 'var(--text-sm)', 
                        cursor: 'pointer',
                        background: 'white',
                        outline: 'none'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDeleteRequest(r._id)}
                      title="Delete Custom Request"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-gray-500)' }}>No custom requests found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Details View Modal */}
      {selectedRequest && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedRequest(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(26, 21, 18, 0.6)',
              backdropFilter: 'blur(8px)',
            }} 
          />

          {/* Modal Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            background: '#FAF8F5',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(188, 156, 108, 0.3)',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Header */}
            <div style={{
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
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-charcoal)',
                }}>
                  Custom Design Specs
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                  Submitted on {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                style={{
                  width: '32px',
                  height: '32px',
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
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              {/* Customer Contact Card */}
              <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '12px' }}>
                  Customer Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
                  <div><strong>Name:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.name}</span></div>
                  <div><strong>Email:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.email}</span></div>
                  <div><strong>Phone:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.phone}</span></div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span style={{ 
                      fontSize: '9px', 
                      padding: '2px 8px', 
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      background: selectedRequest.status === 'Completed' ? 'rgba(34, 197, 94, 0.12)' : selectedRequest.status === 'In Progress' ? 'rgba(59, 130, 246, 0.12)' : selectedRequest.status === 'Rejected' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: selectedRequest.status === 'Completed' ? 'rgb(34, 197, 94)' : selectedRequest.status === 'In Progress' ? 'rgb(59, 130, 246)' : selectedRequest.status === 'Rejected' ? 'rgb(239, 68, 68)' : 'rgb(245, 158, 11)'
                    }}>
                      {selectedRequest.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Design Specifications Card */}
              <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '12px' }}>
                  Design Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
                  <div><strong>Jewellery Type:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.type || 'N/A'}</span></div>
                  <div><strong>Preferred Metal:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.metal || 'N/A'}</span></div>
                  <div><strong>Gemstone Preference:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.gemstone || 'N/A'}</span></div>
                  <div><strong>Size / Dimensions:</strong> <span style={{ color: 'var(--color-gray-700)' }}>{selectedRequest.size || 'N/A'}</span></div>
                  <div><strong>Target Budget:</strong> <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{selectedRequest.budget || 'N/A'}</span></div>
                </div>
              </div>

              {/* Description Card */}
              <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '8px' }}>
                  Dream Piece Description
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selectedRequest.description}
                </p>
              </div>

              {/* Reference Inspiration Image Card */}
              {selectedRequest.referenceImage && (
                <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-gray-150)' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '12px' }}>
                    Uploaded Reference Design
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <a href={getMediaUrl(selectedRequest.referenceImage)} target="_blank" rel="noopener noreferrer" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <img 
                        src={getMediaUrl(selectedRequest.referenceImage)} 
                        alt="Reference Inspiration Design" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '260px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--color-gray-200)', 
                          objectFit: 'contain',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      />
                    </a>
                    <a 
                      href={getMediaUrl(selectedRequest.referenceImage)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      🔍 Open reference image in new tab
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 32px',
              borderTop: '1px solid rgba(188, 156, 108, 0.15)',
              background: '#F3EFE9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', fontWeight: 500 }}>Update Status:</span>
                <select 
                  value={selectedRequest.status || 'Pending'} 
                  onChange={(e) => {
                    handleUpdateStatus(selectedRequest._id, e.target.value);
                    setSelectedRequest(prev => ({ ...prev, status: e.target.value }));
                  }}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-gray-200)', 
                    fontSize: 'var(--text-sm)', 
                    background: 'white',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleDeleteRequest(selectedRequest._id)}
                  className="btn btn-secondary"
                  style={{ 
                    padding: '8px 20px', 
                    fontSize: 'var(--text-sm)', 
                    color: '#EF4444', 
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.02)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.02)'}
                >
                  🗑️ Delete Request
                </button>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 20px', fontSize: 'var(--text-sm)' }}
                >
                  Close specs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
