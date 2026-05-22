import { useState, useEffect } from 'react';
import api, { getProductImage, getMediaUrl } from '../../utils/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const emptyForm = {
  name: '', sku: '', slug: '', price: '', salePrice: '', category: 'Rings', subcategory: '', collectionName: '',
  metal: '', purity: '', karat: '', grossWeight: '', netWeight: '', weight: '',
  gemstoneType: '', gemstoneCut: '', gemstoneColor: '', gemstoneClarity: '', gemstoneCarat: '', gemstoneCount: '', gemstoneShape: '',
  description: '', shortDescription: '', careInstructions: '', deliveryEstimate: '5-7 business days', returnPolicy: '15-day easy returns', warranty: '1-year warranty',
  countInStock: '', lowStockThreshold: '5', finish: '', certification: '', hallmark: '',
  gender: '', occasion: '', style: '', productType: '',
  size: '', ringSize: '', braceletSize: '', necklaceLength: '', adjustable: false,
  tags: '', isFeatured: false, status: 'active', customizable: false,
  metaTitle: '', metaDescription: '', keywords: '',
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--color-gray-100)' }}>{title}</h4>
    {children}
  </div>
);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState('');
  const [existingCert, setExistingCert] = useState('');
  
  const [imageInputMode, setImageInputMode] = useState('file'); // 'file' or 'url'
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoInputMode, setVideoInputMode] = useState('file'); // 'file' or 'url'
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?limit=100');
      const d = res.data || res;
      setProducts(d.products || d || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setImageFiles([]);
    setVideoFile(null);
    setCertFile(null);
    setExistingImages([]);
    setExistingVideo('');
    setExistingCert('');
    setImageInputMode('file');
    setImageUrlInput('');
    setVideoInputMode('file');
    setVideoUrlInput('');
    setIsFormOpen(true);
  };

  const openEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name || '', sku: p.sku || '', slug: p.slug || '', price: p.price?.toString() || '', salePrice: p.salePrice?.toString() || '',
      category: p.category || 'Rings', subcategory: p.subcategory || '', collectionName: p.collectionName || '',
      metal: p.metal || '', purity: p.purity || '', karat: p.karat || '', grossWeight: p.grossWeight || '', netWeight: p.netWeight || '', weight: p.weight || '',
      gemstoneType: p.gemstoneDetails?.type || '', gemstoneCut: p.gemstoneDetails?.cut || '', gemstoneColor: p.gemstoneDetails?.color || '',
      gemstoneClarity: p.gemstoneDetails?.clarity || '', gemstoneCarat: p.gemstoneDetails?.carat || '', gemstoneCount: p.gemstoneDetails?.count || '', gemstoneShape: p.gemstoneDetails?.shape || '',
      description: p.description || '', shortDescription: p.shortDescription || '', careInstructions: p.careInstructions || '',
      deliveryEstimate: p.deliveryEstimate || '', returnPolicy: p.returnPolicy || '', warranty: p.warranty || '',
      countInStock: p.countInStock?.toString() || '', lowStockThreshold: p.lowStockThreshold?.toString() || '5',
      finish: p.finish || '', certification: p.certification || '', hallmark: p.hallmark || '',
      gender: p.gender || '', occasion: p.occasion || '', style: p.style || '', productType: p.productType || '',
      size: p.size || '', ringSize: p.ringSize || '', braceletSize: p.braceletSize || '', necklaceLength: p.necklaceLength || '', adjustable: p.adjustable || false,
      tags: (p.tags || []).join(', '), isFeatured: p.isFeatured || false, status: p.status || 'active', customizable: p.customizable || false,
      metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '', keywords: (p.keywords || []).join(', '),
    });
    setImageFiles([]);
    setVideoFile(null);
    setCertFile(null);
    setExistingImages(p.images || []);
    setExistingCert(p.certificateFile || '');
    
    // Set video states dynamically
    if (p.video) {
      setExistingVideo(p.video);
      setVideoUrlInput(p.video);
      const isExternal = p.video.startsWith('http://') || p.video.startsWith('https://') || /^[a-zA-Z0-9_-]{11}$/.test(p.video);
      setVideoInputMode(isExternal ? 'url' : 'file');
    } else {
      setExistingVideo('');
      setVideoUrlInput('');
      setVideoInputMode('file');
    }
    
    setImageInputMode('file');
    setImageUrlInput('');
    setIsFormOpen(true);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMoveExistingImage = (index, direction) => {
    const updated = [...existingImages];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      setExistingImages(updated);
    }
  };

  const handleClearExistingVideo = () => setExistingVideo('');
  const handleClearExistingCert = () => setExistingCert('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrls = [];
      let finalImages = [...existingImages];
      let finalVideo = '';
      let certUrl = '';

      // Auto-parse any leftover text in the URL input field
      if (imageInputMode === 'url' && imageUrlInput.trim()) {
        const parsedUrls = imageUrlInput.split(',').map(url => url.trim()).filter(Boolean);
        finalImages = [...finalImages, ...parsedUrls];
      }

      if (imageFiles.length > 0) {
        const fd = new FormData();
        Array.from(imageFiles).forEach(f => fd.append('images', f));
        const r = await api.post('/upload/gallery', fd);
        let paths = [];
        if (Array.isArray(r)) paths = r;
        else if (r && Array.isArray(r.data)) paths = r.data;
        else if (r && r.data && Array.isArray(r.data.data)) paths = r.data.data;
        else if (r && r.success && Array.isArray(r.data)) paths = r.data;
        imageUrls = paths;
        finalImages = [...finalImages, ...imageUrls];
      }

      if (videoInputMode === 'url') {
        finalVideo = videoUrlInput.trim();
      } else {
        if (videoFile) {
          const fd = new FormData(); fd.append('video', videoFile);
          const r = await api.post('/upload/video', fd);
          let path = '';
          if (typeof r === 'string') path = r;
          else if (r && typeof r.data === 'string') path = r.data;
          else if (r && r.data && typeof r.data.data === 'string') path = r.data.data;
          else if (r && r.success && typeof r.data === 'string') path = r.data;
          finalVideo = path;
        } else {
          finalVideo = existingVideo;
        }
      }

      if (certFile) {
        const fd = new FormData(); fd.append('certificate', certFile);
        const r = await api.post('/upload/certificate', fd);
        let path = '';
        if (typeof r === 'string') path = r;
        else if (r && typeof r.data === 'string') path = r.data;
        else if (r && r.data && typeof r.data.data === 'string') path = r.data.data;
        else if (r && r.success && typeof r.data === 'string') path = r.data;
        certUrl = path;
      }

      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        name: form.name, sku: form.sku, slug, price: Number(form.price), salePrice: Number(form.salePrice) || 0,
        category: form.category, subcategory: form.subcategory, collectionName: form.collectionName,
        metal: form.metal, purity: form.purity, karat: form.karat, grossWeight: form.grossWeight, netWeight: form.netWeight, weight: form.weight,
        gemstoneDetails: { type: form.gemstoneType, cut: form.gemstoneCut, color: form.gemstoneColor, clarity: form.gemstoneClarity, carat: form.gemstoneCarat, count: form.gemstoneCount, shape: form.gemstoneShape },
        description: form.description, shortDescription: form.shortDescription, careInstructions: form.careInstructions,
        deliveryEstimate: form.deliveryEstimate, returnPolicy: form.returnPolicy, warranty: form.warranty,
        countInStock: Number(form.countInStock), lowStockThreshold: Number(form.lowStockThreshold) || 5,
        finish: form.finish, certification: form.certification, hallmark: form.hallmark,
        gender: form.gender, occasion: form.occasion, style: form.style, productType: form.productType,
        size: form.size, ringSize: form.ringSize, braceletSize: form.braceletSize, necklaceLength: form.necklaceLength, adjustable: form.adjustable,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isFeatured: form.isFeatured, status: form.status, customizable: form.customizable,
        metaTitle: form.metaTitle, metaDescription: form.metaDescription, keywords: form.keywords.split(',').map(t => t.trim()).filter(Boolean),
      };

      payload.images = finalImages;
      payload.featuredImage = finalImages.length > 0 ? finalImages[0] : '';
      payload.video = finalVideo;
      payload.certificateFile = certUrl ? certUrl : existingCert;

      if (editId) { await api.put(`/products/${editId}`, payload); }
      else { await api.post('/products', payload); }

      setIsFormOpen(false); setForm({ ...emptyForm }); setEditId(null); fetchProducts();
    } catch (err) { alert('Error: ' + (err.message || JSON.stringify(err))); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try { await api.delete(`/products/${id}`); fetchProducts(); } catch (err) { console.error(err); }
    }
  };

  const handleDuplicate = (p) => {
    openCreate();
    setForm(prev => ({
      ...prev, name: p.name + ' (Copy)', sku: p.sku + '-COPY', category: p.category, metal: p.metal,
      price: p.price?.toString() || '', description: p.description || '',
    }));
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Products</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage your jewellery inventory, pricing, and variants.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">+ Add New Product</button>
      </div>

      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-gray-100)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', gap: '16px' }}>
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', fontSize: 'var(--text-sm)' }} />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', fontSize: 'var(--text-sm)' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="admin-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>SKU</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr> : filtered.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                  <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {getProductImage(p) ? <img src={getMediaUrl(getProductImage(p))} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : '💎'}
                    </div>
                    <div><span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{p.name}</span>{p.isFeatured && <span style={{ marginLeft: '6px', fontSize: '10px', color: 'var(--color-gold)' }}>★ Featured</span>}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{p.sku}</td>
                  <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{p.category}</td>
                  <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)', fontWeight: 600 }}>₹{p.price?.toLocaleString()}</td>
                  <td style={{ padding: '16px 20px', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: p.countInStock === 0 ? 'var(--color-ruby)' : p.countInStock < 5 ? 'var(--color-warning)' : 'var(--color-charcoal)', fontWeight: 600 }}>{p.countInStock ?? 0}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', background: p.status === 'active' ? 'rgba(45,106,79,0.1)' : 'rgba(220,53,69,0.1)', color: p.status === 'active' ? 'var(--color-success)' : 'var(--color-ruby)' }}>{p.status || 'active'}</span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold)', fontSize: 'var(--text-sm)', fontWeight: 600, marginRight: '8px' }}>Edit</button>
                    <button onClick={() => handleDuplicate(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginRight: '8px' }}>Duplicate</button>
                    <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ruby)', fontSize: 'var(--text-sm)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => { setIsFormOpen(false); setEditId(null); }} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <Section title="Basic Details">
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Name *</label><input name="name" value={form.name} onChange={handleFormChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">SKU *</label><input name="sku" value={form.sku} onChange={handleFormChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">Slug</label><input name="slug" value={form.slug} onChange={handleFormChange} className="form-input" placeholder="auto-generated" /></div>
                </div>
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Category *</label><input name="category" value={form.category} onChange={handleFormChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">Subcategory</label><input name="subcategory" value={form.subcategory} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleFormChange} className="form-input"><option value="">Select</option><option>Women</option><option>Men</option><option>Unisex</option><option>Kids</option></select>
                  </div>
                  <div className="form-group"><label className="form-label">Status</label>
                    <select name="status" value={form.status} onChange={handleFormChange} className="form-input"><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
                  </div>
                </div>
                <div className="responsive-form-grid" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Collection Placement</label>
                    <select name="collectionName" value={form.collectionName} onChange={handleFormChange} className="form-input">
                      <option value="">None (Standard Shop Only)</option>
                      <option value="Royal Heritage">Royal Heritage (Antique Suite)</option>
                      <option value="Eternal Brilliance">Eternal Brilliance (Flawless Solitaires)</option>
                      <option value="Modern Minimalist">Modern Minimalist (Daily Essentials)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Occasion / Page Placement</label>
                    <select name="occasion" value={form.occasion} onChange={handleFormChange} className="form-input">
                      <option value="">None (Standard Shop Only)</option>
                      <option value="Bridal">Bridal (Shows on Bridal Salon Page)</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Daily Wear">Daily Wear</option>
                      <option value="Party">Party</option>
                      <option value="Festive">Festive</option>
                      <option value="Gifting">Gifting</option>
                    </select>
                  </div>
                </div>
              </Section>

              <Section title="Pricing">
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Price (₹) *</label><input name="price" type="number" value={form.price} onChange={handleFormChange} className="form-input" required /></div>
                  <div className="form-group"><label className="form-label">Sale Price (₹)</label><input name="salePrice" type="number" value={form.salePrice} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Stock *</label><input name="countInStock" type="number" value={form.countInStock} onChange={handleFormChange} className="form-input" required /></div>
                </div>
              </Section>

              <Section title="Metal & Material">
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Metal *</label><input name="metal" value={form.metal} onChange={handleFormChange} className="form-input" placeholder="e.g. 18K Gold" required /></div>
                  <div className="form-group"><label className="form-label">Purity</label><input name="purity" value={form.purity} onChange={handleFormChange} className="form-input" placeholder="e.g. 18K/750" /></div>
                  <div className="form-group"><label className="form-label">Gross Weight</label><input name="grossWeight" value={form.grossWeight} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Net Weight</label><input name="netWeight" value={form.netWeight} onChange={handleFormChange} className="form-input" /></div>
                </div>
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Finish</label><input name="finish" value={form.finish} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Hallmark</label><input name="hallmark" value={form.hallmark} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Certification</label><input name="certification" value={form.certification} onChange={handleFormChange} className="form-input" /></div>
                </div>
              </Section>

              <Section title="Gemstone Details">
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Type</label><input name="gemstoneType" value={form.gemstoneType} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Cut</label><input name="gemstoneCut" value={form.gemstoneCut} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Color</label><input name="gemstoneColor" value={form.gemstoneColor} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Clarity</label><input name="gemstoneClarity" value={form.gemstoneClarity} onChange={handleFormChange} className="form-input" /></div>
                </div>
                <div className="responsive-form-grid">
                  <div className="form-group"><label className="form-label">Carat</label><input name="gemstoneCarat" value={form.gemstoneCarat} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Count</label><input name="gemstoneCount" value={form.gemstoneCount} onChange={handleFormChange} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Shape</label><input name="gemstoneShape" value={form.gemstoneShape} onChange={handleFormChange} className="form-input" /></div>
                </div>
              </Section>

              <Section title="Description">
                <div className="form-group"><label className="form-label">Short Description</label><input name="shortDescription" value={form.shortDescription} onChange={handleFormChange} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Full Description *</label><textarea name="description" value={form.description} onChange={handleFormChange} className="form-input" required rows="3" /></div>
                <div className="form-group"><label className="form-label">Care Instructions</label><textarea name="careInstructions" value={form.careInstructions} onChange={handleFormChange} className="form-input" rows="2" /></div>
              </Section>

              <Section title="Media">
                <div className="responsive-form-grid" style={{ gap: '20px', marginBottom: '20px' }}>
                  {/* Image input card */}
                  <div style={{ background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="form-label" style={{ fontWeight: 600, margin: 0 }}>Product Images</span>
                      <div style={{ display: 'flex', gap: '4px', background: 'var(--color-gray-200)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('file')}
                          style={{
                            padding: '2px 8px',
                            fontSize: '10px',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: imageInputMode === 'file' ? 'var(--color-white)' : 'transparent',
                            color: imageInputMode === 'file' ? 'var(--color-gold)' : 'var(--color-gray-500)',
                            transition: 'all 0.2s'
                          }}
                        >
                          File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('url')}
                          style={{
                            padding: '2px 8px',
                            fontSize: '10px',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: imageInputMode === 'url' ? 'var(--color-white)' : 'transparent',
                            color: imageInputMode === 'url' ? 'var(--color-gold)' : 'var(--color-gray-500)',
                            transition: 'all 0.2s'
                          }}
                        >
                          URL
                        </button>
                      </div>
                    </div>
                    {imageInputMode === 'file' ? (
                      <div>
                        <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => setImageFiles(e.target.files)} className="form-input" style={{ width: '100%', fontSize: 'var(--text-xs)' }} />
                        <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '4px', display: 'block' }}>JPG, PNG, WebP (Max 3MB)</span>
                      </div>
                    ) : (
                      <div>
                        <textarea
                          placeholder="Paste image URLs (comma-separated)..."
                          value={imageUrlInput}
                          onChange={e => setImageUrlInput(e.target.value)}
                          className="form-input"
                          rows="2"
                          style={{ width: '100%', fontSize: 'var(--text-xs)', resize: 'vertical', minHeight: '60px' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (imageUrlInput.trim()) {
                              const urls = imageUrlInput.split(',').map(url => url.trim()).filter(Boolean);
                              setExistingImages(prev => [...prev, ...urls]);
                              setImageUrlInput('');
                            }
                          }}
                          className="btn btn-secondary"
                          style={{ width: '100%', marginTop: '8px', padding: '6px 12px', fontSize: '11px', height: 'auto', background: 'var(--color-white)', border: '1px solid var(--color-gray-300)' }}
                        >
                          + Add to Active Gallery
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video input card */}
                  <div style={{ background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="form-label" style={{ fontWeight: 600, margin: 0 }}>Product Video</span>
                      <div style={{ display: 'flex', gap: '4px', background: 'var(--color-gray-200)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
                        <button
                          type="button"
                          onClick={() => setVideoInputMode('file')}
                          style={{
                            padding: '2px 8px',
                            fontSize: '10px',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: videoInputMode === 'file' ? 'var(--color-white)' : 'transparent',
                            color: videoInputMode === 'file' ? 'var(--color-gold)' : 'var(--color-gray-500)',
                            transition: 'all 0.2s'
                          }}
                        >
                          File
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoInputMode('url')}
                          style={{
                            padding: '2px 8px',
                            fontSize: '10px',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            background: videoInputMode === 'url' ? 'var(--color-white)' : 'transparent',
                            color: videoInputMode === 'url' ? 'var(--color-gold)' : 'var(--color-gray-500)',
                            transition: 'all 0.2s'
                          }}
                        >
                          YouTube/URL
                        </button>
                      </div>
                    </div>
                    {videoInputMode === 'file' ? (
                      <div>
                        <input type="file" accept="video/mp4,video/webm" onChange={e => setVideoFile(e.target.files[0])} className="form-input" style={{ width: '100%', fontSize: 'var(--text-xs)' }} />
                        <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '4px', display: 'block' }}>MP4, WebM (Max 20MB)</span>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          placeholder="YouTube URL or direct video URL..."
                          value={videoUrlInput}
                          onChange={e => {
                            setVideoUrlInput(e.target.value);
                            setExistingVideo(e.target.value);
                            setVideoFile(null); // clear uploaded file
                          }}
                          className="form-input"
                          style={{ width: '100%', fontSize: 'var(--text-xs)' }}
                        />
                        <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '4px', display: 'block' }}>Paste a YouTube link or a direct video URL</span>
                      </div>
                    )}
                  </div>

                  {/* Certificate input card */}
                  <div style={{ background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)' }}>
                    <label className="form-label" style={{ fontWeight: 600, marginBottom: '12px', display: 'block' }}>Quality Certificate</label>
                    <input type="file" accept="application/pdf" onChange={e => setCertFile(e.target.files[0])} className="form-input" style={{ width: '100%', fontSize: 'var(--text-xs)' }} />
                    <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '4px', display: 'block' }}>PDF document only (e.g. GIA/IGI cert)</span>
                  </div>
                </div>

                {existingImages.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <label className="form-label" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Active Gallery (First image is Featured. Reorder via arrows)</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {existingImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', overflow: 'hidden', background: '#fcfbfa' }}>
                          <img src={getMediaUrl(img)} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span style={{ position: 'absolute', top: 2, left: 2, background: 'var(--color-gold)', color: 'white', fontSize: '8px', padding: '2px 4px', borderRadius: '2px', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                              Featured
                            </span>
                          )}
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'space-between', padding: '2px 6px', alignItems: 'center' }}>
                            <button type="button" onClick={() => handleMoveExistingImage(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: 'white', fontSize: '9px', cursor: idx === 0 ? 'default' : 'pointer', padding: 0, opacity: idx === 0 ? 0.3 : 1 }}>◀</button>
                            <button type="button" onClick={() => handleRemoveExistingImage(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-ruby)', fontSize: '12px', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>×</button>
                            <button type="button" onClick={() => handleMoveExistingImage(idx, 1)} disabled={idx === existingImages.length - 1} style={{ background: 'none', border: 'none', color: 'white', fontSize: '9px', cursor: idx === existingImages.length - 1 ? 'default' : 'pointer', padding: 0, opacity: idx === existingImages.length - 1 ? 0.3 : 1 }}>▶</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(existingVideo || existingCert) && (
                  <div className="responsive-form-grid" style={{ marginTop: '20px' }}>
                    {existingVideo && (
                      <div style={{ padding: '12px 16px', background: 'var(--color-beige)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed var(--color-gold)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>🎥</span>
                          <div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-charcoal)' }}>Active Video</div>
                            <a href={getMediaUrl(existingVideo)} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--color-gold)', textDecoration: 'underline' }}>
                              Preview Video
                            </a>
                          </div>
                        </div>
                        <button type="button" onClick={handleClearExistingVideo} style={{ background: 'transparent', border: '1px solid var(--color-ruby)', color: 'var(--color-ruby)', borderRadius: 'var(--radius-md)', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'var(--color-ruby)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                          Remove Video
                        </button>
                      </div>
                    )}

                    {existingCert && (
                      <div style={{ padding: '12px 16px', background: 'var(--color-beige)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed var(--color-gold)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>📄</span>
                          <div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-charcoal)' }}>Active Certificate</div>
                            <a href={getMediaUrl(existingCert)} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--color-gold)', textDecoration: 'underline' }}>
                              View PDF
                            </a>
                          </div>
                        </div>
                        <button type="button" onClick={handleClearExistingCert} style={{ background: 'transparent', border: '1px solid var(--color-ruby)', color: 'var(--color-ruby)', borderRadius: 'var(--radius-md)', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'var(--color-ruby)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                          Remove Cert
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Section>

              <Section title="Tags & Flags">
                <div className="form-group"><label className="form-label">Tags (comma separated)</label><input name="tags" value={form.tags} onChange={handleFormChange} className="form-input" /></div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' }}><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleFormChange} /> Featured</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' }}><input type="checkbox" name="customizable" checked={form.customizable} onChange={handleFormChange} /> Customizable</label>
                </div>
              </Section>

              <div className="responsive-form-grid" style={{ marginTop: '32px' }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditId(null); }} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={uploading} className="btn btn-primary" style={{ flex: 1 }}>{uploading ? 'Uploading & Saving...' : (editId ? 'Update Product' : 'Save Product')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
