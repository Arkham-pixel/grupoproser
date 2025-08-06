import mongoose from 'mongoose';

const CiudadSchema = new mongoose.Schema({
  cod1Mun1c1p1o: String,  // Corregido: era codiMunicipio
  descMun1c1p1o: String,   // Corregido: era descMunicipio
  cod1Depto: String,        // Corregido: era codiDepto
  descDepto: String,
  cod1Pais: String,         // Corregido: era codiPais
  descPais: String,
  cod1Cpoblado: String,     // Corregido: era codiCpolado
  descCpoblado: String      // Corregido: era descCpolado
}, { collection: 'gsk3cAppciudades' });

export default mongoose.model('Ciudad', CiudadSchema);
