import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt, FaShieldAlt, FaChevronDown } from 'react-icons/fa';

export default function DatosGeneralesAjuste({ formData, onInputChange, datosMaestros = {} }) {
  const [sugerenciasIA, setSugerenciasIA] = useState({
    ciudad: [],
    aseguradora: [],
    intermediario: [],
    tipoEvento: []
  });
  const [dropdownsAbiertos, setDropdownsAbiertos] = useState({});
  const [filtros, setFiltros] = useState({
    ciudad: '',
    aseguradora: '',
    intermediario: ''
  });

  // Función para generar sugerencias IA
  const generarSugerenciasIA = (campo, valor) => {
    if (!valor || valor.length < 2) {
      setSugerenciasIA(prev => ({ ...prev, [campo]: [] }));
      return;
    }

    // Simular sugerencias basadas en patrones
    const sugerencias = {
      tipoEvento: (datosMaestros.tiposEvento || []).filter(tipo => 
        tipo.toLowerCase().includes(valor.toLowerCase())
      ),
      intermediario: (datosMaestros.intermediarios || []).filter(inter => 
        inter.toLowerCase().includes(valor.toLowerCase())
      ),
      ciudad: (datosMaestros.ciudades || []).filter(ciudad => 
        ciudad.nombre && ciudad.nombre.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 8),
      aseguradora: (datosMaestros.aseguradoras || []).filter(aseg => 
        aseg.nombre && aseg.nombre.toLowerCase().includes(valor.toLowerCase())
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
    setSugerenciasIA({
      ciudad: [],
      aseguradora: [],
      intermediario: [],
      tipoEvento: []
    });
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
              Empresa
            </label>
            <input
              type="text"
              value={formData.empresa || ''}
              onChange={(e) => onInputChange('empresa', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion || ''}
              onChange={(e) => onInputChange('direccion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={formData.ciudad || ''}
              onChange={(e) => onInputChange('ciudad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ciudad de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono || ''}
              onChange={(e) => onInputChange('telefono', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Teléfono de contacto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email de contacto"
            />
          </div>
        </div>
      </div>

      {/* Información del siniestro */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
          <FaShieldAlt className="mr-2" />
          Información del Siniestro
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Siniestro *
            </label>
            <input
              type="text"
              value={formData.numeroSiniestro || ''}
              onChange={(e) => onInputChange('numeroSiniestro', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Número de siniestro asignado"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Ocurrencia *
            </label>
            <input
              type="date"
              value={formData.fechaOcurrencia || ''}
              onChange={(e) => onInputChange('fechaOcurrencia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de Ocurrencia
            </label>
            <input
              type="time"
              value={formData.horaOcurrencia || ''}
              onChange={(e) => onInputChange('horaOcurrencia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.tipoEvento || ''}
                onChange={(e) => {
                  onInputChange('tipoEvento', e.target.value);
                  generarSugerenciasIA('tipoEvento', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Escribe para buscar tipo de evento..."
                required
              />
              {sugerenciasIA.tipoEvento && sugerenciasIA.tipoEvento.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {sugerenciasIA.tipoEvento.map((tipo, index) => (
                    <button
                      key={index}
                      onClick={() => aplicarSugerencia('tipoEvento', tipo)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funcionario que Asigna
            </label>
            <input
              type="text"
              value={formData.funcionarioAsigna || ''}
              onChange={(e) => onInputChange('funcionarioAsigna', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Nombre del funcionario"
            />
          </div>
        </div>
      </div>

      {/* Información de la póliza */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <FaFileAlt className="mr-2" />
          Información de la Póliza
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Póliza *
            </label>
            <input
              type="text"
              value={formData.numeroPoliza || ''}
              onChange={(e) => onInputChange('numeroPoliza', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Número de póliza"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aseguradora *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.aseguradora || ''}
                onChange={(e) => {
                  onInputChange('aseguradora', e.target.value);
                  generarSugerenciasIA('aseguradora', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Escribe para buscar aseguradora..."
                required
              />
              {sugerenciasIA.aseguradora && sugerenciasIA.aseguradora.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {sugerenciasIA.aseguradora.map((aseg, index) => (
                    <button
                      key={index}
                      onClick={() => aplicarSugerencia('aseguradora', aseg.nombre)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="font-medium">{aseg.nombre}</div>
                      <div className="text-sm text-gray-500">{aseg.funcionarios ? aseg.funcionarios.length : 0} funcionarios</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ramo
            </label>
            <input
              type="text"
              value={formData.ramo || ''}
              onChange={(e) => onInputChange('ramo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ramo de la póliza"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vigencia Desde
            </label>
            <input
              type="date"
              value={formData.vigenciaDesde || ''}
              onChange={(e) => onInputChange('vigenciaDesde', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vigencia Hasta
            </label>
            <input
              type="date"
              value={formData.vigenciaHasta || ''}
              onChange={(e) => onInputChange('vigenciaHasta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Información de las partes */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <FaUser className="mr-2" />
          Información de las Partes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asegurado *
            </label>
            <input
              type="text"
              value={formData.asegurado || ''}
              onChange={(e) => onInputChange('asegurado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre del asegurado"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tomador
            </label>
            <input
              type="text"
              value={formData.tomador || ''}
              onChange={(e) => onInputChange('tomador', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre del tomador"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiario
            </label>
            <input
              type="text"
              value={formData.beneficiario || ''}
              onChange={(e) => onInputChange('beneficiario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre del beneficiario"
            />
          </div>
        </div>
      </div>

      {/* Ubicación del Riesgo */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaMapMarkerAlt className="mr-3 text-red-600" />
          📍 Ubicación del Riesgo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Riesgo *
            </label>
            <input
              type="text"
              value={formData.direccionRiesgo || ''}
              onChange={(e) => onInputChange('direccionRiesgo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ej: Calle 123 # 45-67, Barrio Centro"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.ciudad || ''}
                onChange={(e) => {
                  onInputChange('ciudad', e.target.value);
                  generarSugerenciasIA('ciudad', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Escribe para buscar ciudad..."
                required
              />
              {sugerenciasIA.ciudad && sugerenciasIA.ciudad.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {sugerenciasIA.ciudad.map((ciudad, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onInputChange('ciudad', ciudad.nombre);
                        setSugerenciasIA(prev => ({ ...prev, ciudad: [] }));
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {ciudad.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento *
            </label>
            <select
              value={formData.departamento || ''}
              onChange={(e) => onInputChange('departamento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Selecciona un departamento</option>
              <option value="Antioquia">Antioquia</option>
              <option value="Atlántico">Atlántico</option>
              <option value="Bogotá D.C.">Bogotá D.C.</option>
              <option value="Bolívar">Bolívar</option>
              <option value="Boyacá">Boyacá</option>
              <option value="Caldas">Caldas</option>
              <option value="Caquetá">Caquetá</option>
              <option value="Cauca">Cauca</option>
              <option value="Cesar">Cesar</option>
              <option value="Chocó">Chocó</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Cundinamarca">Cundinamarca</option>
              <option value="Guainía">Guainía</option>
              <option value="Guaviare">Guaviare</option>
              <option value="Huila">Huila</option>
              <option value="La Guajira">La Guajira</option>
              <option value="Magdalena">Magdalena</option>
              <option value="Meta">Meta</option>
              <option value="Nariño">Nariño</option>
              <option value="Norte de Santander">Norte de Santander</option>
              <option value="Putumayo">Putumayo</option>
              <option value="Quindío">Quindío</option>
              <option value="Risaralda">Risaralda</option>
              <option value="San Andrés y Providencia">San Andrés y Providencia</option>
              <option value="Santander">Santander</option>
              <option value="Sucre">Sucre</option>
              <option value="Tolima">Tolima</option>
              <option value="Valle del Cauca">Valle del Cauca</option>
              <option value="Vaupés">Vaupés</option>
              <option value="Vichada">Vichada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              value={formData.codigoPostal || ''}
              onChange={(e) => onInputChange('codigoPostal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ej: 110111"
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
              FECHA DE REPORTE
            </label>
            <input
              type="date"
              value={formData.fechaReporte || ''}
              onChange={(e) => onInputChange('fechaReporte', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FECHA DE INSPECCIÓN
            </label>
            <input
              type="date"
              value={formData.fechaInspeccion || ''}
              onChange={(e) => onInputChange('fechaInspeccion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
