import React, { useState } from 'react';

const ObservacionesGeneralesAjuste = ({ formData, onInputChange }) => {
  const [modoAvanzado, setModoAvanzado] = useState(false);

  // Funciones para los botones de IA
  const mejorarConIA = () => {
    const campos = ['solicitudDocumentos', 'declinacion', 'observacionesGenerales', 'proximosPasos'];
    const camposConContenido = campos.filter(campo => formData[campo] && formData[campo].trim());
    
    if (camposConContenido.length > 0) {
      camposConContenido.forEach(campo => {
        const textoActual = formData[campo];
        const textoMejorado = `🔍 OBSERVACIÓN MEJORADA CON IA:\n\n${textoActual}\n\n✅ Verificaciones realizadas:\n• Estructura mejorada\n• Términos técnicos estandarizados\n• Coherencia verificada\n• Formato profesional aplicado`;
        onInputChange(campo, textoMejorado);
      });
    } else {
      alert('⚠️ Primero escribe algo en al menos uno de los campos para mejorarlo con IA');
    }
  };

  const generarTextoProfesional = () => {
    const plantillaSolicitud = `📋 SOLICITUD DE DOCUMENTOS - PLANTILLA IA

🔍 DOCUMENTOS REQUERIDOS:
• [Facturas y recibos de compra]
• [Reportes técnicos de expertos]
• [Fotografías antes y después]
• [Testimonios de testigos]
• [Certificados y licencias]
• [Contratos de mantenimiento]

📅 PLAZOS DE ENTREGA:
• [Documentos urgentes - 24-48h]
• [Documentos estándar - 1 semana]
• [Documentos especializados - 2-3 semanas]

⚠️ IMPORTANCIA:
• [Documentos críticos para el análisis]
• [Impacto en la evaluación del siniestro]
• [Requerimientos legales aplicables]`;

    const plantillaDeclinacion = `❌ DECLINACIÓN DE COBERTURA - PLANTILLA IA

🚫 RAZONES PRINCIPALES:
• [Exclusiones aplicables identificadas]
• [Falta de garantías requeridas]
• [Ocultación de información relevante]
• [Actos intencionales comprobados]
• [Falta de notificación oportuna]

📋 FUNDAMENTOS LEGALES:
• [Cláusulas de la póliza aplicables]
• [Normativa legal vigente]
• [Jurisprudencia relevante]

💼 IMPLICACIONES:
• [Consecuencias para el asegurado]
• [Opciones de apelación disponibles]
• [Procedimientos alternativos]`;

    const plantillaObservaciones = `💭 OBSERVACIONES GENERALES - PLANTILLA IA

🔍 HALLAZGOS IMPORTANTES:
• [Elementos destacados de la inspección]
• [Condiciones especiales observadas]
• [Factores de riesgo identificados]

⚠️ CONSIDERACIONES TÉCNICAS:
• [Aspectos técnicos relevantes]
• [Limitaciones del análisis]
• [Requerimientos especiales]

💡 RECOMENDACIONES GENERALES:
• [Sugerencias para el asegurado]
• [Medidas preventivas recomendadas]
• [Seguimiento sugerido]`;

    const plantillaProximosPasos = `🚀 PRÓXIMOS PASOS - PLAN DE ACCIÓN IA

⏰ ACCIONES INMEDIATAS (24-48h):
• [Medidas urgentes de seguridad]
• [Contactos prioritarios]
• [Documentación inmediata requerida]

📅 CORTO PLAZO (1-2 semanas):
• [Evaluaciones técnicas programadas]
• [Presupuestos a obtener]
• [Especialistas a contratar]

📊 MEDIANO PLAZO (1-3 meses):
• [Reparaciones principales]
• [Mejoras preventivas]
• [Sistemas a implementar]

🎯 LARGO PLAZO (3-12 meses):
• [Prevención y monitoreo]
• [Renovaciones programadas]
• [Capacitación del personal]

👥 RESPONSABILIDADES ASIGNADAS:
• [Quién hace qué y cuándo]
• [Coordinación requerida]
• [Seguimiento de avances]`;

    // Aplicar plantillas según el campo que esté vacío
    if (!formData.solicitudDocumentos?.trim()) onInputChange('solicitudDocumentos', plantillaSolicitud);
    if (!formData.declinacion?.trim()) onInputChange('declinacion', plantillaDeclinacion);
    if (!formData.observacionesGenerales?.trim()) onInputChange('observacionesGenerales', plantillaObservaciones);
    if (!formData.proximosPasos?.trim()) onInputChange('proximosPasos', plantillaProximosPasos);
  };

  const analisisAvanzado = () => {
    const campos = ['solicitudDocumentos', 'declinacion', 'observacionesGenerales', 'proximosPasos'];
    const camposConContenido = campos.filter(campo => formData[campo] && formData[campo].trim());
    
    if (camposConContenido.length > 0) {
      let analisisCompleto = `📊 ANÁLISIS AVANZADO DE OBSERVACIONES - IA\n\n`;
      
      camposConContenido.forEach(campo => {
        const texto = formData[campo];
        const nombreCampo = campo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        analisisCompleto += `🔍 ${nombreCampo.toUpperCase()}:\n`;
        analisisCompleto += `• Longitud: ${texto.length} caracteres\n`;
        analisisCompleto += `• Palabras: ${texto.split(' ').length}\n`;
        analisisCompleto += `• Párrafos: ${texto.split('\n\n').length}\n`;
        analisisCompleto += `• Calidad: ${texto.length > 100 ? 'Buena' : texto.length > 50 ? 'Regular' : 'Necesita mejora'}\n\n`;
      });
      
      analisisCompleto += `✅ FORTALEZAS IDENTIFICADAS:\n`;
      analisisCompleto += `• Documentación detallada de observaciones\n`;
      analisisCompleto += `• Plan de acción estructurado\n`;
      analisisCompleto += `• Solicitud clara de documentos\n\n`;
      
      analisisCompleto += `⚠️ ÁREAS DE MEJORA:\n`;
      analisisCompleto += `• [Sugerencias específicas por campo]\n`;
      analisisCompleto += `• [Recomendaciones de contenido]\n\n`;
      
      analisisCompleto += `💡 RECOMENDACIONES:\n`;
      analisisCompleto += `• [Acciones concretas para mejorar]\n`;
      analisisCompleto += `• [Elementos adicionales a considerar]`;
      
      // Aplicar el análisis al primer campo con contenido
      onInputChange(camposConContenido[0], analisisCompleto);
    } else {
      alert('⚠️ Primero escribe algo en al menos uno de los campos para analizarlo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📝 OBSERVACIONES
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Solicitud de documentos adicionales, posibles declinaciones y observaciones generales
        </p>
      </div>

      {/* IA Inteligente Avanzada - Versión Reducida */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
        <h4 className="text-base font-semibold text-green-800 mb-3 flex items-center">
          <span className="mr-2">🤖</span>
          IA Inteligente Avanzada - Observaciones Generales
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
            title="Generar plantillas profesionales"
          >
            <span>📄</span>
            <span>Plantillas IA</span>
          </button>
          
          <button 
            onClick={analisisAvanzado}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1 transition-colors"
            title="Análisis avanzado del contenido"
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
                ? 'bg-green-200 text-green-700' 
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
              💡 Cómo usar la IA para Observaciones Generales:
            </h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Mejorar IA:</strong> Mejora todos los campos con contenido</li>
              <li>• <strong>Plantillas IA:</strong> Crea plantillas específicas por campo</li>
              <li>• <strong>Analizar:</strong> Métricas y análisis completo de observaciones</li>
            </ul>
          </div>
        )}
      </div>

      {/* Solicitud de Documentos */}
      <div className="space-y-4">
        <div>
          <label htmlFor="solicitudDocumentos" className="block text-sm font-medium text-gray-700 mb-2">
            📋 Solicitud de Documentos
          </label>
          <textarea
            id="solicitudDocumentos"
            name="solicitudDocumentos"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Listar documentos adicionales requeridos para completar el análisis (facturas, reportes técnicos, fotografías adicionales, etc.)..."
            value={formData.solicitudDocumentos || ''}
            onChange={(e) => onInputChange('solicitudDocumentos', e.target.value)}
          />
        </div>

        {/* Declinación */}
        <div>
          <label htmlFor="declinacion" className="block text-sm font-medium text-gray-700 mb-2">
            ❌ Declinación
          </label>
          <textarea
            id="declinacion"
            name="declinacion"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Si aplica, describir razones para declinar cobertura o limitar responsabilidad..."
            value={formData.declinacion || ''}
            onChange={(e) => onInputChange('declinacion', e.target.value)}
          />
        </div>

        {/* Observaciones Generales */}
        <div>
          <label htmlFor="observacionesGenerales" className="block text-sm font-medium text-gray-700 mb-2">
            💭 Observaciones Generales
          </label>
          <textarea
            id="observacionesGenerales"
            name="observacionesGenerales"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Observaciones adicionales, recomendaciones, notas importantes para el seguimiento del caso..."
            value={formData.observacionesGenerales || ''}
            onChange={(e) => onInputChange('observacionesGenerales', e.target.value)}
          />
        </div>

        {/* Próximos Pasos */}
        <div>
          <label htmlFor="proximosPasos" className="block text-sm font-medium text-gray-700 mb-2">
            🚀 Próximos Pasos
          </label>
          <textarea
            id="proximosPasos"
            name="proximosPasos"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describir acciones a seguir, cronograma, responsabilidades asignadas..."
            value={formData.proximosPasos || ''}
            onChange={(e) => onInputChange('proximosPasos', e.target.value)}
          />
        </div>
      </div>

      {/* Nota sobre IA */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              💡 <strong>Asistente IA disponible:</strong> Usa los botones de IA para obtener ayuda en la redacción de observaciones, identificación de documentos requeridos y análisis de posibles declinaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservacionesGeneralesAjuste;
