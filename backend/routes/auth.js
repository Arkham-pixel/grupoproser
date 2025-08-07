// routes/auth.routes.js
import express from "express";
import nodemailer from 'nodemailer';
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Ruta temporal para listar usuarios (solo para desarrollo)
router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, { password: 0, twoFACode: 0, twoFACodeExpires: 0 });
    res.json({
      total: usuarios.length,
      usuarios: usuarios
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// 🔐 Ruta temporal para cambiar contraseña (solo para administradores)
router.post("/cambiar-password", async (req, res) => {
  try {
    const { correo, nuevaPassword, adminPassword } = req.body;
    
    // Verificar contraseña de administrador (puedes cambiar esto)
    if (adminPassword !== "admin123") {
      return res.status(401).json({ message: "Contraseña de administrador incorrecta" });
    }
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaPassword, saltRounds);
    
    // Actualizar contraseña
    usuario.password = hashedPassword;
    await usuario.save();
    
    res.json({ 
      success: true, 
      message: `Contraseña actualizada para ${usuario.nombre}` 
    });
    
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🚪 Login con 2FA
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    // Generar código 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    usuario.twoFACode = code;
    usuario.twoFACodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    await usuario.save();
    // Enviar código por correo
    // (Ajusta el transporter según tu configuración real)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: usuario.correo,
      subject: 'Código de verificación 2FA',
      text: `Tu código de verificación es: ${code}`
    });
    return res.json({ twoFARequired: true, correo: usuario.correo });
  } catch (error) {
    console.error("Error en login 2FA:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Validar código 2FA y devolver token
router.post("/login/2fa", async (req, res) => {
  const { correo, code } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario || !usuario.twoFACode || !usuario.twoFACodeExpires) {
      return res.status(400).json({ message: "Código no solicitado o usuario inválido" });
    }
    if (usuario.twoFACode !== code) {
      return res.status(401).json({ message: "Código incorrecto" });
    }
    if (usuario.twoFACodeExpires < new Date()) {
      return res.status(401).json({ message: "Código expirado" });
    }
    // Limpiar el código después de usarlo
    usuario.twoFACode = undefined;
    usuario.twoFACodeExpires = undefined;
    await usuario.save();
    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto_super_seguro",
      { expiresIn: "4h" }
    );
    res.json({ token, usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    }});
  } catch (error) {
    console.error("Error en login 2FA (verificación):", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 📝 Registro
router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password: hashedPassword,
      rol: rol || "usuario"
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado correctamente" });

} catch (error) {
  console.error("Error en registro:", error); // ← ya está esto
  res.status(500).json({ message: "Error al registrar usuario", error: error.message }); // ← añade esto
}
});

export default router;
