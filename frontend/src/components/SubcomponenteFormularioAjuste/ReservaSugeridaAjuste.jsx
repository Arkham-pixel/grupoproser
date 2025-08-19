import React from 'react';
import { FaCalculator } from 'react-icons/fa';
import IAInteligente from './IAInteligente';

export default function ReservaSugeridaAjuste({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaCalculator className="mr-3 text-green-600" />
          6. RESERVA SUGERIDA U OBSERVACION
        </h2>
        <p className="text-gray-600 mt-2">Determine la reserva sugerida y observaciones</p>
      </div>

      {/* Campo de texto principal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reserva Sugerida y Observaciones
        </label>
        <textarea
          value={formData.reservaSugerida || ''}
          onChange={(e) => onInputChange('reservaSugerida', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical"
          placeholder="Escribe la reserva sugerida aquí. Por ejemplo: 'Se sugiere una reserva de 50 millones de pesos para cubrir los daños estructurales y equipos afectados'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Mínimo recomendado: 80 palabras para la reserva sugerida y observaciones
        </div>
      </div>

      {/* IA Inteligente */}
      <IAInteligente
        textoActual={formData.reservaSugerida || ''}
        onTextoCambiado={(texto) => onInputChange('reservaSugerida', texto)}
        contextoFormulario={formData}
        tipoSeccion="reservaSugerida"
        tituloSeccion="Reserva Sugerida y Observaciones"
      />

      {/* Validación de calidad */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          📊 Validación de Calidad
        </h3>
        <div className="text-sm text-yellow-800">
          <p className="mb-2">
            <strong>Recomendaciones para reserva sugerida de calidad:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Incluya el monto de la reserva sugerida</li>
            <li>Justifique el monto basándose en los daños evaluados</li>
            <li>Mencione los elementos cubiertos por la reserva</li>
            <li>Incluya observaciones sobre la evaluación</li>
            <li>Mencione factores que pueden afectar el monto final</li>
            <li>Sea específico sobre las bases de cálculo utilizadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
