import React, { useEffect, useState } from 'react';
import { obtenerCasosRiesgo, deleteCasoRiesgo, obtenerResponsables, obtenerEstados, obtenerAseguradoras, obtenerCiudades } from '../../services/riesgoService'; // Ajusta la ruta si es necesario
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import AgregarCasoRiesgo from '../SubcomponentesRiesgo/AgregarCasoRiesgo';

const getCiudadNombre = (codigo, ciudades) => {
  if (!ciudades) return codigo;
  // Buscar por múltiples campos posibles
  const ciudad = ciudades.find(c => 
    c.value === codigo || 
    c.codiMunicipio === codigo ||
    c.cod1Mun1c1p1o === codigo ||
    c.cod1Cpoblado === codigo
  );
  return ciudad ? (ciudad.label || ciudad.descMun1c1p1o || ciudad.descCpoblado) : codigo;
};

const getEstadoNombre = (codigo, estados) => {
  if (!estados) return codigo;
  const estado = estados.find(e => String(e.codiEstdo) === String(codigo));
  return estado ? estado.descEstdo : codigo;
};

const getResponsableNombre = (codigo, responsables) => {
  if (!responsables) return codigo;
  const responsable = responsables.find(r => String(r.codiRespnsble) === String(codigo));
  return responsable ? responsable.nmbrRespnsble : codigo;
};

const getAseguradoraNombre = (codigo, aseguradoras) => {
  if (!aseguradoras) return codigo;
  // Buscar por ambos campos posibles
  const aseguradora = aseguradoras.find(a => 
    String(a.cod1Asgrdra) === String(codigo) || 
    String(a.codiAsgrdra) === String(codigo)
  );
  return aseguradora ? aseguradora.rzonSocial : codigo;
};

// Lista completa de columnas posibles (puedes agregar más si tu base tiene más campos)
const todasLasColumnas = [
  { clave: 'nmroRiesgo', label: 'N° Riesgo' },
  { clave: 'asgrBenfcro', label: 'Asegurado' },
  { clave: 'codiAsgrdra', label: 'Cód. Aseguradora' },
  { clave: 'ciudadSucursal', label: 'Ciudad' },
  { clave: 'codiEstdo', label: 'Estado' },
  { clave: 'fchaAsgncion', label: 'Fecha Asignación' },
  { clave: 'fchaInspccion', label: 'Fecha Inspección' },
  { clave: 'fchaInforme', label: 'Fecha Informe Final' },
  { clave: 'codiIspector', label: 'Inspector' },
  { clave: 'observInspeccion', label: 'Observaciones Inspección' },
  { clave: 'observAsignacion', label: 'Observaciones Asignación' },
  { clave: 'vlorTarifaAseguradora', label: 'Tarifa Aseguradora' },
  { clave: 'vlorHonorarios', label: 'Honorarios' },
  { clave: 'vlorGastos', label: 'Gastos' },
  { clave: 'totalPagado', label: 'Total Pagado' },
  { clave: 'nmroConsecutivo', label: 'Consecutivo' },
  { clave: 'adjuntoAsignacion', label: 'Adjunto Asignación' },
  { clave: 'adjuntoInspeccion', label: 'Adjunto Inspección' },
  { clave: 'anxoInfoFnal', label: 'Adjunto Informe Final' },
  { clave: 'anxoFactra', label: 'Adjunto Factura' },
  { clave: 'fchaFactra', label: 'Fecha Factura' },
  { clave: 'nmroFactra', label: 'Número Factura' },
  { clave: 'funcSolicita', label: 'Quien Solicita' },
  { clave: 'codDireccion', label: 'Dirección' },
  { clave: 'codigoPoblado', label: 'Código Poblado' },
  // ...agrega más si tu base tiene más campos
];

