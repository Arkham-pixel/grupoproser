import React, { useEffect, useState } from 'react';
import { obtenerCasosRiesgo, obtenerResponsables, obtenerEstados, obtenerAseguradoras } from '../../services/riesgoService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Loader from "../Loader"; // Ajusta la ruta si es necesario

const Dashboard = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [responsableFiltro, setResponsableFiltro] = useState("");
  const [aseguradoraFiltro, setAseguradoraFiltro] = useState("");
  const [estados, setEstados] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);

  // Helper para mostrar nombre de estado
  const getEstadoNombre = codigo => {
    if (!estados || estados.length === 0) return codigo;
    const est = estados.find(e => String(e.codiEstdo) === String(codigo));
    return est ? est.descEstdo : codigo;
  };
  // Helper para mostrar nombre de responsable
  const getResponsableNombre = codigo => {
    if (!responsables || responsables.length === 0) return codigo;
    const resp = responsables.find(r => String(r.codiRespnsble) === String(codigo));
    return resp ? resp.nmbrRespnsble : codigo;
  };
  
  // Helper para mostrar nombre de aseguradora
  const getAseguradoraNombre = codigo => {
    if (!aseguradoras || aseguradoras.length === 0) return codigo;
    const aseg = aseguradoras.find(a => 
      String(a.cod1Asgrdra) === String(codigo) || 
      String(a.codiAsgrdra) === String(codigo)
    );
    return aseg ? aseg.rzonSocial : codigo;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [data, estadosData, responsablesData, aseguradorasData] = await Promise.all([
          obtenerCasosRiesgo(),
          obtenerEstados(),
          obtenerResponsables(),
          obtenerAseguradoras()
        ]);
        setEstados(Array.isArray(estadosData) ? estadosData : []);
        setResponsables(Array.isArray(responsablesData) ? responsablesData : []);
        setAseguradoras(Array.isArray(aseguradorasData) ? aseguradorasData : []);
        const mapeados = Array.isArray(data) ? data.map(caso => ({
          ...caso,
          estado: caso.codiEstdo || caso.estado,
          aseguradora: caso.asgrBenfcro || caso.aseguradora,
          fecha_creacion: caso.fchaAsgncion || caso.fecha_creacion,
          fecha_cierre: caso.fchaInforme || caso.fecha_cierre,
          numero_siniestro: caso.nmroRiesgo || caso.numero_siniestro,
          responsable: caso.codiIspector || caso.responsable,
        })) : [];
        setCasos(mapeados);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Filtros mejorados
  const casosFiltrados = casos.filter(caso => {
    let ok = true;
    
    // Filtro por fecha
    if (fechaDesde) {
      const f = caso.fecha_creacion ? new Date(caso.fecha_creacion) : null;
      if (!f || f < new Date(fechaDesde)) ok = false;
    }
    if (fechaHasta) {
      const f = caso.fecha_creacion ? new Date(caso.fecha_creacion) : null;
      if (!f || f > new Date(fechaHasta)) ok = false;
    }
    
    // Filtro por estado
    if (estadoFiltro) {
      ok = ok && String(caso.estado) === String(estadoFiltro);
    }
    
    // Filtro por responsable
    if (responsableFiltro) {
      ok = ok && String(caso.responsable) === String(responsableFiltro);
    }
    
    // Filtro por aseguradora
    if (aseguradoraFiltro) {
      ok = ok && String(caso.aseguradora) === String(aseguradoraFiltro);
    }
    return ok;
  });

  // Métricas
  const totalCasos = casosFiltrados.length;
  const estadosPendientes = ['PENDIENTE', 'EN PROCESO', 'SIN ASIGNAR', 1, 2, 3];
  const casosPendientes = casosFiltrados.filter(c => estadosPendientes.includes(c.estado)).length;
  const ultimosCasos = [...casosFiltrados]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);

  // Gráfico de barras → Casos por estado
  const casosPorEstado = Object.entries(
    casosFiltrados.reduce((acc, caso) => {
      const nombre = getEstadoNombre(caso.estado);
      acc[nombre] = (acc[nombre] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, cantidad]) => ({ estado, cantidad }));

  // Gráfico de barras horizontal → Top 10 aseguradoras
  const aseguradoraCount = {};
  casosFiltrados.forEach(caso => {
    if (caso.aseguradora) {
      aseguradoraCount[caso.aseguradora] = (aseguradoraCount[caso.aseguradora] || 0) + 1;
    }
  });
  const topAseguradoras = Object.entries(aseguradoraCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([aseguradora, cantidad]) => ({ aseguradora, cantidad }));

  // Gráfico de barras → Días promedio (fecha cierre - fecha creación) por responsable
  const diasPorResponsable = {};
  casosFiltrados.forEach(caso => {
    const fechaCierre = caso.fecha_cierre ? new Date(caso.fecha_cierre) : null;
    const fechaCreacion = caso.fecha_creacion ? new Date(caso.fecha_creacion) : null;
    if (fechaCierre && fechaCreacion) {
      const diffDias = Math.abs((fechaCierre - fechaCreacion) / (1000 * 60 * 60 * 24));
      if (!diasPorResponsable[caso.responsable]) {
        diasPorResponsable[caso.responsable] = [];
      }
      diasPorResponsable[caso.responsable].push(diffDias);
    }
  });
  const promedioDiasPorResponsable = Object.entries(diasPorResponsable)
    .map(([responsable, dias]) => {
      const promedio = dias.reduce((sum, d) => sum + d, 0) / dias.length;
      return { responsable: getResponsableNombre(responsable), promedioDias: Math.round(promedio) };
    });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33', '#FF6633'];

  // Listas únicas para los filtros
  const estadosUnicos = Array.from(new Set(casos.map(c => c.estado))).map(e => ({ value: e, label: getEstadoNombre(e) }));
  const responsablesUnicos = Array.from(new Set(casos.map(c => c.responsable))).map(r => ({ value: r, label: getResponsableNombre(r) }));
  const aseguradorasUnicas = Array.from(new Set(casos.map(c => c.aseguradora))).map(a => ({ value: a, label: getAseguradoraNombre(a) }));

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">📊 Dashboard de Casos de Riesgo</h2>

      {/* Filtros Mejorados */}
      <div className="bg-white shadow rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>

        {/* Información de filtros activos */}
        {(fechaDesde || fechaHasta || estadoFiltro || responsableFiltro || aseguradoraFiltro) && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-1">🔍 Filtros activos:</p>
            <div className="flex flex-wrap gap-1">
              {fechaDesde && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Desde: {fechaDesde}</span>}
              {fechaHasta && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Hasta: {fechaHasta}</span>}
              {estadoFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Estado: {getEstadoNombre(estadoFiltro)}</span>}
              {responsableFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Responsable: {getResponsableNombre(responsableFiltro)}</span>}
              {aseguradoraFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Aseguradora: {getAseguradoraNombre(aseguradoraFiltro)}</span>}
            </div>
            <p className="text-xs text-blue-600 mt-1">Mostrando {totalCasos} de {casos.length} casos</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white shadow rounded-lg p-3 sm:p-4 text-center">
          <h3 className="text-sm sm:text-lg font-semibold mb-2">Total de Casos</h3>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{totalCasos}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-3 sm:p-4 text-center">
          <h3 className="text-sm sm:text-lg font-semibold mb-2">Casos Pendientes</h3>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">{casosPendientes}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 text-center">Últimos Casos Registrados</h3>
          <ul className="text-xs sm:text-sm space-y-1">
            {ultimosCasos.map((caso, idx) => (
              <li key={caso._id || caso.nmroRiesgo || idx} className="flex justify-between">
                <span className="truncate mr-2">{caso.numero_siniestro || caso.nmroRiesgo || caso.codigo}</span>
                <span className="text-gray-500 text-xs">{caso.fecha_creacion?.substring(0, 10)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {/* Gráfico de Pastel - Estados */}
        <div className="bg-white shadow rounded-lg p-3 sm:p-4">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">🥧 Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-80">
            <PieChart>
              <Pie
                data={casosPorEstado}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ estado, percent }) => `${estado}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {casosPorEstado.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras - Estados */}
        <div className="bg-white shadow rounded-lg p-3 sm:p-4">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">📊 Casos por Estado</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-80">
            <BarChart data={casosPorEstado} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="estado" type="category" width={100} className="text-xs" />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Aseguradoras */}
        <div className="bg-white shadow rounded-lg p-3 sm:p-4 lg:col-span-2">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">🏢 Top 10 Aseguradoras</h3>
          <ResponsiveContainer width="100%" height={300} className="sm:h-80">
            <BarChart data={topAseguradoras} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="aseguradora" type="category" width={150} className="text-xs" />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de responsables */}
      <div className="bg-white shadow rounded-lg p-3 sm:p-4">
        <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">📅 Días promedio (Cierre → Creación) por Responsable</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-80">
          <BarChart data={promedioDiasPorResponsable}>
            <XAxis dataKey="responsable" className="text-xs" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="promedioDias" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;