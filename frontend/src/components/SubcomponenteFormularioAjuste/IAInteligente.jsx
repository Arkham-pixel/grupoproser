import React, { useState } from 'react';
import { FaMagic, FaSpellCheck, FaLightbulb, FaChartLine, FaCopy, FaCheck, FaBrain, FaRocket, FaStar } from 'react-icons/fa';
import IAService from '../../services/iaService';

export default function IAInteligente({ 
  textoActual, 
  onTextoCambiado, 
  contextoFormulario, 
  tipoSeccion,
  tituloSeccion 
}) {
  const [mostrandoIA, setMostrandoIA] = useState(false);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [textoMejorado, setTextoMejorado] = useState('');
  const [ideasGeneradas, setIdeasGeneradas] = useState([]);
  const [analisisCalidad, setAnalisisCalidad] = useState(null);
  const [modoAvanzado, setModoAvanzado] = useState(false);

  // Función principal para mejorar el texto con IA avanzada
  const mejorarTexto = async () => {
    if (!textoActual || textoActual.trim().length < 10) {
      alert('Por favor, escribe al menos 10 palabras para que la IA pueda ayudarte a mejorar el texto.');
      return;
    }

    setProcesando(true);
    setMostrandoIA(true);

    try {
      // Simular procesamiento de IA avanzada
      setTimeout(() => {
        const resultado = IAService.mejorarArgumento(textoActual, contextoFormulario);
        setResultadoIA(resultado);
        setTextoMejorado(resultado.textoMejorado);
        
        // Generar ideas contextuales avanzadas
        const ideas = IAService.generarIdeasContextuales(textoActual, contextoFormulario);
        setIdeasGeneradas(ideas);
        
        // Analizar calidad del texto con métricas avanzadas
        const analisis = IAService.analizarCalidadTexto(textoActual, contextoFormulario);
        setAnalisisCalidad(analisis);
        
        setProcesando(false);
      }, 2500);
    } catch (error) {
      console.error('Error en IA:', error);
      setProcesando(false);
    }
  };

  // Aplicar el texto mejorado
  const aplicarTextoMejorado = () => {
    if (textoMejorado) {
      onTextoCambiado(textoMejorado);
      setTextoMejorado('');
      setMostrandoIA(false);
    }
  };

  // Generar texto profesional desde cero
  const generarTextoProfesional = () => {
    const textoGenerado = IAService.generarTextoProfesional(tipoSeccion, contextoFormulario, textoActual);
    setTextoMejorado(textoGenerado);
    setMostrandoIA(true);
  };

  // Copiar texto al portapapeles
  const copiarTexto = (texto) => {
    navigator.clipboard.writeText(texto);
    // Mostrar feedback visual
    const boton = document.querySelector(`[data-texto="${texto.substring(0, 20)}"]`);
    if (boton) {
      const originalText = boton.innerHTML;
      boton.innerHTML = '<FaCheck className="h-4 w-4" /> Copiado';
      setTimeout(() => {
        boton.innerHTML = originalText;
      }, 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-900 flex items-center">
          <FaBrain className="mr-3 text-purple-600" />
          IA Inteligente Avanzada - {tituloSeccion}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModoAvanzado(!modoAvanzado)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              modoAvanzado 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaRocket className="inline mr-1" />
            {modoAvanzado ? 'Modo Avanzado' : 'Modo Básico'}
          </button>
          <button
            onClick={() => setMostrandoIA(!mostrandoIA)}
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            {mostrandoIA ? 'Ocultar' : 'Mostrar'} IA
          </button>
        </div>
      </div>

      {/* Botones de acción mejorados */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={mejorarTexto}
          disabled={procesando || !textoActual}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
        >
          {procesando ? (
            <>
              <FaSpellCheck className="mr-3 animate-spin text-xl" />
              <span className="text-lg font-medium">Procesando IA Avanzada...</span>
            </>
          ) : (
            <>
              <FaSpellCheck className="mr-3 text-xl" />
              <span className="text-lg font-medium">🚀 Mejorar con IA Avanzada</span>
            </>
          )}
        </button>

        <button
          onClick={generarTextoProfesional}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
        >
          <FaLightbulb className="mr-3 text-xl" />
          <span className="text-lg font-medium">✨ Generar Texto Profesional</span>
        </button>

        <button
          onClick={() => {
            const analisis = IAService.analizarCalidadTexto(textoActual, contextoFormulario);
            setAnalisisCalidad(analisis);
            setMostrandoIA(true);
          }}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
        >
          <FaChartLine className="mr-3 text-xl" />
          <span className="text-lg font-medium">📊 Análisis Avanzado</span>
        </button>
      </div>

      {/* Resultados de la IA Avanzada */}
      {mostrandoIA && (
        <div className="space-y-6">
          {/* Indicador de procesamiento mejorado */}
          {procesando && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
              <p className="text-purple-600 font-bold text-xl mb-2">IA Avanzada en Acción</p>
              <p className="text-gray-600 mb-4">Analizando, mejorando y optimizando tu texto...</p>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}

          {/* Resultado del análisis avanzado */}
          {resultadoIA && !procesando && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <FaStar className="mr-2 text-yellow-500" />
                Análisis IA Avanzado Completado
              </h4>
              
              {/* Calidad del texto con indicadores visuales */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-700">Calidad del Texto:</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      resultadoIA.nivelCalidad >= 90 ? 'bg-green-100 text-green-800' :
                      resultadoIA.nivelCalidad >= 80 ? 'bg-blue-100 text-blue-800' :
                      resultadoIA.nivelCalidad >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      resultadoIA.nivelCalidad >= 60 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {resultadoIA.nivelCalidad}/100
                    </span>
                    {resultadoIA.nivelCalidad >= 90 && (
                      <FaStar className="text-yellow-500 text-xl" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${
                      resultadoIA.nivelCalidad >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      resultadoIA.nivelCalidad >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      resultadoIA.nivelCalidad >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      resultadoIA.nivelCalidad >= 60 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${resultadoIA.nivelCalidad}%` }}
                  ></div>
                </div>
              </div>

              {/* Análisis profundo si está disponible */}
              {resultadoIA.analisisProfundo && modoAvanzado && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <FaBrain className="mr-2" />
                    Análisis Profundo del Texto
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{resultadoIA.analisisProfundo.nivelTecnico}%</div>
                      <div className="text-xs text-purple-700">Nivel Técnico</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{resultadoIA.analisisProfundo.profesionalismo}%</div>
                      <div className="text-xs text-blue-700">Profesionalismo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{resultadoIA.analisisProfundo.coherencia}%</div>
                      <div className="text-xs text-green-700">Coherencia</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{resultadoIA.analisisProfundo.completitud}%</div>
                      <div className="text-xs text-orange-700">Completitud</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Correcciones ortográficas con contexto */}
              {resultadoIA.correcciones.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <FaSpellCheck className="mr-2 text-green-500" />
                    Correcciones Ortográficas y de Contexto:
                  </h5>
                  <div className="space-y-3">
                    {resultadoIA.correcciones.map((correccion, index) => (
                      <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            <span className="line-through text-red-600">{correccion.original}</span>
                            <span className="mx-3 text-gray-500">→</span>
                            <span className="text-green-600 font-bold">{correccion.corregido}</span>
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {correccion.tipo}
                          </span>
                        </div>
                        {correccion.contexto && (
                          <p className="text-xs text-gray-600 italic">{correccion.contexto}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugerencias de mejora contextuales */}
              {resultadoIA.sugerencias.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <FaLightbulb className="mr-2 text-yellow-500" />
                    Sugerencias de Mejora Contextuales:
                  </h5>
                  <ul className="space-y-2">
                    {resultadoIA.sugerencias.map((sugerencia, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">💡</span>
                        <span className="text-sm text-gray-700">{sugerencia}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Estadísticas mejoradas */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">{resultadoIA.longitudOriginal}</div>
                  <div className="text-gray-500">Palabras Originales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{resultadoIA.longitudMejorada}</div>
                  <div className="text-gray-500">Palabras Mejoradas</div>
                </div>
              </div>
            </div>
          )}

          {/* Texto mejorado con opciones avanzadas */}
          {textoMejorado && !procesando && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <FaMagic className="mr-2 text-purple-500" />
                Texto Mejorado por IA Avanzada:
              </h4>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="text-gray-800 leading-relaxed text-lg">{textoMejorado}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={aplicarTextoMejorado}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                >
                  <FaCheck className="mr-2" />
                  ✅ Aplicar Texto Mejorado
                </button>
                <button
                  onClick={() => copiarTexto(textoMejorado)}
                  data-texto={textoMejorado.substring(0, 20)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                >
                  <FaCopy className="mr-2" />
                  📋 Copiar al Portapapeles
                </button>
              </div>
            </div>
          )}

          {/* Ideas contextuales avanzadas */}
          {ideasGeneradas.length > 0 && !procesando && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <FaLightbulb className="mr-2 text-yellow-500" />
                Ideas Avanzadas Basadas en tu Texto:
              </h4>
              <div className="space-y-4">
                {ideasGeneradas.map((categoria, index) => (
                  <div key={index} className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-4">
                    <h5 className="font-semibold text-blue-700 mb-3 text-lg">{categoria.categoria}:</h5>
                    <ul className="space-y-2">
                      {categoria.sugerencias.map((sugerencia, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <FaLightbulb className="mr-2 text-yellow-500 text-xs mt-1 flex-shrink-0" />
                          <span>{sugerencia}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Análisis de calidad avanzado */}
          {analisisCalidad && !procesando && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <FaChartLine className="mr-2 text-orange-500" />
                Análisis Avanzado de Calidad del Texto:
              </h4>
              
              {/* Puntaje con clasificación avanzada */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-700">Puntaje General:</span>
                  <span className={`px-4 py-2 rounded-full text-lg font-bold ${
                    analisisCalidad.puntaje >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                    analisisCalidad.puntaje >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                    analisisCalidad.puntaje >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                    analisisCalidad.puntaje >= 60 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
                    'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  }`}>
                    {analisisCalidad.puntaje}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-700 ${
                      analisisCalidad.puntaje >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      analisisCalidad.puntaje >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      analisisCalidad.puntaje >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      analisisCalidad.puntaje >= 60 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${analisisCalidad.puntaje}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-semibold text-gray-700">{analisisCalidad.clasificacion}</span>
                </div>
              </div>

              {/* Métricas avanzadas */}
              {analisisCalidad.metricas && (
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Métricas del Texto:</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{analisisCalidad.metricas.longitud}</div>
                      <div className="text-xs text-gray-500">Total de Palabras</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(analisisCalidad.metricas.longitud / 10)}</div>
                      <div className="text-xs text-gray-500">Palabras por Línea</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fortalezas */}
              {analisisCalidad.fortalezas.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-green-700 mb-3 flex items-center">
                    <FaStar className="mr-2" />
                    ✅ Fortalezas Identificadas:
                  </h5>
                  <ul className="space-y-2">
                    {analisisCalidad.fortalezas.map((fortaleza, index) => (
                      <li key={index} className="text-sm text-green-600 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        {fortaleza}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Áreas de mejora */}
              {analisisCalidad.areasMejora.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-semibold text-orange-700 mb-3 flex items-center">
                    <FaChartLine className="mr-2" />
                    ⚠️ Áreas de Mejora Identificadas:
                  </h5>
                  <ul className="space-y-2">
                    {analisisCalidad.areasMejora.map((area, index) => (
                      <li key={index} className="text-sm text-orange-600 flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">⚠</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recomendaciones avanzadas */}
              {analisisCalidad.recomendaciones.length > 0 && (
                <div>
                  <h5 className="font-semibold text-blue-700 mb-3 flex items-center">
                    <FaLightbulb className="mr-2" />
                    💡 Recomendaciones de Mejora:
                  </h5>
                  <ul className="space-y-2">
                    {analisisCalidad.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="text-sm text-blue-600 flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">💡</span>
                        {recomendacion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instrucciones de uso mejoradas */}
      {!mostrandoIA && (
        <div className="text-sm text-blue-800 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border border-blue-200">
          <p className="mb-3 font-semibold text-lg">
            <FaBrain className="inline mr-2 text-purple-600" />
            🚀 Cómo usar la IA Inteligente Avanzada:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Escribe tu idea inicial</strong> en el campo de texto de la sección</li>
            <li><strong>Haz clic en "Mejorar con IA Avanzada"</strong> para corrección ortográfica, mejora de argumentos y análisis profundo</li>
            <li><strong>Usa "Generar Texto Profesional"</strong> para crear contenido desde cero con plantillas inteligentes</li>
            <li><strong>Analiza la calidad</strong> con métricas avanzadas y recomendaciones específicas</li>
            <li><strong>Activa el "Modo Avanzado"</strong> para análisis profundo y métricas detalladas</li>
          </ul>
        </div>
      )}
    </div>
  );
}
