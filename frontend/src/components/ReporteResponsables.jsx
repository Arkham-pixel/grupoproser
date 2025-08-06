import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import { getEstados } from '../services/estadosService';
import { obtenerAseguradoras, obtenerResponsables } from '../services/riesgoService';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import * as XLSX from 'xlsx';

const todosLosCampos = [
  { clave: 'nmroAjste', label: 'No. Ajuste' },
  { clave: 'nmroSinstro', label: 'No. de Siniestro' },
  { clave: 'nombIntermediario', label: 'Intermediario' },
  { clave: 'codWorkflow', label: 'Cod Workflow' },
  { clave: 'nmroPolza', label: 'No. de Poliza' },
  { clave: 'nombreResponsable', label: 'Responsable' },
  { clave: 'codiAsgrdra', label: 'Aseguradora' },
  { clave: 'asgrBenfcro', label: 'Asegurado o Beneficiario' },
  { clave: 'fchaAsgncion', label: 'Fecha Asignacion' },
  { clave: 'fchaInspccion', label: 'Fecha de Inspeccion' },
  { clave: 'fchaUltDoc', label: 'Fecha Ultimo Documento' },
  { clave: 'fchaInfoFnal', label: 'Fecha del Informme Final' },
  { clave: 'codi_estdo', label: 'Estado del Siniestro' },
  { clave: 'nombreFuncionario', label: 'Funcionario Aseguradora' },
  { clave: 'diasUltRev', label: 'Dias Ultima Revisión' },
  { clave: 'obseSegmnto', label: 'Observaciones de Seguimiento' },
];

const columnasIniciales = [
  'nmroAjste',
  'nmroSinstro',
  'nombIntermediario',
  'codWorkflow',
  'nmroPolza',
  'nombreResponsable',
  'codiAsgrdra',
  'asgrBenfcro',
  'fchaAsgncion',
  'fchaInspccion',
  'fchaUltDoc',
  'fchaInfoFnal',
  'codi_estdo',
  'nombreFuncionario',
  'diasUltRev',
  'obseSegmnto'
];

