import React, { useState } from "react";
import EditarCuentas from "./EditarCuenta";
import AgregarCuenta from "./AgregarCuenta";
import axios from "axios";
import MiCuenta from "./miCuenta";
import CambiarContrasena from "./CambiarContrasena";

// Puedes mover esto a su propio archivo si luego creces
function EliminarCuenta() {
  return <div>Eliminar cuenta aquí</div>;
}
// Eliminar cualquier referencia visual o lógica a activar/desactivar 2FA o "seguridad de la cuenta"

// Simulación de usuario actual (puedes reemplazarlo con props, context o Firebase)
const user = {
  nombre: "Daniel",
  rol: "admin", // Cambia a "admin" o "soporte" para ver las pestañas adicionales
};

export default function Cuenta() {
  const [pestana, setPestana] = useState("editar");
  const rol = localStorage.getItem("rol");
  const esAdminOSoporte = rol === "admin" || rol === "soporte";
  const [usuarioEliminar, setUsuarioEliminar] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    if (!usuarioEliminar.trim()) {
      setMensaje("Debes ingresar el login o email del usuario a eliminar.");
      return;
    }
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;
    setEliminando(true);
    setMensaje("");
    try {
      // Llama al endpoint real de eliminación (ajusta la URL según tu backend)
      await axios.delete(`/api/secur-auth/usuarios?loginOrEmail=${encodeURIComponent(usuarioEliminar.trim())}`);
      setMensaje("Usuario eliminado correctamente.");
      setUsuarioEliminar("");
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || "Error al eliminar el usuario");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Cuenta</h2>

      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${pestana === "editar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setPestana("editar")}
        >
          Editar cuenta
        </button>
        <button
          className={`px-4 py-2 rounded ${pestana === "micuenta" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setPestana("micuenta")}
        >
          Cambiar contraseña
        </button>
        {esAdminOSoporte && (
          <button
            className={`px-4 py-2 rounded ${pestana === "agregar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPestana("agregar")}
          >
            Agregar cuenta
          </button>
        )}
        {esAdminOSoporte && (
          <button
            className={`px-4 py-2 rounded ${pestana === "eliminar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPestana("eliminar")}
          >
            Eliminar cuenta
          </button>
        )}
      </div>

      <div>
        {pestana === "editar" && <EditarCuentas />}
        {pestana === "micuenta" && <CambiarContrasena />}
        {pestana === "agregar" && esAdminOSoporte && <AgregarCuenta />}
        {pestana === "eliminar" && esAdminOSoporte && (
          <div className="mt-6">
            <form onSubmit={handleEliminarCuenta} className="space-y-2">
              <label className="block font-medium">Login o Email del usuario a eliminar</label>
              <input
                type="text"
                value={usuarioEliminar}
                onChange={e => setUsuarioEliminar(e.target.value)}
                className="border px-2 py-2 w-full rounded"
                placeholder="Ingresa login o email"
                disabled={eliminando}
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={eliminando}
              >
                {eliminando ? "Eliminando..." : "Eliminar usuario"}
              </button>
              {mensaje && <p className="mt-2 text-sm text-red-600">{mensaje}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
