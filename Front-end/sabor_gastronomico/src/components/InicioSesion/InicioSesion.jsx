import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../../services/ServicesLogin';

// 🚨 IMPORTACIÓN CORREGIDA 🚨
import { useAuth } from '../../context/AuthContext'; 

function InicioSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const { login } = useAuth(); // Usar el hook de contexto para obtener la función login
  const navigate = useNavigate(); // Hook para la navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    const credenciales = { username, password };

    try {
      const respuesta = await postLogin(credenciales);

      if (respuesta.user) {
        // 1. ACTUALIZA ESTADO GLOBAL y guarda en localStorage (tarea de AuthContext)
        login(respuesta.user); 
        
        setMensaje('✅ Inicio de sesión exitoso. Redirigiendo...');

        // 2. REDIRECCIÓN CONDICIONAL BASADA EN EL ROL
        switch (respuesta.user.role) {
          case 'Admin General':
            navigate('/AdminGeneral');
            break;
          case 'Admin Restaurante':
            navigate('/AdminRestaurante');
            break;
          case 'Cliente':
          default: 
            navigate('/'); 
            break;
        }
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('❌ Credenciales inválidas o error en el servidor');
    }
  };

  return (
    <div className="container">
      <h2>Inicio de Sesión</h2>
      {mensaje && (
        <p style={{ color: mensaje.startsWith('❌') ? 'red' : 'green' }}>
          {mensaje}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default InicioSesion;