import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarParcialUsuario,
  eliminarUsuario,
} from '../../../../services/ServicesAdminGeneral/ServicesUsuarios';
import { obtenerGrupos } from '../../../../services/ServicesAdminGeneral/ServicesRoles';
import './UsuarioAdminGeneral.css';

function UsuarioAdminGeneral() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtroGrupo, setFiltroGrupo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [formulario, setFormulario] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    groups: [],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [usuarios, filtroGrupo, busqueda]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [usuariosData, gruposData] = await Promise.all([
        obtenerUsuarios(),
        obtenerGrupos(),
      ]);

      const usuariosArray = Array.isArray(usuariosData) ? usuariosData : usuariosData.results || [];
      const gruposArray = Array.isArray(gruposData) ? gruposData : gruposData.results || [];

      setUsuarios(usuariosArray);
      setGrupos(gruposArray);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    } finally {
      setCargando(false);
    }
  };

  const filtrarUsuarios = () => {
    let filtrados = usuarios;

    if (filtroGrupo !== 'todos') {
      filtrados = filtrados.filter(u => 
        u.groups && u.groups.some(g => g === parseInt(filtroGrupo) || g.id === parseInt(filtroGrupo))
      );
    }

    if (busqueda) {
      filtrados = filtrados.filter(u =>
        u.username.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.first_name.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.last_name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setUsuariosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const obtenerNombreGrupo = (grupoId) => {
    const grupo = grupos.find(g => g.id === grupoId);
    return grupo ? grupo.name : 'Sin grupo';
  };

  const handleAbrirModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario);
      setFormulario({
        username: usuario.username || '',
        email: usuario.email || '',
        first_name: usuario.first_name || '',
        last_name: usuario.last_name || '',
        telefono: usuario.telefono || '',
        password: '',
        confirmPassword: '',
        groups: usuario.groups || [],
      });
    } else {
      setEditando(null);
      setFormulario({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        groups: [],
      });
    }
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
  };

  const handleCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleCambioGrupos = (e) => {
    const grupoId = parseInt(e.target.value);
    const gruposActuales = Array.isArray(formulario.groups) ? formulario.groups : [];
    
    if (gruposActuales.includes(grupoId)) {
      setFormulario({
        ...formulario,
        groups: gruposActuales.filter(g => g !== grupoId),
      });
    } else {
      setFormulario({
        ...formulario,
        groups: [...gruposActuales, grupoId],
      });
    }
  };

  const handleGuardar = async () => {
    // Validar campos obligatorios
    if (!formulario.username || !formulario.email || !formulario.first_name) {
      Swal.fire('Error', 'Username, email y nombre son obligatorios', 'error');
      return;
    }

    // Si es nuevo, validar contraseña
    if (!editando) {
      if (!formulario.password) {
        Swal.fire('Error', 'Contraseña es obligatoria para nuevos usuarios', 'error');
        return;
      }

      if (formulario.password.length < 8) {
        Swal.fire('Error', 'Contraseña debe tener mínimo 8 caracteres', 'error');
        return;
      }

      if (formulario.password !== formulario.confirmPassword) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
      }

      if (!formulario.email.includes('@')) {
        Swal.fire('Error', 'Email inválido', 'error');
        return;
      }

      if (formulario.groups.length === 0) {
        Swal.fire('Error', 'Debes seleccionar al menos un grupo', 'error');
        return;
      }
    }

    try {
      if (editando) {
        const datosActualizar = {
          email: formulario.email,
          first_name: formulario.first_name,
          last_name: formulario.last_name,
          telefono: formulario.telefono,
          groups: formulario.groups,
        };

        if (formulario.password) {
          datosActualizar.password = formulario.password;
        }

        await actualizarParcialUsuario(editando.id, datosActualizar);
        await Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
      } else {
        const datosNuevo = {
          username: formulario.username,
          email: formulario.email,
          first_name: formulario.first_name,
          last_name: formulario.last_name,
          telefono: formulario.telefono,
          password: formulario.password,
          groups: formulario.groups,
        };

        await crearUsuario(datosNuevo);
        await Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
      }

      handleCerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
    }
  };

  const handleEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarUsuario(id);
        await Swal.fire('Éxito', 'Usuario eliminado correctamente', 'success');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarParcialUsuario(id, { is_active: nuevoEstado });
      await Swal.fire('Éxito', `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success');
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
  };

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  if (cargando) {
    return <div className="uag-cargando-unico">Cargando usuarios...</div>;
  }

  return (
    <div className="uag-contenedor-principal-unico">
      <div className="uag-seccion-titulo-boton-unico">
        <h2 className="uag-titulo-unico">Gestión de Usuarios</h2>
        <button className="uag-btn-nuevo-unico" onClick={() => handleAbrirModal()}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="uag-seccion-filtros-unico">
        <select value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} className="uag-select-grupo-unico">
          <option value="todos">Todos los grupos</option>
          {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar por usuario, email o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="uag-input-buscar-unico"
        />
      </div>

      <div className="uag-contenedor-tabla-unico">
        <table className="uag-tabla-unico">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Grupo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.length > 0 ? (
              usuariosPaginados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.username}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.first_name} {usuario.last_name}</td>
                  <td>
                    {usuario.groups && usuario.groups.length > 0 ? (
                      usuario.groups.map((grupoId) => (
                        <span key={grupoId} className="uag-badge-grupo-unico">
                          {obtenerNombreGrupo(grupoId)}
                        </span>
                      ))
                    ) : (
                      <span className="uag-badge-grupo-unico sin-grupo">Sin grupo</span>
                    )}
                  </td>
                  <td>
                    <span className={`uag-badge-estado-unico ${usuario.is_active ? 'activo' : 'inactivo'}`}>
                      {usuario.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="uag-acciones-unico">
                    <button
                      className="uag-btn-accion-unico editar"
                      onClick={() => handleAbrirModal(usuario)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    {usuario.is_active ? (
                      <button
                        className="uag-btn-accion-unico desactivar"
                        onClick={() => handleCambiarEstado(usuario.id, false)}
                        title="Desactivar"
                      >
                        ⊘
                      </button>
                    ) : (
                      <button
                        className="uag-btn-accion-unico reactivar"
                        onClick={() => handleCambiarEstado(usuario.id, true)}
                        title="Reactivar"
                      >
                        ⟲
                      </button>
                    )}
                    <button
                      className="uag-btn-accion-unico eliminar"
                      onClick={() => handleEliminar(usuario.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="uag-sin-datos-unico">
                  No hay usuarios que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="uag-paginacion-unico">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
            ← Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>
            Siguiente →
          </button>
        </div>
      )}

      {modalAbierto && (
        <div className="uag-modal-overlay-unico" onClick={handleCerrarModal}>
          <div className="uag-modal-unico" onClick={(e) => e.stopPropagation()}>
            <div className="uag-modal-header-unico">
              <h3>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button className="uag-modal-cerrar-unico" onClick={handleCerrarModal}>✕</button>
            </div>

            <div className="uag-modal-contenido-unico">
              <div className="uag-form-fila-unico">
                <div className="uag-form-grupo-unico">
                  <label>Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formulario.username}
                    onChange={handleCambioFormulario}
                    placeholder="Usuario"
                    disabled={editando}
                  />
                </div>
                <div className="uag-form-grupo-unico">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={handleCambioFormulario}
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="uag-form-fila-unico">
                <div className="uag-form-grupo-unico">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formulario.first_name}
                    onChange={handleCambioFormulario}
                    placeholder="Nombre"
                  />
                </div>
                <div className="uag-form-grupo-unico">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formulario.last_name}
                    onChange={handleCambioFormulario}
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="uag-form-grupo-unico">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={handleCambioFormulario}
                  placeholder="Teléfono"
                />
              </div>

              {!editando && (
                <>
                  <div className="uag-form-fila-unico">
                    <div className="uag-form-grupo-unico">
                      <label>Contraseña *</label>
                      <input
                        type="password"
                        name="password"
                        value={formulario.password}
                        onChange={handleCambioFormulario}
                        placeholder="Contraseña"
                      />
                    </div>
                    <div className="uag-form-grupo-unico">
                      <label>Confirmar Contraseña *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formulario.confirmPassword}
                        onChange={handleCambioFormulario}
                        placeholder="Confirmar contraseña"
                      />
                    </div>
                  </div>
                </>
              )}

              {editando && (
                <div className="uag-form-grupo-unico">
                  <label>Nueva Contraseña (opcional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formulario.password}
                    onChange={handleCambioFormulario}
                    placeholder="Dejar vacío para mantener la contraseña actual"
                  />
                </div>
              )}

              <div className="uag-form-grupo-unico">
                <label>Grupo(s) *</label>
                <div className="uag-checkboxes-grupo-unico">
                  {grupos.map((grupo) => (
                    <label key={grupo.id} className="uag-checkbox-label-unico">
                      <input
                        type="checkbox"
                        value={grupo.id}
                        checked={formulario.groups.includes(grupo.id)}
                        onChange={handleCambioGrupos}
                      />
                      {grupo.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="uag-modal-footer-unico">
              <button className="uag-btn-cancelar-unico" onClick={handleCerrarModal}>Cancelar</button>
              <button className="uag-btn-guardar-unico" onClick={handleGuardar}>
                {editando ? 'Actualizar' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuarioAdminGeneral;