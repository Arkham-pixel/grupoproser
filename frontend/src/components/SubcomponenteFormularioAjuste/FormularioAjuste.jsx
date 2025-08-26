import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, HeadingLevel, ImageRun, Header, WidthType, Media } from "docx";
import { saveAs } from "file-saver";

import DatosGeneralesAjuste from "./DatosGeneralesAjuste";
import AntecedentesAjuste from "./AntecedentesAjuste";
import DescripcionRiesgoAjuste from "./DescripcionRiesgoAjuste";
import CircunstanciaSiniestroAjuste from "./CircunstanciaSiniestroAjuste";
import InspeccionFotograficaAjuste from "./InspeccionFotograficaAjuste";
import CausaAjuste from "./CausaAjuste";
import ReservaSugeridaAjuste from "./ReservaSugeridaAjuste";
import FirmaAjuste from "./FirmaAjuste";
import ObservacionesPreeliminar from "./ObservacionesPreeliminar";
import AnalisisCoberturaAjuste from "./AnalisisCoberturaAjuste";
import ObservacionesGeneralesAjuste from "./ObservacionesGeneralesAjuste";
import ChatbotIA from "./ChatbotIA";
import MapaUbicacionAjuste from './MapaUbicacionAjuste';

import Logo from '../../img/Logo.png';

import historialService, { TIPOS_FORMULARIOS } from '../../services/historialService.js';
import { aseguradorasConFuncionarios } from '../../data/aseguradorasFuncionarios.js';
import colombia from '../../data/colombia.json';
import API_CONFIG from '../../config/apiConfig.js';

// Importar la imagen de la firma de Iskharly
import firmaIskharly from '../../img/FIRMAISKHARLY.png';

// Datos maestros para llenado automático
const DATOS_MAESTROS = {
  aseguradoras: Object.keys(aseguradorasConFuncionarios).map(nombre => ({
    id: nombre.toLowerCase().replace(/\s+/g, '_'),
    nombre: nombre,
    funcionarios: aseguradorasConFuncionarios[nombre],
    sucursales: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
    direcciones: ['Calle Principal #123', 'Carrera Central #456', 'Avenida Comercial #789'],
    telefonos: ['+57 1 2345678', '+57 4 5678901', '+57 2 3456789'],
    emails: ['contacto@empresa.com', 'sucursal@empresa.com', 'atención@empresa.com']
  })),
  ciudades: colombia.flatMap(dep => 
    dep.ciudades.map(ciudad => ({
      id: ciudad.toLowerCase().replace(/\s+/g, '_'),
      nombre: ciudad,
      departamento: dep.departamento,
      codigoPostal: '000000',
      zona: 'Centro',
      clima: 'Templado',
      altitud: '1000 msnm'
    }))
  ),
  tiposEvento: [
    'Incendio', 'Inundación', 'Robo', 'Accidente', 'Daño por agua',
    'Vandalismo', 'Falla eléctrica', 'Desastre natural', 'Otro'
  ],
  intermediarios: [
    'Seguros del Estado', 'Aseguradora de Colombia', 'Corredores Unidos',
    'Intermediarios Profesionales', 'Otro'
  ]
};

