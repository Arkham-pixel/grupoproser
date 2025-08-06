import React, { useState, useEffect } from 'react';
import { crearCasoComplex, updateCasoComplex } from '../services/complexService';
import ciudadesData from '../data/colombia.json';
import Select from 'react-select';
import { aseguradorasConFuncionarios } from '../data/aseguradorasFuncionarios';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 Importar
import { getCasoComplex } from '../services/complexService'; // 👈 Importar
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/complex';

const crearCaso = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData);
    console.log('Caso creado:', response.data);
  } catch (error) {
    console.error('Error al crear el caso:', error);
  }
};



const municipios = ciudadesData.flatMap(dep =>
  dep.ciudades.map(ciudad => ({
    label: `${ciudad} - ${dep.departamento}`,
    value: ciudad
  }))
);







  const AgregarCaso = ({ modoEdicion }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    responsable:'',
    numero_siniestro: '',
    codigo_workflow: '',
    intermediario: '',
    numero_poliza: '',
    asegurado: '',
    tipo_documento: '',
    numero_documento: '',
    fecha_asignacion: '',
    fecha_siniestro: '',
    ciudad_siniestro: '',
    descripcion_siniestro: '',
    aseguradora: '',
    funcionario_aseguradora:'',
    tipo_poliza: '',
    causa_siniestro: '',
    estado:'',
    valor_reserva: null,
    valor_reclamo: null,
    monto_indemnizar: null,
    fecha_contacto_inicial: '',
    observaciones_contacto_inicial: '',
    adjuntos_contacto_inicial: '',
    fecha_inspeccion: '',
    observacion_inspeccion: '',
    adjunto_acta_inspeccion: '',
    fecha_solicitud_documentos: '',
    observacion_solicitud_documento: '',
    adjunto_solicitud_documento: '',
    fecha_informe_preliminar: '',
    adjunto_informe_preliminar:'',
    observacion_informe_preliminar:'',
    fecha_informe_final: '',
    adjunto_informe_final:'', 
    observacion_informe_final: '', 
    fecha_ultimo_documento:'', 
    adjunto_entrega_ultimo_documento:'',
     numero_factura: '',
    valor_servicio: null,
    valor_gastos: null,
    iva: null,
    reteiva: null,
    retefuente: null,
    reteica: null,
    total_base: null,
    total_factura: null,
    total_pagado: null,
    fecha_factura: '',
    fecha_ultima_revision: '',
    observacion_compromisos: '',
    adjunto_factura: '',
    fecha_ultimo_seguimiento: '',
    observacion_seguimiento_pendientes: '',
    adjunto_seguimientos_pendientes: '',

  
  });



    useEffect(() => {
    const servicio = Number(formData.valor_servicio) || 0;
    const gastos = Number(formData.valor_gastos) || 0;

    const iva = 0;
    const reteiva = 0;
    const retefuente = 0;
    const reteica = 0;
    const total_base = servicio + gastos;
    const total_factura = total_base;
    const total_pagado = total_factura;

    setFormData(prev => ({
      ...prev,
      iva,
      reteiva,
      retefuente,
      reteica,
      total_base,
      total_factura,
      total_pagado,
    }));
  }, [formData.valor_servicio, formData.valor_gastos]);



  const [tabActiva, setTabActiva] = useState("valores");





  const handleCiudadChange = (selectedOption) => {
  setFormData({ ...formData, ciudad_siniestro: selectedOption.value });
  };


    const handleAseguradoraChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, aseguradora: value, funcionario_aseguradora: '' });
  };

  useEffect(() => {
    if (modoEdicion && id) {
      getCasoComplex(id).then(data => setFormData(data));
    }
  }, [modoEdicion, id]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modoEdicion && id) {
      await updateCasoComplex(id, formData);
      // redirige o muestra mensaje
    } else {
      await crearCasoComplex(formData);
      // redirige o muestra mensaje
    }
  };



