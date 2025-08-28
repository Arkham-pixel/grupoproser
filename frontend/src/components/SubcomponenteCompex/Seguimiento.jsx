import React from 'react';

export default function Seguimiento({ formData, handleChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Seguimiento del Caso</h2>
      
      {/* Seguimiento General */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Seguimiento General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Último Seguimiento
            </label>
            <input
              type="date"
              name="fchaUltSegui"
              value={formData.fchaUltSegui || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Actual Seguimiento
            </label>
            <input
              type="date"
              name="fchaActSegui"
              value={formData.fchaActSegui || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones de Seguimiento
          </label>
          <textarea
            name="obseSegmnto"
            value={formData.obseSegmnto || ''}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones del seguimiento..."
          />
        </div>
      </div>

      {/* Estado del Caso */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🔄 Estado del Caso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Actual
            </label>
            <select
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar estado</option>
              <option value="1">Activo</option>
              <option value="2">En Proceso</option>
              <option value="3">Pendiente</option>
              <option value="4">Cerrado</option>
              <option value="5">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días Transcurridos
            </label>
            <input
              type="number"
              name="diasTranscrrdo"
              value={formData.diasTranscrrdo || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Compromisos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🤝 Compromisos</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones de Compromisos
          </label>
          <textarea
            name="obseComprmsi"
            value={formData.obseComprmsi || ''}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones de compromisos..."
          />
        </div>
      </div>

      {/* Fechas Importantes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📅 Fechas Importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Última Revisión
            </label>
            <input
              type="date"
              name="fchaUltRevi"
              value={formData.fchaUltRevi || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin Quito Indemnización
            </label>
            <input
              type="date"
              name="fchaFinqtoIndem"
              value={formData.fchaFinqtoIndem || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen de Seguimiento */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Resumen de Seguimiento</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Estado:</span>
              <span className="ml-2 text-gray-600">
                {formData.estado === '1' ? 'Activo' : 
                 formData.estado === '2' ? 'En Proceso' : 
                 formData.estado === '3' ? 'Pendiente' : 
                 formData.estado === '4' ? 'Cerrado' : 
                 formData.estado === '5' ? 'Cancelado' : 'No definido'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Días Transcurridos:</span>
              <span className="ml-2 text-gray-600">{formData.diasTranscrrdo || '0'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Último Seguimiento:</span>
              <span className="ml-2 text-gray-600">
                {formData.fchaUltSegui ? new Date(formData.fchaUltSegui).toLocaleDateString('es-ES') : 'No registrado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 