import React, { useState, useEffect } from 'react';
import { registerRestaurante } from '../../services/ServicesRegistro';
import { getCategorias } from '../../services/ServicesCategorias';
import "./FormularioRestaurante.css";

function FormularioRestaurante() {
  
  const [cate, setCate] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargacate, setCargaCate] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function obtener() {
      const respuesta = await getCategorias();
      setCate(respuesta);
    }
    obtener();
    setCargaCate(true);
  }, []);

  const [datos, setDatos] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    nombre_restaurante: '',
    direccion: '',
    telefono_restaurante: '',
    email_restaurante: '',
    categoria: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const validar = () => {
    if (!datos.first_name || !datos.last_name || !datos.email || !datos.password) {
      setMensaje('❌ Campos del propietario incompletos');
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
      setMensaje('❌ Email del propietario inválido');
      return false;
    }
    if (!datos.nombre_restaurante || !datos.direccion || !datos.telefono_restaurante || !datos.email_restaurante) {
      setMensaje('❌ Campos del restaurante incompletos');
      return false;
    }
    if (!datos.email_restaurante.includes('@')) {
      setMensaje('❌ Email del restaurante inválido');
      return false;
    }
    if (!datos.categoria) {
      setMensaje('❌ Debes seleccionar una categoría');
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
      datosEnvio.username = datos.first_name.toLowerCase().replace(' ', '_');

      await registerRestaurante(datosEnvio);

      setMensaje('✅ Restaurante registrado exitosamente (pendiente de verificación)');
      
      setDatos({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        nombre_restaurante: '',
        direccion: '',
        telefono_restaurante: '',
        email_restaurante: '',
        categoria: '',
      });

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
    <div className="form-container">
      <h2 className="form-title">Registro de Restaurante</h2>
      <p className="form-subtitle">Completa los datos para registrar tu restaurante</p>

      {mensaje && (
        <p className={`form-mensaje ${mensaje.startsWith('❌') ? 'error' : 'exito'}`}>
          {mensaje}
        </p>
      )}

      <form className="form-box" onSubmit={handleSubmit}>
        
        <h3 className="form-section-title">Datos del Propietario</h3>

        <div className="form-field">
          <label>Nombre: *</label>
          <input type="text" name="first_name" value={datos.first_name} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Apellido: *</label>
          <input type="text" name="last_name" value={datos.last_name} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Email: *</label>
          <input type="email" name="email" value={datos.email} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Contraseña: *</label>
          <input type="password" name="password" value={datos.password} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Confirmar Contraseña: *</label>
          <input type="password" name="confirmPassword" value={datos.confirmPassword} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Teléfono:</label>
          <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} disabled={cargando} />
        </div>

        <hr className="form-divider" />

        <h3 className="form-section-title">Datos del Restaurante</h3>

        <div className="form-field">
          <label>Nombre del Restaurante: *</label>
          <input type="text" name="nombre_restaurante" value={datos.nombre_restaurante} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Dirección: *</label>
          <input type="text" name="direccion" value={datos.direccion} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Teléfono del Restaurante: *</label>
          <input type="tel" name="telefono_restaurante" value={datos.telefono_restaurante} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Email del Restaurante: *</label>
          <input type="email" name="email_restaurante" value={datos.email_restaurante} onChange={handleChange} disabled={cargando} required />
        </div>

        <div className="form-field">
          <label>Categoría: *</label>
          <select name="categoria" value={datos.categoria} onChange={handleChange} disabled={cargando} required>
            <option value="">
              {!cargacate ? 'Cargando categorías...' : 'Selecciona una categoría'}
            </option>
            {cate.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
            ))}
          </select>
        </div>

        <button className="form-button" type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar Restaurante'}
        </button>
      </form>
    </div>
  );
}

export default FormularioRestaurante;