import config from "../config.js";

const API_URL = `${config.API_BASE_URL}/api/siniestros`;

export const getSiniestros = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}?${query}`);
  if (!res.ok) throw new Error("Error al obtener siniestros");
  return res.json();
};

export const getSiniestrosConResponsables = async (params = {}) => {
  // Agregar timestamp para evitar cache
  const paramsWithTimestamp = { ...params, _t: Date.now() };
  const query = new URLSearchParams(paramsWithTimestamp).toString();
  const res = await fetch(`${API_URL}/con-responsables?${query}`);
  if (!res.ok) throw new Error("Error al obtener siniestros con responsables");
  return res.json();
};

export const getSiniestrosEnriquecidos = async () => {
  const res = await fetch(`${API_URL}/enriquecidos`);
  if (!res.ok) throw new Error("Error al obtener siniestros enriquecidos");
  return res.json();
};

export const getSiniestrosBasicos = async (params = {}) => {
  // Agregar timestamp para evitar cache
  const paramsWithTimestamp = { ...params, _t: Date.now() };
  const query = new URLSearchParams(paramsWithTimestamp).toString();
  const res = await fetch(`${API_URL}/basicos?${query}`);
  if (!res.ok) throw new Error("Error al obtener siniestros básicos");
  return res.json();
};

export const getSiniestroById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("No encontrado");
  return res.json();
};

export const createSiniestro = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear siniestro");
  return res.json();
};

export const updateSiniestro = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar siniestro");
  return res.json();
};

export const deleteSiniestro = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar siniestro");
  return res.json();
}; 