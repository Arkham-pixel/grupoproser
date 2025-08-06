// src/services/estadosService.js
import config from '../config.js';

export async function getEstados() {
  const res = await fetch(`${config.API_BASE_URL}/api/estados`);
  if (!res.ok) throw new Error('Error al obtener estados');
  return res.json();
} 