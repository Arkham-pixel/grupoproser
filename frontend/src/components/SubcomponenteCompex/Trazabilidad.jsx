import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BASE_URL } from '../../config/apiConfig.js';

const tiposSolicitud = [
  { value: 'anexo_solicitud_documento', label: 'Anexo de la Solicitud de Documento' },
  { value: 'acta_inspeccion', label: 'Acta de Inspección' },
  { value: 'informe_preliminar', label: 'Informe Preliminar' },
  { value: 'informe_final', label: 'Informe Final' },
  { value: 'adjunto_contacto_inicial', label: 'Adjuntos Contacto Inicial' },
  { value: 'adjunto_ultimo_documento', label: 'Adjunto Entrega Último Documento' },
  { value: 'observaciones_contacto_inicial', label: 'Observaciones Contacto Inicial' },
  { value: 'observacion_inspeccion', label: 'Observaciones de la Inspección' },
  { value: 'observacion_solicitud_documento', label: 'Observaciones Solicitud de Documentos' },
  { value: 'observacion_informe_preliminar', label: 'Observaciones Informe Preliminar' },
  { value: 'observacion_informe_final', label: 'Observaciones Informe Final' },
  { value: 'fecha_contacto_inicial', label: 'Fecha Contacto Inicial' },
  { value: 'fecha_inspeccion', label: 'Fecha de Inspección' },
  { value: 'fecha_solicitud_documentos', label: 'Fecha Solicitud de Documentos' },
  { value: 'fecha_informe_preliminar', label: 'Fecha Informe Preliminar' },
  { value: 'fecha_informe_final', label: 'Fecha Informe Final' },
  { value: 'fecha_ultimo_documento', label: 'Fecha Último Documento' },
  { value: 'fecha_ultimo_seguimiento', label: 'Fecha Último Seguimiento' },
  { value: 'observacion_seguimiento_pendientes', label: 'Observación de Seguimiento y Pendientes' },
  // Agrega aquí más tipos si lo necesitas
];

