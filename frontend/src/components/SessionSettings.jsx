import React, { useState, useEffect } from 'react';
import { SESSION_CONFIG, SESSION_MESSAGES } from '../config/session.js';

const SessionSettings = () => {
  const [settings, setSettings] = useState({
    sessionDuration: SESSION_CONFIG.SESSION_DURATION / (60 * 1000), // Convertir a minutos
    warningDuration: SESSION_CONFIG.WARNING_DURATION / (60 * 1000), // Convertir a minutos
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar si el usuario es admin
    const rol = localStorage.getItem('rol');
    setIsAdmin(rol === 'admin');
  }, []);

  const handleSave = () => {
    // Aquí podrías guardar la configuración en localStorage o enviar al backend
    const newConfig = {
      SESSION_DURATION: settings.sessionDuration * 60 * 1000,
      WARNING_DURATION: settings.warningDuration * 60 * 1000,
    };
    
    localStorage.setItem('sessionSettings', JSON.stringify(newConfig));
    alert('Configuración de sesión actualizada. Los cambios se aplicarán en la próxima sesión.');
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Solo los administradores pueden modificar la configuración de sesión.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">⚙️ Configuración de Sesión</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración de la sesión (minutos)
          </label>
          <input
            type="number"
            min="5"
            max="120"
            value={settings.sessionDuration}
            onChange={(e) => setSettings({
              ...settings,
              sessionDuration: parseInt(e.target.value) || 30
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Tiempo total antes de que expire la sesión por inactividad
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo de advertencia (minutos)
          </label>
          <input
            type="number"
            min="1"
            max={settings.sessionDuration - 1}
            value={settings.warningDuration}
            onChange={(e) => setSettings({
              ...settings,
              warningDuration: parseInt(e.target.value) || 5
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Tiempo antes de expirar cuando se muestra la advertencia
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">📋 Resumen de configuración:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sesión expira después de {settings.sessionDuration} minutos de inactividad</li>
            <li>• Advertencia aparece {settings.warningDuration} minutos antes de expirar</li>
            <li>• Usuario puede extender la sesión desde la advertencia</li>
          </ul>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          💾 Guardar configuración
        </button>
      </div>
    </div>
  );
};

export default SessionSettings; 