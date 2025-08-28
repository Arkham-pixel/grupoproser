import mongoose from 'mongoose';

const CiudadSchema = new mongoose.Schema({
  codiMunicipio: String,    // Campo correcto según la base de datos
  descMunicipio: String,    // Campo correcto según la base de datos
  codiDepto: String,        // Campo correcto según la base de datos
  descDepto: String,
  codiPais: String,         // Campo correcto según la base de datos
  descPais: String,
  codiPoblado: String,      // Campo correcto según la base de datos
  descPoblado: String       // Campo correcto según la base de datos
}, { collection: 'gsk3cAppciudades' });

export default mongoose.model('Ciudad', CiudadSchema);