const handleChange = (e) => {
  const { name, value } = e.target;

  // Si es campo de tipo number (los de valores):
  if (['valor_reserva', 'valor_reclamo', 'monto_indemnizar'].includes(name)) {
    setFormData({ ...formData, [name]: value === '' ? null : Number(value) });
  }
  // Si es campo de tipo date:
  else if ([
    'fecha_asignacion',
    'fecha_siniestro',
    'fecha_contacto_inicial',
    'fecha_inspeccion',
    'fecha_solicitud_documentos'
  ].includes(name)) {
    setFormData({ ...formData, [name]: value === '' ? null : value });
  }
  // Para los demás (string):
  else {
    setFormData({ ...formData, [name]: value === '' ? null : value });
  }
};

const [seguimientos, setSeguimientos] = useState([]);



  const handleNumberChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value === '' ? null : Number(value) });
};

const onDrop = (acceptedFiles) => {
  const fileNames = acceptedFiles.map(file => file.name);
  setFormData({ ...formData, adjuntos_contacto_inicial: fileNames.join(',') });
};




const handleAddSeguimiento = () => {
  setSeguimientos(prev => [
    {
      fecha: '',
      observacion: '',
      adjunto: ''
    },
    ...prev // para que el más nuevo quede arriba
  ]);
};


const handleSeguimientoChange = (index, field, value) => {
  const updated = [...seguimientos];
  updated[index][field] = value;
  setSeguimientos(updated);
};


const handleSeguimientoAdjuntoDrop = (index, acceptedFiles) => {
  const fileNames = acceptedFiles.map(file => file.name).join(',');
  const updated = [...seguimientos];
  updated[index].adjunto = fileNames;
  setSeguimientos(updated);
};



const handleEliminarSeguimiento = (index) => {
  const updated = seguimientos.filter((_, i) => i !== index);
  setSeguimientos(updated);
};



// Dropzone para Contacto Inicial
const {
  getRootProps: getRootPropsContacto,
  getInputProps: getInputPropsContacto,
  isDragActive: isDragActiveContacto
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjuntos_contacto_inicial: files.join(',')  // campo que ya tienes en tu DTO y tabla
    }));
  }
});

// Dropzone para Acta Inspección
const {
  getRootProps: getRootPropsInspeccion,
  getInputProps: getInputPropsInspeccion,
  isDragActive: isDragActiveInspeccion
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_acta_inspeccion: files.join(',')  // campo que tienes en la tabla: adjunto_acta_inspeccion
    }));
  }
});

const {
  getRootProps: getRootPropsSolicitudDocs,
  getInputProps: getInputPropsSolicitudDocs,
  isDragActive: isDragActiveSolicitudDocs
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_solicitud_documento: files.join(',')  // campo de la tabla complex
    }));
  }
});

// Dropzone para Informe Preliminar
const {
  getRootProps: getRootPropsInformePreliminar,
  getInputProps: getInputPropsInformePreliminar,
  isDragActive: isDragActiveInformePreliminar
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_informe_preliminar: files.join(',')  // campo en la tabla complex
    }));
  }
});

// Dropzone para Adjunto Informe Final
const {
  getRootProps: getRootPropsInformeFinal,
  getInputProps: getInputPropsInformeFinal,
  isDragActive: isDragActiveInformeFinal
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_informe_final: files.join(',')  // campo en la tabla
    }));
  }
});

// Dropzone para Adjunto Entrega Último Documento
const {
  getRootProps: getRootPropsUltimoDocumento,
  getInputProps: getInputPropsUltimoDocumento,
  isDragActive: isDragActiveUltimoDocumento
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_entrega_ultimo_documento: files.join(',')  // campo en la tabla
    }));
  }
});


// Dropzone para Adjunto Factura
const {
  getRootProps: getRootPropsFactura,
  getInputProps: getInputPropsFactura,
  isDragActive: isDragActiveFactura
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_factura: files.join(',')
    }));
  }
});

