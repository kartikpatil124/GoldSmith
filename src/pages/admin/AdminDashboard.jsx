import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading Dashboard Overview...</div>;
  if (!data) return <div style={{ padding: '40px' }}>Error loading dashboard data.</div>;

  const stats = [
    { title: 'Total Inquiries', value: data.totalInquiries?.toString() || '0', trend: 'Consultations', color: 'var(--color-gold)' },
    { title: 'New Inquiries', value: data.newInquiries?.toString() || '0', trend: 'Needs Reply', color: 'var(--color-warning)' },
    { title: 'Custom Requests', value: data.customDesignRequests?.toString() || '0', trend: 'Bespoke designs', color: 'var(--color-success)' },
    { title: 'Avg Response Time', value: data.avgResponseTime > 0 ? `${data.avgResponseTime} min` : 'Under 1 hr', trend: 'Target: <30m', color: 'var(--color-success)' },
  ];

  return (
    <div style={{ padding: '24px 32px' }}>
      <div className="admin-dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Welcome back! Here's a summary of customer consultations today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/admin/inquiries" className="btn btn-primary">Manage Inquiries</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dash-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.title} style={{ background: 'var(--color-white)', padding: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(188, 156, 108, 0.15)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', fontWeight: 500, marginBottom: '8px' }}>{stat.title}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>{stat.value}</span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: stat.color, background: 'rgba(188, 156, 108, 0.08)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Inquiries */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '24px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Recent Inquiries</h2>
            <Link to="/admin/inquiries" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', fontWeight: 500 }}>View All</Link>
          </div>
          <div className="admin-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Inquiry ID</th>
                  <th style={{ padding: '12px 8px' }}>Customer</th>
                  <th style={{ padding: '12px 8px' }}>Product</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentInquiries?.map((inq, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)', fontSize: 'var(--text-sm)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500 }}>{inq.inquiryId}</td>
                    <td style={{ padding: '16px 8px' }}>{inq.customerName || 'Guest'}</td>
                    <td style={{ padding: '16px 8px' }}>{inq.productName}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                        background: inq.status === 'new' ? '#3b82f615' : inq.status === 'quoted' || inq.status === 'customization sent' ? '#22c55e15' : '#f59e0b15',
                        color: inq.status === 'new' ? '#3b82f6' : inq.status === 'quoted' || inq.status === 'customization sent' ? '#22c55e' : '#f59e0b'
                      }}>{inq.status}</span>
                    </td>
                  </tr>
                ))}
                {(!data.recentInquiries || data.recentInquiries.length === 0) && (
                  <tr><td colSpan="4" style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--color-gray-500)' }}>No recent inquiries found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '20px' }}>Inventory Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>Products Low in Stock</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '4px' }}>Less than 5 items remaining</div>
              </div>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: data.lowStockAlerts > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>{data.lowStockAlerts}</span>
            </div>
          </div>
          <Link to="/admin/products" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '20px', display: 'block', textAlign: 'center' }}>Manage Inventory</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .dash-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dash-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .dash-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .admin-dash-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .admin-dash-header div {
            width: 100% !important;
          }
          .admin-dash-header button, .admin-dash-header a {
            flex: 1 !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}
