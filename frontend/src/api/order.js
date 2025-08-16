// src/api/order.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Make sure this matches your Django server address

/**
 * Places an order using the items currently in the user's cart on the server.
 * @param {object} addressDetails - The shipping and billing address details.
 * @param {string} addressDetails.shipping_address - The formatted shipping address string.
 * @param {string} addressDetails.billing_address - The formatted billing address string.
 * @returns {Promise<object>} The created order data.
 */
export const placeOrder = async (addressDetails) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/orders/place/`, addressDetails, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error placing order:', error.response?.data || error.message);
    // If the cart is empty, the backend will send a 400 error.
    if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
    }
    // Handle token expiry
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    throw error;
  }
};