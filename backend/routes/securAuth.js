// routes/securAuth.js
import express from "express";
import SecurUser from "../models/SecurUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Ruta para listar usuarios secur (solo para desarrollo)
router.get("/usuarios", async (req, res) => {
  try {
    console.log('🔍 Buscando usuarios en la base de datos...');
    const usuarios = await SecurUser.find({}, { pswd: 0, mfa: 0, activationCode: 0 });
    console.log('✅ Usuarios encontrados:', usuarios.length);
    res.json({
      total: usuarios.length,
      usuarios: usuarios
    });
  } catch (error) {
    console.error("❌ Error al listar usuarios secur:", error);
    console.error("📋 Stack trace:", error.stack);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Ruta de prueba para verificar conexión a la base de datos
router.get("/test-db", async (req, res) => {
  try {
    console.log('🧪 Probando conexión a la base de datos...');
    
    // Verificar si el modelo está conectado
    const dbState = SecurUser.db.db.admin().listDatabases();
    console.log('✅ Conexión a MongoDB verificada');
    
    // Contar usuarios
    const count = await SecurUser.countDocuments();
    console.log('📊 Total de usuarios en la base de datos:', count);
    
    res.json({
      success: true,
      message: "Conexión a la base de datos exitosa",
      userCount: count,
      dbState: "connected"
    });
  } catch (error) {
    console.error("❌ Error en prueba de base de datos:", error);
    console.error("📋 Stack trace:", error.stack);
    res.status(500).json({ 
      success: false,
      message: "Error en la conexión a la base de datos",
      error: error.message
    });
  }
});

// 🔐 Ruta para cambiar contraseña de usuarios (solo para admin/soporte)
router.post("/cambiar-password", async (req, res) => {
  try {
    console.log('🔐 Iniciando cambio de contraseña...');
    console.log('📝 Datos recibidos:', { 
      login: req.body.login, 
      adminLogin: req.body.adminLogin,
      nuevaPassword: req.body.nuevaPassword ? '***' : 'NO DEFINIDA'
    });
    
    const { login, nuevaPassword, adminLogin, adminPassword } = req.body;
    
    // Validar datos requeridos
    if (!login || !nuevaPassword || !adminLogin || !adminPassword) {
      console.log('❌ Datos faltantes:', { login: !!login, nuevaPassword: !!nuevaPassword, adminLogin: !!adminLogin, adminPassword: !!adminPassword });
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    
    console.log('🔍 Buscando administrador:', adminLogin);
    // Verificar que el administrador existe y tiene permisos
    const admin = await SecurUser.findOne({ login: adminLogin });
    if (!admin) {
      console.log('❌ Administrador no encontrado:', adminLogin);
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    
    console.log('✅ Administrador encontrado:', { name: admin.name, role: admin.role, active: admin.active });
    
    // Verificar que el administrador está activo
    if (admin.active !== "Y") {
      console.log('❌ Administrador inactivo:', adminLogin);
      return res.status(401).json({ message: "Administrador inactivo" });
    }
    
    console.log('🔐 Verificando contraseña del administrador...');
    // Verificar contraseña del administrador
    const isAdminPasswordValid = await bcrypt.compare(adminPassword, admin.pswd);
    if (!isAdminPasswordValid) {
      console.log('❌ Contraseña de administrador incorrecta');
      return res.status(401).json({ message: "Contraseña de administrador incorrecta" });
    }
    
    console.log('✅ Contraseña de administrador válida');
    
    // Verificar que el administrador tiene permisos (admin o soporte)
    if (!["admin", "soporte"].includes(admin.role)) {
      console.log('❌ Administrador sin permisos:', admin.role);
      return res.status(403).json({ message: "No tienes permisos para cambiar contraseñas" });
    }
    
    console.log('🔍 Buscando usuario a cambiar:', login);
    // Buscar el usuario a cambiar
    const usuario = await SecurUser.findOne({ login });
    if (!usuario) {
      console.log('❌ Usuario no encontrado:', login);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    console.log('✅ Usuario encontrado:', { name: usuario.name, role: usuario.role });
    
    console.log('🔐 Encriptando nueva contraseña...');
    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaPassword, saltRounds);
    
    console.log('💾 Actualizando contraseña en la base de datos...');
    // Actualizar solo la contraseña y la fecha de actualización
    // NO tocar otros campos para evitar problemas de validación
    usuario.pswd = hashedPassword;
    usuario.pswdLastUpdated = new Date().toISOString();
    
    // Si el usuario no tiene role, asignar uno por defecto
    if (!usuario.role || usuario.role === '') {
      console.log('⚠️ Usuario sin role, asignando "usuario" por defecto');
      usuario.role = 'usuario';
    }
    
    await usuario.save();
    
    console.log('✅ Contraseña actualizada exitosamente');
    
    res.json({ 
      success: true, 
      message: `Contraseña actualizada para ${usuario.name}`,
      usuario: {
        login: usuario.login,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
      }
    });
    
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    console.error("📋 Stack trace:", error.stack);
    res.status(500).json({ 
      message: "Error en el servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login para usuarios secur con 2FA
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  try {
    console.log('🔐 Intentando login para:', correo);
    
    // Buscar por login (que es el correo en este caso)
    const usuario = await SecurUser.findOne({ login: correo });
    if (!usuario) {
      console.log('❌ Usuario no encontrado:', correo);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Verificar si el usuario está activo
    if (usuario.active !== "Y") {
      console.log('❌ Usuario inactivo:', correo);
      return res.status(401).json({ message: "Usuario inactivo" });
    }
    
    // Comparar contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.pswd);
    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta para:', correo);
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    
    console.log('✅ Credenciales válidas para:', correo);
    
    // ========== 2FA TEMPORALMENTE SUSPENDIDO ==========
    // TODO: Reactivar cuando se resuelva el problema del email
    /*
    // Generar código 2FA
    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFACodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    
    // Guardar código en el usuario
    usuario.mfa = twoFACode;
    usuario.mfaLastUpdated = new Date().toISOString();
    await usuario.save();
    
    console.log('📧 Código 2FA generado:', twoFACode, 'para:', correo);
    
         // Enviar código por correo
     try {
       console.log('📧 Configurando nodemailer...');
       console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
       console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NO DEFINIDO');
       
       const nodemailer = await import('nodemailer');
       
               // Configuración más robusta para Gmail
        const transporter = nodemailer.default.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          debug: true, // Habilitar debug
          logger: true // Habilitar logs
        });
       
       console.log('📧 Transporter configurado, verificando conexión...');
       
       // Verificar conexión
       await transporter.verify();
       console.log('✅ Conexión SMTP verificada');
       
       const mailOptions = {
         from: `"Grupo Proser" <${process.env.EMAIL_USER}>`,
         to: usuario.email,
         subject: '🔐 Código de verificación 2FA - Grupo Proser',
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h2 style="color: #2563eb;">🔐 Verificación de Seguridad</h2>
             <p>Hola <strong>${usuario.name}</strong>,</p>
             <p>Se ha solicitado un código de verificación para acceder a la aplicación de Grupo Proser.</p>
             <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
               <h3 style="color: #059669; font-size: 24px; margin: 0;">${twoFACode}</h3>
               <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">Código de verificación</p>
             </div>
             <p><strong>⚠️ Importante:</strong></p>
             <ul>
               <li>Este código expira en 10 minutos</li>
               <li>No compartas este código con nadie</li>
               <li>Si no solicitaste este código, ignora este mensaje</li>
             </ul>
             <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
               Este es un mensaje automático, no respondas a este correo.
             </p>
           </div>
         `
       };
       
       console.log('📧 Enviando email a:', usuario.email);
       const info = await transporter.sendMail(mailOptions);
       console.log('✅ Email enviado exitosamente');
       console.log('📧 Message ID:', info.messageId);
       console.log('📧 Response:', info.response);
      
      // Devolver respuesta indicando que se requiere 2FA
      res.json({ 
        twoFARequired: true, 
        email: usuario.email,
        message: "Código de verificación enviado al correo corporativo"
      });
      
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
      // Si falla el email, aún así devolver que se requiere 2FA
      res.json({ 
        twoFARequired: true, 
        email: usuario.email,
        message: "Código de verificación enviado al correo corporativo"
      });
    }
    */
    // ========== FIN DE 2FA SUSPENDIDO ==========
    
    // LOGIN DIRECTO (TEMPORAL) - Sin 2FA
    console.log('⚠️ 2FA temporalmente suspendido - iniciando sesión directa');
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, login: usuario.login, role: usuario.role },
      process.env.JWT_SECRET || "secreto_super_seguro",
      { expiresIn: "4h" }
    );
    
    res.json({
      token,
      usuario: {
        id: usuario._id,
        login: usuario.login,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
      },
      message: "Inicio de sesión exitoso (2FA suspendido temporalmente)"
    });
    
  } catch (error) {
    console.error("❌ Error en login secur:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Verificar código 2FA y completar login
router.post("/login/2fa", async (req, res) => {
  const { correo, code } = req.body;
  try {
    console.log('🔐 Verificando código 2FA para:', correo);
    
    // Buscar usuario
    const usuario = await SecurUser.findOne({ login: correo });
    if (!usuario) {
      console.log('❌ Usuario no encontrado para verificación 2FA:', correo);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Verificar si hay código MFA
    if (!usuario.mfa) {
      console.log('❌ No hay código MFA para:', correo);
      return res.status(400).json({ message: "Código no solicitado o expirado" });
    }
    
    // Verificar si el código coincide
    if (usuario.mfa !== code) {
      console.log('❌ Código incorrecto para:', correo, 'Esperado:', usuario.mfa, 'Recibido:', code);
      return res.status(401).json({ message: "Código incorrecto" });
    }
    
    // Verificar si el código no ha expirado (10 minutos)
    const mfaTime = new Date(usuario.mfaLastUpdated);
    const now = new Date();
    const diffMinutes = (now - mfaTime) / (1000 * 60);
    
    if (diffMinutes > 10) {
      console.log('❌ Código expirado para:', correo, 'Minutos transcurridos:', diffMinutes);
      // Limpiar código expirado
      usuario.mfa = null;
      usuario.mfaLastUpdated = null;
      await usuario.save();
      return res.status(401).json({ message: "Código expirado" });
    }
    
    console.log('✅ Código 2FA válido para:', correo);
    
    // Limpiar código después de usarlo
    usuario.mfa = null;
    usuario.mfaLastUpdated = null;
    await usuario.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, login: usuario.login, role: usuario.role },
      process.env.JWT_SECRET || "secreto_super_seguro",
      { expiresIn: "4h" }
    );
    
    console.log('✅ Login 2FA exitoso para:', correo);
    
    res.json({ 
      token, 
      usuario: {
        id: usuario._id,
        login: usuario.login,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
      },
      message: "Login exitoso"
    });
    
  } catch (error) {
    console.error("❌ Error en verificación 2FA:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Cambiar contraseña
router.post("/cambiar-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuario = await SecurUser.findById(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Verificar contraseña antigua usando bcrypt
    const isOldPasswordValid = await bcrypt.compare(oldPassword, usuario.pswd);
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }
    
    // Actualizar contraseña con hash
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    usuario.pswd = hashedNewPassword;
    await usuario.save();
    
    res.json({ 
      message: "Contraseña cambiada correctamente", 
      user: { login: usuario.login } 
    });
    
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener perfil de usuario
router.get("/perfil", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuario = await SecurUser.findById(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    console.log('📊 Datos completos del usuario desde BD:', {
      id: usuario._id,
      login: usuario.login,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      phone: usuario.phone,
      active: usuario.active,
      privAdmin: usuario.privAdmin,
      pswdLastUpdated: usuario.pswdLastUpdated,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
    
    res.json({
      id: usuario._id,
      login: usuario.login,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      phone: usuario.phone,
      active: usuario.active,
      privAdmin: usuario.privAdmin,
      pswdLastUpdated: usuario.pswdLastUpdated,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
    
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar perfil
router.put("/perfil", async (req, res) => {
  const { name, email, phone, role } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuario = await SecurUser.findById(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Actualizar campos
    if (name) usuario.name = name;
    if (email) usuario.email = email;
    if (phone) usuario.phone = phone;
    if (role) usuario.role = role;
    
    await usuario.save();
    
    res.json({ 
      message: "Perfil actualizado correctamente",
      user: {
        id: usuario._id,
        login: usuario.login,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        phone: usuario.phone
      }
    });
    
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Eliminar usuario
router.delete("/usuarios", async (req, res) => {
  const { loginOrEmail } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuarioActual = await SecurUser.findById(decoded.id);
    
    if (!usuarioActual) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Solo admin puede eliminar usuarios
    if (usuarioActual.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para eliminar usuarios" });
    }
    
    if (!loginOrEmail) {
      return res.status(400).json({ message: "Login o email requerido" });
    }
    
    // Buscar usuario por login o email
    const usuarioAEliminar = await SecurUser.findOne({
      $or: [
        { login: loginOrEmail },
        { email: loginOrEmail }
      ]
    });
    
    if (!usuarioAEliminar) {
      return res.status(404).json({ message: "Usuario a eliminar no encontrado" });
    }
    
    // No permitir eliminar al propio usuario
    if (usuarioAEliminar._id.toString() === usuarioActual._id.toString()) {
      return res.status(400).json({ message: "No puedes eliminar tu propia cuenta" });
    }
    
    await SecurUser.findByIdAndDelete(usuarioAEliminar._id);
    
    res.json({ 
      message: "Usuario eliminado correctamente",
      usuarioEliminado: {
        login: usuarioAEliminar.login,
        email: usuarioAEliminar.email
      }
    });
    
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Crear nuevo usuario secur (solo admin puede hacerlo)
router.post("/register", async (req, res) => {
  const { nombre, correo, password, rol, celular, cedula, fechaNacimiento } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuarioActual = await SecurUser.findById(decoded.id);
    
    if (!usuarioActual) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Solo admin puede crear usuarios
    if (usuarioActual.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para crear usuarios" });
    }
    
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios" });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await SecurUser.findOne({ 
      $or: [{ email: correo }, { login: correo }] 
    });
    
    if (usuarioExistente) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }
    
    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new SecurUser({
      name: nombre,
      email: correo,
      login: correo, // Usar el correo como login
      pswd: hashedPassword,
      role: rol || "usuario",
      phone: celular || "",
      cedula: cedula || "",
      fechaNacimiento: fechaNacimiento || "",
      active: "Y"
    });
    
    await nuevoUsuario.save();
    
    res.status(201).json({ 
      message: "Usuario creado correctamente",
      usuario: {
        id: nuevoUsuario._id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role
      }
    });
    
  } catch (error) {
    console.error("Error creando usuario secur:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta de prueba para email (solo para desarrollo)
router.post("/test-email", async (req, res) => {
  try {
    console.log('🧪 Iniciando prueba de email...');
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NO DEFINIDO');
    
    const nodemailer = await import('nodemailer');
    
    // Configuración de prueba
    const transporter = nodemailer.default.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: true
    });
    
    console.log('📧 Transporter configurado, verificando conexión...');
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');
    
    const mailOptions = {
      from: `"Grupo Proser" <${process.env.EMAIL_USER}>`,
      to: 'danalyst@proserpuertos.com.co', // Email de prueba
      subject: '🧪 Prueba de Email - Grupo Proser',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🧪 Prueba de Email</h2>
          <p>Este es un email de prueba para verificar que el sistema de envío funciona correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            Este es un mensaje de prueba automático.
          </p>
        </div>
      `
    };
    
    console.log('📧 Enviando email de prueba...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de prueba enviado exitosamente');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
    res.json({ 
      success: true, 
      message: "Email de prueba enviado correctamente",
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error enviando email de prueba",
      error: error.message 
    });
  }
});

// Ruta para obtener usuario por ID (solo admin/soporte)
router.get("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario que hace la petición sea admin o soporte
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuarioActual = await SecurUser.findOne({ login: decoded.login });
    
    if (!usuarioActual || (usuarioActual.role !== 'admin' && usuarioActual.role !== 'soporte')) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }

    // Buscar el usuario por ID
    const usuario = await SecurUser.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // No enviar la contraseña en la respuesta
    const usuarioSinPassword = {
      _id: usuario._id,
      login: usuario.login,
      name: usuario.name,
      email: usuario.email,
      active: usuario.active,
      role: usuario.role,
      phone: usuario.phone,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    };

    res.json(usuarioSinPassword);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para actualizar usuario por ID (solo admin/soporte)
router.put("/actualizar-usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, active } = req.body;
    
    // Verificar que el usuario que hace la petición sea admin o soporte
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
    const usuarioActual = await SecurUser.findOne({ login: decoded.login });
    
    if (!usuarioActual || (usuarioActual.role !== 'admin' && usuarioActual.role !== 'soporte')) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }

    // Buscar el usuario por ID
    const usuario = await SecurUser.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar campos permitidos
    if (name !== undefined) usuario.name = name;
    if (email !== undefined) usuario.email = email;
    if (phone !== undefined) usuario.phone = phone;
    if (role !== undefined) usuario.role = role;
    if (active !== undefined) usuario.active = active;

    await usuario.save();

    console.log('✅ Usuario actualizado exitosamente:', {
      id: usuario._id,
      name: usuario.name,
      role: usuario.role,
      active: usuario.active
    });

    res.json({
      success: true,
      message: `Usuario ${usuario.name} actualizado exitosamente`,
      usuario: {
        _id: usuario._id,
        login: usuario.login,
        name: usuario.name,
        email: usuario.email,
        active: usuario.active,
        role: usuario.role,
        phone: usuario.phone
      }
    });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router; 