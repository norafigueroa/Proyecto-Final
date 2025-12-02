import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Importar componentes de opciones
import DashboardGeneral from './OpcionesMenuGeneral/DashboardGeneral/DashboardGeneral';
import RestauranteAdminGeneral from './OpcionesMenuGeneral/RestauranteAdminGeneral/RestauranteAdminGeneral';
import UsuarioAdminGeneral from './OpcionesMenuGeneral/UsuarioAdminGeneral/UsuarioAdminGeneral';
import BlogAdminGeneral from './OpcionesMenuGeneral/BlogAdminGeneral/BlogAdminGeneral';
//import SitiosTuristicosGeneral from './OpcionesMenuGeneral/SitiosTuristicosGeneral/SitiosTuristicosGeneral';
//import ConfiguracionGeneral from './OpcionesMenuGeneral/ConfiguracionGeneral/ConfiguracionGeneral';

import './MenuAdminGeneral.css';

function MenuAdminGeneral() {
  const { usuario, logout } = useAuth();
  const navegar = useNavigate();
  const [seccionActual, setSeccionActual] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Verificar que sea Admin General
  if (!usuario || usuario.role !== 'Admin General') {
    return (
      <div className="menu-no-acceso">
        <p>Acceso denegado. Solo Admin General puede acceder.</p>
      </div>
    );
  }

  const opcionesMenu = [
    {
      id: 'dashboard',
      nombre: 'Dashboard',
      icono: '📊',
      descripcion: 'Panel de control',
    },
    {
      id: 'restaurantes',
      nombre: 'Restaurantes',
      icono: '🏪',
      descripcion: 'Gestión de restaurantes',
    },
    {
      id: 'usuarios',
      nombre: 'Usuarios',
      icono: '👥',
      descripcion: 'Control de usuarios',
    },
    {
      id: 'blog',
      nombre: 'Blog',
      icono: '📝',
      descripcion: 'Contenido cultural',
    },
    {
      id: 'sitios',
      nombre: 'Sitios Turísticos',
      icono: '🗺️',
      descripcion: 'Lugares de interés',
    },
    {
      id: 'configuracion',
      nombre: 'Configuración',
      icono: '⚙️',
      descripcion: 'Ajustes generales',
    },
  ];

  const handleCerrarSesion = async () => {
    const resultado = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      await logout();
      navegar('/Login');
    }
  };

  const renderizarComponente = () => {
  switch (seccionActual) {
    case 'dashboard':
      return <DashboardGeneral />;
    case 'restaurantes':
      return <RestauranteAdminGeneral />;
    case 'usuarios':
      return <UsuarioAdminGeneral />;
    case 'blog':
      return <BlogAdminGeneral />;
    /*case 'sitios':
      return <SitiosTuristicosGeneral />;
    case 'configuracion':
      return <ConfiguracionGeneral />;*/
    default:
      return <DashboardGeneral />;
  }
};

  return (
    <div className="menu-admin-contenedor">
      {/* HEADER */}
      <header className="menu-admin-header">
        <button
          className="menu-toggle-btn"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <h1 className="menu-admin-titulo">El Sabor de la Perla</h1>
        <div className="menu-admin-usuario">
          <span>{usuario.first_name}</span>
          <button
            className="menu-btn-logout"
            onClick={handleCerrarSesion}
            title="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      </header>

      <div className="menu-admin-wrapper">
        {/* SIDEBAR */}
        <aside className={`menu-admin-sidebar ${menuAbierto ? 'activo' : ''}`}>
          <div className="menu-sidebar-perfil">
            <div className="menu-perfil-avatar">
              {usuario.first_name.charAt(0).toUpperCase()}
            </div>
            <div className="menu-perfil-info">
              <p className="menu-perfil-nombre">{usuario.first_name} {usuario.last_name}</p>
              <p className="menu-perfil-rol">{usuario.role}</p>
            </div>
          </div>

          <nav className="menu-sidebar-nav">
            {opcionesMenu.map((opcion) => (
              <button
                key={opcion.id}
                className={`menu-nav-item ${seccionActual === opcion.id ? 'activo' : ''}`}
                onClick={() => {
                  setSeccionActual(opcion.id);
                  setMenuAbierto(false);
                }}
              >
                <span className="menu-item-icono">{opcion.icono}</span>
                <div className="menu-item-texto">
                  <p className="menu-item-nombre">{opcion.nombre}</p>
                  <p className="menu-item-descripcion">{opcion.descripcion}</p>
                </div>
              </button>
            ))}
          </nav>

          <div className="menu-sidebar-footer">
            <button
              className="menu-btn-cerrar-sesion"
              onClick={handleCerrarSesion}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* OVERLAY PARA MÓVIL */}
        {menuAbierto && (
          <div
            className="menu-overlay"
            onClick={() => setMenuAbierto(false)}
          ></div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="menu-admin-contenido">
          {renderizarComponente()}
        </main>
      </div>
    </div>
  );
}

export default MenuAdminGeneral;