import express from 'express';
import { crearRiesgo, obtenerRiesgos, obtenerRiesgoPorId, actualizarRiesgo, eliminarRiesgo, buscarRiesgos } from '../controllers/riesgoController.js';

const router = express.Router();

router.post('/', crearRiesgo);
router.get('/', obtenerRiesgos);
router.get('/buscar', buscarRiesgos);
router.get('/:id', obtenerRiesgoPorId);
router.put('/:id', actualizarRiesgo);
router.delete('/:id', eliminarRiesgo);

export default router; 