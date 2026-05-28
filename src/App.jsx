import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNavigation from './components/layout/BottomNavigation';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import Bridal from './pages/Bridal';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import CustomOrder from './pages/CustomOrder';
import Account from './pages/Account';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
// import AdminOrders from './pages/admin/AdminOrders'; // Disabled for inquiry-based shift
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminLogin from './pages/admin/AdminLogin';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCustomRequests from './pages/admin/AdminCustomRequests';
import AdminContent from './pages/admin/AdminContent';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSiteManager from './pages/admin/AdminSiteManager';
import { SiteProvider } from './context/SiteContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Toast() {
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.type === 'success' ? '✓' : '✕'}</span>
      <span>{toast.message}</span>
    </div>
  );
}

function WhatsAppButton() {
  return (
    <a href="https://wa.me/919106251842" target="_blank" rel="noopener noreferrer" style={{
      position: 'fixed', bottom: '24px', left: '24px', width: '56px', height: '56px',
      borderRadius: '50%', background: '#25D366', color: 'white', display: 'flex',
      alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(37,211,102,0.4)',
      zIndex: 40, transition: 'transform var(--transition-fast)', fontSize: '24px'
    }} aria-label="WhatsApp Support">💬</a>
  );
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/bridal" element={<Bridal />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Shop />} /> {/* Redirect checkout to shop */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/account" element={<Account />} />
          <Route path="/policies/:type" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
}

function MainApp() {
  return <AppContent />;
}

function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="custom-requests" element={<AdminCustomRequests />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="site-manager" element={<AdminSiteManager />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

function Policies() {
  const { pathname } = useLocation();
  const type = pathname.split('/').pop();
  const policies = {
    shipping: { title: 'Shipping Policy', content: 'We offer standard (5-7 business days), express (2-3 business days), and international shipping (10-15 business days). All orders above ₹50,000 qualify for free shipping. Every shipment is fully insured with tamper-proof packaging. You will receive tracking details via email and SMS once your order is dispatched.' },
    returns: { title: 'Return & Exchange Policy', content: 'We offer a 15-day return policy for all standard products in unused condition with original packaging and certificates. Custom-made jewellery is non-returnable. Exchanges are accepted within 30 days for a different size, metal color, or product of equal or higher value. Refunds are processed within 7-10 business days after receiving the returned item.' },
    privacy: { title: 'Privacy Policy', content: 'We take your privacy seriously. All personal information is encrypted using 256-bit SSL encryption. We do not sell or share your personal data with third parties. Your payment information is processed securely through PCI DSS compliant gateways. You can request deletion of your data at any time by contacting our support team.' },
    terms: { title: 'Terms & Conditions', content: 'By using our website, you agree to these terms and conditions. All products are subject to availability. Prices are in INR and inclusive of applicable taxes. We reserve the right to cancel orders in case of pricing errors. Product images are representative; actual products may vary slightly in color due to photography and screen settings.' },
    warranty: { title: 'Warranty & Repair Policy', content: 'All goldsmiths Jewels products come with a 1-year warranty against manufacturing defects. We offer lifetime cleaning and polishing services for all purchased items. Ring resizing is available free of charge within 6 months of purchase. Repair services are available at nominal charges after the warranty period.' },
  };
  const policy = policies[type] || policies.shipping;

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--color-charcoal), #2d2520)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container"><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-white)' }}>{policy.title}</h1></div>
      </section>
      <section className="section"><div className="container" style={{ maxWidth: '800px' }}><p style={{ color: 'var(--color-gray-600)', lineHeight: 2, fontSize: 'var(--text-lg)' }}>{policy.content}</p></div></section>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>💎</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '32px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="btn btn-primary btn-lg">Return Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/admin/*" element={<AdminApp />} />
                <Route path="*" element={<MainApp />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </SiteProvider>
      </AuthProvider>
    </Router>
  );
}
