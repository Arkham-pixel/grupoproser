import axios from 'axios';
import { showConfig, BASE_URL } from '../config/apiConfig.js';

// Mostrar configuración al inicializar
showConfig();

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar automáticamente el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🌐 ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase() || 'GET'} ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔑 Token expirado, redirigiendo al login...');
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('login');
      localStorage.removeItem('nombre');
      window.location.href = '/login';
    }
    
    console.error('❌ Error en respuesta:', error.message);
    return Promise.reject(error);
  }
);

export default api; 