import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import "./InicioAdminGeneral.css";

function InicioAdminGeneral() {
  const { usuario, logout } = useAuth(); 
  const navegar = useNavigate();

  const manejarCerrarSesion = () => {
    logout(); 
    navegar('/Login');
  };

  if (!usuario) {
    return <div className="no-acceso">Acceso no autorizado. Redirigiendo...</div>;
  }

  return (
    <div className="admin-container">

      <header className="admin-header">
        <h1 className="admin-title">Panel Administrativo General</h1>
        
        <button className="btn-cerrarPag" onClick={manejarCerrarSesion}>
          Cerrar Sesión
        </button>
      </header>

      <div className="admin-contenido">
        <h2 className="admin-bienvenida">
          Bienvenido, <span>{usuario.first_name || usuario.username}</span>
        </h2>

        <p className="admin-rol">
          Tu nivel de acceso es: <span>{usuario.role}</span>
        </p>

        <section className="admin-secciones">

          <div className="card-admin">
            <h3>Gestión de Restaurantes</h3>
            <p>Aprobar y asignar administradores.</p>
          </div>

          <div className="card-admin">
            <h3>Control de Usuarios</h3>
            <p>Revisión y mantenimiento de las cuentas.</p>
          </div>

          <div className="card-admin">
            <h3>Configuración General</h3>
            <p>Ajustes globales de la plataforma.</p>
          </div>

        </section>

      </div>
    </div>
  );
}

export default InicioAdminGeneral;