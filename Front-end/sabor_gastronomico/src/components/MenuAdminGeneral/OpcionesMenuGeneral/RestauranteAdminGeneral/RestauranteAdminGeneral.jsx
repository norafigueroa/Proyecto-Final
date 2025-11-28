import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerRestaurantes,
  crearRestaurante,
  actualizarRestaurante,
  eliminarRestaurante,
  obtenerCategorias,
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
    nombre_restaurante: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
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
      
      // Convertir a arrays si es necesario
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
        nombre_restaurante: restaurante.nombre_restaurante,
        descripcion: restaurante.descripcion || '',
        direccion: restaurante.direccion,
        telefono: restaurante.telefono || '',
        email: restaurante.email || '',
        categoria: restaurante.categoria || '',
        estado: restaurante.estado,
      });
    } else {
      setEditando(null);
      setFormulario({
        nombre_restaurante: '',
        descripcion: '',
        direccion: '',
        telefono: '',
        email: '',
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
    if (!formulario.nombre_restaurante || !formulario.direccion) {
      Swal.fire('Error', 'Nombre y dirección son obligatorios', 'error');
      return;
    }

    try {
      if (editando) {
        await actualizarRestaurante(editando.id, formulario);
        Swal.fire('Éxito', 'Restaurante actualizado', 'success');
      } else {
        await crearRestaurante(formulario);
        Swal.fire('Éxito', 'Restaurante creado', 'success');
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
        Swal.fire('Éxito', 'Restaurante eliminado', 'success');
        cargarDatos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el restaurante', 'error');
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarRestaurante(id, { estado: nuevoEstado });
      Swal.fire('Éxito', `Restaurante ${nuevoEstado}`, 'success');
      cargarDatos();
    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
  };

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const restaurantesPaginados = restaurantesFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(restaurantesFiltrados.length / itemsPorPagina);

  if (cargando) {
    return <div className="restaurantes-cargando">Cargando restaurantes...</div>;
  }

  return (
    <div className="restaurantes-contenedor">
      <div className="restaurantes-encabezado">
        <h2>Gestión de Restaurantes</h2>
        <button
          className="restaurantes-btn-crear"
          onClick={() => handleAbrirModal()}
        >
          + Nuevo Restaurante
        </button>
      </div>

      <div className="restaurantes-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre o dirección..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="restaurantes-input-busqueda"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="restaurantes-select-filtro"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="restaurantes-tabla-contenedor">
        <table className="restaurantes-tabla">
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
                    <span className={`restaurantes-badge estado-${restaurante.estado}`}>
                      {restaurante.estado}
                    </span>
                  </td>
                  <td className="restaurantes-acciones">
                    <button
                      className="restaurantes-btn-accion editar"
                      onClick={() => handleAbrirModal(restaurante)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    {restaurante.estado === 'pendiente' && (
                      <>
                        <button
                          className="restaurantes-btn-accion aprobar"
                          onClick={() => handleCambiarEstado(restaurante.id, 'activo')}
                          title="Aprobar"
                        >
                          ✓
                        </button>
                        <button
                          className="restaurantes-btn-accion rechazar"
                          onClick={() => handleCambiarEstado(restaurante.id, 'inactivo')}
                          title="Rechazar"
                        >
                          ✕
                        </button>
                      </>
                    )}
                    <button
                      className="restaurantes-btn-accion eliminar"
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
                <td colSpan="5" className="restaurantes-sin-datos">
                  No hay restaurantes que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="restaurantes-paginacion">
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* MODAL */}
      {modalAbierto && (
        <div className="restaurantes-modal-overlay" onClick={handleCerrarModal}>
          <div className="restaurantes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="restaurantes-modal-encabezado">
              <h3>{editando ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h3>
              <button
                className="restaurantes-modal-cerrar"
                onClick={handleCerrarModal}
              >
                ✕
              </button>
            </div>

            <div className="restaurantes-modal-contenido">
              <div className="restaurantes-form-grupo">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre_restaurante"
                  value={formulario.nombre_restaurante}
                  onChange={handleCambioFormulario}
                  placeholder="Nombre del restaurante"
                />
              </div>

              <div className="restaurantes-form-grupo">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleCambioFormulario}
                  placeholder="Descripción del restaurante"
                  rows="3"
                />
              </div>

              <div className="restaurantes-form-grupo">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={formulario.direccion}
                  onChange={handleCambioFormulario}
                  placeholder="Dirección"
                />
              </div>

              <div className="restaurantes-form-fila">
                <div className="restaurantes-form-grupo">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleCambioFormulario}
                    placeholder="Teléfono"
                  />
                </div>

                <div className="restaurantes-form-grupo">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={handleCambioFormulario}
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="restaurantes-form-fila">
                <div className="restaurantes-form-grupo">
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleCambioFormulario}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="restaurantes-form-grupo">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formulario.estado}
                    onChange={handleCambioFormulario}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="restaurantes-modal-footer">
              <button
                className="restaurantes-btn-cancelar"
                onClick={handleCerrarModal}
              >
                Cancelar
              </button>
              <button
                className="restaurantes-btn-guardar"
                onClick={handleGuardar}
              >
                {editando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantesGeneral;