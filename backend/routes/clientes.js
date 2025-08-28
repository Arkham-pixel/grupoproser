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
    console.log('📋 Campos del primer cliente:', Object.keys(clientes[0] || {}));
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

router.get('/test-db', async (req, res) => {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    console.log('📊 Conexión activa:', mongoose.connection.readyState === 1 ? 'SÍ' : 'NO');
    console.log('📊 Nombre de la base de datos:', mongoose.connection.name);
    console.log('📊 Host:', mongoose.connection.host);
    console.log('📊 Puerto:', mongoose.connection.port);
    
    // Listar todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Colecciones disponibles:', collections.map(c => c.name));
    
    res.json({
      connected: mongoose.connection.readyState === 1,
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('❌ Error al probar la base de datos:', error);
    res.status(500).json({ error: 'Error al probar la base de datos', details: error.message });
  }
});

router.get('/raw', async (req, res) => {
  try {
    console.log('🔍 Intentando obtener clientes raw...');
    const docs = await mongoose.connection.db.collection('gsk3cAppcliente').find({}).toArray();
    console.log('✅ Clientes raw encontrados:', docs.length);
    console.log('📋 Primer cliente raw:', docs[0]);
    console.log('📋 Campos del primer cliente raw:', Object.keys(docs[0] || {}));
    res.json(docs);
  } catch (error) {
    console.error('❌ Error al obtener clientes raw:', error);
    res.status(500).json({ error: 'Error al obtener clientes raw', details: error.message });
  }
});

console.log('Base de datos activa:', Cliente.db.name);

export default router;
