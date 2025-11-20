import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

function InicioAdminGeneral() {
  const { usuario, logout  } = useAuth(); 
  const navegar = useNavigate();

  const manejarCerrarSesion = () => {
    logout (); 
    navegar('/Login');
  };

  if (!usuario) {
    return <div>Acceso no autorizado. Redirigiendo...</div>;
  }

  return (
    <div>
      <header>
          <h1>Panel Administrativo General</h1>
          
          <button onClick={manejarCerrarSesion}>
              Cerrar Sesión
          </button>
      </header>

      <div>
          <h2>Bienvenido, {usuario.first_name || usuario.username}</h2>
          <p>
              Tu nivel de acceso es: <span>{usuario.role}</span>
          </p>

          <section>
              <div>
                  <h3>Gestión de Restaurantes</h3>
                  <p>Aprobar y asignar administradores.</p>
              </div>
              <div>
                  <h3>Control de Usuarios</h3>
                  <p>Revisión y mantenimiento de las cuentas.</p>
              </div>
              <div>
                  <h3>Configuración General</h3>
                  <p>Ajustes globales de la plataforma.</p>
              </div>
          </section>

      </div>
    </div>
  );
}

export default InicioAdminGeneral;