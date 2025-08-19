// src/services/complexService.js
import { BASE_URL } from '../config/apiConfig.js';

export const obtenerCasosComplex = async () => {
  try {
    console.log('🔍 Llamando a la API de complex...');
    console.log('🌐 URL:', `${BASE_URL}/api/complex`);
    
    const response = await fetch(`${BASE_URL}/api/complex`);
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error al obtener los casos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en obtenerCasosComplex:', error);
    throw error;
  }
};

export const crearCasoComplex = async (datos) => {
  try {
    const response = await fetch(`${BASE_URL}/api/complex`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
      throw new Error(`Error al crear caso: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error creando caso:', error);
    throw error;
  }
};

export const deleteCasoComplex = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/complex/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar caso: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error eliminando caso:', error);
    throw error;
  }
};

export const updateCasoComplex = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/complex/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error al actualizar caso: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error actualizando caso:', error);
    throw error;
  }
};

export const getCasoComplex = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/complex/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener caso: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error obteniendo caso:', error);
    throw error;
  }
};
