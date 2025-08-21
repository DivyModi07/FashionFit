// src/api/wishlist.js

import axiosInstance from './axios'; // 👈 CHANGED

const API_BASE_URL = 'http://127.0.0.1:8000/api/products';

// Get wishlist items
export const getWishlist = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return [];
    }

    const response = await axiosInstance.get(`/products/wishlist/`, { // 👈 CHANGED
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    const response = await axiosInstance.post(`/products/wishlist/add/`, { // 👈 CHANGED
      product_id: productId,
    }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    const response = await axiosInstance.delete(`/products/wishlist/${wishlistItemId}/delete/`, { // 👈 CHANGED
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Check if item is in wishlist
export const checkWishlistStatus = async (productId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return { isWishlisted: false };
    }

    const wishlist = await getWishlist();
    const isWishlisted = wishlist.some(item => item.product.id === productId);
    return { isWishlisted };
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return { isWishlisted: false };
  }
};