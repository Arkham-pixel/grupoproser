import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [login, setLogin] = useState('');
  const [pswd, setPswd] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: login, 2: código 2FA
  const [twoFACode, setTwoFACode] = useState('');
  const [infoCorreo, setInfoCorreo] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const requestData = { correo: login, password: pswd };
      console.log('🚀 Enviando petición login:', requestData);
      console.log('📡 URL:', 'http://localhost:3000/api/secur-auth/login');
      console.log('📦 Headers:', { 'Content-Type': 'application/json' });
      console.log('📄 JSON string:', JSON.stringify(requestData));
      
      const res = await axios.post('http://localhost:3000/api/secur-auth/login', requestData);
      console.log('✅ Respuesta login:', res.data);
      console.log('🔍 Verificando respuesta...');
      console.log('   - twoFARequired:', res.data.twoFARequired);
      console.log('   - token:', res.data.token ? 'SÍ' : 'NO');
      console.log('   - usuario:', res.data.usuario ? 'SÍ' : 'NO');
      console.log('   - email:', res.data.email);
      console.log('   - Respuesta completa:', JSON.stringify(res.data, null, 2));
      
      if (res.data.token && res.data.usuario) {
         // Login exitoso - guardar datos y redirigir
         localStorage.setItem('token', res.data.token);
         localStorage.setItem('tipoUsuario', 'secur');
         localStorage.setItem('rol', res.data.usuario.role);
         localStorage.setItem('login', res.data.usuario.login);
         localStorage.setItem('nombre', res.data.usuario.name);
         console.log('✅ Login exitoso - guardado en localStorage:', {
           token: res.data.token,
           tipoUsuario: 'secur',
           rol: res.data.usuario.role,
           login: res.data.usuario.login,
           nombre: res.data.usuario.name
         });
         navigate('/inicio');
       } else if (res.data.twoFARequired) {
         console.log('🔐 Activando pantalla 2FA...');
         console.log('   - Email para mostrar:', res.data.email);
         setStep(2);
         setInfoCorreo(res.data.email);
         setTwoFACode('');
         console.log('✅ Pantalla 2FA activada');
       } else {
         setError('Respuesta inesperada del servidor');
       }
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('🔐 Enviando código 2FA:', { correo: login, code: twoFACode });
      
      const res = await axios.post('http://localhost:3000/api/secur-auth/login/2fa', {
        correo: login,
        code: twoFACode
      });
      
      console.log('✅ Respuesta 2FA:', res.data);
      
      if (res.data.token && res.data.usuario && res.data.usuario.role) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('tipoUsuario', 'secur');
        localStorage.setItem('rol', res.data.usuario.role);
        localStorage.setItem('login', res.data.usuario.login);
        localStorage.setItem('nombre', res.data.usuario.name);
        
        console.log('✅ Login 2FA exitoso - guardado en localStorage:', {
          token: res.data.token,
          tipoUsuario: 'secur',
          rol: res.data.usuario.role,
          login: res.data.usuario.login,
          nombre: res.data.usuario.name
        });
        
        navigate('/inicio');
      } else {
        setError('Respuesta del servidor incompleta. Falta token o información del usuario.');
        console.error('❌ Respuesta incompleta:', res.data);
      }
    } catch (err) {
      console.error('❌ Error en 2FA:', err.response?.data);
      setError(err.response?.data?.message || 'Código incorrecto o expirado');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">
          APLICATIVO GRUPO PROSER
        </h1>
        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 border"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={pswd}
              onChange={e => setPswd(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 border"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium transition-colors"
            >
              Entrar
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-4">
            <p className="text-sm text-gray-700 mb-2">
              Se ha enviado un código de verificación a: <span className="font-semibold">{infoCorreo}</span>
            </p>
            <input
              type="text"
              placeholder="Código de verificación"
              value={twoFACode}
              onChange={e => setTwoFACode(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 border"
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium transition-colors"
            >
              Verificar código
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        )}
        <div className="mt-4 text-sm text-center">
          <a href="/register" className="text-blue-600 hover:underline">
            Registrarse
          </a>
          <span className="mx-2 text-gray-400">|</span>
          <a href="/reset-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
} 