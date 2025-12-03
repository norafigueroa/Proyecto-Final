import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerSitiosTuristicos,
  crearSitioTuristico,
  actualizarParcialSitioTuristico,
  eliminarSitioTuristico,
} from '../../../../services/ServicesAdminGeneral/ServicesTurismo';
import {
  obtenerFotosSitio,
  crearFotoSitio,
  eliminarFotoSitio,
} from '../../../../services/ServicesAdminGeneral/ServicesFotosTurismo';
import './SitiosTuristicosGeneral.css';

function SitiosTuristicosGeneral() {
  const [sitios, setSitios] = useState([]);
  const [sitiosFiltrados, setSitiosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [cargandoFoto, setCargandoFoto] = useState(false);
  const itemsPorPagina = 10;

  const [formulario, setFormulario] = useState({
    nombre_lugar: '',
    descripcion: '',
    longitud: '',
    latitud: '',
    imagen_principal: '',
  });

  const [fotos, setFotos] = useState([]);
  const [sitioSeleccionado, setSitioSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarSitios();
  }, [sitios, busqueda]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const sitiosData = await obtenerSitiosTuristicos();
      const sitiosArray = Array.isArray(sitiosData) ? sitiosData : sitiosData.results || [];
      setSitios(sitiosArray);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los sitios turísticos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const filtrarSitios = () => {
    let filtrados = sitios;

    if (busqueda) {
      filtrados = filtrados.filter(s =>
        s.nombre_lugar.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setSitiosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const handleSubirImagen = async (e, tipo = 'principal') => {
    const file = e.target.files[0];
    if (!file) return;

    tipo === 'principal' ? setCargandoImagen(true) : setCargandoFoto(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'el_sabor_de_la_perla');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        if (tipo === 'principal') {
          setFormulario({
            ...formulario,
            imagen_principal: data.secure_url,
          });
        } else {
          // Agregar foto del sitio
          if (sitioSeleccionado) {
            const nuevaFoto = {
              lugar: sitioSeleccionado.id,
              url_foto: data.secure_url,
              descripcion: '',
            };
            await crearFotoSitio(nuevaFoto);
            await cargarFotosSitio(sitioSeleccionado.id);
            Swal.fire('Éxito', 'Foto subida correctamente', 'success');
          }
        }
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    } finally {
      tipo === 'principal' ? setCargandoImagen(false) : setCargandoFoto(false);
    }
  };

  const cargarFotosSitio = async (sitioId) => {
    try {
      const fotosData = await obtenerFotosSitio(sitioId);
      setFotos(Array.isArray(fotosData) ? fotosData : []);
    } catch (error) {
      console.error('Error al cargar fotos:', error);
      setFotos([]);
    }
  };

  const handleAbrirModal = async (sitio = null) => {
    if (sitio) {
      setEditando(sitio);
      setSitioSeleccionado(sitio);
      setFormulario({
        nombre_lugar: sitio.nombre_lugar || '',
        descripcion: sitio.descripcion || '',
        longitud: sitio.longitud || '',
        latitud: sitio.latitud || '',
        imagen_principal: sitio.imagen_principal || '',
      });
      await cargarFotosSitio(sitio.id);
    } else {
      setEditando(null);
      setSitioSeleccionado(null);
      setFormulario({
        nombre_lugar: '',
        descripcion: '',
        longitud: '',
        latitud: '',
        imagen_principal: '',
      });
      setFotos([]);
    }
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setSitioSeleccionado(null);
    setFotos([]);
  };

  const handleCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleGuardar = async () => {
    if (!formulario.nombre_lugar) {
      Swal.fire('Error', 'El nombre del lugar es obligatorio', 'error');
      return;
    }

    try {
      const datos = {
        nombre_lugar: formulario.nombre_lugar,
        descripcion: formulario.descripcion,
        longitud: formulario.longitud || null,
        latitud: formulario.latitud || null,
        imagen_principal: formulario.imagen_principal,
      };

      if (editando) {
        await actualizarParcialSitioTuristico(editando.id, datos);
        await Swal.fire('Éxito', 'Sitio turístico actualizado correctamente', 'success');
      } else {
        await crearSitioTuristico(datos);
        await Swal.fire('Éxito', 'Sitio turístico creado correctamente', 'success');
      }

      handleCerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire('Error', 'No se pudo guardar el sitio turístico', 'error');
    }
  };

  const handleEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar sitio turístico?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarSitioTuristico(id);
        await Swal.fire('Éxito', 'Sitio turístico eliminado correctamente', 'success');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el sitio turístico', 'error');
      }
    }
  };

  const handleEliminarFoto = async (fotoId) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar foto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarFotoSitio(fotoId);
        await Swal.fire('Éxito', 'Foto eliminada correctamente', 'success');
        if (sitioSeleccionado) {
          await cargarFotosSitio(sitioSeleccionado.id);
        }
      } catch (error) {
        console.error('Error al eliminar foto:', error);
        Swal.fire('Error', 'No se pudo eliminar la foto', 'error');
      }
    }
  };

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const sitiosPaginados = sitiosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(sitiosFiltrados.length / itemsPorPagina);

  if (cargando) {
    return <div className="stg-cargando-unico">Cargando sitios turísticos...</div>;
  }

  return (
    <div className="stg-contenedor-principal-unico">
      <div className="stg-seccion-titulo-boton-unico">
        <h2 className="stg-titulo-unico">Gestión de Sitios Turísticos</h2>
        <button className="stg-btn-nuevo-unico" onClick={() => handleAbrirModal()}>
          + Nuevo Sitio
        </button>
      </div>

      <div className="stg-seccion-filtros-unico">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="stg-input-buscar-unico"
        />
      </div>

      <div className="stg-contenedor-tabla-unico">
        <table className="stg-tabla-unico">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Coordenadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sitiosPaginados.length > 0 ? (
              sitiosPaginados.map((sitio) => (
                <tr key={sitio.id}>
                  <td>{sitio.nombre_lugar}</td>
                  <td>{sitio.descripcion || '-'}</td>
                  <td>
                    {sitio.latitud && sitio.longitud 
                      ? `${sitio.latitud}, ${sitio.longitud}`
                      : '-'
                    }
                  </td>
                  <td className="stg-acciones-unico">
                    <button
                      className="stg-btn-accion-unico editar"
                      onClick={() => handleAbrirModal(sitio)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="stg-btn-accion-unico eliminar"
                      onClick={() => handleEliminar(sitio.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="stg-sin-datos-unico">
                  No hay sitios turísticos que coincidan con la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="stg-paginacion-unico">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
            ← Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>
            Siguiente →
          </button>
        </div>
      )}

      {/* MODAL */}
      {modalAbierto && (
        <div className="stg-modal-overlay-unico" onClick={handleCerrarModal}>
          <div className="stg-modal-unico" onClick={(e) => e.stopPropagation()}>
            <div className="stg-modal-header-unico">
              <h3>{editando ? 'Editar Sitio Turístico' : 'Nuevo Sitio Turístico'}</h3>
              <button className="stg-modal-cerrar-unico" onClick={handleCerrarModal}>✕</button>
            </div>

            <div className="stg-modal-contenido-unico">
              <div className="stg-form-grupo-unico">
                <label>Nombre del Lugar *</label>
                <input
                  type="text"
                  name="nombre_lugar"
                  value={formulario.nombre_lugar}
                  onChange={handleCambioFormulario}
                  placeholder="Nombre"
                />
              </div>

              <div className="stg-form-grupo-unico">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleCambioFormulario}
                  placeholder="Descripción del lugar"
                  rows="3"
                />
              </div>

              <div className="stg-form-fila-unico">
                <div className="stg-form-grupo-unico">
                  <label>Latitud</label>
                  <input
                    type="number"
                    name="latitud"
                    value={formulario.latitud}
                    onChange={handleCambioFormulario}
                    placeholder="Latitud"
                    step="0.000001"
                  />
                </div>
                <div className="stg-form-grupo-unico">
                  <label>Longitud</label>
                  <input
                    type="number"
                    name="longitud"
                    value={formulario.longitud}
                    onChange={handleCambioFormulario}
                    placeholder="Longitud"
                    step="0.000001"
                  />
                </div>
              </div>

              <div className="stg-form-grupo-unico">
                <label>Imagen Principal</label>
                {formulario.imagen_principal && (
                  <div className="stg-imagen-preview-unico">
                    <img src={formulario.imagen_principal} alt="Preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSubirImagen(e, 'principal')}
                  disabled={cargandoImagen}
                  className="stg-input-file-unico"
                />
                {cargandoImagen && <small style={{color: '#1a4d6d'}}>Subiendo imagen...</small>}
              </div>

              {editando && (
                <div className="stg-fotos-seccion-unico">
                  <h4>Fotos del Sitio</h4>
                  
                  <div className="stg-form-grupo-unico">
                    <label>Agregar Nueva Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSubirImagen(e, 'foto')}
                      disabled={cargandoFoto}
                      className="stg-input-file-unico"
                    />
                    {cargandoFoto && <small style={{color: '#1a4d6d'}}>Subiendo foto...</small>}
                  </div>

                  {fotos.length > 0 ? (
                    <div className="stg-galeria-fotos-unico">
                      {fotos.map((foto) => (
                        <div key={foto.id} className="stg-foto-item-unico">
                          <img src={foto.url_foto} alt="Foto del sitio" />
                          <button
                            className="stg-btn-eliminar-foto-unico"
                            onClick={() => handleEliminarFoto(foto.id)}
                            title="Eliminar foto"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{textAlign: 'center', color: '#999'}}>Sin fotos agregadas</p>
                  )}
                </div>
              )}
            </div>

            <div className="stg-modal-footer-unico">
              <button className="stg-btn-cancelar-unico" onClick={handleCerrarModal}>Cancelar</button>
              <button className="stg-btn-guardar-unico" onClick={handleGuardar}>
                {editando ? 'Actualizar' : 'Crear Sitio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SitiosTuristicosGeneral;