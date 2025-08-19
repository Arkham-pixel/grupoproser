import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import IAInteligente from './IAInteligente';

export default function CircunstanciaSiniestroAjuste({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaExclamationTriangle className="mr-3 text-red-600" />
          3. CIRCUNSTANCIAS DEL SINIESTRO
        </h2>
        <p className="text-gray-600 mt-2">Describa las circunstancias específicas del siniestro</p>
      </div>

      {/* Campo de texto principal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Circunstancias del Siniestro
        </label>
        <textarea
          value={formData.circunstanciasSiniestro || ''}
          onChange={(e) => onInputChange('circunstanciasSiniestro', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
          placeholder="Escribe las circunstancias del siniestro aquí. Por ejemplo: 'El incendio empezo en el sotano, se propago rapido por los cables electricos, los bomberos llegaron tarde'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Mínimo recomendado: 80 palabras para describir las circunstancias del siniestro
        </div>
      </div>

      {/* IA Inteligente */}
      <IAInteligente
        textoActual={formData.circunstanciasSiniestro || ''}
        onTextoCambiado={(texto) => onInputChange('circunstanciasSiniestro', texto)}
        contextoFormulario={formData}
        tipoSeccion="circunstanciasSiniestro"
        tituloSeccion="Circunstancias del Siniestro"
      />

      {/* Validación de calidad */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          📊 Validación de Calidad
        </h3>
        <div className="text-sm text-yellow-800">
          <p className="mb-2">
            <strong>Recomendaciones para circunstancias del siniestro de calidad:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Describa cómo se inició el incidente</li>
            <li>Mencione la secuencia de eventos que ocurrieron</li>
            <li>Incluya el tiempo de respuesta de las autoridades</li>
            <li>Detalle las acciones tomadas durante el incidente</li>
            <li>Mencione factores que agravaron la situación</li>
            <li>Sea específico sobre el impacto y consecuencias</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
