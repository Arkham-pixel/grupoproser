import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, HeadingLevel, ImageRun, Header, WidthType, Media } from "docx";
import { saveAs } from "file-saver";
import EncabezadoMaquinaria from "./EncabezadoMaquinaria";
import CartaPresentacionMaquinaria from "./CartaPresentacionMaquinaria";
import TablaInspeccionMaquinaria from "./TablaInspeccionMaquinaria";
import DescripcionBienAsegurado from "./DescripcionBienAsegurado";
import EstadoGeneralMaquinaria from "./EstadoGeneralMaquinaria";
import TipoProteccionMaquinaria from "./TipoProteccionMaquinaria";
import RecomendacionesObservacionesMaquinaria from "./RecomendacionesObservacionesMaquinaria";
import RegistroFotograficoMaquinaria from "./RegistroFotograficoMaquinaria";
import FirmaMaquinaria from "./FirmaMaquinaria";
import { gapi } from "gapi-script";
import Logo from '../../img/Logo.png'; // Ajusta la ruta según tu estructura

//import proserLogo from "../../img/logo.png";

const toArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      return reject(new Error("El archivo no es un Blob válido."));
    }

    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};


export const convertirHtmlADocx = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = Array.from(doc.body.childNodes);

  const docxParagraphs = elements.flatMap((node) => {
    if (node.nodeName === "UL") {
      return Array.from(node.children).map((li) =>
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: li.textContent, font: "Arial", size: 24 })],
        })
      );
    }

    if (node.nodeName === "OL") {
      return Array.from(node.children).map((li) =>
        new Paragraph({
          numbering: { reference: "lista-numerada", level: 0 },
          children: [new TextRun({ text: li.textContent, font: "Arial", size: 24 })],
        })
      );
    }

    return new Paragraph({
      children: [new TextRun({ text: node.textContent, font: "Arial", size: 24 })],
    });
  });

  return docxParagraphs;
};

const CLIENT_ID = "262224611220-om055q2l4g4j1kd5v6kv1jkabjo5cdfo.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/drive.file";

export default function FormularioMaquinaria() {
  // Estados principales
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [nombreAsegurado, setNombreAsegurado] = useState("");
  const [nombreMaquinaria, setNombreMaquinaria] = useState("");
  const [ciudadFecha, setCiudadFecha] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [referencia, setReferencia] = useState("");
  const [saludo, setSaludo] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [fotos, setFotos] = useState([{ src: "", descripcion: "" }]);
  const [aseguradora, setAseguradora] = useState("");
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marcaBien, setMarcaBien] = useState("");
  const [electrico, setElectrico] = useState("");
  const [tipoProteccion, setTipoProteccion] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [inspectorSeleccionado, setInspectorSeleccionado] = useState("");
  const [cargoSeleccionado, setCargoSeleccionado] = useState("");
  const [imagenesRegistro, setImagenesRegistro] = useState([]); // Para varias fotos
  const [fotoPrincipal, setFotoPrincipal] = useState(null); // archivo File
  const [fotoPrincipalPreview, setFotoPrincipalPreview] = useState(""); // base64 para mostrar
  const [descripcionFotoPrincipal, setDescripcionFotoPrincipal] = useState("");
  const [tomador, setTomador] = useState("");
  const [lugar, setLugar] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [modelo, setModelo] = useState("");
  const [linea, setLinea] = useState("");
  const [motorDiesel, setMotorDiesel] = useState("");
  const [sistemaLocomocion, setSistemaLocomocion] = useState("");
  const [color, setColor] = useState("");
  const [estadoOperativo, setEstadoOperativo] = useState("");
  const [cabina, setCabina] = useState("");
  const [funcion, setFuncion] = useState("");
  const [equipoContraincendio, setEquipoContraincendio] = useState("");
  const [equipoRadio, setEquipoRadio] = useState("");
  const [radiodeOperacion, setRadiodeOperacion] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [hidraulico, setHidraulico] = useState("");
  const [pintura, setPintura] = useState("");
  const [chasis, setChasis] = useState("");
  const [locomocion, setLocomocion] = useState("");
  const [mantenimiento, setMantenimiento] = useState("");
  const [funcionamiento, setFuncionamiento] = useState("");
  const [registroFotografico, setRegistroFotografico] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [enlaceDrive, setEnlaceDrive] = useState("");
  const [errorDrive, setErrorDrive] = useState("");


  // Convierte el canvas de firma en un ArrayBuffer
