import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerArticulosBlog,
  crearArticulo,
  actualizarParcialArticulo,
  eliminarArticulo,
  obtenerCategoriasBlog,
  crearCategoriaBlog,
  actualizarCategoriaBlog,
  eliminarCategoriaBlog,
} from '../../../../services/ServicesAdminGeneral/ServicesBlog';
import './BlogAdminGeneral.css';

function BlogAdminGeneral() {
  const [articulos, setArticulos] = useState([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalArticuloAbierto, setModalArticuloAbierto] = useState(false);
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [editandoArticulo, setEditandoArticulo] = useState(null);
  const [editandoCategoria, setEditandoCategoria] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [imagenSubir, setimagenSubir] = useState(null);
  const [imagenPreview, setimagenPreview] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const itemsPorPagina = 10;

  const [formularioArticulo, setFormularioArticulo] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    imagen_portada: '',
    categoria_blog: '',
    estado: 'borrador',
    destacado: false,
    etiquetas: [],
  });

  const [formularioCategoria, setFormularioCategoria] = useState({
    nombre_categoria: '',
    descripcion: '',
    icono: '',
  });

  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);

  const handleSubirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setimagenSubir(file);
    setimagenPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarArticulos();
  }, [articulos, filtroEstado, busqueda]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [articulosData, categoriasData] = await Promise.all([
        obtenerArticulosBlog(),
        obtenerCategoriasBlog(),
      ]);

      const articulosArray = Array.isArray(articulosData) ? articulosData : articulosData.results || [];
      const categoriasArray = Array.isArray(categoriasData) ? categoriasData : categoriasData.results || [];

      setArticulos(articulosArray);
      setCategorias(categoriasArray);

      // Extraer etiquetas disponibles
      const etiquetasUnicas = new Set();
      articulosArray.forEach(art => {
        if (art.etiquetas) {
          art.etiquetas.forEach(et => {
            if (et.etiqueta) {
              etiquetasUnicas.add(JSON.stringify(et.etiqueta));
            }
          });
        }
      });
      setEtiquetasDisponibles(Array.from(etiquetasUnicas).map(e => JSON.parse(e)));
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const filtrarArticulos = () => {
    let filtrados = articulos;

    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(a => a.estado === filtroEstado);
    }

    if (busqueda) {
      filtrados = filtrados.filter(a =>
        a.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.resumen.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setArticulosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const handleAbrirModalArticulo = (articulo = null) => {
    if (articulo) {
      setEditandoArticulo(articulo);
      setFormularioArticulo({
        titulo: articulo.titulo || '',
        contenido: articulo.contenido || '',
        resumen: articulo.resumen || '',
        imagen_portada: articulo.imagen_portada || '',
        categoria_blog: articulo.categoria_blog || '',
        estado: articulo.estado || 'borrador',
        destacado: articulo.destacado || false,
        etiquetas: articulo.etiquetas || [],
      });
      setimagenPreview(articulo.imagen_portada || '');
    } else {
      setEditandoArticulo(null);
      setFormularioArticulo({
        titulo: '',
        contenido: '',
        resumen: '',
        imagen_portada: '',
        categoria_blog: '',
        estado: 'borrador',
        destacado: false,
        etiquetas: [],
      });
      setimagenPreview('');
    }
    setimagenSubir(null);
    setModalArticuloAbierto(true);
  };

  const handleCerrarModalArticulo = () => {
    setModalArticuloAbierto(false);
    setEditandoArticulo(null);
    setimagenSubir(null);
    setimagenPreview('');
  };

  const handleAbrirModalCategoria = (categoria = null) => {
    if (categoria) {
      setEditandoCategoria(categoria);
      setFormularioCategoria({
        nombre_categoria: categoria.nombre_categoria || '',
        descripcion: categoria.descripcion || '',
        icono: categoria.icono || '',
      });
    } else {
      setEditandoCategoria(null);
      setFormularioCategoria({
        nombre_categoria: '',
        descripcion: '',
        icono: '',
      });
    }
    setModalCategoriaAbierto(true);
  };

  const handleCerrarModalCategoria = () => {
    setModalCategoriaAbierto(false);
    setEditandoCategoria(null);
  };

  const handleCambioFormularioArticulo = (e) => {
    const { name, value, type, checked } = e.target;
    setFormularioArticulo({
      ...formularioArticulo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCambioFormularioCategoria = (e) => {
    const { name, value } = e.target;
    setFormularioCategoria({ ...formularioCategoria, [name]: value });
  };

  const handleGuardarArticulo = async () => {
    if (!formularioArticulo.titulo || !formularioArticulo.contenido || !formularioArticulo.categoria_blog) {
      Swal.fire('Error', 'Título, contenido y categoría son obligatorios', 'error');
      return;
    }

    try {
      setCargandoImagen(true);
      let imagenFinal = formularioArticulo.imagen_portada;

      // Solo subir imagen si hay archivo seleccionado
      if (imagenSubir) {
        const formData = new FormData();
        formData.append('file', imagenSubir);
        formData.append('upload_preset', 'el_sabor_de_la_perla');

        const response = await fetch('https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          imagenFinal = data.secure_url;
        }
      }

      const datos = {
        titulo: formularioArticulo.titulo,
        contenido: formularioArticulo.contenido,
        resumen: formularioArticulo.resumen,
        imagen_portada: imagenFinal,
        categoria_blog: formularioArticulo.categoria_blog,
        estado: formularioArticulo.estado,
        destacado: formularioArticulo.destacado,
      };

      if (editandoArticulo) {
        await actualizarParcialArticulo(editandoArticulo.id, datos);
        await Swal.fire('Éxito', 'Artículo actualizado correctamente', 'success');
      } else {
        await crearArticulo(datos);
        await Swal.fire('Éxito', 'Artículo creado correctamente', 'success');
      }

      handleCerrarModalArticulo();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar artículo:', error);
      Swal.fire('Error', 'No se pudo guardar el artículo', 'error');
    } finally {
      setCargandoImagen(false);
    }
  };

  const handleGuardarCategoria = async () => {
    if (!formularioCategoria.nombre_categoria) {
      Swal.fire('Error', 'El nombre de la categoría es obligatorio', 'error');
      return;
    }

    try {
      if (editandoCategoria) {
        await actualizarCategoriaBlog(editandoCategoria.id, formularioCategoria);
        await Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
      } else {
        await crearCategoriaBlog(formularioCategoria);
        await Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
      }

      handleCerrarModalCategoria();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
    }
  };

  const handleEliminarArticulo = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar artículo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarArticulo(id);
        await Swal.fire('Éxito', 'Artículo eliminado correctamente', 'success');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el artículo', 'error');
      }
    }
  };

  const handleEliminarCategoria = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarCategoriaBlog(id);
        await Swal.fire('Éxito', 'Categoría eliminada correctamente', 'success');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
      }
    }
  };

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const articulosPaginados = articulosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(articulosFiltrados.length / itemsPorPagina);

  if (cargando) {
    return <div className="bag-cargando-unico">Cargando...</div>;
  }

  return (
    <div className="bag-contenedor-principal-unico">
      {/* TABS */}
      <div className="bag-tabs-unico">
        <button className="bag-tab-activo-unico">Artículos</button>
        <button className="bag-tab-unico" onClick={() => setModalCategoriaAbierto(true)}>
          + Gestionar Categorías
        </button>
      </div>

      {/* SECCIÓN ARTÍCULOS */}
      <div className="bag-seccion-titulo-boton-unico">
        <h2 className="bag-titulo-unico">Gestión de Artículos</h2>
        <button className="bag-btn-nuevo-unico" onClick={() => handleAbrirModalArticulo()}>
          + Nuevo Artículo
        </button>
      </div>

      <div className="bag-seccion-filtros-unico">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="bag-select-estado-unico">
          <option value="todos">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <input
          type="text"
          placeholder="Buscar artículos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bag-input-buscar-unico"
        />
      </div>

      <div className="bag-contenedor-tabla-unico">
        <table className="bag-tabla-unico">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Destacado</th>
              <th>Vistas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulosPaginados.length > 0 ? (
              articulosPaginados.map((articulo) => (
                <tr key={articulo.id}>
                  <td>{articulo.titulo}</td>
                  <td>{articulo.categoria_nombre}</td>
                  <td>
                    <span className={`bag-badge-estado-unico ${articulo.estado}`}>
                      {articulo.estado}
                    </span>
                  </td>
                  <td>{articulo.destacado ? '⭐' : '-'}</td>
                  <td>{articulo.vistas}</td>
                  <td className="bag-acciones-unico">
                    <button
                      className="bag-btn-accion-unico editar"
                      onClick={() => handleAbrirModalArticulo(articulo)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="bag-btn-accion-unico eliminar"
                      onClick={() => handleEliminarArticulo(articulo.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="bag-sin-datos-unico">
                  No hay artículos que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="bag-paginacion-unico">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
            ← Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>
            Siguiente →
          </button>
        </div>
      )}

      {/* MODAL ARTÍCULO */}
      {modalArticuloAbierto && (
        <div className="bag-modal-overlay-unico" onClick={handleCerrarModalArticulo}>
          <div className="bag-modal-unico" onClick={(e) => e.stopPropagation()}>
            <div className="bag-modal-header-unico">
              <h3>{editandoArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
              <button className="bag-modal-cerrar-unico" onClick={handleCerrarModalArticulo}>✕</button>
            </div>

            <div className="bag-modal-contenido-unico">
              <div className="bag-form-grupo-unico">
                <label>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formularioArticulo.titulo}
                  onChange={handleCambioFormularioArticulo}
                  placeholder="Título del artículo"
                />
              </div>

              <div className="bag-form-grupo-unico">
                <label>Resumen</label>
                <input
                  type="text"
                  name="resumen"
                  value={formularioArticulo.resumen}
                  onChange={handleCambioFormularioArticulo}
                  placeholder="Resumen breve"
                />
              </div>

              <div className="bag-form-grupo-unico">
                <label>Contenido *</label>
                <textarea
                  name="contenido"
                  value={formularioArticulo.contenido}
                  onChange={handleCambioFormularioArticulo}
                  placeholder="Contenido del artículo"
                  rows="6"
                />
              </div>

              <div className="bag-form-grupo-unico">
                <label>Imagen de Portada</label>
                {imagenPreview && (
                  <div className="bag-imagen-preview-unico">
                    <img src={imagenPreview} alt="Preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSubirImagen}
                  disabled={cargandoImagen}
                  className="bag-input-file-unico"
                />
                {cargandoImagen && <small style={{color: '#1a4d6d'}}>Subiendo imagen...</small>}
              </div>

              <div className="bag-form-fila-unico">
                <div className="bag-form-grupo-unico">
                  <label>Categoría *</label>
                  <select
                    name="categoria_blog"
                    value={formularioArticulo.categoria_blog}
                    onChange={handleCambioFormularioArticulo}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
                    ))}
                  </select>
                </div>

                <div className="bag-form-grupo-unico">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formularioArticulo.estado}
                    onChange={handleCambioFormularioArticulo}
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="bag-form-grupo-unico">
                <label className="bag-checkbox-label-unico">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formularioArticulo.destacado}
                    onChange={handleCambioFormularioArticulo}
                  />
                  Destacado
                </label>
              </div>
            </div>

            <div className="bag-modal-footer-unico">
              <button className="bag-btn-cancelar-unico" onClick={handleCerrarModalArticulo}>Cancelar</button>
              <button className="bag-btn-guardar-unico" onClick={handleGuardarArticulo}>
                {editandoArticulo ? 'Actualizar' : 'Crear Artículo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CATEGORÍA */}
      {modalCategoriaAbierto && (
        <div className="bag-modal-overlay-unico" onClick={handleCerrarModalCategoria}>
          <div className="bag-modal-unico" onClick={(e) => e.stopPropagation()}>
            <div className="bag-modal-header-unico">
              <h3>{editandoCategoria ? 'Editar Categoría' : 'Gestionar Categorías'}</h3>
              <button className="bag-modal-cerrar-unico" onClick={handleCerrarModalCategoria}>✕</button>
            </div>

            <div className="bag-modal-contenido-unico">
              {!editandoCategoria && (
                <div className="bag-categorias-lista-unico">
                  <h4>Categorías existentes:</h4>
                  {categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <div key={cat.id} className="bag-categoria-item-unico">
                        <span>{cat.nombre_categoria}</span>
                        <div className="bag-categoria-acciones-unico">
                          <button onClick={() => handleAbrirModalCategoria(cat)} className="bag-btn-editar-mini-unico">✏️</button>
                          <button onClick={() => handleEliminarCategoria(cat.id)} className="bag-btn-eliminar-mini-unico">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay categorías</p>
                  )}
                  <hr className="bag-divisor-unico" />
                </div>
              )}

              <div className="bag-form-grupo-unico">
                <label>Nombre de la Categoría *</label>
                <input
                  type="text"
                  name="nombre_categoria"
                  value={formularioCategoria.nombre_categoria}
                  onChange={handleCambioFormularioCategoria}
                  placeholder="Nombre"
                />
              </div>

              <div className="bag-form-grupo-unico">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formularioCategoria.descripcion}
                  onChange={handleCambioFormularioCategoria}
                  placeholder="Descripción"
                />
              </div>

              <div className="bag-form-grupo-unico">
                <label>Icono (emoji o clase)</label>
                <input
                  type="text"
                  name="icono"
                  value={formularioCategoria.icono}
                  onChange={handleCambioFormularioCategoria}
                  placeholder="📚"
                />
              </div>
            </div>

            <div className="bag-modal-footer-unico">
              <button className="bag-btn-cancelar-unico" onClick={handleCerrarModalCategoria}>Cerrar</button>
              <button className="bag-btn-guardar-unico" onClick={handleGuardarCategoria}>
                {editandoCategoria ? 'Actualizar' : 'Crear'} Categoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogAdminGeneral;