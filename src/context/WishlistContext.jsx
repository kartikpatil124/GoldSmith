import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

const getItemId = (item) => item._id || item.id;

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('goldsmiths-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('goldsmiths-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    const productId = getItemId(product);
    setWishlistItems(prev => {
      if (prev.find(item => getItemId(item) === productId)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => getItemId(item) !== productId));
  };

  const toggleWishlist = (product) => {
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
