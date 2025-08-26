import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEdit, 
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaFolder,
  FaSync,
  FaExclamationCircle
} from 'react-icons/fa';
import useHistorial from '../hooks/useHistorial';
import { TIPOS_FORMULARIOS, ESTADOS_FORMULARIO } from '../services/historialService';

export default function HistorialFormularios() {
  const {
    formularios,
    cargando,
    error,
    filtros,
    estadisticas,
    aplicarFiltros,
    buscarFormularios,
    eliminarFormulario,
    descargarFormulario,
    obtenerFormulario,
    limpiarError,
    refrescarHistorial
  } = useHistorial();

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [exportando, setExportando] = useState({});
  const navigate = useNavigate();

  // Tipos de formularios disponibles
  const tiposFormularios = [
    { id: 'todos', nombre: 'Todos los Formularios', icono: '📋', color: 'bg-gray-500' },
    { id: TIPOS_FORMULARIOS.COMPLEX, nombre: 'Complex', icono: '🏢', color: 'bg-blue-500' },
    { id: TIPOS_FORMULARIOS.RIESGOS, nombre: 'Riesgos', icono: '⚠️', color: 'bg-red-500' },
    { id: TIPOS_FORMULARIOS.POL, nombre: 'POL', icono: '📄', color: 'bg-green-500' },
    { id: TIPOS_FORMULARIOS.INSPECCION, nombre: 'Inspección', icono: '🔍', color: 'bg-yellow-500' },
    { id: TIPOS_FORMULARIOS.MAQUINARIA, nombre: 'Maquinaria', icono: '⚙️', color: 'bg-purple-500' },
    { id: TIPOS_FORMULARIOS.SINIESTROS, nombre: 'Siniestros', icono: '🚨', color: 'bg-orange-500' },
    { id: TIPOS_FORMULARIOS.AJUSTE, nombre: 'Ajuste', icono: '📊', color: 'bg-indigo-500' }
  ];

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros({ tipo: filtroTipo });
  }, [filtroTipo, aplicarFiltros]);



  // Filtrar formularios por búsqueda
  const formulariosFiltrados = formularios.filter(formulario => {
    const cumpleBusqueda = formulario.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           (formulario.nombreUsuario || formulario.usuario || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                           (formulario.carpetaCaso || '').toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleBusqueda;
  });

  // Función para exportar formulario (guardar cambios y descargar)
  const handleExportarFormulario = async (formulario) => {
    try {
      // Verificar si el formulario tiene archivo
      if (!formulario.archivo || !formulario.archivo.nombre) {
        alert('❌ Este formulario no tiene archivo adjunto para exportar');
        return;
      }
      
      console.log('📤 Iniciando exportación de:', formulario.archivo.nombre);
      console.log('🔍 Información del archivo:', formulario.archivo);
      
      // Mostrar indicador de carga
      setExportando(prev => ({ ...prev, [formulario.id]: true }));
      
      // Primero guardar/actualizar el formulario
      await guardarFormulario(formulario);
      
      // Luego descargar el archivo actualizado
      await descargarFormulario(formulario.id);
      
      // Mostrar mensaje de éxito
      alert(`✅ Exportación completada: ${formulario.archivo.nombre}\n\nEl formulario ha sido guardado y descargado exitosamente.`);
      
    } catch (error) {
      console.error('Error en exportación:', error);
      
      // Mensaje de error más específico y útil
      let mensajeError = 'Error al exportar el formulario';
      
      if (error.message.includes('500')) {
        mensajeError = '❌ Error del servidor: No se pudo procesar la exportación.\n\nPosibles causas:\n• Error al guardar los cambios\n• Problema con el archivo\n• Error en la base de datos';
      } else if (error.message.includes('404')) {
        mensajeError = '❌ Formulario no encontrado en el servidor.';
      } else if (error.message.includes('401')) {
        mensajeError = '❌ Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.message.includes('403')) {
        mensajeError = '❌ No tienes permisos para exportar este formulario.';
      } else if (error.message.includes('NetworkError')) {
        mensajeError = '❌ Error de conexión. Verifica tu conexión a internet.';
      } else {
        mensajeError = `❌ Error al exportar: ${error.message}`;
      }
      
      alert(mensajeError);
      
    } finally {
      // Ocultar indicador de carga
      setExportando(prev => ({ ...prev, [formulario.id]: false }));
    }
  };

  // Función para editar formulario
  const handleEditarFormulario = async (formulario) => {
    try {
      console.log('🔍 Obteniendo formulario para editar:', formulario.id);
      
      const formularioCompleto = await obtenerFormulario(formulario.id);
      console.log('✅ Formulario obtenido para editar:', formularioCompleto);
      
      // Redirección según el tipo de formulario
      let rutaEdicion = '';
      let mensajeInfo = '';
      
      switch (formulario.tipo) {
        case 'complex':
          rutaEdicion = `/editar-caso/${formulario.id}`;
          mensajeInfo = '🏢 Redirigiendo al editor de Complex...';
          break;
        case 'riesgos':
          rutaEdicion = `/riesgos/editar/${formulario.id}`;
          mensajeInfo = '⚠️ Redirigiendo al editor de Riesgos...';
          break;
        case 'pol':
          rutaEdicion = `/reporte-pol`;
          mensajeInfo = '📄 Redirigiendo al formulario POL (modo creación)...';
          break;
        case 'inspeccion':
          rutaEdicion = `/formularioinspeccion/editar/${formulario.id}`;
          mensajeInfo = '🔍 Redirigiendo al formulario de Inspección (modo edición)...';
          break;
        case 'maquinaria':
          rutaEdicion = `/formulario-maquinaria/editar/${formulario.id}`;
          mensajeInfo = '⚙️ Redirigiendo al formulario de Maquinaria (modo edición)...';
          break;
        case 'siniestros':
          rutaEdicion = `/siniestros`;
          mensajeInfo = '🚨 Redirigiendo a la lista de Siniestros...';
          break;
        case 'ajuste':
          rutaEdicion = `/ajuste/editar/${formulario.id}`;
          mensajeInfo = '📊 Redirigiendo al formulario de Ajuste (modo edición)...';
          break;
        default:
          rutaEdicion = `/inicio`;
          mensajeInfo = '🏠 Redirigiendo al inicio...';
      }
      
      // Mostrar mensaje informativo antes de redirigir
      alert(`${mensajeInfo}\n\nFormulario: ${formulario.titulo}\nTipo: ${formulario.tipo.toUpperCase()}`);
      
      // Redirección real usando React Router
      navigate(rutaEdicion);
    } catch (error) {
      console.error('❌ Error al obtener formulario para editar:', error);
      
      let mensajeError = 'Error al obtener formulario para editar';
      
      if (error.message.includes('401')) {
        mensajeError = '❌ Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.message.includes('404')) {
        mensajeError = '❌ Formulario no encontrado en el servidor.';
      } else if (error.message.includes('500')) {
        mensajeError = '❌ Error del servidor. Intenta nuevamente más tarde.';
      } else if (error.message.includes('NetworkError')) {
        mensajeError = '❌ Error de conexión. Verifica tu conexión a internet.';
      } else {
        mensajeError = `❌ Error: ${error.message}`;
      }
      
      alert(mensajeError);
    }
  };

  // Función para eliminar formulario
  const handleEliminarFormulario = async (formulario) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${formulario.titulo}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        await eliminarFormulario(formulario.id);
        alert(`🗑️ Formulario eliminado: ${formulario.titulo}`);
      } catch (error) {
        alert(`❌ Error al eliminar: ${error.message}`);
      }
    }
  };

  // Estado para el modal de detalles
  const [modalDetalles, setModalDetalles] = useState({ visible: false, formulario: null });

  // Función para ver detalles del formulario
  const handleVerDetalles = async (formulario) => {
    try {
      console.log('🔍 Obteniendo detalles del formulario:', formulario.id);
      
      // Mostrar indicador de carga
      setModalDetalles({ visible: true, formulario: null });
      
      // Obtener formulario completo
      const formularioCompleto = await obtenerFormulario(formulario.id);
      
      console.log('✅ Formulario completo obtenido:', formularioCompleto);
      
      // Validar que el formulario tenga la estructura esperada
      if (!formularioCompleto || typeof formularioCompleto !== 'object') {
        throw new Error('Formulario no válido recibido del servidor');
      }
      
      // Actualizar modal con el formulario completo
      setModalDetalles({ visible: true, formulario: formularioCompleto });
      
    } catch (error) {
      console.error('❌ Error obteniendo detalles:', error);
      
      // Cerrar modal en caso de error
      setModalDetalles({ visible: false, formulario: null });
      
      // Mostrar mensaje de error más específico
      let mensajeError = 'Error al obtener detalles del formulario';
      
      if (error.message.includes('401')) {
        mensajeError = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.message.includes('404')) {
        mensajeError = 'Formulario no encontrado en el servidor.';
      } else if (error.message.includes('500')) {
        mensajeError = 'Error del servidor. Intenta nuevamente más tarde.';
      } else if (error.message.includes('NetworkError')) {
        mensajeError = 'Error de conexión. Verifica tu conexión a internet.';
      } else {
        mensajeError = `Error: ${error.message}`;
      }
      
      alert(`❌ ${mensajeError}`);
    }
  };

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalDetalles({ visible: false, formulario: null });
  };

  // Función para ver formularios de la misma carpeta
  const handleVerCarpeta = async (casoId) => {
    try {
      console.log('📁 Obteniendo formularios de la carpeta:', casoId);
      
      // Navegar a la ruta de ajuste con el casoId
      navigate(`/ajuste?casoId=${casoId}`);
      
    } catch (error) {
      console.error('❌ Error navegando a la carpeta:', error);
      alert('❌ Error al abrir la carpeta del formulario');
    }
  };

  // Función para obtener el color del estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case ESTADOS_FORMULARIO.COMPLETADO: return 'bg-green-100 text-green-800 border-green-200';
      case ESTADOS_FORMULARIO.EN_PROCESO: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ESTADOS_FORMULARIO.PENDIENTE: return 'bg-red-100 text-red-800 border-red-200';
      case ESTADOS_FORMULARIO.BORRADOR: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el nombre del estado
  const getNombreEstado = (estado) => {
    switch (estado) {
      case ESTADOS_FORMULARIO.COMPLETADO: return 'Completado';
      case ESTADOS_FORMULARIO.EN_PROCESO: return 'En Proceso';
      case ESTADOS_FORMULARIO.PENDIENTE: return 'Pendiente';
      case ESTADOS_FORMULARIO.BORRADOR: return 'Borrador';
      default: return 'Desconocido';
    }
  };

  // Función para manejar búsqueda
  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    
    if (valor.trim()) {
      buscarFormularios(valor);
    } else {
      refrescarHistorial();
    }
  };

  if (cargando && formularios.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historial de formularios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Historial de Formularios
              </h1>
              <p className="mt-2 text-gray-600">
                Gestiona y accede a todos los formularios generados en el sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={refrescarHistorial}
                disabled={cargando}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FaSync className={`h-4 w-4 mr-2 ${cargando ? 'animate-spin' : ''}`} />
                Refrescar
              </button>
              <Link
                to="/inicio"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ← Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <FaExclamationCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar el historial
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
              <button
                onClick={limpiarError}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tiposFormularios.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.icono} {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Formularios
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={handleBusqueda}
                placeholder="Buscar por título o usuario..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Estadísticas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de Formularios
              </label>
              <div className="text-2xl font-bold text-blue-600">
                {formulariosFiltrados.length}
              </div>
              <p className="text-sm text-gray-500">
                de {formularios.length} total
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Formularios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Formularios Encontrados
              {cargando && (
                <span className="ml-2 text-sm text-gray-500">
                  (Actualizando...)
                </span>
              )}
            </h3>
          </div>

          {formulariosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FaFolder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron formularios
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filtroTipo !== 'todos' 
                  ? `No hay formularios del tipo "${tiposFormularios.find(t => t.id === filtroTipo)?.nombre}"`
                  : busqueda 
                    ? `No hay formularios que coincidan con "${busqueda}"`
                    : 'No hay formularios en el sistema'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {formulariosFiltrados.map((formulario) => (
                <div key={formulario.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${tiposFormularios.find(t => t.id === formulario.tipo)?.color} text-white`}>
                          {tiposFormularios.find(t => t.id === formulario.tipo)?.icono}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            {formulario.titulo}
                          </h4>
                          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaUser className="h-4 w-4 mr-1" />
                              {formulario.nombreUsuario || formulario.usuario}
                            </div>
                            <div className="flex items-center">
                              <FaCalendarAlt className="h-4 w-4 mr-1" />
                              Creado: {new Date(formulario.fechaCreacion).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FaFileAlt className="h-4 w-4 mr-1" />
                              {formulario.archivo?.nombre || 'Sin archivo'}
                            </div>
                            {formulario.carpetaCaso && (
                              <div className="flex items-center">
                                <FaFolder className="h-4 w-4 mr-1" />
                                {formulario.carpetaCaso}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Estado */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstado(formulario.estado)}`}>
                        {getNombreEstado(formulario.estado)}
                      </span>

                      {/* Botones de acción */}
                      <button
                        onClick={() => handleVerDetalles(formulario)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>

                                             <button
                         onClick={() => handleExportarFormulario(formulario)}
                         disabled={exportando[formulario.id]}
                         className={`p-2 text-gray-400 hover:text-green-600 transition-colors duration-200 ${
                           exportando[formulario.id] ? 'opacity-50 cursor-not-allowed' : ''
                         }`}
                         title={exportando[formulario.id] ? 'Exportando...' : 'Exportar y Descargar'}
                       >
                         {exportando[formulario.id] ? (
                           <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                         ) : (
                           <FaFileAlt className="h-5 w-5" />
                         )}
                       </button>

                                                                   <button
                        onClick={() => handleEditarFormulario(formulario)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title={`Editar formulario ${formulario.tipo}`}
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>

                      {formulario.casoId && (
                        <button
                          onClick={() => handleVerCarpeta(formulario.casoId)}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                          title="Ver formularios de la misma carpeta"
                        >
                          <FaFolder className="h-5 w-5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleEliminarFormulario(formulario)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalDetalles.visible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  📋 Detalles del Formulario
                </h3>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {/* Indicador de carga o contenido del formulario */}
              {!modalDetalles.formulario ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando detalles del formulario...</p>
                  </div>
                </div>
              ) : (
              <div className="space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {modalDetalles.formulario.titulo || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <p className="mt-1 text-sm text-gray-900 uppercase">
                      {modalDetalles.formulario.tipo || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {modalDetalles.formulario.usuario || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstado(modalDetalles.formulario.estado)}`}>
                      {getNombreEstado(modalDetalles.formulario.estado)}
                    </span>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {modalDetalles.formulario.fechaCreacion 
                        ? new Date(modalDetalles.formulario.fechaCreacion).toLocaleString() 
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Última Modificación</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {modalDetalles.formulario.fechaModificacion 
                        ? new Date(modalDetalles.formulario.fechaModificacion).toLocaleString() 
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {/* Archivo - Con validación robusta */}
                {modalDetalles.formulario.archivo && typeof modalDetalles.formulario.archivo === 'object' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Archivo</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-900">
                        <strong>Nombre:</strong> {modalDetalles.formulario.archivo.nombre || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Tipo:</strong> {modalDetalles.formulario.archivo.tipoMime || 'N/A'}
                      </p>
                      {modalDetalles.formulario.archivo.tamaño && (
                        <p className="text-sm text-gray-600">
                          <strong>Tamaño:</strong> {(modalDetalles.formulario.archivo.tamaño / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata - Con validación robusta */}
                {modalDetalles.formulario.metadata && typeof modalDetalles.formulario.metadata === 'object' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Metadata</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><strong>Versión:</strong> {modalDetalles.formulario.metadata.version || 'N/A'}</p>
                        <p><strong>Creado por:</strong> {modalDetalles.formulario.metadata.creadoPor || 'N/A'}</p>
                        <p><strong>Modificado por:</strong> {modalDetalles.formulario.metadata.modificadoPor || 'N/A'}</p>
                        <p><strong>Prioridad:</strong> {modalDetalles.formulario.metadata.prioridad || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Datos del formulario - Con validación robusta */}
                {modalDetalles.formulario.datos && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Datos del Formulario</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {typeof modalDetalles.formulario.datos === 'object' 
                          ? JSON.stringify(modalDetalles.formulario.datos, null, 2)
                          : String(modalDetalles.formulario.datos)
                        }
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              )}
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={cerrarModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cerrar
                </button>
                                 <button
                   onClick={() => {
                     cerrarModal();
                     handleExportarFormulario(modalDetalles.formulario);
                   }}
                   className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                 >
                   📤 Exportar
                 </button>
                 <button
                   onClick={() => {
                     cerrarModal();
                     handleEditarFormulario(modalDetalles.formulario);
                   }}
                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                 >
                   ✏️ Editar
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
