import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.get('/users/customers');
        setCustomers(data.data || data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Customers</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage your customer database and view purchase history.</p>
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Phone</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Loading customers...</td></tr>
            ) : customers.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.name}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)' }}>{c.email}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{c.phone || 'N/A'}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && !loading && <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
