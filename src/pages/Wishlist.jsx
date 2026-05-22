import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/shop/ProductCard';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>❤️</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Your Wishlist is Empty</h2>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>Save pieces you love and come back to them anytime.</p>
      <Link to="/shop" className="btn btn-primary btn-lg">Explore Collection</Link>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'var(--color-gray-50)', padding: '40px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <div className="container"><h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>My Wishlist ({wishlistItems.length})</h1></div>
      </div>
      <div className="container" style={{ padding: '48px 0 80px' }}>
        <div className="product-grid">{wishlistItems.map(p => <ProductCard key={p._id || p.id} product={p} />)}</div>
      </div>
    </div>
  );
}
