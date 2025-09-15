// src/services/authService.js
import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('fitflow_token');
      localStorage.removeItem('fitflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('fitflow_token', token);
      localStorage.setItem('fitflow_user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('fitflow_token');
      localStorage.removeItem('fitflow_user');
    }
  },

  // Obtener datos del usuario actual
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Verificar si hay token válido
  isAuthenticated: () => {
    const token = localStorage.getItem('fitflow_token');
    return !!token;
  },

  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('fitflow_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obtener token del localStorage
  getToken: () => {
    return localStorage.getItem('fitflow_token');
  }
};

export default api;