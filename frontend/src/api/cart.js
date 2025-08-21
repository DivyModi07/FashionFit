// src/api/cart.js

import axiosInstance from './axios'; // 👈 CHANGED

const API_BASE_URL = 'http://127.0.0.1:8000/api/products';

// Get cart items
export const getCart = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, returning empty cart');
      return [];
    }

    const response = await axiosInstance.get(`/products/cart/`, { // 👈 CHANGED
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    // The interceptor will now handle the 401 error, so this redirect is a fallback.
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return [];
  }
};

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    const response = await axiosInstance.post(`/products/cart/add/`, { // 👈 CHANGED
      product_id: productId,
      quantity: quantity,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error; // The interceptor will handle it
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    const response = await axiosInstance.delete(`/products/cart/${cartItemId}/delete/`, { // 👈 CHANGED
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    const response = await axiosInstance.patch(`/products/cart/${cartItemId}/update/`, { // 👈 CHANGED
      quantity: quantity,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};