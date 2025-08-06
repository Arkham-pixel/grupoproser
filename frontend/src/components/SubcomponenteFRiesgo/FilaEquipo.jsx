import React from 'react';

export default function FilaEquipo({ equipo, onChange }) {
  return (
    <tr>
      <td className="border p-1">
        <input
          type="number"
          value={equipo.cantidad}
          onChange={(e) => onChange("cantidad", e.target.value)}
          className="w-full border rounded p-1"
        />
      </td>
      <td className="border p-1">
        <input
          value={equipo.equipo}
          onChange={(e) => onChange("equipo", e.target.value)}
          className="w-full border rounded p-1"
        />
      </td>
      <td className="border p-1">
        <input
          value={equipo.marca}
          onChange={(e) => onChange("marca", e.target.value)}
          className="w-full border rounded p-1"
        />
      </td>
      <td className="border p-1">
        <input
          type="number"
          value={equipo.precio}
          onChange={(e) => onChange("precio", e.target.value)}
          className="w-full border rounded p-1"
        />
      </td>
      <td className="border p-1">
        <input
          value={equipo.capacidad}
          onChange={(e) => onChange("capacidad", e.target.value)}
          className="w-full border rounded p-1"
        />
      </td>
      <td className="border p-1">
        <input
          value={equipo.apariencia}
          onChange={(e) => onChange("apariencia", e.target.value)}
          className="w-full border rounded p-1"
        />
      </td>
    </tr>
  );
}
