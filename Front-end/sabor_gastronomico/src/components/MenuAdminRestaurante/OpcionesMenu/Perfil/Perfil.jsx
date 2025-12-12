import React, { useState, useEffect } from 'react';
import './Perfil.css';
import Swal from "sweetalert2";
import PerfilService from "../../../../services/servicesAdminRest/ServicesPerfil";

const alertSuccess = (titulo, texto) => {
  Swal.fire({
    icon: "success",
    title: titulo,
    text: texto,
    confirmButtonColor: "#3085d6",
  });
};

const alertError = (titulo, texto) => {
  Swal.fire({
    icon: "error",
    title: titulo,
    text: texto,
    confirmButtonColor: "#d33",
  });
};

const alertWarning = (titulo, texto) => {
  Swal.fire({
    icon: "warning",
    title: titulo,
    text: texto,
    confirmButtonColor: "#f6c23e",
  });
};


function Perfil() {

  const [perfil, setPerfil] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    telefono: "",
    foto_perfil: null,
    groups: []
  });

  const info = JSON.parse(localStorage.getItem("usuario"));
  console.log(info);
  

  const [esEditando, setEsEditando] = useState(false);
  const [datosOriginales, setDatosOriginales] = useState({});

  // Modal cambiar contraseña
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");

  // Cargar datos desde la API 
  async function cargarPerfil() {
    try {
      const res = await PerfilService.obtenerPerfil(info.id);
      setPerfil(res.data);
      setDatosOriginales(res.data);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    }
  }

  useEffect(() => {
    cargarPerfil();
  }, []);

  // Manejar cambios del formulario
  function handleCambio(e) {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setPerfil((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      return;
    }

    setPerfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleGuardar() {
    try {
      
      console.log(perfil);

      const res = await PerfilService.actualizarPerfil(info.id, perfil);
      console.log(res);
      

      setEsEditando(false);
      setPerfil(res.data);
      setDatosOriginales(res.data);

      alertSuccess("Perfil actualizado", "Los datos se guardaron correctamente.");

    } catch (err) {
      alertError(
      "Error al actualizar",
      "Ocurrió un error al guardar los cambios del perfil.");
    }
  }

  // Cancelar edición
  function handleCancelar() {
    setPerfil(datosOriginales);
    setEsEditando(false);

    alertWarning("Cambios cancelados", "No se han guardado las modificaciones.");
  }

  // Guardar nueva contraseña
  async function handleCambiarPassword() {
    try {

      console.log("Nueva password:", nuevaPassword);

      // Validación
      if (!nuevaPassword || nuevaPassword.trim() === "") {
        alertWarning("Contraseña requerida", "Debe ingresar una contraseña.");
        return;
      }

      // Llamada al backend
      const res = await PerfilService.cambiarPassword(info.id, {
        password: nuevaPassword,
      });

      console.log("Respuesta cambiarPassword:", res);

      // Actualizar UI
      alertSuccess(
        "Contraseña actualizada",
        "La contraseña se cambió correctamente."
      );
      setMostrarModal(false);
      setNuevaPassword("");

    } catch (err) {
      alertError(
        "Error al cambiar contraseña",
        "No se pudo actualizar la contraseña. Intente de nuevo."
      );
    }
  }

  return (
    <div className='perfil-container'>
      
      {/* Modal de cambiar contraseña */}
      {mostrarModal && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <h2>Cambiar Contraseña</h2>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />

            <div className="modal-acciones">
              <button className="guardar" onClick={handleCambiarPassword}>
                Guardar
              </button>
              <button className="cancelar" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <header>
        <h1>Mi Perfil</h1>
      </header>

      <main className="perfil-content">

        <section className="datos-personales card">
          <h3>Datos Personales</h3>

          {esEditando ? (
            <div className="formulario-edicion">

              <label>
                Usuario:
                <input 
                  type="text" 
                  name="username" 
                  value={perfil.username} 
                  onChange={handleCambio}
                />
              </label>              

              <label>
                Nombre:
                <input 
                  type="text" 
                  name='first_name' 
                  value={perfil.first_name} 
                  onChange={handleCambio} 
                />
              </label>

              <label>
                Apellidos:
                <input 
                  type="text" 
                  name='last_name' 
                  value={perfil.last_name} 
                  onChange={handleCambio} 
                />
              </label>

              <label>
                Teléfono:
                <input 
                  type="text" 
                  name='telefono' 
                  value={perfil.telefono} 
                  onChange={handleCambio} 
                />
              </label>

              <div className="accionesPerfil">
                <button onClick={handleGuardar}>Guardar</button>
                <button onClick={handleCancelar}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="info-visualizacion">
              <p><strong>Usuario:</strong> {perfil.username}</p>
              <p><strong>Nombre:</strong> {perfil.first_name} {perfil.last_name}</p>
              <p><strong>Teléfono:</strong> {perfil.telefono}</p>          
              <p><strong>Email:</strong> {perfil.email}</p>
              <button className='btn-editar' onClick={() => setEsEditando(true)}>Editar Información</button>
            </div>
          )}
        </section>

        <section className="configuracion-seguridad card">
          <h3>Seguridad</h3>
          <button className='btn-password' onClick={() => setMostrarModal(true)}>Cambiar Contraseña</button>
        </section>

      </main>
    </div>
  );
}

export default Perfil;
