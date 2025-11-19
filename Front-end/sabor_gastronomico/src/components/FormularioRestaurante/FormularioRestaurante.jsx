import React, { useState } from 'react';
import { registerRestaurante } from '../../services/ServicesRegistro';
import { useCategorias } from '../../context/CategoriasContext';

function FormularioRestaurante() {
  const { categorias, cargando: categsCargando } = useCategorias();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const [datos, setDatos] = useState({
    // Datos del Admin
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    
    // Datos del Restaurante
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
    // Validar datos del admin
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

    // Validar datos del restaurante
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
  
  const respuesta = await registerRestaurante(datosEnvio);

      setMensaje('✅ Restaurante registrado exitosamente (pendiente de verificación)');
      
      // Limpiar formulario
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

      // Redirigir después de 2 segundos
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
      <h2>Registro de Restaurante</h2>
      <p>Completa los datos para registrar tu restaurante</p>

      {mensaje && (
        <p style={{ color: mensaje.startsWith('❌') ? 'red' : 'green' }}>
          {mensaje}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Datos del Propietario</h3>

        <div>
          <label>Nombre: *</label>
          <input
            type="text"
            name="first_name"
            value={datos.first_name}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Apellido: *</label>
          <input
            type="text"
            name="last_name"
            value={datos.last_name}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Email: *</label>
          <input
            type="email"
            name="email"
            value={datos.email}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Contraseña: *</label>
          <input
            type="password"
            name="password"
            value={datos.password}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Confirmar Contraseña: *</label>
          <input
            type="password"
            name="confirmPassword"
            value={datos.confirmPassword}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={datos.telefono}
            onChange={handleChange}
            disabled={cargando}
          />
        </div>

        <hr />
        <h3>Datos del Restaurante</h3>

        <div>
          <label>Nombre del Restaurante: *</label>
          <input
            type="text"
            name="nombre_restaurante"
            value={datos.nombre_restaurante}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Dirección: *</label>
          <input
            type="text"
            name="direccion"
            value={datos.direccion}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Teléfono del Restaurante: *</label>
          <input
            type="tel"
            name="telefono_restaurante"
            value={datos.telefono_restaurante}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Email del Restaurante: *</label>
          <input
            type="email"
            name="email_restaurante"
            value={datos.email_restaurante}
            onChange={handleChange}
            disabled={cargando}
            required
          />
        </div>

        <div>
          <label>Categoría: *</label>
          <select
            name="categoria"
            value={datos.categoria}
            onChange={handleChange}
            disabled={cargando || categsCargando}
            required
          >
            <option value="">
              {categsCargando ? 'Cargando categorías...' : 'Selecciona una categoría'}
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>
        </div>

        <br />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar Restaurante'}
        </button>
      </form>
    </div>
  );
}

export default FormularioRestaurante;