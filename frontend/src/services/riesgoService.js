import axios from "axios";
import { BASE_URL } from "../config/apiConfig.js";

// Configurar axios con timeouts más largos para Firebase -> AWS
const api = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

export const obtenerCasos = async () => {
  const res = await api.get(`${BASE_URL}/api/riesgos`);
  return res.data;
};

export const obtenerCasosRiesgo = async () => {
  const res = await api.get(`${BASE_URL}/api/riesgos`);
  return res.data;
};

export const eliminarCaso = async (id) => {
  return api.delete(`${BASE_URL}/api/riesgos/${id}`);
};

export const deleteCasoRiesgo = async (id) => {
  return api.delete(`${BASE_URL}/api/riesgos/${id}`);
};

export const obtenerResponsables = async () => {
  const res = await api.get(`${BASE_URL}/api/responsables`);
  return res.data;
};

export const obtenerEstados = async () => {
  const res = await api.get(`${BASE_URL}/api/estados/estados-riesgos`);
  return res.data;
};

export const obtenerAseguradoras = async () => {
  const res = await api.get(`${BASE_URL}/api/clientes`);
  return res.data;
};

export const obtenerCiudades = async () => {
  const res = await api.get(`${BASE_URL}/api/ciudades`);
  return res.data;
};

