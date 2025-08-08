// Configuración de tiempos de sesión
export const SESSION_CONFIG = {
  // Tiempo total de sesión (30 minutos)
  SESSION_DURATION: 30 * 60 * 1000, // 30 minutos en milisegundos
  
  // Tiempo de advertencia antes de expirar (5 minutos)
  WARNING_DURATION: 5 * 60 * 1000, // 5 minutos en milisegundos
  
  // Tiempo de inactividad para mostrar advertencia (25 minutos)
  WARNING_START: 25 * 60 * 1000, // 25 minutos en milisegundos
  
  // Intervalo de verificación (1 segundo)
  CHECK_INTERVAL: 1000,
  
  // Tiempo de notificación (3 segundos)
  NOTIFICATION_DURATION: 3000
};

// Mensajes de la aplicación
export const SESSION_MESSAGES = {
  WARNING_TITLE: 'Sesión por expirar',
  WARNING_MESSAGE: 'Tu sesión expirará en 5 minutos por inactividad. ¿Deseas continuar con la sesión activa?',
  EXTEND_SUCCESS: 'Sesión extendida exitosamente',
  LOGOUT_MESSAGE: 'Sesión cerrada por inactividad',
  CONTINUE_BUTTON: 'Continuar sesión',
  LOGOUT_BUTTON: 'Cerrar ahora'
}; 