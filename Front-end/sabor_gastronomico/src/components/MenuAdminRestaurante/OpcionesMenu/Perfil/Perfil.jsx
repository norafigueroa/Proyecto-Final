import React, { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil() {

  // Datos de ejemplo para simular lo que cargaría una API
  const DATOS_MOCK = {
    nombre: 'Administrador Principal',
    email: 'admin@miempresa.com',
    ultimaContrasena: '2025-10-01',
    autenticacionDosFactores: true,
  };

  // 1. Estado para almacenar la información del perfil
  const [perfil, setPerfil] = useState({
    nombre: '',
    email: '',
    ultimaContrasena: '',
    autenticacionDosFactores: false,
  });

  // 2. Estado para manejar el modo de Edición/Visualización
  const [esEditando, setEsEditando] = useState(false);   
  
  // 3. Estado para guardar una copia de los datos originales mientras se edita (para cancelar)
  const [datosOriginales, setDatosOriginales] = useState({});

  // 4. useEffect para simular la carga de datos del servidor al montar el componente
  useEffect(() => {
    // Aquí es donde harías una llamada fetch/axios a tu API
    // Ejemplo: fetch('/api/perfil').then(res => setPerfil(res.data));
    
    // Por ahora, usamos los datos de ejemplo (mock)
    setPerfil(DATOS_MOCK);
    setDatosOriginales(DATOS_MOCK);
  }, []); // El array vacío asegura que solo se ejecute al montar

  // --- Funciones de Manejo ---

  // 5. Función para manejar los cambios en los campos del formulario
  const handleCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setPerfil(prevPerfil => ({
      ...prevPerfil,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 6. Función para activar el modo de edición
  const handleEditar = () => {
    // Guarda el estado actual como "original" antes de empezar a editar
    setDatosOriginales(perfil); 
    setEsEditando(true);
  };

  // 7. Función para guardar los cambios (simulando una llamada a la API)
  const handleGuardar = () => {
    // Aquí harías la llamada PUT/PATCH a tu API para actualizar los datos
    console.log('Guardando cambios:', perfil);

    // Si la llamada a la API es exitosa:
    setEsEditando(false);
    setDatosOriginales(perfil); // Actualiza la copia original con los nuevos datos
  };

  // 8. Función para cancelar la edición y revertir los cambios
  const handleCancelar = () => {
    setPerfil(datosOriginales); // Restaura el perfil a los datos guardados originalmente
    setEsEditando(false);
  };

  return (
    <div>
        <div className='perfil-container'>
          <header>
            <h1>Mi Perfil</h1>
          </header>
          <main className="perfil-content">
            <h2>Información y configuración de tu cuenta administrativa</h2>

            <section className="datos-personales card">
              <h3>Datos Personales</h3>

              {esEditando ? (
                //Modo Edicion
                <div className="formulario-edicion">
                  <label> Nombre: <input type="text" name='nombre' value={perfil.nombre} onChange={handleCambio}/></label>
                  <label> Email: <input type="email" name='email' value={perfil.email} onChange={handleCambio} disabled/></label>
                  
                  <div className="acciones">
                    <button onClick={handleGuardar}> Guardar </button>
                    <button onClick={handleCancelar} className='secundario'> Cancelar </button>
                  </div>
                </div>
              ) : ( 
                // Modo Visualización  
                <div className="info-visualizacion">
                  <p>Nombre: {perfil.nombre} </p>
                  <p>Email: {perfil.email} </p>
                  <button onClick={handleEditar}> Editar Información </button>
                </div> 
              )}
            </section>

            <section className="configuracion-seguridad card">
              <h3>Configuración de Seguridad</h3>
              <p>Último cambio de contraseña: {perfil.ultimaContrasena}</p>
              <button>Cambiar Contraseña</button>

              <label className="toggle-label"> Autenticación de dos factores: <input type="checkbox" name='autenticacionDosFactores' checked={perfil.autenticacionDosFactores} onChange={handleCambio} // Esta configuración se edita inmediatamente, no requiere el botón "Guardar" // En una aplicación real, harías una llamada a la API aquí. 
              /> {perfil.autenticacionDosFactores ? 'Activada' : 'Desactivada'} </label>
            </section>
          </main>
        </div>      
    </div>
  )
}

export default Perfil
