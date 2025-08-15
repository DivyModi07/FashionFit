import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '../api/cart';
import { getWishlist } from '../api/wishlist';

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const [cartData, wishlistData] = await Promise.all([
          getCart(),
          getWishlist()
        ]);
        setCartCount(cartData.length);
        setWishlistCount(wishlistData.length);
      } else {
        setCartCount(0);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
      // Don't redirect here, just set counts to 0
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const updateWishlistCount = (count) => {
    setWishlistCount(count);
  };

  const refreshCounts = () => {
    fetchCounts();
  };

  const value = {
    cartCount,
    wishlistCount,
    updateCartCount,
    updateWishlistCount,
    refreshCounts,
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};
