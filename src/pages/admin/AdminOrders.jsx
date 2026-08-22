import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatPrice } from '../../data/products';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/orders');
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setStatusUpdating(true);
      await api.put(`/orders/${id}/status`, { status: newStatus });
      setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      fetchOrders();
    } catch (error) {
      alert("Error updating order status");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Orders</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Track and manage customer orders and shipments.</p>
        </div>
      </div>

      <div className="admin-table-wrapper" style={{ background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Order ID</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Total</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</td></tr>
            ) : orders.map(o => (
              <tr key={o._id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{o._id.substring(0, 8).toUpperCase()}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{o.user?.name || 'Guest'}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatPrice(o.totalPrice)}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', background: o.orderStatus === 'Delivered' ? 'var(--color-success)15' : o.orderStatus === 'Shipped' ? 'var(--color-info)15' : 'var(--color-warning)15', color: o.orderStatus === 'Delivered' ? 'var(--color-success)' : o.orderStatus === 'Shipped' ? 'var(--color-info)' : 'var(--color-warning)' }}>{o.orderStatus || 'Pending'}</span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button onClick={() => setSelectedOrder(o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Manage</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No orders found.</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>Order #{selectedOrder._id.substring(0, 8).toUpperCase()}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Update Status</h3>
              <select 
                value={selectedOrder.orderStatus} 
                onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                disabled={statusUpdating}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px', background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Customer Info</h3>
              <p style={{ fontSize: 'var(--text-sm)' }}>Name: {selectedOrder.user?.name || 'Guest'}</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>Email: {selectedOrder.user?.email || selectedOrder.shippingAddress?.email}</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>Phone: {selectedOrder.shippingAddress?.phone}</p>
            </div>

            <div style={{ marginBottom: '24px', background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Shipping Address</h3>
              <p style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.shippingAddress?.address}</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.shippingAddress?.country}</p>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>Order Items</h3>
              {selectedOrder.orderItems?.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--color-gray-200)' }}>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{item.name} x {item.qty}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                <div>Total</div>
                <div>{formatPrice(selectedOrder.totalPrice)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
