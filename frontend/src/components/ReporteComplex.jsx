import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import { getEstados } from '../services/estadosService';
import { obtenerAseguradoras, obtenerResponsables } from '../services/riesgoService';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import * as XLSX from 'xlsx';
import config from '../config.js';
// Elimina la importación de antd

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
  // Campos adicionales de FormularioCasoComplex, con claves únicas
  { clave: 'responsable_form', label: 'Responsable (formulario)' },
  { clave: 'aseguradora_form', label: 'Aseguradora (formulario)' },
  { clave: 'funcionario_aseguradora_form', label: 'Funcionario Aseguradora (formulario)' },
  { clave: 'numero_siniestro_form', label: 'Número de Siniestro (formulario)' },
  { clave: 'codigo_workflow_form', label: 'Código Workflow (formulario)' },
  { clave: 'intermediario_form', label: 'Intermediario (formulario)' },
  { clave: 'numero_poliza_form', label: 'Número de Póliza (formulario)' },
  { clave: 'asegurado_form', label: 'Asegurado (formulario)' },
  { clave: 'tipo_documento_form', label: 'Tipo de Documento (formulario)' },
  { clave: 'numero_documento_form', label: 'Número de Documento (formulario)' },
  { clave: 'fecha_asignacion_form', label: 'Fecha Asignación (formulario)' },
  { clave: 'fecha_siniestro_form', label: 'Fecha Siniestro (formulario)' },
  { clave: 'ciudad_siniestro_form', label: 'Ciudad Siniestro (formulario)' },
  { clave: 'tipo_poliza_form', label: 'Tipo de Póliza (formulario)' },
  { clave: 'causa_siniestro_form', label: 'Causa Siniestro (formulario)' },
  { clave: 'estado_form', label: 'Estado (formulario)' },
  { clave: 'descripcion_siniestro_form', label: 'Descripción Siniestro (formulario)' },
  // Puedes agregar aquí más campos del formulario según los vayas necesitando, siempre con clave única
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

// Función para convertir fechas ISO a yyyy-MM-dd para inputs tipo date
function toDateInputValue(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const off = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - off);
  return d.toISOString().slice(0, 10);
}

