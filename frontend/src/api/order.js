// src/api/order.js

import axiosInstance from './axios'; // 👈 CHANGED

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const placeOrder = async (addressDetails) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    const response = await axiosInstance.post(`/orders/place/`, addressDetails, { // 👈 CHANGED
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error placing order:', error.response?.data || error.message);
    if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const buyNow = async (productId, quantity, addressDetails) => {
  try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
          window.location.href = '/login';
          return null;
      }

      const payload = {
          product_id: productId,
          quantity: quantity,
          shipping_address: addressDetails.shipping_address,
          billing_address: addressDetails.billing_address,
      };

      const response = await axiosInstance.post(`/orders/buy-now/`, payload, { // 👈 CHANGED
          headers: { 'Authorization': `Bearer ${token}` }
      });

      return response.data;
  } catch (error) {
      console.error('Error in Buy Now:', error.response?.data || error.message);
      if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
      }
      throw error;
  }
};