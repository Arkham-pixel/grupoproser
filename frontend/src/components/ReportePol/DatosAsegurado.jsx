import React, { useMemo } from "react";
import { aseguradorasConFuncionarios } from "../../data/aseguradorasFuncionarios";

export default function DatosAsegurado({
  aseguradora, setAseguradora,
  sucursal, setSucursal,
  asegurado, setAsegurado,
  numPiezas, setNumPiezas,
  tipoEmpaque, setTipoEmpaque,
  claseMercancia, setClaseMercancia,
  pedidoNo, setPedidoNo,
  fechaConstruccion, setFechaConstruccion
}) {
  // Extraer la lista de aseguradoras
  const aseguradoras = useMemo(() => Object.keys(aseguradorasConFuncionarios).sort((a, b) => a.localeCompare(b, 'es')), []);

  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td className="border p-2 w-1/4">Aseguradora / Insurer</td>
            <td className="border p-2 w-1/4">
              <select
                className="w-full"
                value={aseguradora}
                onChange={e => setAseguradora(e.target.value)}
              >
                <option value="">Seleccione una aseguradora</option>
                {aseguradoras.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </td>
            <td className="border p-2 w-1/4">Sucursal / Branch</td>
            <td className="border p-2 w-1/4">
              <input type="text" className="w-full" value={sucursal} onChange={e => setSucursal(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Asegurado / Insured</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={asegurado} onChange={e => setAsegurado(e.target.value)} />
            </td>
            <td className="border p-2">N. de Piezas / No. of Packages</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={numPiezas} onChange={e => setNumPiezas(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Tipo de Empaque / Type of Package</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={tipoEmpaque} onChange={e => setTipoEmpaque(e.target.value)} />
            </td>
            <td className="border p-2">Clase de Mercancía / Type of Commodities</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={claseMercancia} onChange={e => setClaseMercancia(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Pedido No. / Order No.</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={pedidoNo} onChange={e => setPedidoNo(e.target.value)} />
            </td>
            <td className="border p-2">Fecha de Construcción / Construction Date</td>
            <td className="border p-2">
              <input type="date" className="w-full" value={fechaConstruccion} onChange={e => setFechaConstruccion(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 