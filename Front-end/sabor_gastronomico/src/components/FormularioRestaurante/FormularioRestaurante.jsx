import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { registerRestaurante } from "../../services/ServicesRegistro";
import { getCategorias } from "../../services/ServicesCategorias";
import { ServicesInicio } from "../../services/servicesAdminRest/ServicesInicio";
import "./FormularioRestaurante.css";

function FormularioRestaurante() {
  const [cate, setCate] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargacate, setCargaCate] = useState(false);

  const esqueletoHorario = {
    lunes: { apertura: "", cierre: "", cerrado: false },
    martes: { apertura: "", cierre: "", cerrado: false },
    miercoles: { apertura: "", cierre: "", cerrado: false },
    jueves: { apertura: "", cierre: "", cerrado: false },
    viernes: { apertura: "", cierre: "", cerrado: false },
    sabado: { apertura: "", cierre: "", cerrado: false },
    domingo: { apertura: "", cierre: "", cerrado: false }
  }

  useEffect(() => {
    async function obtener() {
      const respuesta = await getCategorias();
      setCate(respuesta);
    }
    obtener();
    setCargaCate(true);
  }, []);

  const [datos, setDatos] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    nombre_restaurante: "",
    direccion: "",
    telefono_restaurante: "",
    email_restaurante: "",
    categoria: "",
  });

  // FORMATEAR: eliminar espacios extremos + capitalizar palabras
  const limpiarYCapitalizar = (texto) => {
    if (!texto) return "";
    let limpio = texto.trim().replace(/\s+/g, " "); // no doble espacios

    return limpio
      .split(" ")
      .map((p) =>
        p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    // Campos de texto que deben capitalizarse + permitir tildes
    const camposSoloTexto = ["first_name", "last_name", "nombre_restaurante"];

    if (camposSoloTexto.includes(name)) {
      finalValue = finalValue
        .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "") // solo letras, espacios y tildes
        .replace(/\s{2,}/g, " "); // evitar dobles espacios
    }

    setDatos({ ...datos, [name]: finalValue });
  };

  const validarCadenaBasica = (cadena, campo) => {
    const limpio = cadena.trim();

    if (limpio.length < 3) {
      Swal.fire("Texto demasiado corto", `${campo} debe tener mínimo 3 caracteres.`, "error");
      return false;
    }

    // Evitar cadenas repetidas como "aaa"
    if (/^(.)\1+$/.test(limpio)) {
      Swal.fire("Texto inválido", `${campo} no puede ser una cadena repetida como "aaa".`, "error");
      return false;
    }

    return true;
  };

  const validar = () => {
    // VALIDAR CAMPOS OBLIGATORIOS
    if (!datos.first_name || !datos.last_name || !datos.email || !datos.password) {
      Swal.fire("Datos incompletos", "Completa los datos del propietario", "error");
      return false;
    }

    // VALIDAR NOMBRE Y APELLIDO
    if (!validarCadenaBasica(datos.first_name, "El nombre")) return false;
    if (!validarCadenaBasica(datos.last_name, "El apellido")) return false;

    // VALIDAR NOMBRE DE RESTAURANTE
    if (!validarCadenaBasica(datos.nombre_restaurante, "El nombre del restaurante")) return false;

    // VALIDAR CONTRASEÑA
    if (datos.password.length < 8) {
      Swal.fire("Contraseña muy corta", "Debe tener mínimo 8 caracteres", "error");
      return false;
    }
    if (datos.password !== datos.confirmPassword) {
      Swal.fire("Contraseñas no coinciden", "Revisa las contraseñas ingresadas", "error");
      return false;
    }

    // VALIDAR EMAILS
    if (!datos.email.includes("@")) {
      Swal.fire("Email inválido", "El email del propietario no es válido", "error");
      return false;
    }
    if (!datos.email_restaurante.includes("@")) {
      Swal.fire("Email inválido", "El email del restaurante no es válido", "error");
      return false;
    }

    // VALIDAR CAMPOS DEL RESTAURANTE
    if (!datos.direccion || !datos.telefono_restaurante || !datos.email_restaurante) {
      Swal.fire("Datos incompletos", "Completa los datos del restaurante", "error");
      return false;
    }

    // CATEGORÍAS
    if (!datos.categoria) {
      Swal.fire("Categoría no seleccionada", "Debes elegir una categoría", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    setCargando(true);

    try {
      const { confirmPassword, ...datosEnvio } = datos;

      datosEnvio.first_name = limpiarYCapitalizar(datos.first_name);
      datosEnvio.last_name = limpiarYCapitalizar(datos.last_name);
      datosEnvio.nombre_restaurante = limpiarYCapitalizar(datos.nombre_restaurante);
      datosEnvio.direccion = limpiarYCapitalizar(datos.direccion);

      datosEnvio.username = datos.first_name.toLowerCase().replace(" ", "_");

      const retorno = await registerRestaurante(datosEnvio);
      console.log(retorno);
      
      const datosHorario = {
        restaurante: retorno.restaurante.id,
        horario: esqueletoHorario
      }
      const retornoHorario = await ServicesInicio.crearHorario(datosHorario)
      console.log(retornoHorario);
      

      Swal.fire({
        title: "Registro exitoso",
        text: "Tu restaurante fue registrado (pendiente de verificación)",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setDatos({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        telefono: "",
        nombre_restaurante: "",
        direccion: "",
        telefono_restaurante: "",
        email_restaurante: "",
        categoria: "",
      });

      setTimeout(() => {
        window.location.href = "/Login";
      }, 2000);
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
    <div className="form-container">
      <h2 className="form-title">Registro de Restaurante</h2>
      <p className="form-subtitle">Completa los datos para registrar tu restaurante</p>

      <form className="form-box" onSubmit={handleSubmit}>
        <h3 className="form-section-title">Datos del Propietario</h3>

        <div className="form-field">
          <label>Nombre: *</label>
          <input type="text" name="first_name" value={datos.first_name} onChange={handleChange} disabled={cargando} required placeholder="Escribe tu nombre"/>
        </div>

        <div className="form-field">
          <label>Apellido: *</label>
          <input type="text" name="last_name" value={datos.last_name} onChange={handleChange} disabled={cargando} required placeholder="Escribe tu apellido"/>
        </div>

        <div className="form-field">
          <label>Email: *</label>
          <input type="email" name="email" value={datos.email} onChange={handleChange} disabled={cargando} required placeholder="Ingresa tu correo electrónico"/>
        </div>

        <div className="form-field">
          <label>Contraseña: *</label>
          <input type="password" name="password" value={datos.password} onChange={handleChange} disabled={cargando} required placeholder="Crea una contraseña"/>
        </div>

        <div className="form-field">
          <label>Confirmar Contraseña: *</label>
          <input type="password" name="confirmPassword" value={datos.confirmPassword} onChange={handleChange} disabled={cargando} required placeholder="Confirma tu contraseña"/>
        </div>

        <div className="form-field">
          <label>Teléfono:</label>
          <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} disabled={cargando} placeholder="Ingresa tu número de teléfono"/>
        </div>

        <hr className="form-divider" />

        <h3 className="form-section-title">Datos del Restaurante</h3>

        <div className="form-field">
          <label>Nombre del Restaurante: *</label>
          <input type="text" name="nombre_restaurante" value={datos.nombre_restaurante} onChange={handleChange} disabled={cargando} required placeholder="Escribe el nombre del restaurante"/>
        </div>

        <div className="form-field">
          <label>Dirección: *</label>
          <input type="text" name="direccion" value={datos.direccion} onChange={handleChange} disabled={cargando} required placeholder="Dirección del restaurante"/>
        </div>

        <div className="form-field">
          <label>Teléfono del Restaurante: *</label>
          <input type="tel" name="telefono_restaurante" value={datos.telefono_restaurante} onChange={handleChange} disabled={cargando} required placeholder="Ingresa el teléfono del restaurante"/>
        </div>

        <div className="form-field">
          <label>Email del Restaurante: *</label>
          <input type="email" name="email_restaurante" value={datos.email_restaurante} onChange={handleChange} disabled={cargando} required placeholder="Ingresa el correo del restaurante"/>
        </div>

        <div className="form-field">
          <label>Categoría: *</label>
          <select name="categoria" value={datos.categoria} onChange={handleChange} disabled={cargando} required>
            <option value="">
              {!cargacate ? "Cargando categorías..." : "Selecciona una categoría"}
            </option>
            {cate.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
            ))}
          </select>
        </div>

        <button className="form-button" type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrar Restaurante"}
        </button>
      </form>
    </div>
  );
}

export default FormularioRestaurante;
