import React from 'react';

export default function ValoresPrestaciones({ formData, handleChange }) {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Valores y Prestaciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">Valor Reserva</label>
          <input
            type="number"
            name="valor_reserva"
            value={formData.valor_reserva ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="$ 0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Valor Reclamo</label>
          <input
            type="number"
            name="valor_reclamo"
            value={formData.valor_reclamo ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="$ 0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Monto a Indemnizar</label>
          <input
            type="number"
            name="monto_indemnizar"
            value={formData.monto_indemnizar ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="$ 0"
          />
        </div>
      </div>
    </div>
  );
}
