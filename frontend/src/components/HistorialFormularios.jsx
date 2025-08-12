import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Tipos de formularios disponibles
  const tiposFormularios = [
    { id: 'todos', nombre: 'Todos los Formularios', icono: '📋', color: 'bg-gray-500' },
    { id: TIPOS_FORMULARIOS.COMPLEX, nombre: 'Complex', icono: '🏢', color: 'bg-blue-500' },
    { id: TIPOS_FORMULARIOS.RIESGOS, nombre: 'Riesgos', icono: '⚠️', color: 'bg-red-500' },
    { id: TIPOS_FORMULARIOS.POL, nombre: 'POL', icono: '📄', color: 'bg-green-500' },
    { id: TIPOS_FORMULARIOS.INSPECCION, nombre: 'Inspección', icono: '🔍', color: 'bg-yellow-500' },
    { id: TIPOS_FORMULARIOS.MAQUINARIA, nombre: 'Maquinaria', icono: '⚙️', color: 'bg-purple-500' },
    { id: TIPOS_FORMULARIOS.SINIESTROS, nombre: 'Siniestros', icono: '🚨', color: 'bg-orange-500' }
  ];

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros({ tipo: filtroTipo });
  }, [filtroTipo, aplicarFiltros]);

  // Filtrar formularios por búsqueda
  const formulariosFiltrados = formularios.filter(formulario => {
    const cumpleBusqueda = formulario.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           formulario.usuario.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleBusqueda;
  });

  // Función para descargar formulario
  const handleDescargarFormulario = async (formulario) => {
    try {
      await descargarFormulario(formulario.id);
      alert(`📥 Descargando: ${formulario.archivo}`);
    } catch (error) {
      alert(`❌ Error al descargar: ${error.message}`);
    }
  };

  // Función para editar formulario
  const handleEditarFormulario = async (formulario) => {
    try {
      const formularioCompleto = await obtenerFormulario(formulario.id);
      console.log('Formulario para editar:', formularioCompleto);
      
      // Aquí se implementaría la lógica de redirección a la edición
      alert(`✏️ Editando: ${formulario.titulo}\n\nRedirigiendo al formulario...`);
      
      // Ejemplo de redirección (ajustar según tus rutas)
      // window.location.href = `/editar/${formulario.tipo}/${formulario.id}`;
    } catch (error) {
      alert(`❌ Error al obtener formulario: ${error.message}`);
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

  // Función para ver detalles del formulario
  const handleVerDetalles = async (formulario) => {
    try {
      const formularioCompleto = await obtenerFormulario(formulario.id);
      
      const detalles = `
📋 DETALLES DEL FORMULARIO

Título: ${formularioCompleto.titulo}
Tipo: ${formularioCompleto.tipo.toUpperCase()}
Usuario: ${formularioCompleto.usuario}
Fecha de Creación: ${new Date(formularioCompleto.fechaCreacion).toLocaleString()}
Última Modificación: ${new Date(formularioCompleto.fechaModificacion).toLocaleString()}
Estado: ${formularioCompleto.estado}
Archivo: ${formularioCompleto.archivo}

Datos adicionales: ${JSON.stringify(formularioCompleto.datos, null, 2)}

Metadata:
- Versión: ${formularioCompleto.metadata?.version || 'N/A'}
- Creado por: ${formularioCompleto.metadata?.creadoPor || 'N/A'}
- Modificado por: ${formularioCompleto.metadata?.modificadoPor || 'N/A'}
      `;
      
      alert(detalles);
    } catch (error) {
      alert(`❌ Error al obtener detalles: ${error.message}`);
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
                              {formulario.usuario}
                            </div>
                            <div className="flex items-center">
                              <FaCalendarAlt className="h-4 w-4 mr-1" />
                              Creado: {new Date(formulario.fechaCreacion).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FaFileAlt className="h-4 w-4 mr-1" />
                              {formulario.archivo}
                            </div>
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
                        onClick={() => handleDescargarFormulario(formulario)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Descargar"
                      >
                        <FaDownload className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleEditarFormulario(formulario)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Editar"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>

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
    </div>
  );
}
