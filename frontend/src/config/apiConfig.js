/**
 * CONFIGURACIÓN DE API AUTOMÁTICA
 * 
 * Detecta automáticamente si está en desarrollo o producción
 * No hay failover, solo detección inteligente del entorno
 */

// Detectar automáticamente el entorno
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.port === '5173' || // Vite dev server
                     window.location.port === '3000';   // React dev server

// URL base según el entorno detectado
export const BASE_URL = isDevelopment 
  ? 'http://localhost:3000'                    // ← Desarrollo local
  : 'https://aplicacion.grupoproser.com.co';   // ← Producción

// También exportar isDevelopment para uso externo
export const isDevelopmentEnv = isDevelopment;

console.log(`🔧 Entorno detectado: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
console.log(`🌐 URL base: ${BASE_URL}`);

// Función principal para hacer requests
export async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}/api${endpoint}`;
    
    console.log(`🌐 ${options.method || 'GET'} ${url}`);
    
    // Configurar request
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    // Si hay body, convertirlo a data para axios
    if (options.body) {
      config.data = options.body;
      delete config.body;
    }
    
    // Hacer request con axios
    const axios = await import('axios');
    const response = await axios.default(url, config);
    
    return response.data;
    
  } catch (error) {
    console.error(`❌ Error en ${endpoint}:`, error.message);
    throw error;
  }
}

// Endpoints disponibles
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Usuarios
  USUARIOS: '/usuarios',
  USUARIO_BY_ID: (id) => `/usuarios/${id}`,
  
  // Casos
  CASOS_COMPLEX: '/casos',
  CASOS_RIESGO: '/casos-riesgo',
  
  // Siniestros
  SINIESTROS: '/siniestros',
  
  // Estados
  ESTADOS: '/estados',
  
  // Ciudades
  CIUDADES: '/ciudades',
  
  // Responsables
  RESPONSABLES: '/responsables',
  
  // Funcionarios Aseguradora
  FUNCIONARIOS_ASEGURADORA: '/funcionarios-aseguradora',
  
  // Productos Secundarios
  PRODUCTOS_SECUNDARIOS: '/productos-secundarios',
  
  // Clientes
  CLIENTES: '/clientes',
  
  // Tareas
  TAREAS: '/tareas',
  
  // Comunicados
  COMUNICADOS: '/comunicados',
  
  // Upload
  UPLOAD: '/upload'
};

// Función para mostrar configuración actual
export function showConfig() {
  console.log('🔧 === CONFIGURACIÓN ACTUAL ===');
  console.log(`📍 Entorno: ${isDevelopmentEnv ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
  console.log(`🌐 URL Base: ${BASE_URL}`);
  console.log(`🏠 Hostname: ${window.location.hostname}`);
  console.log(`🔌 Puerto: ${window.location.port}`);
  console.log('===============================');
}

// Exportar configuración por defecto
export default {
  BASE_URL,
  isDevelopment: isDevelopmentEnv,
  apiRequest,
  API_ENDPOINTS,
  showConfig
};
