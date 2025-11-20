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
  });

  const [esEditando, setEsEditando] = useState(false);
  const [datosOriginales, setDatosOriginales] = useState({});

  // ------------------------------------------------------------------
  // Cargar datos desde la API
  // ------------------------------------------------------------------
  function cargarPerfil() {
    PerfilService.obtenerPerfil()
      .then((res) => {
        setPerfil(res.data);
        setDatosOriginales(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
      });
  }

  useEffect(() => {
    cargarPerfil();
  }, []);

  // ------------------------------------------------------------------
  // Manejar cambios del formulario
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Guardar edición
  // ------------------------------------------------------------------
  function handleGuardar() {
    const formData = new FormData();

    Object.entries(perfil).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    PerfilService.actualizarPerfil(formData)
      .then((res) => {
        setEsEditando(false);
        setPerfil(res.data);
        setDatosOriginales(res.data);
      })
      .catch((err) => {
        console.error("Error al actualizar perfil:", err);
      });
  }

  // ------------------------------------------------------------------
  // Cancelar edición
  // ------------------------------------------------------------------
  function handleCancelar() {
    setPerfil(datosOriginales);
    setEsEditando(false);
  }

  // ------------------------------------------------------------------
  // Cambiar contraseña
  // ------------------------------------------------------------------
  function handleCambiarPassword() {
    const nueva = prompt("Ingrese la nueva contraseña:");

    if (!nueva) return;

    PerfilService.cambiarPassword({ password: nueva })
      .then(() => alert("Contraseña cambiada con éxito"))
      .catch(() => alert("Error al cambiar contraseña"));
  }

  return (
    <div className='perfil-container'>
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

              <div className="acciones">
                <button onClick={handleGuardar}>Guardar</button>
                <button onClick={handleCancelar} className='secundario'>Cancelar</button>
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
          <button onClick={handleCambiarPassword}>Cambiar Contraseña</button>
        </section>

      </main>
    </div>
  );
}

export default Perfil;
