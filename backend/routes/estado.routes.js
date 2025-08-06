import express from 'express';
import { obtenerEstados, obtenerEstadosRiesgo, obtenerClasificacionesRiesgo } from '../controllers/estadoController.js';

const router = express.Router();

// GET /api/estados
router.get('/', obtenerEstados);
router.get('/estados-riesgos', obtenerEstadosRiesgo);
router.get('/clasificaciones-riesgo', obtenerClasificacionesRiesgo);

export default router; 