const getFirmaArrayBuffer = () => {
  return new Promise((resolve) => {
    const canvas = document.querySelector("canvas");
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsArrayBuffer(blob);
    });
  });
};

  
const generarWord = async ({ inspectorSeleccionado, cargoSeleccionado, firmaCanvas, fecha }) => {
    let isMounted = true;
    // Usa la primera imagen del registro fotográfico como portada

    let imagenPresentacion = null;
    if (fotoPrincipal) {
      const arrayBuffer = await toArrayBuffer(fotoPrincipal);
      imagenPresentacion = new ImageRun({
        data: arrayBuffer,
        transformation: { width: 350, height: 250 },
      });
    }
    
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Fila 1: Logo | Título (celda combinada) | vacío
        new TableRow({
          children: [
            new TableCell({
              width: { size: 33, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: await fetch(Logo).then(r => r.arrayBuffer()),
                      transformation: { width: 150, height: 60 },
                    }),
                  ],
                }),
              ],
              verticalAlign: "center",
              shading: { fill: "FFFFFF" },
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${nombreAsegurado.toUpperCase()} - ${nombreMaquinaria.toUpperCase()}`,
                      bold: true,
                      size: 22,
                      font: "Arial",
                      color: "2B2B2B",
                    }),
                  ],
                }),
              ],
              //shading: { fill: "2B2B2B" },
            }),
          ],
        }),
        // Fila 2: INSP. RIESGOS | RIESGOS | DATE
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "INSP. RIESGOS",
                      bold: true,
                      size: 20,
                      font: "Arial",
                      color: "2B2B2B",
                    }),
                  ],
                }),
              ],
             // shading: { fill: "2B2B2B" },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "RIESGOS",
                      bold: true,
                      size: 20,
                      font: "Arial",
                      color: "2B2B2B",
                    }),
                  ],
                }),
              ],
             // shading: { fill: "2B2B2B" },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `DATE: ${fecha.replace(/-/g, ".")}`,
                      bold: true,
                      size: 20,
                      font: "Arial",
                     color: "2B2B2B",
                    }),
                  ],
                }),
              ],
              //shading: { fill: "2B2B2B" },
            }),
          ],
        }),
      ],

});
    const doc = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [headerTable],
            }),
          },
          children: [
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "INFORME DE INSPECCIÓN DE MAQUINARIA",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            // Agrega este bloque para la ciudad
            new Paragraph({
              text: ciudadFecha ? `Ciudad: ${ciudadFecha}` : "",
              font: "Arial",
              size: 24,
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              text: fecha ? `Fecha: ${fecha}` : "",
              font: "Arial",
              size: 24,
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Destinatario: ", bold: true, font: "Arial", size: 24 }),
                new TextRun({ text: destinatario, font: "Arial", size: 24 }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Referencia: ", bold: true, font: "Arial", size: 24 }),
                new TextRun({ text: referencia, font: "Arial", size: 24 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Asegurado: ", bold: true, font: "Arial", size: 24 }),
                new TextRun({ text: nombreAsegurado, font: "Arial", size: 24 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Maquinaria: ", bold: true, font: "Arial", size: 24 }),
                new TextRun({ text: nombreMaquinaria, font: "Arial", size: 24 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Saludo: ", bold: true, font: "Arial", size: 24 }),
                new TextRun({ text: saludo, font: "Arial", size: 24 }),
              ],
              alignment: AlignmentType.JUSTIFIED,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "", bold: true, font: "Arial", size: 24 }),
                new TextRun({ text: cuerpo, font: "Arial", size: 24 }),
              ],
              alignment: AlignmentType.JUSTIFIED,
            }),

            // Aquí va la foto principal y su descripción, justo después del cuerpo
            ...(imagenPresentacion
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [imagenPresentacion],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: descripcionFotoPrincipal || "Vista de la máquina",
                        italics: true,
                        font: "Arial",
                        size: 20,
                        color: "2B2B2B",
                      }),
                    ],
                  }),
                ]
              : []),

            // REGISTRO FOTOGRÁFICO (todas las imágenes)
           

              new Paragraph({ children: [], pageBreakBefore: true }),
              new Paragraph({
                text: "1. INFORME DE INSPECCIÓN MAQUINARIA",
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.LEFT,
                spacing: { after: 300 },
              }),
              new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                ...[
                  ["ASEGURADORA", aseguradora],
                  ["EQUIPO INSPECCIONADO", equipo],
                  ["MARCA", marca],
                  ["REFERENCIA", referencia],
                  ["TOMADOR", tomador],
                  ["LUGAR INSPECCION", lugar],
                  ["UBICACION", ubicacion],
                  ["DEPARTAMENTO", departamento],
                  ["INSPECTOR", inspectorSeleccionado],
                  ["FECHA DE INSPECCIÓN", fecha],
                  ["ATENDIDO", cargoSeleccionado]
                ].map(([label, value]) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: label, bold: true, font: "Arial", size: 22 }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: value || " ", font: "Arial", size: 22 }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),


           // Descripción del Bien Asegurado

              new Paragraph({ text: "", spacing: { after: 300 } }),
              new Paragraph({
                text: "2. DESCRIPCIÓN DEL BIEN ASEGURADO",
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.LEFT,
                spacing: { after: 300 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  ...[
                    ["DESCRIPCIÓN", descripcion],
                    ["MARCA", marca],
                    ["MODELO", modelo],
                    ["LÍNEA", linea],
                    ["MOTOR DIESEL", motorDiesel],
                    ["SISTEMA DE LOCOMOCIÓN", sistemaLocomocion],
                    ["COLOR", color],
                    ["ESTADO OPERATIVO", estadoOperativo],
                    ["CABINA", cabina],
                    ["FUNCIÓN", funcion],
                    ["EQUIPO CONTRAINCENDIO", equipoContraincendio],
                    ["EQUIPO DE RADIO COMUNICACIÓN", equipoRadio],
                    ["RADIO DE OPERACIÓN", radiodeOperacion]
                  ].map(([label, value]) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 30, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: label, bold: true, font: "Arial", size: 22 }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 70, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: value || " ", font: "Arial", size: 22 }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  ),
                ],
              }),


                // Estado General de la Maquinaria
              new Paragraph({ children: [], pageBreakBefore: true }),
              new Paragraph({
                text: "2.1. ESTADO GENERAL",
                heading: HeadingLevel.HEADING_3,
                spacing: { after: 100 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  ...[
                    ["ELÉCTRICO E INSTRUMENTOS", electrico],
                    ["SISTEMA MECÁNICO", mecanico],
                    ["SISTEMA HIDRÁULICO", hidraulico],
                    ["PINTURA", pintura],
                    ["CHASIS", chasis],
                    ["SISTEMA DE LOCOMOCIÓN", locomocion],
                    ["MANTENIMIENTO", mantenimiento],
                    ["FUNCIONAMIENTO", funcionamiento],
                  ].map(([label, value]) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 30, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [new TextRun({ text: label, bold: true, font: "Arial", size: 22 })],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 70, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [new TextRun({ text: value || " ", font: "Arial", size: 22 })],
                            }),
                          ],
                        }),
                      ],
                    })
                  ),
                ],
              }),

              // 3. TIPO DE PROTECCIÓN
              new Paragraph({ text: "", spacing: { after: 300 } }),
              new Paragraph({
                text: "3. TIPO DE PROTECCIÓN",
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 300 },
                children: [
                  new TextRun({
                    text: tipoProteccion || "",
                    font: "Arial",
                    size: 24, // 12 pt
                  }),
                ],
              }),

         // 4. RECOMENDACIONES Y OBSERVACIONES
              new Paragraph({ text: "", spacing: { after: 300 } }),
              new Paragraph({
                text: "4. RECOMENDACIONES Y OBSERVACIONES",
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 },
              }),
              ...convertirHtmlADocx(recomendaciones),

              // 5. REGISTRO FOTOGRÁFICO
            /*  new Paragraph({ children: [], pageBreakBefore: true }),
              new Paragraph({
                text: "5. REGISTRO FOTOGRÁFICO",
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),*/

            ...(imagenesRegistro.length > 0
              ? [
                  new Paragraph({
                    text: "REGISTRO FOTOGRÁFICO",
                    heading: HeadingLevel.HEADING_2,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                  }),
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: await Promise.all(
                      Array.from({ length: Math.ceil(imagenesRegistro.length / 2) }, async (_, i) => {
                        const rowCells = [];

                        for (let j = 0; j < 2; j++) {
                          const index = i * 2 + j;
                          if (index < imagenesRegistro.length) {
                            const img = imagenesRegistro[index];
                            const buffer = await toArrayBuffer(img.file);

                            rowCells.push(
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                      new ImageRun({
                                        data: buffer,
                                        transformation: { width: 350, height: 250 },
                                      }),
                                    ],
                                  }),
                                  new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                      new TextRun({
                                        text: img.descripcion || "",
                                        italics: true,
                                        font: "Arial",
                                        size: 20,
                                        color: "2B2B2B",
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            );
                          } else {
                            // Celda vacía si no hay segunda imagen
                            rowCells.push(new TableCell({ children: [new Paragraph({ text: "" })] }));
                          }
                        }

                        return new TableRow({ children: rowCells });
                      })
                    ),
                  }),
                ]
              : []),

// 6. FIRMA
new Paragraph({ text: "", pageBreakBefore: true }),
new Paragraph({
  text: "6. FIRMA",
  heading: HeadingLevel.HEADING_2,
  alignment: AlignmentType.CENTER,
  spacing: { after: 300 },
}),
new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 300 },
  children: [
    new TextRun({
      text: "En espera de haber realizado satisfactoriamente la asignación de la Inspección y análisis del riesgo y agradeciendo la confianza depositada en nuestros servicios profesionales, suscribimos",
      font: "Arial",
      size: 24,
    }),
  ],
}),
new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 300 },
  children: [
    new TextRun({ text: "Atentamente,", font: "Arial", size: 24 }),
  ],
}),
new Paragraph({
  alignment: AlignmentType.LEFT,
  children: [
    new ImageRun({
      data: await fetch(Logo).then((r) => r.arrayBuffer()),
      transformation: { width: 150, height: 60 },
    }),
  ],
}),
...(firmaCanvas
  ? [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new ImageRun({
            data: firmaCanvas,
            transformation: { width: 200, height: 100 },
          }),
        ],
      }),
    ]
  : []),
// Agrega nombre completo
new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text: inspectorSeleccionado,
      bold: true,
      font: "Arial",
      size: 24,
    }),
  ],
}),
// Agrega cargo
new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text: cargoSeleccionado,
      bold: true,
      font: "Arial",
      size: 22,
    }),
  ],
}),
// Agrega fecha
new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 100 },
  children: [
    new TextRun({
      text: `Fecha: ${fecha}`,
      font: "Arial",
      size: 20,
    }),
  ],
}),



              
            new Paragraph({ text: "" }),
          ],
        },
      ],
    });



    

// 1. Generar el Blob
const blob = await Packer.toBlob(doc);

  // 2. Descargar localmente
  saveAs(blob, `Inspeccion_Maquinaria_${nombre || "maquinaria"}.docx`);

    // 3. Subir a Google Drive si autenticado
    if (!accessToken) {
      if (isMounted) setErrorDrive('Debes iniciar sesión con Google primero.');
      return;
    }
    if (isMounted) setSubiendo(true);
    if (isMounted) setErrorDrive("");
    if (isMounted) setEnlaceDrive("");
    try {
      const metadata = {
        name: `Inspeccion_Maquinaria_${nombre || 'maquinaria'}.docx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelimiter = "\r\n--" + boundary + "--";
      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + metadata.mimeType + '\r\n\r\n';
      const body = new Blob([ multipartRequestBody, blob, closeDelimiter ]);
      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'multipart/related; boundary=' + boundary,
          },
          body,
        }
      );
      const data = await res.json();
      if (data.error) throw data.error;
      if (isMounted) setEnlaceDrive(data.webViewLink);
    } catch (err) {
      if (isMounted) setErrorDrive('No se pudo subir el documento a Drive. ' + (err.message || ''));
    } finally {
      if (isMounted) setSubiendo(false);
    }
  return () => { isMounted = false; };
};

  useEffect(() => {
    let isMounted = true;
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPE,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      }).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        if (isMounted) setIsSignedIn(auth.isSignedIn.get());
        if (auth.isSignedIn.get()) {
          const token = auth.currentUser.get().getAuthResponse().access_token;
          if (isMounted) setAccessToken(token);
        }
        auth.isSignedIn.listen(signedIn => {
          if (isMounted) setIsSignedIn(signedIn);
          if (signedIn) {
            const token = auth.currentUser.get().getAuthResponse().access_token;
            if (isMounted) setAccessToken(token);
          } else {
            if (isMounted) setAccessToken("");
          }
        });
      });
    }
    gapi.load("client:auth2", start);

    return () => { isMounted = false; };
  }, []);
  

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 text-white">
        {/* Encabezado */}
        <EncabezadoMaquinaria
          nombreAsegurado={nombreAsegurado}
          setNombreAsegurado={setNombreAsegurado}
          nombreMaquinaria={nombreMaquinaria}
          setNombreMaquinaria={setNombreMaquinaria}
          fecha={fecha}
          setFecha={setFecha}
        />

        {/* DATOS GENERALES */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">Datos generales</h2>
              <CartaPresentacionMaquinaria
                ciudadFecha={ciudadFecha}
                setCiudadFecha={setCiudadFecha}
                destinatario={destinatario}
                setDestinatario={setDestinatario}
                referencia={referencia}
                setReferencia={setReferencia}
                saludo={saludo}
                setSaludo={setSaludo}
                cuerpo={cuerpo}
                setCuerpo={setCuerpo}
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">Foto principal</h2>
              {/* Foto principal */}
              <label className="block mb-1 font-semibold">Foto principal de la máquina</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  setFotoPrincipal(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setFotoPrincipalPreview(ev.target.result);
                    reader.readAsDataURL(file);
                  } else {
                    setFotoPrincipalPreview("");
                  }
                }}
                className="mb-2"
              />
              {fotoPrincipalPreview && (
                <img
                  src={fotoPrincipalPreview}
                  alt="Vista de la máquina"
                  className="w-72 h-72 object-cover border border-gray-400 mb-2"
                />
              )}
              <input
                type="text"
                className="w-full bg-gray-800 border-b border-gray-600 px-2 py-1"
                value={descripcionFotoPrincipal}
                onChange={e => setDescripcionFotoPrincipal(e.target.value)}
                placeholder="Descripción de la foto principal"
              />
            </div>
          </div>

          {/* INSPECCIÓN Y DESCRIPCIÓN */}
          <div className="md:col-span-1">
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">1. Inspección Maquinaria</h2>
                <TablaInspeccionMaquinaria
                  aseguradora={aseguradora} setAseguradora={setAseguradora}
                  equipo={equipo} setEquipo={setEquipo}
                  marca={marca} setMarca={setMarca}
                  referencia={referencia} setReferencia={setReferencia}
                  tomador={tomador} setTomador={setTomador}
                  lugar={lugar} setLugar={setLugar}
                  ubicacion={ubicacion} setUbicacion={setUbicacion}
                  departamento={departamento} setDepartamento={setDepartamento}
                  inspector={inspectorSeleccionado} setInspector={setInspectorSeleccionado}
                  fechaInspeccion={fecha} setFechaInspeccion={setFecha}
                  atendido={cargoSeleccionado} setAtendido={setCargoSeleccionado}
                />
               </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">2. Descripción del Bien Asegurado</h2>
              <DescripcionBienAsegurado
                descripcion={descripcion} setDescripcion={setDescripcion}
                marca={marca} setMarca={setMarca}
                modelo={modelo} setModelo={setModelo}
                linea={linea} setLinea={setLinea}
                motorDiesel={motorDiesel} setMotorDiesel={setMotorDiesel}
                sistemaLocomocion={sistemaLocomocion} setSistemaLocomocion={setSistemaLocomocion}
                color={color} setColor={setColor}
                estadoOperativo={estadoOperativo} setEstadoOperativo={setEstadoOperativo}
                cabina={cabina} setCabina={setCabina}
                funcion={funcion} setFuncion={setFuncion}
                equipoContraincendio={equipoContraincendio} setEquipoContraincendio={setEquipoContraincendio}
                equipoRadio={equipoRadio} setEquipoRadio={setEquipoRadio}
                radiodeOperacion={radiodeOperacion} setRadiodeOperacion={setRadiodeOperacion}
              />
            </div>
          </div>

          {/* ESTADO Y PROTECCIÓN */}
          <div className="md:col-span-1">
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">2.1 Estado General</h2>
              <EstadoGeneralMaquinaria
                electrico={electrico} setElectrico={setElectrico}
                mecanico={mecanico} setMecanico={setMecanico}
                hidraulico={hidraulico} setHidraulico={setHidraulico}
                pintura={pintura} setPintura={setPintura}
                chasis={chasis} setChasis={setChasis}
                locomocion={locomocion} setLocomocion={setLocomocion}
                mantenimiento={mantenimiento} setMantenimiento={setMantenimiento}
                funcionamiento={funcionamiento} setFuncionamiento={setFuncionamiento}
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">3. Tipo de Protección</h2>
              <TipoProteccionMaquinaria
                tipoProteccion={tipoProteccion}
                setTipoProteccion={setTipoProteccion}
              />
            </div>
          </div>
        </div>

        {/* REGISTRO FOTOGRÁFICO, RECOMENDACIONES Y FIRMAS */}
        <div className="mt-8">
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">Recomendaciones y Observaciones</h2>
              <RecomendacionesObservacionesMaquinaria
                recomendaciones={recomendaciones}
                setRecomendaciones={setRecomendaciones}
              />

         </div>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">Registro Fotográfico</h2>
            <RegistroFotograficoMaquinaria onChange={setImagenesRegistro} />
          </div>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold mb-2 border-b border-gray-600 pb-1">Firma</h2>
            <FirmaMaquinaria />
          </div>
        </div>

        {/* BOTONES FINALES */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-4 justify-end">
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre"
            className="bg-gray-800 border-b border-gray-600 px-3 py-2 text-white rounded w-64"
          />
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="bg-gray-800 border-b border-gray-600 px-3 py-2 text-white rounded w-48"
          />
            {!isSignedIn && (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow"
            >
              Iniciar sesión con Google
            </button>
          )}
          {subiendo && <span className="text-yellow-400 font-semibold">Subiendo a Google Drive...</span>}
          {enlaceDrive && (
            <a href={enlaceDrive} target="_blank" rel="noopener noreferrer" className="text-green-400 underline font-semibold">Ver archivo en Google Drive</a>
          )}
          {errorDrive && <span className="text-red-400 font-semibold">{errorDrive}</span>}
          <button
            onClick={async () => {
              const firmaCanvas = await getFirmaArrayBuffer();
              await generarWord({
                inspectorSeleccionado,
                cargoSeleccionado,
                firmaCanvas,
                fecha,
              });
            }}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow"
          >
            Exportar Word y subir a Drive
          </button>
        </div>
      </div>
    </div>
  );
}