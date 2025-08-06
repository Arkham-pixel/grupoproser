import express from 'express';
import { obtenerCiudades } from '../controllers/ciudadController.js';
const router = express.Router();

router.get('/ciudades', obtenerCiudades);

export default router;
