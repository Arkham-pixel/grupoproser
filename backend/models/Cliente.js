//backend/backend/backend/models/Cliente.js
import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  correo: String,
  cod1Asgrdra: String,  // Corregido: era codiAsgrdra
  rzonSocial: String,
  teleF1jo: String,     // Corregido: era teleFijo
  telecellar: String,   // Corregido: era teleCellar
  direCliente: String,
  cod1Pais: String,     // Corregido: era codiPais
  cod1Depto: String,    // Corregido: era codiDepto
  cod1Mp10: String,     // Corregido: era codiMpio
  cod1Cpoblado: String, // Corregido: era codiPoblado
  cod1Estdo: Number,    // Corregido: era codiEstdo
  descIva: Number,
  reteIva: Number,
  reteFuente: Number,
  reteIca: Number,
}, { collection: 'gsk3cAppcliente' });

export default mongoose.model('Cliente', ClienteSchema);
