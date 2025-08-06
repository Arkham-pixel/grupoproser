import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ActivacionRiesgo from "./ActivacionRiesgo.jsx";
import SeguimientoRiesgo from "./SeguimientoRiesgo.jsx";
import FacturacionRiesgo from "./FacturacionRiesgo.jsx";
import ListaCasosRiesgo from "./ListaCasosRiesgo";
import { useCasosRiesgo } from "../../context/CasosRiesgoContext";
import axios from 'axios';

const initialFormData = {
  aseguradora: '',
  direccion: '',
  ciudad: null,
  asegurado: '',
  fechaAsignacion: '',
  fechaInspeccion: '',
  observaciones: '',
  estado: '',
  responsable: '',
  clasificacion: null,
  quienSolicita: null,
};

const AgregarCasoRiesgo = ({ casoInicial, onClose }) => {
  const [pestanaActiva, setPestanaActiva] = useState('activacion');
  const [formData, setFormData] = useState(initialFormData);
  const [editando, setEditando] = useState(false);
  const [casoEditadoIndex, setCasoEditadoIndex] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const { agregarCaso, editarCaso, casos } = useCasosRiesgo();
  const navigate = useNavigate();
  const { id } = useParams();
  const [estados, setEstados] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    axios.get('/api/estados/estados-riesgos')
      .then(res => setEstados(res.data))
      .catch(() => setEstados([]));
  }, []);

  useEffect(() => {
    axios.get('/api/clientes')
      .then(res => {
        // Extraer aseguradoras únicas por codiAsgrdra
        const mapa = new Map();
        res.data.forEach(c => {
          if (c.codiAsgrdra && c.rzonSocial) {
            mapa.set(c.codiAsgrdra, c.rzonSocial);
          }
        });
        setAseguradoras(Array.from(mapa, ([codiAsgrdra, rzonSocial]) => ({ codiAsgrdra, rzonSocial })));
      })
      .catch(() => setAseguradoras([]));
  }, []);

  useEffect(() => {
    axios.get('/api/responsables')
      .then(res => {
        setResponsables(res.data.map(r => ({ codiRespnsble: r.codiRespnsble, nmbrRespnsble: r.nmbrRespnsble })));
      })
      .catch(() => setResponsables([]));
  }, []);

  useEffect(() => {
    axios.get('/api/estados/clasificaciones-riesgo')
      .then(res => {
        setClasificaciones(res.data.map(c => ({ codiIdentificador: c.codiIdentificador, rzonDescripcion: c.rzonDescripcion })));
      })
      .catch(() => setClasificaciones([]));
  }, []);

  useEffect(() => {
    axios.get('/api/ciudades')
      .then(res => {
        // Mapeo para react-select: value = codiMunicipio, label = descMunicipio - descDepto
        setCiudades(res.data.map(c => ({
          value: c.codiMunicipio,
          label: `${c.descMunicipio} - ${c.descDepto}`,
          departamento: c.descDepto,
          ...c
        })));
      })
      .catch(() => setCiudades([]));
  }, []);


  const onEditarCaso = (caso, idx) => {
    // Mapeo robusto para todos los campos relacionales
    // Aseguradora
    let aseguradoraValue = '';
    if (caso.codiAsgrdra) {
      aseguradoraValue = String(caso.codiAsgrdra);
    } else if (caso.aseguradora) {
      const found = aseguradoras.find(a => a.rzonSocial === caso.aseguradora);
      aseguradoraValue = found ? String(found.codiAsgrdra) : '';
    }
    // Responsable (inspector) - prioriza codiIspector
    let responsableValue = '';
    if (caso.codiIspector) {
      responsableValue = String(caso.codiIspector);
    } else if (caso.codiRespnsble) {
      responsableValue = String(caso.codiRespnsble);
    } else if (caso.responsable) {
      const found = responsables.find(r => r.nmbrRespnsble === caso.responsable);
      responsableValue = found ? String(found.codiRespnsble) : '';
    } else if (caso.funcSolicita) {
      const found = responsables.find(r => r.nmbrRespnsble === caso.funcSolicita);
      responsableValue = found ? String(found.codiRespnsble) : '';
    }
    // Estado
    let estadoValue = '';
    if (caso.codiEstdo) {
      estadoValue = String(caso.codiEstdo);
    } else if (caso.estado) {
      const found = estados.find(e => e.descEstdo === caso.estado);
      estadoValue = found ? String(found.codiEstdo) : '';
    }
    // Ciudad
    let ciudadValue = null;
    if (caso.ciudadSucursal || caso.ciudad) {
      const codigo = caso.ciudadSucursal || caso.ciudad;
      ciudadValue = ciudades.find(c => c.value === codigo || c.label.startsWith(codigo));
    }
    // Clasificación
    let clasificacionValue = '';
    if (caso.codiClasificacion) {
      clasificacionValue = String(caso.codiClasificacion);
    } else if (caso.clasificacion) {
      const found = clasificaciones.find(c => c.rzonDescripcion === caso.clasificacion);
      clasificacionValue = found ? String(found.codiIdentificador) : '';
    }
    // Quien Solicita
    let quienSolicitaValue = null;
    if (caso.funcSolicita) {
      quienSolicitaValue = { label: caso.funcSolicita, value: caso.funcSolicita };
    } else if (caso.quienSolicita) {
      quienSolicitaValue = { label: caso.quienSolicita, value: caso.quienSolicita };
    }
    setFormData({
      nmroRiesgo: caso.nmroRiesgo || '',
      aseguradora: aseguradoraValue,
      responsable: responsableValue,
      codiEstdo: estadoValue,
      ciudad: ciudadValue,
      codiClasificacion: clasificacionValue,
      quienSolicita: quienSolicitaValue,
      // ...otros campos normales...
      codiIspector: caso.codiIspector || '',
      codiAsgrdra: caso.codiAsgrdra || '',
      asgrBenfcro: caso.asgrBenfcro || '',
      nmroConsecutivo: caso.nmroConsecutivo || '',
      fchaAsgncion: caso.fchaAsgncion ? new Date(caso.fchaAsgncion).toISOString().slice(0,10) : '',
      observAsignacion: caso.observAsignacion || '',
      adjuntoAsignacion: caso.adjuntoAsignacion || null,
      fchaInspccion: caso.fchaInspccion ? new Date(caso.fchaInspccion).toISOString().slice(0,10) : '',
      observInspeccion: caso.observInspeccion || '',
      adjuntoInspeccion: caso.adjuntoInspeccion || null,
      fchaInforme: caso.fchaInforme ? new Date(caso.fchaInforme).toISOString().slice(0,10) : '',
      anxoInfoFnal: caso.anxoInfoFnal || null,
      observInforme: caso.observInforme || '',
      codDireccion: caso.codDireccion || '',
      funcSolicita: caso.funcSolicita || '',
      codigoPoblado: caso.codigoPoblado || '',
      ciudadSucursal: caso.ciudadSucursal || '',
      vlorTarifaAseguradora: caso.vlorTarifaAseguradora || '',
      vlorHonorarios: caso.vlorHonorarios || '',
      vlorGastos: caso.vlorGastos || '',
      nmroFactra: caso.nmroFactra || '',
      fchaFactra: caso.fchaFactra ? new Date(caso.fchaFactra).toISOString().slice(0,10) : '',
      totalPagado: caso.totalPagado || '',
      anxoFactra: caso.anxoFactra || null,
      asegurado: caso.asgrBenfcro || caso.asegurado || '',
      direccion: caso.codDireccion || caso.direccion || '',
      fechaAsignacion: caso.fchaAsgncion ? new Date(caso.fchaAsgncion).toISOString().slice(0,10) : '',
      fechaInspeccion: caso.fchaInspccion ? new Date(caso.fchaInspccion).toISOString().slice(0,10) : '',
      observaciones: caso.observInspeccion || '',
    });
    setEditando(true);
    setCasoEditadoIndex(idx);
    setPestanaActiva('activacion');
  };

  // Si recibimos casoInicial, llenamos el formulario automáticamente
  useEffect(() => {
    if (casoInicial) {
      // Copia la lógica de onEditarCaso pero usando casoInicial
      // (puedes extraer la lógica a una función para evitar duplicidad)
      let aseguradoraValue = '';
      if (casoInicial.codiAsgrdra) {
        aseguradoraValue = String(casoInicial.codiAsgrdra);
      } else if (casoInicial.aseguradora) {
        const found = aseguradoras.find(a => a.rzonSocial === casoInicial.aseguradora);
        aseguradoraValue = found ? String(found.codiAsgrdra) : '';
      }
      let responsableValue = '';
      if (casoInicial.codiIspector) {
        responsableValue = String(casoInicial.codiIspector);
      } else if (casoInicial.codiRespnsble) {
        responsableValue = String(casoInicial.codiRespnsble);
      } else if (casoInicial.responsable) {
        const found = responsables.find(r => r.nmbrRespnsble === casoInicial.responsable);
        responsableValue = found ? String(found.codiRespnsble) : '';
      } else if (casoInicial.funcSolicita) {
        const found = responsables.find(r => r.nmbrRespnsble === casoInicial.funcSolicita);
        responsableValue = found ? String(found.codiRespnsble) : '';
      }
      let estadoValue = '';
      if (casoInicial.codiEstdo) {
        estadoValue = String(casoInicial.codiEstdo);
      } else if (casoInicial.estado) {
        const found = estados.find(e => e.descEstdo === casoInicial.estado);
        estadoValue = found ? String(found.codiEstdo) : '';
      }
      let ciudadValue = null;
      if (casoInicial.ciudadSucursal || casoInicial.ciudad) {
        const codigo = casoInicial.ciudadSucursal || casoInicial.ciudad;
        ciudadValue = ciudades.find(c => c.value === codigo || c.label.startsWith(codigo));
      }
      let clasificacionValue = '';
      if (casoInicial.codiClasificacion) {
        clasificacionValue = String(casoInicial.codiClasificacion);
      } else if (casoInicial.clasificacion) {
        const found = clasificaciones.find(c => c.rzonDescripcion === casoInicial.clasificacion);
        clasificacionValue = found ? String(found.codiIdentificador) : '';
      }
      let quienSolicitaValue = null;
      if (casoInicial.funcSolicita) {
        quienSolicitaValue = { label: casoInicial.funcSolicita, value: casoInicial.funcSolicita };
      } else if (casoInicial.quienSolicita) {
        quienSolicitaValue = { label: casoInicial.quienSolicita, value: casoInicial.quienSolicita };
      }
      setFormData({
        nmroRiesgo: casoInicial.nmroRiesgo || '',
        aseguradora: aseguradoraValue,
        responsable: responsableValue,
        codiEstdo: estadoValue,
        ciudad: ciudadValue,
        codiClasificacion: clasificacionValue,
        quienSolicita: quienSolicitaValue,
        codiIspector: casoInicial.codiIspector || '',
        codiAsgrdra: casoInicial.codiAsgrdra || '',
        asgrBenfcro: casoInicial.asgrBenfcro || '',
        nmroConsecutivo: casoInicial.nmroConsecutivo || '',
        fchaAsgncion: casoInicial.fchaAsgncion ? new Date(casoInicial.fchaAsgncion).toISOString().slice(0,10) : '',
        observAsignacion: casoInicial.observAsignacion || '',
        adjuntoAsignacion: casoInicial.adjuntoAsignacion || null,
        fchaInspccion: casoInicial.fchaInspccion ? new Date(casoInicial.fchaInspccion).toISOString().slice(0,10) : '',
        observInspeccion: casoInicial.observInspeccion || '',
        adjuntoInspeccion: casoInicial.adjuntoInspeccion || null,
        fchaInforme: casoInicial.fchaInforme ? new Date(casoInicial.fchaInforme).toISOString().slice(0,10) : '',
        anxoInfoFnal: casoInicial.anxoInfoFnal || null,
        observInforme: casoInicial.observInforme || '',
        codDireccion: casoInicial.codDireccion || '',
        funcSolicita: casoInicial.funcSolicita || '',
        codigoPoblado: casoInicial.codigoPoblado || '',
        ciudadSucursal: casoInicial.ciudadSucursal || '',
        vlorTarifaAseguradora: casoInicial.vlorTarifaAseguradora || '',
        vlorHonorarios: casoInicial.vlorHonorarios || '',
        vlorGastos: casoInicial.vlorGastos || '',
        nmroFactra: casoInicial.nmroFactra || '',
        fchaFactra: casoInicial.fchaFactra ? new Date(casoInicial.fchaFactra).toISOString().slice(0,10) : '',
        totalPagado: casoInicial.totalPagado || '',
        anxoFactra: casoInicial.anxoFactra || null,
        asegurado: casoInicial.asgrBenfcro || casoInicial.asegurado || '',
        direccion: casoInicial.codDireccion || casoInicial.direccion || '',
        fechaAsignacion: casoInicial.fchaAsgncion ? new Date(casoInicial.fchaAsgncion).toISOString().slice(0,10) : '',
        fechaInspeccion: casoInicial.fchaInspccion ? new Date(casoInicial.fchaInspccion).toISOString().slice(0,10) : '',
        observaciones: casoInicial.observInspeccion || '',
      });
      setEditando(true);
      setCasoEditadoIndex(null);
      setPestanaActiva('activacion');
    }
  }, [casoInicial, aseguradoras, responsables, estados, ciudades, clasificaciones]);

  const guardarCaso = async () => {
    const nuevoCaso = {
      ...formData,
      ciudad: formData.ciudad ? formData.ciudad.value : '',
      quienSolicita: formData.quienSolicita ? formData.quienSolicita.label : '',
      clasificacion: formData.clasificacion ? formData.clasificacion.label : '',
    };
    if (editando && casoInicial && casoInicial._id) {
      // PUT directo al backend
      try {
        let dataToSend = nuevoCaso;
        let config = {};
        const formDataSend = new FormData();
        let hasFile = false;
        Object.entries(nuevoCaso).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataSend.append(key, value);
            hasFile = true;
          } else if (value !== undefined && value !== null) {
            formDataSend.append(key, value);
          }
        });
        if (hasFile) {
          dataToSend = formDataSend;
          config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        await axios.put(`/api/casos/${casoInicial._id}`, dataToSend, config);
        if (onClose) onClose();
      } catch (err) {
        alert('Error al guardar los cambios');
      }
    } else if (!editando) {
      agregarCaso(nuevoCaso);
    }
    setFormData(initialFormData);
  };

  const nuevoCaso = () => {
    setFormData(initialFormData);
  };

  const iniciarInspeccion = () => {
    navigate('/formularioinspeccion', {
      state: {
        ...formData,
        nombreCliente: formData.asegurado,
        ciudad_siniestro: formData.ciudad && typeof formData.ciudad.label === "string" ? formData.ciudad.label : "",
        departamento_siniestro: formData.ciudad && typeof formData.ciudad.departamento === "string" ? formData.ciudad.departamento : "",
        quienSolicita: formData.quienSolicita ? formData.quienSolicita.label : "",
        clasificacion: formData.clasificacion ? formData.clasificacion.label : "",
      }
    });
  };

  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case 'activacion':
        return <ActivacionRiesgo formData={formData} setFormData={setFormData} estados={estados} aseguradoras={aseguradoras} responsables={responsables} clasificaciones={clasificaciones} ciudades={ciudades} />;
      case 'seguimiento':
        return <SeguimientoRiesgo formData={formData} setFormData={setFormData} ciudades={ciudades} />;
      case 'facturacion':
        return <FacturacionRiesgo formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  // Función para saber si hay coincidencia en algún campo
  const hayCoincidencia = (valor) => {
    if (!busqueda.trim()) return false;
    if (!valor) return false;
    return valor.toString().toLowerCase().includes(busqueda.toLowerCase());
  };

  // Ejemplo usando fetch (puedes usar axios si prefieres)
  useEffect(() => {
    if (busqueda.trim() === "") return; // No buscar si está vacío

    fetch(`/api/casos?busqueda=${encodeURIComponent(busqueda)}`)
      .then(res => res.json())
      .then(data => {
        // Aquí actualizas tu lista de casos con los resultados del backend
        // setCasos(data);
      });
  }, [busqueda]);

  useEffect(() => {
    if (id && casos.length > 0) {
      const idx = casos.findIndex(
        c => c._id?.toString() === id || c.id_riesgo?.toString() === id || c.id?.toString() === id
      );
      if (idx !== -1) {
        onEditarCaso(casos[idx], idx);
      }
    }
    // eslint-disable-next-line
  }, [id, casos]);

  // Efecto para auto-seleccionar responsable cuando la lista esté lista y estés editando
  useEffect(() => {
    if (editando && responsables.length > 0 && casoEditadoIndex !== null) {
      const caso = casos[casoEditadoIndex];
      if (caso && (!formData.responsable || formData.responsable === '')) {
        setFormData(prev => ({
          ...prev,
          responsable: caso.codiRespnsble ? String(caso.codiRespnsble) : (caso.responsable || ''),
        }));
      }
    }
    // eslint-disable-next-line
  }, [responsables, editando, casoEditadoIndex]);

  return (
    <div className="p-4">
      <div className="flex justify-center space-x-2 mb-4">
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            pestanaActiva === 'activacion'
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setPestanaActiva('activacion')}
        >
          Activación
        </button>
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            pestanaActiva === 'seguimiento'
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setPestanaActiva('seguimiento')}
        >
          Seguimiento
        </button>
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            pestanaActiva === 'facturacion'
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setPestanaActiva('facturacion')}
        >
          Facturación
        </button>
      </div>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar en el formulario..."
          className="border px-3 py-2 rounded w-full max-w-lg"
        />
      </div>
      {formData.nmroRiesgo && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ color: 'red', fontSize: '2rem', fontWeight: 'bold' }}>
            N° Riesgo: {formData.nmroRiesgo}
          </span>
        </div>
      )}
      {renderizarContenido()}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          type="button"
          onClick={guardarCaso}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
        >
          GUARDAR
        </button>
        <button
          type="button"
          onClick={nuevoCaso}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold"
        >
          NUEVO CASO
        </button>
        <button
          type="button"
          onClick={iniciarInspeccion}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
        >
          INICIAR INSPECCIÓN
        </button>
      </div>
      {!casoInicial && (
        <div>
          <ListaCasosRiesgo onEditarCaso={onEditarCaso} ciudades={ciudades} estados={estados} />
        </div>
      )}
      <p>
        {formData.ciudad && formData.ciudad.label
          ? formData.ciudad.label.split("/")[0]
          : ""}
      </p>
      <p>
        {formData.ciudad_siniestro ? formData.ciudad_siniestro.split("/")[0] : "_________"}
      </p>
      {/* Select de Estado conectado a la lista real */}
    
    </div>
  );
};

export default AgregarCasoRiesgo;
