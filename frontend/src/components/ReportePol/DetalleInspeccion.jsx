import React from "react";

export default function DetalleInspeccion({
  lugarReconocimiento, setLugarReconocimiento,
  pesoTara, setPesoTara,
  pesoNeto, setPesoNeto,
  pesoBruto, setPesoBruto
}) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td className="border p-2 w-1/4">Lugar de Reconocimiento / Place of Survey</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={lugarReconocimiento} onChange={e => setLugarReconocimiento(e.target.value)} />
            </td>
            <td className="border p-2 w-1/4">Peso Tara / Tare Weight</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={pesoTara} onChange={e => setPesoTara(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Peso Neto / Net Weight</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={pesoNeto} onChange={e => setPesoNeto(e.target.value)} />
            </td>
            <td className="border p-2">Peso Bruto / Gross Weight</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={pesoBruto} onChange={e => setPesoBruto(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 