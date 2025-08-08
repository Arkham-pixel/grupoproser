// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import config from './config.js'

import Login from './components/login'
import Register from './components/Register'
import ResetPassword from './components/ResetPassword'
import Layout from './components/Layout'
import Inicio from './components/Inicio'
import FormularioInspeccion from './components/FormularioInspeccion'
import ReporteComplex from './components/ReporteComplex'
import ReporteResponsables from './components/ReporteResponsables'
import DashboardComplex from './components/DashboardComplex'
import AgregarCasoRiesgo from './components/SubcomponentesRiesgo/AgregarCasoRiesgo'
import Dashboard from './components/SubcomponenteRiesgoDash/Dashboard'
import ReporteRiesgo from './components/SubcompoeneteRiesgoExport/ReporteRiesgo'
import Cuenta from './components/SubcomponenteCuenta/Cuenta'
import MiCuenta from './components/SubcomponenteCuenta/miCuenta'
import FormularioMaquinaria from './components/SubcomponenteMaquinaria/FormularioMaquinaria'
import FormularioCasoComplex from './components/SubcomponenteCompex/FormularioCasoComplex'
import SiniestrosList from "./components/SiniestrosList";
import ReportePolPadre from './components/ReportePol/ReportePolPadre';
import AdminUsuarios from './components/AdminUsuarios';
import TestEmail from './components/TestEmail';
import EditarPerfilUsuario from './components/EditarPerfilUsuario';

import { CasosRiesgoProvider } from './context/CasosRiesgoContext'
import RequireAuth from './components/RequireAuth'

// Comprueba si tenemos un token en localStorage
const isAuthenticated = () => !!localStorage.getItem('token')

// Para redirigir al dashboard si ya estás logueado
function LoginRedirect() {
  return isAuthenticated()
    ? <Navigate to="/inicio" replace />
    : <Login />
}

// Función para guardar el caso complex
const guardarCasoComplex = async (formData) => {
  try {
    console.log('📝 Enviando datos del caso complex:', formData);
    
    const response = await fetch(`${config.API_BASE_URL}/api/complex`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Caso complex guardado exitosamente:', result);
      
      // Mostrar mensaje más elegante
      const mensaje = `
🎉 ¡Caso Complex Creado Exitosamente!

📋 Número de Ajuste: ${result.complex?.numero_ajuste || 'N/A'}
👤 Intermediario: ${result.complex?.intermediario || 'N/A'}
📅 Fecha de Creación: ${new Date(result.complex?.creado_en).toLocaleString()}

✅ El caso ha sido guardado en la base de datos.
      `;
      
      alert(mensaje);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al guardar caso complex:', errorData);
      alert(`❌ Error al guardar: ${errorData.error || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error('❌ Error de red al guardar caso complex:', error);
    alert('❌ Error de conexión. Verifica que el servidor esté funcionando.');
  }
};

export default function App() {
  return (
    <CasosRiesgoProvider>
      <Routes>
        {/* Ruta raíz: si estás, vas a /inicio, si no, a /login */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/inicio" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas privadas protegidas por RequireAuth */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="inicio" element={<Inicio />} />
          <Route
            path="complex/formulario"
            element={<FormularioCasoComplex onSave={guardarCasoComplex} />}
          />
          <Route path="formularioinspeccion" element={<FormularioInspeccion />} />
          <Route path="complex/agregar" element={<FormularioCasoComplex onSave={guardarCasoComplex} />} />
          <Route path="complex/excel" element={<ReporteComplex />} />
          <Route path="complex/mis-casos" element={<ReporteResponsables />} />
          <Route path="complex/dashboard" element={<DashboardComplex />} />
          <Route path="editar-caso/:id" element={<FormularioCasoComplex onSave={guardarCasoComplex} modoEdicion={true} />} />
          <Route path="riesgos/agregar" element={<AgregarCasoRiesgo />} />
          <Route path="riesgos/dashboard" element={<Dashboard />} />
          <Route path="riesgos/exportar" element={<ReporteRiesgo />} />
          <Route path="riesgos/editar/:id" element={<AgregarCasoRiesgo />} />
          <Route path="cuenta" element={<Cuenta />} />
          <Route path="micuenta" element={<MiCuenta />} />
          <Route path="formulario-maquinaria" element={<FormularioMaquinaria />} />
          <Route path="reporte-pol" element={<ReportePolPadre />} />
                            <Route path="siniestros" element={<SiniestrosList />} />
                                          <Route path="admin/usuarios" element={<AdminUsuarios />} />
                        <Route path="test-email" element={<TestEmail />} />
                        <Route path="editar-perfil-usuario" element={<EditarPerfilUsuario />} />
        </Route>

        {/* Cualquier otra ruta redirige a la raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CasosRiesgoProvider>
  )
}
