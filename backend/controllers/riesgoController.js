import Riesgo from '../models/CasoRiesgo.js';

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
    
    res.status(201).json({
      success: true,
      message: `Caso de riesgo #${nuevoNumero} creado exitosamente`,
      riesgo: nuevoRiesgo
    });
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
    const riesgo = await Riesgo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!riesgo) return res.status(404).json({ error: 'Riesgo no encontrado' });
    res.json(riesgo);
  } catch (err) {
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