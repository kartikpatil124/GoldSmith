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

  if (loading) return <div style={{ padding: '40px' }}>Loading Dashboard...</div>;
  if (!data) return <div style={{ padding: '40px' }}>Error loading dashboard data.</div>;

  const stats = [
    { title: 'Total Revenue', value: `₹${data.totalRevenue?.toLocaleString() || 0}`, trend: '+12.5%', color: 'var(--color-success)' },
    { title: 'Total Orders', value: data.totalOrders?.toString() || '0', trend: '+8.2%', color: 'var(--color-success)' },
    { title: 'New Customers', value: data.totalCustomers?.toString() || '0', trend: '+15.3%', color: 'var(--color-success)' },
    { title: 'Pending Orders', value: data.pendingOrders?.toString() || '0', trend: '-2.1%', color: 'var(--color-warning)' },
  ];

  return (
    <div>
      <div className="admin-dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline-gold">Download Report</button>
          <Link to="/admin/settings" className="btn btn-primary">Manage Store</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dash-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.title} style={{ background: 'var(--color-white)', padding: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', fontWeight: 500, marginBottom: '8px' }}>{stat.title}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stat.value}</span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: stat.color, background: `${stat.color}15`, padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', padding: '24px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', fontWeight: 500 }}>View All</Link>
          </div>
          <div className="admin-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Order ID</th>
                  <th style={{ padding: '12px 8px' }}>Customer</th>
                  <th style={{ padding: '12px 8px' }}>Amount</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders?.map((order, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)', fontSize: 'var(--text-sm)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500 }}>{order._id?.substring(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '16px 8px' }}>{order.user?.name || 'Guest'}</td>
                    <td style={{ padding: '16px 8px', fontWeight: 600 }}>₹{order.totalPrice?.toLocaleString()}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
                        background: order.orderStatus === 'Delivered' ? 'var(--color-success)15' : order.orderStatus === 'Shipped' ? 'var(--color-info)15' : order.orderStatus === 'Processing' ? 'var(--color-gold)15' : 'var(--color-warning)15',
                        color: order.orderStatus === 'Delivered' ? 'var(--color-success)' : order.orderStatus === 'Shipped' ? 'var(--color-info)' : order.orderStatus === 'Processing' ? 'var(--color-gold-dark)' : 'var(--color-warning)'
                      }}>{order.orderStatus}</span>
                    </td>
                  </tr>
                ))}
                {(!data.recentOrders || data.recentOrders.length === 0) && (
                  <tr><td colSpan="4" style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--color-gray-500)' }}>No recent orders found.</td></tr>
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
