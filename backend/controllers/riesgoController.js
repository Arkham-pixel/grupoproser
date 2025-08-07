import Riesgo from '../models/CasoRiesgo.js';
import SecurUser from '../models/SecurUser.js';
import Responsable from '../models/Responsable.js';
import FuncionarioAseguradora from '../models/FuncionarioAseguradora.js';
import { enviarNotificacionAsignacion, enviarNotificacionAseguradora } from '../services/emailService.js';

export const crearRiesgo = async (req, res) => {
  try {
    console.log('🎯 ===== INICIANDO CREACIÓN DE RIESGO =====');
    console.log('📝 DATOS RECIBIDOS EN crearRiesgo:', JSON.stringify(req.body, null, 2));
    
    // Buscar el número de riesgo más alto existente
    const ultimo = await Riesgo.findOne().sort({ nmroRiesgo: -1 });
    const nuevoNumero = ultimo && ultimo.nmroRiesgo ? ultimo.nmroRiesgo + 1 : 1;
    
    console.log('🔢 NUEVO NÚMERO DE RIESGO:', nuevoNumero);
    
    // Mapear campos del frontend al modelo de MongoDB
    const datosMapeados = {
      nmroRiesgo: nuevoNumero,
      codiIspector: req.body.responsable || req.body.codiIspector,
      codiAsgrdra: req.body.aseguradora || req.body.codiAsgrdra,
      asgrBenfcro: req.body.asegurado || req.body.asgrBenfcro,
      nmroConsecutivo: req.body.nmroConsecutivo || '',
      fchaAsgncion: req.body.fechaAsignacion ? new Date(req.body.fechaAsignacion) : null,
      observAsignacion: req.body.observaciones || req.body.observAsignacion || '',
      adjuntoAsignacion: req.body.adjuntoAsignacion || '',
      fchaInspccion: req.body.fechaInspeccion ? new Date(req.body.fechaInspeccion) : null,
      observInspeccion: req.body.observaciones || req.body.observInspeccion || '',
      adjuntoInspeccion: req.body.adjuntoInspeccion || '',
      codiClasificacion: req.body.codiClasificacion || req.body.clasificacion || '',
      fchaInforme: req.body.fechaInforme ? new Date(req.body.fechaInforme) : null,
      anxoInfoFnal: req.body.anxoInfoFnal || '',
      observInforme: req.body.observInforme || '',
      codDireccion: req.body.direccion || req.body.codDireccion || '',
      funcSolicita: req.body.quienSolicita || req.body.funcSolicita || '',
      codigoPoblado: req.body.ciudad?.value || req.body.codigoPoblado || '',
      ciudadSucursal: req.body.ciudad?.value || req.body.ciudadSucursal || '',
      codiEstdo: req.body.estado ? Number(req.body.estado) : 1, // Estado por defecto
      vlorTarifaAseguradora: req.body.vlorTarifaAseguradora ? Number(req.body.vlorTarifaAseguradora) : 0,
      vlorHonorarios: req.body.vlorHonorarios ? Number(req.body.vlorHonorarios) : 0,
      vlorGastos: req.body.vlorGastos ? Number(req.body.vlorGastos) : 0,
      nmroFactra: req.body.nmroFactra ? Number(req.body.nmroFactra) : 0,
      fchaFactra: req.body.fechaFactra ? new Date(req.body.fechaFactra) : null,
      totalPagado: req.body.totalPagado ? Number(req.body.totalPagado) : 0,
      anxoFactra: req.body.anxoFactra || ''
    };
    
    console.log('🗺️ DATOS MAPEADOS:', JSON.stringify(datosMapeados, null, 2));
    
    // Crear el nuevo riesgo con el número generado
    const nuevoRiesgo = new Riesgo(datosMapeados);
    
    console.log('💾 OBJETO A GUARDAR:', JSON.stringify(nuevoRiesgo, null, 2));
    
    await nuevoRiesgo.save();
    
    console.log('✅ RIESGO GUARDADO EXITOSAMENTE:', JSON.stringify(nuevoRiesgo, null, 2));
    console.log('🎯 ===== RIESGO CREADO CON ÉXITO =====');
    
    // Solo enviar notificación si hay un responsable asignado
    if (nuevoRiesgo.codiIspector || nuevoRiesgo.codiRespnsble) {
      console.log('📧 ===== ENVIANDO NOTIFICACIÓN DE ASIGNACIÓN =====');
      
      try {
        // Obtener información del responsable
        let responsableInfo = null;
        if (nuevoRiesgo.codiIspector) {
          responsableInfo = await Responsable.findOne({ codiRespnsble: nuevoRiesgo.codiIspector });
        } else if (nuevoRiesgo.codiRespnsble) {
          responsableInfo = await Responsable.findOne({ codiRespnsble: nuevoRiesgo.codiRespnsble });
        }
        
        console.log('👤 INFORMACIÓN DEL RESPONSABLE:', responsableInfo);
        
        // Obtener información del usuario que está creando el caso
        const usuarioActual = req.user || { name: 'Sistema', email: 'sistema@proserpuertos.com.co' };
        
        // Preparar datos para la notificación
        const datosNotificacion = {
          numeroCaso: nuevoRiesgo.nmroRiesgo || `Riesgo-${nuevoRiesgo._id}`,
          nombreResponsable: responsableInfo?.nmbrRespnsble || 'Sin asignar',
          emailResponsable: responsableInfo?.email || null,
          aseguradora: nuevoRiesgo.codiAsgrdra || 'No especificada',
          asegurado: nuevoRiesgo.asgrBenfcro || 'No especificado',
          fechaAsignacion: nuevoRiesgo.fchaAsgncion ? nuevoRiesgo.fchaAsgncion.toLocaleDateString() : 'No especificada',
          quienAsigna: usuarioActual.name || 'Sistema',
          emailQuienAsigna: usuarioActual.email || null,
          observaciones: nuevoRiesgo.observAsignacion || ''
        };
        
        console.log('📧 DATOS PARA NOTIFICACIÓN:', datosNotificacion);
        
        // Enviar notificación principal
        const resultadoEmail = await enviarNotificacionAsignacion(datosNotificacion);
        
        console.log('✅ NOTIFICACIÓN PRINCIPAL ENVIADA:', resultadoEmail);
        
        // Buscar y enviar notificación al funcionario de la aseguradora
        let resultadoEmailAseguradora = null;
        if (nuevoRiesgo.codiAsgrdra) {
          try {
            const funcionarioAseguradora = await FuncionarioAseguradora.findOne({ 
              codiAsgrdra: nuevoRiesgo.codiAsgrdra 
            });
            
            if (funcionarioAseguradora && funcionarioAseguradora.email) {
              console.log('👤 FUNCIONARIO ASEGURADORA ENCONTRADO:', funcionarioAseguradora);
              
              const datosNotificacionAseguradora = {
                numeroCaso: nuevoRiesgo.nmroRiesgo || `Riesgo-${nuevoRiesgo._id}`,
                nombreResponsable: responsableInfo?.nmbrRespnsble || 'Sin asignar',
                emailResponsable: responsableInfo?.email || null,
                telefonoResponsable: responsableInfo?.telefono || null,
                aseguradora: nuevoRiesgo.codiAsgrdra || 'No especificada',
                asegurado: nuevoRiesgo.asgrBenfcro || 'No especificado',
                fechaAsignacion: nuevoRiesgo.fchaAsgncion ? nuevoRiesgo.fchaAsgncion.toLocaleDateString() : 'No especificada',
                emailFuncionarioAseguradora: funcionarioAseguradora.email
              };
              
              console.log('📧 ENVIANDO NOTIFICACIÓN A ASEGURADORA:', datosNotificacionAseguradora);
              
              resultadoEmailAseguradora = await enviarNotificacionAseguradora(datosNotificacionAseguradora);
              
              console.log('✅ NOTIFICACIÓN A ASEGURADORA ENVIADA:', resultadoEmailAseguradora);
            } else {
              console.log('⚠️ No se encontró funcionario de aseguradora o no tiene email');
            }
          } catch (emailAseguradoraError) {
            console.error('❌ ERROR ENVIANDO NOTIFICACIÓN A ASEGURADORA:', emailAseguradoraError);
            resultadoEmailAseguradora = { error: emailAseguradoraError.message };
          }
        }
        
        // Devolver respuesta con información de ambos emails
        res.status(201).json({
          success: true,
          message: `Caso de riesgo #${nuevoNumero} creado exitosamente`,
          riesgo: nuevoRiesgo,
          notificacionEnviada: true,
          emailInfo: resultadoEmail,
          emailAseguradora: resultadoEmailAseguradora
        });
        
      } catch (emailError) {
        console.error('❌ ERROR ENVIANDO NOTIFICACIÓN:', emailError);
        
        // Aún devolver el caso creado aunque falle el email
        res.status(201).json({
          success: true,
          message: `Caso de riesgo #${nuevoNumero} creado exitosamente`,
          riesgo: nuevoRiesgo,
          notificacionEnviada: false,
          emailError: emailError.message
        });
      }
    } else {
      // No hay responsable asignado, devolver respuesta normal sin email
      res.status(201).json({
        success: true,
        message: `Caso de riesgo #${nuevoNumero} creado exitosamente`,
        riesgo: nuevoRiesgo,
        notificacionEnviada: false,
        mensaje: 'Caso creado sin responsable asignado. No se envió notificación por email.'
      });
    }
  } catch (err) {
    console.error('❌ ERROR AL GUARDAR RIESGO:', err);
    console.error('❌ DETALLES DEL ERROR:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Error al guardar el riesgo', 
      details: err.message 
    });
  }
};