const {
  getRootProps: getRootPropsSeguimiento,
  getInputProps: getInputPropsSeguimiento,
  isDragActive: isDragActiveSeguimiento
} = useDropzone({
  onDrop: (acceptedFiles) => {
    const files = acceptedFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      adjunto_seguimientos_pendientes: files.join(',')
    }));
  }
});






const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });




  const aseguradoraOptions = Object.keys(aseguradorasConFuncionarios);
  const funcionarios = formData.aseguradora ? aseguradorasConFuncionarios[formData.aseguradora] || [] : [];

  const [intermediarios, setIntermediarios] = useState([
    "Intermediario A",
    "Intermediario B",
    "Intermediario C",
  ]);
  const [nuevoIntermediario, setNuevoIntermediario] = useState("");

  // Función para agregar un nuevo intermediario
  const agregarIntermediario = () => {
    if (
      nuevoIntermediario.trim() !== "" &&
      !intermediarios.includes(nuevoIntermediario)
    ) {
      setIntermediarios([...intermediarios, nuevoIntermediario]);
      setNuevoIntermediario("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">📋 Asignación de Ajuste</h2>

      <div className="flex flex-wrap justify-between items-center mb-6 space-y-2 md:space-y-0 md:space-x-4">
  <div className="flex items-center space-x-2">
  

    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      form="form-caso" // para que ejecute el submit del form
    >
      Guardar
    </button>

    <button
      type="button"
      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      onClick={() => setFormData(initialFormData)} // limpiar para nuevo caso
    >
      Agregar Nuevo Caso
    </button>

    <button
      type="button"
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      // onClick={handleCancelar}
    >
      Cancelar
    </button>
  </div>
</div>

<form id="form-caso" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">



        

                  <div>
                  <label className="block font-medium">Responsable *</label>
                  <select
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    className="border px-2 py-2 w-full rounded"
                  >
                    <option value="">Seleccionar...</option>
                    {[
                      "Alexander Escalante",
                      "Alfonso Marquez",
                      "Andrés Mejía",
                      "Armando Fontalvo",
                      "Arnaldo Andrés Tapia Gutierrez",
                      "Bernardo Sojo Guzmán",
                      "Byron Leon",
                      "Dario Mayo",
                      "Elkin Gabriel Tapia Gutierrez",
                      "Gabriel Moreno",
                      "Guillermo Segundo Mangonez Arcia",
                      "Iskharly José Tapia Gutierrez",
                      "Ladys Andrea Escalante Bossio",
                      "Luis Enrique Truyol",
                      "María Fernanda Sanín",
                      "Maria Garcias",
                      "Mario Alberto Pinilla de la Torre",
                      "Milagro Navarro",
                      "Orlando Quijano"
                    ].map((responsable, idx) => (
                      <option key={idx} value={responsable}>{responsable}</option>
                    ))}
                  </select>
                </div>


                      <div>
          <label className="block text-sm font-medium">Aseguradora</label>
          <select
            name="aseguradora"
            value={formData.aseguradora}
            onChange={handleAseguradoraChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccione una aseguradora</option>
            {aseguradoraOptions.map((aseg) => (
              <option key={aseg} value={aseg}>{aseg}</option>
            ))}
          </select>
        </div>

        {formData.aseguradora && funcionarios.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Funcionario Aseguradora</label>
            <select
              name="funcionario_aseguradora"
              value={formData.funcionario_aseguradora}
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
            value={formData.numero_siniestro}
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
            value={formData.codigo_workflow}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Intermediario</label>
          <select
            name="intermediario"
            value={formData.intermediario}
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
            value={formData.numero_poliza}
            onChange={handleChange}
            className="w-full border rounded px-2 py-2"
          />
        </div>

        <div>
        <label className="block text-sm font-medium">Asegurado o Beneficiario *</label>
          <input
            type="text"
            name="asegurado"
            value={formData.asegurado}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
       </div>

       <div>
          <label className="block text-sm font-medium">Tipo de Documento</label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
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
              value={formData.numero_documento}
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
              value={formData.fecha_asignacion}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
        </div>

        <div>
          <label className="block text-sm font-medium">Fecha del Siniestro</label>
          <input
            type="date"
            name="fecha_siniestro"
            value={formData.fecha_siniestro}
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
            value={formData.tipo_poliza}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Causa del Siniestro</label>
          <input
            type="text"
            name="causa_siniestro" 
            value={formData.causa_siniestro}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>




        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Descripción del Siniestro</label>
          <textarea
            name="descripcion_siniestro"
            value={formData.descripcion_siniestro}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Describe brevemente el siniestro"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Estado del Siniestro</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Selecciona un estado</option>
            <option value="COMPLEX">COMPLEX</option>
            <option value="DESISTIDO">DESISTIDO</option>
            <option value="LIQUIDAR SINIESTRO">LIQUIDAR SINIESTRO</option>
            <option value="PAGO SINIESTRO">PAGO SINIESTRO</option>
            <option value="PENDIENTE ACEPTACION CLIENTE">PENDIENTE ACEPTACION CLIENTE</option>
            <option value="COORDINANDO INSPECCION">COORDINANDO INSPECCION</option>
            <option value="FINALIZADO">FINALIZADO</option>
            <option value="PAGO GIRADO">PAGO GIRADO</option>
            <option value="PENDIENTE ACEPTACION CIFRAS">PENDIENTE ACEPTACION CIFRAS</option>
            <option value="PENDIENTE DOCUMENTOS">PENDIENTE DOCUMENTOS</option>
          </select>
        </div>











        


     
      </form>

      <div className="mt-6">
        <div className="flex border-b">
          {["valores", "trazabilidad", "facturacion", "seguimiento", "observaciones"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium ${
                tabActiva === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setTabActiva(tab)}
            >
              {tab === "valores" && "Valores y Prestaciones"}
              {tab === "trazabilidad" && "Trazabilidad"}
              {tab === "facturacion" && "Facturación"}
              {tab === "seguimiento" && "Seguimiento"}
              {tab === "observaciones" && "Observaciones Clientes"}
            </button>
          ))}
        </div>

        <div className="p-4 border rounded-b-lg bg-gray-50 mt-2">
          {tabActiva === "valores" && <div>Contenido de Valores y Prestaciones</div>}
          {tabActiva === "trazabilidad" && <div>Contenido de Trazabilidad</div>}
          {tabActiva === "facturacion" && <div>Contenido de Facturación</div>}
          {tabActiva === "seguimiento" && <div>Contenido de Seguimiento</div>}
          {tabActiva === "observaciones" && <div>Contenido de Observaciones Clientes</div>}
        </div>
      </div>

      {tabActiva === "valores" && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Valor Reserva</label>
                      <input
                        type="number"
                        name="valor_reserva"
                        value={formData.valor_reserva ?? '' }
                        onChange={handleNumberChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="$ 0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Valor Reclamo</label>
                      <input
                        type="number"
                        name="valor_reclamo"
                        value={formData.valor_reclamo ?? '' }
                        onChange={handleNumberChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="$ 0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Monto a Indemnizar</label>
                      <input
                        type="number"
                        name="monto_indemnizar" 
                        value={formData.monto_indemnizar ?? '' }
                        onChange={handleNumberChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="$ 0"
                      />
                    </div>

                </div>
    )}


                  {tabActiva === "trazabilidad" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Fecha Contacto Inicial</label>
                        <input
                          type="date"
                          name="fecha_contacto_inicial"
                          value={formData.fecha_contacto_inicial}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Observaciones Contacto Inicial</label>
                        <textarea
                          name="observaciones_contacto_inicial"
                          value={formData.observaciones_contacto_inicial}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                          rows={4}
                          placeholder="Escribe tus observaciones..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Adjuntos Contacto Inicial</label>
                        <div
                          {...getRootPropsContacto()}
                          className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                        >
                          <input {...getInputPropsContacto()} />
                          {isDragActiveContacto
                            ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                            : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                        </div>
                        <p className="text-sm mt-2">Archivos seleccionados: {formData.adjuntos_contacto_inicial}</p>
                      </div>

                      <hr className="md:col-span-2 my-4" />

                      <div>
                        <label className="block text-sm font-medium">Fecha de Inspección</label>
                        <input
                          type="date"
                          name="fecha_inspeccion"
                          value={formData.fecha_inspeccion}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Observaciones de la Inspección</label>
                        <textarea
                          name="observacion_inspeccion"
                          value={formData.observacion_inspeccion}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                          rows={4}
                          placeholder="Escribe tus observaciones de la inspección..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Anexo Acta Inspección</label>
                        <div
                          {...getRootPropsInspeccion()}
                          className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                        >
                          <input {...getInputPropsInspeccion()} />
                          {isDragActiveInspeccion
                            ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                            : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                        </div>
                        <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_acta_inspeccion}</p>
                      </div>


                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">Fecha Solicitud de Documentos</label>
                          <input
                            type="date"
                            name="fecha_solicitud_documentos"
                            value={formData.fecha_solicitud_documentos}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium">Anexos de la Solicitud de Documentos</label>
                          <div
                            {...getRootPropsSolicitudDocs()}
                            className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                          >
                            <input {...getInputPropsSolicitudDocs()} />
                            {isDragActiveSolicitudDocs
                              ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                              : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                          </div>
                          <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_solicitud_documento}</p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium">Observaciones Solicitud de Documentos</label>
                          <textarea
                            name="observacion_solicitud_documento"
                            value={formData.observacion_solicitud_documento}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            rows={4}
                            placeholder="Escribe tus observaciones..."
                          />
                        </div>
                      </div>

                      <hr className="md:col-span-2 my-4" />

                      <div>
                        <label className="block text-sm font-medium">Fecha Informe Preliminar</label>
                        <input
                          type="date"
                          name="fecha_informe_preliminar"
                          value={formData.fecha_informe_preliminar}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Adjunto Informe Preliminar</label>
                        <div
                          {...getRootPropsInformePreliminar()}
                          className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                        >
                          <input {...getInputPropsInformePreliminar()} />
                          {isDragActiveInformePreliminar
                            ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                            : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                        </div>
                        <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_informe_preliminar}</p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Observaciones Informe Preliminar</label>
                        <textarea
                          name="observacion_informe_preliminar"
                          value={formData.observacion_informe_preliminar}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                          rows={4}
                          placeholder="Escribe tus observaciones..."
                        />
                      </div>

                      <hr className="md:col-span-2 my-4" />

                      <div>
                        <label className="block text-sm font-medium">Fecha Informe Final</label>
                        <input
                          type="date"
                          name="fecha_informe_final"
                          value={formData.fecha_informe_final}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Observaciones Fecha Informe Final</label>
                        <textarea
                          name="observacion_informe_final"
                          value={formData.observacion_informe_final}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                          rows={4}
                          placeholder="Escribe tus observaciones..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Adjunto Informe Final</label>
                        <div
                          {...getRootPropsInformeFinal()}
                          className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                        >
                          <input {...getInputPropsInformeFinal()} />
                          {isDragActiveInformeFinal
                            ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                            : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                        </div>
                        <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_informe_final}</p>
                      </div>

                      <hr className="md:col-span-2 my-4" />

                      <div>
                        <label className="block text-sm font-medium">Fecha Último Documento</label>
                        <input
                          type="date"
                          name="fecha_ultimo_documento"
                          value={formData.fecha_ultimo_documento}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Adjunto Entrega Último Documento</label>
                        <div
                          {...getRootPropsUltimoDocumento()}
                          className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                        >
                          <input {...getInputPropsUltimoDocumento()} />
                          {isDragActiveUltimoDocumento
                            ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                            : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                        </div>
                        <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_entrega_ultimo_documento}</p>
                      </div>


                      



                    </div>

                    
                  )}


                {tabActiva === "facturacion" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                      <label className="block text-sm font-medium">Número de Factura</label>
                      <input
                        type="number"
                        name="numero_factura"
                        value={formData.numero_factura ?? ''}
                        onChange={handleNumberChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Valor Servicios</label>
                      <input
                        type="number"
                        name="valor_servicio"
                        value={formData.valor_servicio ?? ''}
                        onChange={handleNumberChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Valor Gastos</label>
                      <input
                        type="number"
                        name="valor_gastos"
                        value={formData.valor_gastos ?? ''}
                        onChange={handleNumberChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div>
                    <label className="block text-sm font-medium">IVA</label>
                    <input
                      type="number"
                      name="iva"
                      value={formData.iva ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium">ReteIVA</label>
                    <input
                      type="number"
                      name="reteiva"
                      value={formData.reteiva ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium">ReteFuente</label>
                    <input
                      type="number"
                      name="retefuente"
                      value={formData.retefuente ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium">ReteICA</label>
                    <input
                      type="number"
                      name="reteica"
                      value={formData.reteica ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium font-semibold">Total Base</label>
                    <input
                      type="number"
                      name="total_base"
                      value={formData.total_base ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100 font-bold"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium font-semibold">Total Factura</label>
                    <input
                      type="number"
                      name="total_factura"
                      value={formData.total_factura ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100 font-bold"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium font-semibold">Total Pagado</label>
                    <input
                      type="number"
                      name="total_pagado"
                      value={formData.total_pagado ?? 0}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100 font-bold"
                    />
                    </div>


                    <div>
                      <label className="block text-sm font-medium">Fecha de Factura</label>
                      <input
                        type="date"
                        name="fecha_factura"
                        value={formData.fecha_factura}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Fecha Última Revisión</label>
                      <input
                        type="date"
                        name="fecha_ultima_revision"
                        value={formData.fecha_ultima_revision}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Observaciones y Compromisos</label>
                      <textarea
                        name="observacion_compromisos"
                        value={formData.observacion_compromisos}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        placeholder="Escribe tus observaciones y compromisos..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Adjunto Factura</label>
                      <div
                        {...getRootPropsFactura()}
                        className="border-dashed border-2 border-gray-300 p-6 rounded text-center cursor-pointer"
                      >
                        <input {...getInputPropsFactura()} />
                        {isDragActiveFactura
                          ? <p className="text-blue-500">Suelta los archivos aquí...</p>
                          : <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>}
                      </div>
                      <p className="text-sm mt-2">Archivos seleccionados: {formData.adjunto_factura}</p>
                    </div>

                  </div>
                )}

{tabActiva === "seguimiento" && (
  <div>
    <div className="flex justify-end mb-4">
      <button
        type="button"
        onClick={handleAddSeguimiento}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow"
      >
        + Nuevo Seguimiento
      </button>
    </div>

    {seguimientos.map((seg, index) => (
      <div
        key={index}
        className="mb-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">📅 Fecha del Seguimiento</label>
            <input
              type="date"
              value={seg.fecha}
              onChange={(e) => handleSeguimientoChange(index, "fecha", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">📎 Adjunto</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                handleSeguimientoChange(index, "adjunto", file ? file.name : "");
              }}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-sm mt-1 text-gray-600 italic">Archivo: {seg.adjunto}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">📝 Observación</label>
          <textarea
            value={seg.observacion}
            onChange={(e) => handleSeguimientoChange(index, "observacion", e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Escribe la observación del seguimiento..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleEliminarSeguimiento(index)}
            className="text-red-500 border border-red-500 px-4 py-1 rounded hover:bg-red-50"
          >
            🗑 Eliminar Seguimiento
          </button>
        </div>
      </div>
    ))}
  </div>
)}


             
        




      




    </div>
  );
};


export default AgregarCaso;
