import React from 'react';

export default function ObservacionesCliente({ formData, handleChange, getRootPropsObservaciones, getInputPropsObservaciones, isDragActiveObservaciones }) {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Observaciones del Cliente</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Observaciones Generales del Cliente</label>
          <textarea
            name="observaciones_cliente"
            value={formData.observaciones_cliente || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={6}
            placeholder="Registra aquí las observaciones, comentarios o feedback que el cliente ha proporcionado sobre el caso..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Comentarios sobre el Servicio</label>
          <textarea
            name="comentarios_servicio"
            value={formData.comentarios_servicio || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Comentarios específicos sobre la calidad del servicio, atención recibida, etc..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sugerencias de Mejora</label>
          <textarea
            name="sugerencias_mejora"
            value={formData.sugerencias_mejora || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Sugerencias o recomendaciones que el cliente ha proporcionado para mejorar el servicio..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nivel de Satisfacción</label>
          <select
            name="nivel_satisfaccion"
            value={formData.nivel_satisfaccion || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecciona el nivel de satisfacción...</option>
            <option value="Muy Satisfecho">Muy Satisfecho</option>
            <option value="Satisfecho">Satisfecho</option>
            <option value="Neutral">Neutral</option>
            <option value="Insatisfecho">Insatisfecho</option>
            <option value="Muy Insatisfecho">Muy Insatisfecho</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Documentos del Cliente</label>
          <div
            {...getRootPropsObservaciones()}
            className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            <input {...getInputPropsObservaciones()} />
            {isDragActiveObservaciones ? (
              <div className="text-blue-500">
                <p className="text-lg font-medium">Suelta los archivos aquí...</p>
                <p className="text-sm">Documentos proporcionados por el cliente</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-700">Arrastra y suelta documentos aquí</p>
                <p className="text-sm text-gray-500 mt-2">O haz clic para seleccionar archivos</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, imágenes (máx. 10MB)</p>
              </div>
            )}
          </div>
          {formData.adjunto_observaciones_cliente && (
            <p className="text-sm mt-2 text-green-600">
              ✅ Archivos seleccionados: {formData.adjunto_observaciones_cliente}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Fecha de Registro</label>
          <input
            type="date"
            name="fecha_observaciones_cliente"
            value={formData.fecha_observaciones_cliente || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📋 Información sobre Observaciones del Cliente</h3>
          <p className="text-sm text-blue-700">
            Registra aquí todas las observaciones, comentarios, sugerencias y feedback que el cliente 
            ha proporcionado sobre el caso y el servicio recibido. Esta información es valiosa para 
            mejorar la calidad del servicio.
          </p>
        </div>
      </div>
    </div>
  );
} 