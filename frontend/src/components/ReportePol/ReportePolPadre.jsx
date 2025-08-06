import React, { useState, useEffect } from "react";
import DatosGenerales from "./DatosGenerales";
import DatosAsegurado from "./DatosAsegurado";
import TransporteExterior from "./TransporteExterior";
import TransporteInterior from "./TransporteInterior";
import DetalleInspeccion from "./DetalleInspeccion";
import Observaciones from "./Observaciones";
import Recomendaciones from "./Recomendaciones";
import DocumentosAdjuntos from "./DocumentosAdjuntos";
import Firmas from "./Firmas";
import FotosActa from "./FotosActa";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, HeadingLevel, ImageRun, WidthType } from "docx";
import { saveAs } from "file-saver";

export default function ReportePolPadre() {
  // Estado para DatosGenerales
  const [ciudad, setCiudad] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipoInspeccion, setTipoInspeccion] = useState("");
  const [fechaLlegada, setFechaLlegada] = useState("");
  const [regional, setRegional] = useState("");
  const [actaNumero, setActaNumero] = useState("");
  const [inspTipo, setInspTipo] = useState("");
  const [inspFecha, setInspFecha] = useState("");
  const [regionalDer, setRegionalDer] = useState("");

  // Estado para DatosAsegurado
  const [aseguradora, setAseguradora] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [asegurado, setAsegurado] = useState("");
  const [numPiezas, setNumPiezas] = useState("");
  const [tipoEmpaque, setTipoEmpaque] = useState("");
  const [claseMercancia, setClaseMercancia] = useState("");
  const [pedidoNo, setPedidoNo] = useState("");
  const [fechaConstruccion, setFechaConstruccion] = useState("");

  // Estado para TransporteExterior
  const [origen, setOrigen] = useState("");
  const [tipoTransporte, setTipoTransporte] = useState("");
  const [motonave, setMotonave] = useState("");
  const [registro, setRegistro] = useState("");
  const [docTransporte, setDocTransporte] = useState("");
  const [puertoOrigen, setPuertoOrigen] = useState("");
  const [puertoArribo, setPuertoArribo] = useState("");
  const [destinoFinal, setDestinoFinal] = useState("");

  // Estado para TransporteInterior
  const [empresaTransportadora, setEmpresaTransportadora] = useState("");
  const [remesaNo, setRemesaNo] = useState("");
  const [conductor, setConductor] = useState("");
  const [cedula, setCedula] = useState("");
  const [placas, setPlacas] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [origenInterior, setOrigenInterior] = useState("");
  const [destino, setDestino] = useState("");
  const [celular, setCelular] = useState("");
  const [cartaPorte, setCartaPorte] = useState("");

  // Estado para DetalleInspeccion
  const [lugarReconocimiento, setLugarReconocimiento] = useState("");
  const [pesoTara, setPesoTara] = useState("");
  const [pesoNeto, setPesoNeto] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");

  // Estado para Observaciones
  const [observaciones, setObservaciones] = useState("");

  // Estado para Recomendaciones
  const [recomendaciones, setRecomendaciones] = useState("");

  // Estado para DocumentosAdjuntos
  const [facturaComercial, setFacturaComercial] = useState("NO");
  const [listaEmpaque, setListaEmpaque] = useState("NO");
  const [docTransporteAdjunto, setDocTransporteAdjunto] = useState("NO");

  // Estado para Firmas
  const [firmanteAsegurado, setFirmanteAsegurado] = useState("");
  const [firmanteConductor, setFirmanteConductor] = useState("");
  const [firmanteInspector, setFirmanteInspector] = useState("");
  const [codigoInspector, setCodigoInspector] = useState("");

  // Estado para FotosActa
  const [fotosActa, setFotosActa] = useState([]); // [{ src, descripcion }]

  useEffect(() => {
    // Solo inicializar si está vacío
    if (!hora) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setHora(`${hh}:${mm}`);
    }
  }, []);

  // Función para convertir base64 a ArrayBuffer
  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64.split(",")[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Función para generar el Word
  const generarWord = async () => {
    // Secciones principales como tablas
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "REPORTE POL - CONTROL PORTUARIO, RISK MANAGEMENT",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            // DATOS GENERALES
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({ text: `Ciudad: ${ciudad}` }),
                        new Paragraph({ text: `Fecha: ${fecha}` }),
                        new Paragraph({ text: `Hora: ${hora}` }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ text: "ACTA / REPORT", alignment: AlignmentType.CENTER }),
                        new Paragraph({ text: `No.: ${actaNumero}` }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({ text: `Tipo Inspección: ${tipoInspeccion}` }),
                        new Paragraph({ text: `Fecha de Llegada: ${fechaLlegada}` }),
                        new Paragraph({ text: `Regional: ${regional}` }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ text: `INSP.: ${inspTipo}` }),
                        new Paragraph({ text: `Fecha de Inspección: ${inspFecha}` }),
                        new Paragraph({ text: `Regional: ${regionalDer}` }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            // DATOS DEL ASEGURADO
            new Paragraph({ text: "\n" }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Aseguradora: ${aseguradora}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Sucursal: ${sucursal}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Asegurado: ${asegurado}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `N. de Piezas: ${numPiezas}` })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Tipo de Empaque: ${tipoEmpaque}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Clase de Mercancía: ${claseMercancia}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Pedido No.: ${pedidoNo}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Fecha de Construcción: ${fechaConstruccion}` })] }),
                  ],
                }),
              ],
            }),
            // TRANSPORTE EXTERIOR
            new Paragraph({ text: "\n" }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Origen: ${origen}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Tipo de Transporte: ${tipoTransporte}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Motonave: ${motonave}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Registro: ${registro}` })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Doc. de Transporte: ${docTransporte}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Puerto Origen: ${puertoOrigen}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Puerto Arribo: ${puertoArribo}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Destino Final: ${destinoFinal}` })] }),
                  ],
                }),
              ],
            }),
            // TRANSPORTE INTERIOR
            new Paragraph({ text: "\n" }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Empresa Transportadora: ${empresaTransportadora}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Remesa No.: ${remesaNo}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Conductor: ${conductor}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Cédula: ${cedula}` })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Placas: ${placas}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Modelo: ${modelo}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Marca: ${marca}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Origen: ${origenInterior}` })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Destino: ${destino}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Celular: ${celular}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Carta de Porte: ${cartaPorte}` })] }),
                    new TableCell({ children: [] }),
                  ],
                }),
              ],
            }),
            // DETALLE DE INSPECCIÓN
            new Paragraph({ text: "\n" }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Lugar de Reconocimiento: ${lugarReconocimiento}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Peso Tara: ${pesoTara}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Peso Neto: ${pesoNeto}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Peso Bruto: ${pesoBruto}` })] }),
                  ],
                }),
              ],
            }),
            // OBSERVACIONES
            new Paragraph({ text: "\nObservaciones / Remarks:", bold: true }),
            new Paragraph({ text: observaciones }),
            // RECOMENDACIONES
            new Paragraph({ text: "\nRecomendaciones / Recommendations:", bold: true }),
            new Paragraph({ text: recomendaciones }),
            // DOCUMENTOS ADJUNTOS
            new Paragraph({ text: "\nDocumentos Adjuntos:", bold: true }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Factura Comercial: ${facturaComercial}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Lista de Empaque: ${listaEmpaque}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Doc de Transporte: ${docTransporteAdjunto}` })] }),
                  ],
                }),
              ],
            }),
            // FIRMAS
            new Paragraph({ text: "\nFirmas:", bold: true }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Asegurado: ${firmanteAsegurado}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Conductor: ${firmanteConductor}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Inspector: ${firmanteInspector}` })] }),
                    new TableCell({ children: [new Paragraph({ text: `Código: ${codigoInspector}` })] }),
                  ],
                }),
              ],
            }),
            // FOTOS DEL ACTA
            new Paragraph({ text: "\nFotos del Acta:", bold: true }),
            ...(
              fotosActa.length > 0
                ? [
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      rows: Array.from({ length: Math.ceil(fotosActa.length / 2) }, (_, rowIdx) =>
                        new TableRow({
                          children: [0, 1].map(colIdx => {
                            const idx = rowIdx * 2 + colIdx;
                            const foto = fotosActa[idx];
                            if (!foto) {
                              return new TableCell({ children: [] });
                            }
                            return new TableCell({
                              children: [
                                new Paragraph({ text: `Foto Nro. ${idx + 1}` }),
                                foto.src
                                  ? new Paragraph({
                                      children: [
                                        new ImageRun({
                                          data: base64ToArrayBuffer(foto.src),
                                          transformation: { width: 200, height: 150 },
                                        }),
                                      ],
                                    })
                                  : new Paragraph({ text: "Sin imagen" }),
                                new Paragraph({ text: foto.descripcion || "" }),
                              ],
                            });
                          }),
                        })
                      ),
                    })
                  ]
                : [new Paragraph({ text: "No hay fotos adjuntas." })]
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Reporte_POL_${fecha || ""}.docx`);
  };

  return (
    <div className="bg-white p-6 max-w-5xl mx-auto rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reporte POL - Control Portuario, Risk Management</h1>
      <DatosGenerales
        ciudad={ciudad} setCiudad={setCiudad}
        fecha={fecha} setFecha={setFecha}
        hora={hora} setHora={setHora}
        tipoInspeccion={tipoInspeccion} setTipoInspeccion={setTipoInspeccion}
        fechaLlegada={fechaLlegada} setFechaLlegada={setFechaLlegada}
        regional={regional} setRegional={setRegional}
        actaNumero={actaNumero} setActaNumero={setActaNumero}
        inspTipo={inspTipo} setInspTipo={setInspTipo}
        inspFecha={inspFecha} setInspFecha={setInspFecha}
        regionalDer={regionalDer} setRegionalDer={setRegionalDer}
      />
      <DatosAsegurado
        aseguradora={aseguradora} setAseguradora={setAseguradora}
        sucursal={sucursal} setSucursal={setSucursal}
        asegurado={asegurado} setAsegurado={setAsegurado}
        numPiezas={numPiezas} setNumPiezas={setNumPiezas}
        tipoEmpaque={tipoEmpaque} setTipoEmpaque={setTipoEmpaque}
        claseMercancia={claseMercancia} setClaseMercancia={setClaseMercancia}
        pedidoNo={pedidoNo} setPedidoNo={setPedidoNo}
        fechaConstruccion={fechaConstruccion} setFechaConstruccion={setFechaConstruccion}
      />
      <TransporteExterior
        origen={origen} setOrigen={setOrigen}
        tipoTransporte={tipoTransporte} setTipoTransporte={setTipoTransporte}
        motonave={motonave} setMotonave={setMotonave}
        registro={registro} setRegistro={setRegistro}
        docTransporte={docTransporte} setDocTransporte={setDocTransporte}
        puertoOrigen={puertoOrigen} setPuertoOrigen={setPuertoOrigen}
        puertoArribo={puertoArribo} setPuertoArribo={setPuertoArribo}
        destinoFinal={destinoFinal} setDestinoFinal={setDestinoFinal}
      />
      <TransporteInterior
        empresaTransportadora={empresaTransportadora} setEmpresaTransportadora={setEmpresaTransportadora}
        remesaNo={remesaNo} setRemesaNo={setRemesaNo}
        conductor={conductor} setConductor={setConductor}
        cedula={cedula} setCedula={setCedula}
        placas={placas} setPlacas={setPlacas}
        modelo={modelo} setModelo={setModelo}
        marca={marca} setMarca={setMarca}
        origenInterior={origenInterior} setOrigenInterior={setOrigenInterior}
        destino={destino} setDestino={setDestino}
        celular={celular} setCelular={setCelular}
        cartaPorte={cartaPorte} setCartaPorte={setCartaPorte}
      />
      <DetalleInspeccion
        lugarReconocimiento={lugarReconocimiento} setLugarReconocimiento={setLugarReconocimiento}
        pesoTara={pesoTara} setPesoTara={setPesoTara}
        pesoNeto={pesoNeto} setPesoNeto={setPesoNeto}
        pesoBruto={pesoBruto} setPesoBruto={setPesoBruto}
      />
      <Observaciones
        observaciones={observaciones}
        setObservaciones={setObservaciones}
      />
      <Recomendaciones
        recomendaciones={recomendaciones}
        setRecomendaciones={setRecomendaciones}
      />
      <DocumentosAdjuntos
        facturaComercial={facturaComercial} setFacturaComercial={setFacturaComercial}
        listaEmpaque={listaEmpaque} setListaEmpaque={setListaEmpaque}
        docTransporteAdjunto={docTransporteAdjunto} setDocTransporteAdjunto={setDocTransporteAdjunto}
      />
      <Firmas
        firmanteAsegurado={firmanteAsegurado} setFirmanteAsegurado={setFirmanteAsegurado}
        firmanteConductor={firmanteConductor} setFirmanteConductor={setFirmanteConductor}
        firmanteInspector={firmanteInspector} setFirmanteInspector={setFirmanteInspector}
        codigoInspector={codigoInspector} setCodigoInspector={setCodigoInspector}
      />
      <FotosActa
        fotosActa={fotosActa}
        setFotosActa={setFotosActa}
      />
      <button
        onClick={generarWord}
        className="mt-8 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow"
      >
        Exportar a Word
      </button>
    </div>
  );
} 