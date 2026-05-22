import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '💎' },
    { name: 'Orders', path: '/admin/orders', icon: '📦' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Custom Requests', path: '/admin/custom-requests', icon: '🎨' },
    { name: 'Coupons', path: '/admin/coupons', icon: '🏷️' },
    { name: 'Content', path: '/admin/content', icon: '📝' },
    { name: 'Site Manager', path: '/admin/site-manager', icon: '🏪' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <aside style={{ width: '260px', background: 'var(--color-charcoal)', color: 'var(--color-white)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Brand */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '0.05em' }}>GOLDSMITHS</span>
          <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>ADMIN PORTAL</span>
        </Link>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.name} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: isActive ? 'var(--color-gold)' : 'transparent', color: isActive ? 'white' : 'var(--color-gray-400)', fontWeight: 500, transition: 'all var(--transition-fast)' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{user?.name?.charAt(0) || 'A'}</div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{user?.email || 'admin@lumiere.com'}</div>
          </div>
        </div>
        <button onClick={() => { logout(); window.location.href = '/admin/login'; }} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer', transition: 'background var(--transition-fast)' }} onMouseOver={e => e.target.style.background = 'rgba(255,0,0,0.2)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
          Logout
        </button>
      </div>
    </aside>
  );
}
