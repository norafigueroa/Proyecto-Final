import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { postLogin } from '../../services/ServicesLogin';
import { useAuth } from '../../context/AuthContext';
import { getRestaurantes } from '../../services/ServicesRestaurantes';

import "./InicioSesion.css";

function InicioSesion() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resta, setResta] = useState([])

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

  useEffect(() => {
    async function obtener() {
      try {
        const data = await getRestaurantes()
        console.log("🔥 Restaurantes recibidos:", data);
        setResta(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar restaurantes:', error);
        setResta([]);
      }
    }

    obtener()
  }, []);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    // Validar campos
    if (!nombreUsuario || !contrasena) {
      setMensaje('Usuario y contraseña son requeridos');
      setCargando(false);
      return;
    }

    const credenciales = { username: nombreUsuario, password: contrasena };

    try {
      console.log('🔐 Iniciando sesión...');
      
      const respuesta = await postLogin(credenciales);
      console.log(respuesta);
      

      if (respuesta && respuesta.user) {
        const user = respuesta.user;
        login(user);

        console.log(resta);
        

        // Filtrar restaurante por el ID del usuario
        const restauranteAsignado = resta.find(
          (rest) => rest.usuario_propietario === user.id
        );

        // Validar si el restaurante del backend coincide con el del usuario
        const rol = (user.role || user.rol || user.tipo || "").toLowerCase();
        console.log(rol);
        

        // Validar restaurante SOLO si el rol es admin restaurante
        if (rol.includes("restaurante")) {

          if (!restauranteAsignado) {
            setMensaje("No tienes un restaurante asignado.");
            setCargando(false);
            return;
          }

          if (restauranteAsignado.usuario_propietario !== user.id) {
            setMensaje("El restaurante no coincide. Acceso denegado.");
            setCargando(false);
            return;
          }
        }

        setMensaje('✅ Inicio de sesión exitoso. Redirigiendo...');

        setTimeout(() => {

          if (rol.includes("general")) {
            navegar("/AdminGeneral");
            return;
          }

          if (rol.includes("restaurante")) {
            navegar(`/AdminRestaurante/${restauranteAsignado.id}`);
            return;
          }

          navegar("/");
        }, 1000);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Mostrar mensaje de error más específico
      if (error.response?.status === 401) {
        setMensaje('Usuario o contraseña incorrectos');

      } else if (error.response?.data?.error) {
        setMensaje(`${error.response.data.error}`);

      } else {
        setMensaje('Error en el servidor. Intenta más tarde');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='ContainerGeneral'>
      <div className="login-container">
      <h2>Inicio de Sesión</h2>

      {mensaje && (
        <p className={`login-message ${mensaje.startsWith("❌") ? "error" : "success"}`}>
          {mensaje}
        </p>
      )}

      <div className="login-form">
        <div>
          <label htmlFor="nombreUsuario">Usuario:</label>
          <input type="text" id="nombreUsuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} disabled={cargando}/>
        </div>

        <div>
          <label htmlFor="contrasena">Contraseña:</label>
          <input type="password" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} disabled={cargando}/>
        </div>

        <button className="login-button" onClick={manejarLogin} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        <br />
        <Link to="/RegisterUsuario">¿No tienes cuenta? Registrate</Link>
      </div>
    </div>
  </div>
  );
}

export default InicioSesion;