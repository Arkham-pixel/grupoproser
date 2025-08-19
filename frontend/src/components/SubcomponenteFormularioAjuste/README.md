# Formulario de Ajuste - GRUPO PROSER

## Descripción
Este formulario permite crear informes de inspección de siniestros siguiendo la estructura estándar de GRUPO PROSER AJUSTES. El formulario incluye asistencia de IA para facilitar el llenado y generar contenido de calidad.

## Estructura del Formulario

### 1. **Datos Generales del Siniestro**
- Información del destinatario
- Información del siniestro
- Información de la póliza
- Información de las partes
- Información de ubicación
- Fechas importantes

### 2. **Antecedentes**
- Descripción de los antecedentes del siniestro
- Asistente IA con plantillas por tipo de evento
- Plantillas rápidas para diferentes escenarios

### 3. **Descripción del Riesgo**
- Descripción detallada del riesgo asegurado
- Características constructivas
- Sistemas de protección
- Estado de conservación

### 4. **Circunstancias del Siniestro**
- Secuencia de eventos
- Condiciones ambientales
- Respuesta de sistemas de seguridad
- Tiempo de respuesta de emergencias

### 5. **Inspección (Registro Fotográfico)**
- Descripción de la inspección realizada
- Carga de fotografías
- Documentación de hallazgos
- Conclusiones de la inspección

### 6. **Causa**
- Determinación de la causa del siniestro
- Evidencias físicas encontradas
- Análisis técnico realizado
- Factores contribuyentes

### 7. **Reserva Sugerida u Observación**
- Monto de la reserva sugerida
- Calculadora automática de reserva
- Justificación del monto
- Elementos incluidos y excluidos

### 8. **Firma del Ajustador**
- Información del funcionario
- Firma del gerente técnico
- Información de contacto
- Vista previa de firmas

## Características de IA

### Asistente Inteligente
- **Generación automática** de contenido basado en el tipo de evento
- **Plantillas inteligentes** que se adaptan al contexto
- **Sugerencias contextuales** para mejorar la calidad del informe
- **Validación automática** de completitud y calidad

### Funcionalidades IA por Sección
- **Antecedentes**: Plantillas específicas por tipo de siniestro
- **Descripción del Riesgo**: Sugerencias de estructura y contenido
- **Circunstancias**: Generación de narrativas coherentes
- **Inspección**: Asistencia para documentación fotográfica
- **Causa**: Análisis estructurado de factores
- **Reserva**: Cálculo automático con justificación

## Tipos de Evento Soportados

- **Incendio**: Plantillas específicas para eventos de fuego
- **Inundación**: Análisis de daños por agua
- **Robo**: Evaluación de pérdidas y medidas de seguridad
- **Accidente**: Análisis de causas y consecuencias
- **Daño por agua**: Evaluación de filtraciones y humedad
- **Otros**: Plantillas genéricas adaptables

## Uso del Formulario

### 1. **Inicio**
- Seleccionar tipo de evento
- Completar información básica del siniestro

### 2. **Llenado Asistido**
- Usar el asistente IA para generar contenido base
- Personalizar según las circunstancias específicas
- Aplicar plantillas rápidas según necesidad

### 3. **Validación**
- Revisar indicadores de calidad
- Completar secciones faltantes
- Verificar coherencia del informe

### 4. **Generación**
- Crear documento Word profesional
- Guardar en historial de formularios
- Exportar para distribución

## Tecnologías Utilizadas

- **React**: Framework principal
- **Tailwind CSS**: Estilos y diseño responsivo
- **docx**: Generación de documentos Word
- **React Icons**: Iconografía consistente
- **Estado local**: Gestión de formulario
- **Validación en tiempo real**: Control de calidad

## Integración con el Sistema

### Historial de Formularios
- Se guarda automáticamente como tipo `ajuste`
- Incluye metadatos completos del siniestro
- Permite edición y actualización posterior

### Exportación
- Genera documentos Word profesionales
- Mantiene formato corporativo de GRUPO PROSER
- Incluye todas las secciones del informe

## Mantenimiento y Actualización

### Agregar Nuevos Tipos de Evento
1. Actualizar `plantillasAntecedentes` en `AntecedentesAjuste.jsx`
2. Actualizar `plantillasRiesgo` en `DescripcionRiesgoAjuste.jsx`
3. Actualizar `plantillasCircunstancias` en `CircunstanciaSiniestroAjuste.jsx`
4. Actualizar `plantillasInspeccion` en `InspeccionFotograficaAjuste.jsx`
5. Actualizar `plantillasCausa` en `CausaAjuste.jsx`
6. Actualizar `plantillasReserva` en `ReservaSugeridaAjuste.jsx`

### Personalizar Plantillas
- Modificar arrays de plantillas en cada componente
- Ajustar lógica de reemplazo de variables
- Actualizar validaciones de calidad

## Estructura de Archivos

```
SubcomponenteFormularioAjuste/
├── FormularioAjuste.jsx          # Componente principal
├── DatosGeneralesAjuste.jsx      # Datos básicos del siniestro
├── AntecedentesAjuste.jsx        # Sección de antecedentes
├── DescripcionRiesgoAjuste.jsx   # Descripción del riesgo
├── CircunstanciaSiniestroAjuste.jsx # Circunstancias del evento
├── InspeccionFotograficaAjuste.jsx  # Inspección y fotos
├── CausaAjuste.jsx               # Determinación de causa
├── ReservaSugeridaAjuste.jsx     # Reserva y observaciones
├── FirmaAjuste.jsx               # Firmas y contacto
├── index.js                      # Exportaciones
└── README.md                     # Esta documentación
```

## Contacto y Soporte

Para dudas o sugerencias sobre el formulario de ajuste, contactar al equipo de desarrollo de GRUPO PROSER.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Desarrollado por**: Equipo de Desarrollo GRUPO PROSER
