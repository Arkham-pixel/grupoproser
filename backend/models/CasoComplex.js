import mongoose from 'mongoose';

const SiniestroSchema = new mongoose.Schema({
  // Campos principales con nombres exactos que envía el formulario
  nmroAjste: String,
  codiRespnsble: { type: String, ref: 'Responsable' },
  codiAsgrdra: String,
  nmroSinstro: String,
  codWorkflow: String,
  funcAsgrdra: { type: String, ref: 'FuncionarioAseguradora' },
  fchaAsgncion: Date,
  asgrBenfcro: String,
  tipoDucumento: String,
  numDocumento: String,
  tipoPoliza: String,
  nmroPolza: String,
  amprAfctdo: String,
  fchaSinstro: Date,
  descSinstro: String,
  ciudadSiniestro: String,
  fchaInspccion: Date,
  codiEstdo: String,
  fchaContIni: Date,
  
  // Campos adicionales
  obse_cont_ini: String,
  anex_cont_ini: String,
  obse_inspccion: String,
  anex_acta_inspccion: String,
  anex_sol_doc: String,
  obse_soli_docu: String,
  anxo_inf_prelim: String,
  obse_info_prelm: String,
  anxo_info_fnal: String,
  obse_info_fnal: String,
  anxo_repo_acti: String,
  obse_repo_acti: String,
  anxo_factra: String,
  anxo_honorarios: String,
  anxo_honorariosdefinit: String,
  anxo_autorizacion: String,
  obse_comprmsi: String,
  obse_segmnto: String,
  
  // Campos de fechas
  fcha_soli_docu: Date,
  fcha_info_prelm: Date,
  fcha_info_fnal: Date,
  fcha_repo_acti: Date,
  fcha_ult_segui: Date,
  fcha_act_segui: Date,
  fcha_finqto_indem: Date,
  fcha_factra: Date,
  fcha_ult_revi: Date,
  
  // Campos numéricos
  dias_transcrrdo: Number,
  vlor_resrva: Number,
  vlor_reclmo: Number,
  monto_indmzar: Number,
  vlor_servcios: Number,
  vlor_gastos: Number,
  total: Number,
  total_general: Number,
  total_pagado: Number,
  iva: Number,
  reteiva: Number,
  retefuente: Number,
  reteica: Number,
  porc_iva: Number,
  porc_reteiva: Number,
  porc_retefuente: Number,
  porc_reteica: Number,
  
  // Campo para historial de documentos
  historialDocs: [{ type: mongoose.Schema.Types.Mixed }]
}, { collection: 'gsk3cAppsiniestro' });

const Siniestro = mongoose.model('Siniestro', SiniestroSchema, 'gsk3cAppsiniestro');
export default Siniestro;
