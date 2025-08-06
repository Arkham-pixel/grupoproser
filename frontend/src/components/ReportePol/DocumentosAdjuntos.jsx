import React from "react";

export default function DocumentosAdjuntos({
  facturaComercial, setFacturaComercial,
  listaEmpaque, setListaEmpaque,
  docTransporteAdjunto, setDocTransporteAdjunto
}) {
  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <thead>
          <tr>
            <th className="border p-2">Factura Comercial / Commercial Invoice</th>
            <th className="border p-2">Lista de Empaque / Packing List</th>
            <th className="border p-2">Doc de Transporte / Remission</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">
              <select className="w-full" value={facturaComercial} onChange={e => setFacturaComercial(e.target.value)}>
                <option value="NO">NO</option>
                <option value="SI">SI</option>
              </select>
            </td>
            <td className="border p-2 text-center">
              <select className="w-full" value={listaEmpaque} onChange={e => setListaEmpaque(e.target.value)}>
                <option value="NO">NO</option>
                <option value="SI">SI</option>
              </select>
            </td>
            <td className="border p-2 text-center">
              <select className="w-full" value={docTransporteAdjunto} onChange={e => setDocTransporteAdjunto(e.target.value)}>
                <option value="NO">NO</option>
                <option value="SI">SI</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 