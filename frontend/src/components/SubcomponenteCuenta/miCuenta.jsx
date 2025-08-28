// src/components/SubcomponenteCuenta/miCuenta.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil, actualizarFoto } from "../../services/userService";
import axios from "axios";
import { BASE_URL, isDevelopmentEnv } from '../../config/apiConfig';

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
  const [fotoError, setFotoError] = useState(false);
  const [fotoLoaded, setFotoLoaded] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Función para obtener la URL de la foto
  const obtenerUrlFoto = (fotoUrlRelativa) => {
    console.log('🔍 Construyendo URL de foto:', {
      fotoUrlRelativa,
      BASE_URL,
      isDevelopmentEnv,
      tipo: typeof fotoUrlRelativa
    });
    
    if (!fotoUrlRelativa) {
      console.log('❌ No hay URL de foto, usando placeholder');
      return "/img/placeholder.png";
    }
    
    // Si es una URL completa, usarla tal como está
    if (fotoUrlRelativa.startsWith('http://') || fotoUrlRelativa.startsWith('https://')) {
      console.log('✅ Es una URL completa:', fotoUrlRelativa);
      return fotoUrlRelativa;
    }
    
    // Para URLs relativas, usar la URL base del archivo de configuración
    if (fotoUrlRelativa.startsWith('/uploads/')) {
      // En desarrollo: http://localhost:3000
      // En producción: https://aplicacion.grupoproser.com.co
      const urlCompleta = `${BASE_URL}${fotoUrlRelativa}`;
      console.log('🔗 URL construida usando config:', urlCompleta);
      return urlCompleta;
    }
    
    // Fallback: usar BASE_URL
    const urlCompleta = `${BASE_URL}${fotoUrlRelativa.startsWith('/') ? '' : '/'}${fotoUrlRelativa}`;
    console.log('🔗 URL construida (fallback):', urlCompleta);
    return urlCompleta;
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    console.log('❌ Error cargando imagen de perfil, usando placeholder');
    setFotoError(true);
    setFotoLoaded(false);
  };

  // Función para manejar carga exitosa de imagen
  const handleImageLoad = () => {
    console.log('✅ Imagen de perfil cargada exitosamente');
    setFotoError(false);
    setFotoLoaded(true);
  };

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
        
        // Log específico para la foto
        console.log('📸 Información de la foto:', {
          foto: data.foto,
          tipoFoto: typeof data.foto,
          fotoExiste: !!data.foto,
          fotoLength: data.foto ? data.foto.length : 0
        });
        
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
      console.log('✅ Foto actualizada exitosamente:', data);
      
      // data.fotoPerfil es la URL relativa guardada en Mongo
      setUsuario(u => ({ ...u, foto: data.fotoPerfil }));
      setFotoPreview("");
      setFotoError(false); // Resetear error de foto
      setFotoLoaded(true); // Marcar que la foto se cargó correctamente
    } catch (err) {
      console.error("❌ Error subiendo foto:", err);
      setFotoError(true); // Marcar que hubo un error al subir la foto
      setFotoLoaded(false); // No marcar como cargada si hubo error
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
          {/* Mostrar foto de perfil o placeholder */}
          {fotoPreview ? (
            // Preview de la foto que se está subiendo
            <img
              src={fotoPreview}
              alt="Vista previa de foto"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
            />
          ) : usuario.foto && !fotoError ? (
            // Foto del usuario desde la base de datos
            <img
              src={obtenerUrlFoto(usuario.foto)}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            // Placeholder cuando no hay foto o hay error
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-blue-600 mb-1">👤</div>
                <div className="text-xs text-blue-700 font-medium">Foto de perfil</div>
              </div>
            </div>
          )}
          
          {/* Indicador de estado de conexión */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          {/* Botón para cambiar foto */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors shadow-lg"
            title="Cambiar foto"
          >
            📷
          </button>
          
          {/* Input de archivo oculto */}
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
