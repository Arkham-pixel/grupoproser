import mongoose from 'mongoose';

const TareaSchema = new mongoose.Schema({
  login: { type: String, required: true },
  texto: { type: String, required: true },
  fecha: { type: Date, required: true },
  cumplida: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Tarea', TareaSchema); 