import React from 'react';
import Select from 'react-select';

export default function DatosGenerales({
  formData,
  handleChange,
  handleAseguradoraChange,
  handleCiudadChange,
  municipios,
  aseguradoraOptions,
  funcionarios,
  responsables,
  hayResponsables,
  intermediarios,
  nuevoIntermediario,
  setNuevoIntermediario,
  agregarIntermediario,
  estados,
  onSave,
  onCancel
}) {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Datos Generales del Caso</h2>
      <form onSubmit={e => { e.preventDefault(); onSave && onSave(formData); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Responsable *</label>
            <select
              name="responsable"
              value={formData.responsable || ""}
              onChange={handleChange}
              className="border px-2 py-2 w-full rounded"
              required
              disabled={!hayResponsables}
            >
              <option value="">Seleccionar...</option>
              {(responsables || []).map((responsable, idx) => (
                <option key={idx} value={responsable}>{responsable}</option>
              ))}
            </select>
            {!hayResponsables && (
              <p className="text-sm text-red-500 mt-1">No hay responsables disponibles.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Aseguradora *</label>
            <select
              name="aseguradora"
              value={formData.aseguradora || ""}
              onChange={handleAseguradoraChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione una aseguradora</option>
              {(aseguradoraOptions || []).map((aseg) => (
                <option key={aseg} value={aseg}>{aseg}</option>
              ))}
            </select>
          </div>

          {formData.aseguradora && funcionarios.length > 0 && (
            <div>
              <label className="block text-sm font-medium">Funcionario Aseguradora</label>
              <select
                name="funcionario_aseguradora"
                value={formData.funcionario_aseguradora || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccione un funcionario</option>
                {funcionarios.map((func, idx) => (
                  <option key={idx} value={func}>{func}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Número de Siniestro *</label>
            <input
              type="text"
              name="numero_siniestro"
              value={formData.numero_siniestro || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Código Workflow</label>
            <input
              type="text"
              name="codigo_workflow"
              value={formData.codigo_workflow || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Intermediario</label>
            <select
              name="nombIntermediario"
              value={formData.nombIntermediario || ""}
              onChange={handleChange}
              className="w-medium border rounded px-2 py-1"
            >
              <option value="">Selecciona un intermediario</option>
              {intermediarios.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="flex mt-2">
              <input
                type="text"
                value={nuevoIntermediario}
                onChange={(e) => setNuevoIntermediario(e.target.value)}
                placeholder="Agregar nuevo intermediario"
                className="border rounded px-2 py-1 mr-2"
              />
              <button
                type="button"
                onClick={agregarIntermediario}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Agregar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Número de Póliza</label>
            <input
              type="text"
              name="numero_poliza"
              value={formData.numero_poliza || ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Asegurado o Beneficiario *</label>
            <input
              type="text"
              name="asegurado"
              value={formData.asegurado || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo de Documento</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="NIT">NIT</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
              <option value="RC">Registro Civil (RC)</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Número de Documento</label>
            <input
              type="text"
              name="numero_documento"
              value={formData.numero_documento || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de Asignación</label>
            <input
              type="date"
              name="fecha_asignacion"
              value={formData.fecha_asignacion || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha del Siniestro</label>
            <input
              type="date"
              name="fecha_siniestro"
              value={formData.fecha_siniestro || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Ciudad del Siniestro</label>
            <Select
              options={municipios}
              value={municipios.find(opt => opt.value === formData.ciudad_siniestro)}
              onChange={handleCiudadChange}
              placeholder="Selecciona una ciudad..."
              isSearchable
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo de Póliza</label>
            <input
              type="text"
              name="tipo_poliza"
              value={formData.tipo_poliza || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Causa del Siniestro</label>
            <input
              type="text"
              name="causa_siniestro"
              value={formData.causa_siniestro || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Estado</label>
            <select
              name="estado"
              value={formData.estado || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecciona un estado</option>
              {(estados || []).filter(e => e.value !== undefined && e.value !== null).map((estado) => (
                <option key={`estado-${estado.value}`} value={estado.value}>{estado.label}</option>
              ))}
            </select>
            {(!estados || estados.length === 0) && (
              <p className="text-sm text-red-500 mt-1">No hay estados disponibles.</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Descripción del Siniestro</label>
            <textarea
              name="descripcion_siniestro"
              value={formData.descripcion_siniestro || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="Describe brevemente el siniestro"
            />
          </div>
        </div>

      </form>
    </div>
  );
}
