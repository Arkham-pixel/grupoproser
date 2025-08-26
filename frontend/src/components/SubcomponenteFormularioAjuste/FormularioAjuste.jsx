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
import ChatbotIA from "./ChatbotIA";

import Logo from '../../img/Logo.png';

import historialService, { TIPOS_FORMULARIOS } from '../../services/historialService.js';
import { aseguradorasConFuncionarios } from '../../data/aseguradorasFuncionarios.js';
import colombia from '../../data/colombia.json';
import API_CONFIG from '../../config/apiConfig.js';

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
  const [formData, setFormData] = useState({
    // Información básica
    reporteNo: '',
    refInterna: '',
    siniestroNo: '',
    funcionarioAsigna: '',
    intermediario: '',
    polizaNo: '',
    vigencia: '',
    tomador: '',
    asegurado: '',
    beneficiario: '',
    direccionRiesgo: '',
    ubicacionRiesgo: '',
    tipoEvento: '',
    fechaOcurrencia: '',
    fechaAsignacion: '',
    fechaVisita: '',
    
         // Secciones del reporte
     antecedentes: '',
     descripcionRiesgo: '',
     circunstanciaSiniestro: '',
     inspeccionFotografica: '',
     causa: '',
     reservaSugerida: '',
     observacionesPreeliminar: '',
    

    
    // Información del destinatario
    destinatario: '',
    cargo: '',
    compania: '',
    ciudad: '',
    aseguradora: '',
    
    // Fecha del documento
    fechaDocumento: new Date().toLocaleDateString('es-CO'),
    
    // Información de carpeta (se llena automáticamente)
    casoId: '',
    numeroCaso: '',
    carpetaCaso: ''
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

  // Estado para el modal de navegación


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
      return await historialService.obtenerFormulario(id);
    } catch (error) {
      console.error('Error obteniendo formulario:', error);
      throw error;
    }
  };

  // Cargar formulario existente si hay ID
  useEffect(() => {
    if (id && id !== 'nuevo') {
      cargarFormularioExistente();
    }
  }, [id]);

  const cargarFormularioExistente = async () => {
    try {
      setCargando(true);
      const formulario = await obtenerFormulario(id);
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
      }
    } catch (error) {
      console.error('Error cargando formulario:', error);
      setError('Error al cargar el formulario existente');
    } finally {
      setCargando(false);
    }
  };

     // Función para cargar formularios de la misma carpeta
   const cargarFormulariosDeCarpeta = async (casoId) => {
     try {
       setCargando(true);
       setError(null);
       
       // URL simple para testing
       const url = `http://localhost:3000/api/historial-formularios/carpeta/${casoId}`;
       
       console.log('🔍 Intentando cargar carpeta:', { url, casoId });
       
       // Obtener formularios de la carpeta
       const response = await fetch(url, {
         headers: {
           'Authorization': `Bearer ${localStorage.getItem('token')}`,
           'Content-Type': 'application/json'
         }
       });
      
             console.log('📡 Response recibida:', {
         status: response.status,
         statusText: response.statusText,
         url: response.url,
         headers: Object.fromEntries(response.headers.entries())
       });
       
       if (!response.ok) {
         const errorText = await response.text();
         console.error('❌ Error response:', {
           status: response.status,
           statusText: response.statusText,
           url: response.url,
           body: errorText.substring(0, 200) // Solo primeros 200 caracteres
         });
         
         if (response.status === 404) {
           throw new Error('Carpeta no encontrada');
         } else if (response.status === 401) {
           throw new Error('Sesión expirada');
         } else {
           throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
         }
       }
       
       const data = await response.json();
      
             if (data.success && data.formularios && data.formularios.length > 0) {
         // Usar el primer formulario como base
         const formularioBase = data.formularios[0];
         setFormData(prev => ({
           ...prev,
           ...formularioBase.datos,
           casoId: formularioBase.casoId,
           numeroCaso: formularioBase.numeroCaso,
           carpetaCaso: formularioBase.carpetaCaso
         }));
         
         // Cargar versiones existentes
         const versionesExistentes = {};
         data.formularios.forEach(form => {
           if (form.tipo && form.tipo.startsWith('ajuste_')) {
             const version = form.tipo.replace('ajuste_', '');
             versionesExistentes[version] = form;
           }
         });
         setVersiones(versionesExistentes);
         
         // Determinar estado actual
         const ultimaVersion = data.formularios[0];
         if (ultimaVersion.tipo && ultimaVersion.tipo.startsWith('ajuste_')) {
           setEstadoActual(ultimaVersion.tipo.replace('ajuste_', ''));
         }
         
         alert(`📁 Cargada carpeta: ${data.carpeta?.carpetaCaso || 'N/A'}\nTotal de formularios: ${data.carpeta?.totalFormularios || data.formularios.length}`);
       } else {
         // Si no hay formularios, crear uno nuevo con el casoId
         setFormData(prev => ({
           ...prev,
           casoId: casoId,
           numeroCaso: `RPT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
           carpetaCaso: `Caso_${casoId}_${new Date().toISOString().split('T')[0]}`
         }));
         
         alert(`📁 Nueva carpeta creada para el caso: ${casoId}`);
       }
      
         } catch (error) {
       console.error('Error cargando formularios de la carpeta:', error);
       
       if (error.message === 'Carpeta no encontrada') {
         // Si la carpeta no existe, crear una nueva
         setFormData(prev => ({
           ...prev,
           casoId: casoId,
           numeroCaso: `RPT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
           carpetaCaso: `Caso_${casoId}_${new Date().toISOString().split('T')[0]}`
         }));
         
         alert(`📁 Nueva carpeta creada para el caso: ${casoId}`);
         setError(null);
       } else {
         setError(`Error al cargar formularios de la carpeta: ${error.message}`);
       }
     } finally {
       setCargando(false);
     }
    };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

    // Función para crear una nueva versión
      const crearNuevaVersion = async (tipoVersion) => {
      try {
        setCargando(true);
        setError(null);
        
        // Crear nueva versión basada en la actual
        const nuevaVersion = {
          ...formData,
          tipoVersion,
          fechaCreacion: new Date().toISOString(),
          versionAnterior: estadoActual
        };

        // Obtener información del usuario actual
        const usuarioActual = JSON.parse(localStorage.getItem('user')) || {};
        
        // Si ya existe un casoId, usarlo para mantener la misma carpeta
        const datosParaGuardar = {
          tipo: `ajuste_${tipoVersion}`,
          titulo: `Informe de Inspección - ${tipoVersion.toUpperCase()} - ${formData.reporteNo || 'Nuevo'}`,
          datos: nuevaVersion,
          archivo: null,
          metadata: {
            usuario: usuarioActual.id || 'unknown',
            nombreUsuario: usuarioActual.nombre || usuarioActual.email || 'Usuario'
          }
        };

        // Si ya existe un casoId, mantenerlo para la misma carpeta
        if (formData.casoId) {
          datosParaGuardar.casoId = formData.casoId;
          datosParaGuardar.numeroCaso = formData.numeroCaso;
          datosParaGuardar.carpetaCaso = formData.carpetaCaso;
        }
        
        // Guardar la nueva versión
        const formularioGuardado = await guardarFormulario(datosParaGuardar);

        // Actualizar estado local con la información de la carpeta
        setFormData(prev => ({
          ...prev,
          casoId: formularioGuardado.casoId || prev.casoId,
          numeroCaso: formularioGuardado.numeroCaso || prev.numeroCaso,
          carpetaCaso: formularioGuardado.carpetaCaso || prev.carpetaCaso
        }));

        // Actualizar estado
        setVersiones(prev => ({
          ...prev,
          [tipoVersion]: formularioGuardado
        }));
        setEstadoActual(tipoVersion);

        alert(`✅ Versión ${tipoVersion} creada exitosamente en la carpeta: ${formularioGuardado.carpetaCaso}`);
        
      } catch (error) {
        console.error('Error creando versión:', error);
        setError(`Error al crear la versión ${tipoVersion}: ${error.message}`);
      } finally {
        setCargando(false);
      }
    };

  // Función para exportar versión individual
  const exportarVersionIndividual = async (tipoVersion) => {
    try {
      setCargando(true);
      
      // Determinar qué datos usar según la versión
      let datosAExportar = formData;
      
      if (versiones[tipoVersion]) {
        datosAExportar = versiones[tipoVersion].datos;
      }
      
      // Generar documento de la versión específica
      await generarDocumento(datosAExportar, tipoVersion);
      
    } catch (error) {
      console.error('Error exportando versión individual:', error);
      setError('Error al exportar la versión individual');
    } finally {
      setCargando(false);
    }
  };

  // Función para exportar versión unificada
  const exportarVersionUnificada = async () => {
    try {
      setCargando(true);
      
      // Combinar todas las versiones disponibles
      const datosUnificados = {
        ...formData,
        versiones: versiones
      };
      
      // Generar documento unificado
      await generarDocumento(datosUnificados, 'unificado');
      
    } catch (error) {
      console.error('Error exportando versión unificada:', error);
      setError('Error al exportar la versión unificada');
    } finally {
      setCargando(false);
    }
  };

  const generarDocumento = async (datos = formData, tipoVersion = 'inicial') => {
    try {
      setCargando(true);
      setError(null);

      // Crear documento Word
      const doc = new Document({
        sections: [
          {
            properties: {},
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "GRUPO PROSER AJUSTES",
                        bold: true,
                        size: 24
                      })
                    ],
                    alignment: AlignmentType.CENTER
                  })
                ]
              })
            },
            children: [
              // Título principal
              new Paragraph({
                children: [
                  new TextRun({
                    text: "INFORME INSPECCIÓN DE SINIESTRO",
                    bold: true,
                    size: 28
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
              }),

              // Información de contacto
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BOGOTÁ: Calle 123 #45-67 | PBX: (+57 1) 2345678 | Cel: 3001234567",
                    size: 20
                  })
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BARRANQUILLA: Carrera 78 #90-12 | PBX: (+57 5) 3857793 | Cel: 3166337503",
                    size: 20
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
              }),

              // Fecha y ciudad
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${datos.ciudad || 'Ciudad'}, ${datos.fechaDocumento}`,
                    size: 20
                  })
                ],
                spacing: { after: 200 }
              }),

              // Información del destinatario
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Señor(a):",
                    bold: true,
                    size: 20
                  })
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Atn: ${datos.destinatario || '________________'}`,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Cargo: ${datos.cargo || '________________'}`,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Compañía: ${datos.compania || '________________'}`,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Ciudad: ${datos.ciudad || '________________'}`,
                    size: 20
                  })
                ],
                spacing: { after: 400 }
              }),

              // Campos del formulario
              new Paragraph({
                children: [
                  new TextRun({
                    text: "INFORME DE INSPECCIÓN DE SINIESTRO",
                    bold: true,
                    size: 24,
                    color: "0066CC"
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 }
              }),

              // Tabla de campos
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "REPORTE No:", bold: true })] })],
                        width: { size: 30, type: WidthType.PERCENTAGE }
                      }),
                                             new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.reporteNo || "________________" })] })],
                         width: { size: 70, type: WidthType.PERCENTAGE }
                       })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "REF. INTERNA:", bold: true })] })],
                      }),
                                             new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.refInterna || "________________" })] })],
                       })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "SINIESTRO No:", bold: true })] })],
                      }),
                                             new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.siniestroNo || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "FUNCIONARIO QUE ASIGNA:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.funcionarioAsigna || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "INTERMEDIARIO:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.intermediario || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "POLIZA No:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.polizaNo || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "VIGENCIA:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.vigencia || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "TOMADOR:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.tomador || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "ASEGURADO:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.asegurado || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "BENEFICIARIO:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.beneficiario || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "ASEGURADORA:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.aseguradora || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "DIRECCION RIESGO ASEGURADO:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.direccionRiesgo || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "UBICACIÓN RIESGO AFECTADO:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.ubicacionRiesgo || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "TIPO DE EVENTO:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.tipoEvento || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "FECHA DE OCURRENCIA:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.fechaOcurrencia || "________________" })] })],
                       })
                     ]
                   }),
                   new TableRow({
                     children: [
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "FECHA DE ASIGNACION:", bold: true })] })],
                       }),
                       new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: datos.fechaAsignacion || "________________" })] })],
                       })
                     ]
                   })
                ]
              }),

              // Segunda página
              new Paragraph({
                children: [
                  new TextRun({
                    text: "FECHA DE VISITA:",
                    bold: true,
                    size: 20
                  }),
                  new TextRun({
                    text: ` ${datos.fechaVisita || "________________"}`,
                    size: 20
                  })
                ],
                spacing: { after: 200 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "RESERVA SUGERIDA:",
                    bold: true,
                    size: 20
                  }),
                  new TextRun({
                    text: ` ${datos.reservaSugerida || "________________"}`,
                    size: 20
                  })
                ],
                spacing: { after: 400 }
              }),

              // Secciones numeradas
              new Paragraph({
                children: [
                  new TextRun({
                    text: "1. ANTECEDENTES",
                    bold: true,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: datos.antecedentes || "Descripción de los antecedentes del siniestro...",
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "2. DESCRIPCION DEL RIESGO",
                    bold: true,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: datos.descripcionRiesgo || "Descripción detallada del riesgo asegurado...",
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "3. CIRCUNSTANCIA DEL SINIESTRO",
                    bold: true,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: datos.circunstanciaSiniestro || "Descripción de las circunstancias del siniestro...",
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "4. INSPECCION (REGISTRO FOTOGRÁFICO INSPECCIÓN)",
                    bold: true,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: datos.inspeccionFotografica || "Descripción de la inspección realizada y registro fotográfico...",
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "5. CAUSA",
                    bold: true,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: datos.causa || "Determinación de la causa del siniestro...",
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "6. RESERVA SUGERIDA U OBSERVACION",
                    bold: true,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              }),
                             new Paragraph({
                 children: [
                   new TextRun({
                     text: datos.reservaSugerida || "Reserva sugerida y observaciones adicionales...",
                     size: 20
                   })
                 ],
                 spacing: { after: 300 }
               }),

               // 7. OBSERVACIONES PREELIMINARES (solo si es versión preeliminar)
               ...(tipoVersion === 'preeliminar' && datos.observacionesPreeliminar ? [
                 new Paragraph({
                   children: [
                     new TextRun({
                       text: "7. OBSERVACIONES PREELIMINARES",
                       bold: true,
                       size: 22
                     })
                   ],
                   spacing: { after: 200 }
                 }),
                 new Paragraph({
                   children: [
                     new TextRun({
                       text: datos.observacionesPreeliminar,
                       size: 20
                     })
                   ],
                   spacing: { after: 300 }
                 })
               ] : []),



              // Texto de cierre
              new Paragraph({
                children: [
                  new TextRun({
                    text: "De esta manera nos permitimos entregar el presente informe, agradeciendo la confianza depositada en nuestra firma.",
                    size: 20
                  })
                ],
                spacing: { after: 400 }
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Cordialmente,",
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              }),

              // Firmas
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Nombre del funcionario",
                                bold: true,
                                size: 18
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Ing. de Siniestros",
                                size: 16
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "PROSER AJUSTES SAS",
                                bold: true,
                                size: 16
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "PBX: (+57 5) 3857793 - +57 3166337503",
                                size: 14
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "E-mail: correo@proserajustes.com.co",
                                size: 14
                              })
                            ]
                          })
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE }
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Iskharly José Tapia Gutiérrez",
                                bold: true,
                                size: 18
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Gerente Técnico",
                                size: 16
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "PROSER AJUSTES SAS",
                                bold: true,
                                size: 16
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "PBX: (+57 5) 3857793 - +57 3166337503",
                                size: 14
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "E-mail: itapia@proserpuertos.com.co",
                                size: 14
                              })
                            ]
                          })
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE }
                      })
                    ]
                  })
                ]
              })
            ]
          }
        ]
      });

             // Generar archivo para navegador
       const blob = await Packer.toBlob(doc);
      
      // Nombre del archivo
      const nombreArchivo = `Informe_Inspeccion_Siniestro_${datos.reporteNo || 'Nuevo'}_${tipoVersion.toUpperCase()}_${new Date().toISOString().split('T')[0]}.docx`;
      
      // Guardar archivo
      saveAs(blob, nombreArchivo);
      
      // Actualizar estado
      setArchivoGenerado({
        nombre: nombreArchivo,
        tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        tamaño: blob.size
      });

      // Guardar en historial
      await guardarFormulario({
        tipo: 'ajuste',
        titulo: `Informe de Inspección - ${datos.reporteNo || 'Nuevo'}`,
        datos: datos,
        archivo: {
          nombre: nombreArchivo,
          tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          tamaño: blob.size
        }
      });

      alert('✅ Documento generado y guardado exitosamente');

    } catch (error) {
      console.error('Error generando documento:', error);
      setError('Error al generar el documento');
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarFormulario = async () => {
    try {
      setCargando(true);
      setError(null);

      const formularioGuardado = await guardarFormulario({
        tipo: 'ajuste',
        titulo: `Informe de Inspección - ${formData.reporteNo || 'Nuevo'}`,
        datos: formData,
        archivo: archivoGenerado
      });

      alert('✅ Formulario guardado exitosamente');
      navigate('/historial');

    } catch (error) {
      console.error('Error guardando formulario:', error);
      setError('Error al guardar el formulario');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Generando documento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Encabezado */}
         <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center space-x-4">
               <img src={Logo} alt="Logo" className="h-16 w-auto" />
               <div>
                 <h1 className="text-3xl font-bold text-gray-900">INFORME INSPECCIÓN DE SINIESTRO</h1>
                 <p className="text-lg text-gray-600">GRUPO PROSER AJUSTES</p>
                 
                                   {/* Información de carpeta */}
                  {formData.carpetaCaso && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📁</span>
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Carpeta: {formData.carpetaCaso}
                          </p>
                          <p className="text-xs text-blue-600">
                            Caso ID: {formData.casoId} | Número: {formData.numeroCaso}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Botón para cargar formularios de carpeta si hay casoId en URL */}
                  {!formData.carpetaCaso && (() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const casoId = urlParams.get('casoId');
                    return casoId ? (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-600">📁</span>
                            <span className="text-sm text-yellow-800">
                              Caso ID detectado: {casoId}
                            </span>
                          </div>
                          <button
                            onClick={() => cargarFormulariosDeCarpeta(casoId)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Cargar Carpeta
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })()}
               </div>
             </div>
             <div className="text-right">
               <p className="text-sm text-gray-500">BOGOTÁ: Calle 123 #45-67</p>
               <p className="text-sm text-gray-500">PBX: (+57 1) 2345678 | Cel: 3001234567</p>
               <p className="text-sm text-gray-500">BARRANQUILLA: Carrera 78 #90-12</p>
               <p className="text-sm text-gray-500">PBX: (+57 5) 3857793 | Cel: 3166337503</p>
             </div>
           </div>
         </div>



        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <DatosGeneralesAjuste 
            formData={formData} 
            onInputChange={handleInputChange}
            datosMaestros={DATOS_MAESTROS}
          />
        </div>

        {/* Secciones del reporte */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AntecedentesAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <DescripcionRiesgoAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <CircunstanciaSiniestroAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <InspeccionFotograficaAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <CausaAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Guardar en el historial */}
            <button
              onClick={handleGuardarFormulario}
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : '💾 Guardar en Historial'}
            </button>

            {/* 2. Exportar individual */}
            <button
              onClick={() => exportarVersionIndividual(estadoActual)}
              disabled={cargando}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {cargando ? 'Exportando...' : '📄 Exportar Individual'}
            </button>

            {/* 3. Exportar unificado */}
            <button
              onClick={exportarVersionUnificada}
              disabled={cargando}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {cargando ? 'Exportando...' : '📚 Exportar Unificado'}
            </button>

                         {/* 4. Generar siguiente reporte */}
             <button
               onClick={() => {
                 if (estadoActual === 'inicial') {
                   crearNuevaVersion('preeliminar');
                 } else if (estadoActual === 'preeliminar') {
                   crearNuevaVersion('actualizacion');
                 } else if (estadoActual === 'actualizacion') {
                   crearNuevaVersion('informeFinal');
                 }
               }}
               disabled={cargando || estadoActual === 'informeFinal'}
               className={`${
                 estadoActual === 'inicial' ? 'bg-orange-600 hover:bg-orange-700' :
                 estadoActual === 'preeliminar' ? 'bg-yellow-600 hover:bg-yellow-700' :
                 estadoActual === 'actualizacion' ? 'bg-red-600 hover:bg-red-700' :
                 'bg-gray-400 cursor-not-allowed'
               } text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50`}
             >
               {cargando ? 'Creando...' : 
                estadoActual === 'inicial' ? '🚀 Generar Preeliminar' :
                estadoActual === 'preeliminar' ? '📝 Generar Actualización' :
                estadoActual === 'actualizacion' ? '🏁 Generar Informe Final' :
                '✅ Formulario Completo'}
             </button>
          </div>



          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Todos los documentos se guardan automáticamente en el historial
            </p>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Chatbot IA - Disponible en todas las versiones */}
        <ChatbotIA 
          formData={formData} 
          onInputChange={handleInputChange}
        />


      </div>
    </div>
  );
}
