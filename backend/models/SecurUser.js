// models/SecurUser.js
import mongoose from "mongoose";

const SecurUserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  pswd: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: String, default: "Y" },
  mfa: { type: String, default: null },
  picture: { type: mongoose.Schema.Types.Buffer },
  foto: { type: String }, // Campo para almacenar la URL de la foto de perfil
  role: { type: String, required: true },
  phone: { type: String },
  activationCode: { type: String },
  privAdmin: { type: String, default: "" },
  pswdLastUpdated: { type: String },
  mfaLastUpdated: { type: String, default: null }
}, {
  timestamps: true,
  collection: 'securUsers' // Especificar la colección exacta
});

export default mongoose.model("SecurUser", SecurUserSchema); 