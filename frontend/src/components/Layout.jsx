// src/components/Layout.jsx
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaFileAlt,
  FaChartBar,
  FaHome,
  FaUserShield,
  FaChevronDown
} from 'react-icons/fa';
import proserLogo from '../img/PROSER_FIRMA_BLANCA_V2 (3).gif';
import LogoutButton from './LogoutButton';
import SessionIndicator from './SessionIndicator';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  // Cambiar el título del documento
  document.title = "Grupo Proser Aplicativo";

  // Obtener información del usuario actual
  const usuarioActual = {
    login: localStorage.getItem('login'),
    nombre: localStorage.getItem('nombre'),
    rol: localStorage.getItem('rol'),
    tipoUsuario: localStorage.getItem('tipoUsuario')
  };

  // Verificar si el usuario tiene permisos de administración
                const esAdminOSoporte = usuarioActual.rol === 'admin' || usuarioActual.rol === 'soporte';
              const esSoloSoporte = usuarioActual.rol === 'soporte';

  const handleDropdown = (name) =>
    setDropdown(dropdown === name ? null : name);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md px-2 sm:px-4 py-2 flex items-center justify-between relative z-50">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img
            src={proserLogo}
            alt="Logo PROSER"
            className="h-8 sm:h-10 md:h-12 max-w-[100px] sm:max-w-[120px] md:max-w-[160px] object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-6 items-center">
          <Link
            to="/inicio"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition"
          >
            <FaHome /> Inicio
          </Link>

          {/* Complex Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdown('complex')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition focus:outline-none"
            >
              <FaFileAlt /> Complex
              <FaChevronDown className="ml-1" />
            </button>
            {dropdown === 'complex' && (
              <div
                onMouseLeave={() => setDropdown(null)}
                className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg py-2 animate-fade-in"
              >
                <Link
                  to="/complex/agregar"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Agregar Casos
                </Link>
                <Link
                  to="/complex/dashboard"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/complex/excel"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  📊 Reporte Completo (Admin)
                </Link>
                <Link
                  to="/complex/mis-casos"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  📋 Mis Casos Asignados
                </Link>
              </div>
            )}
          </div>

          {/* Riesgos Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdown('riesgos')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition focus:outline-none"
            >
              <FaChartBar /> Riesgos
              <FaChevronDown className="ml-1" />
            </button>
            {dropdown === 'riesgos' && (
              <div
                onMouseLeave={() => setDropdown(null)}
                className="absolute left-0 mt-2 w-56 bg-white rounded shadow-lg py-2 animate-fade-in"
              >
                <Link
                  to="/riesgos/agregar"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Agregar Casos
                </Link>
                <Link
                  to="/riesgos/dashboard"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/riesgos/exportar"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Exportar Excel
                </Link>
              </div>
            )}
          </div>

          {/* Formularios Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdown('formularios')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition focus:outline-none"
            >
              <FaFileAlt /> Formularios
              <FaChevronDown className="ml-1" />
            </button>
            {dropdown === 'formularios' && (
              <div
                onMouseLeave={() => setDropdown(null)}
                className="absolute left-0 mt-2 w-64 bg-white rounded shadow-lg py-2 animate-fade-in"
              >
                <Link
                  to="/formularioinspeccion"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Formulario de riesgo
                </Link>
                <Link
                  to="/formulario-maquinaria"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Formulario de maquinaria{' '}
                  <span className="text-xs text-gray-400">(Próximamente)</span>
                </Link>
                <Link
                  to="/formulario-inspeccion-general"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Formulario de inspección{' '}
                  <span className="text-xs text-gray-400">(Próximamente)</span>
                </Link>
                <Link
                  to="/reporte-pol"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  Formulario POL
                </Link>
                <Link
                  to="/ajuste"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  📊 Informe Inspección de Siniestro
                </Link>
                <Link
                  to="/historial"
                  className="block px-4 py-2 hover:bg-blue-50"
                >
                  📚 Historial de Formularios
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/cuenta"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition"
          >
            <FaUserShield /> Cuenta
          </Link>

          {/* Enlace de Administración (solo visible para admin/soporte) */}
                            {esAdminOSoporte && (
                    <Link
                      to="/admin/usuarios"
                      className="flex items-center gap-2 text-red-700 hover:text-red-800 font-medium transition"
                    >
                      <FaUserShield /> Administración
                    </Link>
                  )}
                                {esSoloSoporte && (
                <Link
                  to="/test-email"
                  className="flex items-center gap-2 text-orange-700 hover:text-orange-800 font-medium transition"
                >
                  📧 Prueba Email
                </Link>
              )}
              {esAdminOSoporte && (
                <Link
                  to="/editar-perfil-usuario"
                  className="flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition"
                >
                  🔧 Editar Usuarios
                </Link>
              )}
        </div>

        {/* User & Logout */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/micuenta"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition"
          >
            <FaUserCircle /> Mi cuenta
          </Link>
          {/* Aquí reemplazamos el Link por el botón Logout */}
          <LogoutButton />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col space-y-2 z-50 animate-fade-in">
            <Link
              to="/inicio"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>
            {/* Complex */}
            <Link
              to="/complex/agregar"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📄 Agregar Complex
            </Link>
            <Link
              to="/complex/dashboard"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📊 Dashboard Complex
            </Link>
            <Link
              to="/complex/excel"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📊 Reporte Completo (Admin)
            </Link>
            <Link
              to="/complex/mis-casos"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📋 Mis Casos Asignados
            </Link>
            {/* Riesgos */}
            <Link
              to="/riesgos/agregar"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📈 Agregar Riesgos
            </Link>
            <Link
              to="/riesgos/dashboard"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📊 Dashboard Riesgos
            </Link>
            <Link
              to="/riesgos/exportar"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📥 Exportar Riesgos
            </Link>
            
            {/* Historial de Formularios */}
            <Link
              to="/historial"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              📚 Historial de Formularios
            </Link>
            
            <Link
              to="/cuenta"
              className="px-6 py-2 hover:bg-blue-50"
              onClick={() => setMenuOpen(false)}
            >
              Cuenta
            </Link>
            
            {/* Enlace de Administración (solo visible para admin/soporte) */}
                                {esAdminOSoporte && (
                      <Link
                        to="/admin/usuarios"
                        className="px-6 py-2 hover:bg-blue-50 text-red-700"
                        onClick={() => setMenuOpen(false)}
                      >
                        🔐 Administración
                      </Link>
                    )}
                    {esAdminOSoporte && (
                      <Link
                        to="/admin/session-settings"
                        className="px-6 py-2 hover:bg-blue-50 text-blue-700"
                        onClick={() => setMenuOpen(false)}
                      >
                        ⚙️ Configuración de Sesión
                      </Link>
                    )}
                                                {esSoloSoporte && (
              <Link
                to="/test-email"
                className="px-6 py-2 hover:bg-blue-50 text-orange-700"
                onClick={() => setMenuOpen(false)}
              >
                📧 Prueba Email
              </Link>
            )}
            {esSoloSoporte && (
              <Link
                to="/test-email-complex"
                className="px-6 py-2 hover:bg-blue-50 text-orange-700"
                onClick={() => setMenuOpen(false)}
              >
                📧 Prueba Email Complex
              </Link>
            )}
            {esSoloSoporte && (
              <Link
                to="/test-api-riesgos"
                className="px-6 py-2 hover:bg-blue-50 text-green-700"
                onClick={() => setMenuOpen(false)}
              >
                🧪 Prueba API Riesgos
              </Link>
            )}
            {esSoloSoporte && (
              <Link
                to="/test-foto"
                className="px-6 py-2 hover:bg-blue-50 text-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                📸 Prueba Sistema de Fotos
              </Link>
            )}
            {esAdminOSoporte && (
              <Link
                to="/editar-perfil-usuario"
                className="px-6 py-2 hover:bg-blue-50 text-purple-700"
                onClick={() => setMenuOpen(false)}
              >
                🔧 Editar Usuarios
              </Link>
            )}
            <LogoutButton />
          </div>
        )}
      </nav>

      {/* Contenido dinámico */}
      <main className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </main>
      
      {/* Indicador de sesión */}
      <SessionIndicator />
    </div>
  );
}
