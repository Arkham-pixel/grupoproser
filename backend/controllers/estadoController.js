import Estado from '../models/Estado.js';
import EstadoRiesgo from '../models/EstadoRiesgo.js';
import ClasificacionRiesgo from '../models/ClasificacionRiesgo.js';

export const obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.find();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados', detalle: error.message });
  }
};

export const obtenerEstadosRiesgo = async (req, res) => {
  try {
    const estados = await EstadoRiesgo.find();
    res.json(estados);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los estados de riesgo' });
  }
};

export const obtenerClasificacionesRiesgo = async (req, res) => {
  try {
    const clasificaciones = await ClasificacionRiesgo.find();
    res.json(clasificaciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las clasificaciones de riesgo' });
  }
}; 