// src/services/estadosService.js
import { BASE_URL } from '../config/apiConfig.js';

export async function getEstados() {
  const res = await fetch(`${BASE_URL}/api/estados`);
  if (!res.ok) throw new Error('Error al obtener estados');
  return res.json();
} 