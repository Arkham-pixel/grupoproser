import React, { useState } from 'react';

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
  const [bandejasAbiertas, setBandejasAbiertas] = useState({
    contactoInicial: false,
    inspeccion: false,
    solicitudDocs: false,
    informePreliminar: false,
    informeFinal: false,
    ultimoDocumento: false
  });

  const toggleBandeja = (bandeja) => {
    setBandejasAbiertas(prev => ({
      ...prev,
      [bandeja]: !prev[bandeja]
    }));
  };

  // Función para descargar documentos
  const descargarDocumento = (documento) => {
    if (documento.data) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = documento.data;
      link.download = documento.nombre || 'documento';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para obtener documentos por tipo
  const obtenerDocumentosPorTipo = (tipo) => {
    if (!historialDocs || !Array.isArray(historialDocs)) return [];
    
    return historialDocs.filter(doc => {
      // Filtrar por tipo de documento o por el campo que corresponda
      if (tipo === 'contactoInicial') {
        return doc.tipo === 'contactoInicial' || doc.categoria === 'contactoInicial';
      } else if (tipo === 'inspeccion') {
        return doc.tipo === 'inspeccion' || doc.categoria === 'inspeccion';
      } else if (tipo === 'solicitudDocs') {
        return doc.tipo === 'solicitudDocs' || doc.categoria === 'solicitudDocs';
      } else if (tipo === 'informePreliminar') {
        return doc.tipo === 'informePreliminar' || doc.categoria === 'informePreliminar';
      } else if (tipo === 'informeFinal') {
        return doc.tipo === 'informeFinal' || doc.categoria === 'informeFinal';
      } else if (tipo === 'ultimoDocumento') {
        return doc.tipo === 'ultimoDocumento' || doc.categoria === 'ultimoDocumento';
      }
      return false;
    });
  };

  // Componente para mostrar documentos subidos
  const DocumentosSubidos = ({ tipo, titulo }) => {
    const documentos = obtenerDocumentosPorTipo(tipo);
    
    if (documentos.length === 0) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">No hay documentos subidos para {titulo}</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">📁 Documentos Subidos:</h4>
        <div className="space-y-2">
          {documentos.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {doc.nombre || `Documento ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.fechaSubida ? new Date(doc.fechaSubida).toLocaleDateString() : 'Sin fecha'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => descargarDocumento(doc)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
              >
                📥 Descargar
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BandejaDesplegable = ({ titulo, bandeja, children, icono, tipoDocumento }) => (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <button
        onClick={() => toggleBandeja(bandeja)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icono}</span>
          <h3 className="text-lg font-semibold text-gray-700">{titulo}</h3>
        </div>
        <span className={`text-gray-500 transition-transform ${bandejasAbiertas[bandeja] ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {bandejasAbiertas[bandeja] && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {children}
          
          {/* Mostrar documentos subidos */}
          <DocumentosSubidos tipo={tipoDocumento} titulo={titulo} />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Trazabilidad del Caso</h2>
      
      {/* Contacto Inicial */}
      <BandejaDesplegable titulo="Contacto Inicial" bandeja="contactoInicial" icono="📞" tipoDocumento="contactoInicial">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Contacto Inicial
            </label>
            <input
              type="date"
              name="fchaContIni"
              value={formData.fchaContIni || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Contacto Inicial
            </label>
            <textarea
              name="obseContIni"
              value={formData.obseContIni || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones del contacto inicial..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjuntos del Contacto Inicial
          </label>
          <div
            {...getRootPropsContacto()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActiveContacto
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputPropsContacto()} />
            {isDragActiveContacto ? (
              <p className="text-blue-600">Suelta los archivos aquí...</p>
            ) : (
              <p className="text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            )}
          </div>
        </div>
      </BandejaDesplegable>

      {/* Inspección */}
      <BandejaDesplegable titulo="Inspección" bandeja="inspeccion" icono="🔍" tipoDocumento="inspeccion">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inspección
            </label>
            <input
              type="date"
              name="fchaInspccion"
              value={formData.fchaInspccion || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones de la Inspección
            </label>
            <textarea
              name="obseInspccion"
              value={formData.obseInspccion || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones de la inspección..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acta de Inspección
          </label>
          <div
            {...getRootPropsInspeccion()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActiveInspeccion
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputPropsInspeccion()} />
            {isDragActiveInspeccion ? (
              <p className="text-blue-600">Suelta los archivos aquí...</p>
            ) : (
              <p className="text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            )}
          </div>
        </div>
      </BandejaDesplegable>

      {/* Solicitud de Documentos */}
      <BandejaDesplegable titulo="Solicitud de Documentos" bandeja="solicitudDocs" icono="📄" tipoDocumento="solicitudDocs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Solicitud de Documentos
            </label>
            <input
              type="date"
              name="fchaSoliDocu"
              value={formData.fchaSoliDocu || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones de la Solicitud
            </label>
            <textarea
              name="obseSoliDocu"
              value={formData.obseSoliDocu || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones de la solicitud..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjuntos de la Solicitud
          </label>
          <div
            {...getRootPropsSolicitudDocs()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActiveSolicitudDocs
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputPropsSolicitudDocs()} />
            {isDragActiveSolicitudDocs ? (
              <p className="text-blue-600">Suelta los archivos aquí...</p>
            ) : (
              <p className="text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            )}
          </div>
        </div>
      </BandejaDesplegable>

      {/* Informe Preliminar */}
      <BandejaDesplegable titulo="Informe Preliminar" bandeja="informePreliminar" icono="📊" tipoDocumento="informePreliminar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha del Informe Preliminar
            </label>
            <input
              type="date"
              name="fchaInfoPrelm"
              value={formData.fchaInfoPrelm || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Informe Preliminar
            </label>
            <textarea
              name="obseInfoPrelm"
              value={formData.obseInfoPrelm || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones del informe preliminar..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjunto del Informe Preliminar
          </label>
          <div
            {...getRootPropsInformePreliminar()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActiveInformePreliminar
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputPropsInformePreliminar()} />
            {isDragActiveInformePreliminar ? (
              <p className="text-blue-600">Suelta los archivos aquí...</p>
            ) : (
              <p className="text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            )}
          </div>
        </div>
      </BandejaDesplegable>

      {/* Informe Final */}
      <BandejaDesplegable titulo="Informe Final" bandeja="informeFinal" icono="📋" tipoDocumento="informeFinal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha del Informe Final
            </label>
            <input
              type="date"
              name="fchaInfoFnal"
              value={formData.fchaInfoFnal || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Informe Final
            </label>
            <textarea
              name="obseInfoFnal"
              value={formData.obseInfoFnal || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones del informe final..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjunto del Informe Final
          </label>
          <div
            {...getRootPropsInformeFinal()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActiveInformeFinal
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputPropsInformeFinal()} />
            {isDragActiveInformeFinal ? (
              <p className="text-blue-600">Suelta los archivos aquí...</p>
            ) : (
              <p className="text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            )}
          </div>
        </div>
      </BandejaDesplegable>

      {/* Último Documento */}
      <BandejaDesplegable titulo="Último Documento" bandeja="ultimoDocumento" icono="📎" tipoDocumento="ultimoDocumento">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha del Último Documento
            </label>
            <input
              type="date"
              name="fchaRepoActi"
              value={formData.fchaRepoActi || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Último Documento
            </label>
            <textarea
              name="obseRepoActi"
              value={formData.obseRepoActi || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones del último documento..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjunto del Último Documento
          </label>
          <div
            {...getRootPropsUltimoDocumento()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActiveUltimoDocumento
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputPropsUltimoDocumento()} />
            {isDragActiveUltimoDocumento ? (
              <p className="text-blue-600">Suelta los archivos aquí...</p>
            ) : (
              <p className="text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            )}
          </div>
        </div>
      </BandejaDesplegable>
    </div>
  );
}
