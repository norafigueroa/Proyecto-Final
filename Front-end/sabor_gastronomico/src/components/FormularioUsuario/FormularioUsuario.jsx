import React, { useState } from 'react';
import Swal from "sweetalert2";
import { registerCliente } from '../../services/ServicesRegistro';
import "./FormularioUsuario.css";

function FormularioUsuario() {

  // Función mejorada para capitalizar correctamente
  const capitalizar = (texto) => {
    if (!texto) return '';
    const limpio = texto.trim();
    
    // Convertir a minúsculas primero
    let resultado = limpio.toLowerCase();
    
    // Capitalizar solo la primera letra usando expresión regular
    // Esto evita problemas con tildes
    resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);
    
    return resultado;
  };

  // Función alternativa si necesitas capitalizar cada palabra
  const capitalizarPalabras = (texto) => {
    if (!texto) return '';
    return texto
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  };

  const [datos, setDatos] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validar = () => {
    const erroresTemp = {};
    const nombre = datos.first_name.trim();
    const apellido = datos.last_name.trim();
    const usuario = datos.username.trim();
    const correo = datos.email.trim();
    const telefono = datos.telefono.trim();
    const contrasena = datos.password;
    const confirmar = datos.confirmPassword;

    // Validar campos vacíos
    if (!nombre) erroresTemp.first_name = "El nombre es obligatorio";
    if (!apellido) erroresTemp.last_name = "El apellido es obligatorio";
    if (!usuario) erroresTemp.username = "El usuario es obligatorio";
    if (!correo) erroresTemp.email = "El email es obligatorio";
    if (!telefono) erroresTemp.telefono = "El teléfono es obligatorio";
    if (!contrasena) erroresTemp.password = "La contraseña es obligatoria";
    if (!confirmar) erroresTemp.confirmPassword = "Confirmar contraseña es obligatorio";

    // Validar longitud mínima
    if (nombre && nombre.length < 3) {
      erroresTemp.first_name = "El nombre debe tener mínimo 3 caracteres";
    }
    if (apellido && apellido.length < 3) {
      erroresTemp.last_name = "El apellido debe tener mínimo 3 caracteres";
    }
    if (usuario && usuario.length < 3) {
      erroresTemp.username = "El usuario debe tener mínimo 3 caracteres";
    }

    // Validar solo letras en nombre y apellido
    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (nombre && !regexLetras.test(nombre)) {
      erroresTemp.first_name = "El nombre solo puede contener letras y espacios";
    }
    if (apellido && !regexLetras.test(apellido)) {
      erroresTemp.last_name = "El apellido solo puede contener letras y espacios";
    }

    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo && !regexEmail.test(correo)) {
      erroresTemp.email = "El email no es válido";
    }

    // Validar teléfono (solo números, mínimo 7 dígitos)
    const regexTelefono = /^\d{7,}$/;
    if (telefono && !regexTelefono.test(telefono)) {
      erroresTemp.telefono = "El teléfono debe contener solo números (mínimo 7 dígitos)";
    }

    // Validar contraseña
    if (contrasena && contrasena.length < 8) {
      erroresTemp.password = "La contraseña debe tener mínimo 8 caracteres";
    }

    // Validar coincidencia de contraseñas
    if (contrasena && confirmar && contrasena !== confirmar) {
      erroresTemp.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      Swal.fire("Datos incompletos o inválidos", "Revisa los campos con error", "error");
      return;
    }

    setCargando(true);

    try {
      const { confirmPassword, ...datosEnvio } = datos;

      // Aplicar capitalización correcta
      datosEnvio.first_name = capitalizar(datosEnvio.first_name);
      datosEnvio.last_name = capitalizar(datosEnvio.last_name);
      datosEnvio.username = datosEnvio.username.trim();
      datosEnvio.email = datosEnvio.email.trim().toLowerCase();
      datosEnvio.telefono = datosEnvio.telefono.trim();

      await registerCliente(datosEnvio);

      await Swal.fire({
        title: "Registro exitoso",
        text: "Tu cuenta fue registrada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      setDatos({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
      setErrores({});

      window.location.href = "/Login";

    } catch (error) {
      const errorMsg = error.response?.data?.errores || error.message;
      Swal.fire({
        title: "Error al registrar",
        html: `<p>${JSON.stringify(errorMsg)}</p>`,
        icon: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h2>Registro de Cliente</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre: *</label>
            <input
              type="text"
              name="first_name"
              placeholder="Escribe tu nombre"
              value={datos.first_name}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.first_name && <span className="error">{errores.first_name}</span>}
          </div>

          <div>
            <label>Apellido: *</label>
            <input
              type="text"
              name="last_name"
              placeholder="Escribe tu apellido"
              value={datos.last_name}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.last_name && <span className="error">{errores.last_name}</span>}
          </div>

          <div>
            <label>Usuario: *</label>
            <input
              type="text"
              name="username"
              placeholder="Escribe tu usuario"
              value={datos.username}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.username && <span className="error">{errores.username}</span>}
          </div>

          <div>
            <label>Email: *</label>
            <input
              type="email"
              name="email"
              placeholder="Escribe tu correo"
              value={datos.email}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.email && <span className="error">{errores.email}</span>}
          </div>

          <div>
            <label>Teléfono: *</label>
            <input
              type="tel"
              name="telefono"
              placeholder="Escribe tu teléfono"
              value={datos.telefono}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.telefono && <span className="error">{errores.telefono}</span>}
          </div>

          <div>
            <label>Contraseña: *</label>
            <input
              type="password"
              name="password"
              placeholder="Escribe tu contraseña"
              value={datos.password}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.password && <span className="error">{errores.password}</span>}
          </div>

          <div>
            <label>Confirmar Contraseña: *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              value={datos.confirmPassword}
              onChange={handleChange}
              disabled={cargando}
              required
            />
            {errores.confirmPassword && <span className="error">{errores.confirmPassword}</span>}
          </div>

          <br />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioUsuario;