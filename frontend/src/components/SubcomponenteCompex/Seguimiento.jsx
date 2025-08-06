import React, { useState } from 'react';

export default function Seguimiento({ formData, handleChange }) {
  const [seguimientos, setSeguimientos] = useState([]);

  const handleAddSeguimiento = () => {
    setSeguimientos(prev => [
      {
        fecha: '',
        observacion: '',
        adjunto: ''
      },
      ...prev // para que el más nuevo quede arriba
    ]);
  };

  const handleSeguimientoChange = (index, field, value) => {
    const updated = [...seguimientos];
    updated[index][field] = value;
    setSeguimientos(updated);
  };

  const handleSeguimientoAdjuntoDrop = (index, acceptedFiles) => {
    const fileNames = acceptedFiles.map(file => file.name).join(',');
    const updated = [...seguimientos];
    updated[index].adjunto = fileNames;
    setSeguimientos(updated);
  };

  const handleEliminarSeguimiento = (index) => {
    const updated = seguimientos.filter((_, i) => i !== index);
    setSeguimientos(updated);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Seguimiento</h2>
      
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddSeguimiento}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow"
          >
            + Nuevo Seguimiento
          </button>
        </div>

        {seguimientos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay seguimientos registrados aún.</p>
            <p className="text-sm">Haz clic en "Nuevo Seguimiento" para comenzar.</p>
          </div>
        ) : (
          seguimientos.map((seg, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">📅 Fecha del Seguimiento</label>
                  <input
                    type="date"
                    value={seg.fecha}
                    onChange={(e) => handleSeguimientoChange(index, "fecha", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">📎 Adjunto</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleSeguimientoChange(index, "adjunto", file ? file.name : "");
                    }}
                    className="w-full border rounded px-3 py-2"
                  />
                  {seg.adjunto && (
                    <p className="text-sm mt-1 text-gray-600 italic">Archivo: {seg.adjunto}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">📝 Observación</label>
                <textarea
                  value={seg.observacion}
                  onChange={(e) => handleSeguimientoChange(index, "observacion", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  placeholder="Escribe la observación del seguimiento..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleEliminarSeguimiento(index)}
                  className="text-red-500 border border-red-500 px-4 py-1 rounded hover:bg-red-50"
                >
                  🗑 Eliminar Seguimiento
                </button>
              </div>
            </div>
          ))
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📋 Información sobre Seguimientos</h3>
          <p className="text-sm text-blue-700">
            Registra aquí todos los seguimientos realizados al caso, incluyendo fechas, observaciones 
            y documentos relevantes. Cada seguimiento se guarda con su fecha correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
} 