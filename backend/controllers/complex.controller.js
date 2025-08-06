// backend/controllers/complex.controller.js
import Complex from '../models/Complex.js';
import Siniestro from '../models/CasoComplex.js';

// Crear un nuevo caso
export const crearComplex = async (req, res) => {
  try {
    console.log('🎯 ===== INICIANDO CREACIÓN DE COMPLEX =====');
    console.log('📝 DATOS RECIBIDOS EN crearComplex:', JSON.stringify(req.body, null, 2));
    
    // Generar numero_ajuste único si está vacío
    let datosParaGuardar = { ...req.body };
    if (!datosParaGuardar.numero_ajuste || datosParaGuardar.numero_ajuste === '') {
      const ultimo = await Complex.findOne().sort({ numero_ajuste: -1 });
      const nuevoNumero = ultimo && ultimo.numero_ajuste ? 
        parseInt(ultimo.numero_ajuste) + 1 : 1;
      datosParaGuardar.numero_ajuste = String(nuevoNumero);
      console.log('🔢 NUEVO NUMERO_AJUSTE GENERADO:', datosParaGuardar.numero_ajuste);
    }
    
    const nuevo = new Complex(datosParaGuardar);
    
    console.log('💾 OBJETO A GUARDAR:', JSON.stringify(nuevo, null, 2));
    
    await nuevo.save();
    
    console.log('✅ COMPLEX GUARDADO EXITOSAMENTE:', JSON.stringify(nuevo, null, 2));
    console.log('🎯 ===== COMPLEX CREADO CON ÉXITO =====');
    console.log('📊 RESUMEN DEL CASO CREADO:');
    console.log(`   📋 Número de Ajuste: ${nuevo.numero_ajuste}`);
    console.log(`   👤 Intermediario: ${nuevo.intermediario || 'No especificado'}`);
    console.log(`   🏢 Aseguradora: ${nuevo.aseguradora || 'No especificada'}`);
    console.log(`   👨‍💼 Responsable: ${nuevo.responsable || 'No especificado'}`);
    console.log(`   📅 Fecha de Creación: ${nuevo.creado_en}`);
    console.log(`   🆔 ID del Caso: ${nuevo._id}`);
    console.log('🎯 ===== COMPLEX CREADO CON ÉXITO =====');
    
    res.status(201).json({
      success: true,
      message: `Caso complex #${datosParaGuardar.numero_ajuste} creado exitosamente`,
      complex: nuevo
    });
  } catch (error) {
    console.error('❌ ERROR AL GUARDAR COMPLEX:', error);
    console.error('❌ DETALLES DEL ERROR:', error.message);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Obtener todos los casos (unificados de ambas bases, mapeando campos)
export const obtenerTodos = async (req, res) => {
  try {
    console.log('🔍 Obteniendo casos y siniestros...');
    
    // Usar Promise.allSettled para manejar errores individuales
    const [casosResult, siniestrosResult] = await Promise.allSettled([
      Complex.find().sort({ creado_en: -1 }),
      Siniestro.find()
    ]);
    
    // Extraer casos o usar array vacío si hay error
    const casos = casosResult.status === 'fulfilled' ? casosResult.value : [];
    const siniestros = siniestrosResult.status === 'fulfilled' ? siniestrosResult.value : [];
    
    console.log('📊 Casos encontrados:', casos.length);
    console.log('📊 Siniestros encontrados:', siniestros.length);
    
    if (casosResult.status === 'rejected') {
      console.error('❌ Error al obtener casos Complex:', casosResult.reason);
    }
    if (siniestrosResult.status === 'rejected') {
      console.error('❌ Error al obtener siniestros:', siniestrosResult.reason);
    }
    
    if (siniestros.length > 0) {
      console.log('🧪 Primer siniestro:', siniestros[0]);
      console.log('🔍 Campo nomb_intermediario:', siniestros[0].nomb_intermediario);
    }
    // Mapeo de campos para siniestros secundarios con nombres correctos
    const siniestrosNormalizados = siniestros.map(s => ({
      _id: s._id,
      nmroAjste: s.nmroAjste || '',
      codWorkflow: s.codWorkflow || '',
      nmroSinstro: s.nmroSinstro || '',
      nombIntermediario: s.nombIntermediario || '',
      codiAsgrdra: s.codiAsgrdra || '',
      nombreFuncionario: s.nombreFuncionario || '',
      nombreResponsable: s.nombreResponsable || '',
      asgrBenfcro: s.asgrBenfcro || '',
      codiEstdo: s.codiEstdo || '',
      fchaAsgncion: s.fchaAsgncion || '',
      fchaInspccion: s.fchaInspccion || '',
      fchaUltDoc: s.fchaUltDoc || '',
      fchaInfoFnal: s.fchaInfoFnal || '',
      diasUltRev: s.diasUltRev || '',
      obseSegmnto: s.obseSegmnto || '',
      nmroPolza: s.nmroPolza || '',
      // Campos legacy mapeados
      numero_ajuste: s.nmroAjste || '',
      codigo_workflow: s.codWorkflow || '',
      numero_siniestro: s.nmroSinstro || '',
      intermediario: s.nombIntermediario || '',
      aseguradora: s.codiAsgrdra || '',
      funcionario_aseguradora: s.nombreFuncionario || '',
      responsable: s.nombreResponsable || '',
      asegurado: s.asgrBenfcro || '',
      tipo_documento: s.tipo_ducumento || '',
      numero_documento: s.num_documento || '',
      fecha_siniestro: s.fcha_sinstro || '',
      ciudad_siniestro: s.ciudad_siniestro || '',
      descripcion_siniestro: s.desc_sinstro || '',
      estado: s.codi_estdo || '',
      tipo_poliza: s.tipo_poliza || '',
      causa_siniestro: s.causa_siniestro || '',
      valor_reserva: s.vlor_resrva || '',
      valor_reclamo: s.vlor_reclmo || '',
      monto_indemnizar: s.monto_indmzar || '',
      fecha_contacto_inicial: s.fcha_cont_ini || '',
      observaciones_contacto_inicial: s.obse_cont_ini || '',
      adjuntos_contacto_inicial: s.anex_cont_ini || '',
      fecha_inspeccion: s.fcha_inspccion || '',
      observacion_inspeccion: s.obse_inspccion || '',
      adjunto_acta_inspeccion: s.anex_acta_inspccion || '',
      fecha_solicitud_documentos: s.fcha_soli_docu || '',
      observacion_solicitud_documento: s.obse_soli_docu || '',
      adjunto_solicitud_documento: s.anex_sol_doc || '',
      fecha_informe_preliminar: s.fcha_info_prelm || '',
      adjunto_informe_preliminar: s.anxo_inf_prelim || '',
      observacion_informe_preliminar: s.obse_info_prelm || '',
      fecha_informe_final: s.fcha_info_fnal || '',
      adjunto_informe_final: s.anxo_info_fnal || '',
      observacion_informe_final: s.obse_info_fnal || '',
      fecha_ultimo_documento: s.fcha_repo_acti || '',
      adjunto_entrega_ultimo_documento: s.anxo_repo_acti || '',
      numero_factura: s.nmro_factra || '',
      valor_servicio: s.vlor_servcios || '',
      valor_gastos: s.vlor_gastos || '',
      iva: s.iva || '',
      reteiva: s.reteiva || '',
      retefuente: s.retefuente || '',
      reteica: s.reteica || '',
      total_base: s.total || '',
      total_factura: s.total_general || '',
      total_pagado: s.total_pagado || '',
      fecha_factura: s.fcha_factra || '',
      fecha_ultima_revision: s.fcha_ult_revi || '',
      observacion_compromisos: s.obse_comprmsi || '',
      adjunto_factura: s.anxo_factra || '',
      fecha_ultimo_seguimiento: s.fcha_ult_segui || '',
      observacion_seguimiento_pendientes: s.obse_segmnto || '',
      adjunto_seguimientos_pendientes: '', // No hay campo directo
      numero_poliza: s.nmro_polza || '',
      fecha_asignacion: s.fcha_asgncion || '',
      creado_en: s.createdAt || '',
      // Campos adicionales agregados
      amparo_afectado: s.ampr_afctdo || '',
      fecha_fin_quito_indemnizacion: s.fcha_finqto_indem || '',
      anexo_honorarios: s.anxo_honorarios || '',
      anexo_honorarios_definitivo: s.anxo_honorariosdefinit || '',
      anexo_autorizacion: s.anxo_autorizacion || '',
      porcentaje_iva: s.porc_iva || '',
      porcentaje_reteiva: s.porc_reteiva || '',
      porcentaje_retefuente: s.porc_retefuente || '',
      porcentaje_reteica: s.porc_reteica || '',
      origen: 'nueva',
    }));
    const casosNormalizados = casos.map(c => ({
      ...c.toObject(),
      origen: 'historico',
    }));
    res.json([...casosNormalizados, ...siniestrosNormalizados]);
  } catch (error) {
    console.error('Error al obtener los casos:', error);
    res.status(500).json({ error: 'Error al obtener los casos' });
  }
};

// Obtener un caso por ID
export const obtenerPorId = async (req, res) => {
  try {
    const caso = await Complex.findById(req.params.id);
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el caso' });
  }
};

// Actualizar un caso
export const actualizarComplex = async (req, res) => {
  try {
    const casoActualizado = await Complex.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!casoActualizado) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(casoActualizado);
  } catch (error) {
    console.error('Error al actualizar el caso:', error);
    res.status(500).json({ error: 'Error al actualizar el caso' });
  }
};

// Eliminar un caso
export const eliminarComplex = async (req, res) => {
  try {
    const casoEliminado = await Complex.findByIdAndDelete(req.params.id);
    if (!casoEliminado) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el caso:', error);
    res.status(500).json({ error: 'Error al eliminar el caso' });
  }
};

// Obtener intermediarios únicos de la base de datos
export const obtenerIntermediarios = async (req, res) => {
  try {
    console.log('🔍 Obteniendo intermediarios únicos...');
    
    // Por ahora, solo obtener de casos complex hasta que resolvamos el problema de siniestros
    console.log('🔍 Buscando casos complex...');
    const casos = await Complex.find({}, 'intermediario');
    console.log('📊 Casos complex encontrados:', casos.length);
    
    const intermediariosCasos = [...new Set(
      casos
        .map(c => c.intermediario)
        .filter(intermediario => intermediario && intermediario.trim() !== '')
    )];
    console.log('📋 Intermediarios de casos complex:', intermediariosCasos);
    
    // Por ahora, devolver solo los de casos complex
    const todosIntermediarios = intermediariosCasos.sort();
    
    console.log('✅ Intermediarios encontrados:', todosIntermediarios.length);
    console.log('📋 Lista final de intermediarios:', todosIntermediarios);
    
    res.json(todosIntermediarios);
  } catch (error) {
    console.error('❌ Error al obtener intermediarios:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al obtener intermediarios' });
  }
};
