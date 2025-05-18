import api from './api.js';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/users/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.get('/api/users/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;