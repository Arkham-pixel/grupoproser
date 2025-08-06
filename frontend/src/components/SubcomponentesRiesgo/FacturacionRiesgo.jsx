import React, { useRef, useState } from "react";
import { FaCalculator } from "react-icons/fa";

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
      className="border-2 border-dashed rounded px-4 py-8 text-center cursor-pointer text-gray-500 hover:border-blue-400 transition bg-gray-50"
      style={{ minHeight: 80 }}
    >
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])}
      />
      <div>
        <span role="img" aria-label="upload">📁</span>
        <div>{label}</div>
        <div className="text-xs text-gray-400">Arrastra un archivo y suéltalo aquí</div>
        {existingFile && (
          <div className="text-xs mt-1 text-green-700 font-semibold">{typeof existingFile === 'string' ? existingFile : existingFile.name}</div>
        )}
      </div>
    </div>
  );
}

function moneyInputValue(value) {
  if (!value || value === "$" || value === "$ ") return "$";
  return "$ " + Number(String(value).replace(/\D/g, "")).toLocaleString("es-CO");
}

function Calculadora({ open, onClose, onResult }) {
  const [exp, setExp] = useState("");
  if (!open) return null;
  const handleButton = (val) => setExp(exp + val);
  const handleClear = () => setExp("");
  const handleBack = () => setExp(exp.slice(0, -1));
  const handleEval = () => {
    try {
      // eslint-disable-next-line no-eval
      const res = eval(exp);
      if (!isNaN(res)) {
        onResult(String(Math.round(res)));
        onClose();
      }
    } catch {
      setExp("Error");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-4 w-64">
        <div className="mb-2 flex">
          <input
            className="border rounded px-2 py-1 w-full text-right"
            value={exp}
            readOnly
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {[7,8,9,"/"].map(v => <button key={v} className="border rounded py-1" onClick={()=>handleButton(v)}>{v}</button>)}
          {[4,5,6,"*"].map(v => <button key={v} className="border rounded py-1" onClick={()=>handleButton(v)}>{v}</button>)}
          {[1,2,3,"-"].map(v => <button key={v} className="border rounded py-1" onClick={()=>handleButton(v)}>{v}</button>)}
          {[0,".","C","+"].map(v =>
            v === "C"
              ? <button key={v} className="border rounded py-1" onClick={handleClear}>C</button>
              : <button key={v} className="border rounded py-1" onClick={()=>handleButton(v)}>{v}</button>
          )}
        </div>
        <div className="flex justify-between">
          <button className="border rounded px-2 py-1" onClick={handleBack}>←</button>
          <button className="border rounded px-2 py-1" onClick={handleEval}>=</button>
          <button className="border rounded px-2 py-1" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function FacturacionRiesgo({ formData, setFormData }) {
  // Para mostrar la calculadora
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcTarget, setCalcTarget] = useState(null);

  const handleMoneyChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Abre la calculadora para el campo correspondiente
  const openCalc = (target) => {
    setCalcTarget(target);
    setCalcOpen(true);
  };

  // Cuando la calculadora retorna un resultado
  const handleCalcResult = (result) => {
    if (calcTarget) setFormData(prev => ({ ...prev, [calcTarget]: result }));
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <Calculadora
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        onResult={handleCalcResult}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Valor Tarifa Aseguradora</label>
          <input
            type="text"
            value={moneyInputValue(formData.vlorTarifaAseguradora)}
            onChange={handleMoneyChange('vlorTarifaAseguradora')}
            className="w-full border rounded px-2 py-1 mb-4"
            placeholder="$"
          />
          <label className="block text-sm font-semibold mb-1 flex items-center">
            Gastos
            <button
              type="button"
              className="ml-2 text-blue-600 hover:text-blue-800"
              onClick={() => openCalc("vlorGastos")}
              tabIndex={-1}
              title="Abrir calculadora"
            >
              <FaCalculator />
            </button>
          </label>
          <input
            type="text"
            value={moneyInputValue(formData.vlorGastos)}
            onChange={handleMoneyChange('vlorGastos')}
            className="w-full border rounded px-2 py-1 mb-4"
            placeholder="$"
          />
          <label className="block text-sm font-semibold mb-1">Fecha Factura</label>
          <input
            type="date"
            value={formData.fchaFactra ? String(formData.fchaFactra).slice(0,10) : ''}
            onChange={e => setFormData(prev => ({ ...prev, fchaFactra: e.target.value }))}
            className="w-full border rounded px-2 py-1 mb-4"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 flex items-center">
            Honorarios
            <button
              type="button"
              className="ml-2 text-blue-600 hover:text-blue-800"
              onClick={() => openCalc("vlorHonorarios")}
              tabIndex={-1}
              title="Abrir calculadora"
            >
              <FaCalculator />
            </button>
          </label>
          <input
            type="text"
            value={moneyInputValue(formData.vlorHonorarios)}
            onChange={handleMoneyChange('vlorHonorarios')}
            className="w-full border rounded px-2 py-1 mb-4"
            placeholder="$"
          />
          <label className="block text-sm font-semibold mb-1">Numero Factura</label>
          <input
            type="text"
            value={formData.nmroFactra ? String(formData.nmroFactra).replace(/\D/g, "") : ''}
            onChange={e => setFormData(prev => ({ ...prev, nmroFactra: e.target.value.replace(/\D/g, "") }))}
            className="w-full border rounded px-2 py-1 mb-4"
            placeholder="0"
          />
          <label className="block text-sm font-semibold mb-1">Total Pagado</label>
          <input
            type="text"
            value={moneyInputValue(formData.totalPagado)}
            onChange={handleMoneyChange('totalPagado')}
            className="w-full border rounded px-2 py-1 mb-4"
            placeholder="$"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Adjunto Factura</label>
        <DropZone onFile={file => setFormData(prev => ({ ...prev, anxoFactra: file }))} label="Adjunta la factura" existingFile={formData.anxoFactra} />
      </div>
    </div>
  );
}