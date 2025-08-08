import { SESSION_CONFIG, SESSION_MESSAGES } from '../config/session.js';

// Gestor de sesión con cierre automático por inactividad
class SessionManager {
  constructor() {
    this.timeoutDuration = SESSION_CONFIG.SESSION_DURATION;
    this.warningDuration = SESSION_CONFIG.WARNING_DURATION;
    this.timeoutId = null;
    this.warningId = null;
    this.isWarningShown = false;
    
    this.init();
  }

  init() {
    // Solo inicializar si hay un token válido
    const token = localStorage.getItem('token');
    if (!token) return;

    // Establecer timestamp de inicio de sesión
    localStorage.setItem('sessionStart', Date.now().toString());
    
    this.resetTimer();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Eventos que indican actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), true);
    });

    // Evento para cuando la ventana recupera el foco
    window.addEventListener('focus', () => this.resetTimer());
  }

  resetTimer() {
    // Limpiar timers existentes
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
    }

    // Configurar nuevo timer de advertencia
    this.warningId = setTimeout(() => {
      this.showWarning();
    }, this.timeoutDuration - this.warningDuration);

    // Configurar timer de cierre de sesión
    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.timeoutDuration);
  }

  showWarning() {
    if (this.isWarningShown) return;
    
    this.isWarningShown = true;
    
    // Crear modal de advertencia
    const warningModal = document.createElement('div');
    warningModal.id = 'session-warning-modal';
    warningModal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h3 style="color: #dc2626; margin-bottom: 15px;">{SESSION_MESSAGES.WARNING_TITLE}</h3>
          <p style="color: #374151; margin-bottom: 25px;">
            {SESSION_MESSAGES.WARNING_MESSAGE}
          </p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="extend-session" style="
              background: #059669;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-weight: bold;
            ">
              {SESSION_MESSAGES.CONTINUE_BUTTON}
            </button>
            <button id="logout-now" style="
              background: #dc2626;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
            ">
              {SESSION_MESSAGES.LOGOUT_BUTTON}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(warningModal);

    // Event listeners para los botones
    document.getElementById('extend-session').addEventListener('click', () => {
      this.extendSession();
    });

    document.getElementById('logout-now').addEventListener('click', () => {
      this.logout();
    });
  }

  extendSession() {
    // Remover modal de advertencia
    const modal = document.getElementById('session-warning-modal');
    if (modal) {
      modal.remove();
    }
    
    this.isWarningShown = false;
    this.resetTimer();
    
    // Mostrar notificación de sesión extendida
    this.showNotification(SESSION_MESSAGES.EXTEND_SUCCESS, 'success');
  }

  logout() {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('login');
    localStorage.removeItem('nombre');
    localStorage.removeItem('tipoUsuario');

    // Remover modal si existe
    const modal = document.getElementById('session-warning-modal');
    if (modal) {
      modal.remove();
    }

    // Mostrar notificación
    this.showNotification(SESSION_MESSAGES.LOGOUT_MESSAGE, 'info');

    // Redirigir al login
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  }

  showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    // Color según tipo
    const colors = {
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
      info: '#2563eb'
    };

    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;

    // Agregar CSS para animación
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Método para limpiar timers (útil para testing)
  cleanup() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningId) {
      clearTimeout(this.warningId);
    }
  }
}

// Crear instancia global
const sessionManager = new SessionManager();

export default sessionManager; 