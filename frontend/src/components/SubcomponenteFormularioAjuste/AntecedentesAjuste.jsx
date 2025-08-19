import React, { useState } from 'react';
import { FaBook, FaLightbulb, FaCheck, FaCopy } from 'react-icons/fa';
import IAInteligente from './IAInteligente';

export default function AntecedentesAjuste({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaBook className="mr-3 text-blue-600" />
          1. ANTECEDENTES
        </h2>
        <p className="text-gray-600 mt-2">Describa los antecedentes del siniestro</p>
      </div>

      {/* Campo de texto principal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción de Antecedentes
        </label>
        <textarea
          value={formData.antecedentes || ''}
          onChange={(e) => onInputChange('antecedentes', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="Escribe tu idea inicial aquí. Por ejemplo: 'El edificio X tubo un incendio ocasionado por una falla electrica a la hora 11 am segun testigo daños tal tal tal'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Mínimo recomendado: 50 palabras para un reporte profesional
        </div>
      </div>

      {/* IA Inteligente */}
      <IAInteligente
        textoActual={formData.antecedentes || ''}
        onTextoCambiado={(texto) => onInputChange('antecedentes', texto)}
        contextoFormulario={formData}
        tipoSeccion="antecedentes"
        tituloSeccion="Antecedentes"
      />

      {/* Validación de calidad */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          📊 Validación de Calidad
        </h3>
        <div className="text-sm text-yellow-800">
          <p className="mb-2">
            <strong>Recomendaciones para antecedentes de calidad:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Incluya fecha y hora exacta del incidente</li>
            <li>Mencione la ubicación específica donde ocurrió</li>
            <li>Describa las circunstancias que rodearon el evento</li>
            <li>Identifique a las personas involucradas o testigos</li>
            <li>Mencione los sistemas o protocolos activados</li>
            <li>Sea objetivo y preciso en la descripción</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
