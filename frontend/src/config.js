// Configuración de URLs de la API
const config = {
  // Cambiar por la IP de tu servidor EC2
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://TU_IP_EC2:3000' 
    : 'http://localhost:3000'
};

export default config;