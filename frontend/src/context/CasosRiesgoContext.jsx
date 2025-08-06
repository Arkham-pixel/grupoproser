import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config.js";

// Configurar axios con timeouts más largos para Firebase -> AWS
const api = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

const CasosRiesgoContext = createContext();

export const useCasosRiesgo = () => useContext(CasosRiesgoContext); // SOLO UNA VEZ

export const CasosRiesgoProvider = ({ children }) => {
  const [casos, setCasos] = useState([]);

  // Cargar casos desde el backend al iniciar
  useEffect(() => {
    cargarCasos();
  }, []);

  const cargarCasos = async () => {
    try {
      const res = await api.get(`${config.API_BASE_URL}/api/riesgos`);
      setCasos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar casos de riesgo:", err);
      setCasos([]);
    }
  };

  const agregarCaso = async (nuevoCaso) => {
    try {
      console.log('📝 DATOS A ENVIAR DESDE FRONTEND:', JSON.stringify(nuevoCaso, null, 2));
      
      let dataToSend = nuevoCaso;
      let config = {};
      // Si hay archivos adjuntos, usar FormData
      const formData = new FormData();
      let hasFile = false;
      Object.entries(nuevoCaso).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
          hasFile = true;
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      if (hasFile) {
        dataToSend = formData;
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      
      console.log('📤 ENVIANDO AL BACKEND:', dataToSend);
      
      const response = await api.post(`${config.API_BASE_URL}/api/riesgos`, dataToSend, config);
      
      console.log('✅ RESPUESTA DEL BACKEND:', response.data);
      
      // Mostrar notificación de éxito
      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
      }
      
      await cargarCasos();
    } catch (err) {
      console.error('❌ Error al agregar caso de riesgo:', err);
      console.error('❌ Detalles del error:', err.response?.data);
      
      // Mostrar error al usuario
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el caso de riesgo';
      alert(`❌ ${errorMessage}`);
    }
  };

  const editarCaso = async (index, nuevoCaso) => {
    try {
      const caso = casos[index];
      if (!caso || !caso._id) throw new Error('No se encontró el caso a editar');
      let dataToSend = nuevoCaso;
      let config = {};
      const formData = new FormData();
      let hasFile = false;
      Object.entries(nuevoCaso).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
          hasFile = true;
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      if (hasFile) {
        dataToSend = formData;
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      await api.put(`${config.API_BASE_URL}/api/riesgos/${caso._id}`, dataToSend, config);
      await cargarCasos();
    } catch (err) {
      console.error('Error al editar caso de riesgo:', err);
    }
  };

  return (
    <CasosRiesgoContext.Provider value={{ casos, agregarCaso, editarCaso, cargarCasos }}>
      {children}
    </CasosRiesgoContext.Provider>
  );
};