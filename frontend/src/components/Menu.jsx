import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  // Cierra el menú si haces clic fuera del área del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(prev => (prev === menuName ? null : menuName));
  };

  return (
    <nav className="bg-gray-800 text-white p-4" ref={menuRef}>
      <ul className="flex space-x-6 items-center">
        <li><Link to="/inicio" className="hover:underline">Inicio</Link></li>

        <li className="relative">
          <button onClick={() => toggleMenu('complex')} className="cursor-pointer">
            Complex ▾
          </button>
          {openMenu === 'complex' && (
            <ul className="absolute z-10 bg-gray-700 mt-2 rounded shadow text-sm w-40">
              <li><Link to="/complex/agregar" className="block px-4 py-2 hover:bg-gray-600">Agregar Casos</Link></li>
              <li><Link to="/complex/dashboard" className="block px-4 py-2 hover:bg-gray-600">Dashboard</Link></li>
              <li><Link to="/complex/excel" className="block px-4 py-2 hover:bg-gray-600">Reporte Excel</Link></li>
            </ul>
          )}
        </li>

        <li className="relative">
          <button onClick={() => toggleMenu('riesgos')} className="cursor-pointer">
            Riesgos ▾
          </button>
          {openMenu === 'riesgos' && (
            <ul className="absolute z-10 bg-gray-700 mt-2 rounded shadow text-sm w-40">
              <li><Link to="/riesgos/agregar" className="block px-4 py-2 hover:bg-gray-100">Agregar Casos</Link></li>
              <li><Link to="/riesgos/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link></li>
              <li><Link to="/riesgos/exportar" className="block px-4 py-2 hover:bg-gray-100">Exportar Excel</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/formularioinspeccion" className="hover:underline">Formulario</Link></li>
        <li><Link to="/cuenta" className="hover:underline">Cuenta</Link></li>
        <li><Link to="/logout" className="hover:underline">Cerrar sesión</Link></li>
      </ul>
    </nav>
  );
}
