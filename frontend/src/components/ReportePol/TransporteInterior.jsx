import React from "react";

export default function TransporteInterior({
  empresaTransportadora, setEmpresaTransportadora,
  remesaNo, setRemesaNo,
  conductor, setConductor,
  cedula, setCedula,
  placas, setPlacas,
  modelo, setModelo,
  marca, setMarca,
  origenInterior, setOrigenInterior,
  destino, setDestino,
  celular, setCelular,
  cartaPorte, setCartaPorte
}) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td className="border p-2 w-1/4">Empresa Transportadora / Carrier</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={empresaTransportadora} onChange={e => setEmpresaTransportadora(e.target.value)} />
            </td>
            <td className="border p-2 w-1/4">Remesa No. / Remission No.</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={remesaNo} onChange={e => setRemesaNo(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Conductor / Driver</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={conductor} onChange={e => setConductor(e.target.value)} />
            </td>
            <td className="border p-2">Cédula / Identify</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={cedula} onChange={e => setCedula(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Placas / Plates</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={placas} onChange={e => setPlacas(e.target.value)} />
            </td>
            <td className="border p-2">Modelo / Model</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={modelo} onChange={e => setModelo(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Marca / Marks</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={marca} onChange={e => setMarca(e.target.value)} />
            </td>
            <td className="border p-2">Origen / Origin</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={origenInterior} onChange={e => setOrigenInterior(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Destino / Arrival Place</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={destino} onChange={e => setDestino(e.target.value)} />
            </td>
            <td className="border p-2">Celular / Movil Phone</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={celular} onChange={e => setCelular(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Carta de Porte / Carry Letter</td>
            <td className="border p-2" colSpan={3}>
              <input type="text" className="w-full" value={cartaPorte} onChange={e => setCartaPorte(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 