// Función para mapear TODOS los campos del siniestro al formulario
const mapSiniestroToForm = (siniestro) => ({
  responsable: siniestro.nombreResponsable || '',
  aseguradora: siniestro.codiAsgrdra || '',
  funcionario_aseguradora: siniestro.nombreFuncionario || '',
  numero_siniestro: siniestro.nmroSinstro || '',
  codigo_workflow: siniestro.codWorkflow || '',
  intermediario: siniestro.intermediario || '',
  numero_poliza: siniestro.nmroPolza || '',
  asegurado: siniestro.asgrBenfcro || '',
  tipo_documento: siniestro.tipoDucumento || '',
  numero_documento: siniestro.numDocumento || '',
  fecha_asignacion: toDateInputValue(siniestro.fchaAsgncion),
  fecha_siniestro: toDateInputValue(siniestro.fchaSinstro),
  ciudad_siniestro: siniestro.ciudadSiniestro || '',
  tipo_poliza: siniestro.tipoPoliza || '',
  causa_siniestro: siniestro.causa_siniestro || '',
  estado: siniestro.codiEstdo || '',
  descripcion_siniestro: siniestro.descSinstro || '',
  fcha_inspccion: toDateInputValue(siniestro.fchaInspccion),
  fcha_soli_docu: toDateInputValue(siniestro.fcha_soli_docu),
  fcha_info_prelm: toDateInputValue(siniestro.fcha_info_prelm),
  fcha_info_fnal: toDateInputValue(siniestro.fcha_info_fnal),
  fcha_repo_acti: toDateInputValue(siniestro.fcha_repo_acti),
  fcha_ult_segui: toDateInputValue(siniestro.fcha_ult_segui),
  fcha_act_segui: toDateInputValue(siniestro.fcha_act_segui),
  fcha_finqto_indem: toDateInputValue(siniestro.fcha_finqto_indem),
  fcha_factra: toDateInputValue(siniestro.fcha_factra),
  fcha_ult_revi: toDateInputValue(siniestro.fcha_ult_revi),
  // Números y montos
  dias_transcrrdo: siniestro.dias_transcrrdo || '',
  vlor_resrva: siniestro.vlor_resrva || '',
  vlor_reclmo: siniestro.vlor_reclmo || '',
  monto_indmzar: siniestro.monto_indmzar || '',
  vlor_servcios: siniestro.vlor_servcios || '',
  vlor_gastos: siniestro.vlor_gastos || '',
  total: siniestro.total || '',
  total_general: siniestro.total_general || '',
  total_pagado: siniestro.total_pagado || '',
  iva: siniestro.iva || '',
  reteiva: siniestro.reteiva || '',
  retefuente: siniestro.retefuente || '',
  reteica: siniestro.reteica || '',
  porc_iva: siniestro.porc_iva || '',
  porc_reteiva: siniestro.porc_reteiva || '',
  porc_retefuente: siniestro.porc_retefuente || '',
  porc_reteica: siniestro.porc_reteica || '',
  // Adjuntos y observaciones
  obse_cont_ini: siniestro.obse_cont_ini || '',
  anex_cont_ini: siniestro.anex_cont_ini || '',
  obse_inspccion: siniestro.obse_inspccion || '',
  anex_acta_inspccion: siniestro.anex_acta_inspccion || '',
  anex_sol_doc: siniestro.anex_sol_doc || '',
  obse_soli_docu: siniestro.obse_soli_docu || '',
  anxo_inf_prelim: siniestro.anxo_inf_prelim || '',
  obse_info_prelm: siniestro.obse_info_prelm || '',
  anxo_info_fnal: siniestro.anxo_info_fnal || '',
  obse_info_fnal: siniestro.obse_info_fnal || '',
  anxo_repo_acti: siniestro.anxo_repo_acti || '',
  obse_repo_acti: siniestro.obse_repo_acti || '',
  anxo_factra: siniestro.anxo_factra || '',
  anxo_honorarios: siniestro.anxo_honorarios || '',
  anxo_honorariosdefinit: siniestro.anxo_honorariosdefinit || '',
  anxo_autorizacion: siniestro.anxo_autorizacion || '',
  obse_comprmsi: siniestro.obse_comprmsi || '',
  obse_segmnto: siniestro.obse_segmnto || '',
  // ...agrega aquí cualquier otro campo que uses en el formulario
});

