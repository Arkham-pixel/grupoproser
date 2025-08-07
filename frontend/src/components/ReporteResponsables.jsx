import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import { getEstados } from '../services/estadosService';
import { obtenerAseguradoras, obtenerResponsables } from '../services/riesgoService';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import axios from 'axios';
import config from '../config.js';
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

  // Estados para administración de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    adminLogin: '',
    adminPassword: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('casos'); // 'casos' o 'usuarios'

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

  // Verificar si el usuario tiene permisos de administración
  const esAdminOSoporte = usuarioActual.rol === 'admin' || usuarioActual.rol === 'soporte';

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

  // Cargar usuarios cuando se cambie a la pestaña de usuarios
  useEffect(() => {
    if (activeTab === 'usuarios' && esAdminOSoporte) {
      cargarUsuarios();
    }
  }, [activeTab, esAdminOSoporte]);

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

  // Funciones para administración de usuarios
  const cargarUsuarios = async () => {
    if (!esAdminOSoporte) return;
    
    try {
      setLoadingUsuarios(true);
      const response = await axios.get(`${config.API_BASE_URL}/api/secur-auth/usuarios`);
      setUsuarios(response.data.usuarios);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setMessage('Error al cargar usuarios');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !newPassword || !adminCredentials.adminLogin || !adminCredentials.adminPassword) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/secur-auth/cambiar-password`, {
        login: selectedUser.login,
        nuevaPassword: newPassword,
        adminLogin: adminCredentials.adminLogin,
        adminPassword: adminCredentials.adminPassword
      });

      if (response.data.success) {
        setMessage(`✅ ${response.data.message}`);
        setShowChangePassword(false);
        setSelectedUser(null);
        setNewPassword('');
        setAdminCredentials({ adminLogin: '', adminPassword: '' });
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Error al cambiar contraseña'}`);
    }
  };

  const openChangePasswordModal = (usuario) => {
    setSelectedUser(usuario);
    setShowChangePassword(true);
    setMessage('');
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

      {/* Mensaje de estado */}
      {message && (
        <div className={`mb-4 p-4 rounded ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Pestañas */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('casos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'casos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Mis Casos
            </button>
            {esAdminOSoporte && (
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'usuarios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Administración de Usuarios
              </button>
            )}
          </nav>
        </div>
      </div>

             {/* Contenido condicional según la pestaña activa */}
       {activeTab === 'casos' ? (
         <>
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
                   <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                     <button
                       onClick={() => {
                         setSiniestroEditar(siniestro);
                         setMostrarFormulario(true);
                       }}
                       className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                     >
                       ✏️ Editar
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
         </>
       ) : activeTab === 'usuarios' && esAdminOSoporte ? (
         <>
           {/* Tabla de usuarios */}
           <div className="bg-white shadow-md rounded-lg overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200">
               <h2 className="text-xl font-semibold text-gray-800">👥 Administración de Usuarios</h2>
               <p className="text-sm text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
             </div>
             
             {loadingUsuarios ? (
               <div className="flex justify-center items-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               </div>
             ) : (
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Usuario
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Email
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Rol
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Estado
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Acciones
                     </th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {usuarios.map((usuario) => (
                     <tr key={usuario._id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-gray-900">{usuario.name}</div>
                         <div className="text-sm text-gray-500">Login: {usuario.login}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         {usuario.email}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                           usuario.role === 'admin' ? 'bg-red-100 text-red-800' :
                           usuario.role === 'soporte' ? 'bg-yellow-100 text-yellow-800' :
                           'bg-green-100 text-green-800'
                         }`}>
                           {usuario.role}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                           usuario.active === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                         }`}>
                           {usuario.active === 'Y' ? 'Activo' : 'Inactivo'}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         <button
                           onClick={() => openChangePasswordModal(usuario)}
                           className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                         >
                           Cambiar Contraseña
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>

           {/* Modal para cambiar contraseña */}
           {showChangePassword && selectedUser && (
             <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
               <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                 <div className="mt-3">
                   <h3 className="text-lg font-medium text-gray-900 mb-4">
                     Cambiar Contraseña - {selectedUser.name}
                   </h3>
                   
                   <form onSubmit={handleChangePassword} className="space-y-4">
                     {/* Credenciales del administrador */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Tu Login (Administrador)
                       </label>
                       <input
                         type="text"
                         value={adminCredentials.adminLogin}
                         onChange={(e) => setAdminCredentials({...adminCredentials, adminLogin: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Tu login de administrador"
                         required
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Tu Contraseña (Administrador)
                       </label>
                       <input
                         type="password"
                         value={adminCredentials.adminPassword}
                         onChange={(e) => setAdminCredentials({...adminCredentials, adminPassword: e.target.value})}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Tu contraseña de administrador"
                         required
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Nueva Contraseña para {selectedUser.name}
                       </label>
                       <input
                         type="password"
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Nueva contraseña"
                         required
                       />
                     </div>

                     <div className="flex justify-end space-x-3 pt-4">
                       <button
                         type="button"
                         onClick={() => {
                           setShowChangePassword(false);
                           setSelectedUser(null);
                           setNewPassword('');
                           setAdminCredentials({ adminLogin: '', adminPassword: '' });
                           setMessage('');
                         }}
                         className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                       >
                         Cancelar
                       </button>
                       <button
                         type="submit"
                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                       >
                         Cambiar Contraseña
                       </button>
                     </div>
                   </form>
                 </div>
               </div>
             </div>
           )}
         </>
       ) : null}
     </div>
   );
 }