import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { subirImagenCloudinary, actualizarFotoPerfil, obtenerPerfilUsuario } from '../../services/ServicesAdminGeneral/ServicesPerfilUsuario';

// Importar componentes de opciones
import DashboardGeneral from './OpcionesMenuGeneral/DashboardGeneral/DashboardGeneral';
import RestauranteAdminGeneral from './OpcionesMenuGeneral/RestauranteAdminGeneral/RestauranteAdminGeneral';
import UsuarioAdminGeneral from './OpcionesMenuGeneral/UsuarioAdminGeneral/UsuarioAdminGeneral';
import BlogAdminGeneral from './OpcionesMenuGeneral/BlogAdminGeneral/BlogAdminGeneral';
import SitiosTuristicosGeneral from './OpcionesMenuGeneral/SitiosTuristicosGeneral/SitiosTuristicosGeneral';
import ConfiguracionGeneral from './OpcionesMenuGeneral/ConfiguracionGeneral/ConfiguracionGeneral';
import MensajesContactoGeneral from './OpcionesMenuGeneral/MensajesContactoGeneral/MensajesContactoGeneral';

import './MenuAdminGeneral.css';

function MenuAdminGeneral() {
  const { usuario, logout, login } = useAuth();
  const navegar = useNavigate();
  const [seccionActual, setSeccionActual] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarModalFoto, setMostrarModalFoto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(usuario?.foto_perfil || null);
  const [cargandoFoto, setCargandoFoto] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  // Limpia URL cuando viene con "image/upload/" delante
  const limpiarUrl = (url) => {
    if (!url) return url;
    return url.includes("image/upload/")
      ? url.replace("image/upload/", "")
      : url;
  };

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
      id: 'mensajes',
      nombre: 'Mensajes',
      icono: '📨',
      descripcion: 'Contactos y consultas',
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

  const handleSeleccionarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Solo se permiten archivos de imagen', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'La imagen no debe superar 5MB', 'error');
        return;
      }

      setArchivoSeleccionado(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubirFoto = async () => {
    if (!archivoSeleccionado) {
      Swal.fire('Error', 'Por favor selecciona una imagen', 'error');
      return;
    }

    try {
      setCargandoFoto(true);

      // Subir a Cloudinary
      const urlImagen = await subirImagenCloudinary(archivoSeleccionado);

      // Actualizar en la BD
      await actualizarFotoPerfil(usuario.id, urlImagen);

      // Limpiar URL antes de guardar en el estado
      const urlLimpia = limpiarUrl(urlImagen);
      setFotoPerfil(urlLimpia);

      // Obtener el perfil actualizado desde la API
      const perfilActualizado = await obtenerPerfilUsuario(usuario.id);
      
      // Actualizar el contexto con el usuario actualizado
      const usuarioActualizado = {
        ...usuario,
        foto_perfil: perfilActualizado.foto_perfil
      };
      login(usuarioActualizado);
      
      Swal.fire(
        '¡Éxito!',
        'Tu foto de perfil ha sido actualizada',
        'success'
      );

      handleCerrarModal();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'No se pudo subir la imagen. Intenta nuevamente.', 'error');
    } finally {
      setCargandoFoto(false);
    }
  };

  const handleEliminarFoto = async () => {
    const resultado = await Swal.fire({
      title: '¿Eliminar foto de perfil?',
      text: 'Volverá a mostrar la inicial de tu nombre',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!resultado.isConfirmed) return;

    try {
      setCargandoFoto(true);

      // Actualizar en la BD sin foto (null o vacío)
      await actualizarFotoPerfil(usuario.id, null);

      // Limpiar estado local
      setFotoPerfil(null);

      // Obtener el perfil actualizado desde la API
      const perfilActualizado = await obtenerPerfilUsuario(usuario.id);
      
      // Actualizar el contexto con el usuario actualizado
      const usuarioActualizado = {
        ...usuario,
        foto_perfil: perfilActualizado.foto_perfil
      };
      login(usuarioActualizado);
      
      Swal.fire(
        '¡Éxito!',
        'Foto de perfil eliminada',
        'success'
      );

      handleCerrarModal();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'No se pudo eliminar la imagen. Intenta nuevamente.', 'error');
    } finally {
      setCargandoFoto(false);
    }
  };

  const handleLimpiarFoto = () => {
    setArchivoSeleccionado(null);
    setPreviewFoto(null);
  };

  const handleCerrarModal = () => {
    setMostrarModalFoto(false);
    handleLimpiarFoto();
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
      case 'sitios':
        return <SitiosTuristicosGeneral />;
      case 'mensajes':
        return <MensajesContactoGeneral />;
      case 'configuracion':
        return <ConfiguracionGeneral />;
      default:
        return <DashboardGeneral />;
    }
  };

  const fotoPerfilLimpia = limpiarUrl(fotoPerfil);

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
            <div className="menu-perfil-avatar-container">
              {fotoPerfilLimpia ? (
                <img src={fotoPerfilLimpia} alt="Perfil" className="menu-perfil-avatar-img" />
              ) : (
                <div className="menu-perfil-avatar">
                  {usuario.first_name.charAt(0).toUpperCase()}
                </div>
              )}

              <button
                className="menu-btn-editar-foto"
                onClick={() => setMostrarModalFoto(true)}
                title="Cambiar foto de perfil"
              >
                ✏️
              </button>
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

      {/* MODAL PARA SUBIR FOTO - Integrado */}
      {mostrarModalFoto && (
        <div className="modal-overlay-foto" onClick={handleCerrarModal}>
          <div className="modal-contenido-foto" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-foto">
              <h2>Cambiar foto de perfil</h2>
              <button className="modal-cerrar-foto" onClick={handleCerrarModal}>✖</button>
            </div>

            <div className="modal-body-foto">
              <p className="modal-usuario-foto">Usuario: <strong>{usuario.first_name} {usuario.last_name}</strong></p>

              <div className="zona-preview-foto">
                {previewFoto ? (
                  <img src={previewFoto} alt="Preview" className="preview-imagen-foto" />
                ) : (
                  <div className="placeholder-preview-foto">
                    <p>📸</p>
                    <p>Selecciona una imagen</p>
                  </div>
                )}
              </div>

              <div className="input-archivo-wrapper-foto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSeleccionarArchivo}
                  disabled={cargandoFoto}
                  id="input-foto-perfil"
                  className="input-archivo-foto"
                />
                <label htmlFor="input-foto-perfil" className="label-archivo-foto">
                  📁 Seleccionar imagen
                </label>
              </div>

              {archivoSeleccionado && (
                <div className="info-archivo-foto">
                  <p><strong>Archivo:</strong> {archivoSeleccionado.name}</p>
                  <p><strong>Tamaño:</strong> {(archivoSeleccionado.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
            </div>

            <div className="modal-footer-foto">
              <button
                className="btn-limpiar-foto"
                onClick={handleLimpiarFoto}
                disabled={!archivoSeleccionado || cargandoFoto}
              >
                🗑️ Limpiar
              </button>
              {fotoPerfilLimpia && (
                <button
                  className="btn-eliminar-foto"
                  onClick={handleEliminarFoto}
                  disabled={cargandoFoto}
                >
                  ❌ Eliminar foto
                </button>
              )}
              <button
                className="btn-cancelar-foto"
                onClick={handleCerrarModal}
                disabled={cargandoFoto}
              >
                Cancelar
              </button>
              <button
                className="btn-subir-foto"
                onClick={handleSubirFoto}
                disabled={!archivoSeleccionado || cargandoFoto}
              >
                {cargandoFoto ? '⏳ Subiendo...' : '✅ Subir foto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuAdminGeneral;