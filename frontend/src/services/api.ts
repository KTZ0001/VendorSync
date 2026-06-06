import axios from 'axios';

const api = axios.create({
  // Force use of 127.0.0.1 to avoid IPv6/localhost resolution delays and CORS issues
  baseURL: 'http://127.0.0.1:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Add interceptor to handle auth tokens if they exist
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('DEBUG: Auth Token from localStorage:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('DEBUG: Authorization Header set:', config.headers.Authorization);
  } else {
    console.warn('DEBUG: No token found in localStorage');
  }
  return config;
});

export default api;