export default function FormularioAjuste() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Verificar que TIPOS_FORMULARIOS esté disponible
  console.log('🔍 TIPOS_FORMULARIOS disponibles:', TIPOS_FORMULARIOS);
  console.log('🔍 TIPOS_FORMULARIOS.AJUSTE:', TIPOS_FORMULARIOS?.AJUSTE);
  
  const [formData, setFormData] = useState({
    destinatario: '',
    cargo: '',
    empresa: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    telefono: '',
    email: '',
    fechaSiniestro: '',
    horaSiniestro: '',
    numeroPoliza: '',
    aseguradora: '',
    asegurado: '',
    tipoSiniestro: '',
    descripcionSiniestro: '',
    valorAsegurado: '',
    valorSiniestro: '',
    direccionRiesgo: '',
    coordenadasRiesgo: '',
    fechaInspeccion: '',
    horaInspeccion: '',
    inspector: '',
    conclusiones: '',
    recomendaciones: '',
    anexos: [],
    // Campos de firma
    funcionarioFirma: '',
    cargoFuncionario: '',
    telefonoFuncionario: '',
    emailFuncionario: '',
    // Firma de Iskharly
    firmaIskharly: '',
    // Firma del funcionario (si tiene firma)
    firmaFuncionario: '',
    // Campos para versión preeliminar
    observacionesPreeliminar: '',
    analisisCobertura: '',
    observacionesGenerales: '',
    // Campos para versión de actualización
    fechaActualizacion: '',
    cambiosDesdePreeliminar: '',
    nuevaInformacion: '',
    // Campos para informe final
    fechaInformeFinal: '',
    conclusionesFinales: '',
    recomendacionesFinales: ''
  });

  // Nuevo estado para la información del mapa
  const [mapaInfo, setMapaInfo] = useState({
    imagen: null,
    coordenadas: null,
    direccion: '',
    posicion: null,
    zoom: 15
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [archivoGenerado, setArchivoGenerado] = useState(null);
  
  // Estado para manejar versiones
  const [estadoActual, setEstadoActual] = useState('inicial');
  const [versiones, setVersiones] = useState({
    inicial: null,
    preeliminar: null,
    actualizacion: null,
    informeFinal: null
  });

  // Estado para el modal de selección de versión
  const [mostrarMenuVersiones, setMostrarMenuVersiones] = useState(false);
  
  // Estado para el menú de siguiente formulario
  const [mostrarMenuSiguienteFormulario, setMostrarMenuSiguienteFormulario] = useState(false);

  // Función para mostrar el menú de versiones
  const abrirMenuVersiones = () => {
    setMostrarMenuVersiones(true);
  };

  // Función para cerrar el menú de versiones
  const cerrarMenuVersiones = () => {
    setMostrarMenuVersiones(false);
  };

  // Función para mostrar el menú de siguiente formulario
  const abrirMenuSiguienteFormulario = () => {
    setMostrarMenuSiguienteFormulario(true);
  };

  // Función para cerrar el menú de siguiente formulario
  const cerrarMenuSiguienteFormulario = () => {
    setMostrarMenuSiguienteFormulario(false);
  };

  // Funciones para historial
  const guardarFormulario = async (datos) => {
    try {
      return await historialService.guardarFormulario(datos);
    } catch (error) {
      console.error('Error guardando formulario:', error);
      throw error;
    }
  };

  const obtenerFormulario = async (id) => {
    try {
      console.log('🔍 obtenerFormulario llamado con ID:', id);
      console.log('🔍 Tipo de ID:', typeof id);
      console.log('🔍 ID es string?', typeof id === 'string');
      console.log('🔍 ID es objeto?', typeof id === 'object');
      
      if (typeof id === 'object') {
        console.log('⚠️ ID es un objeto, extrayendo ID:', id.id || id._id || 'ID no encontrado');
        id = id.id || id._id || id;
      }
      
      console.log('🔍 ID final a enviar:', id);
      return await historialService.obtenerFormulario(id);
    } catch (error) {
      console.error('❌ Error obteniendo formulario:', error);
      throw error;
    }
  };

  // Cargar formulario existente si hay ID
  useEffect(() => {
    console.log('🔄 useEffect ejecutado');
    console.log('🔍 ID actual:', id);
    console.log('🔍 ID !== "nuevo"?', id !== 'nuevo');
    
    if (id && id !== 'nuevo') {
      console.log('✅ Condiciones cumplidas, llamando a cargarFormularioExistente');
      cargarFormularioExistente();
    } else {
      console.log('⏭️ No se cargará formulario existente');
    }
  }, [id]);

  // Cerrar menú de versiones cuando se haga clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mostrarMenuVersiones && !event.target.closest('.menu-versiones')) {
        cerrarMenuVersiones();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarMenuVersiones]);

  const cargarFormularioExistente = async () => {
    try {
      console.log('🔄 cargarFormularioExistente iniciado');
      console.log('🔍 ID recibido:', id);
      console.log('🔍 Tipo de ID:', typeof id);
      
      setCargando(true);
      const formulario = await obtenerFormulario(id);
      console.log('✅ Formulario obtenido:', formulario);
      
      if (formulario) {
        setFormData(formulario.datos || {});
        setArchivoGenerado(formulario.archivo);
        
        // Cargar información de la carpeta
        if (formulario.casoId) {
          setFormData(prev => ({
            ...prev,
            casoId: formulario.casoId,
            numeroCaso: formulario.numeroCaso,
            carpetaCaso: formulario.carpetaCaso
          }));
        }
        
        // Cargar estado de versiones
        if (formulario.versiones) {
          setVersiones(formulario.versiones);
        }
        
        // Determinar estado actual
        if (formulario.estadoActual) {
          setEstadoActual(formulario.estadoActual);
        }
        
        console.log('✅ Formulario cargado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error cargando formulario:', error);
      setError('Error al cargar el formulario existente: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar cambios en el mapa
  const handleMapaChange = (nuevaInfoMapa) => {
    setMapaInfo(nuevaInfoMapa);
    
    // También actualizar las coordenadas en el formulario si están disponibles
    if (nuevaInfoMapa.coordenadas) {
      setFormData(prev => ({
        ...prev,
        coordenadasRiesgo: `${nuevaInfoMapa.coordenadas.lat}, ${nuevaInfoMapa.coordenadas.lng}`
      }));
    }
    
    console.log('✅ Información del mapa actualizada:', nuevaInfoMapa);
  };

  // Función para convertir archivo a base64
  const convertirArchivoABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Función para convertir imagen importada a base64
  const convertirImagenImportadaABase64 = async (imagePath) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al convertir imagen importada:', error);
      return null;
    }
  };

  // Función para generar el documento Word
  const generarDocumento = async () => {
    try {
      setCargando(true);
      setError(null);

      console.log('🔍 Iniciando generación de PÁGINA 1 - Solo lo solicitado...');

      // FORMATO DEL DOCUMENTO:
      // - Fuente: Arial en todo el documento
      // - Tamaño: 24 = 12pt (formato estándar de Word)
      // - Alineación: Justificado para texto normal, Centrado para títulos
      // - Color: Negro (000000) por defecto, excepto donde se especifique otro
      // - Espaciado: Consistente entre párrafos para mejor legibilidad
      //
      // COMPORTAMIENTO DEL CONTENIDO:
      // - SOLO se genera texto cuando hay información real en formData
      // - Si no hay información, se muestra mensaje en gris e itálica: "[Campo - No se ha proporcionado información]"
      // - NO se incluye texto hardcodeado o de ejemplo
      // - El documento se genera dinámicamente basado en lo que se haya llenado en la plataforma
      //
      // SECCIONES POR VERSIÓN:
      // - INICIAL: Secciones 1-6 (básicas)
      // - PREELIMINAR: Secciones 1-9 (incluye observaciones, análisis de cobertura, observaciones generales)
      // - ACTUALIZACIÓN: Secciones 1-7 (incluye cambios y nueva información)
      // - INFORME FINAL: Secciones 1-9 (incluye conclusiones y recomendaciones finales)

      // Procesar todas las imágenes a base64 antes de generar el documento
      let imagenesProcesadas = [];
      if (formData.imagenesInspeccion && formData.imagenesInspeccion.length > 0) {
        console.log('🖼️ Procesando imágenes a base64...');
        imagenesProcesadas = await Promise.all(
          formData.imagenesInspeccion.map(async (imagen) => {
            if (imagen.archivo) {
              const base64 = await convertirArchivoABase64(imagen.archivo);
              return { ...imagen, base64 };
            }
            return imagen;
          })
        );
        console.log('✅ Imágenes procesadas:', imagenesProcesadas.length);
      }

      // Convertir la imagen de la firma de Iskharly a base64
      let firmaIskharlyBase64 = null;
      if (!formData.firmaIskharly) {
        console.log('🖼️ Convirtiendo firma de Iskharly por defecto a base64...');
        firmaIskharlyBase64 = await convertirImagenImportadaABase64(firmaIskharly);
        console.log('✅ Firma de Iskharly convertida a base64');
      }

      // Función helper para crear párrafos con formato consistente
      const crearParrafo = (texto, opciones = {}) => {
        return new Paragraph({
          children: [
            new TextRun({
              text: texto,
              font: 'Arial',
              size: opciones.size || 24, // 24 = 12pt en docx
              bold: opciones.bold || false,
              color: opciones.color || '000000', // Negro por defecto
              italics: opciones.italics || false
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: opciones.spacingAfter || 200 }
        });
      };

      // Función helper para crear títulos con formato consistente
      const crearTitulo = (texto, nivel = 1) => {
        const tamanos = { 1: 28, 2: 24, 3: 20, 4: 18, 5: 16 }; // 24 = 12pt, 28 = 14pt
        return new Paragraph({
          children: [
            new TextRun({
              text: texto,
              font: 'Arial',
              size: tamanos[nivel] || 16,
              bold: true,
              color: '000000' // Negro
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        });
      };

      // Función helper para crear texto normal con formato consistente
      const crearTextoNormal = (texto, opciones = {}) => {
        return new Paragraph({
          children: [
            new TextRun({
              text: texto,
              font: 'Arial',
              size: opciones.size || 24, // 24 = 12pt en docx
              bold: opciones.bold || false,
              color: '000000', // Negro
              italics: opciones.italics || false
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: opciones.spacingAfter || 200 }
        });
      };

      // Función helper para crear mensajes de "sin información" de manera consistente
      const crearMensajeSinInformacion = (campo) => {
        return crearTextoNormal(`[${campo} - No se ha proporcionado información]`, { 
          spacingAfter: 200, 
          italics: true,
          color: '666666' // Gris para distinguir del texto normal
        });
      };

      // Función helper para valores de tabla sin información
      const valorTabla = (valor, campo) => {
        return valor || `[${campo} - No especificado]`;
      };

      const doc = new Document({
        sections: [{
          properties: {},
          headers: {
            default: new Header({
              children: [
                // ENCABEZADO ORGANIZADO CON TABLA Y LOGO
                new Table({
                  width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                  },
                  rows: [
                    // Fila 1: Logo y título principal
                    new TableRow({
                      children: [
                        // Columna izquierda: Logo y nombre de la empresa
                        new TableCell({
                          width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                          },
                          children: [
                            crearParrafo("PROSER AJUSTES", { size: 28, bold: true, color: "0066CC" }),
                            crearParrafo("AJUSTADORES DE SEGUROS", { size: 18 }),
                            crearParrafo("La mejor opción para su negocio", { size: 14, italics: true, spacingAfter: 20 })
                          ],
                          margins: { top: 200, bottom: 200, left: 200, right: 200 }
                        }),
                        
                        // Columna derecha: Información del reporte
                        new TableCell({
                          width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                          },
                          children: [
                            crearParrafo("INFORME DE INSPECCION", { size: 24, bold: true, color: "0066CC", spacingAfter: 20 }),
                            crearParrafo(formData.inspector || "INSPECTOR", { size: 18, spacingAfter: 20 }),
                            // Tabla para código, versión y fecha
                            new Table({
                              width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                              },
                              rows: [
                                new TableRow({
                                  children: [
                                    new TableCell({
                                      children: [
                                        crearTextoNormal(`CÓDIGO: ${formData.codigoReporte || 'RIU-ISA-001'}`, { size: 14 })
                                      ],
                                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                                    }),
                                    new TableCell({
                                      children: [
                                        crearTextoNormal(`VERSIÓN: ${formData.versionReporte || '1'}`, { size: 14 })
                                      ],
                                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                                    }),
                                    new TableCell({
                                      children: [
                                        crearTextoNormal(`FECHA: ${new Date().toLocaleDateString('es-ES', { 
                                          day: '2-digit', 
                                          month: '2-digit', 
                                          year: 'numeric' 
                                        })}`, { size: 14 })
                                      ],
                                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                                    })
                                  ]
                                })
                              ]
                            })
                          ],
                          margins: { top: 200, bottom: 200, left: 200, right: 200 }
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          },
          children: [
            // CONTENIDO ESPECÍFICO DE LA PÁGINA 1
            // FECHA Y LUGAR
            crearTextoNormal(`${valorTabla(formData.ciudad, "Ciudad")}, ${valorTabla(formData.departamento, "Departamento")}, ${new Date().toLocaleDateString('es-ES', { 
              month: 'long', 
              year: 'numeric' 
            })}`, { size: 24, spacingAfter: 400 }),

            // Indicador de versión del documento
            crearTextoNormal(`VERSIÓN DEL INFORME: ${estadoActual === 'inicial' ? 'INICIAL' : 
                           estadoActual === 'preeliminar' ? 'PREELIMINAR' : 
                           estadoActual === 'actualizacion' ? 'ACTUALIZACIÓN' : 
                           estadoActual === 'informeFinal' ? 'INFORME FINAL' : estadoActual.toUpperCase()}`, 
                           { bold: true, size: 20, spacingAfter: 200 }),

            // DESTINATARIO
            crearTextoNormal("Señores", { spacingAfter: 100 }),

            crearTextoNormal(valorTabla(formData.aseguradora, "Aseguradora"), { heading: HeadingLevel.HEADING_2, spacingAfter: 100 }),

            crearTextoNormal(`Atn: ${valorTabla(formData.destinatario, "Destinatario")}`, { spacingAfter: 50 }),

            crearTextoNormal(valorTabla(formData.cargo, "Cargo"), { spacingAfter: 100 }),

            crearTextoNormal(`${valorTabla(formData.ciudadDestino, "Ciudad Destino")}, ${valorTabla(formData.paisDestino, "País Destino")}`, { spacingAfter: 200 }),

            // MAPA INMEDIATAMENTE DESPUÉS DEL DESTINATARIO
            crearTextoNormal("UBICACIÓN GEOGRÁFICA DEL SINIESTRO", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

            // Aquí va la imagen del mapa si está disponible
            ...(mapaInfo && mapaInfo.imagen ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: mapaInfo.imagen.replace('data:image/png;base64,', ''),
                    transformation: {
                      width: 400,
                      height: 300
                    }
                  })
                ],
                spacing: { after: 200 }
              })
            ] : [
              crearTextoNormal("[IMAGEN DEL MAPA - Ubicación del siniestro]", { spacingAfter: 200, italics: true })
            ]),

            // SALTO DE PÁGINA
            new Paragraph({
              pageBreakBefore: true,
              spacing: { after: 200 }
            }),

            // PÁGINA 2 - INFORMACIÓN DETALLADA DEL SINIESTRO
            crearTextoNormal("INFORMACIÓN DETALLADA DEL SINIESTRO", { heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),

            // Tabla de información del siniestro
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("REPORTE", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(formData.numeroReporte || "1", { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("POLIZA", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(formData.numeroPoliza || "No especificada", { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("RAMO", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(formData.tipoSiniestro || "HOGAR", { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("REFERENCIA", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(formData.descripcionSiniestro || "SINIESTRO No especificado", { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("FUNCIONARIO QUE ASIGNO", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(formData.inspector || "No especificado", { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("TOMADOR/ASEGURADO", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.asegurado, "Asegurado"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("BENEFICIARIO", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.beneficiario || formData.asegurado, "Beneficiario"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("DIRECCION", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.direccionRiesgo, "Dirección"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("ACTIVIDAD", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.actividad, "Actividad"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("CIUDAD", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(`${valorTabla(formData.ciudad, "Ciudad")} (${valorTabla(formData.departamento, "Departamento")})`, { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("RECLAMO POR", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.tipoSiniestro, "Tipo de Siniestro"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("EVENTO", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.tipoSiniestro, "Evento"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("FECHA DE OCURRENCIA", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.fechaSiniestro, "Fecha de Ocurrencia"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        crearTextoNormal("FECHA DE INSPECCION", { bold: true, size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    }),
                    new TableCell({
                      children: [
                        crearTextoNormal(valorTabla(formData.fechaInspeccion, "Fecha de Inspección"), { size: 12 })
                      ],
                      margins: { top: 100, bottom: 100, left: 100, right: 100 }
                    })
                  ]
                })
              ]
            }),



            // SALTO DE PÁGINA
            new Paragraph({
              pageBreakBefore: true,
              spacing: { after: 200 }
            }),

       

            // 1. ANTECEDENTES
            crearTextoNormal("1. ANTECEDENTES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

            // SOLO generar texto si hay información real
            ...(formData.antecedentes ? [
              crearTextoNormal(formData.antecedentes, { spacingAfter: 200 })
            ] : [
              crearMensajeSinInformacion("Antecedentes")
            ]),

            // 2. DESCRIPCIÓN DEL RIESGO
            crearTextoNormal("2. DESCRIPCIÓN DEL RIESGO", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

            // SOLO generar texto si hay información real
            ...(formData.descripcionRiesgo ? [
              crearTextoNormal(formData.descripcionRiesgo, { spacingAfter: 200 })
            ] : [
              crearMensajeSinInformacion("Descripción del Riesgo")
            ]),

            // 3. CIRCUNSTANCIAS DEL SINIESTRO
            crearTextoNormal("3. CIRCUNSTANCIAS DEL SINIESTRO", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

            // SOLO generar texto si hay información real
            ...(formData.circunstanciaSiniestro ? [
              crearTextoNormal(formData.circunstanciaSiniestro, { spacingAfter: 200 })
            ] : [
              crearMensajeSinInformacion("Circunstancias del Siniestro")
            ]),

            // 4. INSPECCIÓN Y REGISTRO FOTOGRÁFICO
            crearTextoNormal("4. INSPECCIÓN Y REGISTRO FOTOGRÁFICO", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

            // SOLO generar texto si hay información real
            ...(formData.descripcionInspeccion ? [
              crearTextoNormal(formData.descripcionInspeccion, { spacingAfter: 200 })
            ] : [
              crearMensajeSinInformacion("Descripción de la Inspección")
            ]),

            // FOTOS DEL REGISTRO - USAR FOTOS REALES DEL FORMULARIO CON DESCRIPCIONES
            crearTextoNormal("REGISTRO FOTOGRÁFICO", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

            // Aquí irían las fotos del formulario organizadas en columnas horizontales
            ...(imagenesProcesadas && imagenesProcesadas.length > 0 ? [
              // Crear tabla para organizar las fotos en columnas
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  // Fila de títulos de fotos
                  new TableRow({
                    children: imagenesProcesadas.map((imagen, index) => 
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: `FOTO ${index + 1}`,
                            heading: HeadingLevel.HEADING_3,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 100 }
                          })
                        ],
                        margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      })
                    )
                  }),
                  // Fila de descripciones de fotos
                  new TableRow({
                    children: imagenesProcesadas.map((imagen, index) => 
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: imagen.descripcion || "Sin descripción",
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 100 }
                          })
                        ],
                        margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      })
                    )
                  }),
                  // Fila de imágenes reales
                  new TableRow({
                    children: imagenesProcesadas.map((imagen, index) => 
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new ImageRun({
                                data: imagen.base64,
                                transformation: {
                                  width: 200,
                                  height: 150
                                }
                              })
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 100 }
                          })
                        ],
                        margins: { top: 100, bottom: 100, left: 100, right: 100 }
                      })
                    )
                  })
                ]
              })
            ] : [
              crearTextoNormal("[FOTOS DEL REGISTRO - Se agregarán las fotos que se suban al formulario]", { spacingAfter: 200, italics: true })
            ]),

            // SECCIONES ESPECÍFICAS DE LA VERSIÓN PREELIMINAR
            ...(estadoActual === 'preeliminar' ? [
              // 5. OBSERVACIONES PREELIMINARES
              crearTextoNormal("5. OBSERVACIONES PREELIMINARES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // SOLO generar texto si hay información real
              ...(formData.observacionesPreeliminar ? [
                crearTextoNormal(formData.observacionesPreeliminar, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Observaciones Preeliminares")
              ]),

              // 6. ANÁLISIS DE COBERTURA
              crearTextoNormal("6. ANÁLISIS DE COBERTURA", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // SOLO generar texto si hay información real
              ...(formData.analisisCobertura ? [
                crearTextoNormal(formData.analisisCobertura, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Análisis de Cobertura")
              ]),

              // 7. OBSERVACIONES GENERALES
              crearTextoNormal("7. OBSERVACIONES GENERALES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // SOLO generar texto si hay información real
              ...(formData.observacionesGenerales ? [
                crearTextoNormal(formData.observacionesGenerales, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Observaciones Generales")
              ]),

              // 8. CAUSA (renumerada para preeliminar)
              crearTextoNormal("8. CAUSA", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.causa ? [
                crearTextoNormal(formData.causa, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Causa del Siniestro")
              ]),

              // 9. RESERVA SUGERIDA U OBSERVACIONES (renumerada para preeliminar)
              crearTextoNormal("9. RESERVA SUGERIDA U OBSERVACIONES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.reservaSugerida ? [
                crearTextoNormal(formData.reservaSugerida, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Reserva Sugerida")
              ])
            ] : [
              // Para versiones que no son preeliminar, mantener la numeración original
              // 5. CAUSA
              crearTextoNormal("5. CAUSA", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.causa ? [
                crearTextoNormal(formData.causa, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Causa del Siniestro")
              ]),

              // 6. RESERVA SUGERIDA U OBSERVACIONES
              crearTextoNormal("6. RESERVA SUGERIDA U OBSERVACIONES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.reservaSugerida ? [
                crearTextoNormal(formData.reservaSugerida, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Reserva Sugerida")
              ])
            ]),

            // SECCIONES ESPECÍFICAS DE LA VERSIÓN DE ACTUALIZACIÓN
            ...(estadoActual === 'actualizacion' ? [
              // 5. ACTUALIZACIÓN DEL CASO
              crearTextoNormal("5. ACTUALIZACIÓN DEL CASO", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // Fecha de actualización
              crearTextoNormal(`Fecha de Actualización: ${formData.fechaActualizacion || new Date().toISOString().split('T')[0]}`, { spacingAfter: 100 }),
              
              // Cambios desde la versión preeliminar
              crearTextoNormal("Cambios desde la Versión Preeliminar:", { bold: true, spacingAfter: 100 }),
              ...(formData.cambiosDesdePreeliminar ? [
                crearTextoNormal(formData.cambiosDesdePreeliminar, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Cambios desde la Versión Preeliminar")
              ]),

              // Nueva información recopilada
              crearTextoNormal("Nueva Información Recopilada:", { bold: true, spacingAfter: 100 }),
              ...(formData.nuevaInformacion ? [
                crearTextoNormal(formData.nuevaInformacion, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Nueva Información Recopilada")
              ]),

              // 6. CAUSA (renumerada para actualización)
              crearTextoNormal("6. CAUSA", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.causa ? [
                crearTextoNormal(formData.causa, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Causa del Siniestro")
              ]),

              // 7. RESERVA SUGERIDA U OBSERVACIONES (renumerada para actualización)
              crearTextoNormal("7. RESERVA SUGERIDA U OBSERVACIONES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.reservaSugerida ? [
                crearTextoNormal(formData.reservaSugerida, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Reserva Sugerida")
              ])
            ] : []),

            // SECCIONES ESPECÍFICAS DEL INFORME FINAL
            ...(estadoActual === 'informeFinal' ? [
              // 5. INFORME FINAL
              crearTextoNormal("5. INFORME FINAL", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // Fecha del informe final
              crearTextoNormal(`Fecha del Informe Final: ${formData.fechaInformeFinal || new Date().toISOString().split('T')[0]}`, { spacingAfter: 100 }),

              // 6. CONCLUSIONES FINALES
              crearTextoNormal("6. CONCLUSIONES FINALES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // SOLO generar texto si hay información real
              ...(formData.conclusionesFinales ? [
                crearTextoNormal(formData.conclusionesFinales, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Conclusiones Finales")
              ]),

              // 7. RECOMENDACIONES FINALES
              crearTextoNormal("7. RECOMENDACIONES FINALES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),
              
              // SOLO generar texto si hay información real
              ...(formData.recomendacionesFinales ? [
                crearTextoNormal(formData.recomendacionesFinales, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Recomendaciones Finales")
              ]),

              // 8. CAUSA (renumerada para informe final)
              crearTextoNormal("8. CAUSA", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.causa ? [
                crearTextoNormal(formData.causa, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Causa del Siniestro")
              ]),

              // 9. RESERVA SUGERIDA U OBSERVACIONES (renumerada para informe final)
              crearTextoNormal("9. RESERVA SUGERIDA U OBSERVACIONES", { heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }),

              // SOLO generar texto si hay información real
              ...(formData.reservaSugerida ? [
                crearTextoNormal(formData.reservaSugerida, { spacingAfter: 200 })
              ] : [
                crearMensajeSinInformacion("Reserva Sugerida")
              ])
            ] : []),

            // Formato limpio y profesional para las firmas (sin cuadros)
            // Fila 1: Líneas de firma o firmas reales
            new Paragraph({
              children: [
                // Firma del funcionario (si tiene firma) o líneas de guiones
                ...(formData.firmaFuncionario ? [
                  new ImageRun({
                    data: formData.firmaFuncionario.replace('data:image/png;base64,', ''),
                    transformation: {
                      width: 120,
                      height: 60
                    }
                  })
                ] : [
                  new TextRun({
                    text: "________________________",
                    font: 'Arial',
                    size: 24, // 12pt
                    color: '000000'
                  })
                ]),
                new TextRun({
                  text: "                    ",
                  font: 'Arial',
                  size: 24 // 12pt
                }),
                // Firma de Iskharly (si tiene firma personalizada o usar la imagen por defecto)
                ...(formData.firmaIskharly ? [
                  new ImageRun({
                    data: formData.firmaIskharly.replace('data:image/png;base64,', ''),
                    transformation: {
                      width: 120,
                      height: 60
                    }
                  })
                ] : [
                  // Usar la imagen de la firma de Iskharly por defecto convertida a base64
                  new ImageRun({
                    data: firmaIskharlyBase64 ? firmaIskharlyBase64.replace('data:image/png;base64,', '') : '',
                    transformation: {
                      width: 120,
                      height: 60
                    }
                  })
                ])
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),

            // Fila 2: Nombres (subrayados)
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.funcionarioFirma || "NOMBRE DEL FUNCIONARIO",
                  font: 'Arial',
                  size: 24, // 12pt
                  bold: true,
                  underline: {},
                  color: '000000'
                }),
                new TextRun({
                  text: "                    ",
                  font: 'Arial',
                  size: 24 // 12pt
                }),
                new TextRun({
                  text: "ISKHARLY TAPIA GUTIERREZ",
                  font: 'Arial',
                  size: 24, // 12pt
                  bold: true,
                  underline: {},
                  color: '000000'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),

            // Fila 3: Empresa (en rojo)
            new Paragraph({
              children: [
                new TextRun({
                  text: "Proser Ajustes SAS",
                  font: 'Arial',
                  size: 24, // 12pt
                  bold: true,
                  color: "FF0000"
                }),
                new TextRun({
                  text: "                    ",
                  font: 'Arial',
                  size: 24 // 12pt
                }),
                new TextRun({
                  text: "Proser Ajustes SAS",
                  font: 'Arial',
                  size: 24, // 12pt
                  bold: true,
                  color: "FF0000"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),

            // Fila 4: Cargos
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.cargoFuncionario || "Cargo del Funcionario",
                  font: 'Arial',
                  size: 24, // 12pt
                  color: '000000'
                }),
                new TextRun({
                  text: "                    ",
                  font: 'Arial',
                  size: 24 // 12pt
                }),
                new TextRun({
                  text: "Gerente Técnico Comercial",
                  font: 'Arial',
                  size: 24, // 12pt
                  color: '000000'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),

            // Fila 5: Emails (en azul)
            new Paragraph({
              children: [
                new TextRun({
                  text: "E-Mail: ",
                  font: 'Arial',
                  size: 20, // 10pt
                  bold: true,
                  color: '000000'
                }),
                new TextRun({
                  text: formData.emailFuncionario || "email@funcionario.com",
                  font: 'Arial',
                  size: 20, // 10pt
                  color: "0066CC"
                }),
                new TextRun({
                  text: "                    ",
                  font: 'Arial',
                  size: 20 // 10pt
                }),
                new TextRun({
                  text: "E-Mail: ",
                  font: 'Arial',
                  size: 20, // 10pt
                  bold: true,
                  color: '000000'
                }),
                new TextRun({
                  text: "itapia9@proserpuertos.com.co",
                  font: 'Arial',
                  size: 20, // 10pt
                  color: "0066CC"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),

            // Texto de cierre
            crearTextoNormal("De esta manera nos permitimos entregar el presente informe, agradeciendo la confianza depositada en nuestra firma.", { alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 } }),

            crearTextoNormal("Cordialmente,", { alignment: AlignmentType.CENTER, spacing: { after: 200 } })
          ]
        }]
      });

      console.log('✅ PÁGINA 1 - Solo lo solicitado creada, generando archivo...');

      // Generar y descargar el documento
      Packer.toBlob(doc).then(blob => {
        console.log('✅ Blob generado:', { size: blob.size, type: blob.type });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PAGINA_1_${formData.numeroPoliza || 'Sin_Poliza'}_${new Date().toISOString().split('T')[0]}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setCargando(false);
        console.log('✅ PÁGINA 1 - Solo lo solicitado descargada exitosamente');
      }).catch(error => {
        console.error('❌ Error al generar blob:', error);
        setError('Error al generar el archivo: ' + error.message);
        setCargando(false);
      });

    } catch (error) {
      console.error('❌ Error al generar documento:', error);
      setError('Error al generar el documento: ' + error.message);
      setCargando(false);
    }
  };

  // Función para guardar el formulario
  const handleGuardarFormulario = async () => {
    try {
      setCargando(true);
      setError(null);

      // Validar que TIPOS_FORMULARIOS.AJUSTE esté disponible
      if (!TIPOS_FORMULARIOS?.AJUSTE) {
        throw new Error('TIPOS_FORMULARIOS.AJUSTE no está definido');
      }

      // Generar título del formulario basado en el estado actual
      const tituloFormulario = `Informe de Ajuste - ${estadoActual === 'inicial' ? 'Versión Inicial' : 
                               estadoActual === 'preeliminar' ? 'Versión Preeliminar' : 
                               estadoActual === 'actualizacion' ? 'Versión de Actualización' : 
                               estadoActual === 'informeFinal' ? 'Informe Final' : estadoActual}`;

      const datosFormulario = {
        tipo: TIPOS_FORMULARIOS.AJUSTE,
        titulo: tituloFormulario,
        datos: formData,
        archivo: archivoGenerado,
        fechaCreacion: new Date().toISOString(),
        estadoActual: estadoActual,
        versiones: versiones,
        // Campos adicionales para el historial
        numeroCaso: formData.numeroCaso || 'N/A',
        carpetaCaso: formData.carpetaCaso || 'N/A',
        inspector: formData.inspector || 'N/A',
        aseguradora: formData.aseguradora || 'N/A',
        asegurado: formData.asegurado || 'N/A'
      };

      // Validar que los campos requeridos estén presentes
      if (!datosFormulario.tipo) {
        throw new Error('Campo "tipo" es requerido');
      }
      if (!datosFormulario.titulo) {
        throw new Error('Campo "titulo" es requerido');
      }
      if (!datosFormulario.datos) {
        throw new Error('Campo "datos" es requerido');
      }

      console.log('💾 Datos del formulario a guardar:', datosFormulario);
      console.log('✅ Validación de campos requeridos exitosa');

      if (id && id !== 'nuevo') {
        // Actualizar formulario existente
        console.log('🔄 Actualizando formulario existente con ID:', id);
        console.log('📡 Llamando a historialService.actualizarFormulario...');
        await historialService.actualizarFormulario(id, datosFormulario);
        console.log('✅ Formulario actualizado exitosamente');
        alert('✅ Formulario actualizado correctamente en el historial');
      } else {
        // Crear nuevo formulario
        console.log('🆕 Creando nuevo formulario');
        console.log('📡 Llamando a historialService.guardarFormulario...');
        const nuevoId = await guardarFormulario(datosFormulario);
        console.log('✅ Nuevo formulario creado con ID:', nuevoId);
        console.log('🔍 Tipo de nuevoId:', typeof nuevoId);
        console.log('🔍 Valor de nuevoId:', nuevoId);
        
        // Validar que nuevoId sea un string válido
        if (nuevoId && typeof nuevoId === 'string' && nuevoId.trim() !== '') {
          console.log('✅ ID válido, navegando a:', `/ajuste/editar/${nuevoId}`);
          alert('✅ Formulario guardado correctamente en el historial');
          navigate(`/ajuste/editar/${nuevoId}`);
        } else if (nuevoId && typeof nuevoId === 'object' && nuevoId.id) {
          // Si es un objeto con propiedad id
          console.log('✅ ID encontrado en objeto, navegando a:', `/ajuste/editar/${nuevoId.id}`);
          alert('✅ Formulario guardado correctamente en el historial');
          navigate(`/ajuste/editar/${nuevoId.id}`);
        } else {
          console.error('❌ ID inválido recibido:', nuevoId);
          alert('⚠️ Formulario guardado pero ID inválido. Redirigiendo a lista...');
          navigate('/ajuste');
        }
      }

      setCargando(false);
    } catch (error) {
      console.error('❌ Error guardando formulario:', error);
      setError('Error al guardar el formulario: ' + error.message);
      setCargando(false);
    }
  };

  // Función para cambiar versión
  const cambiarVersion = (nuevaVersion) => {
    setEstadoActual(nuevaVersion);
    cerrarMenuVersiones();
  };

  // Función para generar el siguiente formulario en la secuencia
  // FLUJO: Inicial → Preeliminar → Actualización → Informe Final → Nuevo Inicial
  const generarSiguienteFormulario = async () => {
    try {
      setCargando(true);
      setError(null);

      let siguienteEstado = '';
      let mensaje = '';

      // Determinar el siguiente estado en la secuencia
      switch (estadoActual) {
        case 'inicial':
          siguienteEstado = 'preeliminar';
          mensaje = 'Generando formulario PREELIMINAR...';
          break;
        case 'preeliminar':
          siguienteEstado = 'actualizacion';
          mensaje = 'Generando formulario de ACTUALIZACIÓN...';
          break;
        case 'actualizacion':
          siguienteEstado = 'informeFinal';
          mensaje = 'Generando INFORME FINAL...';
          break;
        case 'informeFinal':
          // Si ya es el final, crear uno nuevo
          siguienteEstado = 'inicial';
          mensaje = 'Creando nuevo formulario INICIAL...';
          break;
        default:
          siguienteEstado = 'preeliminar';
          mensaje = 'Generando formulario PREELIMINAR...';
      }

      console.log(`🔄 ${mensaje}`);

      // Guardar el formulario actual antes de cambiar
      if (Object.keys(formData).some(key => formData[key])) {
        await handleGuardarFormulario();
      }

      // Cambiar al siguiente estado
      setEstadoActual(siguienteEstado);

      // Limpiar campos específicos según el nuevo estado
      if (siguienteEstado === 'preeliminar') {
        // Para preeliminar, mantener datos básicos pero limpiar campos específicos
        setFormData(prev => ({
          ...prev,
          observacionesPreeliminar: '',
          analisisCobertura: '',
          observacionesGenerales: ''
        }));
      } else if (siguienteEstado === 'actualizacion') {
        // Para actualización, mantener todo pero agregar campos de actualización
        setFormData(prev => ({
          ...prev,
          fechaActualizacion: new Date().toISOString().split('T')[0],
          cambiosDesdePreeliminar: '',
          nuevaInformacion: ''
        }));
      } else if (siguienteEstado === 'informeFinal') {
        // Para informe final, mantener todo pero agregar campos finales
        setFormData(prev => ({
          ...prev,
          fechaInformeFinal: new Date().toISOString().split('T')[0],
          conclusionesFinales: '',
          recomendacionesFinales: ''
        }));
      } else if (siguienteEstado === 'inicial') {
        // Para nuevo formulario, limpiar todo
        setFormData({
          destinatario: '',
          cargo: '',
          empresa: '',
          direccion: '',
          ciudad: '',
          departamento: '',
          telefono: '',
          email: '',
          fechaSiniestro: '',
          horaSiniestro: '',
          numeroPoliza: '',
          aseguradora: '',
          asegurado: '',
          tipoSiniestro: '',
          descripcionSiniestro: '',
          valorAsegurado: '',
          valorSiniestro: '',
          direccionRiesgo: '',
          coordenadasRiesgo: '',
          fechaInspeccion: '',
          horaInspeccion: '',
          inspector: '',
          conclusiones: '',
          recomendaciones: '',
          anexos: [],
          funcionarioFirma: '',
          cargoFuncionario: '',
          telefonoFuncionario: '',
          emailFuncionario: '',
          firmaIskharly: '',
          firmaFuncionario: '',
          observacionesPreeliminar: '',
          analisisCobertura: '',
          observacionesGenerales: '',
          fechaActualizacion: '',
          cambiosDesdePreeliminar: '',
          nuevaInformacion: '',
          fechaInformeFinal: '',
          conclusionesFinales: '',
          recomendacionesFinales: ''
        });
      }

      // Mostrar mensaje de éxito
      alert(`✅ ${mensaje}\n\nFormulario ${siguienteEstado.toUpperCase()} generado correctamente.`);

      setCargando(false);
    } catch (error) {
      console.error('Error generando siguiente formulario:', error);
      setError('Error al generar el siguiente formulario');
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logo y navegación */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="Logo Grupo Proser" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Grupo Proser</h1>
                <p className="text-sm text-gray-600">Sistema de Formularios de Seguros</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={abrirMenuVersiones}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-2">📋</span>
                Versión: {estadoActual === 'inicial' ? 'Inicial' : 
                         estadoActual === 'preeliminar' ? 'Preeliminar' : 
                         estadoActual === 'actualizacion' ? 'Actualización' : 
                         estadoActual === 'informeFinal' ? 'Informe Final' : estadoActual}
              </button>
              
              <button
                onClick={abrirMenuSiguienteFormulario}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-2">➡️</span>
                Siguiente Paso
              </button>
              
              <button
                onClick={() => navigate('/historial')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📚 Historial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de selección de versión */}
      {mostrarMenuVersiones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 menu-versiones">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Versión</h3>
            <div className="space-y-3">
              <button
                onClick={() => cambiarVersion('inicial')}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  estadoActual === 'inicial' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">📝 Versión Inicial</div>
                <div className="text-sm text-gray-500">Primera versión del informe</div>
              </button>
              
              <button
                onClick={() => cambiarVersion('preeliminar')}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  estadoActual === 'preeliminar' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">🔍 Versión Preeliminar</div>
                <div className="text-sm text-gray-500">Análisis inicial con observaciones</div>
              </button>
              
              <button
                onClick={() => cambiarVersion('actualizacion')}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  estadoActual === 'actualizacion' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">📊 Versión de Actualización</div>
                <div className="text-sm text-gray-500">Información actualizada del caso</div>
              </button>
              
              <button
                onClick={() => cambiarVersion('informeFinal')}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  estadoActual === 'informeFinal' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">✅ Informe Final</div>
                <div className="text-sm text-gray-500">Versión definitiva del informe</div>
              </button>
            </div>
            
            <button
              onClick={cerrarMenuVersiones}
              className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de siguiente formulario */}
      {mostrarMenuSiguienteFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Siguiente Formulario</h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona el siguiente paso en la secuencia del caso:
            </p>
            
            <div className="space-y-3">
              {/* Solo mostrar opciones disponibles según el estado actual */}
              {estadoActual === 'inicial' && (
                <button
                  onClick={() => {
                    cambiarVersion('preeliminar');
                    cerrarMenuSiguienteFormulario();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-green-300 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="font-medium text-green-800">🔍 Generar Preeliminar</div>
                  <div className="text-sm text-green-600">Crear versión preeliminar con observaciones</div>
                </button>
              )}
              
              {estadoActual === 'preeliminar' && (
                <button
                  onClick={() => {
                    cambiarVersion('actualizacion');
                    cerrarMenuSiguienteFormulario();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <div className="font-medium text-yellow-800">📊 Generar Actualización</div>
                  <div className="text-sm text-yellow-600">Crear versión de actualización del caso</div>
                </button>
              )}
              
              {estadoActual === 'actualizacion' && (
                <button
                  onClick={() => {
                    cambiarVersion('informeFinal');
                    cerrarMenuSiguienteFormulario();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="font-medium text-purple-800">✅ Generar Informe Final</div>
                  <div className="text-sm text-purple-600">Crear versión final del informe</div>
                </button>
              )}
              
              {estadoActual === 'informeFinal' && (
                <button
                  onClick={() => {
                    cambiarVersion('inicial');
                    cerrarMenuSiguienteFormulario();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium text-blue-800">🆕 Nuevo Caso</div>
                  <div className="text-sm text-blue-600">Crear un nuevo formulario inicial</div>
                </button>
              )}
              
              {/* Opción para ver historial de versiones */}
              <button
                onClick={() => {
                  cerrarMenuSiguienteFormulario();
                  abrirMenuVersiones();
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-800">📋 Ver Todas las Versiones</div>
                <div className="text-sm text-gray-600">Cambiar a cualquier versión disponible</div>
              </button>
            </div>
            
            <button
              onClick={cerrarMenuSiguienteFormulario}
              className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chatbot IA */}
        <div className="mb-8">
          <ChatbotIA 
            formData={formData} 
            onInputChange={handleInputChange}
          />
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Datos Generales del Siniestro */}
          <DatosGeneralesAjuste 
            formData={formData} 
            onInputChange={handleInputChange}
            datosMaestros={DATOS_MAESTROS}
          />

          {/* Mapa de Ubicación del Siniestro */}
          <MapaUbicacionAjuste 
            formData={formData} 
            onInputChange={handleInputChange} 
            onMapaChange={handleMapaChange}
          />

          {/* Antecedentes del Siniestro */}
          <AntecedentesAjuste 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <DescripcionRiesgoAjuste 
            formData={formData} 
            onInputChange={handleInputChange}
          />

          <CircunstanciaSiniestroAjuste 
            formData={formData} 
            onInputChange={handleInputChange}
          />

          <InspeccionFotograficaAjuste 
            formData={formData} 
            onInputChange={handleInputChange}
          />

          <CausaAjuste 
            formData={formData} 
            onInputChange={handleInputChange}
          />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <ReservaSugeridaAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>

          {/* Campo de observaciones preeliminares - solo visible en versión preeliminar */}
          {estadoActual === 'preeliminar' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ObservacionesPreeliminar 
                formData={formData} 
                onInputChange={handleInputChange}
              />
            </div>
          )}

          {/* Análisis de Cobertura - solo visible en versión preeliminar */}
          {estadoActual === 'preeliminar' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AnalisisCoberturaAjuste 
                formData={formData} 
                onInputChange={handleInputChange}
              />
            </div>
          )}

          {/* Observaciones Generales - solo visible en versión preeliminar */}
          {estadoActual === 'preeliminar' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ObservacionesGeneralesAjuste 
                formData={formData} 
                onInputChange={handleInputChange}
              />
            </div>
          )}

          {/* Campos de Actualización - solo visible en versión actualización */}
          {estadoActual === 'actualizacion' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📊</span>
                  Actualización del Caso
                </h3>
                <p className="text-gray-600 mt-2">Información actualizada y cambios desde la versión preeliminar</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Actualización
                  </label>
                  <input
                    type="date"
                    value={formData.fechaActualizacion || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('fechaActualizacion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspector Responsable
                  </label>
                  <input
                    type="text"
                    value={formData.inspector || ''}
                    onChange={(e) => handleInputChange('inspector', e.target.value)}
                    placeholder="Nombre del inspector"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambios desde la Versión Preeliminar
                </label>
                <textarea
                  value={formData.cambiosDesdePreeliminar || ''}
                  onChange={(e) => handleInputChange('cambiosDesdePreeliminar', e.target.value)}
                  placeholder="Describe los cambios principales desde la versión preeliminar..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Información Recopilada
                </label>
                <textarea
                  value={formData.nuevaInformacion || ''}
                  onChange={(e) => handleInputChange('nuevaInformacion', e.target.value)}
                  placeholder="Describe la nueva información obtenida..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Campos de Informe Final - solo visible en versión informe final */}
          {estadoActual === 'informeFinal' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">✅</span>
                  Informe Final
                </h3>
                <p className="text-gray-600 mt-2">Conclusiones definitivas y recomendaciones finales del caso</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Informe Final
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInformeFinal || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('fechaInformeFinal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspector Responsable
                  </label>
                  <input
                    type="text"
                    value={formData.inspector || ''}
                    onChange={(e) => handleInputChange('inspector', e.target.value)}
                    placeholder="Nombre del inspector"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conclusiones Finales
                </label>
                <textarea
                  value={formData.conclusionesFinales || ''}
                  onChange={(e) => handleInputChange('conclusionesFinales', e.target.value)}
                  placeholder="Conclusiones definitivas del caso..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recomendaciones Finales
                </label>
                <textarea
                  value={formData.recomendacionesFinales || ''}
                  onChange={(e) => handleInputChange('recomendacionesFinales', e.target.value)}
                  placeholder="Recomendaciones definitivas para el caso..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FirmaAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Botones de acción simplificados - 4 botones principales */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gestión del Formulario
            </h3>
            <p className="text-sm text-gray-600">
              Estado actual: <span className="font-bold">
                {estadoActual === 'inicial' ? 'Inicial' : 
                 estadoActual === 'preeliminar' ? 'Preeliminar' : 
                 estadoActual === 'actualizacion' ? 'Actualización' : 
                 estadoActual === 'informeFinal' ? 'Informe Final' : estadoActual}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              El botón "Siguiente Formulario" genera automáticamente el siguiente paso en la secuencia
            </p>
            
            {/* Indicador de progreso en la secuencia */}
            <div className="mt-3 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${estadoActual === 'inicial' ? 'bg-blue-500' : 'bg-gray-300'}`} title="Inicial"></div>
                <div className="text-gray-400">→</div>
                <div className={`w-3 h-3 rounded-full ${estadoActual === 'preeliminar' ? 'bg-green-500' : 'bg-gray-300'}`} title="Preeliminar"></div>
                <div className="text-gray-400">→</div>
                <div className={`w-3 h-3 rounded-full ${estadoActual === 'actualizacion' ? 'bg-yellow-500' : 'bg-gray-300'}`} title="Actualización"></div>
                <div className="text-gray-400">→</div>
                <div className={`w-3 h-3 rounded-full ${estadoActual === 'informeFinal' ? 'bg-purple-500' : 'bg-gray-300'}`} title="Informe Final"></div>
              </div>
            </div>
            
            {/* Información sobre el estado actual */}
            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 text-center">
                {estadoActual === 'inicial' && '📝 Formulario básico - Datos generales del siniestro'}
                {estadoActual === 'preeliminar' && '🔍 Versión preeliminar - Incluye observaciones y análisis de cobertura'}
                {estadoActual === 'actualizacion' && '📊 Versión de actualización - Incluye cambios y nueva información'}
                {estadoActual === 'informeFinal' && '✅ Informe final - Conclusiones y recomendaciones definitivas'}
              </p>
            </div>
            
            {/* Información sobre el Word generado */}
            <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-800 text-center">
                {estadoActual === 'inicial' && '📄 Word incluirá: Secciones 1-6 (datos básicos, antecedentes, descripción, circunstancias, inspección, causa, reserva)'}
                {estadoActual === 'preeliminar' && '📄 Word incluirá: Secciones 1-9 (todas las anteriores + observaciones preeliminares, análisis de cobertura, observaciones generales)'}
                {estadoActual === 'actualizacion' && '📄 Word incluirá: Secciones 1-7 (datos básicos + actualización del caso con cambios y nueva información)'}
                {estadoActual === 'informeFinal' && '📄 Word incluirá: Secciones 1-9 (datos básicos + conclusiones finales y recomendaciones definitivas)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={generarDocumento}
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
            >
              <span className="mr-2">📄</span>
              {cargando ? 'Generando...' : 'Generar Word'}
            </button>

            <button
              onClick={handleGuardarFormulario}
              disabled={cargando}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
            >
              <span className="mr-2">💾</span>
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>

            <button
              onClick={() => {
                console.log('🧪 Probando guardado...');
                console.log('🔍 TIPOS_FORMULARIOS:', TIPOS_FORMULARIOS);
                console.log('🔍 formData:', formData);
                console.log('🔍 estadoActual:', estadoActual);
                console.log('🔍 historialService:', historialService);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <span className="mr-2">🧪</span>
              Probar Guardado
            </button>

            <button
              onClick={() => navigate('/historial')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <span className="mr-2">📚</span>
              Historial
            </button>

            <button
              onClick={abrirMenuSiguienteFormulario}
              disabled={cargando}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
            >
              <span className="mr-2">➡️</span>
              Siguiente Paso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}