import React, { useState, useRef, useEffect } from "react";

function RegistroFotografico({ onChange }) {
  const [fotos, setFotos] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleFotoChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (!isMounted.current) return;
        const nuevasFotos = [...fotos];
        nuevasFotos[index] = {
          ...nuevasFotos[index],
          src: ev.target.result,
          file: file, // 👈 GUARDAR EL FILE REAL AQUÍ
        };
        setFotos(nuevasFotos);
        onChange(nuevasFotos); // Notificar el cambio
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescripcionChange = (index, value) => {
    if (!isMounted.current) return;
    const nuevasFotos = [...fotos];
    nuevasFotos[index] = { ...nuevasFotos[index], descripcion: value };
    setFotos(nuevasFotos);
    onChange(nuevasFotos);
  };

  const handleAddFoto = () => {
    if (!isMounted.current) return;
    setFotos([...fotos, { src: "", descripcion: "" }]);
  };

  const handleRemoveFoto = (index) => {
    if (!isMounted.current) return;
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    setFotos(nuevasFotos);
    onChange(nuevasFotos);
  };

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-4 text-base text-center">REGISTRO FOTOGRÁFICO</h2>
      <div className="grid grid-cols-2 gap-6 justify-items-center">
        {fotos.map((foto, i) => (
          <div key={i} className="flex flex-col items-center border border-gray-700 p-3 rounded">
            {foto.src && (
              <img
                src={foto.src}
                alt={`Foto ${i + 1}`}
                className="w-72 h-56 object-cover border border-gray-400 mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFotoChange(i, e.target.files[0])}
              className="mb-2 text-xs"
            />
            <input
              type="text"
              value={foto.descripcion}
              onChange={(e) => handleDescripcionChange(i, e.target.value)}
              className="w-72 bg-gray-800 border-b border-gray-600 px-2 py-1 text-xs text-white mb-1 text-center"
              placeholder={`Descripción foto ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveFoto(i)}
              className="text-xs text-red-400 hover:text-red-600 mt-1"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={handleAddFoto}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Añadir Foto
        </button>
      </div>
    </div>
  );
}

export default function RegistroFotograficoMaquinaria({ onChange }) {
  return <RegistroFotografico onChange={onChange} />;
}
