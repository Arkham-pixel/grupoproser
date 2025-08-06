import express from 'express';
import Tarea from '../models/Tarea.js';
// import { verificarToken } from '../middleware/auth.js'; // Descomenta si tienes auth

const router = express.Router();

// Listar tareas por login
router.get('/', /*verificarToken,*/ async (req, res) => {
  const { login } = req.query;
  if (!login) return res.status(400).json({ mensaje: 'Falta login' });
  const tareas = await Tarea.find({ login });
  res.json(tareas);
});

// Crear tarea
router.post('/', /*verificarToken,*/ async (req, res) => {
  const { login, texto, fecha } = req.body;
  if (!login || !texto || !fecha) return res.status(400).json({ mensaje: 'Faltan campos' });
  const tarea = new Tarea({ login, texto, fecha });
  await tarea.save();
  res.status(201).json(tarea);
});

// Editar tarea
router.put('/:id', /*verificarToken,*/ async (req, res) => {
  const { texto, fecha } = req.body;
  const tarea = await Tarea.findByIdAndUpdate(req.params.id, { texto, fecha }, { new: true });
  if (!tarea) return res.status(404).json({ mensaje: 'No encontrada' });
  res.json(tarea);
});

// Marcar cumplida/no cumplida
router.patch('/:id/cumplida', /*verificarToken,*/ async (req, res) => {
  const tarea = await Tarea.findById(req.params.id);
  if (!tarea) return res.status(404).json({ mensaje: 'No encontrada' });
  tarea.cumplida = !tarea.cumplida;
  await tarea.save();
  res.json(tarea);
});

// Eliminar tarea
router.delete('/:id', /*verificarToken,*/ async (req, res) => {
  const tarea = await Tarea.findByIdAndDelete(req.params.id);
  if (!tarea) return res.status(404).json({ mensaje: 'No encontrada' });
  res.json({ mensaje: 'Eliminada' });
});

export default router; 