import React from "react";

export default function Recomendaciones({ recomendaciones, setRecomendaciones }) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td className="border p-2 font-bold bg-gray-100" colSpan={2}>
              Recomendaciones / Recommendations
            </td>
          </tr>
          <tr>
            <td className="border p-2" colSpan={2}>
              <textarea
                className="w-full"
                rows={3}
                value={recomendaciones}
                onChange={e => setRecomendaciones(e.target.value)}
                placeholder="Escriba aquí las recomendaciones..."
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 