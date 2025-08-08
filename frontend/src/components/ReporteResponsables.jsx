import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import { getEstados } from '../services/estadosService';
import { obtenerAseguradoras, obtenerResponsables } from '../services/riesgoService';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import * as XLSX from 'xlsx';

// Función para convertir fechas al formato de input
function toDateInputValue(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
}

// Función para mapear siniestro al formato del formulario
const mapSiniestroToForm = (siniestro) => ({
  // Campos principales que coinciden con el formulario
  nmroAjste: siniestro.nmroAjste || '',
  nmroSinstro: siniestro.nmroSinstro || '',
  nombIntermediario: siniestro.nombIntermediario || '',
  codWorkflow: siniestro.codWorkflow || '',
  nmroPolza: siniestro.nmroPolza || '',
  codiRespnsble: siniestro.codiRespnsble || '',
  nombreResponsable: siniestro.nombreResponsable || '',
  codiAsgrdra: siniestro.codiAsgrdra || '',
  funcAsgrdra: siniestro.funcAsgrdra || '',
  nombreFuncionario: siniestro.nombreFuncionario || '',
  asgrBenfcro: siniestro.asgrBenfcro || '',
  tipoDucumento: siniestro.tipoDucumento || '',
  numDocumento: siniestro.numDocumento || '',
  tipoPoliza: siniestro.tipoPoliza || '',
  ciudadSiniestro: siniestro.ciudadSiniestro || '',
  amprAfctdo: siniestro.amprAfctdo || '',
  descSinstro: siniestro.descSinstro || '',
  causa_siniestro: siniestro.causa_siniestro || '',
  estado: siniestro.codiEstdo || '',
  fchaAsgncion: toDateInputValue(siniestro.fchaAsgncion),
  fchaSinstro: toDateInputValue(siniestro.fchaSinstro),
  fchaInspccion: toDateInputValue(siniestro.fchaInspccion),
  fchaContIni: toDateInputValue(siniestro.fchaContIni),
  
  // Campos adicionales para el formulario
  aseguradora: siniestro.codiAsgrdra || '',
  funcionario_aseguradora: siniestro.nombreFuncionario || '',
  responsable: siniestro.codiRespnsble || '',
  asegurado: siniestro.asgrBenfcro || '',
  tipo_documento: siniestro.tipoDucumento || '',
  numero_documento: siniestro.numDocumento || '',
  fecha_siniestro: toDateInputValue(siniestro.fchaSinstro),
  ciudad_siniestro: siniestro.ciudadSiniestro || '',
  descripcion_siniestro: siniestro.descSinstro || '',
  tipo_poliza: siniestro.tipoPoliza || '',
  numero_poliza: siniestro.nmroPolza || '',
  fecha_asignacion: toDateInputValue(siniestro.fchaAsgncion),
  
  // Campos de valores y prestaciones
  valor_reserva: siniestro.vlor_resrva || '',
  valor_reclamo: siniestro.vlor_reclmo || '',
  monto_indemnizar: siniestro.monto_indmzar || '',
  valor_servicio: siniestro.vlor_servcios || '',
  valor_gastos: siniestro.vlor_gastos || '',
  
  // Campos de fechas adicionales
  fecha_contacto_inicial: toDateInputValue(siniestro.fchaContIni),
  fecha_solicitud_documentos: toDateInputValue(siniestro.fcha_soli_docu),
  fecha_informe_preliminar: toDateInputValue(siniestro.fcha_info_prelm),
  fecha_informe_final: toDateInputValue(siniestro.fcha_info_fnal),
  fecha_ultimo_documento: toDateInputValue(siniestro.fcha_ult_doc),
  fecha_factura: toDateInputValue(siniestro.fcha_factra),
  fecha_ultima_revision: toDateInputValue(siniestro.fcha_ult_revi),
  fecha_ultimo_seguimiento: toDateInputValue(siniestro.fcha_ult_segui),
  
  // Campos de observaciones
  observaciones_contacto_inicial: siniestro.obse_cont_ini || '',
  observacion_inspeccion: siniestro.obse_inspccion || '',
  observacion_solicitud_documento: siniestro.obse_soli_docu || '',
  observacion_informe_preliminar: siniestro.obse_info_prelm || '',
  observacion_informe_final: siniestro.obse_info_fnal || '',
  observacion_compromisos: siniestro.obse_comprmsi || '',
  observacion_seguimiento_pendientes: siniestro.obse_segmnto || '',
  
  // Campos de adjuntos
  adjuntos_contacto_inicial: siniestro.anex_cont_ini || '',
  adjunto_acta_inspeccion: siniestro.anex_acta_inspccion || '',
  adjunto_solicitud_documento: siniestro.anex_sol_doc || '',
  adjunto_informe_preliminar: siniestro.anxo_inf_prelim || '',
  adjunto_informe_final: siniestro.anxo_info_fnal || '',
  adjunto_entrega_ultimo_documento: siniestro.anxo_repo_acti || '',
  adjunto_factura: siniestro.anxo_factra || '',
  adjunto_seguimientos_pendientes: siniestro.anxo_ult_segui || '',
  
  // Campos adicionales
  numero_factura: siniestro.numero_factura || '',
  creado_en: siniestro.creado_en || '',
  historialDocs: siniestro.historialDocs || [],
  
  // ID para edición
  _id: siniestro._id || ''
});

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
  const [editSiniestro, setEditSiniestro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados para filtros
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
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
    const valorStr = codigoEstado !== undefined && codigoEstado !== null ? String(codigoEstado) : '';
    const estado = estados.find(e => String(e.codiEstdo) === valorStr);
    if (!estado && valorStr) {
      console.warn('No se encontró estado para:', valorStr, 'en', estados.map(e => String(e.codiEstdo)));
    }
    return estado ? estado.descEstdo : valorStr;
  };

  const getNombreAseguradora = (codigoAseguradora) => {
    const valorStr = codigoAseguradora !== undefined && codigoAseguradora !== null ? String(codigoAseguradora) : '';
    const aseguradora = aseguradoras.find(a => 
      String(a.cod1Asgrdra) === valorStr || 
      String(a.codiAsgrdra) === valorStr
    );
    return aseguradora ? aseguradora.rzonSocial : valorStr;
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
          
          // Ordenar del más nuevo al más viejo por fecha de asignación
          const siniestrosOrdenados = siniestrosFiltradosPorResponsable.sort((a, b) => {
            const fechaA = new Date(a.fchaAsgncion || a.fecha_asignacion_form || 0);
            const fechaB = new Date(b.fchaAsgncion || b.fecha_asignacion_form || 0);
            return fechaB - fechaA; // Orden descendente (más nuevo primero)
          });
          
          setSiniestros(siniestrosOrdenados);
          setSiniestrosFiltrados(siniestrosOrdenados);
        } else {
          console.error('Error al cargar siniestros:', siniestrosResult.reason);
          setSiniestros([]);
          setSiniestrosFiltrados([]);
        }

        if (estadosResult.status === 'fulfilled') {
          console.log('✅ Estados cargados:', estadosResult.value);
          console.log('📊 Primer estado:', estadosResult.value[0]);
          console.log('🔍 Propiedades del primer estado:', estadosResult.value[0] ? Object.keys(estadosResult.value[0]) : 'No hay estados');
          setEstados(Array.isArray(estadosResult.value) ? estadosResult.value : []);
        } else {
          console.error('❌ Error cargando estados:', estadosResult.reason);
        }

        if (aseguradorasResult.status === 'fulfilled') {
          console.log('✅ Aseguradoras cargadas:', aseguradorasResult.value);
          console.log('📊 Primera aseguradora:', aseguradorasResult.value[0]);
          console.log('🔍 Propiedades de la primera aseguradora:', aseguradorasResult.value[0] ? Object.keys(aseguradorasResult.value[0]) : 'No hay aseguradoras');
          setAseguradoras(Array.isArray(aseguradorasResult.value) ? aseguradorasResult.value : []);
        } else {
          console.error('❌ Error cargando aseguradoras:', aseguradorasResult.reason);
        }

        if (responsablesResult.status === 'fulfilled') {
          console.log('✅ Responsables cargados:', responsablesResult.value);
          setResponsables(Array.isArray(responsablesResult.value) ? responsablesResult.value : []);
        } else {
          console.error('❌ Error cargando responsables:', responsablesResult.reason);
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

  // Debug: verificar cuando cambian los estados y aseguradoras
  useEffect(() => {
    console.log('🔄 Estados actualizados:', estados);
    console.log('📊 Total de estados:', estados.length);
    if (estados.length > 0) {
      console.log('📋 Primer estado:', estados[0]);
      console.log('🔑 Propiedades del primer estado:', Object.keys(estados[0]));
    }
  }, [estados]);

  useEffect(() => {
    console.log('🔄 Aseguradoras actualizadas:', aseguradoras);
    console.log('📊 Total de aseguradoras:', aseguradoras.length);
    if (aseguradoras.length > 0) {
      console.log('📋 Primera aseguradora:', aseguradoras[0]);
      console.log('🔑 Propiedades de la primera aseguradora:', Object.keys(aseguradoras[0]));
    }
  }, [aseguradoras]);



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
        return String(s.codiEstdo) === String(filtroEstado);
      });
    }

    // Filtro por aseguradora
    if (filtroAseguradora) {
      filtrados = filtrados.filter(s => {
        return String(s.codiAsgrdra) === String(filtroAseguradora);
      });
    }

    setSiniestrosFiltrados(filtrados);
    setPaginaActual(1);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtroFechaInicio, filtroFechaFin, filtroEstado, filtroAseguradora, siniestros]);

  // Listas únicas para los filtros
  const estadosUnicos = Array.from(new Set(siniestros.map(s => s.codiEstdo).filter(Boolean))).map(e => ({ 
    value: e, 
    label: getNombreEstado(e) 
  }));
  
  const responsablesUnicos = Array.from(new Set(siniestros.map(s => s.nombreResponsable).filter(Boolean))).map(r => ({ 
    value: r, 
    label: r 
  }));
  
  const aseguradorasUnicas = Array.from(new Set(siniestros.map(s => s.codiAsgrdra).filter(Boolean))).map(a => ({ 
    value: a, 
    label: getNombreAseguradora(a) 
  }));

  // Debug: verificar datos
  console.log('🔍 Debug ReporteResponsables:', {
    siniestros: siniestros.length,
    estados: estados.length,
    aseguradoras: aseguradoras.length,
    estadosUnicos: estadosUnicos.length,
    aseguradorasUnicas: aseguradorasUnicas.length,
    primerSiniestro: siniestros[0],
    primerEstado: estados[0],
    primeraAseguradora: aseguradoras[0]
  });

  // Funciones para manejar la paginación - Mostrar todos los casos sin paginación
  const siniestrosPaginados = siniestrosFiltrados; // Mostrar todos los casos
  const totalPaginas = 1; // Solo una página

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

  // Funciones para edición de casos
  const handleEdit = (siniestro) => {
    setEditSiniestro(mapSiniestroToForm(siniestro));
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este siniestro?')) {
      try {
        await deleteSiniestro(id);
        alert('Siniestro eliminado correctamente');
        // Recargar datos
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar el siniestro:', error);
        alert('Error al eliminar el siniestro');
      }
    }
  };

  const handleSave = async (formData) => {
    if (!formData._id) return;
    setLoading(true);
    try {
      await updateSiniestro(formData._id, formData);
      setModalOpen(false);
      setEditSiniestro(null);
      // Recargar datos
      window.location.reload();
    } catch (error) {
      alert('Error al guardar los cambios');
    }
    setLoading(false);
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
        <p className="text-sm text-green-600 font-medium">
          ✅ Mostrando todos los casos sin paginación
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
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos los estados</option>
              {estadosUnicos.map((e, index) => (
                <option key={`estado-${e.value}-${index}`} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🏢 Aseguradora
            </label>
            <select
              value={filtroAseguradora}
              onChange={(e) => setFiltroAseguradora(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todas las aseguradoras</option>
              {aseguradorasUnicas.map((a, index) => (
                <option key={`aseguradora-${a.value}-${index}`} value={a.value}>{a.label}</option>
              ))}
            </select>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(siniestro)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(siniestro._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      🗑️ Borrar
                    </button>
                  </td>
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

      {/* Modal con FormularioCasoComplex */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            {/* Botón X para cerrar */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold z-10"
              onClick={() => { setModalOpen(false); setEditSiniestro(null); }}
              title="Cerrar"
            >
              ×
            </button>
            <FormularioCasoComplex
              initialData={editSiniestro}
              onSave={handleSave}
              onCancel={() => { setModalOpen(false); setEditSiniestro(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}