const ReporteComplex = () => {
  // Obtener información del usuario actual
  const usuarioActual = {
    login: localStorage.getItem('login'),
    nombre: localStorage.getItem('nombre'),
    rol: localStorage.getItem('rol'),
    tipoUsuario: localStorage.getItem('tipoUsuario')
  };

  // Verificar si es admin
  const esAdmin = usuarioActual.rol === 'admin' || usuarioActual.rol === 'administrador';

  console.log('👤 Usuario actual en ReporteComplex:', usuarioActual);
  console.log('🔐 Es admin?', esAdmin);

  // Mover todos los hooks aquí dentro
  const [camposVisibles, setCamposVisibles] = useState(
    todosLosCampos.filter(c => columnasIniciales.includes(c.clave))
  );
  const [modalColumnasOpen, setModalColumnasOpen] = useState(false);
  const [seleccionTemporal, setSeleccionTemporal] = useState(camposVisibles.map(c => c.clave));

  const abrirPersonalizarColumnas = () => {
    setSeleccionTemporal(camposVisibles.map(c => c.clave));
    setModalColumnasOpen(true);
  };
  const guardarColumnasPersonalizadas = () => {
    const nuevasColumnas = todosLosCampos.filter(c => seleccionTemporal.includes(c.clave));
    setCamposVisibles(nuevasColumnas);
    setModalColumnasOpen(false);
  };

  const [siniestros, setSiniestros] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState('nmroSinstro');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  // Estados de filtros avanzados
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [responsableFiltro, setResponsableFiltro] = useState('');
  const [aseguradoraFiltro, setAseguradoraFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [editSiniestro, setEditSiniestro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    obtenerSiniestros();
    
    // Cargar estados
    getEstados()
      .then(data => {
        console.log('Estados cargados:', data);
        setEstados(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error cargando estados:', error);
        setEstados([]);
      });
    
    // Cargar aseguradoras
    obtenerAseguradoras()
      .then(data => {
        console.log('Aseguradoras cargadas:', data);
        setAseguradoras(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error cargando aseguradoras:', error);
        setAseguradoras([]);
      });
    
    // Cargar responsables
    obtenerResponsables()
      .then(data => {
        console.log('Responsables cargados:', data);
        setResponsables(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error cargando responsables:', error);
        setResponsables([]);
      });
    
    // eslint-disable-next-line
  }, []);

  // Logs de depuración para ver los datos reales
  useEffect(() => {
    if (siniestros.length > 0) {
      console.log('Ejemplo de siniestro:', siniestros[0]);
      console.log('Campo intermediario:', siniestros[0].intermediario);
      console.log('Propiedades que contienen "inter":', 
        Object.keys(siniestros[0]).filter(key => key.toLowerCase().includes('inter'))
      );
    }
  }, [siniestros]);
  useEffect(() => {
    if (estados.length > 0) {
      console.log('Estados:', estados);
      console.log('Primer estado:', estados[0]);
    }
  }, [estados]);

  const obtenerSiniestros = async () => {
    setLoading(true);
    try {
      const data = await getSiniestrosEnriquecidos();
      // Ordenar del más nuevo al más viejo por fecha de asignación
      const siniestrosOrdenados = data.sort((a, b) => {
        const fechaA = new Date(a.fchaAsgncion || a.fecha_asignacion_form || 0);
        const fechaB = new Date(b.fchaAsgncion || b.fecha_asignacion_form || 0);
        return fechaB - fechaA; // Orden descendente (más nuevo primero)
      });
      setSiniestros(siniestrosOrdenados);
    } catch (error) {
      console.error('Error al cargar siniestros:', error);
      setSiniestros([]);
    }
    setLoading(false);
  };

  const handleEdit = (siniestro) => {
    setEditSiniestro(mapSiniestroToForm(siniestro));
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este siniestro?')) {
      try {
        await deleteSiniestro(id);
        alert('Siniestro eliminado correctamente');
        obtenerSiniestros();
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
      obtenerSiniestros();
    } catch (error) {
      alert('Error al guardar los cambios');
    }
    setLoading(false);
  };

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
    const valor = siniestro.nombreResponsable;
    if (!valor) return '';
    const responsable = responsables.find(r => 
      r.nmbrRespnsble === valor ||
      String(r.codiRespnsble) === String(valor)
    );
    return responsable ? responsable.nmbrRespnsble : valor;
  };

  const getNombreIntermediario = (siniestro) => {
    // El campo llega como nombIntermediario, no como intermediario
    const valor = siniestro.nombIntermediario || siniestro.intermediario;
    if (!valor) {
      console.log('⚠️ Intermediario vacío para siniestro:', siniestro._id);
      return 'Sin intermediario';
    }
    console.log('✅ Intermediario encontrado:', valor);
    return String(valor);
  };

  // Función para verificar si el usuario puede editar el caso
  const puedeEditarCaso = (siniestro) => {
    // Si es admin, puede editar todos los casos
    if (esAdmin) return true;
    
    // Si no es admin, solo puede editar casos donde es el responsable
    const responsableCaso = getNombreResponsable(siniestro);
    const usuarioActual = localStorage.getItem('nombre') || localStorage.getItem('login');
    
    return responsableCaso === usuarioActual;
  };

  // Debug: verificar qué propiedades tienen los siniestros
  useEffect(() => {
    if (siniestros.length > 0) {
      console.log('Total siniestros:', siniestros.length);
      console.log('Primer siniestro completo:', siniestros[0]);
      console.log('Propiedades del siniestro:', Object.keys(siniestros[0]));
      console.log('¿Tiene origen?:', 'origen' in siniestros[0], siniestros[0].origen);
    }
  }, [siniestros]);

  // Filtrado avanzado mejorado
  const siniestrosFiltrados = siniestros.filter(siniestro => {
    let ok = true;
    
    // Filtro por búsqueda de texto
    if (terminoBusqueda) {
      const valor = siniestro[campoBusqueda]?.toString().toLowerCase() || '';
      ok = ok && valor.includes(terminoBusqueda.toLowerCase());
    }
    
    // Filtro por fechas (usando fchaAsgncion)
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
    
    // Filtro por responsable
    if (responsableFiltro) {
      ok = ok && String(siniestro.nombreResponsable) === String(responsableFiltro);
    }
    
    // Filtro por aseguradora
    if (aseguradoraFiltro) {
      ok = ok && String(siniestro.codiAsgrdra) === String(aseguradoraFiltro);
    }
    
    return ok;
  });
  console.log('siniestrosFiltrados:', siniestrosFiltrados.length, 'de', siniestros.length);
  const siniestrosOrdenados = [...siniestrosFiltrados].sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;
    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';
    return orden.asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
  });
  // Si hay un filtro de responsable activo, mostrar todos los casos sin paginación
  const hayFiltroResponsable = responsableFiltro !== '';
  const totalPaginas = hayFiltroResponsable ? 1 : Math.ceil(siniestrosOrdenados.length / elementosPorPagina);
  const siniestrosPaginados = hayFiltroResponsable 
    ? siniestrosOrdenados // Mostrar todos los casos cuando hay filtro de responsable
    : siniestrosOrdenados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      );

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

  // Exportar registros filtrados
  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(siniestrosOrdenados.map(s => {
      const fila = {};
      camposVisibles.forEach(({ clave, label }) => {
        fila[label] = s[clave] || '';
      });
      return fila;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Siniestros');
    XLSX.writeFile(workbook, 'reporte_siniestros.xlsx');
  };



  // Mostrar mensaje de carga solo si tanto siniestros como estados están cargando
  if (loading) {
    return <div className="p-4 text-center text-gray-500">Cargando datos...</div>;
  }



  return (
    <div className="p-2 sm:p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-blue-800">📊 Reporte Completo de Siniestros</h2>
        <p className="text-blue-600">
          👁️ <strong>Vista General</strong> - Acceso a todos los casos del sistema
        </p>
        <p className="text-sm text-blue-500 mt-1">
          👤 Usuario: <strong>{usuarioActual.nombre || usuarioActual.login}</strong> | 
          🏷️ Rol: <strong>{usuarioActual.rol}</strong>
        </p>
        {!esAdmin && (
          <p className="text-sm text-orange-600 mt-1">
            ⚠️ Solo puedes editar los casos donde eres el responsable
          </p>
        )}
      </div>

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
              {estadoFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Estado: {getNombreEstado(estadoFiltro)}</span>}
              {aseguradoraFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Aseguradora: {getNombreAseguradora(aseguradoraFiltro)}</span>}
              {responsableFiltro && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Responsable: {responsableFiltro}</span>}
            </div>
            <p className="text-xs text-blue-600 mt-1">Mostrando {siniestrosFiltrados.length} de {siniestros.length} siniestros</p>
            {hayFiltroResponsable && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✅ Mostrando todos los casos del responsable seleccionado (sin paginación)
              </p>
            )}
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
          onClick={obtenerSiniestros}
        >
          🔍 Buscar
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={exportarExcel}
        >
          ⬇ Exportar Excel
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={abrirPersonalizarColumnas}
        >
          Personalizar columnas
        </button>
      </div>

      {modalColumnasOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">Personalizar columnas</h2>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4">
              {todosLosCampos.map(campo => (
                <label key={campo.clave} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={seleccionTemporal.includes(campo.clave)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSeleccionTemporal([...seleccionTemporal, campo.clave]);
                      } else {
                        setSeleccionTemporal(seleccionTemporal.filter(cl => cl !== campo.clave));
                      }
                    }}
                  />
                  {campo.label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModalColumnasOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={guardarColumnasPersonalizadas}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

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
            {loading ? (
              <tr><td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">Cargando...</td></tr>
            ) : siniestrosPaginados.length === 0 ? (
              <tr>
                <td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
              ) : 
              siniestrosPaginados.map((siniestro, index) => (
                <tr key={siniestro._id || index} className="border-b hover:bg-gray-50">
                  {camposVisibles.map(({ clave }) => (
                    <td key={clave} className="p-2 whitespace-nowrap">
                      {(() => {
                        if (clave === 'codiAsgrdra') {
                          return getNombreAseguradora(siniestro);
                        }
                        if (clave === 'codi_estdo' || clave.toLowerCase().includes('estado')) {
                          return getNombreEstado(siniestro);
                        }
                        if (clave === 'nombreResponsable') {
                          return getNombreResponsable(siniestro);
                        }
                        if (clave === 'nombIntermediario') {
                          return getNombreIntermediario(siniestro);
                        }
                        return siniestro[clave] || '';
                      })()}
                    </td>
                  ))}
                  <td className="p-2 whitespace-nowrap space-x-2">
                    {puedeEditarCaso(siniestro) ? (
                      <>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                          onClick={() => handleEdit(siniestro)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                          onClick={() => handleDelete(siniestro._id)}
                        >
                          🗑️ Borrar
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">Solo lectura</span>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Sección de Historial de Documentos */}
      <div className="mt-8 bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">📁 Historial de Documentos</h3>
        {siniestrosPaginados.length > 0 ? (
          siniestrosPaginados.map((siniestro, index) => {
            console.log('📋 Procesando siniestro:', siniestro._id);
            console.log('📁 HistorialDocs del siniestro:', siniestro.historialDocs);
            
            return (
              <div key={siniestro._id || index} className="mb-6 border-b pb-4">
                <h4 className="font-medium text-blue-600 mb-2">
                  📋 Caso: {siniestro.nmroSinstro || siniestro.numero_siniestro || 'Sin número'}
                </h4>
                {siniestro.historialDocs && siniestro.historialDocs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border text-left">Tipo</th>
                        <th className="p-2 border text-left">Nombre</th>
                        <th className="p-2 border text-left">Fecha</th>
                        <th className="p-2 border text-left">Comentarios</th>
                        <th className="p-2 border text-left">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siniestro.historialDocs.map((doc, docIndex) => (
                        <tr key={docIndex} className="hover:bg-gray-50">
                          <td className="p-2 border">{doc.tipo}</td>
                          <td className="p-2 border">{doc.nombre}</td>
                          <td className="p-2 border">{doc.fecha}</td>
                          <td className="p-2 border">{doc.comentario}</td>
                          <td className="p-2 border text-center">
                            {doc.url ? (
                              <a 
                                href={`${config.API_BASE_URL}${doc.url}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                download={doc.nombre}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                📥 Descargar
                              </a>
                            ) : (
                              <span className="text-gray-400">No disponible</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay documentos subidos para este caso.</p>
              )}
            </div>
          );
        })
        ) : (
          <p className="text-gray-500 text-center">No hay casos para mostrar documentos.</p>
        )}
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
};

export default ReporteComplex;
