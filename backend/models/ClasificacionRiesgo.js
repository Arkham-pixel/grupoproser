import mongoose from 'mongoose';
import secondaryConnection from '../db/secondaryConnection.js';

const ClasificacionRiesgoSchema = new mongoose.Schema({
  codIdentificador: Number,
  rzonDescripcion: String
}, { collection: 'gsk3cClasriesgopoliza' });

const ClasificacionRiesgo = secondaryConnection.model('ClasificacionRiesgo', ClasificacionRiesgoSchema);
export default ClasificacionRiesgo; 