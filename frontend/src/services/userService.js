// src/services/userService.js
import axios from "axios";
import { BASE_URL } from "../config/apiConfig.js";


// Asegúrate de usar el protocolo correcto:
//const API_URL = "https://grupoproser.com.co/api";

//const API_URL = "http://13.59.106.174/api"


export const registrarUsuario = async (datos) => {
  return axios.post(`/api/auth/registro`, datos);
};

export const loginUsuario = async (datos) => {
  return axios.post(`/api/auth/login`, datos);
};

export const obtenerPerfil = async (token, tipo = "normal") => {
  const url =
    tipo === "secur"
          ? `${BASE_URL}/api/secur-auth/perfil`
    : `${BASE_URL}/api/usuarios/perfil`;
  
  console.log('🌐 obtenerPerfil - configuración:', {
    tipo,
    url,
    token: token ? 'SÍ' : 'NO'
  });
  
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nueva función para subir y actualizar la foto de perfil
export const actualizarFoto = (formData, token) => {
  console.log('📸 actualizarFoto - configuración:', {
    BASE_URL,
    token: token ? 'SÍ' : 'NO',
    formDataKeys: formData ? Array.from(formData.keys()) : 'NO DATA'
  });
  
  // Usar la ruta secur-auth específica para fotos
  return axios.put(
    `${BASE_URL}/api/secur-auth/perfil/foto`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const actualizarPerfil = async (data, token, tipo = "normal") => {
  const url =
    tipo === "secur"
          ? `${BASE_URL}/api/secur-auth/perfil`
    : `${BASE_URL}/api/usuarios/perfil`;
  return axios.put(url, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
