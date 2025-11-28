import React, { useState, useEffect } from 'react';
import './Perfil.css';
import PerfilService from "../../../../services/servicesAdminRest/ServicesPerfil";

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

    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    }
  }

  // Cancelar edición
  function handleCancelar() {
    setPerfil(datosOriginales);
    setEsEditando(false);
  }

  // Guardar nueva contraseña
  async function handleCambiarPassword() {
    try {

      console.log("Nueva password:", nuevaPassword);

      // Validación
      if (!nuevaPassword || nuevaPassword.trim() === "") {
        alert("Debe ingresar una contraseña.");
        return;
      }

      // Llamada al backend
      const res = await PerfilService.cambiarPassword(info.id, {
        password: nuevaPassword,
      });

      console.log("Respuesta cambiarPassword:", res);

      // Actualizar UI
      alert("Contraseña cambiada con éxito");
      setMostrarModal(false);
      setNuevaPassword("");

    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      alert("Error al cambiar contraseña");
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

              <label>
                Foto de perfil:
                <input 
                  type="file" 
                  name="foto_perfil" 
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
              <p><strong>Email:</strong> {perfil.email}</p>
              <p><strong>Nombre:</strong> {perfil.first_name} {perfil.last_name}</p>
              <p><strong>Teléfono:</strong> {perfil.telefono}</p>

              {perfil.foto_perfil && (
                <img 
                  src={perfil.foto_perfil} 
                  alt="Foto de perfil" 
                  className="img-perfil"
                />
              )}

              <button onClick={() => setEsEditando(true)}>Editar Información</button>
            </div>
          )}
        </section>

        <section className="configuracion-seguridad card">
          <h3>Seguridad</h3>
          <button onClick={() => setMostrarModal(true)}>Cambiar Contraseña</button>
        </section>

      </main>
    </div>
  );
}

export default Perfil;
