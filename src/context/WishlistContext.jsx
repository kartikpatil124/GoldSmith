import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const WishlistContext = createContext();

const getItemId = (item) => item?._id || item?.id;

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('goldsmiths-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync wishlist with backend when user logs in, registers a new account, or logs out
  useEffect(() => {
    if (user && user.token) {
      api.get('/wishlist')
        .then(res => {
          const raw = res.data?.items || res.items || res.data || [];
          const list = Array.isArray(raw) ? raw : [];
          setWishlistItems(list);
          localStorage.setItem('goldsmiths-wishlist', JSON.stringify(list));
        })
        .catch(err => {
          console.error('Failed to sync user wishlist from server:', err);
        });
    } else {
      // Guest or logged out — reset wishlist to empty
      setWishlistItems([]);
      localStorage.removeItem('goldsmiths-wishlist');
    }
  }, [user?._id, user?.token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('goldsmiths-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const addToWishlist = async (product) => {
    if (!product) return;
    const productId = getItemId(product);
    setWishlistItems(prev => {
      if (prev.find(item => getItemId(item) === productId)) return prev;
      return [...prev, product];
    });

    if (user) {
      try {
        await api.post('/wishlist', { productId });
      } catch (err) {
        console.error('Failed to save wishlist item to backend:', err);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;
    setWishlistItems(prev => prev.filter(item => getItemId(item) !== productId));

    if (user) {
      try {
        await api.delete(`/wishlist/${productId}`);
      } catch (err) {
        console.error('Failed to remove wishlist item from backend:', err);
      }
    }
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const productId = getItemId(product);
    if (wishlistItems.find(item => getItemId(item) === productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => wishlistItems.some(item => getItemId(item) === productId);
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
