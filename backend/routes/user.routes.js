// routes/user.routes.js
import express from "express";
import { verificarToken } from "../middleware/verificarToken.js";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// ─── 1. Asegúrate de que exista la carpeta uploads/ ─────────────
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── 2. Configura multer para guardar en disco ───────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Usar un timestamp único si no hay usuario.id disponible
    const userId = req.usuario?.id || 'unknown';
    cb(null, `${userId}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ─── 3. Ruta PROTEGIDA: crear usuario (con foto opcional) ────────
router.post(
  "/crear",
  verificarToken,
  upload.single("foto"),
  async (req, res) => {
    const rolSolicitante = req.usuario.rol;
    if (rolSolicitante !== "admin" && rolSolicitante !== "soporte") {
      return res
        .status(403)
        .json({ message: "Acceso denegado: solo admin o soporte puede crear cuentas" });
    }

    const { nombre, correo, password, rol } = req.body;
    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    try {
      const usuarioExistente = await Usuario.findOne({ correo });
      if (usuarioExistente) {
        return res.status(409).json({ message: "El correo ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevoUsuario = new Usuario({
        nombre,
        correo,
        password: hashedPassword,
        rol
      });

      if (req.file) {
        nuevoUsuario.foto = `/uploads/${req.file.filename}`;
      }

      await nuevoUsuario.save();
      return res
        .status(201)
        .json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// ─── 4. Nueva ruta PROTEGIDA: obtener perfil del usuario logueado ─
router.get(
  "/perfil",
  verificarToken,
  async (req, res) => {
    try {
      // req.usuario.id lo proporciona tu middleware verificarToken
      const usuario = await Usuario.findById(req.usuario.id).select("-password");
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.json(usuario);
    } catch (error) {
      console.error("Error al leer perfil:", error);
      return res.status(500).json({ message: "Error interno al obtener perfil" });
    }
  }
);

router.put(
  "/perfil",
  verificarToken,
  upload.single("foto"),         
  async (req, res) => {
    console.log('📸 Iniciando actualización de foto...');
    console.log('👤 Usuario autenticado:', req.usuario);
    console.log('📁 Archivo recibido:', req.file);
    
    try {
      const usuario = await Usuario.findById(req.usuario.id);
      if (!usuario) {
        console.log('❌ Usuario no encontrado en BD');
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      console.log('✅ Usuario encontrado:', usuario.name);

      if (req.file) {
        console.log('📸 Procesando archivo:', req.file.filename);
        // Sobrescribimos el campo foto con la URL relativa
        usuario.foto = `/uploads/${req.file.filename}`;
        console.log('🔗 Nueva URL de foto:', usuario.foto);
      }

      await usuario.save();
      console.log('✅ Foto guardada exitosamente en BD');
      
      // devolvemos la URL actualizada
      return res.json({ fotoPerfil: usuario.foto });
    } catch (error) {
      console.error('❌ Error actualizando foto:', error);
      return res.status(500).json({ message: "Error interno al actualizar foto" });
    }
  }
);


export default router;
