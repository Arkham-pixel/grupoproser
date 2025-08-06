import React from "react";
import Select from "react-select";
// import ciudadesData from "../../data/colombia.json";

const solicitantes = [
  { value: "ADRIANA RAMÍREZ ORTIZ", label: "ADRIANA RAMÍREZ ORTIZ" },
  { value: "ANDERSON VICENTE RAMIREZ", label: "ANDERSON VICENTE RAMIREZ" },
  { value: "ÁNGEL ALBERTO RODRÍGUEZ LOPEZ", label: "ÁNGEL ALBERTO RODRÍGUEZ LOPEZ" },
  { value: "ANGELICA MARIA PEÑA", label: "ANGELICA MARIA PEÑA" },
  { value: "BELLA ENITH BONILLA BONILLA", label: "BELLA ENITH BONILLA BONILLA" },
  { value: "DIEGO ALEJANDRO MOYANO FIOLE", label: "DIEGO ALEJANDRO MOYANO FIOLE" },
  { value: "JOSÉ DANILO OVIEDO DURÁN", label: "JOSÉ DANILO OVIEDO DURÁN" },
  { value: "KARELLY SILVERA", label: "KARELLY SILVERA" },
  { value: "MAURICIO ALEXANDER LASSO BUSTOS", label: "MAURICIO ALEXANDER LASSO BUSTOS" },
  { value: "OSCAR ATARA", label: "OSCAR ATARA" },
  { value: "RAMONA BELKIS HERNANDEZ", label: "RAMONA BELKIS HERNANDEZ" },
  { value: "WILLIAM NUÑEZ", label: "WILLIAM NUÑEZ" },
  { value: "ESMERALDA DEL RIO ROA", label: "ESMERALDA DEL RIO ROA" },
  { value: "GABRIEL ANDRÉS MARTINEZ LESMES", label: "GABRIEL ANDRÉS MARTINEZ LESMES" },
  { value: "HEBERT ANDRÉS BAUTISTA NOVOA", label: "HEBERT ANDRÉS BAUTISTA NOVOA" }
];

// Construir opciones para react-select
// Elimina ciudadesColombia y usa la prop ciudades

const ActivacionRiesgo = ({ formData, setFormData, estados = [], aseguradoras = [], responsables = [], clasificaciones = [], ciudades = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClasificacionChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      clasificacion: selectedOption
    }));
  };

  const handleSolicitaChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      quienSolicita: selectedOption
    }));
  };

  const handleCiudadChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      ciudad: selectedOption
    }));
  };

  
  const selectedResp = responsables.find(r => String(r.codiRespnsble) === String(formData.responsable));

  return (
    <div className="p-8 bg-white rounded shadow max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-700">Iniciar Inspección</h2>
      <form>
        <div className="grid grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <select
                name="aseguradora"
                value={formData.aseguradora || ''}
                onChange={e => setFormData(prev => ({ ...prev, aseguradora: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Selecciona una aseguradora</option>
                {Array.isArray(aseguradoras) && aseguradoras.map((aseg, idx) => (
                  <option key={aseg.codiAsgrdra} value={aseg.codiAsgrdra}>{aseg.rzonSocial}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Clasificación *</label>
              <select
                name="codiClasificacion"
                value={formData.codiClasificacion || ''}
                onChange={e => setFormData(prev => ({ ...prev, codiClasificacion: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Selecciona clasificación</option>
                {Array.isArray(clasificaciones) && clasificaciones
                  .filter(cl => cl.codiIdentificador !== undefined && cl.codiIdentificador !== null)
                  .map((cl) => (
                    <option key={String(cl.codiIdentificador)} value={String(cl.codiIdentificador)}>
                      {cl.rzonDescripcion}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Ciudad de Inspección *</label>
              <Select
                options={ciudades}
                value={formData.ciudad}
                onChange={handleCiudadChange}
                placeholder="Selecciona o busca ciudad y departamento"
                isClearable
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Asegurado *</label>
              <input
                type="text"
                name="asegurado"
                value={formData.asegurado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fecha de Inspección *</label>
              <input
                type="date"
                name="fechaInspeccion"
                value={formData.fechaInspeccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          {/* Columna 2 */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Inspector *</label>
              <select
                name="responsable"
                value={formData.responsable || ''}
                onChange={e => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                className="border px-2 py-2 w-full rounded"
                required
              >
                <option value="">Seleccionar...</option>
                {Array.isArray(responsables) && responsables.map((resp) => (
                  <option key={resp.codiRespnsble} value={resp.codiRespnsble}>{resp.nmbrRespnsble}</option>
                ))}
              </select>
              {/* Si el código no está en la lista, mostrar el nombre en un input de solo lectura */}
              {!selectedResp && formData.responsable && (
                <input
                  type="text"
                  value={formData.responsable}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-2 bg-gray-100 text-red-600"
                  title="Inspector no encontrado en la lista actual"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quien Solicita *</label>
              <Select
                options={solicitantes}
                value={formData.quienSolicita}
                onChange={handleSolicitaChange}
                placeholder="Selecciona o busca quien solicita"
                isClearable
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Dirección de inspección"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fecha de Asignación *</label>
              <input
                type="date"
                name="fechaAsignacion"
                value={formData.fechaAsignacion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Observaciones Inspección</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Observaciones de la inspección"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Estado *</label>
          <select
            name="codiEstdo"
            value={formData.codiEstdo ? String(formData.codiEstdo) : ''}
            onChange={e => setFormData(prev => ({ ...prev, codiEstdo: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Selecciona estado</option>
            {Array.isArray(estados) && estados.map(est => (
              <option key={est.codiEstdo} value={String(est.codiEstdo)}>
                {est.descEstdo}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default ActivacionRiesgo;
