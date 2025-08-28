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
    console.log('🔍 Intentando obtener estados de riesgo...');
    console.log('📊 Modelo EstadoRiesgo:', EstadoRiesgo);
    console.log('🔗 Conexión:', EstadoRiesgo.db.name);
    
    const estados = await EstadoRiesgo.find();
    console.log('✅ Estados de riesgo encontrados:', estados.length);
    console.log('📋 Primer estado:', estados[0]);
    res.json(estados);
  } catch (err) {
    console.error('❌ Error al obtener estados de riesgo:', err);
    res.status(500).json({ error: 'Error al obtener los estados de riesgo' });
  }
};

export const obtenerClasificacionesRiesgo = async (req, res) => {
  try {
    console.log('🔍 Intentando obtener clasificaciones de riesgo...');
    console.log('📊 Modelo ClasificacionRiesgo:', ClasificacionRiesgo);
    console.log('🔗 Conexión:', ClasificacionRiesgo.db.name);
    
    const clasificaciones = await ClasificacionRiesgo.find();
    console.log('✅ Clasificaciones encontradas:', clasificaciones.length);
    console.log('📋 Primera clasificación:', clasificaciones[0]);
    res.json(clasificaciones);
  } catch (err) {
    console.error('❌ Error al obtener clasificaciones de riesgo:', err);
    res.status(500).json({ error: 'Error al obtener las clasificaciones de riesgo' });
  }
}; 