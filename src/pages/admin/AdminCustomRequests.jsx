import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminCustomRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Custom Requests</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage personalized jewellery requests from customers.</p>
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Budget</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading requests...</td></tr>
            ) : requests.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.name}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)' }}>{r.email}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{r.budget || 'Not specified'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', background: r.status === 'Completed' ? 'var(--color-success)15' : r.status === 'In Progress' ? 'var(--color-info)15' : 'var(--color-warning)15', color: r.status === 'Completed' ? 'var(--color-success)' : r.status === 'In Progress' ? 'var(--color-info)' : 'var(--color-warning)' }}>{r.status || 'Pending'}</span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <select 
                    value={r.status || 'Pending'} 
                    onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No custom requests found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
