// src/components/DashboardComplex.jsx
import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos } from '../services/siniestrosApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Loader from "./Loader";
import { 
  obtenerNombreEstado, 
  obtenerNombreAseguradora
} from '../data/mapeos';

const DashboardComplex = () => {
  const [siniestros, setSiniestros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [aseguradoraFiltro, setAseguradoraFiltro] = useState("");
  const [responsableFiltro, setResponsableFiltro] = useState("");

  useEffect(() => {
    setLoading(true);
    getSiniestrosEnriquecidos()
      .then(data => setSiniestros(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Filtrado de siniestros
  const siniestrosFiltrados = siniestros.filter(siniestro => {
    let ok = true;
    
    // Filtro por fecha de asignación
    if (fechaDesde) {
      const f = siniestro.fchaAsgncion ? new Date(siniestro.fchaAsgncion) : null;
      if (!f || f < new Date(fechaDesde)) ok = false;
    }
    if (fechaHasta) {
      const f = siniestro.fchaAsgncion ? new Date(siniestro.fchaAsgncion) : null;
      if (!f || f > new Date(fechaHasta)) ok = false;
    }
    
    // Filtro por estado
    if (estadoFiltro) {
      ok = ok && String(siniestro.codiEstdo) === String(estadoFiltro);
    }
    
    // Filtro por aseguradora
    if (aseguradoraFiltro) {
      ok = ok && String(siniestro.codiAsgrdra) === String(aseguradoraFiltro);
    }
    
    // Filtro por responsable
    if (responsableFiltro) {
      ok = ok && String(siniestro.nombreResponsable) === String(responsableFiltro);
    }
    
    return ok;
  });

  // Métricas basadas en datos filtrados
  const totalSiniestros = siniestrosFiltrados.length;

  // Contar cada tipo de pendiente por separado (usando datos filtrados)
  const pendienteDocumentos = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'PENDIENTE DOCUMENTOS'
  ).length;

  const pendienteAceptacionCliente = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'PENDIENTE ACEPTACION CLIENTE'
  ).length;

  const pendienteAceptacionCifras = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'PENDIENTE ACEPTACION CIFRAS'
  ).length;

  const enProceso = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'EN PROCESO'
  ).length;

  const cerrado = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'CERRADO'
  ).length;

  const suspendido = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'SUSPENDIDO'
  ).length;

  const revision = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'REVISION'
  ).length;

  const finalizado = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'FINALIZADO'
  ).length;

  const cancelado = siniestrosFiltrados.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'CANCELADO'
  ).length;

  const ultimosSiniestros = [...siniestrosFiltrados]
    .sort((a, b) => new Date(b.fchaAsgncion) - new Date(a.fchaAsgncion))
    .slice(0, 5);

  // Gráfico de barras → Siniestros por estado (usando datos filtrados)
  const siniestrosPorEstado = Object.entries(
    siniestrosFiltrados.reduce((acc, s) => {
      const nombreEstado = obtenerNombreEstado(s.codiEstdo);
      acc[nombreEstado] = (acc[nombreEstado] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, cantidad]) => ({ estado, cantidad }));

  // Gráfico circular → Siniestros por aseguradora (usando datos filtrados)
  const siniestrosPorAseguradora = Object.entries(
    siniestrosFiltrados.reduce((acc, s) => {
      const nombreAseguradora = obtenerNombreAseguradora(s.codiAsgrdra);
      acc[nombreAseguradora] = (acc[nombreAseguradora] || 0) + 1;
      return acc;
    }, {})
  ).map(([aseguradora, cantidad]) => ({ aseguradora, cantidad }));

  // Gráfico de barras → Siniestros por ajustador/responsable (usando datos filtrados)
  const siniestrosPorResponsable = Object.entries(
    siniestrosFiltrados.reduce((acc, s) => {
      const nombreResponsable = s.nombreResponsable || 'Sin asignar';
      acc[nombreResponsable] = (acc[nombreResponsable] || 0) + 1;
      return acc;
    }, {})
  ).map(([responsable, cantidad]) => ({ responsable, cantidad }));

  // Gráfico de barras → Siniestros por funcionario de aseguradora (usando datos filtrados)
  const siniestrosPorFuncionario = Object.entries(
    siniestrosFiltrados.reduce((acc, s) => {
      const nombreFuncionario = s.nombreFuncionario || 'Sin asignar';
      acc[nombreFuncionario] = (acc[nombreFuncionario] || 0) + 1;
      return acc;
    }, {})
  ).map(([funcionario, cantidad]) => ({ funcionario, cantidad }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33', '#FF6633'];

  // Listas únicas para los filtros
  const estadosUnicos = Array.from(new Set(siniestros.map(s => s.codiEstdo))).map(e => ({ 
    value: e, 
    label: obtenerNombreEstado(e) 
  }));
  
  const aseguradorasUnicas = Array.from(new Set(siniestros.map(s => s.codiAsgrdra))).map(a => ({ 
    value: a, 
    label: obtenerNombreAseguradora(a) 
  }));
  
  const responsablesUnicos = Array.from(new Set(siniestros.map(s => s.nombreResponsable).filter(Boolean))).map(r => ({ 
    value: r, 
    label: r 
  }));

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">📊 Dashboard de Siniestros</h2>

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
        </div>
        
        {/* Botón para limpiar filtros */}
        <div className="mt-3 text-center">
          <button 
            onClick={() => {
              setFechaDesde("");
              setFechaHasta("");
              setEstadoFiltro("");
              setAseguradoraFiltro("");
              setResponsableFiltro("");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
        
        {/* Información de filtros activos */}
        {(fechaDesde || fechaHasta || estadoFiltro || aseguradoraFiltro || responsableFiltro) && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-1">🔍 Filtros activos:</p>
            <div className="flex flex-wrap gap-1">
              {fechaDesde && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Desde: {fechaDesde}</span>}
              {fechaHasta && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Hasta: {fechaHasta}</span>}
              {estadoFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Estado: {obtenerNombreEstado(estadoFiltro)}</span>}
              {aseguradoraFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Aseguradora: {obtenerNombreAseguradora(aseguradoraFiltro)}</span>}
              {responsableFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Responsable: {responsableFiltro}</span>}
            </div>
            <p className="text-xs text-blue-600 mt-1">Mostrando {totalSiniestros} de {siniestros.length} siniestros</p>
          </div>
        )}
      </div>

      {/* Tarjeta de total */}
      <div className="bg-white shadow rounded-lg p-3 sm:p-4 text-center mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-lg font-semibold mb-2">Total de Siniestros</h3>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{totalSiniestros}</p>
      </div>

      {/* Tarjetas de estados por separado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Pendiente Documentos</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-500">{pendienteDocumentos}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Pendiente Aceptación Cliente</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-500">{pendienteAceptacionCliente}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Pendiente Aceptación Cifras</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500">{pendienteAceptacionCifras}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">En Proceso</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-500">{enProceso}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Cerrado</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-500">{cerrado}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Suspendido</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500">{suspendido}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Revisión</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-500">{revision}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Finalizado</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-teal-500">{finalizado}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-2 sm:p-3 lg:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Cancelado</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{cancelado}</p>
        </div>
      </div>

      {/* Últimos siniestros */}
      <div className="bg-white shadow rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-lg font-semibold mb-2 text-center">Últimos Siniestros Registrados</h3>
          <ul className="text-xs sm:text-sm space-y-1">
          {ultimosSiniestros.map(s => (
            <li key={s._id} className="flex justify-between">
              <span className="truncate mr-2">{s.nmroSinstro}</span>
              <span className="text-gray-500 text-xs">{s.fchaAsgncion?.substring(0, 10)}</span>
              </li>
            ))}
          </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white shadow rounded-lg p-3 sm:p-4">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">📊 Siniestros por Estado</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-80">
            <BarChart data={siniestrosPorEstado}>
              <XAxis dataKey="estado" className="text-xs" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-3 sm:p-4">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">🥧 Siniestros por Aseguradora</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-80">
            <PieChart>
              <Pie
                data={siniestrosPorAseguradora}
                dataKey="cantidad"
                nameKey="aseguradora"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {siniestrosPorAseguradora.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-3 sm:p-4">
        <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">👥 Siniestros por Ajustador/Responsable</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-80">
          <BarChart data={siniestrosPorResponsable}>
            <XAxis dataKey="responsable" className="text-xs" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-lg p-3 sm:p-4 mt-6 sm:mt-8">
        <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-center">👨‍💼 Siniestros por Funcionario de Aseguradora</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-80">
          <BarChart data={siniestrosPorFuncionario}>
            <XAxis dataKey="funcionario" className="text-xs" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardComplex;
