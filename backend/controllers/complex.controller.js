// backend/controllers/complex.controller.js
import Complex from '../models/Complex.js';
import Siniestro from '../models/CasoComplex.js';
import mongoose from 'mongoose'; // Added missing import
import { enviarNotificacionAsignacion, enviarNotificacionAseguradora } from '../services/emailService.js';

// Crear un nuevo caso
export const crearComplex = async (req, res) => {
  try {
         console.log('🎯 ===== INICIANDO CREACIÓN DE COMPLEX =====');
     console.log('📝 DATOS RECIBIDOS EN crearComplex:', JSON.stringify(req.body, null, 2));
           console.log('🔍 CAMPOS CLAVE:');
      console.log('   - responsable:', req.body.codiRespnsble);
      console.log('   - aseguradora:', req.body.codiAsgrdra);
      console.log('   - funcionario_aseguradora:', req.body.funcAsgrdra);
      console.log('   - intermediario:', req.body.nombIntermediario);
      console.log('🔍 VERIFICACIÓN DE CAMPOS:');
      console.log('   - req.body.codiRespnsble existe:', !!req.body.codiRespnsble);
      console.log('   - req.body.codiAsgrdra existe:', !!req.body.codiAsgrdra);
      console.log('   - req.body.funcAsgrdra existe:', !!req.body.funcAsgrdra);
      console.log('   - req.body.nombIntermediario existe:', !!req.body.nombIntermediario);
      console.log('🔍 VALORES COMPLETOS:');
      console.log('   - responsable valor:', req.body.codiRespnsble);
      console.log('   - aseguradora valor:', req.body.codiAsgrdra);
      console.log('   - funcionario_aseguradora valor:', req.body.funcAsgrdra);
      console.log('   - intermediario valor:', req.body.nombIntermediario);
    
         // Generar nmroAjste único si está vacío
     let datosParaGuardar = { ...req.body };
     if (!datosParaGuardar.nmroAjste || datosParaGuardar.nmroAjste === '') {
       const ultimo = await Complex.findOne().sort({ nmroAjste: -1 });
       const nuevoNumero = ultimo && ultimo.nmroAjste ? 
         parseInt(ultimo.nmroAjste) + 1 : 1;
       datosParaGuardar.nmroAjste = String(nuevoNumero);
       console.log('🔢 NUEVO NMRO_AJUSTE GENERADO:', datosParaGuardar.nmroAjste);
     }
    
    const nuevo = new Complex(datosParaGuardar);
    
    console.log('💾 OBJETO A GUARDAR:', JSON.stringify(nuevo, null, 2));
    
    await nuevo.save();
    
    console.log('✅ COMPLEX GUARDADO EXITOSAMENTE:', JSON.stringify(nuevo, null, 2));
         console.log('🎯 ===== COMPLEX CREADO CON ÉXITO =====');
     console.log('📊 RESUMEN DEL CASO CREADO:');
     console.log(`   📋 Número de Ajuste: ${nuevo.nmroAjste}`);
     console.log(`   👤 Intermediario: ${nuevo.nombIntermediario || 'No especificado'}`);
     console.log(`   🏢 Aseguradora: ${nuevo.codiAsgrdra || 'No especificada'}`);
     console.log(`   👨‍💼 Responsable: ${nuevo.codiRespnsble || 'No especificado'}`);
     console.log(`   📅 Fecha de Creación: ${nuevo.fchaAsgncion}`);
     console.log(`   🆔 ID del Caso: ${nuevo._id}`);
     console.log('🎯 ===== COMPLEX CREADO CON ÉXITO =====');
    
                 // 📧 ENVIAR NOTIFICACIONES POR EMAIL
        try {
          console.log('📧 Iniciando envío de notificaciones por email...');
          
          // Verificar que los modelos estén disponibles
          console.log('🔍 ===== VERIFICACIÓN DE MODELOS =====');
          console.log('🔍 Modelo Responsable disponible:', !!mongoose.model('Responsable'));
          console.log('🔍 Modelo FuncionarioAseguradora disponible:', !!mongoose.model('FuncionarioAseguradora'));
          console.log('🔍 Conexión MongoDB estado:', mongoose.connection.readyState);
          console.log('🔍 Base de datos:', mongoose.connection.name);
       
                        // Obtener email del responsable desde la base de datos
         let emailResponsable = '';
         if (nuevo.codiRespnsble) {
           try {
             console.log('🔍 ===== BÚSQUEDA RESPONSABLE =====');
             console.log('🔍 Código del responsable a buscar:', nuevo.codiRespnsble);
             console.log('🔍 Modelo usado:', 'Responsable');
             console.log('🔍 Campo de búsqueda:', 'codiRespnsble');
             console.log('🔍 Colección:', 'gsk3cAppresponsable');
             
                           const responsableDB = await mongoose.model('Responsable').findOne({ 
                nmbrRespnsble: nuevo.codiRespnsble 
              });
            
            console.log('🔍 Resultado búsqueda responsable:', responsableDB);
            if (responsableDB && responsableDB.email) {
              emailResponsable = responsableDB.email;
              console.log('✅ Email del responsable encontrado:', emailResponsable);
            } else if (responsableDB) {
              console.log('⚠️ Responsable encontrado pero sin email:', responsableDB);
              console.log('⚠️ Campos disponibles:', Object.keys(responsableDB.toObject()));
            } else {
              console.log('❌ No se encontró el responsable en la BD');
            }
          } catch (error) {
            console.log('❌ Error buscando responsable:', error.message);
            console.log('❌ Stack trace:', error.stack);
          }
        } else {
          console.log('⚠️ No hay responsable asignado para buscar email');
        }
       
                        // Obtener email del funcionario de aseguradora desde la base de datos
         let emailFuncionarioAseguradora = '';
         if (nuevo.funcAsgrdra) {
           try {
             console.log('🔍 ===== BÚSQUEDA FUNCIONARIO =====');
             console.log('🔍 Código del funcionario a buscar:', nuevo.funcAsgrdra);
             console.log('🔍 Modelo usado:', 'FuncionarioAseguradora');
             console.log('🔍 Campo de búsqueda:', 'codiContcto');
             console.log('🔍 Colección:', 'gsk3cAppcontactoscli');
             
                           const funcionarioDB = await mongoose.model('FuncionarioAseguradora').findOne({ 
                nmbrContcto: nuevo.funcAsgrdra 
              });
            
            console.log('🔍 Resultado búsqueda funcionario:', funcionarioDB);
            if (funcionarioDB && funcionarioDB.email) {
              emailFuncionarioAseguradora = funcionarioDB.email;
              console.log('✅ Email del funcionario aseguradora encontrado:', emailFuncionarioAseguradora);
            } else if (funcionarioDB) {
              console.log('⚠️ Funcionario encontrado pero sin email:', funcionarioDB);
              console.log('⚠️ Campos disponibles:', Object.keys(funcionarioDB.toObject()));
            } else {
              console.log('❌ No se encontró el funcionario en la BD');
            }
          } catch (error) {
            console.log('❌ Error buscando funcionario:', error.message);
            console.log('❌ Stack trace:', error.stack);
          }
        } else {
          console.log('⚠️ No hay funcionario asignado para buscar email');
        }
       
                        // Preparar datos para notificación de asignación
         const datosNotificacion = {
           numeroCaso: nuevo.nmroAjste,
           numeroSiniestro: nuevo.nmroSinstro || 'No especificado',
           codigoWorkflow: nuevo.codWorkflow || 'No especificado',
           nombreResponsable: nuevo.codiRespnsble || 'Sin asignar',
           aseguradora: nuevo.codiAsgrdra || 'No especificada',
           asegurado: nuevo.nombIntermediario || 'No especificado',
           fechaAsignacion: nuevo.fchaAsgncion || new Date(),
           quienAsigna: req.user?.nombre || 'Sistema',
           emailResponsable: emailResponsable,
           emailQuienAsigna: req.user?.email || 'danalyst@proserpuertos.com.co',
           observaciones: nuevo.obseContIni || nuevo.descSinstro || '',
           numeroPoliza: nuevo.nmroPolza || 'No especificado',
           ciudadSiniestro: nuevo.ciudadSiniestro || 'No especificada',
           descripcionSiniestro: nuevo.descSinstro || 'No especificada'
         };
       
       console.log('📧 Datos para notificación:', JSON.stringify(datosNotificacion, null, 2));
       
       // Enviar notificación de asignación
       const resultadoEmail = await enviarNotificacionAsignacion(datosNotificacion);
       console.log('✅ Notificación de asignación enviada:', resultadoEmail);
       
       // Enviar notificación a aseguradora si hay funcionario asignado
       if (nuevo.funcAsgrdra && emailFuncionarioAseguradora) {
         try {
                       const datosNotificacionAseguradora = {
              numeroCaso: nuevo.nmroAjste,
              numeroSiniestro: nuevo.nmroSinstro || 'No especificado',
              codigoWorkflow: nuevo.codWorkflow || 'No especificado',
              nombreResponsable: nuevo.codiRespnsble || 'Sin asignar',
              aseguradora: nuevo.codiAsgrdra || 'No especificada',
              asegurado: nuevo.nombIntermediario || 'No especificado',
              fechaAsignacion: nuevo.fchaAsgncion || new Date(),
              emailFuncionarioAseguradora: emailFuncionarioAseguradora,
              numeroPoliza: nuevo.nmroPolza || 'No especificado',
              ciudadSiniestro: nuevo.ciudadSiniestro || 'No especificada',
              descripcionSiniestro: nuevo.descSinstro || 'No especificada'
            };
           
           const resultadoEmailAseguradora = await enviarNotificacionAseguradora(datosNotificacionAseguradora);
           console.log('✅ Notificación a aseguradora enviada:', resultadoEmailAseguradora);
           
         } catch (emailAseguradoraError) {
           console.error('⚠️ Error enviando notificación a aseguradora:', emailAseguradoraError);
           // No fallar por error de email a aseguradora
         }
       }
       
     } catch (emailError) {
       console.error('⚠️ Error enviando notificaciones por email:', emailError);
       console.error('⚠️ El caso se creó correctamente, pero falló el envío de notificaciones');
       // NO fallar la creación del caso por error de email
     }
    
    res.status(201).json({
      success: true,
      message: `Caso complex #${datosParaGuardar.nmroAjste} creado exitosamente`,
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
    console.log('🔄 ===== INICIANDO ACTUALIZACIÓN DE COMPLEX =====');
    console.log('📝 DATOS RECIBIDOS EN actualizarComplex:', JSON.stringify(req.body, null, 2));
    
    const casoActualizado = await Complex.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!casoActualizado) return res.status(404).json({ error: 'Caso no encontrado' });
    
    console.log('✅ COMPLEX ACTUALIZADO EXITOSAMENTE:', JSON.stringify(casoActualizado, null, 2));
    
         // 📧 ENVIAR NOTIFICACIONES POR EMAIL SI HAY CAMBIOS RELEVANTES
     try {
       console.log('📧 Verificando si se deben enviar notificaciones...');
       
               // Solo enviar notificaciones si hay cambios en campos relevantes
                 const camposRelevantes = ['codiRespnsble', 'codiAsgrdra', 'codiEstdo', 'funcAsgrdra'];
         const hayCambiosRelevantes = camposRelevantes.some(campo => 
           req.body[campo] !== undefined && req.body[campo] !== casoActualizado[campo]
         );
       
       if (hayCambiosRelevantes) {
         console.log('📧 Cambios relevantes detectados, enviando notificaciones...');
         
         // Obtener email del responsable desde la base de datos
         let emailResponsable = '';
                    if (casoActualizado.codiRespnsble) {
             try {
               const responsableDB = await mongoose.model('Responsable').findOne({ 
                 nmbrRespnsble: casoActualizado.codiRespnsble 
               });
             if (responsableDB && responsableDB.email) {
               emailResponsable = responsableDB.email;
               console.log('📧 Email del responsable encontrado:', emailResponsable);
             }
           } catch (error) {
             console.log('⚠️ No se pudo obtener email del responsable:', error.message);
           }
         }
         
                   // Obtener email del funcionario de aseguradora desde la base de datos
          let emailFuncionarioAseguradora = '';
                     if (casoActualizado.funcAsgrdra) {
                         try {
               const funcionarioDB = await mongoose.model('FuncionarioAseguradora').findOne({ 
                 nmbrContcto: casoActualizado.funcAsgrdra 
               });
              if (funcionarioDB && funcionarioDB.email) {
                emailFuncionarioAseguradora = funcionarioDB.email;
                console.log('📧 Email del funcionario aseguradora encontrado:', emailFuncionarioAseguradora);
              }
            } catch (error) {
              console.log('⚠️ No se pudo obtener email del funcionario aseguradora:', error.message);
            }
          }
         
                              // Preparar datos para notificación de asignación
           const datosNotificacion = {
             numeroCaso: casoActualizado.nmroAjste,
             numeroSiniestro: casoActualizado.nmroSinstro || 'No especificado',
             codigoWorkflow: casoActualizado.codWorkflow || 'No especificado',
             nombreResponsable: casoActualizado.codiRespnsble || 'Sin asignar',
             aseguradora: casoActualizado.codiAsgrdra || 'No especificada',
             asegurado: casoActualizado.nombIntermediario || 'No especificado',
             fechaAsignacion: casoActualizado.fchaAsgncion || new Date(),
             quienAsigna: req.user?.nombre || 'Sistema',
             emailResponsable: emailResponsable,
             emailQuienAsigna: req.user?.email || 'danalyst@proserpuertos.com.co',
             observaciones: casoActualizado.obseContIni || casoActualizado.descSinstro || '',
             numeroPoliza: casoActualizado.nmroPolza || 'No especificado',
             ciudadSiniestro: casoActualizado.ciudadSiniestro || 'No especificada',
             descripcionSiniestro: casoActualizado.descSinstro || 'No especificada'
           };
         
         console.log('📧 Datos para notificación de actualización:', JSON.stringify(datosNotificacion, null, 2));
         
         // Enviar notificación de asignación
         const resultadoEmail = await enviarNotificacionAsignacion(datosNotificacion);
         console.log('✅ Notificación de actualización enviada:', resultadoEmail);
         
                   // Enviar notificación a aseguradora si hay funcionario asignado
          if (casoActualizado.funcAsgrdra && emailFuncionarioAseguradora) {
            try {
              const datosNotificacionAseguradora = {
                numeroCaso: casoActualizado.nmroAjste,
                numeroSiniestro: casoActualizado.nmroSinstro || 'No especificado',
                codigoWorkflow: casoActualizado.codWorkflow || 'No especificado',
                nombreResponsable: casoActualizado.codiRespnsble || 'Sin asignar',
                aseguradora: casoActualizado.codiAsgrdra || 'No especificada',
                asegurado: casoActualizado.nombIntermediario || 'No especificado',
                fechaAsignacion: casoActualizado.fchaAsgncion || new Date(),
                emailFuncionarioAseguradora: emailFuncionarioAseguradora,
                numeroPoliza: casoActualizado.nmroPolza || 'No especificado',
                ciudadSiniestro: casoActualizado.ciudadSiniestro || 'No especificada',
                descripcionSiniestro: casoActualizado.descSinstro || 'No especificada'
              };
             
             const resultadoEmailAseguradora = await enviarNotificacionAseguradora(datosNotificacionAseguradora);
             console.log('✅ Notificación de actualización a aseguradora enviada:', resultadoEmailAseguradora);
             
           } catch (emailAseguradoraError) {
             console.error('⚠️ Error enviando notificación de actualización a aseguradora:', emailAseguradoraError);
             // No fallar por error de email a aseguradora
           }
         }
       } else {
         console.log('📧 No hay cambios relevantes, no se envían notificaciones');
       }
       
     } catch (emailError) {
       console.error('⚠️ Error enviando notificaciones por email:', emailError);
       console.error('⚠️ El caso se actualizó correctamente, pero falló el envío de notificaciones');
       // NO fallar la actualización del caso por error de email
     }
    
    console.log('🔄 ===== COMPLEX ACTUALIZADO CON ÉXITO =====');
    res.json(casoActualizado);
  } catch (error) {
    console.error('❌ Error al actualizar el caso:', error);
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
