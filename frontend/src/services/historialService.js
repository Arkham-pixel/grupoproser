// Servicio para manejar el historial de formularios
import { BASE_URL } from '../config/apiConfig.js';

// Tipos de formularios disponibles
export const TIPOS_FORMULARIOS = {
  COMPLEX: 'complex',
  RIESGOS: 'riesgos',
  POL: 'pol',
  INSPECCION: 'inspeccion',
  MAQUINARIA: 'maquinaria',
  SINIESTROS: 'siniestros'
};

// Estados de formularios
export const ESTADOS_FORMULARIO = {
  COMPLETADO: 'completado',
  EN_PROCESO: 'en_proceso',
  PENDIENTE: 'pendiente',
  BORRADOR: 'borrador'
};

class HistorialService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Obtener todos los formularios del historial con filtros
  async obtenerHistorial(filtros = {}) {
    try {
      console.log('🔍 Obteniendo historial con filtros:', filtros);
      console.log('🌐 URL base:', this.baseURL);
      
      const queryParams = new URLSearchParams();
      
      if (filtros.tipo && filtros.tipo !== 'todos') {
        queryParams.append('tipo', filtros.tipo);
      }
      
      if (filtros.usuario) {
        queryParams.append('usuario', filtros.usuario);
      }
      
      if (filtros.fechaDesde) {
        queryParams.append('fechaDesde', filtros.fechaDesde);
      }
      
      if (filtros.fechaHasta) {
        queryParams.append('fechaHasta', filtros.fechaHasta);
      }
      
      if (filtros.estado) {
        queryParams.append('estado', filtros.estado);
      }

      const url = `${this.baseURL}/api/historial-formularios?${queryParams.toString()}`;
      console.log('📡 Haciendo request a:', url);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token disponible:', token ? 'SÍ' : 'NO');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos:', data);
      return data.formularios || [];
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw error;
    }
  }

  // Guardar un nuevo formulario en el historial
  async guardarFormulario(formulario) {
    try {
      console.log('💾 Guardando formulario:', formulario);
      console.log('🌐 URL base:', this.baseURL);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token disponible:', token ? 'SÍ' : 'NO');
      
      const url = `${this.baseURL}/api/historial-formularios`;
      console.log('📡 Haciendo POST a:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formulario)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Formulario guardado:', data);
      return data.formulario;
    } catch (error) {
      console.error('❌ Error guardando formulario:', error);
      throw error;
    }
  }

  // Actualizar un formulario existente
  async actualizarFormulario(id, datos) {
    try {
      const response = await fetch(`${this.baseURL}/api/historial-formularios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.formulario;
    } catch (error) {
      console.error('Error actualizando formulario:', error);
      throw error;
    }
  }

  // Eliminar un formulario del historial
  async eliminarFormulario(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/historial-formularios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error eliminando formulario:', error);
      throw error;
    }
  }

  // Obtener un formulario específico por ID
  async obtenerFormulario(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/historial-formularios/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.formulario;
    } catch (error) {
      console.error('Error obteniendo formulario:', error);
      throw error;
    }
  }

  // Descargar un formulario
  async descargarFormulario(id) {
    try {
      console.log('📥 Iniciando descarga del formulario:', id);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const url = `${this.baseURL}/api/historial-formularios/${id}/descargar`;
      console.log('🌐 URL de descarga:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);
      console.log('📥 Content-Type:', response.headers.get('content-type'));

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        
        // Intentar obtener más detalles del error
        try {
          const errorText = await response.text();
          console.error('❌ Error response body:', errorText);
          
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorText;
            } catch {
              errorMessage = `${errorMessage}: ${errorText}`;
            }
          }
        } catch (e) {
          console.error('❌ No se pudo leer el body del error:', e);
        }
        
        throw new Error(errorMessage);
      }

      // Verificar que la respuesta sea un archivo
      const contentType = response.headers.get('content-type');
      if (!contentType || contentType.includes('application/json')) {
        console.warn('⚠️ La respuesta no parece ser un archivo, content-type:', contentType);
      }

      const blob = await response.blob();
      console.log('📦 Blob recibido:', blob);
      console.log('📦 Tamaño del blob:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }

      // Obtener nombre del archivo del header o usar uno por defecto
      let filename = 'formulario.docx';
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      console.log('📁 Nombre del archivo:', filename);

      // Crear y descargar el archivo
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      console.log('✅ Descarga completada exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error descargando formulario:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  // Buscar formularios por texto
  async buscarFormularios(texto) {
    try {
      const response = await fetch(`${this.baseURL}/api/historial-formularios/buscar?q=${encodeURIComponent(texto)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.formularios || [];
    } catch (error) {
      console.error('Error buscando formularios:', error);
      throw error;
    }
  }

  // Obtener estadísticas del historial
  async obtenerEstadisticas() {
    try {
      const response = await fetch(`${this.baseURL}/api/historial-formularios/estadisticas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.estadisticas || {};
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Función helper para crear un objeto de formulario
  crearFormulario(tipo, titulo, datos, archivo, estado = ESTADOS_FORMULARIO.COMPLETADO) {
    return {
      tipo,
      titulo,
      usuario: localStorage.getItem('nombre') || 'Usuario',
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
      estado,
      archivo,
      datos,
      metadata: {
        version: '1.0',
        creadoPor: localStorage.getItem('userId') || 'unknown',
        modificadoPor: localStorage.getItem('userId') || 'unknown'
      }
    };
  }

  // Función helper para validar un formulario
  validarFormulario(formulario) {
    const errores = [];

    if (!formulario.tipo) {
      errores.push('El tipo de formulario es requerido');
    }

    if (!formulario.titulo) {
      errores.push('El título es requerido');
    }

    if (!formulario.archivo) {
      errores.push('El archivo es requerido');
    }

    if (!formulario.datos) {
      errores.push('Los datos del formulario son requeridos');
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  }
}

// Crear instancia del servicio
const historialService = new HistorialService();

export default historialService;
