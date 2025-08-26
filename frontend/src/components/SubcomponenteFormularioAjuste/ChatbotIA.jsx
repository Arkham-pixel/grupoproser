import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaLightbulb, FaChevronUp, FaChevronDown } from 'react-icons/fa';

export default function ChatbotIA({ formData, onInputChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Debug: confirmar que el componente se está montando
  console.log('🤖 ChatbotIA se está renderizando');
  console.log('📊 formData recibido:', formData);

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

    if (mensajeLower.includes('observaciones') || mensajeLower.includes('preeliminar') || mensajeLower.includes('preliminar') || mensajeLower.includes('observations')) {
      return {
        tipo: 'ayuda',
        contenido: `🔍 **Observaciones Preeliminares:**\n\nPara esta sección:\n• Solo aparece en la versión PREELIMINAR\n• Describe hallazgos iniciales de la inspección\n• Incluye observaciones técnicas importantes\n• Menciona elementos que requieren atención\n• Usa el asistente IA para plantillas\n• Mínimo 100 palabras recomendado`,
        accion: 'irSeccion',
        seccion: 'observacionesPreeliminar',
        icono: '🔍'
      };
    }

    if (mensajeLower.includes('hallazgos') || mensajeLower.includes('encontré') || mensajeLower.includes('descubrí') || mensajeLower.includes('findings')) {
      return {
        tipo: 'ayuda',
        contenido: `🔍 **Hallazgos en Observaciones Preeliminares:**\n\nPara documentar hallazgos:\n• **Estructura recomendada:**\n  1. Ubicación del hallazgo\n  2. Descripción detallada\n  3. Posible causa\n  4. Impacto estimado\n  5. Acción recomendada\n\n• **Ejemplo:** "En el área norte se observó humedad en las paredes, posiblemente por filtración del techo. Se requiere revisión del sistema de impermeabilización."`,
        accion: 'llenarCampo',
        campo: 'observacionesPreeliminar',
        valor: 'Hallazgo identificado: ',
        icono: '🔍'
      };
    }

    if (mensajeLower.includes('daños') || mensajeLower.includes('destrucción') || mensajeLower.includes('pérdidas') || mensajeLower.includes('damage')) {
      return {
        tipo: 'ayuda',
        contenido: `💥 **Documentar Daños en Observaciones:**\n\nPara describir daños:\n• **Elementos a incluir:**\n  1. Extensión del daño\n  2. Gravedad (leve, moderado, severo)\n  3. Áreas afectadas\n  4. Elementos estructurales comprometidos\n  5. Estimación de costos de reparación\n\n• **Ejemplo:** "El daño se extiende aproximadamente 15m² en la zona central, afectando principalmente el sistema eléctrico y acabados. Se estima un costo de reparación de $2,500,000 COP."`,
        accion: 'llenarCampo',
        campo: 'observacionesPreeliminar',
        valor: 'Daños observados: ',
        icono: '💥'
      };
    }

    if (mensajeLower.includes('recomendaciones') || mensajeLower.includes('sugerencias') || mensajeLower.includes('acciones') || mensajeLower.includes('recommendations')) {
      return {
        tipo: 'ayuda',
        contenido: `💡 **Recomendaciones en Observaciones:**\n\nPara incluir recomendaciones:\n• **Tipos de recomendaciones:**\n  1. **Inmediatas:** Acciones urgentes (24-48h)\n  2. **Corto plazo:** Reparaciones básicas (1-2 semanas)\n  3. **Mediano plazo:** Mejoras preventivas (1-3 meses)\n  4. **Largo plazo:** Renovaciones mayores (3-12 meses)\n\n• **Ejemplo:** "Se recomienda: 1) Aislar el área afectada inmediatamente, 2) Contratar especialista en impermeabilización, 3) Implementar mantenimiento preventivo trimestral."`,
        accion: 'llenarCampo',
        campo: 'observacionesPreeliminar',
        valor: 'Recomendaciones: ',
        icono: '💡'
      };
    }

    if (mensajeLower.includes('incendio') || mensajeLower.includes('fuego') || mensajeLower.includes('fire')) {
      return {
        tipo: 'ayuda',
        contenido: `🔥 **Observaciones para Siniestro por Incendio:**\n\n**Elementos clave a documentar:**\n• **Origen del fuego:** Punto de inicio identificado\n• **Propagación:** Cómo se extendió el incendio\n• **Materiales afectados:** Tipo de combustibles\n• **Daños estructurales:** Compromiso de elementos\n• **Sistemas de protección:** Estado de extintores, alarmas\n• **Acceso de bomberos:** Vías de entrada/salida\n\n**Ejemplo:** "El incendio se originó en el área de transformadores, propagándose por el sistema de cableado. Se afectaron principalmente equipos eléctricos y acabados. Los sistemas de alarma funcionaron correctamente."`,
        accion: 'llenarCampo',
        campo: 'observacionesPreeliminar',
        valor: 'Observaciones incendio: ',
        icono: '🔥'
      };
    }

    if (mensajeLower.includes('inundación') || mensajeLower.includes('agua') || mensajeLower.includes('humedad') || mensajeLower.includes('flood')) {
      return {
        tipo: 'ayuda',
        contenido: `💧 **Observaciones para Siniestro por Inundación:**\n\n**Elementos clave a documentar:**\n• **Fuente del agua:** Origen de la inundación\n• **Nivel alcanzado:** Altura máxima del agua\n• **Tiempo de exposición:** Duración del contacto\n• **Materiales afectados:** Elementos dañados\n• **Humedad residual:** Estado actual de humedad\n• **Riesgo de moho:** Condiciones para proliferación\n\n**Ejemplo:** "La inundación se originó por rotura de tubería principal, alcanzando 30cm de altura. El agua permaneció 4 horas, afectando muebles y equipos electrónicos. Se detecta humedad residual en paredes."`,
        accion: 'llenarCampo',
        campo: 'observacionesPreeliminar',
        valor: 'Observaciones inundación: ',
        icono: '💧'
      };
    }

    if (mensajeLower.includes('robo') || mensajeLower.includes('hurto') || mensajeLower.includes('theft')) {
      return {
        tipo: 'ayuda',
        contenido: `🦹 **Observaciones para Siniestro por Robo:**\n\n**Elementos clave a documentar:**\n• **Punto de entrada:** Cómo accedieron los ladrones\n• **Método de forzado:** Técnicas utilizadas\n• **Elementos robados:** Inventario detallado\n• **Daños colaterales:** Destrozos adicionales\n• **Sistemas de seguridad:** Estado de alarmas, cámaras\n• **Evidencia:** Huellas, herramientas abandonadas\n\n**Ejemplo:** "El robo se realizó forzando la puerta trasera con herramientas especializadas. Se sustrajeron equipos electrónicos valorados en $15,000,000 COP. Los sistemas de alarma no funcionaron por corte de energía."`,
        accion: 'llenarCampo',
        campo: 'observacionesPreeliminar',
        valor: 'Observaciones robo: ',
        icono: '🦹'
      };
    }

    // Nuevas respuestas para campos del informe preeliminar
    if (mensajeLower.includes('análisis') || mensajeLower.includes('cobertura') || mensajeLower.includes('póliza') || mensajeLower.includes('policy')) {
      return {
        tipo: 'ayuda',
        contenido: `📋 **Análisis de Cobertura:**\n\n**Sección 8 del Informe Preeliminar:**\n• **Análisis de Póliza:** Condiciones especiales, cláusulas relevantes\n• **Coberturas Aplicables:** Qué cubre la póliza para este siniestro\n• **Exclusiones:** Qué NO cubre la póliza\n• **Garantías:** Requisitos específicos del asegurado\n• **Coaseguro:** Participación de otras aseguradoras\n\n**Ejemplo:** "La póliza cubre daños por incendio hasta $500,000,000 COP. Excluye daños por negligencia. Requiere sistema de alarma certificado."`,
        accion: 'irSeccion',
        seccion: 'analisisCobertura',
        icono: '📋'
      };
    }

    if (mensajeLower.includes('exclusiones') || mensajeLower.includes('exclusions') || mensajeLower.includes('no cubre')) {
      return {
        tipo: 'ayuda',
        contenido: `❌ **Exclusiones de Cobertura:**\n\n**Elementos a identificar:**\n• **Exclusiones generales:** Daños por negligencia, mantenimiento\n• **Exclusiones específicas:** Actos de terrorismo, guerra\n• **Exclusiones por omisión:** Falta de medidas de seguridad\n• **Exclusiones temporales:** Períodos de carencia\n• **Exclusiones geográficas:** Zonas de alto riesgo\n\n**Ejemplo:** "La póliza excluye: daños por falta de mantenimiento, actos de terrorismo, y siniestros ocurridos fuera del horario de operación."`,
        accion: 'llenarCampo',
        campo: 'exclusiones',
        valor: 'Exclusiones identificadas: ',
        icono: '❌'
      };
    }

    if (mensajeLower.includes('garantías') || mensajeLower.includes('warranties') || mensajeLower.includes('requisitos')) {
      return {
        tipo: 'ayuda',
        contenido: `🛡️ **Garantías y Requisitos:**\n\n**Elementos a verificar:**\n• **Sistemas de seguridad:** Alarmas, cámaras, cercas\n• **Mantenimiento:** Programas de mantenimiento preventivo\n• **Certificaciones:** Normas técnicas, licencias\n• **Inspecciones:** Frecuencia de revisiones\n• **Personal:** Capacitación del personal\n\n**Ejemplo:** "El asegurado debe mantener: sistema de alarma operativo 24/7, mantenimiento trimestral de equipos, y personal capacitado en primeros auxilios."`,
        accion: 'llenarCampo',
        campo: 'garantias',
        valor: 'Garantías requeridas: ',
        icono: '🛡️'
      };
    }

    if (mensajeLower.includes('coaseguro') || mensajeLower.includes('reaseguro') || mensajeLower.includes('co-insurance')) {
      return {
        tipo: 'ayuda',
        contenido: `🤝 **Coaseguro y Reaseguro:**\n\n**Información a documentar:**\n• **Participación:** Porcentaje de cada aseguradora\n• **Límites:** Montos máximos por aseguradora\n• **Condiciones:** Términos específicos del coaseguro\n• **Responsabilidades:** Quién maneja qué\n• **Comunicación:** Protocolos de coordinación\n\n**Ejemplo:** "Coaseguro: Seguros del Estado (60%), Aseguradora ABC (25%), Reaseguradora XYZ (15%). Límite máximo por aseguradora: $300,000,000 COP."`,
        accion: 'llenarCampo',
        campo: 'coaseguro',
        valor: 'Información de coaseguro: ',
        icono: '🤝'
      };
    }

    if (mensajeLower.includes('documentos') || mensajeLower.includes('solicitud') || mensajeLower.includes('requeridos')) {
      return {
        tipo: 'ayuda',
        contenido: `📋 **Solicitud de Documentos:**\n\n**Documentos típicos requeridos:**\n• **Facturas y recibos:** Comprobantes de compra\n• **Reportes técnicos:** Evaluaciones de expertos\n• **Fotografías:** Antes y después del siniestro\n• **Testimonios:** Declaraciones de testigos\n• **Certificados:** Licencias, permisos\n• **Contratos:** Acuerdos de mantenimiento\n\n**Ejemplo:** "Se solicitan: facturas de equipos afectados, reporte técnico de ingeniero estructural, fotografías del estado anterior, y certificado de mantenimiento preventivo."`,
        accion: 'llenarCampo',
        campo: 'solicitudDocumentos',
        valor: 'Documentos solicitados: ',
        icono: '📋'
      };
    }

    if (mensajeLower.includes('declinación') || mensajeLower.includes('decline') || mensajeLower.includes('no cubre')) {
      return {
        tipo: 'ayuda',
        contenido: `❌ **Declinación de Cobertura:**\n\n**Razones comunes para declinar:**\n• **Exclusiones aplicables:** Daños no cubiertos por la póliza\n• **Falta de garantías:** No se cumplieron requisitos\n• **Ocultación de información:** Datos falsos o incompletos\n• **Actos intencionales:** Daños causados deliberadamente\n• **Falta de notificación:** Siniestro reportado tardíamente\n\n**Ejemplo:** "Se declina cobertura por: falta de mantenimiento preventivo (garantía incumplida), y daños causados por negligencia (exclusión aplicable)."`,
        accion: 'llenarCampo',
        campo: 'declinacion',
        valor: 'Razones de declinación: ',
        icono: '❌'
      };
    }

    if (mensajeLower.includes('próximos pasos') || mensajeLower.includes('siguiente') || mensajeLower.includes('acciones')) {
      return {
        tipo: 'ayuda',
        contenido: `🚀 **Próximos Pasos:**\n\n**Plan de acción recomendado:**\n• **Inmediato (24-48h):** Aislar área, contactar especialistas\n• **Corto plazo (1-2 semanas):** Evaluaciones técnicas, presupuestos\n• **Mediano plazo (1-3 meses):** Reparaciones, mejoras\n• **Largo plazo (3-12 meses):** Prevención, monitoreo\n• **Responsabilidades:** Quién hace qué y cuándo\n\n**Ejemplo:** "Próximos pasos: 1) Aislar área afectada (hoy), 2) Contratar ingeniero estructural (esta semana), 3) Obtener presupuestos (próximas 2 semanas), 4) Iniciar reparaciones (próximo mes)."`,
        accion: 'llenarCampo',
        campo: 'proximosPasos',
        valor: 'Plan de acción: ',
        icono: '🚀'
      };
    }

    if (mensajeLower.includes('ayuda') || mensajeLower.includes('cómo') || mensajeLower.includes('help')) {
      return {
        tipo: 'ayuda',
        contenido: `🤖 **¡Hola! Soy tu asistente IA**\n\nTe puedo ayudar con:\n• 📋 Cómo llenar campos específicos\n• 📖 Explicaciones de secciones\n• 💰 Cálculos automáticos\n• 💡 Sugerencias de contenido\n• 🎯 Navegación por el formulario\n• 🔍 Observaciones preeliminares\n• 📋 Análisis de cobertura\n• 📝 Solicitud de documentos\n• ❌ Declinaciones\n• 🚀 Próximos pasos\n\n¡Pregúntame lo que necesites!`,
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
        onInputChange(respuesta.campo, respuesta.valor);
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-[9999] group animate-pulse border-2 border-white"
        title="Asistente IA - Haz clic para abrir"
        style={{ zIndex: 9999 }}
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
