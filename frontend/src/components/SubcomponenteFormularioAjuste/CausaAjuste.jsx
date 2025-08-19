import React from 'react';
import { FaSearch } from 'react-icons/fa';
import IAInteligente from './IAInteligente';

export default function CausaAjuste({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaSearch className="mr-3 text-indigo-600" />
          5. CAUSA
        </h2>
        <p className="text-gray-600 mt-2">Determine la causa del siniestro</p>
      </div>

      {/* Campo de texto principal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Determinación de la Causa
        </label>
        <textarea
          value={formData.causa || ''}
          onChange={(e) => onInputChange('causa', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
          placeholder="Escribe la causa del siniestro aquí. Por ejemplo: 'La causa principal fue una falla electrica en el sistema de cableado, causada por sobrecarga y falta de mantenimiento'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Mínimo recomendado: 70 palabras para determinar la causa del siniestro
        </div>
      </div>

      {/* IA Inteligente */}
      <IAInteligente
        textoActual={formData.causa || ''}
        onTextoCambiado={(texto) => onInputChange('causa', texto)}
        contextoFormulario={formData}
        tipoSeccion="causa"
        tituloSeccion="Determinación de la Causa"
      />

      {/* Validación de calidad */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          📊 Validación de Calidad
        </h3>
        <div className="text-sm text-yellow-800">
          <p className="mb-2">
            <strong>Recomendaciones para determinación de causa de calidad:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Identifique la causa raíz del incidente</li>
            <li>Mencione factores contribuyentes</li>
            <li>Incluya evidencia técnica que sustente la causa</li>
            <li>Describa el mecanismo del incidente</li>
            <li>Mencione si fue por falla humana, técnica o natural</li>
            <li>Sea específico sobre las condiciones que llevaron al incidente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
