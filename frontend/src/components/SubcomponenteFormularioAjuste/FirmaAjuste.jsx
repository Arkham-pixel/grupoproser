import React, { useState, useEffect, useRef } from 'react';
import { FaSignature, FaUser, FaBuilding, FaPhone, FaEnvelope, FaPlus, FaTrash, FaEdit, FaSave, FaEraser, FaUndo } from 'react-icons/fa';

export default function FirmaAjuste({ formData, onInputChange }) {
  // Estado para funcionarios personalizables
  const [funcionarios, setFuncionarios] = useState(() => {
    const guardados = localStorage.getItem('proser_funcionarios');
    return guardados ? JSON.parse(guardados) : [
      {
        id: 1,
        nombre: 'Iskharly José Tapia Gutiérrez',
        cargo: 'Gerente Técnico',
        telefono: '(+57 5) 3857793 - +57 3166337503',
        email: 'itapia@proserpuertos.com.co',
        firma: null
      }
    ];
  });

  // Estado para funcionario seleccionado
  const [funcionarioSeleccionado, setFuncionarioSeleccionado] = useState('');
  const [cargoSeleccionado, setCargoSeleccionado] = useState('');

  // Estado para el canvas de firma
  const [isDrawing, setIsDrawing] = useState(false);
  const [firmaCanvas, setFirmaCanvas] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Estado para modal de agregar/editar funcionario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState({
    id: null,
    nombre: '',
    cargo: '',
    telefono: '',
    email: '',
    firma: null
  });

  // Estado para cargos personalizables
  const [cargos, setCargos] = useState(() => {
    const guardados = localStorage.getItem('proser_cargos');
    return guardados ? JSON.parse(guardados) : [
      'Ing. de Siniestros',
      'Ajustador Senior',
      'Ajustador Especialista',
      'Perito en Seguros',
      'Analista de Riesgos',
      'Coordinador de Ajustes',
      'Supervisor de Campo',
      'Técnico de Ajustes',
      'Gerente Técnico'
    ];
  });

  // Guardar funcionarios en localStorage
  useEffect(() => {
    localStorage.setItem('proser_funcionarios', JSON.stringify(funcionarios));
    console.log('💾 Funcionarios guardados en localStorage:', funcionarios.length);
    
    // Log especial para verificar firmas guardadas
    const funcionariosConFirma = funcionarios.filter(f => f.firma);
    console.log('🔍 Funcionarios con firma guardada:', funcionariosConFirma.length);
    funcionariosConFirma.forEach(f => {
      console.log(`🔍 Funcionario ${f.nombre}: firma presente (${f.firma ? f.firma.length : 0} caracteres)`);
    });
  }, [funcionarios]);

  // Guardar cargos en localStorage
  useEffect(() => {
    localStorage.setItem('proser_cargos', JSON.stringify(cargos));
  }, [cargos]);

  // Cargar firma de Iskharly desde localStorage al iniciar
  useEffect(() => {
    const firmaIskharlyGuardada = localStorage.getItem('proser_firma_isharly');
    if (firmaIskharlyGuardada) {
      onInputChange('firmaIskharly', firmaIskharlyGuardada);
    }
  }, [onInputChange]);

  // Cargar firma del funcionario seleccionado cuando cambie
  useEffect(() => {
    if (funcionarioSeleccionado && canvasReady) {
      const funcionario = funcionarios.find(f => f.id === parseInt(funcionarioSeleccionado));
      if (funcionario && funcionario.firma) {
        console.log('🔄 Cargando firma automáticamente del funcionario seleccionado');
        onInputChange('firmaFuncionario', funcionario.firma);
        setFirmaCanvas(funcionario.firma);
        loadSignature(funcionario.firma);
      }
    }
  }, [funcionarioSeleccionado, canvasReady, funcionarios, onInputChange]);

  // Inicializar canvas de firma de manera robusta
  useEffect(() => {
    const initCanvas = () => {
      console.log('🔄 Inicializando canvas...');
      
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        console.log('✅ Canvas DOM encontrado:', canvas);
        
        const context = canvas.getContext('2d');
        if (context) {
          console.log('✅ Contexto 2D obtenido:', context);
          
          // Configurar el contexto del canvas
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.strokeStyle = '#000000';
          context.lineWidth = 3; // Línea más gruesa para mejor visibilidad
          
          // Guardar referencia del contexto
          contextRef.current = context;
          setCanvasReady(true);
          
          console.log('✅ Canvas de firma inicializado correctamente');
          console.log('✅ Contexto configurado:', {
            lineCap: context.lineCap,
            lineJoin: context.lineJoin,
            strokeStyle: context.strokeStyle,
            lineWidth: context.lineWidth
          });
        } else {
          console.error('❌ No se pudo obtener el contexto del canvas');
          setCanvasReady(false);
        }
      } else {
        console.error('❌ Canvas DOM no encontrado');
        setCanvasReady(false);
      }
    };

    // Inicializar inmediatamente
    initCanvas();
    
    // Si no está listo, reintentar después de un delay
    if (!canvasReady) {
      const timer = setTimeout(() => {
        console.log('🔄 Reintentando inicialización del canvas...');
        initCanvas();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [canvasReady]);

  // Forzar inicialización cuando se selecciona un funcionario
  useEffect(() => {
    if (funcionarioSeleccionado && !canvasReady) {
      console.log('🔄 Funcionario seleccionado, forzando inicialización del canvas...');
      setTimeout(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          if (context) {
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = '#000000';
            context.lineWidth = 3;
            contextRef.current = context;
            setCanvasReady(true);
            console.log('✅ Canvas inicializado por selección de funcionario');
          }
        }
      }, 300);
    }
  }, [funcionarioSeleccionado, canvasReady]);

  // Funciones para el canvas de firma
  const startDrawing = (e) => {
    console.log('🎨 Iniciando dibujo...', { e, contextRef: contextRef.current });
    
    if (!contextRef.current) {
      console.error('❌ Contexto no disponible en startDrawing');
      return;
    }
    
    if (!canvasRef.current) {
      console.error('❌ Canvas no disponible en startDrawing');
      return;
    }
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('📍 Posición inicial:', { x, y, clientX: e.clientX, clientY: e.clientY, rect });
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    console.log('✅ Movimiento inicial completado');
  };

  const draw = (e) => {
    if (!isDrawing) {
      console.log('❌ No está dibujando');
      return;
    }
    
    if (!contextRef.current) {
      console.error('❌ Contexto no disponible en draw');
      return;
    }
    
    if (!canvasRef.current) {
      console.error('❌ Canvas no disponible en draw');
      return;
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('✏️ Dibujando en:', { x, y, isDrawing });
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    console.log('✅ Línea dibujada');
  };

  const stopDrawing = () => {
    console.log('🛑 Deteniendo dibujo');
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setFirmaCanvas(null);
      onInputChange('firmaFuncionario', '');
    }
  };

  const saveSignature = () => {
    console.log('🔍 saveSignature llamado');
    console.log('🔍 Canvas disponible:', !!canvasRef.current);
    console.log('🔍 Funcionario seleccionado:', funcionarioSeleccionado);
    
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      console.log('🔍 DataURL generado, longitud:', dataURL.length);
      
      setFirmaCanvas(dataURL);
      
      // Guardar la firma del funcionario automáticamente
      if (funcionarioSeleccionado) {
        console.log('🔍 Guardando firma del funcionario...');
        guardarFirmaFuncionario(dataURL);
      } else {
        console.warn('⚠️ No hay funcionario seleccionado para guardar la firma');
      }
      
      alert('Firma guardada correctamente!');
    } else {
      console.error('❌ Canvas no disponible para guardar firma');
      alert('Error: Canvas de firma no disponible');
    }
  };

  const loadSignature = (firma) => {
    console.log('🔍 loadSignature llamado con firma:', firma ? 'Firma presente' : 'Sin firma');
    
    if (firma && canvasRef.current && contextRef.current) {
      const img = new Image();
      img.onload = () => {
        console.log('🔍 Imagen cargada, dibujando en canvas...');
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        contextRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log('✅ Firma cargada en canvas exitosamente');
      };
      img.onerror = (error) => {
        console.error('❌ Error cargando imagen de firma:', error);
      };
      img.src = firma;
    } else {
      console.warn('⚠️ No se puede cargar firma:', {
        firma: !!firma,
        canvas: !!canvasRef.current,
        context: !!contextRef.current
      });
    }
  };

  // Agregar nuevo funcionario
  const agregarFuncionario = () => {
    setModoEdicion(false);
    setFuncionarioEditando({
      id: null,
      nombre: '',
      cargo: '',
      telefono: '',
      email: '',
      firma: null
    });
    setMostrarModal(true);
  };

  // Editar funcionario existente
  const editarFuncionario = (funcionario) => {
    setModoEdicion(true);
    setFuncionarioEditando({ ...funcionario });
    setMostrarModal(true);
  };

  // Eliminar funcionario
  const eliminarFuncionario = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este funcionario?')) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
      if (funcionarioSeleccionado === id) {
        setFuncionarioSeleccionado('');
        setCargoSeleccionado('');
        // Limpiar firma del funcionario
        onInputChange('firmaFuncionario', '');
      }
    }
  };

  // Guardar funcionario (crear o actualizar)
  const guardarFuncionario = () => {
    if (!funcionarioEditando.nombre || !funcionarioEditando.cargo) {
      alert('El nombre y cargo son obligatorios');
      return;
    }

    if (modoEdicion) {
      // Actualizar funcionario existente
      setFuncionarios(funcionarios.map(f => 
        f.id === funcionarioEditando.id ? funcionarioEditando : f
      ));
    } else {
      // Crear nuevo funcionario
      const nuevoFuncionario = {
        ...funcionarioEditando,
        id: Date.now()
      };
      setFuncionarios([...funcionarios, nuevoFuncionario]);
    }

    setMostrarModal(false);
    setFuncionarioEditando({
      id: null,
      nombre: '',
      cargo: '',
      telefono: '',
      email: '',
      firma: null
    });
  };

  // Agregar nuevo cargo
  const agregarCargo = () => {
    const nuevoCargo = prompt('Ingrese el nuevo cargo:');
    if (nuevoCargo && !cargos.includes(nuevoCargo)) {
      setCargos([...cargos, nuevoCargo]);
    }
  };

  // Eliminar cargo
  const eliminarCargo = (cargo) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el cargo "${cargo}"?`)) {
      setCargos(cargos.filter(c => c !== cargo));
    }
  };

  // Manejar cambio de funcionario seleccionado
  const handleFuncionarioChange = (funcionarioId) => {
    console.log('🔍 handleFuncionarioChange llamado con ID:', funcionarioId);
    
    const funcionario = funcionarios.find(f => f.id === parseInt(funcionarioId));
    console.log('🔍 Funcionario encontrado:', funcionario);
    
    if (funcionario) {
      setFuncionarioSeleccionado(funcionarioId);
      setCargoSeleccionado(funcionario.cargo);
      onInputChange('funcionarioFirma', funcionario.nombre);
      onInputChange('cargoFuncionario', funcionario.cargo);
      onInputChange('telefonoFuncionario', funcionario.telefono);
      onInputChange('emailFuncionario', funcionario.email);
      
      console.log('✅ Datos del funcionario cargados en formData');
      
      // Cargar firma del funcionario si existe
      if (funcionario.firma) {
        console.log('🔍 Cargando firma existente del funcionario');
        onInputChange('firmaFuncionario', funcionario.firma);
        // Cargar la firma en el canvas
        loadSignature(funcionario.firma);
        setFirmaCanvas(funcionario.firma); // Importante: actualizar también el estado local
        console.log('✅ Firma del funcionario cargada en formData y canvas');
      } else {
        console.log('🔍 Funcionario no tiene firma, limpiando campos');
        onInputChange('firmaFuncionario', '');
        setFirmaCanvas(null); // Limpiar también el estado local
        // Limpiar el canvas
        clearCanvas();
        console.log('✅ Campos de firma limpiados');
      }
    } else {
      console.warn('⚠️ Funcionario no encontrado con ID:', funcionarioId);
    }
  };

  // Guardar firma del funcionario en localStorage y en el array de funcionarios
  const guardarFirmaFuncionario = (firmaBase64) => {
    console.log('🔍 guardarFirmaFuncionario llamado con:', {
      funcionarioSeleccionado,
      firmaBase64: firmaBase64 ? 'Firma presente' : 'Sin firma',
      longitudFirma: firmaBase64 ? firmaBase64.length : 0
    });
    
    if (funcionarioSeleccionado) {
      // Actualizar el funcionario con su firma
      const funcionarioActualizado = funcionarios.map(f => 
        f.id === parseInt(funcionarioSeleccionado) 
          ? { ...f, firma: firmaBase64 }
          : f
      );
      setFuncionarios(funcionarioActualizado);
      
      // Guardar en formData para el Word
      onInputChange('firmaFuncionario', firmaBase64);
      
      // Guardar inmediatamente en localStorage
      localStorage.setItem('proser_funcionarios', JSON.stringify(funcionarioActualizado));
      
      console.log('✅ Firma del funcionario guardada automáticamente en localStorage');
      console.log('✅ Firma del funcionario guardada en formData');
      console.log('✅ Funcionarios actualizados en estado local');
    } else {
      console.warn('⚠️ No hay funcionario seleccionado para guardar la firma');
    }
  };

  // Guardar firma de Iskharly en localStorage
  const guardarFirmaIskharly = (firmaBase64) => {
    localStorage.setItem('proser_firma_isharly', firmaBase64);
    onInputChange('firmaIskharly', firmaBase64);
    console.log('Firma de Iskharly guardada automáticamente en localStorage');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaSignature className="mr-3 text-indigo-600" />
          Sistema de Firmas
        </h2>
        <p className="text-gray-600 mt-2">Gestión de funcionarios y firmas personalizables</p>
        
        {/* Mensaje informativo sobre el sistema de firmas */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📋 ¿Cómo funciona el sistema de firmas?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Selecciona un funcionario</strong> del dropdown para poder dibujar su firma</li>
            <li>• <strong>Dibuja la firma</strong> en el canvas usando el mouse o el dedo</li>
            <li>• <strong>Haz clic en "Guardar Firma"</strong> para guardarla permanentemente</li>
            <li>• <strong>La firma se recordará</strong> cada vez que selecciones ese funcionario</li>
            <li>• <strong>Para cambiar la firma:</strong> usa el botón "🔄 Cambiar Firma"</li>
            <li>• <strong>Para eliminar la firma:</strong> usa el botón "Remover"</li>
          </ul>
        </div>
      </div>

      {/* Gestión de Funcionarios */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            Gestión de Funcionarios
          </h3>
          <button
            onClick={agregarFuncionario}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            Agregar Funcionario
          </button>
        </div>

        {/* Lista de funcionarios */}
        <div className="space-y-3">
          {funcionarios.map((funcionario) => (
            <div key={funcionario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{funcionario.nombre}</div>
                <div className="text-sm text-gray-600">{funcionario.cargo}</div>
                <div className="text-xs text-gray-500">{funcionario.telefono} • {funcionario.email}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarFuncionario(funcionario)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => eliminarFuncionario(funcionario.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Firma de Iskharly */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaSignature className="mr-2 text-green-600" />
          Firma del Gerente Técnico (Iskharly)
        </h3>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-center">
            <h4 className="font-semibold text-green-900 text-lg mb-2">
              Iskharly José Tapia Gutiérrez
            </h4>
            <p className="text-green-800 mb-1">Gerente Técnico</p>
            <p className="text-green-800 font-medium mb-2">PROSER AJUSTES SAS</p>
            
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex items-center justify-center space-x-2">
                <FaPhone className="text-green-600" />
                <span>PBX: (+57 5) 3857793 - +57 3166337503</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FaEnvelope className="text-green-600" />
                <span>itapia@proserpuertos.com.co</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subir firma de Iskharly */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Firma Digital de Iskharly</h4>
          <p className="text-sm text-blue-800 mb-3">
            Sube la imagen de la firma de Iskharly para que aparezca en el Word generado.
            <strong>Se guardará automáticamente para futuros usos.</strong>
          </p>
          
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = reader.result;
                    // Guardar la firma automáticamente en localStorage
                    guardarFirmaIskharly(base64);
                    alert('Firma de Iskharly subida y guardada correctamente. Se usará en el Word generado y se recordará para futuros usos.');
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
              id="firma-isharly"
            />
            <label
              htmlFor="firma-isharly"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Subir Firma de Iskharly
            </label>
          </div>
          
          {/* Mostrar firma subida */}
          {formData.firmaIskharly && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-800 text-sm">✅ Firma de Iskharly guardada y lista para usar</span>
                <button
                  onClick={() => {
                    onInputChange('firmaIskharly', '');
                    localStorage.removeItem('proser_firma_isharly');
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remover
                </button>
              </div>
              <img 
                src={formData.firmaIskharly} 
                alt="Firma de Iskharly" 
                className="mt-2 max-w-xs mx-auto border rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Gestión de Cargos */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Cargos</h3>
          <button
            onClick={agregarCargo}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            <FaPlus className="mr-1" />
            Agregar Cargo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {cargos.map((cargo, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{cargo}</span>
              <button
                onClick={() => eliminarCargo(cargo)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selección de Funcionario para Firma */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selección para Firma</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funcionario
            </label>
            <select
              value={funcionarioSeleccionado}
              onChange={(e) => handleFuncionarioChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un funcionario</option>
              {funcionarios.map((funcionario) => (
                <option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nombre} - {funcionario.cargo}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <input
              type="text"
              value={cargoSeleccionado}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Canvas de firma digital del funcionario seleccionado */}
        {funcionarioSeleccionado && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Firma Digital del Funcionario</h4>
            <p className="text-sm text-blue-800 mb-3">
              <strong>Dibuja tu firma directamente aquí:</strong> Usa el mouse o el dedo para firmar.
              <br />
              <span className="font-semibold text-green-700">
                ✅ La firma se guardará PERMANENTEMENTE para este funcionario
              </span>
              <br />
              <span className="text-xs text-gray-600">
                (Se recordará cada vez que selecciones este funcionario, a menos que la cambies)
              </span>
            </p>
            
            {/* Debug info */}
            <div className="mb-3 p-2 bg-gray-100 rounded text-xs">
              <strong>Debug:</strong> Canvas disponible: {canvasRef.current ? '✅ Sí' : '❌ No'} | 
              Contexto disponible: {contextRef.current ? '✅ Sí' : '❌ No'} | 
              Canvas listo: {canvasReady ? '✅ Sí' : '❌ No'} | 
              Funcionario seleccionado: {funcionarioSeleccionado ? '✅ Sí' : '❌ No'} |
              Estado dibujo: {isDrawing ? '✏️ Dibujando' : '⏸️ Parado'}
            </div>
            
            {/* Canvas para dibujar la firma */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className="border border-gray-400 rounded cursor-crosshair mx-auto block"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                onTouchCancel={stopDrawing}
              />
              
              {/* Controles del canvas */}
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => {
                    console.log('🧪 Probando canvas...');
                    if (contextRef.current) {
                      contextRef.current.fillStyle = 'red';
                      contextRef.current.fillRect(10, 10, 50, 50);
                      console.log('✅ Rectángulo de prueba dibujado');
                    } else {
                      console.error('❌ Contexto no disponible para prueba');
                    }
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center text-sm"
                >
                  🧪 Probar Canvas
                </button>
                <button
                  onClick={clearCanvas}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center text-sm"
                >
                  <FaEraser className="mr-1" />
                  Limpiar
                </button>
                <button
                  onClick={saveSignature}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center text-sm"
                >
                  <FaSave className="mr-1" />
                  Guardar Firma
                </button>
              </div>
            </div>
            
            {/* Mostrar firma guardada */}
            {firmaCanvas && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 text-sm">✅ Firma del funcionario guardada y lista para usar</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        console.log('🔄 Usuario quiere cambiar la firma del funcionario');
                        clearCanvas();
                        setFirmaCanvas(null);
                        // También remover la firma del funcionario en el array
                        if (funcionarioSeleccionado) {
                          const funcionarioActualizado = funcionarios.map(f => 
                            f.id === parseInt(funcionarioSeleccionado) 
                              ? { ...f, firma: null }
                              : f
                          );
                          setFuncionarios(funcionarioActualizado);
                          onInputChange('firmaFuncionario', '');
                          // Guardar inmediatamente en localStorage
                          localStorage.setItem('proser_funcionarios', JSON.stringify(funcionarioActualizado));
                          console.log('✅ Firma del funcionario removida, lista para nueva firma');
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      🔄 Cambiar Firma
                    </button>
                    <button
                      onClick={() => {
                        onInputChange('firmaFuncionario', '');
                        clearCanvas();
                        // También remover la firma del funcionario en el array
                        if (funcionarioSeleccionado) {
                          const funcionarioActualizado = funcionarios.map(f => 
                            f.id === parseInt(funcionarioSeleccionado) 
                              ? { ...f, firma: null }
                              : f
                          );
                          setFuncionarios(funcionarioActualizado);
                          // Guardar inmediatamente en localStorage
                          localStorage.setItem('proser_funcionarios', JSON.stringify(funcionarioActualizado));
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <img 
                  src={firmaCanvas} 
                  alt="Firma del funcionario" 
                  className="mt-2 max-w-xs mx-auto border rounded"
                />
              </div>
            )}
          </div>
        )}

        {/* Información del funcionario seleccionado */}
        {funcionarioSeleccionado && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Información del Funcionario Seleccionado:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Teléfono:</span> {formData.telefonoFuncionario}
              </div>
              <div>
                <span className="font-medium">Email:</span> {formData.emailFuncionario}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vista previa de firma */}
      {funcionarioSeleccionado && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa de Firma</h3>
          
          <div className="border border-gray-200 rounded-lg p-6 text-center">
            <div className="h-20 border-b-2 border-gray-300 mb-4"></div>
            <p className="font-medium text-gray-800 text-lg">
              {formData.funcionarioFirma || 'Nombre del funcionario'}
            </p>
            <p className="text-gray-600">
              {formData.cargoFuncionario || 'Cargo del funcionario'}
            </p>
            <p className="text-gray-600 font-medium mt-2">PROSER AJUSTES SAS</p>
            <p className="text-sm text-gray-500 mt-1">
              {formData.telefonoFuncionario || 'Teléfono'} • {formData.emailFuncionario || 'Email'}
            </p>
          </div>
        </div>
      )}

      {/* Modal para agregar/editar funcionario */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modoEdicion ? 'Editar Funcionario' : 'Agregar Funcionario'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={funcionarioEditando.nombre}
                  onChange={(e) => setFuncionarioEditando({
                    ...funcionarioEditando,
                    nombre: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo *
                </label>
                <select
                  value={funcionarioEditando.cargo}
                  onChange={(e) => setFuncionarioEditando({
                    ...funcionarioEditando,
                    cargo: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un cargo</option>
                  {cargos.map((cargo, index) => (
                    <option key={index} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={funcionarioEditando.telefono}
                  onChange={(e) => setFuncionarioEditando({
                    ...funcionarioEditando,
                    telefono: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={funcionarioEditando.email}
                  onChange={(e) => setFuncionarioEditando({
                    ...funcionarioEditando,
                    email: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={guardarFuncionario}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaSave className="mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
