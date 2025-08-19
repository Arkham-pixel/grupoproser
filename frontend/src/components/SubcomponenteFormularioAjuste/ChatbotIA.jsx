import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaLightbulb, FaChevronUp, FaChevronDown } from 'react-icons/fa';

export default function ChatbotIA({ formData, onInputChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Respuestas inteligentes basadas en el contexto del formulario
  const generarRespuestaIA = (mensaje, contexto) => {
    const mensajeLower = mensaje.toLowerCase();
    
    // Respuestas para campos específicos
    if (mensajeLower.includes('reporte') || mensajeLower.includes('número') || mensajeLower.includes('report')) {
      return {
        tipo: 'ayuda',
        contenido: `📋 **Campo REPORTE No:**\n\nPara este campo puedes usar:\n• Formato: RPT-2024-001\n• Secuencial automático del sistema\n• Referencia interna del cliente\n• Número de caso asignado`,
        accion: 'llenarCampo',
        campo: 'reporteNo',
        valor: `RPT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        icono: '📋'
      };
    }

    if (mensajeLower.includes('ciudad') || mensajeLower.includes('ubicación') || mensajeLower.includes('location')) {
      return {
        tipo: 'ayuda',
        contenido: `🏙️ **Campo Ciudad:**\n\nPara este campo:\n• Usa el dropdown inteligente (botón con flecha)\n• Busca por nombre de ciudad o departamento\n• Se autocompleta automáticamente\n• Incluye todas las ciudades de Colombia`,
        accion: 'mostrarDropdown',
        campo: 'ciudad',
        icono: '🏙️'
      };
    }

    if (mensajeLower.includes('aseguradora') || mensajeLower.includes('compañía') || mensajeLower.includes('insurance')) {
      return {
        tipo: 'ayuda',
        contenido: `🏢 **Campo Aseguradora:**\n\nPara este campo:\n• Selecciona del dropdown inteligente\n• Verás el número de funcionarios por aseguradora\n• Se filtra automáticamente mientras escribes\n• Incluye todas las aseguradoras del sistema`,
        accion: 'mostrarDropdown',
        campo: 'aseguradora',
        icono: '🏢'
      };
    }

    if (mensajeLower.includes('antecedentes') || mensajeLower.includes('descripción') || mensajeLower.includes('background')) {
      return {
        tipo: 'ayuda',
        contenido: `📖 **Sección Antecedentes:**\n\nPara esta sección:\n• Describe qué pasó ANTES del siniestro\n• Incluye fecha, hora y circunstancias\n• Sé específico y detallado\n• Usa el asistente IA para plantillas\n• Mínimo 50 palabras recomendado`,
        accion: 'irSeccion',
        seccion: 'antecedentes',
        icono: '📖'
      };
    }

    if (mensajeLower.includes('reserva') || mensajeLower.includes('monto') || mensajeLower.includes('amount')) {
      return {
        tipo: 'ayuda',
        contenido: `💰 **Reserva Sugerida:**\n\nPara este campo:\n• Se calcula automáticamente según el tipo de evento\n• Puedes ajustar manualmente si es necesario\n• Incluye justificación de la reserva\n• Usa el asistente IA para sugerencias\n• Considera el valor asegurado`,
        accion: 'irSeccion',
        seccion: 'reserva',
        icono: '💰'
      };
    }

    if (mensajeLower.includes('intermediario') || mensajeLower.includes('broker')) {
      return {
        tipo: 'ayuda',
        contenido: `🤝 **Campo Intermediario:**\n\nPara este campo:\n• Selecciona del dropdown inteligente\n• Incluye intermediarios principales del sistema\n• Se filtra automáticamente\n• Si no encuentras el tuyo, selecciona "Otro"`,
        accion: 'mostrarDropdown',
        campo: 'intermediario',
        icono: '🤝'
      };
    }

    if (mensajeLower.includes('tipo de evento') || mensajeLower.includes('evento') || mensajeLower.includes('event')) {
      return {
        tipo: 'ayuda',
        contenido: `🎯 **Campo Tipo de Evento:**\n\nPara este campo:\n• Selecciona del dropdown las opciones disponibles\n• Incluye: Incendio, Inundación, Robo, Accidente\n• También: Daño por agua, Vandalismo, Falla eléctrica\n• Si no aplica, selecciona "Otro"`,
        accion: 'mostrarDropdown',
        campo: 'tipoEvento',
        icono: '🎯'
      };
    }

    if (mensajeLower.includes('fecha') || mensajeLower.includes('date')) {
      return {
        tipo: 'ayuda',
        contenido: `📅 **Campos de Fecha:**\n\nEn el formulario tienes:\n• **Fecha de Ocurrencia:** Cuándo pasó el siniestro\n• **Fecha de Asignación:** Cuándo se asignó el caso\n• **Fecha de Visita:** Cuándo se realizó la inspección\n\nUsa el formato DD/MM/AAAA`,
        accion: 'general',
        icono: '📅'
      };
    }

    if (mensajeLower.includes('ayuda') || mensajeLower.includes('cómo') || mensajeLower.includes('help')) {
      return {
        tipo: 'ayuda',
        contenido: `🤖 **¡Hola! Soy tu asistente IA**\n\nTe puedo ayudar con:\n• 📋 Cómo llenar campos específicos\n• 📖 Explicaciones de secciones\n• 💰 Cálculos automáticos\n• 💡 Sugerencias de contenido\n• 🎯 Navegación por el formulario\n\n¡Pregúntame lo que necesites!`,
        accion: 'general',
        icono: '🤖'
      };
    }

    if (mensajeLower.includes('generar') || mensajeLower.includes('documento') || mensajeLower.includes('word')) {
      return {
        tipo: 'ayuda',
        contenido: `📄 **Generar Documento Word:**\n\nPara generar el documento:\n• Completa al menos los campos obligatorios\n• Haz clic en "📄 Generar Documento"\n• Se creará un archivo .docx profesional\n• Se guardará automáticamente en el historial\n• Incluye toda la información del formulario`,
        accion: 'general',
        icono: '📄'
      };
    }

    if (mensajeLower.includes('guardar') || mensajeLower.includes('save')) {
      return {
        tipo: 'ayuda',
        contenido: `💾 **Guardar Formulario:**\n\nPara guardar el formulario:\n• Haz clic en "💾 Guardar Formulario"\n• Se guardará en el historial del sistema\n• Podrás editarlo más tarde\n• Se incluirá en los reportes\n• Se asocia con tu usuario`,
        accion: 'general',
        icono: '💾'
      };
    }

    // Respuesta por defecto
    return {
      tipo: 'ayuda',
      contenido: `🤔 **Entiendo tu pregunta:** "${mensaje}"\n\nTe sugiero ser más específico:\n• Pregunta sobre campos específicos\n• Usa palabras como "ayuda", "cómo", "explica"\n• Menciona el nombre del campo o sección\n• Ejemplo: "¿Cómo lleno el campo ciudad?"`,
      accion: 'general',
      icono: '🤔'
    };
  };

  const enviarMensaje = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      tipo: 'usuario',
      contenido: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular procesamiento de IA
    setTimeout(() => {
      const respuesta = generarRespuestaIA(inputMessage, formData);
      
      const aiMessage = {
        id: Date.now() + 1,
        tipo: 'ia',
        contenido: respuesta.contenido,
        accion: respuesta.accion,
        campo: respuesta.campo,
        valor: respuesta.valor,
        seccion: respuesta.seccion,
        icono: respuesta.icono,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Ejecutar acción si es necesaria
      if (respuesta.accion === 'llenarCampo' && respuesta.campo) {
        onInputChange(resposta.campo, respuesta.valor);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const limpiarChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Botón flotante del chatbot */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group animate-pulse"
        title="Asistente IA - Haz clic para abrir"
      >
        <FaRobot className="h-6 w-6" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          🤖 Asistente IA
        </div>
      </button>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-96 ${isMinimized ? 'h-16' : 'h-96'} bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaRobot className="h-5 w-5" />
              <h3 className="font-semibold">Asistente IA</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200 transition-colors"
                title={isMinimized ? "Expandir" : "Minimizar"}
              >
                {isMinimized ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                title="Cerrar"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Contenido (solo visible si no está minimizado) */}
          {!isMinimized && (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <FaLightbulb className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                    <p className="text-sm font-medium mb-2">
                      ¡Hola! Soy tu asistente IA 🤖
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Pregúntame cualquier cosa sobre el formulario:
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-white p-2 rounded border">
                        <p className="font-medium text-blue-600">📋 "¿Cómo lleno el campo reporte?"</p>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="font-medium text-green-600">📖 "Explica la sección de antecedentes"</p>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="font-medium text-purple-600">💰 "¿Qué significa reserva sugerida?"</p>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="font-medium text-orange-600">🏙️ "Ayuda con la ciudad"</p>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.tipo === 'usuario'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                      }`}
                    >
                      {message.tipo === 'ia' && message.icono && (
                        <div className="text-lg mb-1">{message.icono}</div>
                      )}
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.contenido}</p>
                      {message.accion && message.accion !== 'general' && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <button
                            onClick={() => {
                              if (message.accion === 'llenarCampo' && message.campo && message.valor) {
                                onInputChange(message.campo, message.valor);
                              }
                            }}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors font-medium"
                          >
                            {message.accion === 'llenarCampo' ? '✅ Aplicar' : '👁️ Ver'}
                          </button>
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <FaRobot className="h-4 w-4 text-blue-500" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">IA escribiendo...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input y controles */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={enviarMensaje}
                    disabled={!inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-md transition-all duration-200 disabled:cursor-not-allowed"
                    title="Enviar mensaje"
                  >
                    <FaPaperPlane className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Controles adicionales */}
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={limpiarChat}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    title="Limpiar chat"
                  >
                    🗑️ Limpiar chat
                  </button>
                  <span className="text-xs text-gray-400">
                    {messages.length} mensaje{messages.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
