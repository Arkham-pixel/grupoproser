import React from "react";

export default function Observaciones({ observaciones, setObservaciones }) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td className="border p-2 font-bold bg-gray-100" colSpan={2}>
              Observaciones / Remarks
            </td>
          </tr>
          <tr>
            <td className="border p-2" colSpan={2}>
              <textarea
                className="w-full"
                rows={4}
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                placeholder="Escriba aquí las observaciones o comentarios..."
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-xs text-gray-500 mt-2 italic">
        (En caso de novedad relacionar valor de la factura y valor de la pérdida / In any case novelties, statement the invoice value and the damage value)
      </div>
    </section>
  );
} 