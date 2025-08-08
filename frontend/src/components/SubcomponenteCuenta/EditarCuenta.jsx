// src/components/Cuenta/EditarCuentas.jsx
import React, { useState, useEffect } from "react";
import { obtenerPerfil, actualizarPerfil } from "../../services/userService";

export default function EditarCuentas() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    cedula: "",
    celular: "",
    correo: "", // <-- ¡Agregado!
    passwordConfirm: "",
  });
  const [tipoUsuario, setTipoUsuario] = useState("normal");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tipo = localStorage.getItem("tipoUsuario") || "normal";
    setTipoUsuario(tipo);
    obtenerPerfil(token, tipo).then(({ data }) => {
      setForm(f => ({
        ...f,
        // Para usuarios secundarios
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        // Para usuarios normales
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        fechaNacimiento: data.fechaNacimiento || "",
        cedula: data.cedula || "",
        celular: data.celular || "",
      }));
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    const token = localStorage.getItem("token");
    try {
      // Solo envía los campos relevantes según el tipo de usuario
      let dataToSend = {};
      if (tipoUsuario === "secur") {
        dataToSend = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          passwordConfirm: form.passwordConfirm,
        };
      } else {
        dataToSend = {
          nombre: form.nombre,
          apellido: form.apellido,
          fechaNacimiento: form.fechaNacimiento,
          cedula: form.cedula,
          celular: form.celular,
          passwordConfirm: form.passwordConfirm,
        };
      }
      await actualizarPerfil(dataToSend, token, tipoUsuario);
      setMensaje("¡Perfil actualizado!");
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message || "Error al actualizar la cuenta");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Editar Cuenta</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tipoUsuario === "secur" ? (
          <>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full px-4 py-2 rounded border"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo"
              className="w-full px-4 py-2 rounded border"
              required
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Celular"
              className="w-full px-4 py-2 rounded border"
            />
            {/* Campo de rol solo visible para admin/soporte */}
            {(localStorage.getItem('rol') === 'admin' || localStorage.getItem('rol') === 'soporte') && (
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Rol"
                className="w-full px-4 py-2 rounded border"
              />
            )}
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm || ""}
              onChange={handleChange}
              placeholder="Confirma tu contraseña para guardar cambios"
              className="w-full px-4 py-2 rounded border"
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full px-4 py-2 rounded border"
              required
            />
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo"
              className="w-full px-4 py-2 rounded border"
              required
            />
            <input
              type="text"
              name="celular"
              value={form.celular}
              onChange={handleChange}
              placeholder="Celular"
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="text"
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
              placeholder="Cédula"
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              placeholder="Fecha de nacimiento"
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm || ""}
              onChange={handleChange}
              placeholder="Confirma tu contraseña para guardar cambios"
              className="w-full px-4 py-2 rounded border"
              required
            />
          </>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar cambios
        </button>
      </form>
      {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
