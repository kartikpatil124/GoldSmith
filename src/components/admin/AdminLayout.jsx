import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 1024) setSidebarOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return null;

  const isAdminLoggedIn = user && (user.role === 'Super Admin' || user.role === 'Admin');

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-gray-50)' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" style={{ display: 'block' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — gets CSS class for mobile toggle */}
      <div className={sidebarOpen ? 'admin-sidebar-open' : ''} style={{ display: 'contents' }}>
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile admin header with hamburger */}
        <div className="admin-mobile-header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: '0.05em' }}>GOLDSMITHS ADMIN</span>
          <div style={{ width: '40px' }} /> {/* Spacer for centering */}
        </div>

        <main className="admin-main-content" style={{ flex: 1, padding: 'clamp(16px, 3vw, 40px)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Responsive admin styles */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar-open aside {
            transform: translateX(0) !important;
            box-shadow: var(--shadow-2xl);
          }
        }
      `}</style>
    </div>
  );
}