export const obtenerRiesgos = async (req, res) => {
  try {
    const riesgos = await Riesgo.find();
    res.json(riesgos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los riesgos' });
  }
};

export const obtenerRiesgoPorId = async (req, res) => {
  try {
    const riesgo = await Riesgo.findById(req.params.id);
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    res.json(riesgo);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el riesgo' });
  }
};

export const actualizarRiesgo = async (req, res) => {
  try {
    console.log('🔄 ===== ACTUALIZANDO RIESGO =====');
    console.log('📝 DATOS RECIBIDOS EN actualizarRiesgo:', JSON.stringify(req.body, null, 2));
    
    // Obtener el caso actual antes de actualizarlo
    const casoActual = await Riesgo.findById(req.params.id);
    if (!casoActual) {
      return res.status(404).json({ error: 'Riesgo no encontrado' });
    }
    
    console.log('📊 CASO ACTUAL:', {
      responsable: casoActual.codiIspector,
      fechaAsignacion: casoActual.fchaAsgncion
    });
    
    // Actualizar el caso
    const riesgo = await Riesgo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    
    console.log('✅ CASO ACTUALIZADO:', {
      responsable: riesgo.codiIspector,
      fechaAsignacion: riesgo.fchaAsgncion
    });
    
    // Verificar si se asignó un nuevo responsable
    const responsableCambio = 
      (casoActual.codiIspector !== riesgo.codiIspector) ||
      (casoActual.codiRespnsble !== riesgo.codiRespnsble);
    
    const fechaAsignacionCambio = 
      casoActual.fchaAsgncion?.toISOString() !== riesgo.fchaAsgncion?.toISOString();
    
    console.log('🔍 DETECCIÓN DE CAMBIOS:', {
      responsableCambio,
      fechaAsignacionCambio,
      responsableAnterior: casoActual.codiIspector,
      responsableNuevo: riesgo.codiIspector,
      fechaAnterior: casoActual.fchaAsgncion,
      fechaNueva: riesgo.fchaAsgncion
    });
    
    // Si se asignó un nuevo responsable o se cambió la fecha de asignación, enviar notificación
    if (responsableCambio || fechaAsignacionCambio) {
      console.log('📧 ===== ENVIANDO NOTIFICACIÓN DE ASIGNACIÓN =====');
      
      try {
        // Obtener información del responsable
        let responsableInfo = null;
        if (riesgo.codiIspector) {
          responsableInfo = await Responsable.findOne({ codiRespnsble: riesgo.codiIspector });
        } else if (riesgo.codiRespnsble) {
          responsableInfo = await Responsable.findOne({ codiRespnsble: riesgo.codiRespnsble });
        }
        
        console.log('👤 INFORMACIÓN DEL RESPONSABLE:', responsableInfo);
        
        // Obtener información del usuario que está haciendo la asignación
        // Por ahora usaremos información del token o datos por defecto
        const usuarioActual = req.user || { name: 'Sistema', email: 'sistema@proserpuertos.com.co' };
        
        // Preparar datos para la notificación
        const datosNotificacion = {
          numeroCaso: riesgo.nmroRiesgo || `Riesgo-${riesgo._id}`,
          nombreResponsable: responsableInfo?.nmbrRespnsble || 'Sin asignar',
          emailResponsable: responsableInfo?.email || null,
          aseguradora: riesgo.codiAsgrdra || 'No especificada',
          asegurado: riesgo.asgrBenfcro || 'No especificado',
          fechaAsignacion: riesgo.fchaAsgncion ? riesgo.fchaAsgncion.toLocaleDateString() : 'No especificada',
          quienAsigna: usuarioActual.name || 'Sistema',
          emailQuienAsigna: usuarioActual.email || null,
          observaciones: riesgo.observAsignacion || ''
        };
        
        console.log('📧 DATOS PARA NOTIFICACIÓN:', datosNotificacion);
        
        // Enviar notificación principal
        const resultadoEmail = await enviarNotificacionAsignacion(datosNotificacion);
        
        console.log('✅ NOTIFICACIÓN PRINCIPAL ENVIADA:', resultadoEmail);
        
        // Buscar y enviar notificación al funcionario de la aseguradora
        let resultadoEmailAseguradora = null;
        if (riesgo.codiAsgrdra) {
          try {
            const funcionarioAseguradora = await FuncionarioAseguradora.findOne({ 
              codiAsgrdra: riesgo.codiAsgrdra 
            });
            
            if (funcionarioAseguradora && funcionarioAseguradora.email) {
              console.log('👤 FUNCIONARIO ASEGURADORA ENCONTRADO:', funcionarioAseguradora);
              
              const datosNotificacionAseguradora = {
                numeroCaso: riesgo.nmroRiesgo || `Riesgo-${riesgo._id}`,
                nombreResponsable: responsableInfo?.nmbrRespnsble || 'Sin asignar',
                emailResponsable: responsableInfo?.email || null,
                telefonoResponsable: responsableInfo?.telefono || null,
                aseguradora: riesgo.codiAsgrdra || 'No especificada',
                asegurado: riesgo.asgrBenfcro || 'No especificado',
                fechaAsignacion: riesgo.fchaAsgncion ? riesgo.fchaAsgncion.toLocaleDateString() : 'No especificada',
                emailFuncionarioAseguradora: funcionarioAseguradora.email
              };
              
              console.log('📧 ENVIANDO NOTIFICACIÓN A ASEGURADORA:', datosNotificacionAseguradora);
              
              resultadoEmailAseguradora = await enviarNotificacionAseguradora(datosNotificacionAseguradora);
              
              console.log('✅ NOTIFICACIÓN A ASEGURADORA ENVIADA:', resultadoEmailAseguradora);
            } else {
              console.log('⚠️ No se encontró funcionario de aseguradora o no tiene email');
            }
          } catch (emailAseguradoraError) {
            console.error('❌ ERROR ENVIANDO NOTIFICACIÓN A ASEGURADORA:', emailAseguradoraError);
            resultadoEmailAseguradora = { error: emailAseguradoraError.message };
          }
        }
        
        // Devolver respuesta con información de ambos emails
        res.json({
          ...riesgo.toObject(),
          notificacionEnviada: true,
          emailInfo: resultadoEmail,
          emailAseguradora: resultadoEmailAseguradora
        });
        
      } catch (emailError) {
        console.error('❌ ERROR ENVIANDO NOTIFICACIÓN:', emailError);
        
        // Aún devolver el caso actualizado aunque falle el email
        res.json({
          ...riesgo.toObject(),
          notificacionEnviada: false,
          emailError: emailError.message
        });
      }
    } else {
      // No hubo cambios en la asignación, devolver respuesta normal
      res.json(riesgo);
    }
    
  } catch (err) {
    console.error('❌ ERROR ACTUALIZANDO RIESGO:', err);
    res.status(500).json({ error: 'Error al actualizar el riesgo' });
  }
};

export const eliminarRiesgo = async (req, res) => {
  try {
    const riesgo = await Riesgo.findByIdAndDelete(req.params.id);
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    res.json({ mensaje: 'Riesgo eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el riesgo' });
  }
};

export const buscarRiesgos = async (req, res) => {
  try {
    const filtros = {};
    Object.keys(req.query).forEach(key => {
      if (req.query[key]) filtros[key] = { $regex: req.query[key], $options: 'i' };
    });
    const riesgos = await Riesgo.find(filtros);
    res.json(riesgos);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar riesgos' });
  }
}; 