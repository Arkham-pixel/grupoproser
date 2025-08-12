import { useState, useCallback } from 'react';
import historialService from '../services/historialService';

export const useHistorialFormulario = (tipoFormulario) => {
  const [guardando, setGuardando] = useState(false);
  const [exportando, setExportando] = useState(false);

  const guardarEnHistorial = useCallback(async (datos, estado = 'en_proceso') => {
    try {
      setGuardando(true);
      
      const nuevoHistorial = {
        tipo: tipoFormulario,
        estado,
        fechaGeneracion: new Date().toISOString(),
        ...datos
      };

      await historialService.guardarFormulario(nuevoHistorial);
      
      return {
        success: true,
        message: estado === 'completado' 
          ? '✅ Formulario completado y guardado en el historial' 
          : '💾 Progreso guardado en el historial exitosamente'
      };
    } catch (error) {
      console.error('Error guardando en historial:', error);
      return {
        success: false,
        message: '❌ Error al guardar en el historial: ' + error.message
      };
    } finally {
      setGuardando(false);
    }
  }, [tipoFormulario]);

  const exportarYGuardar = useCallback(async (datos, funcionExportar) => {
    try {
      setExportando(true);
      
      // Primero exportar
      await funcionExportar();
      
      // Luego guardar en historial como completado
      const resultado = await guardarEnHistorial(datos, 'completado');
      
      return resultado;
    } catch (error) {
      console.error('Error en exportación:', error);
      return {
        success: false,
        message: '❌ Error en la exportación: ' + error.message
      };
    } finally {
      setExportando(false);
    }
  }, [guardarEnHistorial]);

  return {
    guardando,
    exportando,
    guardarEnHistorial,
    exportarYGuardar
  };
};
