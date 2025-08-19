import React, { useState } from 'react';
import { FaSignature, FaUser, FaBuilding, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function FirmaAjuste({ formData, onInputChange }) {
  const [firmaFuncionario, setFirmaFuncionario] = useState('');
  const [firmaGerente, setFirmaGerente] = useState('');

  const funcionarios = [
    'Juan Carlos Pérez',
    'María Isabel Rodríguez',
    'Carlos Alberto López',
    'Ana Sofía Martínez',
    'Roberto José Silva',
    'Laura Patricia Gómez',
    'Miguel Ángel Torres',
    'Carmen Elena Vargas'
  ];

  const cargos = [
    'Ing. de Siniestros',
    'Ajustador Senior',
    'Ajustador Especialista',
    'Perito en Seguros',
    'Analista de Riesgos',
    'Coordinador de Ajustes',
    'Supervisor de Campo',
    'Técnico de Ajustes'
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaSignature className="mr-3 text-indigo-600" />
          Firma del Ajustador
        </h2>
        <p className="text-gray-600 mt-2">Complete la información de firma y contacto</p>
      </div>

      {/* Información del funcionario */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaUser className="mr-2 text-blue-600" />
          Información del Funcionario
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Funcionario
            </label>
            <select
              value={firmaFuncionario}
              onChange={(e) => setFirmaFuncionario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un funcionario</option>
              {funcionarios.map((funcionario, index) => (
                <option key={index} value={funcionario}>
                  {funcionario}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <select
              value={formData.cargoFuncionario || ''}
              onChange={(e) => onInputChange('cargoFuncionario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un cargo</option>
              {cargos.map((cargo, index) => (
                <option key={index} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <FaBuilding className="mr-2" />
            Información de Contacto
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FaPhone className="text-blue-600" />
              <span className="text-sm text-blue-800">
                PBX: (+57 5) 3857793 - +57 3166337503
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-600" />
              <span className="text-sm text-blue-800">
                correo@proserajustes.com.co
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Firma del Gerente Técnico */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaUser className="mr-2 text-green-600" />
          Firma del Gerente Técnico
        </h3>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-center">
            <h4 className="font-semibold text-green-900 text-lg mb-2">
              Iskharly José Tapia Gutiérrez
            </h4>
            <p className="text-green-800 mb-1">Gerente Técnico</p>
            <p className="text-green-800 font-medium mb-2">PROSER AJUSTES SAS</p>
            
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex items-center justify-center space-x-2">
                <FaPhone className="text-green-600" />
                <span>PBX: (+57 5) 3857793 - +57 3166337503</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FaEnvelope className="text-green-600" />
                <span>itapia@proserpuertos.com.co</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Texto de cierre */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaSignature className="mr-2 text-purple-600" />
          Texto de Cierre
        </h3>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-800 text-center italic">
            "De esta manera nos permitimos entregar el presente informe, agradeciendo la confianza depositada en nuestra firma."
          </p>
          
          <div className="text-center mt-4">
            <p className="text-purple-800 font-medium">Cordialmente,</p>
          </div>
        </div>
      </div>

      {/* Vista previa de firmas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaSignature className="mr-2 text-indigo-600" />
          Vista Previa de Firmas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firma del funcionario */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 text-center">Funcionario</h4>
            <div className="text-center space-y-2">
              <div className="h-16 border-b-2 border-gray-300 mb-2"></div>
              <p className="font-medium text-gray-800">
                {firmaFuncionario || 'Nombre del funcionario'}
              </p>
              <p className="text-sm text-gray-600">
                {formData.cargoFuncionario || 'Ing. de Siniestros'}
              </p>
              <p className="text-sm text-gray-600 font-medium">PROSER AJUSTES SAS</p>
              <p className="text-xs text-gray-500">PBX: (+57 5) 3857793 - +57 3166337503</p>
              <p className="text-xs text-gray-500">E-mail: correo@proserajustes.com.co</p>
            </div>
          </div>
          
          {/* Firma del gerente */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 text-center">Gerente Técnico</h4>
            <div className="text-center space-y-2">
              <div className="h-16 border-b-2 border-gray-300 mb-2"></div>
              <p className="font-medium text-gray-800">Iskharly José Tapia Gutiérrez</p>
              <p className="text-sm text-gray-600">Gerente Técnico</p>
              <p className="text-sm text-gray-600 font-medium">PROSER AJUSTES SAS</p>
              <p className="text-xs text-gray-500">PBX: (+57 5) 3857793 - +57 3166337503</p>
              <p className="text-xs text-gray-500">E-mail: itapia@proserpuertos.com.co</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          📋 Información Adicional
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <div>
            <h4 className="font-medium mb-2">Datos de la Empresa:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Razón Social: PROSER AJUSTES SAS</li>
              <li>• NIT: 900.123.456-7</li>
              <li>• Dirección: Carrera 78 #90-12, Barranquilla</li>
              <li>• Ciudad: Barranquilla, Atlántico</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Contactos Principales:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Oficina Principal: (+57 5) 3857793</li>
              <li>• Celular: +57 3166337503</li>
              <li>• Email General: correo@proserajustes.com.co</li>
              <li>• Email Gerencia: itapia@proserpuertos.com.co</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validación de completitud */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center">
          ✅ Validación de Completitud
        </h4>
        <div className="space-y-2 text-sm text-green-800">
          {firmaFuncionario ? (
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Funcionario seleccionado: {firmaFuncionario}
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">⚠</span>
              Seleccione un funcionario
            </div>
          )}
          
          {formData.cargoFuncionario ? (
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Cargo seleccionado: {formData.cargoFuncionario}
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">⚠</span>
              Seleccione un cargo
            </div>
          )}
          
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            Información de contacto completa
          </div>
          
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            Firma del gerente técnico configurada
          </div>
        </div>
      </div>
    </div>
  );
}
