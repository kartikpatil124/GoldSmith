import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const getItemId = (item) => item._id || item.id;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('goldsmiths-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('goldsmiths-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    const productId = getItemId(product);
    setCartItems(prev => {
      const existing = prev.find(item => getItemId(item) === productId);
      if (existing) {
        return prev.map(item => getItemId(item) === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => getItemId(item) !== productId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCartItems(prev => prev.map(item => getItemId(item) === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, setIsCartOpen, toast, setToast }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
