import express from 'express';
import { obtenerResponsables } from '../controllers/responsableController.js';

const router = express.Router();

// GET /api/responsables
router.get('/', obtenerResponsables);

export default router; 