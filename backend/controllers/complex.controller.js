// backend/controllers/complex.controller.js
import Complex from '../models/Complex.js';
import Siniestro from '../models/CasoComplex.js';
import mongoose from 'mongoose'; // Added missing import

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
    console.log('🔍 ===== INICIANDO OBTENCIÓN DE CASOS =====');
    console.log('🔍 Obteniendo casos y siniestros...');
    
    // Verificar conexión a MongoDB
    console.log('🔌 Estado de conexión MongoDB:', mongoose.connection.readyState);
    console.log('🔌 Nombre de la base de datos:', mongoose.connection.name);
    
    // Usar Promise.allSettled para manejar errores individuales
    const [casosResult, siniestrosResult] = await Promise.allSettled([
      Complex.find().sort({ creado_en: -1 }),
      Siniestro.find()
    ]);
    
    // Extraer casos o usar array vacío si hay error
    const casos = casosResult.status === 'fulfilled' ? casosResult.value : [];
    const siniestros = siniestrosResult.status === 'fulfilled' ? siniestrosResult.value : [];
    
    console.log('📊 Casos Complex encontrados:', casos.length);
    console.log('📊 Siniestros encontrados:', siniestros.length);
    
    if (casosResult.status === 'rejected') {
      console.error('❌ Error al obtener casos Complex:', casosResult.reason);
    }
    if (siniestrosResult.status === 'rejected') {
      console.error('❌ Error al obtener siniestros:', siniestrosResult.reason);
    }
    
    // Log del primer caso si existe
    if (casos.length > 0) {
      console.log('🧪 Primer caso complex:', JSON.stringify(casos[0], null, 2));
    } else {
      console.log('⚠️ No se encontraron casos complex en la base de datos');
      
      // Crear un caso de prueba si no hay datos
      try {
        console.log('🔧 Creando caso de prueba...');
        const casoPrueba = new Complex({
          numero_ajuste: 'TEST001',
          intermediario: 'Intermediario de Prueba',
          aseguradora: 'Aseguradora de Prueba',
          responsable: 'Responsable de Prueba',
          estado: '1',
          creado_en: new Date(),
          historialDocs: [
            {
              tipo: 'Documento de Prueba',
              nombre: 'test.pdf',
              fecha: new Date().toISOString().split('T')[0],
              comentario: 'Este es un caso de prueba'
            }
          ]
        });
        
        await casoPrueba.save();
        console.log('✅ Caso de prueba creado exitosamente');
        casos.push(casoPrueba);
      } catch (error) {
        console.error('❌ Error creando caso de prueba:', error);
      }
    }
    
    // Log del primer siniestro si existe
    if (siniestros.length > 0) {
      console.log('🧪 Primer siniestro:', JSON.stringify(siniestros[0], null, 2));
    } else {
      console.log('⚠️ No se encontraron siniestros en la base de datos');
    }

    // Crear un Set para evitar duplicados basado en número de ajuste
    const casosUnicos = new Map();
    
    // Agregar casos Complex primero (prioridad alta)
    casos.forEach(caso => {
      const numeroAjuste = caso.numero_ajuste || caso.nmroAjste;
      if (numeroAjuste && !casosUnicos.has(numeroAjuste)) {
        casosUnicos.set(numeroAjuste, {
          ...caso.toObject(),
          origen: 'complex',
          // Asegurar que los campos de texto sean strings
          intermediario: caso.intermediario || '',
          aseguradora: caso.aseguradora || '',
          funcionario_aseguradora: caso.funcionario_aseguradora || '',
          responsable: caso.responsable || '',
          asegurado: caso.asegurado || '',
          numero_ajuste: caso.numero_ajuste || '',
          numero_siniestro: caso.numero_siniestro || '',
          codigo_workflow: caso.codigo_workflow || '',
          numero_poliza: caso.numero_poliza || '',
          estado: caso.estado || '',
          // Formatear fechas
          creado_en: caso.creado_en,
          fecha_asignacion: caso.fecha_asignacion,
          fecha_inspeccion: caso.fecha_inspeccion,
          fecha_factura: caso.fecha_factura,
          // Historial de documentos
          historialDocs: caso.historialDocs || [],
        });
      }
    });
    
    // Agregar siniestros solo si no hay duplicado por número de ajuste
    siniestros.forEach(siniestro => {
      const numeroAjuste = siniestro.nmroAjste || siniestro.numero_ajuste;
      if (numeroAjuste && !casosUnicos.has(numeroAjuste)) {
        casosUnicos.set(numeroAjuste, {
          _id: siniestro._id,
          // Campos principales mapeados
          nmroAjste: siniestro.nmroAjste || '',
          codWorkflow: siniestro.codWorkflow || '',
          nmroSinstro: siniestro.nmroSinstro || '',
          nombIntermediario: siniestro.nombIntermediario || '',
          codiAsgrdra: siniestro.codiAsgrdra || '',
          nombreFuncionario: siniestro.nombreFuncionario || '',
          nombreResponsable: siniestro.nombreResponsable || '',
          asgrBenfcro: siniestro.asgrBenfcro || '',
          codiEstdo: siniestro.codiEstdo || '',
          fchaAsgncion: siniestro.fchaAsgncion || '',
          fchaInspccion: siniestro.fchaInspccion || '',
          fchaUltDoc: siniestro.fchaUltDoc || '',
          fchaInfoFnal: siniestro.fchaInfoFnal || '',
          diasUltRev: siniestro.diasUltRev || '',
          obseSegmnto: siniestro.obseSegmnto || '',
          nmroPolza: siniestro.nmroPolza || '',
          // Campos legacy mapeados para compatibilidad
          numero_ajuste: siniestro.nmroAjste || '',
          codigo_workflow: siniestro.codWorkflow || '',
          numero_siniestro: siniestro.nmroSinstro || '',
          intermediario: siniestro.nombIntermediario || '',
          aseguradora: siniestro.codiAsgrdra || '',
          funcionario_aseguradora: siniestro.nombreFuncionario || '',
          responsable: siniestro.nombreResponsable || '',
          asegurado: siniestro.asgrBenfcro || '',
          tipo_documento: siniestro.tipo_ducumento || '',
          numero_documento: siniestro.num_documento || '',
          fecha_siniestro: siniestro.fcha_sinstro || '',
          ciudad_siniestro: siniestro.ciudad_siniestro || '',
          descripcion_siniestro: siniestro.desc_sinstro || '',
          estado: siniestro.codi_estdo || '',
          tipo_poliza: siniestro.tipo_poliza || '',
          causa_siniestro: siniestro.causa_siniestro || '',
          valor_reserva: siniestro.vlor_resrva || '',
          valor_reclamo: siniestro.vlor_reclmo || '',
          monto_indemnizar: siniestro.monto_indmzar || '',
          fecha_contacto_inicial: siniestro.fcha_cont_ini || '',
          observaciones_contacto_inicial: siniestro.obse_cont_ini || '',
          adjuntos_contacto_inicial: siniestro.anex_cont_ini || '',
          fecha_inspeccion: siniestro.fcha_inspccion || '',
          observacion_inspeccion: siniestro.obse_inspccion || '',
          adjunto_acta_inspeccion: siniestro.anex_acta_inspccion || '',
          fecha_solicitud_documentos: siniestro.fcha_soli_docu || '',
          observacion_solicitud_documento: siniestro.obse_soli_docu || '',
          adjunto_solicitud_documento: siniestro.anex_sol_doc || '',
          fecha_informe_preliminar: siniestro.fcha_info_prelm || '',
          adjunto_informe_preliminar: siniestro.anxo_inf_prelim || '',
          observacion_informe_preliminar: siniestro.obse_info_prelm || '',
          fecha_informe_final: siniestro.fcha_info_fnal || '',
          adjunto_informe_final: siniestro.anxo_info_fnal || '',
          observacion_informe_final: siniestro.obse_info_fnal || '',
          fecha_ultimo_documento: siniestro.fcha_repo_acti || '',
          adjunto_entrega_ultimo_documento: siniestro.anxo_repo_acti || '',
          numero_factura: siniestro.nmro_factra || '',
          valor_servicio: siniestro.vlor_servcios || '',
          valor_gastos: siniestro.vlor_gastos || '',
          iva: siniestro.iva || '',
          reteiva: siniestro.reteiva || '',
          retefuente: siniestro.retefuente || '',
          reteica: siniestro.reteica || '',
          total_base: siniestro.total || '',
          total_factura: siniestro.total_general || '',
          total_pagado: siniestro.total_pagado || '',
          fecha_factura: siniestro.fcha_factra || '',
          fecha_ultima_revision: siniestro.fcha_ult_revi || '',
          observacion_compromisos: siniestro.obse_comprmsi || '',
          adjunto_factura: siniestro.anxo_factra || '',
          fecha_ultimo_seguimiento: siniestro.fcha_ult_segui || '',
          observacion_seguimiento_pendientes: siniestro.obse_segmnto || '',
          adjunto_seguimientos_pendientes: '', // No hay campo directo
          numero_poliza: siniestro.nmro_polza || '',
          fecha_asignacion: siniestro.fcha_asgncion || '',
          creado_en: siniestro.createdAt || '',
          // Campos adicionales agregados
          amparo_afectado: siniestro.ampr_afctdo || '',
          fecha_fin_quito_indemnizacion: siniestro.fcha_finqto_indem || '',
          anexo_honorarios: siniestro.anxo_honorarios || '',
          anexo_honorarios_definitivo: siniestro.anxo_honorariosdefinit || '',
          anexo_autorizacion: siniestro.anxo_autorizacion || '',
          porcentaje_iva: siniestro.porc_iva || '',
          porcentaje_reteiva: siniestro.porc_reteiva || '',
          porcentaje_retefuente: siniestro.porc_retefuente || '',
          porcentaje_reteica: siniestro.porc_reteica || '',
          // Historial de documentos
          historialDocs: siniestro.historialDocs || [],
          origen: 'siniestro',
        });
      }
    });
    
    // Convertir el Map a array y ordenar por fecha de creación
    const casosFinales = Array.from(casosUnicos.values()).sort((a, b) => {
      const fechaA = new Date(a.creado_en || a.fecha_asignacion || a.fchaAsgncion || 0);
      const fechaB = new Date(b.creado_en || b.fecha_asignacion || b.fchaAsgncion || 0);
      return fechaB - fechaA; // Orden descendente (más nuevo primero)
    });
    
    console.log('📊 Total casos únicos después de eliminar duplicados:', casosFinales.length);
    console.log('📊 Casos Complex:', casosFinales.filter(c => c.origen === 'complex').length);
    console.log('📊 Casos Siniestro:', casosFinales.filter(c => c.origen === 'siniestro').length);
    
    // Log de algunos casos para verificar
    if (casosFinales.length > 0) {
      console.log('🧪 Primer caso final:', {
        numero_ajuste: casosFinales[0].numero_ajuste || casosFinales[0].nmroAjste,
        origen: casosFinales[0].origen,
        intermediario: casosFinales[0].intermediario || casosFinales[0].nombIntermediario
      });
    }

    res.json(casosFinales);
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
