import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const requests = {
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  getMyRequests: () => api.get('/requests/my-requests'),
};

export const volunteers = {
  createOffer: (data) => api.post('/volunteers/offers', data),
  withdrawOffer: (id) => api.put(`/volunteers/offers/${id}/withdraw`),
  getMyOffers: () => api.get('/volunteers/my-offers'),
};

export const admin = {
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  getStats: () => api.get('/admin/stats'),
};

export default api;
