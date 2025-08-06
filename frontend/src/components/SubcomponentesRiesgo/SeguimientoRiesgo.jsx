import React, { useRef } from "react";
import Select from "react-select";

function DropZone({ onFile, label, existingFile }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed rounded px-4 py-8 text-center cursor-pointer text-gray-500 hover:border-blue-400 transition"
      style={{ minHeight: 80 }}
    >
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])}
      />
      <div>
        <span role="img" aria-label="upload">
          📁
        </span>
        <div>{label}</div>
        <div className="text-xs text-gray-400">
          Arrastra un archivo o haz clic aquí
        </div>
        {existingFile && (
          <div className="text-xs mt-1 text-green-700 font-semibold">{typeof existingFile === 'string' ? existingFile : existingFile.name}</div>
        )}
      </div>
    </div>
  );
}

export default function SeguimientoRiesgo({ formData, setFormData, ciudades = [] }) {
  // Buscar la ciudad seleccionada por código
  const ciudadSeleccionada = ciudades.find(c => c.value === (formData.ciudadSucursal || formData.ciudad || (formData.ciudad && formData.ciudad.value)));

  return (
    <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-blue-800">
        Seguimiento de Riesgo
      </h2>

      {/* Select ciudad y consecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-semibold block mb-1">
            Ciudad Sucursal Aseguradora
          </label>
          <Select
            options={ciudades}
            value={ciudadSeleccionada || null}
            onChange={selected => setFormData(prev => ({ ...prev, ciudadSucursal: selected ? selected.value : '' }))}
            placeholder="Seleccione..."
            isClearable
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">
            Consecutivo Aseguradora
          </label>
          <input
            type="text"
            value={formData.nmroConsecutivo || ''}
            onChange={e => setFormData(prev => ({ ...prev, nmroConsecutivo: e.target.value }))}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Adjuntos y observaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-semibold block mb-1">Adjunto Inspección</label>
          <DropZone onFile={file => setFormData(prev => ({ ...prev, adjuntoInspeccion: file }))} label="Adjunta inspección" existingFile={formData.adjuntoInspeccion} />
        </div>
        <div>
          <label className="font-semibold block mb-1">
            Observaciones Asignación
          </label>
          <textarea
            value={formData.observAsignacion || ''}
            onChange={e => setFormData(prev => ({ ...prev, observAsignacion: e.target.value }))}
            className="w-full border rounded px-2 py-1 min-h-[80px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-semibold block mb-1">Adjunto Asignación</label>
          <DropZone onFile={file => setFormData(prev => ({ ...prev, adjuntoAsignacion: file }))} label="Adjunta asignación" existingFile={formData.adjuntoAsignacion} />
        </div>
        <div>
          <label className="font-semibold block mb-1">Fecha de Informe</label>
          <input
            type="date"
            value={formData.fchaInforme ? String(formData.fchaInforme).slice(0,10) : ''}
            onChange={e => setFormData(prev => ({ ...prev, fchaInforme: e.target.value }))}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold block mb-1">Adjunto Informe Final</label>
          <DropZone onFile={file => setFormData(prev => ({ ...prev, anxoInfoFnal: file }))} label="Adjunta informe final" existingFile={formData.anxoInfoFnal} />
        </div>
        <div>
          <label className="font-semibold block mb-1">
            Observaciones Informe Final
          </label>
          <textarea
            value={formData.observInforme || ''}
            onChange={e => setFormData(prev => ({ ...prev, observInforme: e.target.value }))}
            className="w-full border rounded px-2 py-1 min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}