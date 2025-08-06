import React, { useState, useEffect } from "react";

export default function RegistroFotografico({ onChange }) {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    onChange(imagenes); // Enviar imágenes al padre cuando cambien
  }, [imagenes]);

  const handleAddImagen = () => {
    setImagenes([...imagenes, { file: null, preview: null, descripcion: "" }]);
  };

  const handleImagenChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index].file = file;
    nuevasImagenes[index].preview = URL.createObjectURL(file);
    setImagenes(nuevasImagenes);
  };

  const handleDescripcionChange = (index, value) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index].descripcion = value;
    setImagenes(nuevasImagenes);
  };

  return (
    <div className="mt-8 bg-white p-6 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">12. REGISTRO FOTOGRÁFICO</h2>
        <div className="flex flex-col gap-6">
          {imagenes.map((img, index) => (
            <div key={index} className="border rounded p-2 shadow-sm">
              {img.preview && (
                <img
                  src={img.preview}
                  alt={`foto-${index}`}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImagenChange(index, e)}
                className="mt-2 w-full text-sm"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={img.descripcion}
                onChange={(e) => handleDescripcionChange(index, e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>


      <div className="text-right mt-4">
        <button
          type="button"
          onClick={handleAddImagen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Añadir foto
        </button>
      </div>
    </div>
  );
}
