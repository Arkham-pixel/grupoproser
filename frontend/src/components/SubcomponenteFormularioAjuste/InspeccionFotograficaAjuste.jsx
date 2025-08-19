import React, { useState } from 'react';
import { FaCamera, FaUpload, FaTrash, FaEye } from 'react-icons/fa';
import IAInteligente from './IAInteligente';

export default function InspeccionFotograficaAjuste({ formData, onInputChange }) {
  const [imagenes, setImagenes] = useState(formData.imagenesInspeccion || []);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const nuevasImagenes = files.map(file => ({
      id: Date.now() + Math.random(),
      nombre: file.name,
      archivo: file,
      url: URL.createObjectURL(file),
      descripcion: ''
    }));
    
    const todasLasImagenes = [...imagenes, ...nuevasImagenes];
    setImagenes(todasLasImagenes);
    onInputChange('imagenesInspeccion', todasLasImagenes);
  };

  const eliminarImagen = (id) => {
    const imagenesFiltradas = imagenes.filter(img => img.id !== id);
    setImagenes(imagenesFiltradas);
    onInputChange('imagenesInspeccion', imagenesFiltradas);
  };

  const actualizarDescripcion = (id, descripcion) => {
    const imagenesActualizadas = imagenes.map(img => 
      img.id === id ? { ...img, descripcion } : img
    );
    setImagenes(imagenesActualizadas);
    onInputChange('imagenesInspeccion', imagenesActualizadas);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaCamera className="mr-3 text-purple-600" />
          4. INSPECCIÓN (REGISTRO FOTOGRÁFICO INSPECCIÓN)
        </h2>
        <p className="text-gray-600 mt-2">Registro fotográfico de la inspección del siniestro</p>
      </div>

      {/* Campo de texto principal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción de la Inspección
        </label>
        <textarea
          value={formData.descripcionInspeccion || ''}
          onChange={(e) => onInputChange('descripcionInspeccion', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
          placeholder="Escribe la descripción de la inspección aquí. Por ejemplo: 'Se realizo inspeccion visual del area afectada, se tomaron fotos de los daños, se identificaron puntos criticos'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Mínimo recomendado: 60 palabras para describir la inspección realizada
        </div>
      </div>

      {/* IA Inteligente */}
      <IAInteligente
        textoActual={formData.descripcionInspeccion || ''}
        onTextoCambiado={(texto) => onInputChange('descripcionInspeccion', texto)}
        contextoFormulario={formData}
        tipoSeccion="descripcionInspeccion"
        tituloSeccion="Descripción de la Inspección"
      />

      {/* Carga de imágenes */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Carga de Imágenes</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-gray-600 mb-4">
            <p className="font-medium">Arrastra y suelta las imágenes aquí</p>
            <p className="text-sm">o haz clic para seleccionar archivos</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Seleccionar Imágenes
          </label>
        </div>

        {/* Lista de imágenes */}
        {imagenes.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-3">Imágenes Cargadas ({imagenes.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imagenes.map((imagen) => (
                <div key={imagen.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="relative">
                    <img
                      src={imagen.url}
                      alt={imagen.nombre}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => setImagenSeleccionada(imagen)}
                    />
                    <button
                      onClick={() => eliminarImagen(imagen.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-800 truncate">{imagen.nombre}</p>
                    <textarea
                      value={imagen.descripcion}
                      onChange={(e) => actualizarDescripcion(imagen.id, e.target.value)}
                      placeholder="Descripción de la imagen..."
                      className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de vista previa */}
      {imagenSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{imagenSeleccionada.nombre}</h3>
              <button
                onClick={() => setImagenSeleccionada(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img
              src={imagenSeleccionada.url}
              alt={imagenSeleccionada.nombre}
              className="w-full rounded-lg"
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la imagen
              </label>
              <textarea
                value={imagenSeleccionada.descripcion}
                onChange={(e) => actualizarDescripcion(imagenSeleccionada.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Describe lo que se observa en esta imagen..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Validación de calidad */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          📊 Validación de Calidad
        </h3>
        <div className="text-sm text-yellow-800">
          <p className="mb-2">
            <strong>Recomendaciones para inspección fotográfica de calidad:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Incluya descripción detallada de la inspección realizada</li>
            <li>Tome fotografías desde diferentes ángulos</li>
            <li>Documente los daños más significativos</li>
            <li>Incluya imágenes del contexto general</li>
            <li>Agregue descripciones específicas a cada imagen</li>
            <li>Mantenga un registro organizado de las evidencias</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