export default function Trazabilidad({
  formData,
  handleChange,
  getRootPropsContacto,
  getInputPropsContacto,
  isDragActiveContacto,
  getRootPropsInspeccion,
  getInputPropsInspeccion,
  isDragActiveInspeccion,
  getRootPropsSolicitudDocs,
  getInputPropsSolicitudDocs,
  isDragActiveSolicitudDocs,
  getRootPropsInformePreliminar,
  getInputPropsInformePreliminar,
  isDragActiveInformePreliminar,
  getRootPropsInformeFinal,
  getInputPropsInformeFinal,
  isDragActiveInformeFinal,
  getRootPropsUltimoDocumento,
  getInputPropsUltimoDocumento,
  isDragActiveUltimoDocumento,
  historialDocs,
  setHistorialDocs
}) {
  // Estado para modal y documentos
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [busquedaTipo, setBusquedaTipo] = useState('');
  const [comentario, setComentario] = useState('');
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(false);

  // Abrir/cerrar modal
  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => {
    setModalAbierto(false);
    setTipoSeleccionado('');
    setArchivoSeleccionado(null);
    setBusquedaTipo('');
    setComentario('');
    setMostrarListaCompleta(false);
  };

  // Manejar selección de tipo
  const handleTipoChange = (e) => setTipoSeleccionado(e.target.value);

  // Manejar selección de archivo
  const handleArchivoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoSeleccionado(e.target.files[0]);
    }
  };

  // Filtrar tipos de solicitud basado en la búsqueda
  const tiposFiltrados = tiposSolicitud.filter(tipo =>
    tipo.label.toLowerCase().includes(busquedaTipo.toLowerCase())
  );

  // Manejar carga de documento
  const handleCargarDocumento = async () => {
    if (!tipoSeleccionado || !archivoSeleccionado) return;
    const fecha = new Date().toISOString().split('T')[0];

    console.log('📤 Iniciando subida de documento...');
    console.log('📄 Archivo:', archivoSeleccionado.name);
    console.log('🏷️ Tipo:', tipoSeleccionado);

    // 1. Subir el archivo al backend
    const formDataFile = new FormData();
    formDataFile.append('file', archivoSeleccionado);
    let urlArchivo = '';
    let nombreOriginal = archivoSeleccionado.name;
    
    try {
      console.log('🌐 Enviando archivo al servidor...');
      const resp = await fetch(`${BASE_URL}/api/complex/upload`, {
        method: 'POST',
        body: formDataFile
      });
      
      console.log('📡 Respuesta del servidor:', resp.status, resp.statusText);
      
      if (resp.ok) {
        const data = await resp.json();
        console.log('✅ Archivo subido exitosamente:', data);
        urlArchivo = data.url;
        nombreOriginal = data.filename || archivoSeleccionado.name;
      } else {
        const errorText = await resp.text();
        console.error('❌ Error al subir archivo:', errorText);
        alert('Error al subir el archivo: ' + errorText);
        return;
      }
    } catch (err) {
      console.error('❌ Error de red al subir archivo:', err);
      alert('Error de red al subir el archivo: ' + err.message);
      return;
    }

    // 2. Guardar en historialDocs con la URL
    const nuevoDocumento = {
      tipo: tiposSolicitud.find(t => t.value === tipoSeleccionado)?.label || tipoSeleccionado,
      nombre: nombreOriginal,
      url: urlArchivo,
      fecha,
      comentario: comentario || 'Sin comentarios'
    };
    
    console.log('💾 Guardando documento en historial:', nuevoDocumento);
    
    setHistorialDocs(prev => {
      const nuevoHistorial = [...prev, nuevoDocumento];
      console.log('📚 Historial actualizado:', nuevoHistorial);
      return nuevoHistorial;
    });
    
    console.log('✅ Documento agregado al historial exitosamente');
    alert('✅ Documento subido y guardado exitosamente!');
    cerrarModal();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Trazabilidad</h2>
      {/* Botón para cargar solicitud */}
      <div className="mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          onClick={abrirModal}
        >
          Cargar Solicitud
        </button>
      </div>

      {/* Modal de carga de solicitud */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={cerrarModal}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">Cargar Solicitud de Documento</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
              <div className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={busquedaTipo}
                    onChange={(e) => {
                      setBusquedaTipo(e.target.value);
                      setMostrarListaCompleta(true);
                    }}
                    placeholder="Buscar y seleccionar tipo de documento..."
                    className="flex-1 border rounded-l px-3 py-2"
                    onFocus={() => setMostrarListaCompleta(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarListaCompleta(!mostrarListaCompleta)}
                    className="border border-l-0 rounded-r px-3 py-2 bg-gray-50 hover:bg-gray-100"
                  >
                    ▼
                  </button>
                </div>
                {mostrarListaCompleta && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {(busquedaTipo ? tiposFiltrados : tiposSolicitud).length > 0 ? (
                      (busquedaTipo ? tiposFiltrados : tiposSolicitud).map(tipo => (
                        <div
                          key={tipo.value}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setTipoSeleccionado(tipo.value);
                            setBusquedaTipo(tipo.label);
                            setMostrarListaCompleta(false);
                          }}
                        >
                          {tipo.label}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No se encontraron resultados</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Archivo</label>
              <input
                type="file"
                onChange={handleArchivoChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Barra de comentarios */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comentarios</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agregar comentarios sobre el documento..."
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              onClick={handleCargarDocumento}
              disabled={!tipoSeleccionado || !archivoSeleccionado}
            >
              Cargar
            </button>
          </div>
        </div>
      )}

      {/* Historial de documentos subidos */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Historial de Documentos Subidos</h4>
        {historialDocs.length === 0 ? (
          <p className="text-gray-500">No hay documentos subidos aún.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Comentarios</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {historialDocs.map((doc, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{doc.tipo}</td>
                  <td className="p-2 border">{doc.nombre}</td>
                  <td className="p-2 border">{doc.fecha}</td>
                  <td className="p-2 border">{doc.comentario}</td>
                  <td className="p-2 border text-center">
                    {doc.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" download={doc.nombre} className="text-blue-600 hover:underline">
                        Descargar
                      </a>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
