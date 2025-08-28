import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from "./routes/auth.js";
import securAuthRoutes from "./routes/securAuth.js";
import userRoutes from "./routes/user.routes.js";
import securUserSecundarioRoutes from "./routes/securUserSecundario.routes.js";
import siniestroRoutes from "./routes/siniestroRoutes.js";
import ciudadRoutes from './routes/ciudadRoutes.js';
import clientesRoutes from './routes/clientes.js';
import funcionarioAseguradoraRoutes from './routes/funcionarioAseguradora.routes.js';
import responsableRoutes from './routes/responsable.routes.js';
import estadoRoutes from './routes/estado.routes.js';
import complexRoutes from './routes/complex.routes.js';
import tareasRoutes from './routes/tareas.routes.js';
import comunicadosRoutes from './routes/comunicados.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import casosRoutes from './routes/casos.js';
import riesgosRoutes from './routes/riesgos.routes.js';
import historialRoutes from './routes/historial.routes.js';

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware de logging simplificado
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// 2️ Asegúrate de que exista la carpeta uploads/
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta 'uploads/' creada... ✅");
}

// 3️ Sirve los archivos subidos de forma estática
// En desarrollo: /uploads desde localhost:3000
// En producción: /uploads desde el mismo dominio del frontend
app.use("/uploads", express.static(uploadsDir));

// Para producción: también servir archivos estáticos del frontend
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    console.log('📁 Frontend estático configurado para producción');
  }
}

// 4️ Monta aquí tus rutas
app.use("/api/auth", authRoutes);
app.use("/api/secur-auth", securAuthRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api", securUserSecundarioRoutes);
app.use("/api/siniestros", siniestroRoutes);
app.use('/api', ciudadRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/funcionarios-aseguradora', funcionarioAseguradoraRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/estados', estadoRoutes);
app.use('/api/complex', complexRoutes);
app.use('/api/casos', casosRoutes);
app.use('/api/riesgos', riesgosRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/comunicados', comunicadosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/historial-formularios', historialRoutes);

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NO DEFINIDO');
console.log('🔧 CORS configurado correctamente');

export default app; 