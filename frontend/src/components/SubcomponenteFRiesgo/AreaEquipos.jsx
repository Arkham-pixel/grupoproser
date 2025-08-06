import React from 'react';
import FilaEquipo from './FilaEquipo';

export default function AreaEquipos({ area, onUpdate }) {
  const handleAgregarEquipo = () => {
    const nuevoEquipo = {
      cantidad: "",
      equipo: "",
      marca: "",
      precio: "",
      capacidad: "",
      apariencia: ""
    };
    onUpdate({ ...area, equipos: [...area.equipos, nuevoEquipo] });
  };

  const handleEditarEquipo = (index, field, value) => {
    const nuevosEquipos = [...area.equipos];
    nuevosEquipos[index][field] = value;
    onUpdate({ ...area, equipos: nuevosEquipos });
  };

  const subtotal = area.equipos.reduce(
    (sum, eq) => sum + (parseFloat(eq.precio) || 0),
    0
  );

  return (
    <div className="mb-10 p-4 border rounded shadow">
      <h3 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded">{area.nombre} (Subtotal: ${subtotal.toLocaleString('es-CO')})</h3>

      <table className="min-w-full text-sm border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">CANT</th>
            <th className="border p-2">EQUIPO</th>
            <th className="border p-2">MARCA</th>
            <th className="border p-2">PRECIO</th>
            <th className="border p-2">CAPACIDAD</th>
            <th className="border p-2">APARIENCIA</th>
          </tr>
        </thead>
        <tbody>
          {area.equipos.map((eq, idx) => (
            <FilaEquipo
              key={idx}
              equipo={eq}
              onChange={(field, value) => handleEditarEquipo(idx, field, value)}
            />
          ))}
        </tbody>
      </table>

      <button
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        onClick={handleAgregarEquipo}
      >
        ➕ Agregar Equipo
      </button>
    </div>
  );
}
