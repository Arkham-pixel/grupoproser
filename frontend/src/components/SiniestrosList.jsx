import React, { useState } from "react";
import { useSiniestros } from "../hooks/useSiniestros";
import { deleteSiniestro } from "../services/siniestrosApi";
import SiniestroForm from "./SiniestroForm";

export default function SiniestrosList() {
  const [params, setParams] = useState({ page: 1, limit: 5 });
  const { siniestros, total, page, limit, loading, error, refetch } = useSiniestros(params);
  const [editSiniestro, setEditSiniestro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar siniestro?")) {
      await deleteSiniestro(id);
      refetch(params);
    }
  };

  const handleEdit = (siniestro) => {
    setEditSiniestro(siniestro);
    setModalOpen(true);
  };

  const handleSave = () => {
    refetch(params);
  };

  return (
    <div>
      <h2>Listado de Siniestros</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número Siniestro</th>
            <th>Responsable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {siniestros.map((s) => (
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.nmro_siniestro || s.nmro_sinstro}</td>
              <td>{s.codi_respnble || s.codi_respnsble}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        Página {page} de {Math.ceil(total / limit)}
        <button disabled={page <= 1} onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}>Anterior</button>
        <button disabled={page * limit >= total} onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}>Siguiente</button>
      </div>
      <SiniestroForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        siniestro={editSiniestro}
        onSave={handleSave}
      />
    </div>
  );
} 