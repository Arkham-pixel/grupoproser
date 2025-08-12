import 'dotenv/config'
import mongoose from "mongoose";
import app from "./app.js";
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "frontend", "build")));



// Verificar que las variables se cargaron
console.log('🔧 Variables de entorno cargadas:');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NO DEFINIDO');
console.log('🌐 MONGO_URI:', process.env.MONGO_URI ? 'DEFINIDO' : 'NO DEFINIDO');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

// Configuración mejorada de MongoDB (opciones actualizadas)
const mongoOptions = {
  serverSelectionTimeoutMS: 10000, // 10 segundos
  socketTimeoutMS: 45000, // 45 segundos
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: "majority"
};

// Iniciar el servidor independientemente del estado de MongoDB
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("⚠️ El servidor iniciará aunque MongoDB no esté disponible");
});

// Intentar conectar a MongoDB en segundo plano
mongoose
  .connect(MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    console.log("Usando MONGO_URI:", MONGO_URI);
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    console.log("⚠️ El servidor seguirá funcionando sin base de datos");
    console.log("🔄 Intentando reconectar en 30 segundos...");
    
    // Intentar reconectar cada 30 segundos
    const reconnectInterval = setInterval(() => {
      mongoose.connect(MONGO_URI, mongoOptions)
        .then(() => {
          console.log("✅ Reconexión exitosa a MongoDB");
          clearInterval(reconnectInterval);
        })
        .catch(() => {
          console.log("🔄 Reintentando conexión a MongoDB...");
        });
    }, 30000);
  });

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Desconectado de MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ Reconectado a MongoDB');
});
