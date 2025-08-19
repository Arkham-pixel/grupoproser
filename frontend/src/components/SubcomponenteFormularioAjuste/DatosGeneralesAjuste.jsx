import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt, FaShieldAlt, FaChevronDown } from 'react-icons/fa';

export default function DatosGeneralesAjuste({ formData, onInputChange, datosMaestros }) {
  const [sugerenciasIA, setSugerenciasIA] = useState({});
  const [dropdownsAbiertos, setDropdownsAbiertos] = useState({});
  const [filtros, setFiltros] = useState({
    ciudad: '',
    aseguradora: '',
    intermediario: ''
  });

  // Función para generar sugerencias IA
  const generarSugerenciasIA = (campo, valor) => {
    if (!valor || valor.length < 2) return;

    // Simular sugerencias basadas en patrones
    const sugerencias = {
      tipoEvento: datosMaestros.tiposEvento.filter(tipo => 
        tipo.toLowerCase().includes(valor.toLowerCase())
      ),
      intermediario: datosMaestros.intermediarios.filter(inter => 
        inter.toLowerCase().includes(valor.toLowerCase())
      ),
      ciudad: datosMaestros.ciudades.filter(ciudad => 
        ciudad.nombre.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 8),
      aseguradora: datosMaestros.aseguradoras.filter(aseg => 
        aseg.nombre.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 8)
    };

    setSugerenciasIA(prev => ({
      ...prev,
      [campo]: sugerencias[campo] || []
    }));
  };

  const aplicarSugerencia = (campo, valor) => {
    onInputChange(campo, valor);
    setSugerenciasIA(prev => ({ ...prev, [campo]: [] }));
    setDropdownsAbiertos(prev => ({ ...prev, [campo]: false }));
  };

  const toggleDropdown = (campo) => {
    setDropdownsAbiertos(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const cerrarDropdowns = () => {
    setDropdownsAbiertos({});
    setSugerenciasIA({});
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => cerrarDropdowns();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaFileAlt className="mr-3 text-blue-600" />
          Datos Generales del Siniestro
        </h2>
        <p className="text-gray-600 mt-2">Complete la información básica del siniestro</p>
      </div>

      {/* Información del destinatario */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <FaUser className="mr-2" />
          Información del Destinatario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Señor(a) / Destinatario
            </label>
            <input
              type="text"
              value={formData.destinatario || ''}
              onChange={(e) => onInputChange('destinatario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del destinatario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <input
              type="text"
              value={formData.cargo || ''}
              onChange={(e) => onInputChange('cargo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cargo del destinatario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compañía
            </label>
            <input
              type="text"
              value={formData.compania || ''}
              onChange={(e) => onInputChange('compania', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la compañía"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={formData.ciudad || ''}
                  onChange={(e) => {
                    onInputChange('ciudad', e.target.value);
                    generarSugerenciasIA('ciudad', e.target.value);
                    setFiltros(prev => ({ ...prev, ciudad: e.target.value }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Buscar ciudad..."
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('ciudad');
                  }}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaChevronDown className={`h-4 w-4 transition-transform ${dropdownsAbiertos.ciudad ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Dropdown de ciudades */}
              {dropdownsAbiertos.ciudad && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={filtros.ciudad}
                      onChange={(e) => setFiltros(prev => ({ ...prev, ciudad: e.target.value }))}
                      placeholder="Filtrar ciudades..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {datosMaestros.ciudades
                      .filter(ciudad => 
                        ciudad.nombre.toLowerCase().includes(filtros.ciudad.toLowerCase()) ||
                        ciudad.departamento.toLowerCase().includes(filtros.ciudad.toLowerCase())
                      )
                      .slice(0, 20)
                      .map((ciudad, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarSugerencia('ciudad', ciudad.nombre)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{ciudad.nombre}</div>
                          <div className="text-sm text-gray-500">{ciudad.departamento}</div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información del siniestro */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <FaShieldAlt className="mr-2" />
          Información del Siniestro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              REPORTE No
            </label>
            <input
              type="text"
              value={formData.reporteNo || ''}
              onChange={(e) => onInputChange('reporteNo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Número de reporte"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              REF. INTERNA
            </label>
            <input
              type="text"
              value={formData.refInterna || ''}
              onChange={(e) => onInputChange('refInterna', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Referencia interna"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SINIESTRO No
            </label>
            <input
              type="text"
              value={formData.siniestroNo || ''}
              onChange={(e) => onInputChange('siniestroNo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Número de siniestro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FUNCIONARIO QUE ASIGNA
            </label>
            <input
              type="text"
              value={formData.funcionarioAsigna || ''}
              onChange={(e) => onInputChange('funcionarioAsigna', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nombre del funcionario"
            />
          </div>
        </div>
      </div>

      {/* Información de la póliza */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <FaBuilding className="mr-2" />
          Información de la Póliza
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              INTERMEDIARIO
            </label>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={formData.intermediario || ''}
                  onChange={(e) => {
                    onInputChange('intermediario', e.target.value);
                    generarSugerenciasIA('intermediario', e.target.value);
                    setFiltros(prev => ({ ...prev, intermediario: e.target.value }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Buscar intermediario..."
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('intermediario');
                  }}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <FaChevronDown className={`h-4 w-4 transition-transform ${dropdownsAbiertos.intermediario ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Dropdown de intermediarios */}
              {dropdownsAbiertos.intermediario && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={filtros.intermediario}
                      onChange={(e) => setFiltros(prev => ({ ...prev, intermediario: e.target.value }))}
                      placeholder="Filtrar intermediarios..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {datosMaestros.intermediarios
                      .filter(inter => 
                        inter.toLowerCase().includes(filtros.intermediario.toLowerCase())
                      )
                      .map((inter, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarSugerencia('intermediario', inter)}
                          className="w-full text-left px-3 py-2 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                        >
                          {inter}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              POLIZA No
            </label>
            <input
              type="text"
              value={formData.polizaNo || ''}
              onChange={(e) => onInputChange('polizaNo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Número de póliza"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VIGENCIA
            </label>
            <input
              type="text"
              value={formData.vigencia || ''}
              onChange={(e) => onInputChange('vigencia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Período de vigencia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TIPO DE EVENTO
            </label>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={formData.tipoEvento || ''}
                  onChange={(e) => {
                    onInputChange('tipoEvento', e.target.value);
                    generarSugerenciasIA('tipoEvento', e.target.value);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Seleccionar tipo de evento..."
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('tipoEvento');
                  }}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <FaChevronDown className={`h-4 w-4 transition-transform ${dropdownsAbiertos.tipoEvento ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Dropdown de tipos de evento */}
              {dropdownsAbiertos.tipoEvento && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  <div className="max-h-40 overflow-y-auto">
                    {datosMaestros.tiposEvento.map((tipo, index) => (
                      <button
                        key={index}
                        onClick={() => aplicarSugerencia('tipoEvento', tipo)}
                        className="w-full text-left px-3 py-2 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información de las partes */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
          <FaUser className="mr-2" />
          Información de las Partes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TOMADOR
            </label>
            <input
              type="text"
              value={formData.tomador || ''}
              onChange={(e) => onInputChange('tomador', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nombre del tomador"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ASEGURADO
            </label>
            <input
              type="text"
              value={formData.asegurado || ''}
              onChange={(e) => onInputChange('asegurado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nombre del asegurado"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BENEFICIARIO
            </label>
            <input
              type="text"
              value={formData.beneficiario || ''}
              onChange={(e) => onInputChange('beneficiario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nombre del beneficiario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ASEGURADORA
            </label>
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={formData.aseguradora || ''}
                  onChange={(e) => {
                    onInputChange('aseguradora', e.target.value);
                    generarSugerenciasIA('aseguradora', e.target.value);
                    setFiltros(prev => ({ ...prev, aseguradora: e.target.value }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Buscar aseguradora..."
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown('aseguradora');
                  }}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <FaChevronDown className={`h-4 w-4 transition-transform ${dropdownsAbiertos.aseguradora ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Dropdown de aseguradoras */}
              {dropdownsAbiertos.aseguradora && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={filtros.aseguradora}
                      onChange={(e) => setFiltros(prev => ({ ...prev, aseguradora: e.target.value }))}
                      placeholder="Filtrar aseguradoras..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {datosMaestros.aseguradoras
                      .filter(aseg => 
                        aseg.nombre.toLowerCase().includes(filtros.aseguradora.toLowerCase())
                      )
                      .slice(0, 20)
                      .map((aseg, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarSugerencia('aseguradora', aseg.nombre)}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 focus:bg-orange-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{aseg.nombre}</div>
                          <div className="text-sm text-gray-500">
                            {aseg.funcionarios.length} funcionario(s)
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información de ubicación */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          Información de Ubicación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DIRECCIÓN RIESGO ASEGURADO
            </label>
            <input
              type="text"
              value={formData.direccionRiesgo || ''}
              onChange={(e) => onInputChange('direccionRiesgo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Dirección completa del riesgo asegurado"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UBICACIÓN RIESGO AFECTADO
            </label>
            <input
              type="text"
              value={formData.ubicacionRiesgo || ''}
              onChange={(e) => onInputChange('ubicacionRiesgo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ubicación específica del riesgo afectado"
            />
          </div>
        </div>
      </div>

      {/* Fechas importantes */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          <FaCalendarAlt className="mr-2" />
          Fechas Importantes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FECHA DE OCURRENCIA
            </label>
            <input
              type="date"
              value={formData.fechaOcurrencia || ''}
              onChange={(e) => onInputChange('fechaOcurrencia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FECHA DE ASIGNACION
            </label>
            <input
              type="date"
              value={formData.fechaAsignacion || ''}
              onChange={(e) => onInputChange('fechaAsignacion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FECHA DE VISITA
            </label>
            <input
              type="date"
              value={formData.fechaVisita || ''}
              onChange={(e) => onInputChange('fechaVisita', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Asistente IA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          🤖 Asistente IA
        </h3>
        <div className="text-sm text-blue-800">
          <p className="mb-2">
            💡 <strong>Consejos:</strong> El sistema de IA te ayudará con:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Autocompletado inteligente de campos</li>
            <li>Sugerencias basadas en patrones anteriores</li>
            <li>Validación automática de datos</li>
            <li>Generación de recomendaciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
