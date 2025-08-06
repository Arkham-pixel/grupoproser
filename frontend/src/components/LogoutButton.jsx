// src/components/LogoutButton.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LogoutButton() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('rol');
    localStorage.removeItem('tipoUsuario');
    navigate('/login', { replace: true });
  }

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  )
}
