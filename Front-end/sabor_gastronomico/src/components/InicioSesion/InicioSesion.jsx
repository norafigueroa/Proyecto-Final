import React, { useState } from 'react';
import { postLogin } from '../../services/ServicesLogin';

function InicioSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    const credenciales = {
      username: username,
      password: password
    };

    try {
      const respuesta = await postLogin(credenciales);
      console.log('Respuesta del servidor:', respuesta);

      // Guardar el token en localStorage para futuras peticiones
      localStorage.setItem('access_token', respuesta.access);
      localStorage.setItem('refresh_token', respuesta.refresh);

      setMensaje('✅ Inicio de sesión exitoso');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('❌ Credenciales inválidas o error en el servidor');
    }
  };

  return (
    <div className="container">
      <h2>Inicio de Sesión</h2>
      {mensaje && <p style={{ color: mensaje.startsWith('❌') ? 'red' : 'green' }}>{mensaje}</p>}

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
