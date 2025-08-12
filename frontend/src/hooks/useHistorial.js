import { useState, useEffect, useCallback } from 'react';
import historialService from '../services/historialService';

export default function useHistorial() {
  const [formularios, setFormularios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    usuario: '',
    fechaDesde: '',
    fechaHasta: '',
    estado: ''
  });

  // Cargar historial
  const cargarHistorial = useCallback(async (filtrosAplicados = filtros) => {
    try {
      setCargando(true);
      setError(null);
      
      // Verificar si hay token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No hay token de autenticación');
        setError('No hay token de autenticación. Por favor, inicia sesión.');
        setFormularios([]);
        return;
      }
      
      console.log('🔑 Token encontrado, cargando historial...');
      const datos = await historialService.obtenerHistorial(filtrosAplicados);
      setFormularios(datos);
      console.log('✅ Historial cargado:', datos);
    } catch (err) {
      console.error('❌ Error cargando historial:', err);
      setError(err.message);
      setFormularios([]);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  // Cargar historial al montar el componente
  useEffect(() => {
    cargarHistorial();
  }, []);

  // Aplicar filtros
  const aplicarFiltros = useCallback((nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  // Buscar formularios
  const buscarFormularios = useCallback(async (texto) => {
    try {
      setCargando(true);
      setError(null);
      
      const resultados = await historialService.buscarFormularios(texto);
      setFormularios(resultados);
    } catch (err) {
      setError(err.message);
      console.error('Error buscando formularios:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Guardar formulario
  const guardarFormulario = useCallback(async (formulario) => {
    try {
      setError(null);
      
      const nuevoFormulario = await historialService.guardarFormulario(formulario);
      setFormularios(prev => [nuevoFormulario, ...prev]);
      
      return nuevoFormulario;
    } catch (err) {
      setError(err.message);
      console.error('Error guardando formulario:', err);
      throw err;
    }
  }, []);

  // Actualizar formulario
  const actualizarFormulario = useCallback(async (id, datos) => {
    try {
      setError(null);
      
      const formularioActualizado = await historialService.actualizarFormulario(id, datos);
      setFormularios(prev => 
        prev.map(f => f.id === id ? formularioActualizado : f)
      );
      
      return formularioActualizado;
    } catch (err) {
      setError(err.message);
      console.error('Error actualizando formulario:', err);
      throw err;
    }
  }, []);

  // Eliminar formulario
  const eliminarFormulario = useCallback(async (id) => {
    try {
      setError(null);
      
      await historialService.eliminarFormulario(id);
      setFormularios(prev => prev.filter(f => f.id !== id));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando formulario:', err);
      throw err;
    }
  }, []);

  // Descargar formulario
  const descargarFormulario = useCallback(async (id) => {
    try {
      setError(null);
      
      await historialService.descargarFormulario(id);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error descargando formulario:', err);
      throw err;
    }
  }, []);

  // Obtener formulario por ID
  const obtenerFormulario = useCallback(async (id) => {
    try {
      setError(null);
      
      const formulario = await historialService.obtenerFormulario(id);
      return formulario;
    } catch (err) {
      setError(err.message);
      console.error('Error obteniendo formulario:', err);
      throw err;
    }
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // Refrescar historial
  const refrescarHistorial = useCallback(() => {
    cargarHistorial();
  }, [cargando]);

  // Obtener estadísticas
  const [estadisticas, setEstadisticas] = useState({});
  
  const cargarEstadisticas = useCallback(async () => {
    try {
      const stats = await historialService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargando]);

  return {
    // Estado
    formularios,
    cargando,
    error,
    filtros,
    estadisticas,
    
    // Acciones
    cargarHistorial,
    aplicarFiltros,
    buscarFormularios,
    guardarFormulario,
    actualizarFormulario,
    eliminarFormulario,
    descargarFormulario,
    obtenerFormulario,
    limpiarError,
    refrescarHistorial,
    cargarEstadisticas
  };
}
