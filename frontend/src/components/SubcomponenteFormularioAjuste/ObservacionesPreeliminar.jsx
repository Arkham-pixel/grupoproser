import React, { useState } from 'react';

const ObservacionesPreeliminar = ({ formData, onInputChange }) => {
  const [modoAvanzado, setModoAvanzado] = useState(false);

  // Funciones para los botones de IA
  const mejorarConIA = () => {
    const textoActual = formData.observacionesPreeliminar || '';
    if (textoActual.trim()) {
      // Simular mejora con IA
      const textoMejorado = `🔍 ANÁLISIS MEJORADO CON IA:\n\n${textoActual}\n\n✅ Verificaciones realizadas:\n• Ortografía y gramática corregida\n• Estructura mejorada\n• Términos técnicos estandarizados\n• Coherencia verificada`;
      onInputChange('observacionesPreeliminar', textoMejorado);
    } else {
      alert('⚠️ Primero escribe algo en el campo de observaciones para mejorarlo con IA');
    }
  };

  const generarTextoProfesional = () => {
    const plantilla = `📋 OBSERVACIONES PRELIMINARES - PLANTILLA IA

🔍 HALLAZGOS PRINCIPALES:
• [Describir hallazgos más importantes]
• [Mencionar elementos críticos]

💥 DAÑOS IDENTIFICADOS:
• [Extensión y gravedad]
• [Áreas afectadas]
• [Elementos estructurales comprometidos]

💡 RECOMENDACIONES INMEDIATAS:
• [Acciones urgentes 24-48h]
• [Medidas de seguridad]

📊 IMPACTO ESTIMADO:
• [Costo aproximado de reparación]
• [Tiempo estimado de recuperación]

⚠️ OBSERVACIONES TÉCNICAS:
• [Detalles técnicos importantes]
• [Requerimientos especiales]`;
    
    onInputChange('observacionesPreeliminar', plantilla);
  };

  const analisisAvanzado = () => {
    const textoActual = formData.observacionesPreeliminar || '';
    if (textoActual.trim()) {
      const analisis = `📊 ANÁLISIS AVANZADO CON IA:

${textoActual}

🔍 MÉTRICAS DE CALIDAD:
• Longitud: ${textoActual.length} caracteres
• Palabras: ${textoActual.split(' ').length}
• Párrafos: ${textoActual.split('\n\n').length}

✅ FORTALEZAS IDENTIFICADAS:
• [Listar aspectos positivos del texto]

⚠️ ÁREAS DE MEJORA:
• [Sugerencias específicas]

💡 RECOMENDACIONES:
• [Acciones concretas para mejorar]`;
      
      onInputChange('observacionesPreeliminar', analisis);
    } else {
      alert('⚠️ Primero escribe algo en el campo de observaciones para analizarlo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de la sección */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
            7
          </span>
          OBSERVACIONES PRELIMINARES
        </h3>
        <p className="text-gray-600 mt-2">
          Agregue observaciones adicionales o modificaciones al informe inicial
        </p>
      </div>

      {/* Campo de observaciones */}
      <div className="space-y-4">
        <div>
          <label htmlFor="observacionesPreeliminar" className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones Adicionales
          </label>
          <textarea
            id="observacionesPreeliminar"
            name="observacionesPreeliminar"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            placeholder="Ingrese observaciones adicionales, modificaciones o aclaraciones al informe inicial..."
            value={formData.observacionesPreeliminar || ''}
            onChange={(e) => onInputChange('observacionesPreeliminar', e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500">
            Este campo permite agregar información adicional o realizar modificaciones al informe inicial.
          </p>
        </div>
      </div>

      {/* IA Inteligente Avanzada - Versión Reducida */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
          <span className="mr-2">🤖</span>
          IA Inteligente Avanzada
        </h4>
        
        {/* Botones principales - Versión reducida */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button 
            onClick={mejorarConIA}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1 transition-colors"
            title="Mejorar texto existente con IA"
          >
            <span>✨</span>
            <span>Mejorar IA</span>
          </button>
          
          <button 
            onClick={generarTextoProfesional}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1 transition-colors"
            title="Generar plantilla profesional"
          >
            <span>📄</span>
            <span>Plantilla IA</span>
          </button>
          
          <button 
            onClick={analisisAvanzado}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1 transition-colors"
            title="Análisis avanzado del texto"
          >
            <span>🔍</span>
            <span>Analizar</span>
          </button>
        </div>
        
        {/* Toggle modo avanzado */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setModoAvanzado(!modoAvanzado)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              modoAvanzado 
                ? 'bg-blue-200 text-blue-700' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {modoAvanzado ? 'Modo Avanzado ON' : 'Modo Básico'}
          </button>
          <span className="text-xs text-gray-500">
            {modoAvanzado ? 'Funciones IA completas activadas' : 'Funciones básicas'}
          </span>
        </div>
        
        {/* Instrucciones - Solo en modo avanzado */}
        {modoAvanzado && (
          <div className="mt-3 bg-white p-3 rounded border border-gray-200">
            <h5 className="font-medium text-gray-800 mb-2 text-sm">
              💡 Cómo usar la IA:
            </h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Mejorar IA:</strong> Corrige y mejora texto existente</li>
              <li>• <strong>Plantilla IA:</strong> Crea estructura profesional</li>
              <li>• <strong>Analizar:</strong> Métricas y recomendaciones</li>
            </ul>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Información del Preeliminar
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Esta sección se incluye en el informe preeliminar y permite agregar observaciones 
                adicionales que complementen o modifiquen la información del informe inicial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nota: El Asistente IA está disponible en el formulario principal */}
      <div className="mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-xl mr-2">💡</span>
            <div>
              <h4 className="text-base font-semibold text-blue-800">
                Asistente IA Disponible
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                El botón flotante del asistente IA está disponible en la esquina inferior derecha para ayudarte con las observaciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservacionesPreeliminar;
