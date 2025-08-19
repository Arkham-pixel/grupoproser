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
import ChatbotIA from "./ChatbotIA";
import Logo from '../../img/Logo.png';
import BotonesHistorial from '../BotonesHistorial.jsx';
import { useHistorialFormulario } from '../../hooks/useHistorialFormulario.js';
import historialService, { TIPOS_FORMULARIOS } from '../../services/historialService.js';
import { aseguradorasConFuncionarios } from '../../data/aseguradorasFuncionarios.js';
import colombia from '../../data/colombia.json';

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
    
    // Información del destinatario
    destinatario: '',
    cargo: '',
    compania: '',
    ciudad: '',
    aseguradora: '',
    
    // Fecha del documento
    fechaDocumento: new Date().toLocaleDateString('es-CO')
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [archivoGenerado, setArchivoGenerado] = useState(null);

  // Hook para historial
  const { guardarFormulario, obtenerFormulario } = useHistorialFormulario();

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
      }
    } catch (error) {
      console.error('Error cargando formulario:', error);
      setError('Error al cargar el formulario existente');
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

  const generarDocumento = async () => {
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
                    text: `${formData.ciudad || 'Ciudad'}, ${formData.fechaDocumento}`,
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
                    text: `Atn: ${formData.destinatario || '________________'}`,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Cargo: ${formData.cargo || '________________'}`,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Compañía: ${formData.compania || '________________'}`,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Ciudad: ${formData.ciudad || '________________'}`,
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
                        children: [new Paragraph({ children: [new TextRun({ text: formData.reporteNo || "________________" })] })],
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
                        children: [new Paragraph({ children: [new TextRun({ text: formData.refInterna || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "SINIESTRO No:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.siniestroNo || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "FUNCIONARIO QUE ASIGNA:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.funcionarioAsigna || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "INTERMEDIARIO:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.intermediario || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "POLIZA No:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.polizaNo || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "VIGENCIA:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.vigencia || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "TOMADOR:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.tomador || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "ASEGURADO:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.asegurado || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "BENEFICIARIO:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.beneficiario || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "ASEGURADORA:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.aseguradora || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "DIRECCION RIESGO ASEGURADO:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.direccionRiesgo || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "UBICACIÓN RIESGO AFECTADO:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.ubicacionRiesgo || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "TIPO DE EVENTO:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.tipoEvento || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "FECHA DE OCURRENCIA:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.fechaOcurrencia || "________________" })] })],
                      })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "FECHA DE ASIGNACION:", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: formData.fechaAsignacion || "________________" })] })],
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
                    text: ` ${formData.fechaVisita || "________________"}`,
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
                    text: ` ${formData.reservaSugerida || "________________"}`,
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
                    text: formData.antecedentes || "Descripción de los antecedentes del siniestro...",
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
                    text: formData.descripcionRiesgo || "Descripción detallada del riesgo asegurado...",
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
                    text: formData.circunstanciaSiniestro || "Descripción de las circunstancias del siniestro...",
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
                    text: formData.inspeccionFotografica || "Descripción de la inspección realizada y registro fotográfico...",
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
                    text: formData.causa || "Determinación de la causa del siniestro...",
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
                    text: formData.reservaSugerida || "Reserva sugerida y observaciones adicionales...",
                    size: 20
                  })
                ],
                spacing: { after: 400 }
              }),

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

      // Generar archivo
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      // Nombre del archivo
      const nombreArchivo = `Informe_Inspeccion_Siniestro_${formData.reporteNo || 'Nuevo'}_${new Date().toISOString().split('T')[0]}.docx`;
      
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
        titulo: `Informe de Inspección - ${formData.reporteNo || 'Nuevo'}`,
        datos: formData,
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

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FirmaAjuste 
              formData={formData} 
              onInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <BotonesHistorial />
            <div className="flex space-x-4">
              <button
                onClick={generarDocumento}
                disabled={cargando}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {cargando ? 'Generando...' : '📄 Generar Documento'}
              </button>
              <button
                onClick={handleGuardarFormulario}
                disabled={cargando}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {cargando ? 'Guardando...' : '💾 Guardar Formulario'}
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Chatbot IA */}
        <ChatbotIA 
          formData={formData} 
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}
