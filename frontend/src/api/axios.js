import axios from 'axios';

const baseURL = 'http://localhost:8000/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THIS IS THE CRITICAL FIX ---
// This interceptor runs before every request is sent.
axiosInstance.interceptors.request.use(
  (config) => {
    // It gets the token from localStorage using the CORRECT key.
    const accessToken = localStorage.getItem('accessToken');
    
    // If the token exists, it adds it to the request header.
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;