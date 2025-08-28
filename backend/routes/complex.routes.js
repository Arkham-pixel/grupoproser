import express from 'express';
import {
  crearComplex,
  obtenerTodos,
  obtenerPorId,
  actualizarComplex,
  eliminarComplex,
  obtenerIntermediarios,
} from '../controllers/complex.controller.js';
import { enviarEmailPrueba } from '../services/emailService.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configuración de multer para guardar en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Ruta para subir archivos
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  // Devuelve la URL relativa para guardar en historialDocs
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.originalname });
});

// Rutas para intermediarios (debe ir antes de las rutas con parámetros)
router.get('/intermediarios', obtenerIntermediarios);

// 📧 Ruta para probar emails de casos complex
router.post('/test-email', async (req, res) => {
  try {
    const { emailDestino } = req.body;
    const resultado = await enviarEmailPrueba(emailDestino);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Error en test-email complex:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.post('/', crearComplex);
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizarComplex);
router.delete('/:id', eliminarComplex);

export default router;
