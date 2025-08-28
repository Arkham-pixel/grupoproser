import Responsable from '../models/Responsable.js';

export const obtenerResponsables = async (req, res) => {
  try {
    console.log('🔍 Intentando obtener responsables...');
    console.log('📊 Modelo Responsable:', Responsable);
    console.log('🔗 Conexión:', Responsable.db.name);
    
    const responsables = await Responsable.find();
    console.log('✅ Responsables encontrados:', responsables.length);
    console.log('📋 Primer responsable:', responsables[0]);
    res.json(responsables);
  } catch (error) {
    console.error('❌ Error al obtener responsables:', error);
    res.status(500).json({ error: 'Error al obtener responsables', detalle: error.message });
  }
}; 