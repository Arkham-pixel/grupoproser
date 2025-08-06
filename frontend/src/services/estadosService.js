// src/services/estadosService.js
export async function getEstados() {
  const res = await fetch('http://localhost:3000/api/estados');
  if (!res.ok) throw new Error('Error al obtener estados');
  return res.json();
} 