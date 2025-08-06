import Responsable from '../models/Responsable.js';

export const obtenerResponsables = async (req, res) => {
  try {
    const responsables = await Responsable.find();
    res.json(responsables);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener responsables', detalle: error.message });
  }
}; 