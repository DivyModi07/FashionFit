import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/products';

// Get wishlist items
export const getWishlist = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, returning empty wishlist');
      return [];
    }

    const response = await axios.get(`${API_BASE_URL}/wishlist/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return [];
  }
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('access_token');
    console.log('addToWishlist - Token check:', !!token, 'Token length:', token?.length);
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/wishlist/add/`, {
      product_id: productId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return null;
    }

    const response = await axios.delete(`${API_BASE_URL}/wishlist/${wishlistItemId}/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// Check if item is in wishlist
export const checkWishlistStatus = async (productId) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, returning not wishlisted');
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
