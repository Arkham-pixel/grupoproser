import React, { useState } from 'react';
import axios from 'axios';
import config from '../config.js';

export default function EditarPerfilUsuario() {
  const [userId, setUserId] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    active: 'Y'
  });

  const buscarUsuario = async () => {
    if (!userId.trim()) {
      setError('Por favor ingrese un ID de usuario');
      return;
    }

    setLoading(true);
    setError('');
    setUsuario(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/api/secur-auth/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuario(response.data);
      setForm({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        role: response.data.role || '',
        active: response.data.active || 'Y'
      });
      setMensaje('Usuario encontrado');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al buscar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${config.API_BASE_URL}/api/secur-auth/actualizar-usuario/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('Usuario actualizado exitosamente');
      // Recargar datos del usuario
      buscarUsuario();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Leer datos del usuario desde localStorage (como se guarda en login.tsx)
  const usuarioActual = {
    name: localStorage.getItem('nombre') || '',
    login: localStorage.getItem('login') || '',
    rol: localStorage.getItem('rol') || '',
    email: localStorage.getItem('email') || ''
  };
  
  const esAdminOSoporte = usuarioActual.rol === 'admin' || usuarioActual.rol === 'soporte';

  // Para desarrollo - mostrar información del usuario actual
  console.log('Usuario actual:', usuarioActual);
  console.log('Rol del usuario:', usuarioActual.rol);
  console.log('¿Es admin o soporte?:', esAdminOSoporte);

  if (!esAdminOSoporte) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-lg font-medium text-red-800 mb-2">Acceso Denegado</h2>
          <p className="text-red-700">No tienes permisos para acceder a esta función.</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Información de Debug:</h3>
            <p className="text-sm text-blue-700">Usuario: {usuarioActual.name || 'No disponible'}</p>
            <p className="text-sm text-blue-700">Rol: {usuarioActual.rol || 'No definido'}</p>
            <p className="text-sm text-blue-700">Login: {usuarioActual.login || 'No disponible'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">🔧 Editar Perfil de Usuario</h2>

        {/* Búsqueda por ID */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Buscar Usuario</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ingrese ID del usuario"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={buscarUsuario}
              disabled={loading}
              className={`px-4 py-2 rounded-md font-medium ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Información del usuario encontrado */}
        {usuario && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">✅ Usuario Encontrado</h3>
            <div className="text-sm text-green-700">
              <p><strong>ID:</strong> {usuario._id}</p>
              <p><strong>Login:</strong> {usuario.login}</p>
              <p><strong>Nombre:</strong> {usuario.name}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Rol:</strong> {usuario.role}</p>
              <p><strong>Activo:</strong> {usuario.active === 'Y' ? 'Sí' : 'No'}</p>
            </div>
          </div>
        )}

        {/* Formulario de edición */}
        {usuario && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre:
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono:
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol:
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="usuario">Usuario</option>
                <option value="soporte">Soporte</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado:
              </label>
              <select
                name="active"
                value={form.active}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Y">Activo</option>
                <option value="N">Inactivo</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        )}

        {/* Mensajes */}
        {mensaje && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">{mensaje}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-medium text-blue-800 mb-2">📋 Información</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Solo administradores y soporte pueden editar perfiles de usuarios</p>
            <p>• Busque el usuario por su ID único</p>
            <p>• Puede cambiar nombre, email, teléfono, rol y estado</p>
            <p>• Los cambios se aplican inmediatamente</p>
          </div>
        </div>
      </div>
    </div>
  );
} 