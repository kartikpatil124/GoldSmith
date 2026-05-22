import { useState, useEffect } from 'react';
import api from '../../utils/api';

const emptyForm = { code: '', discountType: 'percentage', discountValue: '', minPurchaseAmount: '', maxDiscount: '', startDate: '', endDate: '', usageLimit: '', isActive: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setIsFormOpen(true); };
  const openEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue?.toString() || '',
      minPurchaseAmount: coupon.minPurchaseAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit?.toString() || '',
      isActive: coupon.isActive !== false,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minPurchaseAmount: Number(form.minPurchaseAmount) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        usageLimit: Number(form.usageLimit) || 0,
        isActive: form.isActive,
      };

      if (editId) {
        await api.put(`/coupons/${editId}`, payload);
      } else {
        await api.post('/coupons', payload);
      }
      setIsFormOpen(false);
      setForm({ ...emptyForm });
      setEditId(null);
      fetchCoupons();
    } catch (err) {
      alert('Error: ' + (err.message || JSON.stringify(err)));
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/coupons/${id}`, { isActive: !currentStatus });
      fetchCoupons();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        fetchCoupons();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Coupons</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage discount codes and promotions.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">+ Add New Coupon</button>
      </div>

      <div className="admin-table-wrapper" style={{ background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Code</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Value</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Valid Period</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Usage</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Loading coupons...</td></tr>
            ) : coupons.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'monospace' }}>{c.code}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>{c.discountType}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                  {c.startDate && new Date(c.startDate).toLocaleDateString()} — {c.endDate && new Date(c.endDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{c.usedCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', background: c.isActive ? 'rgba(45,106,79,0.1)' : 'rgba(220,53,69,0.1)', color: c.isActive ? 'var(--color-success)' : 'var(--color-ruby)' }}>{c.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold)', fontSize: 'var(--text-sm)', fontWeight: 600, marginRight: '12px' }}>Edit</button>
                  <button onClick={() => toggleStatus(c._id, c.isActive)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', fontWeight: 500, marginRight: '12px' }}>{c.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ruby)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && !loading && <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No coupons found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '24px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>{editId ? 'Edit Coupon' : 'Add New Coupon'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Coupon Code</label><input name="code" value={form.code} onChange={handleFormChange} className="form-input" required style={{ textTransform: 'uppercase' }} /></div>

              <div className="responsive-form-grid">
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select name="discountType" value={form.discountType} onChange={handleFormChange} className="form-input">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Discount Value</label><input name="discountValue" type="number" min="1" value={form.discountValue} onChange={handleFormChange} className="form-input" required /></div>
              </div>

              <div className="responsive-form-grid">
                <div className="form-group"><label className="form-label">Start Date</label><input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} className="form-input" required /></div>
                <div className="form-group"><label className="form-label">End Date</label><input name="endDate" type="date" value={form.endDate} onChange={handleFormChange} className="form-input" required /></div>
              </div>

              <div className="responsive-form-grid">
                <div className="form-group"><label className="form-label">Min Order Amount (₹)</label><input name="minPurchaseAmount" type="number" min="0" value={form.minPurchaseAmount} onChange={handleFormChange} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Max Discount (₹)</label><input name="maxDiscount" type="number" min="0" value={form.maxDiscount} onChange={handleFormChange} className="form-input" placeholder="No limit" /></div>
                <div className="form-group"><label className="form-label">Usage Limit</label><input name="usageLimit" type="number" min="0" value={form.usageLimit} onChange={handleFormChange} className="form-input" placeholder="0 = unlimited" /></div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleFormChange} id="isActive" />
                <label htmlFor="isActive" style={{ margin: 0, fontWeight: 500 }}>Active</label>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditId(null); }} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editId ? 'Update Coupon' : 'Save Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
