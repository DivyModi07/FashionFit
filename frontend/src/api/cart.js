import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/products';

// Get cart items
export const getCart = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, returning empty cart');
      return [];
    }

    const response = await axios.get(`${API_BASE_URL}/cart/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
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
    console.log('addToCart - Token check:', !!token, 'Token length:', token?.length);
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/cart/add/`, {
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
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return null;
    }

    const response = await axios.delete(`${API_BASE_URL}/cart/${cartItemId}/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return null;
    }

    const response = await axios.patch(`${API_BASE_URL}/cart/${cartItemId}/update/`, {
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
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }
};
