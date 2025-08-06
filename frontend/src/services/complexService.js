// src/services/complexService.js
import axios from 'axios';

const API_URL ="/api"
export const obtenerCasosComplex = async () => {
  const response = await fetch(`${API_URL}/complex`);
  if (!response.ok) throw new Error("Error al obtener los casos");
  return response.json();
};

export const crearCasoComplex = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/complex`, datos);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando caso:', error);
    throw error;
  }
};

export const deleteCasoComplex = async (id) => {
  const response = await axios.delete(`${API_URL}/complex/${id}`);
  return response.data;
};

export const updateCasoComplex = async (id, data) => {
  const response = await axios.put(`${API_URL}/complex/${id}`, data);
  return response.data;
};

export const getCasoComplex = async (id) => {
  const response = await axios.get(`${API_URL}/complex/${id}`);
  return response.data;
};
