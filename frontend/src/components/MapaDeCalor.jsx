// src/components/MapaDeCalor.jsx
import React from "react";
import "../MapaCalor.css"; // lo vamos a crear también

const MapaDeCalor = ({ tablaRiesgos }) => {
  // Ejes
  const probabilidades = [5, 4, 3, 2, 1];
  const severidades = [1, 2, 3, 4, 5];

  // Helper para color según % vulnerabilidad
  const getColor = (percent) => {
    if (percent <= 16) return "verde";
    if (percent <= 32) return "amarillo";
    if (percent <= 48) return "azul";
    return "rojo";
  };

  // Mapeamos los riesgos a su celda
  const getRiesgosPorCelda = (p, s) => {
    return tablaRiesgos
      .map((r, i) => {
        const prob = parseInt(r.probabilidad) || 0;
        const sev = parseInt(r.severidad) || 0;
        const R = prob * sev;
        const percent = Math.round((R / 25) * 100);

        if (prob === p && sev === s) {
          // Devuelvo el nombre del riesgo que corresponda a la fila i
          const nombresRiesgos = [
            "Incendio/Explosión",
            "AMIT",
            "Anegación",
            "Terremoto",
            "Sustracción",
            "Rotura de maquinaria",
            "Responsabilidad Civil",
          ];
          return `${nombresRiesgos[i]} (${percent}%)`;
        } else {
          return null;
        }
      })
      .filter(Boolean)
      .join("\n"); // Si hay más de un riesgo en la misma celda
  };

  return (
    <div className="mapa-de-calor">
      <h2 className="titulo">Mapa de Calor - Clasificación de Riesgos</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {severidades.map((sev) => (
              <th key={sev}>
                {[
                  "Insignificante (1)",
                  "Menor (2)",
                  "Moderado (3)",
                  "Mayor (4)",
                  "Catastrófico (5)",
                ][sev - 1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {probabilidades.map((p) => (
            <tr key={p}>
              <th>
                {[
                  "Frecuente (5)",
                  "Posible (4)",
                  "Probable (3)",
                  "Baja (2)",
                  "Improbable (1)",
                ][5 - p]}
              </th>
              {severidades.map((s) => {
                const riesgosTexto = getRiesgosPorCelda(p, s);
                const R = p * s;
                const percent = Math.round((R / 25) * 100);
                const color = getColor(percent);

                return (
                  <td key={`${p}-${s}`} className={color}>
                    <div className="celda">
                      <div className="valor-r">{R} ({percent}%)</div>
                      <div className="riesgos">{riesgosTexto}</div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapaDeCalor;
