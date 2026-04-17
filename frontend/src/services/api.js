// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Workers
export const workersAPI = {
  getAll: () => api.get('/workers'),
  getNearby: (lat, lon, radius) => api.get(`/workers/nearby?lat=${lat}&lon=${radius}`),
  getById: (id) => api.get(`/workers/${id}`)
};

// Engineers
export const engineersAPI = {
  getMyWorkers: () => api.get('/engineers/workers'),
  addWorker: (data) => api.post('/engineers/add-worker', data),
  assignWork: (data) => api.post('/engineers/assign-work', data),
  takeAttendance: (data) => api.post('/engineers/take-attendance', data),
  giveAdvance: (data) => api.post('/engineers/give-advance', data)
};

// Shop
export const shopAPI = {
  getProducts: () => api.get('/shop/products'),
  getProduct: (id) => api.get(`/shop/products/${id}`),
  addProduct: (data) => api.post('/shop/add-product', data)
};

// Orders
export const ordersAPI = {
  create: (data) => api.post('/orders/create', data),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

// Schemes
export const schemesAPI = {
  getAll: () => api.get('/schemes'),
  getById: (id) => api.get(`/schemes/${id}`),
  add: (data) => api.post('/schemes', data)
};

// AI
export const aiAPI = {
  recommendProducts: (productName) => api.post('/ai/recommend-products', { product_name: productName }),
  recommendSchemes: (role, interests) => api.post('/ai/recommend-schemes', { role, interests }),
  recommendWorkers: (jobDescription) => api.post('/ai/recommend-workers', { job_description: jobDescription })
};

export default api;
