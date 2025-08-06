import React from 'react';

export default function Honorarios({ formData, handleChange, getRootPropsHonorarios, getInputPropsHonorarios, isDragActiveHonorarios }) {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Honorarios</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Documento de Honorarios</label>
          <div
            {...getRootPropsHonorarios()}
            className="border-dashed border-2 border-gray-300 p-8 rounded text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            <input {...getInputPropsHonorarios()} />
            {isDragActiveHonorarios ? (
              <div className="text-blue-500">
                <p className="text-lg font-medium">Suelta el archivo aquí...</p>
                <p className="text-sm">Selecciona el documento de honorarios</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-700">Arrastra y suelta el documento aquí</p>
                <p className="text-sm text-gray-500 mt-2">O haz clic para seleccionar el archivo</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX (máx. 10MB)</p>
              </div>
            )}
          </div>
          {formData.adjunto_honorarios && (
            <p className="text-sm mt-2 text-green-600">
              ✅ Archivo seleccionado: {formData.adjunto_honorarios}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Comentarios sobre Honorarios</label>
          <textarea
            name="observacion_honorarios"
            value={formData.observacion_honorarios || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Agregar comentarios sobre los honorarios..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📋 Información sobre Honorarios</h3>
          <p className="text-sm text-blue-700">
            Sube aquí los documentos relacionados con honorarios, tarifas, acuerdos de pago o cualquier 
            documentación financiera relevante para el caso.
          </p>
        </div>
      </div>
    </div>
  );
} 