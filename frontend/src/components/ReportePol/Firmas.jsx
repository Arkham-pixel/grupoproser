import React from "react";

export default function Firmas({
  firmanteAsegurado, setFirmanteAsegurado,
  firmanteConductor, setFirmanteConductor,
  firmanteInspector, setFirmanteInspector,
  codigoInspector, setCodigoInspector
}) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <thead>
          <tr>
            <th className="border p-2">Asegurado / Insured</th>
            <th className="border p-2">Conductor / Driver</th>
            <th className="border p-2">Inspector / Surveyor</th>
            <th className="border p-2">Código / Code</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              <input type="text" className="w-full" value={firmanteAsegurado} onChange={e => setFirmanteAsegurado(e.target.value)} />
            </td>
            <td className="border p-2">
              <input type="text" className="w-full" value={firmanteConductor} onChange={e => setFirmanteConductor(e.target.value)} />
            </td>
            <td className="border p-2">
              <input type="text" className="w-full" value={firmanteInspector} onChange={e => setFirmanteInspector(e.target.value)} />
            </td>
            <td className="border p-2">
              <input type="text" className="w-full" value={codigoInspector} onChange={e => setCodigoInspector(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 