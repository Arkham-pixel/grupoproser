import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import IAInteligente from './IAInteligente';

export default function DescripcionRiesgoAjuste({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaShieldAlt className="mr-3 text-green-600" />
          2. DESCRIPCIÓN DEL RIESGO
        </h2>
        <p className="text-gray-600 mt-2">Describa las características del riesgo asegurado</p>
      </div>

      {/* Campo de texto principal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del Riesgo Asegurado
        </label>
        <textarea
          value={formData.descripcionRiesgo || ''}
          onChange={(e) => onInputChange('descripcionRiesgo', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical"
          placeholder="Escribe tu descripción del riesgo aquí. Por ejemplo: 'El edificio es de construcción antigua, tiene 3 pisos, está ubicado en zona comercial, no tiene sistema de alarmas moderno'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Mínimo recomendado: 100 palabras para una descripción profesional del riesgo
        </div>
      </div>

      {/* IA Inteligente */}
      <IAInteligente
        textoActual={formData.descripcionRiesgo || ''}
        onTextoCambiado={(texto) => onInputChange('descripcionRiesgo', texto)}
        contextoFormulario={formData}
        tipoSeccion="descripcionRiesgo"
        tituloSeccion="Descripción del Riesgo"
      />

      {/* Validación de calidad */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          📊 Validación de Calidad
        </h3>
        <div className="text-sm text-yellow-800">
          <p className="mb-2">
            <strong>Recomendaciones para descripción de riesgo de calidad:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Incluya la ubicación exacta y características del terreno</li>
            <li>Describa el tipo de construcción y materiales utilizados</li>
            <li>Mencione los sistemas de seguridad implementados</li>
            <li>Identifique factores que influyen en el nivel de riesgo</li>
            <li>Detalle los puntos críticos y medidas de protección</li>
            <li>Sea específico sobre vulnerabilidades identificadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
