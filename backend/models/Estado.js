import mongoose from 'mongoose';

const EstadoSchema = new mongoose.Schema({
  codiEstado: Number,
  descEstado: String
}, { collection: 'gsk3cAppestados' });

const Estado = mongoose.model('Estado', EstadoSchema);
export default Estado; 