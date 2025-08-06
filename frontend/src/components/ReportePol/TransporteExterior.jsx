import React from "react";

export default function TransporteExterior({
  origen, setOrigen,
  tipoTransporte, setTipoTransporte,
  motonave, setMotonave,
  registro, setRegistro,
  docTransporte, setDocTransporte,
  puertoOrigen, setPuertoOrigen,
  puertoArribo, setPuertoArribo,
  destinoFinal, setDestinoFinal
}) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td className="border p-2 w-1/4">Origen / Origin</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={origen} onChange={e => setOrigen(e.target.value)} />
            </td>
            <td className="border p-2 w-1/4">Tipo de Transporte / Type of Transport</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={tipoTransporte} onChange={e => setTipoTransporte(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Motonave / Vessel</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={motonave} onChange={e => setMotonave(e.target.value)} />
            </td>
            <td className="border p-2">Registro / Register</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={registro} onChange={e => setRegistro(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Doc. de Transporte / Doc. of Transport</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={docTransporte} onChange={e => setDocTransporte(e.target.value)} />
            </td>
            <td className="border p-2">Puerto Origen / Port of Loading</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={puertoOrigen} onChange={e => setPuertoOrigen(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Puerto Arribo / Port of Discharge</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={puertoArribo} onChange={e => setPuertoArribo(e.target.value)} />
            </td>
            <td className="border p-2">Destino Final / Final Place</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={destinoFinal} onChange={e => setDestinoFinal(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 