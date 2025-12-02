import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerRestaurantes,
  actualizarRestaurante,
  eliminarRestaurante,
  obtenerCategorias,
  registrarRestauranteConPropietario,
} from '../../../../services/ServicesAdminGeneral/ServicesRestaurantesGeneral';
import './RestauranteAdminGeneral.css';

function RestaurantesGeneral() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [formulario, setFormulario] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono_propietario: '',
    nombre_restaurante: '',
    descripcion: '',
    historia_negocio: '',
    direccion: '',
    longitud: '',
    latitud: '',
    telefono: '',
    email_restaurante: '',
    sitio_web: '',
    horario_apertura: '',
    horario_cierre: '',
    dias_operacion: '',
    categoria: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarRestaurantes();
  }, [restaurantes, filtroEstado, busqueda]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [restaurantesData, categoriasData] = await Promise.all([
        obtenerRestaurantes(),
        obtenerCategorias(),
      ]);
      
      const restaurantesArray = Array.isArray(restaurantesData) ? restaurantesData : restaurantesData.results || [];
      const categoriasArray = Array.isArray(categoriasData) ? categoriasData : categoriasData.results || [];
      
      setRestaurantes(restaurantesArray);
      setCategorias(categoriasArray);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los restaurantes', 'error');
    } finally {
      setCargando(false);
    }
  };

  const filtrarRestaurantes = () => {
    let filtrados = restaurantes;

    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(r => r.estado === filtroEstado);
    }

    if (busqueda) {
      filtrados = filtrados.filter(r =>
        r.nombre_restaurante.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.direccion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setRestaurantesFiltrados(filtrados);
    setPaginaActual(1);
  };

  const handleAbrirModal = (restaurante = null) => {
    if (restaurante) {
      setEditando(restaurante);
      setFormulario({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono_propietario: '',
        nombre_restaurante: restaurante.nombre_restaurante || '',
        descripcion: restaurante.descripcion || '',
        historia_negocio: restaurante.historia_negocio || '',
        direccion: restaurante.direccion || '',
        longitud: restaurante.longitud || '',
        latitud: restaurante.latitud || '',
        telefono: restaurante.telefono || '',
        email_restaurante: restaurante.email || '',
        sitio_web: restaurante.sitio_web || '',
        horario_apertura: restaurante.horario_apertura || '',
        horario_cierre: restaurante.horario_cierre || '',
        dias_operacion: restaurante.dias_operacion || '',
        categoria: restaurante.categoria || '',
        estado: restaurante.estado || 'pendiente',
      });
    } else {
      setEditando(null);
      setFormulario({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono_propietario: '',
        nombre_restaurante: '',
        descripcion: '',
        historia_negocio: '',
        direccion: '',
        longitud: '',
        latitud: '',
        telefono: '',
        email_restaurante: '',
        sitio_web: '',
        horario_apertura: '',
        horario_cierre: '',
        dias_operacion: '',
        categoria: '',
        estado: 'pendiente',
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

  const handleGuardar = async () => {
    // Validar campos obligatorios
    if (!formulario.nombre_restaurante || !formulario.direccion || !formulario.telefono || !formulario.email_restaurante) {
      Swal.fire('Error', 'Nombre, dirección, teléfono y email del restaurante son obligatorios', 'error');
      return;
    }

    // Si es nuevo, validar campos del propietario
    if (!editando) {
      if (!formulario.first_name || !formulario.last_name || !formulario.email || !formulario.password) {
        Swal.fire('Error', 'Nombre, apellido, email y contraseña del propietario son obligatorios', 'error');
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
        Swal.fire('Error', 'Email del propietario inválido', 'error');
        return;
      }

      if (!formulario.email_restaurante.includes('@')) {
        Swal.fire('Error', 'Email del restaurante inválido', 'error');
        return;
      }
    }

    try {
      if (editando) {
        // Editar restaurante existente
        const datosActualizar = {
          nombre_restaurante: formulario.nombre_restaurante,
          descripcion: formulario.descripcion,
          historia_negocio: formulario.historia_negocio,
          direccion: formulario.direccion,
          longitud: formulario.longitud || null,
          latitud: formulario.latitud || null,
          telefono: formulario.telefono,
          email: formulario.email_restaurante,
          sitio_web: formulario.sitio_web || null,
          horario_apertura: formulario.horario_apertura || null,
          horario_cierre: formulario.horario_cierre || null,
          dias_operacion: formulario.dias_operacion || null,
          categoria: formulario.categoria || null,
          estado: formulario.estado,
        };
        await actualizarRestaurante(editando.id, datosActualizar);
        Swal.fire('Éxito', 'Restaurante actualizado correctamente', 'success');
      } else {
        // Crear nuevo restaurante con propietario
        const datosRegistro = {
          first_name: formulario.first_name,
          last_name: formulario.last_name,
          email: formulario.email,
          password: formulario.password,
          telefono: formulario.telefono_propietario,
          username: formulario.first_name.toLowerCase().replace(' ', '_'),
          nombre_restaurante: formulario.nombre_restaurante,
          descripcion: formulario.descripcion,
          historia_negocio: formulario.historia_negocio,
          direccion: formulario.direccion,
          longitud: formulario.longitud || null,
          latitud: formulario.latitud || null,
          telefono_restaurante: formulario.telefono,
          email_restaurante: formulario.email_restaurante,
          sitio_web: formulario.sitio_web || null,
          horario_apertura: formulario.horario_apertura || null,
          horario_cierre: formulario.horario_cierre || null,
          dias_operacion: formulario.dias_operacion || null,
          categoria: formulario.categoria || null,
        };
        await registrarRestauranteConPropietario(datosRegistro);
        Swal.fire('Éxito', 'Restaurante y propietario creados correctamente', 'success');
      }
      handleCerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire('Error', 'No se pudo guardar el restaurante', 'error');
    }
  };

  const handleEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar restaurante?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarRestaurante(id);
        Swal.fire('Éxito', 'Restaurante eliminado correctamente', 'success');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el restaurante', 'error');
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarRestaurante(id, { estado: nuevoEstado });
      Swal.fire('Éxito', `Restaurante ${nuevoEstado} correctamente`, 'success');
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
  };

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const restaurantesPaginados = restaurantesFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(restaurantesFiltrados.length / itemsPorPagina);

  if (cargando) {
    return <div className="rga-cargando-unico">Cargando restaurantes...</div>;
  }

  return (
    <div className="rga-contenedor-principal-unico">
      <div className="rga-seccion-titulo-boton-unico">
        <h2 className="rga-titulo-unico">Gestión de Restaurantes</h2>
        <button className="rga-btn-nuevo-unico" onClick={() => handleAbrirModal()}>
          + Nuevo Restaurante
        </button>
      </div>

      <div className="rga-seccion-filtros-unico">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="rga-select-estado-unico">
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por nombre o dirección..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="rga-input-buscar-unico"
        />
      </div>

      <div className="rga-contenedor-tabla-unico">
        <table className="rga-tabla-unico">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {restaurantesPaginados.length > 0 ? (
              restaurantesPaginados.map((restaurante) => (
                <tr key={restaurante.id}>
                  <td>{restaurante.nombre_restaurante}</td>
                  <td>{restaurante.direccion}</td>
                  <td>{restaurante.telefono || '-'}</td>
                  <td>
                    <span className={`rga-badge-unico estado-${restaurante.estado}`}>
                      {restaurante.estado}
                    </span>
                  </td>
                  <td className="rga-acciones-unico">
                    <button
                      className="rga-btn-accion-unico editar"
                      onClick={() => handleAbrirModal(restaurante)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    {restaurante.estado === 'pendiente' && (
                      <>
                        <button
                          className="rga-btn-accion-unico aprobar"
                          onClick={() => handleCambiarEstado(restaurante.id, 'activo')}
                          title="Aprobar"
                        >
                          ✓
                        </button>
                        <button
                          className="rga-btn-accion-unico rechazar"
                          onClick={() => handleCambiarEstado(restaurante.id, 'inactivo')}
                          title="Rechazar"
                        >
                          ✕
                        </button>
                      </>
                    )}
                    {restaurante.estado === 'activo' && (
                      <button
                        className="rga-btn-accion-unico desactivar"
                        onClick={() => handleCambiarEstado(restaurante.id, 'inactivo')}
                        title="Desactivar"
                      >
                        ⊘
                      </button>
                    )}
                    {restaurante.estado === 'inactivo' && (
                      <button
                        className="rga-btn-accion-unico reactivar"
                        onClick={() => handleCambiarEstado(restaurante.id, 'activo')}
                        title="Reactivar"
                      >
                        ⟲
                      </button>
                    )}
                    <button
                      className="rga-btn-accion-unico eliminar"
                      onClick={() => handleEliminar(restaurante.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="rga-sin-datos-unico">
                  No hay restaurantes que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="rga-paginacion-unico">
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
        <div className="rga-modal-overlay-unico" onClick={handleCerrarModal}>
          <div className="rga-modal-unico" onClick={(e) => e.stopPropagation()}>
            <div className="rga-modal-header-unico">
              <h3>{editando ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h3>
              <button className="rga-modal-cerrar-unico" onClick={handleCerrarModal}>✕</button>
            </div>

            <div className="rga-modal-contenido-unico">
              {!editando && (
                <>
                  <div className="rga-form-grupo-unico">
                    <label style={{fontWeight: 'bold', color: '#1a4d6d'}}>Datos del Propietario</label>
                  </div>

                  <div className="rga-form-fila-unico">
                    <div className="rga-form-grupo-unico">
                      <label>Nombre *</label>
                      <input type="text" name="first_name" value={formulario.first_name} onChange={handleCambioFormulario} placeholder="Nombre del propietario" />
                    </div>
                    <div className="rga-form-grupo-unico">
                      <label>Apellido *</label>
                      <input type="text" name="last_name" value={formulario.last_name} onChange={handleCambioFormulario} placeholder="Apellido del propietario" />
                    </div>
                  </div>

                  <div className="rga-form-grupo-unico">
                    <label>Email del Propietario *</label>
                    <input type="email" name="email" value={formulario.email} onChange={handleCambioFormulario} placeholder="Email" />
                  </div>

                  <div className="rga-form-fila-unico">
                    <div className="rga-form-grupo-unico">
                      <label>Contraseña *</label>
                      <input type="password" name="password" value={formulario.password} onChange={handleCambioFormulario} placeholder="Contraseña" />
                    </div>
                    <div className="rga-form-grupo-unico">
                      <label>Confirmar Contraseña *</label>
                      <input type="password" name="confirmPassword" value={formulario.confirmPassword} onChange={handleCambioFormulario} placeholder="Confirmar contraseña" />
                    </div>
                  </div>

                  <div className="rga-form-grupo-unico">
                    <label>Teléfono del Propietario</label>
                    <input type="tel" name="telefono_propietario" value={formulario.telefono_propietario} onChange={handleCambioFormulario} placeholder="Teléfono" />
                  </div>

                  <hr style={{margin: '1rem 0', border: 'none', borderTop: '1px solid #e0e0e0'}} />
                </>
              )}

              <div className="rga-form-grupo-unico">
                <label style={{fontWeight: 'bold', color: '#1a4d6d'}}>Datos del Restaurante</label>
              </div>

              <div className="rga-form-grupo-unico">
                <label>Nombre del Restaurante *</label>
                <input type="text" name="nombre_restaurante" value={formulario.nombre_restaurante} onChange={handleCambioFormulario} placeholder="Nombre del restaurante" />
              </div>

              <div className="rga-form-grupo-unico">
                <label>Descripción</label>
                <textarea name="descripcion" value={formulario.descripcion} onChange={handleCambioFormulario} placeholder="Descripción del restaurante" rows="2" />
              </div>

              <div className="rga-form-grupo-unico">
                <label>Historia del Negocio</label>
                <textarea name="historia_negocio" value={formulario.historia_negocio} onChange={handleCambioFormulario} placeholder="Cuéntanos la historia del negocio" rows="2" />
              </div>

              <div className="rga-form-grupo-unico">
                <label>Dirección *</label>
                <input type="text" name="direccion" value={formulario.direccion} onChange={handleCambioFormulario} placeholder="Dirección" />
              </div>

              <div className="rga-form-fila-unico">
                <div className="rga-form-grupo-unico">
                  <label>Longitud</label>
                  <input type="number" name="longitud" value={formulario.longitud} onChange={handleCambioFormulario} placeholder="Longitud" step="0.000001" />
                </div>
                <div className="rga-form-grupo-unico">
                  <label>Latitud</label>
                  <input type="number" name="latitud" value={formulario.latitud} onChange={handleCambioFormulario} placeholder="Latitud" step="0.000001" />
                </div>
              </div>

              <div className="rga-form-fila-unico">
                <div className="rga-form-grupo-unico">
                  <label>Teléfono *</label>
                  <input type="tel" name="telefono" value={formulario.telefono} onChange={handleCambioFormulario} placeholder="Teléfono del restaurante" />
                </div>
                <div className="rga-form-grupo-unico">
                  <label>Email *</label>
                  <input type="email" name="email_restaurante" value={formulario.email_restaurante} onChange={handleCambioFormulario} placeholder="Email del restaurante" />
                </div>
              </div>

              <div className="rga-form-grupo-unico">
                <label>Sitio Web</label>
                <input type="url" name="sitio_web" value={formulario.sitio_web} onChange={handleCambioFormulario} placeholder="https://ejemplo.com" />
              </div>

              <div className="rga-form-fila-unico">
                <div className="rga-form-grupo-unico">
                  <label>Horario de Apertura</label>
                  <input type="time" name="horario_apertura" value={formulario.horario_apertura} onChange={handleCambioFormulario} />
                </div>
                <div className="rga-form-grupo-unico">
                  <label>Horario de Cierre</label>
                  <input type="time" name="horario_cierre" value={formulario.horario_cierre} onChange={handleCambioFormulario} />
                </div>
              </div>

              <div className="rga-form-grupo-unico">
                <label>Días de Operación</label>
                <input type="text" name="dias_operacion" value={formulario.dias_operacion} onChange={handleCambioFormulario} placeholder="Ej: Lunes a Viernes" />
              </div>

              <div className="rga-form-fila-unico">
                <div className="rga-form-grupo-unico">
                  <label>Categoría</label>
                  <select name="categoria" value={formulario.categoria} onChange={handleCambioFormulario}>
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
                    ))}
                  </select>
                </div>

                {editando && (
                  <div className="rga-form-grupo-unico">
                    <label>Estado *</label>
                    <select name="estado" value={formulario.estado} onChange={handleCambioFormulario}>
                      <option value="pendiente">Pendiente</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="rga-modal-footer-unico">
              <button className="rga-btn-cancelar-unico" onClick={handleCerrarModal}>Cancelar</button>
              <button className="rga-btn-guardar-unico" onClick={handleGuardar}>{editando ? 'Actualizar' : 'Crear Restaurante'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantesGeneral;