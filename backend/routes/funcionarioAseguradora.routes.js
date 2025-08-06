import express from 'express';
import { obtenerFuncionarios } from '../controllers/funcionarioAseguradoraController.js';

const router = express.Router();

// GET /api/funcionarios-aseguradora?codiAsgrdra=123
router.get('/', obtenerFuncionarios);

export default router; 