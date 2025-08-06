import React from 'react';

export default function Facturacion({ formData, handleChange, getRootPropsFactura, getInputPropsFactura, isDragActiveFactura }) {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Facturación</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">Número de Factura</label>
          <input
            type="number"
            name="numero_factura"
            value={formData.numero_factura ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Valor Servicios</label>
          <input
            type="number"
            name="valor_servicio"
            value={formData.valor_servicio ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Valor Gastos</label>
          <input
            type="number"
            name="valor_gastos"
            value={formData.valor_gastos ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de Factura</label>
          <input
            type="date"
            name="fecha_factura"
            value={formData.fecha_factura || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha Última Revisión</label>
          <input
            type="date"
            name="fecha_ultima_revision"
            value={formData.fecha_ultima_revision || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Observaciones y Compromisos</label>
          <textarea
            name="observacion_compromisos"
            value={formData.observacion_compromisos || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Escribe tus observaciones y compromisos..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Adjunto Factura</label>
          <div
            {...getRootPropsFactura()}
            className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
          >
            <input {...getInputPropsFactura()} />
            {isDragActiveFactura
              ? <p className="text-blue-500">Suelta los archivos aquí...</p>
              : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
          </div>
          <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_factura}</p>
        </div>
      </div>
    </div>
  );
} 