import React from "react";

export default function FotosActa({ fotosActa, setFotosActa }) {
  const handleFotoChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const nuevasFotos = [...fotosActa];
        nuevasFotos[index] = {
          ...nuevasFotos[index],
          src: ev.target.result,
          file: file,
        };
        setFotosActa(nuevasFotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescripcionChange = (index, value) => {
    const nuevasFotos = [...fotosActa];
    nuevasFotos[index] = { ...nuevasFotos[index], descripcion: value };
    setFotosActa(nuevasFotos);
  };

  const handleAddFoto = () => {
    setFotosActa([...fotosActa, { src: "", descripcion: "" }]);
  };

  const handleRemoveFoto = (index) => {
    const nuevasFotos = fotosActa.filter((_, i) => i !== index);
    setFotosActa(nuevasFotos);
  };

  return (
    <section className="mb-4 border p-3 rounded">
      <h2 className="font-bold text-lg mb-2">Fotos del Acta</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fotosActa.map((foto, i) => (
          <div key={i} className="flex flex-col items-center border border-gray-300 p-2 rounded">
            <div className="mb-1 font-bold">Foto Nro. {i + 1}</div>
            {foto.src && (
              <img
                src={foto.src}
                alt={`Foto ${i + 1}`}
                className="w-32 h-32 object-cover border border-gray-400 mb-2"
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
              className="w-full bg-gray-100 border-b border-gray-400 px-2 py-1 text-xs mb-1 text-center"
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
    </section>
  );
} 