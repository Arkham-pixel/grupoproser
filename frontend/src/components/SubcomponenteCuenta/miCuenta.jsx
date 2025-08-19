// src/components/SubcomponenteCuenta/miCuenta.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil, actualizarFoto } from "../../services/userService";
import axios from "axios";
import { BASE_URL } from "../../config/apiConfig.js";

const estados = {
  Conectado: "bg-green-500 text-white",
  Desconectado: "bg-gray-400 text-white",
  "En reposo": "bg-yellow-400 text-black",
  "No molestar": "bg-red-500 text-white",
};
const opcionesEstado = Object.keys(estados);

export default function MiCuenta() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("Conectado");
  const [fotoPreview, setFotoPreview] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const tipoUsuario = localStorage.getItem("tipoUsuario") || "normal";
    console.log('👤 Mi Cuenta - Datos iniciales:', {
      token: token ? 'SÍ' : 'NO',
      tipoUsuario,
      localStorage: {
        token: localStorage.getItem("token") ? 'SÍ' : 'NO',
        tipoUsuario: localStorage.getItem("tipoUsuario"),
        rol: localStorage.getItem("rol"),
        login: localStorage.getItem("login")
      }
    });
    
    console.log('🔄 Intentando obtener perfil...');
    console.log('📡 URL que se va a usar:', tipoUsuario === "secur" ? "/api/secur-auth/perfil" : "/api/usuarios/perfil");
    
    obtenerPerfil(token, tipoUsuario)
      .then(({ data }) => {
        console.log('✅ Perfil obtenido exitosamente:', data);
        console.log('🎯 Tipo de datos recibidos:', typeof data);
        console.log('📋 Propiedades del objeto:', Object.keys(data));
        setUsuario(data);
      })
      .catch((err) => {
        console.error("❌ Error cargando perfil:", err);
        console.error("❌ Error response:", err.response?.data);
        console.error("❌ Error status:", err.response?.status);
        console.error("❌ Error message:", err.message);
        console.error("❌ Headers enviados:", err.config?.headers);
        console.error("❌ URL llamada:", err.config?.url);
        
        if (err.response?.status === 401) {
          console.log('🔐 Token inválido - limpiando localStorage y redirigiendo');
          localStorage.clear();
          navigate("/login");
        } else {
          // Si hay error, mostrar datos del localStorage como respaldo
          console.log('⚠️ Usando datos del localStorage como respaldo');
          const datosRespaldo = {
            name: localStorage.getItem("nombre"),
            login: localStorage.getItem("login"),
            role: localStorage.getItem("rol"),
            email: localStorage.getItem("login") + "@proserpuertos.com.co", // Asumir dominio corporativo
            active: "Y"
          };
          console.log('📋 Datos de respaldo:', datosRespaldo);
          setUsuario(datosRespaldo);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Muestra preview mientras sube
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Sube la imagen al servidor
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("foto", file);

    try {
      const { data } = await actualizarFoto(formData, token);
      // data.fotoPerfil es la URL relativa guardada en Mongo
      setUsuario(u => ({ ...u, foto: data.fotoPerfil }));
      setFotoPreview("");
    } catch (err) {
      console.error("Error subiendo foto:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-16">
        <p>Cargando perfil…</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={
              fotoPreview
                ? fotoPreview
                : usuario.foto
                ? `${BASE_URL}${usuario.foto}`
                : "/img/placeholder.png"
            }
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
            title="Cambiar foto"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFotoChange}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            {usuario.name || usuario.nombre || 'Usuario'} {usuario.apellido || ''}
          </h2>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold outline-none ${estados[estado]}`}
          >
            {opcionesEstado.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Información Personal</h3>
          
          {usuario.name ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-blue-600">👤 Nombre Completo:</span>
              <span className="text-gray-800">{usuario.name}</span>
            </div>
          ) : null}
          
          {usuario.login ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-blue-600">🆔 ID de Usuario:</span>
              <span className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">{usuario.login}</span>
            </div>
          ) : null}
          
          {usuario.email ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-blue-600">📧 Correo Electrónico:</span>
              <span className="text-gray-800">{usuario.email}</span>
            </div>
          ) : null}
          
          {usuario.phone ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-blue-600">📱 Teléfono:</span>
              <span className="text-gray-800">{usuario.phone}</span>
            </div>
          ) : null}
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">🏢 Información Corporativa</h3>
          
          {usuario.role ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-green-600">👨‍💼 Rol en el Sistema:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {usuario.role.toUpperCase()}
              </span>
            </div>
          ) : null}
          
          {usuario.active !== undefined ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-green-600">✅ Estado de la Cuenta:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                usuario.active === 'Y' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {usuario.active === 'Y' ? '🟢 ACTIVO' : '🔴 INACTIVO'}
              </span>
            </div>
          ) : null}
          
          {usuario.privAdmin ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-green-600">🔐 Privilegios Admin:</span>
              <span className="text-gray-800">{usuario.privAdmin}</span>
            </div>
          ) : null}
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">🕒 Información del Sistema</h3>
          
          {usuario.createdAt ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-purple-600">📅 Cuenta Creada:</span>
              <span className="text-gray-800">
                {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ) : null}
          
          {usuario.updatedAt ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-purple-600">🔄 Última Actualización:</span>
              <span className="text-gray-800">
                {new Date(usuario.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ) : null}
          
          {usuario.pswdLastUpdated ? (
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-purple-600">🔑 Contraseña Actualizada:</span>
              <span className="text-gray-800">
                {new Date(usuario.pswdLastUpdated).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          ) : null}
          
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-purple-600">🆔 ID del Sistema:</span>
            <span className="px-2 py-1 bg-gray-100 rounded font-mono text-xs text-gray-600">
              {usuario.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
