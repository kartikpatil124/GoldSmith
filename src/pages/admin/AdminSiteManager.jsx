import { useState, useEffect } from 'react';
import api, { getMediaUrl, getProductImage } from '../../utils/api';

const PAGES = ['home', 'shop', 'collections', 'bridal', 'about', 'contact', 'faq'];
const BANNER_POSITIONS = ['hero', 'mid', 'footer', 'popup', 'announcement', 'sidebar'];
const DEVICE_VISIBILITY = ['all', 'desktop', 'mobile'];
const LAYOUTS = ['grid-4', 'grid-3', 'grid-2', 'carousel', 'featured-large'];
const BG_STYLES = ['white', 'cream', 'dark', 'gold'];

const DEFAULT_HOMEPAGE_SECTIONS = [
  { sectionKey: 'featured_creations', title: 'Featured Creations', subtitle: 'Timeless Treasures', order: 0, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isFeatured', value: 'true', limit: 8 }, bgStyle: 'cream', showViewAll: true, viewAllLink: '/shop', maxProducts: 8, products: [] },
  { sectionKey: 'new_arrivals', title: 'New Arrivals', subtitle: 'Just Landed', order: 1, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isNewArrival', value: 'true', limit: 8 }, bgStyle: 'white', showViewAll: true, viewAllLink: '/shop?sort=newest', maxProducts: 8, products: [] },
  { sectionKey: 'best_sellers', title: 'Best Sellers', subtitle: 'Most Loved Pieces', order: 2, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'isBestSeller', value: 'true', limit: 8 }, bgStyle: 'cream', showViewAll: true, viewAllLink: '/shop', maxProducts: 8, products: [] },
  { sectionKey: 'bridal_spotlight', title: 'Bridal Spotlight', subtitle: 'Where Forever Begins', order: 3, isVisible: true, layout: 'grid-4', productSource: 'auto', autoRule: { filterBy: 'occasion', value: 'Bridal', limit: 4 }, bgStyle: 'dark', showViewAll: true, viewAllLink: '/bridal', maxProducts: 4, products: [] }
];

export default function AdminSiteManager() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Common Data State
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  // Tab 1: Homepage State
  const [homepageConfig, setHomepageConfig] = useState({
    sections: [],
    heroTitle: '', heroSubtitle: '', heroCTAText: '', heroCTALink: '',
    heroSecondaryCTAText: '', heroSecondaryCTALink: ''
  });
  const [expandedSection, setExpandedSection] = useState(null);

  // Tab 2: Collections State
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const [isColModalOpen, setIsColModalOpen] = useState(false);

  // Tab 3: Banners State
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerUpload, setBannerUpload] = useState(null);

  // Tab 4: Page Content State
  const [selectedPage, setSelectedPage] = useState('home');
  const [pageSections, setPageSections] = useState([]);
  const [editingPageSection, setEditingPageSection] = useState(null);

  // Tab 5: Placement State
  const [placementFilter, setPlacementFilter] = useState('');

  // Notifications helper
  const notify = (msg, isError = false) => {
    setMessage(`${isError ? 'Error: ' : ''}${msg}`);
    setTimeout(() => setMessage(''), 4000);
  };

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const res = await api.get('/products?limit=200');
      const data = res.data || res;
      setAllProducts(data.products || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // Fetchers for Each Tab
  // ----------------------------------------------------
  const fetchHomepageConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/merchandising');
      if (res.success && res.data) {
        setHomepageConfig(res.data);
      } else {
        // default template
        setHomepageConfig({
          sections: DEFAULT_HOMEPAGE_SECTIONS,
          heroTitle: 'Elegance Forged in Eternity',
          heroSubtitle: 'Discover our exclusive collection of handcrafted fine jewellery',
          heroCTAText: 'Explore Collection',
          heroCTALink: '/shop',
          heroSecondaryCTAText: 'Bespoke Design',
          heroSecondaryCTALink: '/custom-order'
        });
      }
    } catch (err) {
      notify(err.message || 'Error loading homepage config', true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/collections/admin');
      if (res.success) {
        setCollections(res.data);
      }
    } catch (err) {
      notify(err.message || 'Error loading collections', true);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/banners/all');
      if (res.success) {
        setBanners(res.data);
      }
    } catch (err) {
      notify(err.message || 'Error loading banners', true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async (page) => {
    try {
      setLoading(true);
      const res = await api.get(`/page-content/all`);
      if (res.success) {
        // Filter page contents by pageKey
        const filtered = res.data.filter(item => item.pageKey === page);
        setPageSections(filtered);
      }
    } catch (err) {
      notify(err.message || 'Error loading page content', true);
    } finally {
      setLoading(false);
    }
  };

  // Run initial triggers based on active tab
  useEffect(() => {
    fetchAllProducts();
    if (activeTab === 'homepage') fetchHomepageConfig();
    else if (activeTab === 'collections') fetchCollections();
    else if (activeTab === 'banners') fetchBanners();
    else if (activeTab === 'page-content') fetchPageContent(selectedPage);
  }, [activeTab, selectedPage]);

  // ----------------------------------------------------
  // TAB 1: HOMEPAGE BUILDER HANDLERS
  // ----------------------------------------------------
  const handleSaveHomepageConfig = async () => {
    try {
      setSaving(true);
      const res = await api.put('/merchandising', homepageConfig);
      if (res.success) {
        notify('Homepage settings saved successfully!');
        fetchHomepageConfig();
      }
    } catch (err) {
      notify(err.message || 'Failed to save homepage configurations', true);
    } finally {
      setSaving(false);
    }
  };

  const handleSectionMetaChange = (index, field, value) => {
    const updatedSections = [...homepageConfig.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setHomepageConfig(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleSectionAutoRuleChange = (index, field, value) => {
    const updatedSections = [...homepageConfig.sections];
    const rule = { ...updatedSections[index].autoRule, [field]: value };
    updatedSections[index] = { ...updatedSections[index], autoRule: rule };
    setHomepageConfig(prev => ({ ...prev, sections: updatedSections }));
  };

  const moveSection = (index, direction) => {
    const sections = [...homepageConfig.sections];
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    // Swap order
    const temp = sections[index];
    sections[index] = sections[target];
    sections[target] = temp;
    // update order indexes
    sections.forEach((sec, idx) => { sec.order = idx; });
    setHomepageConfig(prev => ({ ...prev, sections }));
  };

  const addHomepageSection = () => {
    const newKey = `custom_${Date.now()}`;
    const newSec = {
      sectionKey: newKey,
      title: 'New Section',
      subtitle: 'Curated Collection',
      order: homepageConfig.sections.length,
      isVisible: true,
      layout: 'grid-4',
      productSource: 'auto',
      autoRule: { filterBy: 'isFeatured', value: 'true', limit: 8 },
      bgStyle: 'cream',
      showViewAll: true,
      viewAllLink: '/shop',
      maxProducts: 8,
      products: []
    };
    setHomepageConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSec]
    }));
  };

  const removeHomepageSection = (index) => {
    if (!window.confirm('Are you sure you want to delete this homepage section?')) return;
    const sections = homepageConfig.sections.filter((_, i) => i !== index);
    sections.forEach((sec, idx) => { sec.order = idx; });
    setHomepageConfig(prev => ({ ...prev, sections }));
  };

  // Section manual product managers
  const assignProductToSec = (secIndex, prodId) => {
    const sections = [...homepageConfig.sections];
    const section = sections[secIndex];
    if (section.products.some(p => p.product === prodId || p.product?._id === prodId)) {
      notify('Product is already in this section.', true);
      return;
    }
    const maxOrder = section.products.reduce((max, p) => Math.max(max, p.order || 0), -1);
    section.products.push({ product: prodId, order: maxOrder + 1 });
    setHomepageConfig(prev => ({ ...prev, sections }));
  };

  const removeProductFromSec = (secIndex, prodId) => {
    const sections = [...homepageConfig.sections];
    sections[secIndex].products = sections[secIndex].products.filter(
      p => (p.product?._id || p.product) !== prodId
    );
    setHomepageConfig(prev => ({ ...prev, sections }));
  };

  const moveProductInSec = (secIndex, prodIndex, direction) => {
    const sections = [...homepageConfig.sections];
    const products = [...sections[secIndex].products];
    const target = prodIndex + direction;
    if (target < 0 || target >= products.length) return;
    const temp = products[prodIndex];
    products[prodIndex] = products[target];
    products[target] = temp;
    // update order numbers
    products.forEach((p, idx) => { p.order = idx; });
    sections[secIndex].products = products;
    setHomepageConfig(prev => ({ ...prev, sections }));
  };

  // ----------------------------------------------------
  // TAB 2: COLLECTION MANAGER HANDLERS
  // ----------------------------------------------------
  const handleOpenColModal = (col = null) => {
    if (col) {
      setEditingCollection({
        ...col,
        pageVisibility: col.pageVisibility || [],
        autoRule: col.autoRule || { filterBy: 'tag', value: '', limit: 12 },
        products: col.products || []
      });
    } else {
      setEditingCollection({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        bannerImage: '',
        themeColor: '#C9A84C',
        productSource: 'manual',
        autoRule: { filterBy: 'tag', value: '', limit: 12 },
        pageVisibility: ['collections'],
        isVisible: true,
        sortOrder: collections.length,
        isFeatured: false,
        products: []
      });
    }
    setIsColModalOpen(true);
  };

  const handleSaveCollection = async () => {
    if (!editingCollection.name) return notify('Collection Name is required.', true);
    try {
      setSaving(true);
      const payload = { ...editingCollection };
      let res;
      if (payload._id) {
        res = await api.put(`/collections/${payload._id}`, payload);
      } else {
        res = await api.post('/collections', payload);
      }
      if (res.success) {
        notify('Collection saved successfully!');
        setIsColModalOpen(false);
        setEditingCollection(null);
        fetchCollections();
      }
    } catch (err) {
      notify(err.message || 'Failed to save collection', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Delete this collection entirely?')) return;
    try {
      const res = await api.delete(`/collections/${id}`);
      if (res.success) {
        notify('Collection deleted!');
        fetchCollections();
      }
    } catch (err) {
      notify(err.message || 'Failed to delete collection', true);
    }
  };

  // Collection manual products assignment
  const assignProductToCol = (prodId) => {
    const products = [...editingCollection.products];
    if (products.some(p => (p.product?._id || p.product) === prodId)) {
      return notify('Product already exists in this collection.', true);
    }
    const maxOrder = products.reduce((max, p) => Math.max(max, p.order || 0), -1);
    products.push({ product: allProducts.find(p => p._id === prodId), order: maxOrder + 1 });
    setEditingCollection(prev => ({ ...prev, products }));
  };

  const removeProductFromCol = (prodId) => {
    const products = editingCollection.products.filter(p => (p.product?._id || p.product) !== prodId);
    setEditingCollection(prev => ({ ...prev, products }));
  };

  const moveProductInCol = (index, direction) => {
    const products = [...editingCollection.products];
    const target = index + direction;
    if (target < 0 || target >= products.length) return;
    const temp = products[index];
    products[index] = products[target];
    products[target] = temp;
    products.forEach((p, idx) => { p.order = idx; });
    setEditingCollection(prev => ({ ...prev, products }));
  };

  // ----------------------------------------------------
  // TAB 3: BANNER MANAGER HANDLERS
  // ----------------------------------------------------
  const handleOpenBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner({ ...banner });
    } else {
      setEditingBanner({
        title: '', subtitle: '', body: '', ctaText: '', ctaLink: '/',
        image: '', mobileImage: '', video: '', bgColor: '', textColor: '',
        pageKey: 'home', position: 'hero', deviceVisibility: 'all',
        isActive: true, order: banners.length
      });
    }
    setBannerUpload(null);
    setIsBannerModalOpen(true);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('images', file);
      const res = await api.post('/upload/gallery', fd);
      let urls = res.data || res;
      if (Array.isArray(urls) && urls.length > 0) {
        setEditingBanner(prev => ({ ...prev, image: urls[0] }));
        notify('Banner image uploaded!');
      }
    } catch (err) {
      notify('Upload failed: ' + err.message, true);
    }
  };

  const handleSaveBanner = async () => {
    try {
      setSaving(true);
      const payload = { ...editingBanner };
      let res;
      if (payload._id) {
        res = await api.put(`/banners/${payload._id}`, payload);
      } else {
        res = await api.post('/banners', payload);
      }
      if (res.success) {
        notify('Banner saved successfully!');
        setIsBannerModalOpen(false);
        setEditingBanner(null);
        fetchBanners();
      }
    } catch (err) {
      notify(err.message || 'Failed to save banner', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const res = await api.delete(`/banners/${id}`);
      if (res.success) {
        notify('Banner deleted!');
        fetchBanners();
      }
    } catch (err) {
      notify(err.message || 'Failed to delete banner', true);
    }
  };

  // ----------------------------------------------------
  // TAB 4: PAGE CONTENT EDITOR HANDLERS
  // ----------------------------------------------------
  const handleOpenPageSectionModal = (sectionKey = '') => {
    const sec = pageSections.find(s => s.sectionKey === sectionKey) || {
      pageKey: selectedPage,
      sectionKey,
      title: '', subtitle: '', body: '', image: '', video: '',
      ctaText: '', ctaLink: '', items: [], isActive: true
    };
    setEditingPageSection({ ...sec });
  };

  const handleSavePageSection = async () => {
    try {
      setSaving(true);
      const res = await api.put('/page-content', editingPageSection);
      if (res.success) {
        notify('Page section saved!');
        setEditingPageSection(null);
        fetchPageContent(selectedPage);
      }
    } catch (err) {
      notify(err.message || 'Failed to save page section', true);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPageContentItem = () => {
    const items = [...(editingPageSection.items || [])];
    items.push({ title: '', description: '', image: '', link: '', linkText: '', order: items.length, isActive: true });
    setEditingPageSection(prev => ({ ...prev, items }));
  };

  const handlePageContentItemChange = (idx, field, val) => {
    const items = [...editingPageSection.items];
    items[idx] = { ...items[idx], [field]: val };
    setEditingPageSection(prev => ({ ...prev, items }));
  };

  const handleRemovePageContentItem = (idx) => {
    const items = editingPageSection.items.filter((_, i) => i !== idx);
    setEditingPageSection(prev => ({ ...prev, items }));
  };

  // ----------------------------------------------------
  // TAB 5: DYNAMIC PLACEMENTS MATRIX HANDLERS
  // ----------------------------------------------------
  const handleTogglePlacement = async (product, placementKey) => {
    try {
      let updatedPlacements = [...(product.placements || [])];
      if (updatedPlacements.includes(placementKey)) {
        updatedPlacements = updatedPlacements.filter(p => p !== placementKey);
      } else {
        updatedPlacements.push(placementKey);
      }

      const res = await api.put(`/products/${product._id}`, { placements: updatedPlacements });
      if (res) {
        setAllProducts(prev => prev.map(p => p._id === product._id ? { ...p, placements: updatedPlacements } : p));
        notify(`Placements updated for ${product.name}`);
      }
    } catch (err) {
      notify(err.message || 'Failed to update product placement', true);
    }
  };

  const handleTogglePinProduct = async (product) => {
    try {
      const pinState = !product.isPinned;
      const res = await api.put(`/products/${product._id}`, { isPinned: pinState });
      if (res) {
        setAllProducts(prev => prev.map(p => p._id === product._id ? { ...p, isPinned: pinState } : p));
        notify(`${product.name} is now ${pinState ? 'pinned' : 'unpinned'}`);
      }
    } catch (err) {
      notify(err.message || 'Failed to pin product', true);
    }
  };

  // Filtered products list for assignment panels
  const filteredProducts = allProducts.filter(p => {
    const q = productSearch.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Site Merchandising Manager</h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Merchandise homepage grids, seasonal banners, customized collections, and landing pages.</p>
        </div>
      </div>

      {/* Global Toast Message */}
      {message && (
        <div style={{
          padding: '12px 16px',
          background: message.includes('Error') ? 'rgba(155, 27, 48, 0.1)' : 'rgba(45, 106, 79, 0.1)',
          color: message.includes('Error') ? 'var(--color-ruby)' : 'var(--color-success)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          border: '1px solid ' + (message.includes('Error') ? 'var(--color-ruby)' : 'var(--color-success)'),
          transition: 'all 0.3s ease'
        }}>
          {message}
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-gray-200)', marginBottom: '24px', gap: '8px' }}>
        {[
          { id: 'homepage', label: 'Homepage Builder', icon: '🏠' },
          { id: 'collections', label: 'Collection Manager', icon: '💎' },
          { id: 'banners', label: 'Banner Manager', icon: '🖼️' },
          { id: 'page-content', label: 'Page Content Editor', icon: '📝' },
          { id: 'placements', label: 'Product Placement', icon: '🎯' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--color-gold)' : 'var(--color-gray-500)',
              borderBottom: '3px solid ' + (activeTab === tab.id ? 'var(--color-gold)' : 'transparent'),
              transition: 'all var(--transition-fast)',
              background: 'none'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* TAB 1: HOMEPAGE BUILDER */}
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {activeTab === 'homepage' && (
        <div>
          {/* Hero Banner Quick Edit */}
          <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--color-gray-200)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✨</span> Homepage Hero Text Defaults
            </h3>
            <div className="responsive-form-grid">
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Main Title Heading</label>
                <input value={homepageConfig.heroTitle || ''} onChange={e => setHomepageConfig({ ...homepageConfig, heroTitle: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Subtitle Summary</label>
                <input value={homepageConfig.heroSubtitle || ''} onChange={e => setHomepageConfig({ ...homepageConfig, heroSubtitle: e.target.value })} className="form-input" />
              </div>
            </div>
            <div className="responsive-form-grid">
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Primary CTA Text</label>
                <input value={homepageConfig.heroCTAText || ''} onChange={e => setHomepageConfig({ ...homepageConfig, heroCTAText: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Primary CTA Link</label>
                <input value={homepageConfig.heroCTALink || ''} onChange={e => setHomepageConfig({ ...homepageConfig, heroCTALink: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Secondary CTA Text</label>
                <input value={homepageConfig.heroSecondaryCTAText || ''} onChange={e => setHomepageConfig({ ...homepageConfig, heroSecondaryCTAText: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Secondary CTA Link</label>
                <input value={homepageConfig.heroSecondaryCTALink || ''} onChange={e => setHomepageConfig({ ...homepageConfig, heroSecondaryCTALink: e.target.value })} className="form-input" />
              </div>
            </div>
          </div>

          {/* Section Sorter and Merchandising Panel */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-charcoal)' }}>Homepage Sections List</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={addHomepageSection} className="btn btn-outline-gold" style={{ padding: '8px 16px', fontSize: 'var(--text-xs)' }}>+ Add New Custom Section</button>
              <button onClick={handleSaveHomepageConfig} disabled={saving} className="btn btn-primary" style={{ padding: '8px 24px', fontSize: 'var(--text-xs)' }}>
                {saving ? 'Saving Configurations...' : '💾 Save Homepage Layout'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {homepageConfig.sections?.map((section, idx) => (
              <div key={section.sectionKey} style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid ' + (expandedSection === idx ? 'var(--color-gold)' : 'var(--color-gray-200)'),
                boxShadow: expandedSection === idx ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                {/* Header Row */}
                <div style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: section.isVisible ? 'transparent' : 'var(--color-gray-50)',
                  borderBottom: expandedSection === idx ? '1px solid var(--color-gray-200)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    {/* Ordering arrows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1, fontSize: '10px', padding: '2px', cursor: 'pointer' }}>▲</button>
                      <button onClick={() => moveSection(idx, 1)} disabled={idx === homepageConfig.sections.length - 1} style={{ opacity: idx === homepageConfig.sections.length - 1 ? 0.3 : 1, fontSize: '10px', padding: '2px', cursor: 'pointer' }}>▼</button>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>{section.title || 'Untitled Section'}</span>
                        <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', background: 'var(--color-cream)', border: '1px solid var(--color-gold-light)', color: 'var(--color-gold-dark)', borderRadius: 'var(--radius-sm)' }}>
                          {section.sectionKey}
                        </span>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                        {section.subtitle || 'No subtitle'} &bull; {section.productSource === 'manual' ? `${section.products?.length || 0} products manual` : `Auto: ${section.autoRule?.filterBy || 'filter'}`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-600)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={section.isVisible} onChange={e => handleSectionMetaChange(idx, 'isVisible', e.target.checked)} />
                      Visible
                    </label>

                    <button
                      onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                      style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', fontWeight: 700, padding: '6px 12px', border: '1px solid var(--color-gold-light)', borderRadius: 'var(--radius-sm)' }}
                    >
                      {expandedSection === idx ? 'Hide Merchandiser' : '⚙️ Configure Placement'}
                    </button>

                    <button onClick={() => removeHomepageSection(idx)} style={{ color: 'var(--color-ruby)', fontSize: '18px', padding: '4px', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>

                {/* Expanded Merchandiser Panel */}
                {expandedSection === idx && (
                  <div style={{ padding: '24px', background: 'var(--color-cream)', borderTop: '1px solid var(--color-gray-100)' }}>
                    <div className="responsive-form-grid">
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Section Header Title</label>
                        <input value={section.title} onChange={e => handleSectionMetaChange(idx, 'title', e.target.value)} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Subheading / Intro</label>
                        <input value={section.subtitle} onChange={e => handleSectionMetaChange(idx, 'subtitle', e.target.value)} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>View All Button Link</label>
                        <input value={section.viewAllLink || ''} onChange={e => handleSectionMetaChange(idx, 'viewAllLink', e.target.value)} className="form-input" />
                      </div>
                    </div>

                    <div className="responsive-form-grid">
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Display Grid Layout</label>
                        <select value={section.layout} onChange={e => handleSectionMetaChange(idx, 'layout', e.target.value)} className="form-input">
                          {LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Background Style Theme</label>
                        <select value={section.bgStyle} onChange={e => handleSectionMetaChange(idx, 'bgStyle', e.target.value)} className="form-input">
                          {BG_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Dynamic Source Engine</label>
                        <select value={section.productSource} onChange={e => handleSectionMetaChange(idx, 'productSource', e.target.value)} className="form-input">
                          <option value="auto">Auto-populated by Rules</option>
                          <option value="manual">Manually Assigned Products</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Max Products to Render</label>
                        <input type="number" value={section.maxProducts || 8} onChange={e => handleSectionMetaChange(idx, 'maxProducts', Number(e.target.value))} className="form-input" />
                      </div>
                    </div>

                    {/* Auto Rules Configuration */}
                    {section.productSource === 'auto' && (
                      <div style={{ background: 'var(--color-white)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '12px' }}>⚙️ Smart Auto-Rule Resolution Engine</h4>
                        <div className="responsive-form-grid">
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Filter Field Criteria</label>
                            <select value={section.autoRule?.filterBy || 'isFeatured'} onChange={e => handleSectionAutoRuleChange(idx, 'filterBy', e.target.value)} className="form-input">
                              <option value="isFeatured">Is Featured Jewellery</option>
                              <option value="isBestSeller">Is Best Seller Item</option>
                              <option value="isNewArrival">Is New Arrival Item</option>
                              <option value="category">Product Category Match</option>
                              <option value="occasion">Occasion Type Match (e.g. Bridal)</option>
                              <option value="metal">Metal Type Match (e.g. Gold, Platinum)</option>
                              <option value="tag">General Tag Word Match</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Matching Keyphrase / Value</label>
                            <input value={section.autoRule?.value || ''} onChange={e => handleSectionAutoRuleChange(idx, 'value', e.target.value)} placeholder="e.target. 'Bridal', 'true', etc." className="form-input" />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Fetch Limit</label>
                            <input type="number" value={section.autoRule?.limit || 8} onChange={e => handleSectionAutoRuleChange(idx, 'limit', Number(e.target.value))} className="form-input" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manual Products Assignment Merchandiser */}
                    {section.productSource === 'manual' && (
                      <div className="responsive-form-grid" style={{ background: 'var(--color-white)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)' }}>
                        {/* Assigned Products with Reordering */}
                        <div>
                          <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '12px' }}>Assigned Products ({section.products?.length || 0})</h4>
                          <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
                            {section.products?.length === 0 ? (
                              <p style={{ padding: '20px', color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>No products manually placed. Use search panel on the right.</p>
                            ) : (
                              section.products?.map((item, pidx) => {
                                const prod = allProducts.find(p => p._id === (item.product?._id || item.product));
                                return (
                                  <div key={pidx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderBottom: '1px solid var(--color-gray-100)', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <img src={getMediaUrl(getProductImage(prod))} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                      <div>
                                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-charcoal)' }}>{prod?.name || 'Loading item details...'}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{prod?.sku || 'SKU'}</div>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        <button onClick={() => moveProductInSec(idx, pidx, -1)} disabled={pidx === 0} style={{ opacity: pidx === 0 ? 0.3 : 1, fontSize: '10px', padding: '2px', cursor: 'pointer' }}>▲</button>
                                        <button onClick={() => moveProductInSec(idx, pidx, 1)} disabled={pidx === section.products.length - 1} style={{ opacity: pidx === section.products.length - 1 ? 0.3 : 1, fontSize: '10px', padding: '2px', cursor: 'pointer' }}>▼</button>
                                      </div>
                                      <button onClick={() => removeProductFromSec(idx, prod?._id)} style={{ color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>Remove</button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Search and Assign */}
                        <div>
                          <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '12px' }}>Search Inventory</h4>
                          <input
                            placeholder="Type name, sku, or category..."
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', marginBottom: '10px' }}
                          />
                          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
                            {filteredProducts.slice(0, 15).map(prod => (
                              <div key={prod._id} style={{ display: 'flex', alignItems: 'center', justifyBehavior: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--color-gray-100)', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <img src={getMediaUrl(getProductImage(prod))} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                  <div>
                                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>{prod.name}</div>
                                    <div style={{ fontSize: '9px', color: 'var(--color-gray-400)' }}>{prod.sku}</div>
                                  </div>
                                </div>
                                <button onClick={() => assignProductToSec(idx, prod._id)} className="btn btn-outline-gold" style={{ fontSize: '10px', padding: '4px 8px' }}>+ Assign</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* TAB 2: COLLECTION MANAGER */}
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {activeTab === 'collections' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Jewellery Collections ({collections.length})</h2>
            <button onClick={() => handleOpenColModal()} className="btn btn-primary">+ Create New Collection</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {collections.map(col => (
              <div key={col._id} style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                {col.bannerImage ? (
                  <img src={getMediaUrl(col.bannerImage)} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '140px', background: 'var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>💎 No Banner Asset</div>
                )}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-charcoal)' }}>{col.name}</h3>
                      <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: col.isVisible ? 'rgba(45,106,79,0.1)' : 'rgba(155, 27, 48, 0.1)', color: col.isVisible ? 'var(--color-success)' : 'var(--color-ruby)', fontWeight: 600 }}>
                        {col.isVisible ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', margin: '4px 0 12px 0', lineHeight: '1.4' }}>{col.description || 'No description provided.'}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {col.pageVisibility?.map(p => (
                        <span key={p} style={{ fontSize: '9px', background: 'var(--color-gray-100)', color: 'var(--color-gray-600)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>{p}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-gray-100)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                      {col.productSource === 'manual' ? `${col.products?.length || 0} Items Manual` : 'Rule Auto-engine'}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenColModal(col)} className="btn btn-outline-gold" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}>Edit</button>
                      <button onClick={() => handleDeleteCollection(col._id)} style={{ color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', padding: '6px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collection Create/Edit Modal */}
          {isColModalOpen && editingCollection && (
            <div className="admin-modal-overlay">
              <div className="admin-modal-content" style={{ maxWidth: '850px' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                  {editingCollection._id ? 'Modify Collection Details' : 'Create Custom Collection'}
                </h3>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Collection Name *</label>
                    <input
                      value={editingCollection.name}
                      onChange={e => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingCollection({ ...editingCollection, name, slug });
                      }}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Custom Slug (Unique URL Path)</label>
                    <input value={editingCollection.slug} onChange={e => setEditingCollection({ ...editingCollection, slug: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Description Heading</label>
                  <textarea value={editingCollection.description} onChange={e => setEditingCollection({ ...editingCollection, description: e.target.value })} className="form-input" rows="2" />
                </div>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Banner Image URL Asset</label>
                    <input value={editingCollection.bannerImage || ''} onChange={e => setEditingCollection({ ...editingCollection, bannerImage: e.target.value })} className="form-input" placeholder="e.target. /uploads/banner.jpg" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Page Placement Visibility</label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                      {['collections', 'home', 'bridal'].map(p => (
                        <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={editingCollection.pageVisibility?.includes(p)}
                            onChange={e => {
                              let list = [...(editingCollection.pageVisibility || [])];
                              if (e.target.checked) list.push(p);
                              else list = list.filter(item => item !== p);
                              setEditingCollection({ ...editingCollection, pageVisibility: list });
                            }}
                          />
                          {p}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Sort Order Priority</label>
                    <input type="number" value={editingCollection.sortOrder || 0} onChange={e => setEditingCollection({ ...editingCollection, sortOrder: Number(e.target.value) })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Visible to Customers</label>
                    <div style={{ marginTop: '8px' }}>
                      <input type="checkbox" checked={editingCollection.isVisible} onChange={e => setEditingCollection({ ...editingCollection, isVisible: e.target.checked })} />
                      <span style={{ fontSize: 'var(--text-xs)', marginLeft: '8px' }}>Show on site</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Loading Source</label>
                    <select value={editingCollection.productSource} onChange={e => setEditingCollection({ ...editingCollection, productSource: e.target.value })} className="form-input">
                      <option value="manual">Manual Products Selection</option>
                      <option value="auto">Auto-populated by Rules</option>
                    </select>
                  </div>
                </div>

                {/* Auto Rules for collection */}
                {editingCollection.productSource === 'auto' && (
                  <div style={{ background: 'var(--color-cream)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold-light)', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gold-dark)', textTransform: 'uppercase', marginBottom: '12px' }}>⚙️ Auto-Rule Population Settings</h4>
                    <div className="responsive-form-grid">
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Rule Key Criteria</label>
                        <select
                          value={editingCollection.autoRule?.filterBy || 'tag'}
                          onChange={e => setEditingCollection({
                            ...editingCollection,
                            autoRule: { ...(editingCollection.autoRule || {}), filterBy: e.target.value }
                          })}
                          className="form-input"
                        >
                          <option value="tag">General Tag Word Match</option>
                          <option value="category">Category Match (e.target. Rings)</option>
                          <option value="occasion">Occasion Match (e.target. Wedding)</option>
                          <option value="collectionName">Collection Schema Field Match</option>
                          <option value="metal">Metal Name Match</option>
                          <option value="isFeatured">Is Featured</option>
                          <option value="isBestSeller">Is Best Seller</option>
                          <option value="isNewArrival">Is New Arrival</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Matching Key Value</label>
                        <input
                          value={editingCollection.autoRule?.value || ''}
                          onChange={e => setEditingCollection({
                            ...editingCollection,
                            autoRule: { ...(editingCollection.autoRule || {}), value: e.target.value }
                          })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Max Count to Load</label>
                        <input
                          type="number"
                          value={editingCollection.autoRule?.limit || 12}
                          onChange={e => setEditingCollection({
                            ...editingCollection,
                            autoRule: { ...(editingCollection.autoRule || {}), limit: Number(e.target.value) }
                          })}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Product Selector for Collections */}
                {editingCollection.productSource === 'manual' && (
                  <div className="responsive-form-grid" style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '12px' }}>Collection Products ({editingCollection.products?.length || 0})</h4>
                      <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
                        {editingCollection.products?.length === 0 ? (
                          <p style={{ padding: '20px', color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)' }}>No products assigned.</p>
                        ) : (
                          editingCollection.products?.map((item, pidx) => {
                            const p = allProducts.find(p => p._id === (item.product?._id || item.product));
                            return (
                              <div key={pidx} style={{ display: 'flex', alignItems: 'center', justifyBehavior: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--color-gray-100)', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{p?.name || 'Loaded item'}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    <button onClick={() => moveProductInCol(pidx, -1)} disabled={pidx === 0} style={{ padding: '2px', fontSize: '9px', cursor: 'pointer' }}>▲</button>
                                    <button onClick={() => moveProductInCol(pidx, 1)} disabled={pidx === editingCollection.products.length - 1} style={{ padding: '2px', fontSize: '9px', cursor: 'pointer' }}>▼</button>
                                  </div>
                                  <button onClick={() => removeProductFromCol(p?._id)} style={{ color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>Remove</button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '12px' }}>Assign From Inventory</h4>
                      <input
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', marginBottom: '10px' }}
                      />
                      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}>
                        {filteredProducts.slice(0, 10).map(p => (
                          <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyBehavior: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--color-gray-100)', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 'var(--text-xs)' }}>{p.name} ({p.sku})</span>
                            <button onClick={() => assignProductToCol(p._id)} className="btn btn-outline-gold" style={{ padding: '4px 8px', fontSize: '9px' }}>+ Add</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => setIsColModalOpen(false)} className="btn btn-outline-gold" style={{ padding: '8px 20px' }}>Cancel</button>
                  <button onClick={handleSaveCollection} disabled={saving} className="btn btn-primary" style={{ padding: '8px 24px' }}>
                    {saving ? 'Saving...' : '💾 Save Collection'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* TAB 3: BANNER MANAGER */}
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {activeTab === 'banners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Seasonal & Promo Banners ({banners.length})</h2>
            <button onClick={() => handleOpenBannerModal()} className="btn btn-primary">+ Add New Banner</button>
          </div>

          <div className="admin-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-50)', textAlign: 'left', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Banner Details</th>
                <th style={{ padding: '16px 20px' }}>Placement Page</th>
                <th style={{ padding: '16px 20px' }}>Position</th>
                <th style={{ padding: '16px 20px' }}>Devices</th>
                <th style={{ padding: '16px 20px' }}>Priority Order</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner._id} style={{ borderBottom: '1px solid var(--color-gray-100)', fontSize: 'var(--text-sm)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {banner.image ? (
                        <img src={getMediaUrl(banner.image)} style={{ width: '56px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      ) : (
                        <div style={{ width: '56px', height: '36px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)' }}></div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700 }}>{banner.title || 'Untitled Banner'}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{banner.subtitle || 'No subtitle'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', padding: '2px 6px', background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{banner.pageKey}</span>
                  </td>
                  <td style={{ padding: '16px 20px', textTransform: 'capitalize' }}>{banner.position}</td>
                  <td style={{ padding: '16px 20px', textTransform: 'capitalize' }}>{banner.deviceVisibility}</td>
                  <td style={{ padding: '16px 20px' }}>{banner.order || 0}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600,
                      background: banner.isActive ? 'rgba(45,106,79,0.1)' : 'rgba(155, 27, 48, 0.1)',
                      color: banner.isActive ? 'var(--color-success)' : 'var(--color-ruby)'
                    }}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenBannerModal(banner)} className="btn btn-outline-gold" style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}>Edit</button>
                      <button onClick={() => handleDeleteBanner(banner._id)} style={{ color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Banner Create/Edit Modal */}
          {isBannerModalOpen && editingBanner && (
            <div className="admin-modal-overlay">
              <div className="admin-modal-content" style={{ maxWidth: '750px' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                  {editingBanner._id ? 'Configure Banner Element' : 'Add New Promotional Banner'}
                </h3>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Banner Heading Title</label>
                    <input value={editingBanner.title} onChange={e => setEditingBanner({ ...editingBanner, title: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subheading Caption</label>
                    <input value={editingBanner.subtitle} onChange={e => setEditingBanner({ ...editingBanner, subtitle: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Body Text Summary Content</label>
                  <textarea value={editingBanner.body} onChange={e => setEditingBanner({ ...editingBanner, body: e.target.value })} className="form-input" rows="2" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Action CTA Button Text</label>
                    <input value={editingBanner.ctaText} onChange={e => setEditingBanner({ ...editingBanner, ctaText: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Action CTA Button Link</label>
                    <input value={editingBanner.ctaLink} onChange={e => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Banner Image URL / File *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input value={editingBanner.image || ''} onChange={e => setEditingBanner({ ...editingBanner, image: e.target.value })} className="form-input" style={{ flex: 1 }} />
                      <label className="btn btn-outline-gold" style={{ fontSize: 'var(--text-xs)', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        Upload File
                        <input type="file" onChange={handleBannerUpload} style={{ display: 'none' }} accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Optimised Image URL</label>
                    <input value={editingBanner.mobileImage || ''} onChange={e => setEditingBanner({ ...editingBanner, mobileImage: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Page Key Target</label>
                    <select value={editingBanner.pageKey} onChange={e => setEditingBanner({ ...editingBanner, pageKey: e.target.value })} className="form-input">
                      {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
                      <option value="all">All Pages</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position Placement</label>
                    <select value={editingBanner.position} onChange={e => setEditingBanner({ ...editingBanner, position: e.target.value })} className="form-input">
                      {BANNER_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Device Visibility Target</label>
                    <select value={editingBanner.deviceVisibility} onChange={e => setEditingBanner({ ...editingBanner, deviceVisibility: e.target.value })} className="form-input">
                      {DEVICE_VISIBILITY.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Ordering Priority Number</label>
                    <input type="number" value={editingBanner.order || 0} onChange={e => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })} className="form-input" />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--text-xs)' }}>
                      <input type="checkbox" checked={editingBanner.isActive} onChange={e => setEditingBanner({ ...editingBanner, isActive: e.target.checked })} />
                      Banner Active
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => setIsBannerModalOpen(false)} className="btn btn-outline-gold" style={{ padding: '8px 20px' }}>Cancel</button>
                  <button onClick={handleSaveBanner} disabled={saving} className="btn btn-primary" style={{ padding: '8px 24px' }}>
                    {saving ? 'Saving...' : '💾 Save Banner'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* TAB 4: PAGE CONTENT EDITOR */}
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {activeTab === 'page-content' && (
        <div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '200px' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', marginBottom: '4px' }}>Page to Customise:</label>
              {PAGES.map(page => (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    background: selectedPage === page ? 'var(--color-gold)' : 'var(--color-white)',
                    color: selectedPage === page ? 'white' : 'var(--color-charcoal)',
                    border: '1px solid ' + (selectedPage === page ? 'var(--color-gold)' : 'var(--color-gray-200)'),
                    cursor: 'pointer'
                  }}
                >
                  {page.toUpperCase()} PAGE
                </button>
              ))}
            </div>

            <div style={{ flex: 1, background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, textTransform: 'capitalize' }}>{selectedPage} Page Customizable Sections ({pageSections.length})</h3>
                <button onClick={() => handleOpenPageSectionModal(`sec_${Date.now()}`)} className="btn btn-outline-gold" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}>+ Add Section Key</button>
              </div>

              {pageSections.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '40px', fontSize: 'var(--text-sm)' }}>No custom text sections added yet for this page.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pageSections.map(sec => (
                    <div key={sec._id} style={{ padding: '16px 20px', background: 'var(--color-cream)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{sec.title || 'Untitled Section'}</span>
                          <span style={{ fontSize: '9px', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>{sec.sectionKey}</span>
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '4px' }}>{sec.subtitle || 'No subtitle'} &bull; {sec.items?.length || 0} sub-items</div>
                      </div>
                      <button onClick={() => setEditingPageSection(sec)} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: 'var(--text-xs)' }}>Configure Block</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Page Section Detail Configuration modal */}
          {editingPageSection && (
            <div className="admin-modal-overlay">
              <div className="admin-modal-content" style={{ maxWidth: '800px' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
                  Configure Content block: <span style={{ color: 'var(--color-gold)' }}>{editingPageSection.sectionKey}</span>
                </h3>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">Heading Title Text</label>
                    <input value={editingPageSection.title || ''} onChange={e => setEditingPageSection({ ...editingPageSection, title: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Intro Subtitle</label>
                    <input value={editingPageSection.subtitle || ''} onChange={e => setEditingPageSection({ ...editingPageSection, subtitle: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Body Text / HTML</label>
                  <textarea value={editingPageSection.body || ''} onChange={e => setEditingPageSection({ ...editingPageSection, body: e.target.value })} className="form-input" rows="4" />
                </div>

                <div className="responsive-form-grid">
                  <div className="form-group">
                    <label className="form-label">CTA Text</label>
                    <input value={editingPageSection.ctaText || ''} onChange={e => setEditingPageSection({ ...editingPageSection, ctaText: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CTA Redirect URL</label>
                    <input value={editingPageSection.ctaLink || ''} onChange={e => setEditingPageSection({ ...editingPageSection, ctaLink: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Featured Section Banner Image URL</label>
                  <input value={editingPageSection.image || ''} onChange={e => setEditingPageSection({ ...editingPageSection, image: e.target.value })} className="form-input" />
                </div>

                {/* Sub-items array manager */}
                <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>Structured Sub-items List (FAQs, Badges, etc.)</h4>
                    <button onClick={handleAddPageContentItem} className="btn btn-outline-gold" style={{ fontSize: '10px', padding: '4px 10px' }}>+ Add Row</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {editingPageSection.items?.map((item, idx) => (
                      <div key={idx} style={{ padding: '16px', background: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)' }}>
                        <div className="responsive-form-grid" style={{ marginBottom: '8px' }}>
                          <input placeholder="Item Heading" value={item.title || ''} onChange={e => handlePageContentItemChange(idx, 'title', e.target.value)} className="form-input" style={{ fontSize: 'var(--text-xs)' }} />
                          <input placeholder="Action Link (e.target. /shop)" value={item.link || ''} onChange={e => handlePageContentItemChange(idx, 'link', e.target.value)} className="form-input" style={{ fontSize: 'var(--text-xs)' }} />
                        </div>
                        <textarea placeholder="Description detail text..." value={item.description || ''} onChange={e => handlePageContentItemChange(idx, 'description', e.target.value)} className="form-input" rows="2" style={{ fontSize: 'var(--text-xs)', marginBottom: '8px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <input placeholder="Image URL / Icon code" value={item.image || ''} onChange={e => handlePageContentItemChange(idx, 'image', e.target.value)} className="form-input" style={{ fontSize: '10px', width: '60%' }} />
                          <button onClick={() => handleRemovePageContentItem(idx)} style={{ color: 'var(--color-ruby)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>Remove row</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => setEditingPageSection(null)} className="btn btn-outline-gold" style={{ padding: '8px 20px' }}>Cancel</button>
                  <button onClick={handleSavePageSection} disabled={saving} className="btn btn-primary" style={{ padding: '8px 24px' }}>
                    {saving ? 'Saving...' : '💾 Save Content Block'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* TAB 5: PRODUCT PLACEMENT MATRIX */}
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {activeTab === 'placements' && (
        <div>
          <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', padding: '20px', border: '1px solid var(--color-gray-200)', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>🔍 Filter Inventory:</span>
            <input
              placeholder="Search products by SKU or Name..."
              value={placementFilter}
              onChange={e => setPlacementFilter(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', fontSize: 'var(--text-sm)' }}
            />
          </div>

          <div className="admin-table-wrapper" style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-gray-50)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>Product Title</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>SKU Code</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'center' }}>Homepage Featured Placements</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'center' }}>Bridal Suite Tag</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'center' }}>Pin to Top</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.filter(p => !placementFilter || p.name?.toLowerCase().includes(placementFilter.toLowerCase()) || p.sku?.toLowerCase().includes(placementFilter.toLowerCase())).map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--color-gray-100)', fontSize: 'var(--text-sm)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={getMediaUrl(getProductImage(p))} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>{p.sku}</td>
                    <td style={{ padding: '16px 20px' }}>{p.category}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={p.placements?.includes('home_featured')}
                        onChange={() => handleTogglePlacement(p, 'home_featured')}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={p.placements?.includes('bridal')}
                        onChange={() => handleTogglePlacement(p, 'bridal')}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleTogglePinProduct(p)}
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          opacity: p.isPinned ? 1 : 0.3,
                          color: p.isPinned ? 'var(--color-gold)' : 'var(--color-gray-400)',
                          background: 'none'
                        }}
                      >
                        📌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
