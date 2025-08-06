import mongoose from 'mongoose';

const FuncionarioAseguradoraSchema = new mongoose.Schema({
  id: Number,
  codiAsgrdra: String,
  nmbrContcto: String,
  email: String,
  teleCellar: String
}, { collection: 'gsk3cAppcontactoscli' });

const FuncionarioAseguradora = mongoose.model('FuncionarioAseguradora', FuncionarioAseguradoraSchema);
export default FuncionarioAseguradora; 