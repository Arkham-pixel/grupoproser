import React, { useState } from "react";
import { useCasosRiesgo } from "../../context/CasosRiesgoContext";
import { FaEdit } from "react-icons/fa";

const getCiudadNombre = (codigo, ciudades) => {
  if (!ciudades || !Array.isArray(ciudades)) return codigo;
  const ciudad = ciudades.find(c => c.value === codigo || c.codiMunicipio === codigo);
  return ciudad ? ciudad.label : codigo;
};

const getEstadoNombre = (codigo, estados) => {
  if (!estados || !Array.isArray(estados)) return codigo;
  const estado = estados.find(e => String(e.codiEstdo) === String(codigo));
  return estado ? estado.descEstdo : codigo;
};

const ListaCasosRiesgo = ({ onEditarCaso, ciudades, estados }) => {
  const { casos } = useCasosRiesgo();
  const [pagina, setPagina] = useState(1);
  const casosPorPagina = 10;
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Filtrado por fecha de inspección
  const filtrarPorFecha = (caso) => {
    if (!fechaDesde && !fechaHasta) return true;
    const fecha = caso.fchaInspccion ? new Date(caso.fchaInspccion) : null;
    if (!fecha) return false;
    if (fechaDesde && fecha < new Date(fechaDesde)) return false;
    if (fechaHasta && fecha > new Date(fechaHasta)) return false;
    return true;
  };
  const casosFiltrados = Array.isArray(casos) ? casos.filter(filtrarPorFecha) : [];

  const totalPaginas = Math.ceil(casosFiltrados.length / casosPorPagina) || 1;
  const casosPagina = casosFiltrados.slice((pagina - 1) * casosPorPagina, pagina * casosPorPagina);
  const desde = (pagina - 1) * casosPorPagina + 1;
  const hasta = Math.min(pagina * casosPorPagina, casosFiltrados.length);

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <div className="flex flex-wrap gap-4 mb-2 w-full justify-end pr-8">
        <div>
          <label className="text-xs font-semibold mr-1">Fecha Inspección desde:</label>
          <input type="date" value={fechaDesde} onChange={e => { setPagina(1); setFechaDesde(e.target.value); }} className="border rounded px-2 py-1 text-xs" />
        </div>
        <div>
          <label className="text-xs font-semibold mr-1">hasta:</label>
          <input type="date" value={fechaHasta} onChange={e => { setPagina(1); setFechaHasta(e.target.value); }} className="border rounded px-2 py-1 text-xs" />
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border mb-4 text-center shadow-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border px-2 py-1 font-bold">N° Riesgo</th>
              <th className="border px-2 py-1 font-bold">Asegurado</th>
              <th className="border px-2 py-1 font-bold">Ciudad</th>
              <th className="border px-2 py-1 font-bold">Estado</th>
              <th className="border px-2 py-1 font-bold">Fecha Inspección</th>
              <th className="border px-2 py-1 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="border px-2 py-4 text-gray-400">No hay casos registrados</td>
              </tr>
            ) : (
              casosPagina.map((caso, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-2 py-1 font-mono">{caso.nmroRiesgo}</td>
                  <td className="border px-2 py-1 truncate max-w-[180px]" title={caso.asgrBenfcro}>{caso.asgrBenfcro}</td>
                  <td className="border px-2 py-1 truncate max-w-[120px]" title={getCiudadNombre(caso.ciudadSucursal, ciudades)}>{getCiudadNombre(caso.ciudadSucursal, ciudades)}</td>
                  <td className="border px-2 py-1" title={getEstadoNombre(caso.codiEstdo, estados)}>{getEstadoNombre(caso.codiEstdo, estados)}</td>
                  <td className="border px-2 py-1">{caso.fchaInspccion ? new Date(caso.fchaInspccion).toLocaleDateString() : ''}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded flex items-center mx-auto"
                      onClick={() => onEditarCaso && onEditarCaso(caso, (pagina - 1) * casosPorPagina + idx)}
                      aria-label="Editar caso"
                      title="Editar caso"
                    >
                      <FaEdit className="mr-1" /> Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center space-x-2 justify-center mt-2">
        <button onClick={() => setPagina(1)} disabled={pagina === 1} className="px-2">{'<<'}</button>
        <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1} className="px-2">{'<'}</button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).slice(Math.max(0, pagina - 3), pagina + 2).map(i => (
          <button
            key={i}
            className={pagina === i ? "bg-orange-400 text-white px-2 rounded" : "px-2"}
            onClick={() => setPagina(i)}
          >
            {i}
          </button>
        ))}
        <button onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas} className="px-2">{'>'}</button>
        <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas} className="px-2">{'>>'}</button>
        <span className="ml-2 text-xs text-gray-500">Mostrando {casosFiltrados.length === 0 ? 0 : desde}-{hasta} de {casosFiltrados.length}</span>
      </div>
    </div>
  );
};

export default ListaCasosRiesgo;