import HistorialFormulario from '../models/HistorialFormulario.js';
import fs from 'fs/promises';
import path from 'path';

class HistorialController {
  // Obtener todos los formularios del historial con filtros
  async obtenerHistorial(req, res) {
    try {
      const {
        tipo,
        usuario,
        fechaDesde,
        fechaHasta,
        estado,
        pagina = 1,
        limite = 50,
        ordenar = 'fechaCreacion',
        direccion = 'desc'
      } = req.query;

      // Construir filtros
      const filtros = {};
      
      if (tipo && tipo !== 'todos') {
        filtros.tipo = tipo;
      }
      
      if (usuario) {
        filtros.usuario = { $regex: usuario, $options: 'i' };
      }
      
      if (estado) {
        filtros.estado = estado;
      }
      
      if (fechaDesde || fechaHasta) {
        filtros.fechaCreacion = {};
        if (fechaDesde) {
          filtros.fechaCreacion.$gte = new Date(fechaDesde);
        }
        if (fechaHasta) {
          filtros.fechaCreacion.$lte = new Date(fechaHasta);
        }
      }

      // Configurar paginación
      const skip = (parseInt(pagina) - 1) * parseInt(limite);
      const orden = {};
      orden[ordenar] = direccion === 'desc' ? -1 : 1;

      // Ejecutar consulta
      const [formularios, total] = await Promise.all([
        HistorialFormulario.find(filtros)
          .sort(orden)
          .skip(skip)
          .limit(parseInt(limite))
          .select('-__v -eliminado'),
        HistorialFormulario.countDocuments(filtros)
      ]);

      res.json({
        success: true,
        formularios,
        paginacion: {
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          total,
          paginas: Math.ceil(total / parseInt(limite))
        }
      });
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener un formulario específico por ID
  async obtenerFormulario(req, res) {
    try {
      const { id } = req.params;
      
      const formulario = await HistorialFormulario.findById(id)
        .select('-__v -eliminado');
      
      if (!formulario) {
        return res.status(404).json({
          success: false,
          error: 'Formulario no encontrado'
        });
      }

      res.json({
        success: true,
        formulario
      });
    } catch (error) {
      console.error('Error obteniendo formulario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Crear un nuevo formulario en el historial
  async crearFormulario(req, res) {
    try {
      const {
        tipo,
        titulo,
        estado = 'completado',
        archivo,
        datos,
        metadata = {}
      } = req.body;

      // Validar campos requeridos
      if (!tipo || !titulo || !datos) {
        return res.status(400).json({
          success: false,
          error: 'Los campos tipo, titulo y datos son requeridos'
        });
      }

      // Crear el formulario
      const nuevoFormulario = new HistorialFormulario({
        tipo,
        titulo,
        usuario: req.user?.nombre || 'Usuario',
        userId: req.user?.id || 'unknown',
        estado,
        archivo: {
          nombre: archivo?.nombre || `${tipo}_${Date.now()}.docx`,
          ruta: archivo?.ruta || `/uploads/${tipo}/${Date.now()}.docx`,
          tamaño: archivo?.tamaño,
          tipoMime: archivo?.tipoMime || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        datos,
        metadata: {
          version: metadata.version || '1.0',
          creadoPor: req.user?.id || 'unknown',
          modificadoPor: req.user?.id || 'unknown',
          tags: metadata.tags || [],
          categoria: metadata.categoria,
          prioridad: metadata.prioridad || 'media'
        },
        auditoria: {
          ipCreacion: req.ip,
          userAgentCreacion: req.get('User-Agent')
        }
      });

      await nuevoFormulario.save();

      res.status(201).json({
        success: true,
        formulario: nuevoFormulario
      });
    } catch (error) {
      console.error('Error creando formulario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Actualizar un formulario existente
  async actualizarFormulario(req, res) {
    try {
      const { id } = req.params;
      const datosActualizacion = req.body;

      const formulario = await HistorialFormulario.findById(id);
      
      if (!formulario) {
        return res.status(404).json({
          success: false,
          error: 'Formulario no encontrado'
        });
      }

      // Guardar versión anterior si hay cambios significativos
      if (datosActualizacion.datos && JSON.stringify(datosActualizacion.datos) !== JSON.stringify(formulario.datos)) {
        await formulario.crearVersion(
          req.user?.nombre || 'Usuario',
          'Actualización de datos',
          formulario.datos
        );
      }

      // Actualizar campos
      Object.keys(datosActualizacion).forEach(campo => {
        if (campo !== '_id' && campo !== 'fechaCreacion') {
          formulario[campo] = datosActualizacion[campo];
        }
      });

      // Actualizar metadata de auditoría
      formulario.metadata.modificadoPor = req.user?.id || 'unknown';
      formulario.auditoria.ipModificacion = req.ip;
      formulario.auditoria.userAgentModificacion = req.get('User-Agent');

      await formulario.save();

      res.json({
        success: true,
        formulario
      });
    } catch (error) {
      console.error('Error actualizando formulario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Eliminar un formulario (soft delete)
  async eliminarFormulario(req, res) {
    try {
      const { id } = req.params;
      
      const formulario = await HistorialFormulario.findById(id);
      
      if (!formulario) {
        return res.status(404).json({
          success: false,
          error: 'Formulario no encontrado'
        });
      }

      await formulario.softDelete(req.user?.nombre || 'Usuario');

      res.json({
        success: true,
        mensaje: 'Formulario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando formulario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Buscar formularios por texto
  async buscarFormularios(req, res) {
    try {
      const { q: texto } = req.query;
      
      if (!texto || texto.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'El término de búsqueda debe tener al menos 2 caracteres'
        });
      }

      const formularios = await HistorialFormulario.buscarPorTexto(texto.trim());

      res.json({
        success: true,
        formularios,
        total: formularios.length
      });
    } catch (error) {
      console.error('Error buscando formularios:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener estadísticas del historial
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await HistorialFormulario.obtenerEstadisticas();
      
      // Calcular totales generales
      const totales = estadisticas.reduce((acc, stat) => {
        acc.total += stat.total;
        acc.completados += stat.completados;
        acc.enProceso += stat.enProceso;
        acc.pendientes += stat.pendientes;
        return acc;
      }, { total: 0, completados: 0, enProceso: 0, pendientes: 0 });

      res.json({
        success: true,
        estadisticas: {
          porTipo: estadisticas,
          totales
        }
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Descargar un formulario
  async descargarFormulario(req, res) {
    try {
      const { id } = req.params;
      
      const formulario = await HistorialFormulario.findById(id);
      
      if (!formulario) {
        return res.status(404).json({
          success: false,
          error: 'Formulario no encontrado'
        });
      }

      // Verificar si el archivo existe
      const rutaArchivo = path.join(__dirname, '..', formulario.archivo.ruta);
      
      try {
        await fs.access(rutaArchivo);
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: 'Archivo no encontrado en el servidor'
        });
      }

      // Configurar headers para descarga
      res.setHeader('Content-Type', formulario.archivo.tipoMime);
      res.setHeader('Content-Disposition', `attachment; filename="${formulario.archivo.nombre}"`);
      
      // Enviar archivo
      res.sendFile(rutaArchivo);
    } catch (error) {
      console.error('Error descargando formulario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Agregar comentario a un formulario
  async agregarComentario(req, res) {
    try {
      const { id } = req.params;
      const { texto, tipo = 'general' } = req.body;
      
      if (!texto || texto.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'El texto del comentario es requerido'
        });
      }

      const formulario = await HistorialFormulario.findById(id);
      
      if (!formulario) {
        return res.status(404).json({
          success: false,
          error: 'Formulario no encontrado'
        });
      }

      await formulario.agregarComentario(
        req.user?.nombre || 'Usuario',
        texto.trim(),
        tipo
      );

      res.json({
        success: true,
        mensaje: 'Comentario agregado exitosamente',
        comentarios: formulario.comentarios
      });
    } catch (error) {
      console.error('Error agregando comentario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Archivar un formulario
  async archivarFormulario(req, res) {
    try {
      const { id } = req.params;
      
      const formulario = await HistorialFormulario.findById(id);
      
      if (!formulario) {
        return res.status(404).json({
          success: false,
          error: 'Formulario no encontrado'
        });
      }

      if (formulario.archivado) {
        return res.status(400).json({
          success: false,
          error: 'El formulario ya está archivado'
        });
      }

      await formulario.archivar();

      res.json({
        success: true,
        mensaje: 'Formulario archivado exitosamente'
      });
    } catch (error) {
      console.error('Error archivando formulario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

export default new HistorialController();
