import React, { useMemo } from "react";
import colombia from "../../data/colombia.json";

export default function DatosGenerales({
  ciudad, setCiudad,
  fecha, setFecha,
  hora, setHora,
  tipoInspeccion, setTipoInspeccion,
  fechaLlegada, setFechaLlegada,
  regional, setRegional,
  actaNumero, setActaNumero,
  inspTipo, setInspTipo,
  inspFecha, setInspFecha,
  regionalDer, setRegionalDer
}) {
  // Extraer todas las ciudades únicas de colombia.json
  const ciudadesColombia = useMemo(() => {
    const set = new Set();
    colombia.forEach(dep => dep.ciudades.forEach(c => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, []);

  return (
    <section className="mb-4 border p-3 rounded">
      <table className="w-full border text-xs">
        <tbody>
          <tr>
            <td rowSpan={3} className="border p-2 align-top w-1/2">
              <div className="mb-1">
                <label>Ciudad / City:</label>
                <select
                  className="w-full"
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudadesColombia.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="mb-1">
                <label>Fecha / Date:</label>
                <input type="date" className="w-full" value={fecha} onChange={e => setFecha(e.target.value)} />
              </div>
              <div className="mb-1">
                <label>Hora / Hour:</label>
                <input type="time" className="w-full" value={hora} onChange={e => setHora(e.target.value)} />
              </div>
            </td>
            <td className="border p-2 font-bold text-center bg-gray-100" colSpan={2}>ACTA / REPORT</td>
            <td className="border p-2" rowSpan={2}>
              <label>No.</label>
              <input type="text" className="w-full" value={actaNumero} onChange={e => setActaNumero(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">INSP.</td>
            <td className="border p-2">
              <input type="text" className="w-full" value={inspTipo} onChange={e => setInspTipo(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td className="border p-2">Fecha de Inspección</td>
            <td className="border p-2">
              <input type="date" className="w-full" value={inspFecha} onChange={e => setInspFecha(e.target.value)} />
            </td>
            <td className="border p-2">
              <input type="text" className="w-full" value={regionalDer} onChange={e => setRegionalDer(e.target.value)} placeholder="Regional" />
            </td>
          </tr>
          <tr>
            <td className="border p-2">
              <label>Tipo Inspección / Type Survey:</label>
              <input type="text" className="w-full" value={tipoInspeccion} onChange={e => setTipoInspeccion(e.target.value)} />
            </td>
            <td className="border p-2">
              <label>Fecha de Llegada:</label>
              <input type="date" className="w-full" value={fechaLlegada} onChange={e => setFechaLlegada(e.target.value)} />
            </td>
            <td className="border p-2" colSpan={2}>
              <label>Regional:</label>
              <input type="text" className="w-full" value={regional} onChange={e => setRegional(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 