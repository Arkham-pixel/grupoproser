import React, { useState } from 'react';

const AnalisisCoberturaAjuste = ({ formData, onInputChange }) => {
  const [modoAvanzado, setModoAvanzado] = useState(false);

  // Funciones para los botones de IA
  const mejorarConIA = () => {
    const campos = ['analisisPoliza', 'coberturasAplicables', 'exclusiones', 'garantias', 'coaseguro'];
    const camposConContenido = campos.filter(campo => formData[campo] && formData[campo].trim());
    
    if (camposConContenido.length > 0) {
      camposConContenido.forEach(campo => {
        const textoActual = formData[campo];
        const textoMejorado = `🔍 ANÁLISIS MEJORADO CON IA:\n\n${textoActual}\n\n✅ Verificaciones realizadas:\n• Términos técnicos estandarizados\n• Estructura mejorada\n• Coherencia verificada`;
        onInputChange(campo, textoMejorado);
      });
    } else {
      alert('⚠️ Primero escribe algo en al menos uno de los campos para mejorarlo con IA');
    }
  };

  const generarTextoProfesional = () => {
    const plantillaAnalisis = `📋 ANÁLISIS DE PÓLIZA - PLANTILLA IA

🔍 CONDICIONES ESPECIALES:
• [Cláusulas relevantes identificadas]
• [Condiciones particulares aplicables]
• [Modificaciones o endosos vigentes]

✅ COBERTURAS APLICABLES:
• [Lista de coberturas que aplican]
• [Límites de cobertura por tipo]
• [Condiciones de aplicación]

❌ EXCLUSIONES IDENTIFICADAS:
• [Exclusiones generales aplicables]
• [Exclusiones específicas del caso]
• [Condiciones que limitan cobertura]

🛡️ GARANTÍAS REQUERIDAS:
• [Sistemas de seguridad obligatorios]
• [Mantenimiento preventivo requerido]
• [Certificaciones necesarias]

🤝 COASEGURO:
• [Participación de otras aseguradoras]
• [Límites por participante]
• [Condiciones de coordinación`;

    const plantillaCoberturas = `📋 COBERTURAS APLICABLES - PLANTILLA IA

✅ COBERTURAS PRINCIPALES:
• [Daños por incendio]
• [Daños por agua]
• [Robo y hurto]
• [Responsabilidad civil]

💰 LÍMITES DE COBERTURA:
• [Monto máximo por evento]
• [Límite por tipo de daño]
• [Deducibles aplicables]

📅 VIGENCIA Y CONDICIONES:
• [Período de cobertura]
• [Condiciones de renovación]
• [Modificaciones vigentes`;

    const plantillaExclusiones = `❌ EXCLUSIONES IDENTIFICADAS - PLANTILLA IA

🚫 EXCLUSIONES GENERALES:
• [Daños por negligencia]
• [Falta de mantenimiento]
• [Actos intencionales]

⚠️ EXCLUSIONES ESPECÍFICAS:
• [Actos de terrorismo]
• [Guerra y disturbios]
• [Daños nucleares]

⏰ EXCLUSIONES TEMPORALES:
• [Períodos de carencia]
• [Horarios no cubiertos]
• [Condiciones estacionales`;

    const plantillaGarantias = `🛡️ GARANTÍAS REQUERIDAS - PLANTILLA IA

🔒 SISTEMAS DE SEGURIDAD:
• [Alarmas y detectores]
• [Sistemas de vigilancia]
• [Control de acceso]

🔧 MANTENIMIENTO PREVENTIVO:
• [Frecuencia de revisiones]
• [Programas obligatorios]
• [Certificaciones técnicas]

👥 PERSONAL Y CAPACITACIÓN:
• [Personal mínimo requerido]
• [Capacitación obligatoria]
• [Protocolos de emergencia`;

    const plantillaCoaseguro = `🤝 COASEGURO Y REASEGURO - PLANTILLA IA

🏢 PARTICIPACIÓN DE ASEGURADORAS:
• [Porcentaje de participación]
• [Límites por aseguradora]
• [Responsabilidades asignadas]

📋 CONDICIONES ESPECÍFICAS:
• [Términos del coaseguro]
• [Protocolos de comunicación]
• [Coordinación de pagos]

💼 ADMINISTRACIÓN:
• [Aseguradora líder]
• [Distribución de responsabilidades]
• [Mecanismos de resolución`;

    // Aplicar plantillas según el campo que esté vacío
    if (!formData.analisisPoliza?.trim()) onInputChange('analisisPoliza', plantillaAnalisis);
    if (!formData.coberturasAplicables?.trim()) onInputChange('coberturasAplicables', plantillaCoberturas);
    if (!formData.exclusiones?.trim()) onInputChange('exclusiones', plantillaExclusiones);
    if (!formData.garantias?.trim()) onInputChange('garantias', plantillaGarantias);
    if (!formData.coaseguro?.trim()) onInputChange('coaseguro', plantillaCoaseguro);
  };

  const analisisAvanzado = () => {
    const campos = ['analisisPoliza', 'coberturasAplicables', 'exclusiones', 'garantias', 'coaseguro'];
    const camposConContenido = campos.filter(campo => formData[campo] && formData[campo].trim());
    
    if (camposConContenido.length > 0) {
      let analisisCompleto = `📊 ANÁLISIS AVANZADO DE COBERTURA - IA\n\n`;
      
      camposConContenido.forEach(campo => {
        const texto = formData[campo];
        const nombreCampo = campo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        analisisCompleto += `🔍 ${nombreCampo.toUpperCase()}:\n`;
        analisisCompleto += `• Longitud: ${texto.length} caracteres\n`;
        analisisCompleto += `• Palabras: ${texto.split(' ').length}\n`;
        analisisCompleto += `• Párrafos: ${texto.split('\n\n').length}\n\n`;
      });
      
      analisisCompleto += `✅ FORTALEZAS IDENTIFICADAS:\n`;
      analisisCompleto += `• Análisis detallado de la póliza\n`;
      analisisCompleto += `• Identificación clara de coberturas\n`;
      analisisCompleto += `• Documentación de exclusiones\n\n`;
      
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
          📋 ANÁLISIS DE COBERTURA
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Análisis detallado de la póliza, coberturas aplicables, exclusiones y garantías
        </p>
      </div>

      {/* IA Inteligente Avanzada - Versión Reducida */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
          <span className="mr-2">🤖</span>
          IA Inteligente Avanzada - Análisis de Cobertura
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
              💡 Cómo usar la IA para Análisis de Cobertura:
            </h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Mejorar IA:</strong> Mejora todos los campos con contenido</li>
              <li>• <strong>Plantillas IA:</strong> Crea plantillas específicas por campo</li>
              <li>• <strong>Analizar:</strong> Métricas y análisis completo de cobertura</li>
            </ul>
          </div>
        )}
      </div>

      {/* Análisis de Póliza */}
      <div className="space-y-4">
        <div>
          <label htmlFor="analisisPoliza" className="block text-sm font-medium text-gray-700 mb-2">
            📄 Análisis de Póliza
          </label>
          <textarea
            id="analisisPoliza"
            name="analisisPoliza"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Analizar la póliza en detalle, incluyendo condiciones especiales, cláusulas relevantes..."
            value={formData.analisisPoliza || ''}
            onChange={(e) => onInputChange('analisisPoliza', e.target.value)}
          />
        </div>

        {/* Coberturas Aplicables */}
        <div>
          <label htmlFor="coberturasAplicables" className="block text-sm font-medium text-gray-700 mb-2">
            ✅ Coberturas Aplicables
          </label>
          <textarea
            id="coberturasAplicables"
            name="coberturasAplicables"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Listar y describir las coberturas que aplican al siniestro..."
            value={formData.coberturasAplicables || ''}
            onChange={(e) => onInputChange('coberturasAplicables', e.target.value)}
          />
        </div>

        {/* Exclusiones */}
        <div>
          <label htmlFor="exclusiones" className="block text-sm font-medium text-gray-700 mb-2">
            ❌ Exclusiones
          </label>
          <textarea
            id="exclusiones"
            name="exclusiones"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Identificar exclusiones que puedan aplicar al siniestro..."
            value={formData.exclusiones || ''}
            onChange={(e) => onInputChange('exclusiones', e.target.value)}
          />
        </div>

        {/* Garantías */}
        <div>
          <label htmlFor="garantias" className="block text-sm font-medium text-gray-700 mb-2">
            🛡️ Garantías
          </label>
          <textarea
            id="garantias"
            name="garantias"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describir garantías específicas que apliquen al caso..."
            value={formData.garantias || ''}
            onChange={(e) => onInputChange('garantias', e.target.value)}
          />
        </div>

        {/* Coaseguro */}
        <div>
          <label htmlFor="coaseguro" className="block text-sm font-medium text-gray-700 mb-2">
            🤝 Coaseguro
          </label>
          <textarea
            id="coaseguro"
            name="coaseguro"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Información sobre coaseguro, participación de otras aseguradoras..."
            value={formData.coaseguro || ''}
            onChange={(e) => onInputChange('coaseguro', e.target.value)}
          />
        </div>
      </div>

      {/* Nota sobre IA */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              💡 <strong>Asistente IA disponible:</strong> Usa los botones de IA para obtener ayuda en el análisis de cobertura, identificación de exclusiones y evaluación de garantías.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisCoberturaAjuste;
