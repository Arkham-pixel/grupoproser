import express from 'express';
import { crearRiesgo, obtenerRiesgos, obtenerRiesgoPorId, actualizarRiesgo, eliminarRiesgo, buscarRiesgos } from '../controllers/riesgoController.js';
import { enviarEmailPrueba } from '../services/emailService.js';

const router = express.Router();

router.post('/', crearRiesgo);
router.get('/', obtenerRiesgos);
router.get('/buscar', buscarRiesgos);
router.get('/:id', obtenerRiesgoPorId);
router.put('/:id', actualizarRiesgo);
router.delete('/:id', eliminarRiesgo);

// Ruta de prueba para email
router.post('/test-email', async (req, res) => {
  try {
    const { emailDestino } = req.body;
    const resultado = await enviarEmailPrueba(emailDestino);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error enviando email de prueba",
      error: error.message 
    });
  }
});

export default router; 