import express from 'express';
import historialController from '../controllers/historialController.js';
import { verificarToken } from '../middleware/verificarToken.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken); // AUTENTICACIÓN HABILITADA

// GET /api/historial-formularios - Obtener historial con filtros
router.get('/', historialController.obtenerHistorial);

// GET /api/historial-formularios/estadisticas - Obtener estadísticas
router.get('/estadisticas', historialController.obtenerEstadisticas);

// GET /api/historial-formularios/casos-organizados - Obtener casos organizados por carpeta
router.get('/casos-organizados', historialController.obtenerCasosOrganizados);

// GET /api/historial-formularios/caso/:casoId - Obtener formularios de un caso específico
router.get('/caso/:casoId', historialController.obtenerFormulariosPorCaso);

// GET /api/historial-formularios/carpeta/:casoId - Obtener formularios por carpeta
router.get('/carpeta/:casoId', historialController.obtenerFormulariosPorCarpeta);

// GET /api/historial-formularios/buscar - Buscar formularios por texto
router.get('/buscar', historialController.buscarFormularios);

// GET /api/historial-formularios/:id - Obtener formulario específico
router.get('/:id', historialController.obtenerFormulario);

// POST /api/historial-formularios - Crear nuevo formulario
router.post('/', historialController.crearFormulario);

// PUT /api/historial-formularios/:id - Actualizar formulario
router.put('/:id', historialController.actualizarFormulario);

// DELETE /api/historial-formularios/:id - Eliminar formulario (soft delete)
router.delete('/:id', historialController.eliminarFormulario);

// GET /api/historial-formularios/:id/descargar - Descargar archivo del formulario
router.get('/:id/descargar', historialController.descargarFormulario);

// POST /api/historial-formularios/:id/comentarios - Agregar comentario
router.post('/:id/comentarios', historialController.agregarComentario);

// POST /api/historial-formularios/:id/archivar - Archivar formulario
router.post('/:id/archivar', historialController.archivarFormulario);

export default router;
