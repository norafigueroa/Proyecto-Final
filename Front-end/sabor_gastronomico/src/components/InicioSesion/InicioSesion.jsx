import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../../services/ServicesLogin';
import { useAuth } from '../../context/AuthContext';

function InicioSesion() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login, autenticado } = useAuth();
  const navegar = useNavigate();

  // Bloquear flecha atrás del navegador cuando estés logueado
  useEffect(() => {
    if (autenticado) {
      window.history.replaceState(null, null, window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, null, window.location.href);
      };
    }
  }, [autenticado]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    // Validar campos
    if (!nombreUsuario || !contrasena) {
      setMensaje('❌ Usuario y contraseña son requeridos');
      setCargando(false);
      return;
    }

    const credenciales = { username: nombreUsuario, password: contrasena };

    try {
      console.log('🔐 Iniciando sesión...');
      
      const respuesta = await postLogin(credenciales);

      if (respuesta && respuesta.user) {
        // Guardar usuario en el contexto (también en localStorage)
        login(respuesta.user);
        
        setMensaje('✅ Inicio de sesión exitoso. Redirigiendo...');
        
        // Limpiar campos
        setNombreUsuario('');
        setContrasena('');

        // Redirigir según el rol después de 1 segundo
        setTimeout(() => {
          switch (respuesta.user.role) {
            case 'Admin General':
              console.log('📍 Redirigiendo a Admin General');
              navegar('/AdminGeneral');
              break;
            case 'Admin Restaurante':
              console.log('📍 Redirigiendo a Admin Restaurante');
              navegar('/AdminRestaurante');
              break;
            case 'Cliente':
            default:
              console.log('📍 Redirigiendo a Home');
              navegar('/');
              break;
          }
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      
      // Mostrar mensaje de error más específico
      if (error.response?.status === 401) {
        setMensaje('❌ Usuario o contraseña incorrectos');
      } else if (error.response?.data?.error) {
        setMensaje(`❌ ${error.response.data.error}`);
      } else {
        setMensaje('❌ Error en el servidor. Intenta más tarde');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2>Inicio de Sesión</h2>
      
      {mensaje && <p>{mensaje}</p>}

      <div>
        <div>
          <label htmlFor="nombreUsuario">Usuario:</label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            disabled={cargando}
          />
        </div>

        <div>
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            disabled={cargando}
          />
        </div>

        <button onClick={manejarLogin} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </div>
  );
}

export default InicioSesion;