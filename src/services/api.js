import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.API_PRODUCTION_KEY || 'http://localhost:3000' 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;