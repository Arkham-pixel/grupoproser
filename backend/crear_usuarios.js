import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Variables de entorno directamente
const MONGO_URI = 'mongodb+srv://webmaster:pOsxJIyGI07HpW8c@cluster0.p85rti4.mongodb.net/GrupoProser?retryWrites=true&w=majority';

// Conectar a la base de datos principal
const mainDB = mongoose.createConnection(MONGO_URI);

// Modelo de Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["admin","soporte","usuario"], default: "usuario" },
  celular: { type: String, trim: true },
  cedula: { type: String, trim: true },
  fechaNacimiento: { type: Date },
  foto: { type: String },
  twoFACode: { type: String },
  twoFACodeExpires: { type: Date }
}, {
  timestamps: true
});

const Usuario = mainDB.model("Usuario", UsuarioSchema);

async function crearUsuarios() {
  try {
    console.log('🔧 Creando usuarios de prueba...\n');
    
    // Lista de usuarios a crear
    const usuarios = [
      {
        nombre: "Administrador",
        correo: "admin@proser.com",
        password: "admin123",
        rol: "admin"
      },
      {
        nombre: "Soporte Técnico",
        correo: "soporte@proser.com",
        password: "soporte123",
        rol: "soporte"
      },
      {
        nombre: "Usuario Prueba",
        correo: "usuario@proser.com",
        password: "usuario123",
        rol: "usuario"
      }
    ];
    
    for (const userData of usuarios) {
      // Verificar si el usuario ya existe
      const existe = await Usuario.findOne({ correo: userData.correo });
      if (existe) {
        console.log(`⚠️ Usuario ${userData.correo} ya existe`);
        continue;
      }
      
      // Encriptar contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Crear usuario
      const nuevoUsuario = new Usuario({
        ...userData,
        password: hashedPassword
      });
      
      await nuevoUsuario.save();
      console.log(`✅ Usuario creado: ${userData.nombre} (${userData.correo})`);
    }
    
    console.log('\n📊 Usuarios en la base de datos:');
    const todosUsuarios = await Usuario.find({}, { password: 0, twoFACode: 0, twoFACodeExpires: 0 });
    todosUsuarios.forEach(user => {
      console.log(`- ${user.nombre} (${user.correo}) - Rol: ${user.rol}`);
    });
    
    console.log('\n✅ Proceso completado');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mainDB.close();
    process.exit(0);
  }
}

crearUsuarios(); 