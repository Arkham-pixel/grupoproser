import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Conectar a la base de datos principal
const mainDB = mongoose.createConnection(process.env.MONGO_URI);
const secondaryDB = mongoose.createConnection(process.env.SECONDARY_DB_URI);

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

const UsuarioMain = mainDB.model("Usuario", UsuarioSchema);
const UsuarioSecondary = secondaryDB.model("Usuario", UsuarioSchema);

async function verificarUsuarios() {
  try {
    console.log('🔍 Verificando usuarios en ambas bases de datos...\n');
    
    // Verificar en base de datos principal
    console.log('📊 Base de datos PRINCIPAL:');
    const usuariosMain = await UsuarioMain.find({}, { password: 0, twoFACode: 0, twoFACodeExpires: 0 });
    console.log(`Total usuarios: ${usuariosMain.length}`);
    usuariosMain.forEach(user => {
      console.log(`- ${user.nombre} (${user.correo}) - Rol: ${user.rol}`);
    });
    
    console.log('\n📊 Base de datos SECUNDARIA:');
    const usuariosSecondary = await UsuarioSecondary.find({}, { password: 0, twoFACode: 0, twoFACodeExpires: 0 });
    console.log(`Total usuarios: ${usuariosSecondary.length}`);
    usuariosSecondary.forEach(user => {
      console.log(`- ${user.nombre} (${user.correo}) - Rol: ${user.rol}`);
    });
    
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mainDB.close();
    await secondaryDB.close();
    process.exit(0);
  }
}

verificarUsuarios(); 