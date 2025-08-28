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

  // Función para calcular días transcurridos desde la última subida
  const calcularDiasTranscurridos = (tipo) => {
    const documentos = obtenerDocumentosPorTipo(tipo);
    
    if (documentos.length === 0) {
      return null; // No hay documentos
    }

    // Obtener la fecha más reciente de los documentos
    const fechas = documentos
      .map(doc => doc.fechaSubida || doc.fechaCreacion || doc.fecha)
      .filter(fecha => fecha) // Filtrar fechas válidas
      .map(fecha => new Date(fecha));

    if (fechas.length === 0) {
      return null; // No hay fechas válidas
    }

    const fechaMasReciente = new Date(Math.max(...fechas));
    const hoy = new Date();
    
    // Calcular diferencia en días
    const diferenciaTiempo = hoy.getTime() - fechaMasReciente.getTime();
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    
    return {
      dias: diferenciaDias,
      fecha: fechaMasReciente,
      esReciente: diferenciaDias <= 7, // Verde si es menor a 7 días
      esUrgente: diferenciaDias > 30 // Rojo si es mayor a 30 días
    };
  };

  // Función para obtener el color del indicador de días
  const obtenerColorIndicador = (diasInfo) => {
    if (!diasInfo) return 'text-gray-400';
    if (diasInfo.esReciente) return 'text-green-600';
    if (diasInfo.esUrgente) return 'text-red-600';
    return 'text-yellow-600';
  };

  // Función para obtener el icono del indicador de días
  const obtenerIconoIndicador = (diasInfo) => {
    if (!diasInfo) return '⏰';
    if (diasInfo.esReciente) return '✅';
    if (diasInfo.esUrgente) return '🚨';
    return '⚠️';
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
    const diasInfo = calcularDiasTranscurridos(tipo);
    
    if (documentos.length === 0) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">No hay documentos subidos para {titulo}</p>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="text-gray-400">⏰</span>
            <span className="text-gray-400 text-sm">Sin documentos</span>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        {/* Indicador de días transcurridos */}
        {diasInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-lg ${obtenerColorIndicador(diasInfo)}`}>
                  {obtenerIconoIndicador(diasInfo)}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  Último documento subido:
                </span>
                <span className="text-sm text-gray-600">
                  {diasInfo.fecha.toLocaleDateString()}
                </span>
              </div>
              <div className={`text-right ${obtenerColorIndicador(diasInfo)}`}>
                <div className="text-lg font-bold">
                  {diasInfo.dias === 0 ? 'Hoy' : 
                   diasInfo.dias === 1 ? 'Ayer' : 
                   `${diasInfo.dias} días`}
                </div>
                <div className="text-xs">
                  {diasInfo.dias === 0 ? 'Recién subido' : 
                   diasInfo.dias === 1 ? 'Hace 1 día' : 
                   `Hace ${diasInfo.dias} días`}
                </div>
              </div>
            </div>
          </div>
        )}

        <h4 className="text-sm font-medium text-gray-700 mb-3">📁 Documentos Subidos ({documentos.length}):</h4>
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

  const BandejaDesplegable = ({ titulo, bandeja, children, icono, tipoDocumento }) => {
    const diasInfo = calcularDiasTranscurridos(tipoDocumento);
    
    return (
      <div className="bg-white rounded-lg shadow-md mb-4">
        <button
          onClick={() => toggleBandeja(bandeja)}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icono}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{titulo}</h3>
              {/* Indicador de días en el título de la bandeja */}
              {diasInfo && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-sm ${obtenerColorIndicador(diasInfo)}`}>
                    {obtenerIconoIndicador(diasInfo)}
                  </span>
                  <span className={`text-xs ${obtenerColorIndicador(diasInfo)}`}>
                    {diasInfo.dias === 0 ? 'Hoy' : 
                     diasInfo.dias === 1 ? 'Ayer' : 
                     `${diasInfo.dias} días`}
                  </span>
                </div>
              )}
            </div>
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
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Trazabilidad del Caso</h2>
      
      {/* Resumen General de Trazabilidad */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📊 Resumen de Trazabilidad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { tipo: 'contactoInicial', titulo: 'Contacto Inicial', icono: '📞' },
            { tipo: 'inspeccion', titulo: 'Inspección', icono: '🔍' },
            { tipo: 'solicitudDocs', titulo: 'Solicitud Docs', icono: '📄' },
            { tipo: 'informePreliminar', titulo: 'Informe Preliminar', icono: '📊' },
            { tipo: 'informeFinal', titulo: 'Informe Final', icono: '📋' },
            { tipo: 'ultimoDocumento', titulo: 'Último Documento', icono: '📎' }
          ].map(({ tipo, titulo, icono }) => {
            const diasInfo = calcularDiasTranscurridos(tipo);
            const documentos = obtenerDocumentosPorTipo(tipo);
            
            return (
              <div key={tipo} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{icono}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {documentos.length} docs
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{titulo}</h4>
                
                {diasInfo ? (
                  <div className={`text-center ${obtenerColorIndicador(diasInfo)}`}>
                    <div className="text-lg font-bold">
                      {diasInfo.dias === 0 ? 'Hoy' : 
                       diasInfo.dias === 1 ? 'Ayer' : 
                       `${diasInfo.dias} días`}
                    </div>
                    <div className="text-xs">
                      {diasInfo.dias === 0 ? 'Recién subido' : 
                       diasInfo.dias === 1 ? 'Hace 1 día' : 
                       `Hace ${diasInfo.dias} días`}
                    </div>
                    <div className="text-xs mt-1">
                      {diasInfo.fecha.toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-lg font-bold">Sin docs</div>
                    <div className="text-xs">No hay documentos</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Indicador de estado general */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Estado General:</span>
            <div className="flex items-center space-x-2">
              {(() => {
                const todosLosTipos = ['contactoInicial', 'inspeccion', 'solicitudDocs', 'informePreliminar', 'informeFinal', 'ultimoDocumento'];
                const documentosRecientes = todosLosTipos.filter(tipo => {
                  const diasInfo = calcularDiasTranscurridos(tipo);
                  return diasInfo && diasInfo.esReciente;
                }).length;
                const documentosUrgentes = todosLosTipos.filter(tipo => {
                  const diasInfo = calcularDiasTranscurridos(tipo);
                  return diasInfo && diasInfo.esUrgente;
                }).length;
                
                if (documentosUrgentes > 0) {
                  return (
                    <span className="text-red-600 text-sm font-medium flex items-center">
                      🚨 {documentosUrgentes} documentos urgentes
                    </span>
                  );
                } else if (documentosRecientes >= 3) {
                  return (
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      ✅ Caso actualizado
                    </span>
                  );
                } else {
                  return (
                    <span className="text-yellow-600 text-sm font-medium flex items-center">
                      ⚠️ Necesita atención
                    </span>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
      
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
