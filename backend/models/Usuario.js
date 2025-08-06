// models/Usuario.js
import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre:           { type: String, required: true, trim: true },
  correo:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true },
  rol:              { type: String, enum: ["admin","soporte","usuario"], default: "usuario" },
  celular:          { type: String, trim: true },
  cedula:           { type: String, trim: true },
  fechaNacimiento:  { type: Date },
  foto:             { type: String },
  twoFACode:        { type: String },
  twoFACodeExpires: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model("Usuario", UsuarioSchema);
