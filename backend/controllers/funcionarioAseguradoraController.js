import FuncionarioAseguradora from '../models/FuncionarioAseguradora.js';

// Obtener todos los funcionarios o filtrar por codiAsgrdra
export const obtenerFuncionarios = async (req, res) => {
  try {
    const { codiAsgrdra } = req.query;
    let query = {};
    if (codiAsgrdra) {
      query.codiAsgrdra = codiAsgrdra;
    }
    const funcionarios = await FuncionarioAseguradora.find(query);
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener funcionarios', detalle: error.message });
  }
}; 