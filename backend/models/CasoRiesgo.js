import mongoose from 'mongoose';

const riesgoSchema = new mongoose.Schema({
  nmroRiesgo: Number,
  codiIspector: String,
  codiAsgrdra: String,
  asgrBenfcro: String,
  nmroConsecutivo: String,
  fchaAsgncion: Date,
  observAsignacion: String,
  adjuntoAsignacion: String,
  fchaInspccion: Date,
  observInspeccion: String,
  adjuntoInspeccion: String,
  codiClasificacion: String,
  fchaInforme: Date,
  anxoInfoFnal: String,
  observInforme: String,
  codDireccion: String,
  funcSolicita: String,
  codigoPoblado: String,
  ciudadSucursal: String,
  codiEstdo: Number,
  vlorTarifaAseguradora: Number,
  vlorHonorarios: Number,
  vlorGastos: Number,
  nmroFactra: Number,
  fchaFactra: Date,
  totalPagado: Number,
  anxoFactra: String
}, { collection: 'gsk3cAppriesgos' });

const Riesgo = mongoose.model('Riesgo', riesgoSchema);
export default Riesgo;