const ReporteRiesgo = ({ ciudades: ciudadesProp, estados: estadosProp }) => {
  const [casos, setCasos] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);
  const [estadosLocales, setEstadosLocales] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState('numero_siniestro');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  // Estados de filtros avanzados
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [responsableFiltro, setResponsableFiltro] = useState('');
  const [aseguradoraFiltro, setAseguradoraFiltro] = useState('');
  const [ciudadFiltro, setCiudadFiltro] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [casoParaEditar, setCasoParaEditar] = useState(null);
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([
    'nmroRiesgo', 'asgrBenfcro', 'codiAsgrdra', 'ciudadSucursal', 'codiEstdo',
    'fchaAsgncion', 'fchaInspccion', 'fchaInforme', 'codiIspector',
    'observInspeccion', 'observAsignacion', 'vlorTarifaAseguradora',
    'vlorHonorarios', 'vlorGastos', 'totalPagado'
  ]);
  const [modalColumnas, setModalColumnas] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    obtenerCasos();
  }, []);

  const obtenerCasos = async () => {
    try {
      // Cargar datos principales primero
      const data = await obtenerCasosRiesgo();
      setCasos(Array.isArray(data) ? data : []);
      
      // Cargar datos adicionales en paralelo, con manejo de errores individual
      try {
        const responsablesData = await obtenerResponsables();
        setResponsables(Array.isArray(responsablesData) ? responsablesData : []);
      } catch (error) {
        console.error('Error al cargar responsables:', error);
        setResponsables([]);
      }
      
      try {
        const estadosData = await obtenerEstados();
        setEstadosLocales(Array.isArray(estadosData) ? estadosData : []);
      } catch (error) {
        console.error('Error al cargar estados:', error);
        setEstadosLocales([]);
      }
      
      try {
        const aseguradorasData = await obtenerAseguradoras();
        setAseguradoras(Array.isArray(aseguradorasData) ? aseguradorasData : []);
      } catch (error) {
        console.error('Error al cargar aseguradoras:', error);
        setAseguradoras([]);
      }
      
      try {
        const ciudadesData = await obtenerCiudades();
        setCiudades(Array.isArray(ciudadesData) ? ciudadesData : []);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
        setCiudades([]);
      }
    } catch (error) {
      console.error('Error al cargar casos:', error);
      setCasos([]);
    }
  };

  const handleEdit = (id) => {
    const caso = casos.find(c => c._id?.toString() === id?.toString() || c.id_riesgo?.toString() === id?.toString() || c.id?.toString() === id?.toString());
    if (caso) {
      setCasoParaEditar(caso);
      setModalAbierto(true);
    }
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
    setCasoParaEditar(null);
    obtenerCasos(); // Recarga la lista tras editar
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este caso?')) {
      try {
        await deleteCasoRiesgo(id);
        alert('Caso eliminado correctamente');
        obtenerCasos();
      } catch (error) {
        console.error('Error al eliminar el caso:', error);
        alert('Error al eliminar el caso');
      }
    }
  };

  // Ajusta los campos visibles según tu modelo de riesgos real
  const camposVisibles = todasLasColumnas.filter(col => columnasSeleccionadas.includes(col.clave));

  // Filtrado avanzado mejorado
  const casosFiltrados = casos.filter(caso => {
    let ok = true;
    
    // Filtro por búsqueda de texto
    if (terminoBusqueda) {
    const valor = caso[campoBusqueda]?.toString().toLowerCase() || '';
      ok = ok && valor.includes(terminoBusqueda.toLowerCase());
    }
    
    // Filtro por fechas (usando fchaAsgncion)
    if (fechaDesde) {
      const f = caso.fchaAsgncion ? new Date(caso.fchaAsgncion) : null;
      if (!f || f < new Date(fechaDesde)) ok = false;
    }
    if (fechaHasta) {
      const f = caso.fchaAsgncion ? new Date(caso.fchaAsgncion) : null;
      if (!f || f > new Date(fechaHasta)) ok = false;
    }
    
    // Filtro por estado
    if (estadoFiltro) {
      ok = ok && String(caso.codiEstdo) === String(estadoFiltro);
    }
    
    // Filtro por responsable
    if (responsableFiltro) {
      ok = ok && String(caso.codiIspector) === String(responsableFiltro);
    }
    
    // Filtro por aseguradora
    if (aseguradoraFiltro) {
      ok = ok && String(caso.codiAsgrdra) === String(aseguradoraFiltro);
    }
    
    // Filtro por ciudad
    if (ciudadFiltro) {
      ok = ok && String(caso.ciudadSucursal) === String(ciudadFiltro);
    }
    
    return ok;
  });

  const casosOrdenados = [...casosFiltrados].sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;
    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';
    return orden.asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
  });

  const totalPaginas = Math.ceil(casosOrdenados.length / elementosPorPagina);
  const casosPaginados = casosOrdenados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarOrden = campo => {
    setOrden(prev => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  };

  // Listas únicas para los filtros
  const estadosUnicos = Array.from(new Set(casos.map(c => c.codiEstdo).filter(Boolean))).map(e => ({ 
    value: e, 
    label: getEstadoNombre(e, estadosLocales) 
  }));
  
  const responsablesUnicos = Array.from(new Set(casos.map(c => c.codiIspector).filter(Boolean))).map(r => ({ 
    value: r, 
    label: getResponsableNombre(r, responsables) 
  }));
  
  const aseguradorasUnicas = Array.from(new Set(casos.map(c => c.codiAsgrdra).filter(Boolean))).map(a => ({ 
    value: a, 
    label: getAseguradoraNombre(a, aseguradoras) 
  }));
  
  const ciudadesUnicas = Array.from(new Set(casos.map(c => c.ciudadSucursal).filter(Boolean))).map(ciudad => ({ 
    value: ciudad, 
    label: getCiudadNombre(ciudad, ciudades) 
  }));

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(casosOrdenados.map(caso => {
      const fila = {};
      camposVisibles.forEach(({ clave, label }) => {
        if (clave === 'ciudadSucursal') {
           fila[label] = getCiudadNombre(caso[clave], ciudades || ciudadesProp);
        } else if (clave === 'codiEstdo') {
           fila[label] = getEstadoNombre(caso[clave], estadosProp || estadosLocales);
        } else if (clave === 'codiIspector') {
          fila[label] = getResponsableNombre(caso[clave], responsables);
        } else if (clave === 'codiAsgrdra') {
          fila[label] = getAseguradoraNombre(caso[clave], aseguradoras);
        } else if (clave === 'fchaAsgncion' || clave === 'fchaInspccion' || clave === 'fchaInforme' || clave === 'fchaFactra') {
          fila[label] = caso[clave] ? new Date(caso[clave]).toLocaleDateString() : '';
        } else {
          fila[label] = caso[clave] || '';
        }
      });
      return fila;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CasosRiesgo');
    XLSX.writeFile(workbook, 'reporte_riesgo.xlsx');
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">📊 Reporte de Casos de Riesgo</h2>

      {/* Filtros Avanzados */}
      <div className="bg-white shadow rounded-lg p-3 sm:p-4 mb-4">
        <h3 className="text-sm sm:text-lg font-semibold mb-3 text-center">🔍 Filtros de Búsqueda</h3>
        
        {/* Primera fila - Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">📅 Fecha desde</label>
            <input 
              type="date" 
              value={fechaDesde} 
              onChange={e => setFechaDesde(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">📅 Fecha hasta</label>
            <input 
              type="date" 
              value={fechaHasta} 
              onChange={e => setFechaHasta(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
        
        {/* Segunda fila - Selectores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">📊 Estado</label>
            <select 
              value={estadoFiltro} 
              onChange={e => setEstadoFiltro(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {estadosUnicos.map((e, index) => (
                <option key={`estado-${e.value}-${index}`} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">👨‍💼 Responsable</label>
            <select 
              value={responsableFiltro} 
              onChange={e => setResponsableFiltro(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los responsables</option>
              {responsablesUnicos.map((r, index) => (
                <option key={`responsable-${r.value}-${index}`} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">🏢 Aseguradora</label>
            <select 
              value={aseguradoraFiltro} 
              onChange={e => setAseguradoraFiltro(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las aseguradoras</option>
              {aseguradorasUnicas.map((a, index) => (
                <option key={`aseguradora-${a.value}-${index}`} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">🏙️ Ciudad</label>
            <select 
              value={ciudadFiltro} 
              onChange={e => setCiudadFiltro(e.target.value)} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las ciudades</option>
              {ciudadesUnicas.map((c, index) => (
                <option key={`ciudad-${c.value}-${index}`} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Botón para limpiar filtros */}
        <div className="mt-3 text-center">
          <button 
            onClick={() => {
              setFechaDesde("");
              setFechaHasta("");
              setEstadoFiltro("");
              setResponsableFiltro("");
              setAseguradoraFiltro("");
              setCiudadFiltro("");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
        
        {/* Información de filtros activos */}
        {(fechaDesde || fechaHasta || estadoFiltro || responsableFiltro || aseguradoraFiltro || ciudadFiltro) && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-1">🔍 Filtros activos:</p>
            <div className="flex flex-wrap gap-1">
              {fechaDesde && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Desde: {fechaDesde}</span>}
              {fechaHasta && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Hasta: {fechaHasta}</span>}
              {estadoFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Estado: {getEstadoNombre(estadoFiltro, estadosLocales)}</span>}
              {responsableFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Responsable: {getResponsableNombre(responsableFiltro, responsables)}</span>}
              {aseguradoraFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Aseguradora: {getAseguradoraNombre(aseguradoraFiltro, aseguradoras)}</span>}
              {ciudadFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ciudad: {getCiudadNombre(ciudadFiltro, ciudades)}</span>}
            </div>
            <p className="text-xs text-blue-600 mt-1">Mostrando {casosFiltrados.length} de {casos.length} casos</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-end mb-4">
        <div>
          <label className="text-sm font-medium block">Buscar por</label>
          <select
            className="border px-2 py-1 rounded"
            value={campoBusqueda}
            onChange={e => setCampoBusqueda(e.target.value)}
          >
            {camposVisibles.map(c => (
              <option key={c.clave} value={c.clave}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block">Término</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={terminoBusqueda}
            onChange={e => setTerminoBusqueda(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={obtenerCasos}
        >
          🔍 Buscar
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setModalColumnas(true)}
        >
          🗂️ Columnas
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={exportarExcel}
        >
          ⬇ Exportar Excel
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {camposVisibles.map(({ clave, label }) => (
                <th
                  key={clave}
                  onClick={() => cambiarOrden(clave)}
                  className="p-2 border-b cursor-pointer whitespace-nowrap hover:bg-gray-200 text-left"
                >
                  {label} {orden.campo === clave ? (orden.asc ? '↑' : '↓') : ''}
                </th>
              ))}
              <th className="p-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casosPaginados.length === 0 ? (
              <tr>
                <td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
              ) : 
              casosPaginados.map((caso, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {camposVisibles.map(({ clave, label }) => (
                    <td key={clave} className="p-2 whitespace-nowrap">
                      {clave === 'ciudadSucursal'
                         ? getCiudadNombre(caso[clave], ciudades || ciudadesProp)
                        : clave === 'codiEstdo'
                           ? getEstadoNombre(caso[clave], estadosProp || estadosLocales)
                          : clave === 'codiIspector'
                            ? getResponsableNombre(caso[clave], responsables)
                            : clave === 'codiAsgrdra'
                              ? getAseguradoraNombre(caso[clave], aseguradoras)
                          : (clave === 'fchaAsgncion' || clave === 'fchaInspccion' || clave === 'fchaInforme' || clave === 'fchaFactra')
                            ? (caso[clave] ? new Date(caso[clave]).toLocaleDateString() : '')
                            : caso[clave] || ''}
                    </td>
                  ))}
                  <td className="p-2 whitespace-nowrap space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => handleEdit(caso._id || caso.id_riesgo)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      onClick={() => handleDelete(caso._id || caso.id_riesgo)}
                    >
                      🗑️ Borrar
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">
          Página {paginaActual} de {totalPaginas}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <button
            onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      </div>
      {/* Modal de edición */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={handleCloseModal}
              title="Cerrar"
            >
              ×
            </button>
            <AgregarCasoRiesgo casoInicial={casoParaEditar} onClose={handleCloseModal} />
          </div>
        </div>
      )}
      {/* Modal de selección de columnas */}
      {modalColumnas && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setModalColumnas(false)}
              title="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Selecciona columnas a exportar</h3>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {todasLasColumnas.map(col => (
                <label key={col.clave} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={columnasSeleccionadas.includes(col.clave)}
                    onChange={e => {
                      if (e.target.checked) {
                        setColumnasSeleccionadas(prev => [...prev, col.clave]);
                      } else {
                        setColumnasSeleccionadas(prev => prev.filter(c => c !== col.clave));
                      }
                    }}
                  />
                  {col.label}
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setModalColumnas(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteRiesgo;