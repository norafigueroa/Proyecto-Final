import React, { useState } from 'react';
import { registerCliente } from '../../services/ServicesRegistro';

function FormularioUsuario() {
  const [datos, setDatos] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const validar = () => {
    if (!datos.username || !datos.email || !datos.password || !datos.first_name || !datos.last_name) {
      setMensaje('❌ Todos los campos obligatorios deben estar llenos');
      return false;
    }
    if (datos.password.length < 8) {
      setMensaje('❌ La contraseña debe tener mínimo 8 caracteres');
      return false;
    }
    if (datos.password !== datos.confirmPassword) {
      setMensaje('❌ Las contraseñas no coinciden');
      return false;
    }
    if (!datos.email.includes('@')) {
      setMensaje('❌ Email inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    
    if (!validar()) return;

    setCargando(true);

    try {
      const { confirmPassword, ...datosEnvio } = datos;
      await registerCliente(datosEnvio);
      
      setMensaje('✅ Registro exitoso. Redirigiendo...');
      setDatos({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
      
      // Aquí redirige a login después de 2 segundos
      setTimeout(() => {
        window.location.href = '/Login';
      }, 2000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.errores || error.message;
      setMensaje(`❌ Error: ${JSON.stringify(errorMsg)}`);
    } finally {
      setCargando(false);
    }
  };

  return (
  <div className="container">
  <h2>Registro de Cliente</h2>

  {mensaje && (<p style={{ color: mensaje.startsWith('❌') ? 'red' : 'green' }}> {mensaje}</p>
  )}

  <div className="form-container">
    <div>
      <label>Nombre: *</label>
      <input type="text" name="first_name" value={datos.first_name} onChange={handleChange} disabled={cargando} required/>
    </div>

    <div>
      <label>Apellido: *</label>
      <input type="text" name="last_name" value={datos.last_name} onChange={handleChange} disabled={cargando} required/>
    </div>

    <div>
      <label>Usuario: *</label>
      <input type="text" name="username" value={datos.username} onChange={handleChange} disabled={cargando} required/>
    </div>

    <div>
      <label>Email: *</label>
      <input type="email" name="email" value={datos.email} onChange={handleChange} disabled={cargando} required/>
    </div>

    <div>
      <label>Teléfono:</label>
      <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} disabled={cargando}/>
    </div>

    <div>
      <label>Contraseña: *</label>
      <input type="password" name="password" value={datos.password} onChange={handleChange} disabled={cargando} required/>
    </div>

    <div>
      <label>Confirmar Contraseña: *</label>
      <input type="password" name="confirmPassword" value={datos.confirmPassword} onChange={handleChange} disabled={cargando} required/>
    </div>

    <br />
    <button disabled={cargando}onClick={handleSubmit}>
    {cargando ? 'Registrando...' : 'Registrarse'}
    </button>
  </div>
</div>

  );
}

export default FormularioUsuario;