export default function ReporteResponsables() {
  const [siniestros, setSiniestros] = useState([]);
  const [siniestrosFiltrados, setSiniestrosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estados, setEstados] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [siniestroEditar, setSiniestroEditar] = useState(null);

  // Estados para filtros
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroResponsable, setFiltroResponsable] = useState('');
  const [filtroAseguradora, setFiltroAseguradora] = useState('');

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estados para filtros de columnas
  const [camposVisibles, setCamposVisibles] = useState(new Set(columnasIniciales));

  // Obtener información del usuario actual
  const usuarioActual = {
    login: localStorage.getItem('login'),
    nombre: localStorage.getItem('nombre'),
    rol: localStorage.getItem('rol'),
    tipoUsuario: localStorage.getItem('tipoUsuario')
  };

  console.log('👤 Usuario actual en ReporteResponsables:', usuarioActual);

  // Funciones de ayuda para obtener nombres
  const getNombreEstado = (codigoEstado) => {
    if (!codigoEstado) return 'Sin estado';
    const estado = estados.find(e => e.codigoestado === codigoEstado || e.codigo === codigoEstado);
    return estado ? estado.nombreestado || estado.nombre : codigoEstado;
  };

  const getNombreAseguradora = (codigoAseguradora) => {
    if (!codigoAseguradora) return 'Sin aseguradora';
    const aseguradora = aseguradoras.find(a => a.codigo === codigoAseguradora);
    return aseguradora ? aseguradora.nombre : codigoAseguradora;
  };

  const getNombreResponsable = (siniestro) => {
    if (siniestro.nombreResponsable) return siniestro.nombreResponsable;
    if (siniestro.responsable_form) return siniestro.responsable_form;
    const responsable = responsables.find(r => r.codigo === siniestro.codi_responble);
    return responsable ? responsable.nombre : 'Sin responsable';
  };

  const getNombreIntermediario = (siniestro) => {
    if (siniestro.nombIntermediario) return siniestro.nombIntermediario;
    if (siniestro.intermediario_form) return siniestro.intermediario_form;
    return 'Sin intermediario';
  };

  useEffect(() => {
    Promise.allSettled([
      getSiniestrosEnriquecidos(),
      getEstados(),
      obtenerAseguradoras(),
      obtenerResponsables()
    ])
      .then(([siniestrosResult, estadosResult, aseguradorasResult, responsablesResult]) => {
        if (siniestrosResult.status === 'fulfilled') {
          const todosLosSiniestros = Array.isArray(siniestrosResult.value) ? siniestrosResult.value : [];
          
          // 🔥 FILTRAR SOLO CASOS ASIGNADOS AL RESPONSABLE ACTUAL
          const siniestrosFiltradosPorResponsable = todosLosSiniestros.filter(siniestro => {
            const responsableDelCaso = getNombreResponsable(siniestro);
            const loginActual = usuarioActual.login;
            const nombreActual = usuarioActual.nombre;
            
            console.log('🔍 Verificando caso:', {
              numeroAjuste: siniestro.nmroAjste,
              responsableDelCaso,
              loginActual,
              nombreActual,
              coincideLogin: responsableDelCaso === loginActual,
              coincideNombre: responsableDelCaso === nombreActual
            });
            
            // Verificar si el responsable del caso coincide con el usuario actual
            return responsableDelCaso === loginActual || 
                   responsableDelCaso === nombreActual ||
                   siniestro.codi_responble === loginActual;
          });
          
          console.log('📊 Casos filtrados para responsable:', {
            total: todosLosSiniestros.length,
            filtrados: siniestrosFiltradosPorResponsable.length,
            usuario: usuarioActual.login
          });
          
          setSiniestros(siniestrosFiltradosPorResponsable);
          setSiniestrosFiltrados(siniestrosFiltradosPorResponsable);
        } else {
          console.error('Error al cargar siniestros:', siniestrosResult.reason);
          setSiniestros([]);
          setSiniestrosFiltrados([]);
        }

        if (estadosResult.status === 'fulfilled') {
          setEstados(Array.isArray(estadosResult.value) ? estadosResult.value : []);
        }

        if (aseguradorasResult.status === 'fulfilled') {
          setAseguradoras(Array.isArray(aseguradorasResult.value) ? aseguradorasResult.value : []);
        }

        if (responsablesResult.status === 'fulfilled') {
          setResponsables(Array.isArray(responsablesResult.value) ? responsablesResult.value : []);
        }
      })
      .catch(err => {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [usuarioActual.login, usuarioActual.nombre]);

  // Función para aplicar filtros avanzados
  const aplicarFiltros = () => {
    let filtrados = [...siniestros];

    // Filtro por fecha
    if (filtroFechaInicio) {
      filtrados = filtrados.filter(s => {
        const fecha = s.fchaAsgncion || s.fecha_asignacion_form;
        return fecha && fecha >= filtroFechaInicio;
      });
    }

    if (filtroFechaFin) {
      filtrados = filtrados.filter(s => {
        const fecha = s.fchaAsgncion || s.fecha_asignacion_form;
        return fecha && fecha <= filtroFechaFin;
      });
    }

    // Filtro por estado
    if (filtroEstado) {
      filtrados = filtrados.filter(s => {
        const estado = getNombreEstado(s.codi_estdo);
        return estado.toLowerCase().includes(filtroEstado.toLowerCase());
      });
    }

    // Filtro por responsable
    if (filtroResponsable) {
      filtrados = filtrados.filter(s => {
        const responsable = getNombreResponsable(s);
        return responsable.toLowerCase().includes(filtroResponsable.toLowerCase());
      });
    }

    // Filtro por aseguradora
    if (filtroAseguradora) {
      filtrados = filtrados.filter(s => {
        const aseguradora = getNombreAseguradora(s.codiAsgrdra);
        return aseguradora.toLowerCase().includes(filtroAseguradora.toLowerCase());
      });
    }

    setSiniestrosFiltrados(filtrados);
    setPaginaActual(1);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtroFechaInicio, filtroFechaFin, filtroEstado, filtroResponsable, filtroAseguradora, siniestros]);

  // Funciones para manejar la paginación
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const siniestrosPaginados = siniestrosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(siniestrosFiltrados.length / registrosPorPagina);

  // Función para exportar a Excel
  const exportarAExcel = () => {
    const datosParaExportar = siniestrosFiltrados.map(siniestro => {
      const fila = {};
      camposVisibles.forEach(clave => {
        const campo = todosLosCampos.find(c => c.clave === clave);
        if (campo) {
          switch (clave) {
            case 'codi_estdo':
              fila[campo.label] = getNombreEstado(siniestro[clave]);
              break;
            case 'codiAsgrdra':
              fila[campo.label] = getNombreAseguradora(siniestro[clave]);
              break;
            case 'nombreResponsable':
              fila[campo.label] = getNombreResponsable(siniestro);
              break;
            case 'nombIntermediario':
              fila[campo.label] = getNombreIntermediario(siniestro);
              break;
            default:
              fila[campo.label] = siniestro[clave] || '';
          }
        }
      });
      return fila;
    });

    const ws = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mis Casos Asignados");
    XLSX.writeFile(wb, `mis_casos_asignados_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Función para manejar la visibilidad de columnas
  const toggleColumna = (clave) => {
    const nuevasCamposVisibles = new Set(camposVisibles);
    if (nuevasCamposVisibles.has(clave)) {
      nuevasCamposVisibles.delete(clave);
    } else {
      nuevasCamposVisibles.add(clave);
    }
    setCamposVisibles(nuevasCamposVisibles);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando casos asignados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          📋 Mis Casos Asignados
        </h1>
        <p className="text-blue-600">
          👤 Usuario: <strong>{usuarioActual.nombre || usuarioActual.login}</strong>
        </p>
        <p className="text-sm text-blue-500">
          Mostrando únicamente los casos asignados a tu responsabilidad
        </p>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">🔍 Filtros Avanzados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 Fecha Inicio
            </label>
            <input
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 Fecha Fin
            </label>
            <input
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📊 Estado
            </label>
            <input
              type="text"
              placeholder="Filtrar por estado..."
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              👤 Responsable
            </label>
            <input
              type="text"
              placeholder="Filtrar por responsable..."
              value={filtroResponsable}
              onChange={(e) => setFiltroResponsable(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🏢 Aseguradora
            </label>
            <input
              type="text"
              placeholder="Filtrar por aseguradora..."
              value={filtroAseguradora}
              onChange={(e) => setFiltroAseguradora(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Controles de Exportación y Columnas */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              📊 Total: {siniestrosFiltrados.length} casos
            </span>
          </div>
          <button
            onClick={exportarAExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>📥</span>
            <span>Exportar a Excel</span>
          </button>
        </div>

        {/* Selector de Columnas */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Columnas Visibles:</h4>
          <div className="flex flex-wrap gap-2">
            {todosLosCampos.map(campo => (
              <label key={campo.clave} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={camposVisibles.has(campo.clave)}
                  onChange={() => toggleColumna(campo.clave)}
                  className="rounded"
                />
                <span>{campo.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Siniestros */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {Array.from(camposVisibles).map(clave => {
                  const campo = todosLosCampos.find(c => c.clave === clave);
                  return campo ? (
                    <th key={clave} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {campo.label}
                    </th>
                  ) : null;
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {siniestrosPaginados.map((siniestro, index) => (
                <tr key={siniestro._id || index} className="hover:bg-gray-50">
                  {Array.from(camposVisibles).map(clave => {
                    const campo = todosLosCampos.find(c => c.clave === clave);
                    if (!campo) return null;

                    let valor = '';
                    switch (clave) {
                      case 'codi_estdo':
                        valor = getNombreEstado(siniestro[clave]);
                        break;
                      case 'codiAsgrdra':
                        valor = getNombreAseguradora(siniestro[clave]);
                        break;
                      case 'nombreResponsable':
                        valor = getNombreResponsable(siniestro);
                        break;
                      case 'nombIntermediario':
                        valor = getNombreIntermediario(siniestro);
                        break;
                      default:
                        valor = siniestro[clave] || '';
                    }

                    return (
                      <td key={clave} className="px-4 py-3 whitespace-nowrap text-gray-900">
                        {valor}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFin, siniestrosFiltrados.length)} de {siniestrosFiltrados.length} casos
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm font-medium">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {siniestrosFiltrados.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-yellow-600 text-lg mb-2">📭 No hay casos asignados</div>
          <p className="text-yellow-700">
            No tienes casos asignados a tu responsabilidad en este momento.
          </p>
        </div>
      )}

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <FormularioCasoComplex
          visible={mostrarFormulario}
          onCancel={() => {
            setMostrarFormulario(false);
            setSiniestroEditar(null);
          }}
          siniestroEditar={siniestroEditar}
          onSuccess={() => {
            setMostrarFormulario(false);
            setSiniestroEditar(null);
            // Recargar datos
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}