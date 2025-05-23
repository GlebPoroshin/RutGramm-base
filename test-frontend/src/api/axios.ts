import axios from 'axios';

// Determine API URL based on the current protocol
const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
const host = 'localhost:8080'; // Adjust this to point to your gateway service
const API_URL = `${protocol}//${host}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api; 