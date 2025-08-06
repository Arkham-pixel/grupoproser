//backend/backend/backend/routes/clientes.js
import express from 'express';
import Cliente from '../models/Cliente.js';
import mongoose from 'mongoose';
const router = express.Router();

console.log('RUTA CLIENTES CARGADA');

// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Intentando obtener clientes...');
    console.log('📊 Modelo Cliente:', Cliente);
    console.log('🔗 Conexión:', Cliente.db.name);
    
    const clientes = await Cliente.find({});
    console.log('✅ Clientes encontrados:', clientes.length);
    console.log('📋 Primer cliente:', clientes[0]);
    res.json(clientes);
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err);
    console.error('📋 Detalles del error:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ error: 'Error al obtener clientes', details: err.message });
  }
});

router.get('/prueba', (req, res) => {
  res.send('Funciona clientes!');
});

router.get('/raw', async (req, res) => {
  const docs = await mongoose.connection.db.collection('gsk3cAppcliente').find({}).toArray();
  res.json(docs);
});

console.log('Base de datos activa:', Cliente.db.name);

export default router;
