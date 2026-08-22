import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { socket, joinAdminRoom } from '../../utils/socketClient';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    customDesignRequests: 0,
    avgResponseTime: 0,
    lowStockAlerts: 0,
    recentInquiries: []
  });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      const stats = res.data || res;

      if (stats) {
        setData({
          totalInquiries: stats.totalInquiries || 0,
          newInquiries: stats.newInquiries || 0,
          customDesignRequests: stats.customDesignRequests || 0,
          avgResponseTime: stats.avgResponseTime || 0,
          lowStockAlerts: stats.lowStockAlerts || 0,
          recentInquiries: stats.recentInquiries || []
        });
      }
      setLastSync(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Join admin room for real-time socket events
    joinAdminRoom();

    const handleInquiryEvent = () => {
      fetchDashboard();
    };

    socket.on('inquiry:created', handleInquiryEvent);
    socket.on('inquiry:updated', handleInquiryEvent);
    socket.on('inquiry:deleted', handleInquiryEvent);

    // 30-second fallback polling (primary sync is via socket)
    const interval = setInterval(fetchDashboard, 30000);

    return () => {
      clearInterval(interval);
      socket.off('inquiry:created', handleInquiryEvent);
      socket.off('inquiry:updated', handleInquiryEvent);
      socket.off('inquiry:deleted', handleInquiryEvent);
    };
  }, []);

  if (loading) return <div style={{ padding: '40px', fontSize: '14px', color: 'var(--color-gray-500)' }}>Syncing Real-Time Dashboard...</div>;

  const stats = [
    { title: 'Total Inquiries', value: data.totalInquiries.toString(), trend: 'Consultations', color: 'var(--color-gold)' },
    { title: 'New Inquiries', value: data.newInquiries.toString(), trend: 'Needs Reply', color: 'var(--color-warning)' },
    { title: 'Custom Requests', value: data.customDesignRequests.toString(), trend: 'Bespoke designs', color: 'var(--color-success)' },
    { title: 'Avg Response Time', value: `${data.avgResponseTime} min`, trend: 'Target: <30m', color: 'var(--color-success)' },
  ];

  return (
    <div style={{ padding: '24px 32px' }}>
      <div className="admin-dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)', margin: 0 }}>Dashboard Overview</h1>
            <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '12px', background: '#10B98115', color: '#10B981', fontWeight: 700, letterSpacing: '0.05em' }}>
              🟢 LIVE SYNC ({lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
            </span>
          </div>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Welcome back! Here's a real-time summary of customer consultations today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/admin/inquiries" className="btn btn-primary">Manage Inquiries ({data.newInquiries})</Link>
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
