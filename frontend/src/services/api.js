import axios from 'axios';
import config from '../config.js';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar automáticamente el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('login');
      localStorage.removeItem('nombre');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 