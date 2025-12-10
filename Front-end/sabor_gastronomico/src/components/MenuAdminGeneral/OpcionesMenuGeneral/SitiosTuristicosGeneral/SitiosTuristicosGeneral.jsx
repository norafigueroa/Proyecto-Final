import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [fotosTemporales, setFotosTemporales] = useState([]); // Para fotos antes de crear
  const [sitioSeleccionado, setSitioSeleccionado] = useState(null);
  const [mapAbierto, setMapAbierto] = useState(false);
  const searchInputRef = useRef(null);
  const [sugerencias, setSugerencias] = useState([]);

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
      const sitiosArray = Array.isArray(sitiosData)
        ? sitiosData
        : sitiosData.results || [];
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
      filtrados = filtrados.filter(
        (s) =>
          s.nombre_lugar.toLowerCase().includes(busqueda.toLowerCase()) ||
          s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    setSitiosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const handleSubirImagen = async (e, tipo = 'principal') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (tipo === 'principal') {
      const file = files[0];
      setCargandoImagen(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'el_sabor_de_la_perla');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload',
          { method: 'POST', body: formData }
        );
        const data = await response.json();
        if (data.secure_url) {
          setFormulario({ ...formulario, imagen_principal: data.secure_url });
          Swal.fire('Éxito', 'Imagen subida correctamente', 'success');
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      } finally {
        setCargandoImagen(false);
      }
    } else {
      // Fotos adicionales
      setCargandoFoto(true);
      let fotosSubidas = 0;
      let fotosNuevas = [];

      Array.from(files).forEach(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'el_sabor_de_la_perla');

        try {
          const response = await fetch(
            'https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload',
            { method: 'POST', body: formData }
          );
          const data = await response.json();
          if (data.secure_url) {
            fotosNuevas.push(data.secure_url);
            fotosSubidas++;

            if (editando) {
              // Si estamos editando, guardar en BD
              const nuevaFoto = {
                lugar: sitioSeleccionado.id,
                url_foto: data.secure_url,
                descripcion: '',
              };
              await crearFotoSitio(nuevaFoto);
            } else {
              // Si estamos creando, guardar temporalmente
              setFotosTemporales((prev) => [...prev, data.secure_url]);
            }

            if (fotosSubidas === files.length) {
              if (editando) {
                await cargarFotosSitio(sitioSeleccionado.id);
              }
              Swal.fire(
                'Éxito',
                `${fotosSubidas} foto(s) subida(s) correctamente`,
                'success'
              );
              setCargandoFoto(false);
            }
          }
        } catch (error) {
          console.error('Error al subir foto:', error);
          setCargandoFoto(false);
          Swal.fire('Error', 'No se pudo subir una o más fotos', 'error');
        }
      });
    }
  };

  const cargarFotosSitio = async (sitioId) => {
    try {
      console.log(sitioId);
      
      const fotosData = await obtenerFotosSitio(sitioId);
      console.log(fotosData);
      
      let fotosArray = Array.isArray(fotosData) ? fotosData : [];
      
      // Limpiar URLs de fotos
      fotosArray = fotosArray.map(foto => ({
        ...foto,
        url_foto: foto.url_foto?.includes('image/upload/') 
          ? foto.url_foto.replace('image/upload/', '') 
          : foto.url_foto
      }));
      
      setFotos(fotosArray);
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
      setFotosTemporales([]);
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
      setFotosTemporales([]);
    }
    setMapAbierto(false);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setSitioSeleccionado(null);
    setFotos([]);
    setFotosTemporales([]);
    setMapAbierto(false);
  };

  const handleCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  function SelectorMapa({ lat, lng }) {
    const [position, setPosition] = useState(
      lat && lng ? [lat, lng] : [9.934739, -84.087502]
    );

    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setFormulario((prev) => ({
          ...prev,
          latitud: e.latlng.lat.toFixed(6),
          longitud: e.latlng.lng.toFixed(6),
        }));
      },
    });

    return <Marker position={position} />;
  }

  const buscarLugar = async () => {
    const nombre = searchInputRef.current?.value;
    if (!nombre) {
      Swal.fire('Error', 'Por favor escribe un nombre de lugar', 'error');
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nombre)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lugar = data[0];
        const lat = parseFloat(lugar.lat).toFixed(6);
        const lon = parseFloat(lugar.lon).toFixed(6);
        setFormulario((prev) => ({
          ...prev,
          latitud: lat,
          longitud: lon,
        }));
        setSugerencias([]);
        searchInputRef.current.value = '';
        Swal.fire('Éxito', `Ubicación encontrada: ${lugar.name}`, 'success');
      } else {
        Swal.fire('No encontrado', 'No se encontró el lugar buscado', 'info');
      }
    } catch (error) {
      console.error('Error buscando lugar:', error);
      Swal.fire('Error', 'No se pudo buscar el lugar', 'error');
    }
  };

  const handleBuscarAutocomplete = async (valor) => {
    searchInputRef.current.value = valor;
    
    if (valor.length < 3) {
      setSugerencias([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(valor)}&limit=5`
      );
      const data = await res.json();
      setSugerencias(data || []);
    } catch (error) {
      console.error('Error en autocomplete:', error);
      setSugerencias([]);
    }
  };

  const seleccionarSugerencia = (lugar) => {
    const lat = parseFloat(lugar.lat).toFixed(6);
    const lon = parseFloat(lugar.lon).toFixed(6);
    setFormulario((prev) => ({
      ...prev,
      latitud: lat,
      longitud: lon,
    }));
    setSugerencias([]);
    searchInputRef.current.value = lugar.name || lugar.display_name;
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
        console.log(editando);
        
        await actualizarParcialSitioTuristico(editando.id, datos);
        await Swal.fire(
          'Éxito',
          'Sitio turístico actualizado correctamente',
          'success'
        );
      } else {
        const nuevoSitio = await crearSitioTuristico(datos);
        
        // Si hay fotos temporales, guardarlas ahora
        if (fotosTemporales.length > 0 && nuevoSitio.id) {
          for (const fotoUrl of fotosTemporales) {
            await crearFotoSitio({
              lugar: nuevoSitio.id,
              url_foto: fotoUrl,
              descripcion: '',
            });
          }
        }

        await Swal.fire('Éxito', 'Sitio turístico creado correctamente', 'success');
      }

      handleCerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
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
        await Swal.fire(
          'Éxito',
          'Sitio turístico eliminado correctamente',
          'success'
        );
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

  const handleEliminarFotoTemporal = (index) => {
    setFotosTemporales((prev) => prev.filter((_, i) => i !== index));
  };

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const sitiosPaginados = sitiosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(sitiosFiltrados.length / itemsPorPagina);

  if (cargando) {
    return <div className="stg-cargando-unico">Cargando sitios turísticos...</div>;
  }

  console.log(fotos);
  

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
                      : '-'}
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
        <div className="stg-modal-overlay-unico" onClick={handleCerrarModal}>
          <div className="stg-modal-unico" onClick={(e) => e.stopPropagation()}>
            <div className="stg-modal-header-unico">
              <h3>{editando ? 'Editar Sitio Turístico' : 'Nuevo Sitio Turístico'}</h3>
              <button className="stg-modal-cerrar-unico" onClick={handleCerrarModal}>
                ✕
              </button>
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

              <div className="stg-form-grupo-unico">
                <button
                  type="button"
                  className="stg-btn-nuevo-unico"
                  onClick={() => setMapAbierto(!mapAbierto)}
                >
                  {mapAbierto ? 'Cerrar mapa' : 'Seleccionar en mapa'}
                </button>
              </div>

              {mapAbierto && (
                <>
                  <div className="stg-form-grupo-unico" style={{ zIndex: 1005, position: 'relative' }}>
                    <label>Buscar Lugar</label>
                    <div style={{ display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 1005 }}>
                      <div style={{ flex: 1, position: 'relative', zIndex: 1005 }}>
                        <input
                          type="text"
                          ref={searchInputRef}
                          placeholder="Ej: Playa Doña Ana, Costa Rica"
                          className="stg-input-buscar-unico"
                          onChange={(e) => handleBuscarAutocomplete(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && buscarLugar()}
                          style={{ width: '100%' }}
                        />
                        
                        {sugerencias.length > 0 && (
                          <div style={{
                            position: 'fixed',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 9999,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            minWidth: '300px'
                          }}>
                            {sugerencias.map((lugar, idx) => (
                              <div
                                key={idx}
                                onClick={() => seleccionarSugerencia(lugar)}
                                style={{
                                  padding: '10px',
                                  borderBottom: '1px solid #eee',
                                  cursor: 'pointer',
                                  fontSize: '0.9rem',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                {lugar.name || lugar.display_name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="stg-btn-nuevo-unico"
                        onClick={buscarLugar}
                        style={{ zIndex: 1005 }}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>

                  <div style={{ height: '300px', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                    <MapContainer
                      center={
                        formulario.latitud && formulario.longitud
                          ? [formulario.latitud, formulario.longitud]
                          : [9.934739, -84.087502]
                      }
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <SelectorMapa
                        lat={formulario.latitud}
                        lng={formulario.longitud}
                      />
                    </MapContainer>
                  </div>
                </>
              )}

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
                {cargandoImagen && (
                  <small style={{ color: '#1a4d6d' }}>Subiendo imagen...</small>
                )}
              </div>

              <div className="stg-fotos-seccion-unico">
                <h4>Fotos Adicionales (Galería)</h4>

                <div className="stg-form-grupo-unico">
                  <label>Agregar Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleSubirImagen(e, 'foto')}
                    disabled={cargandoFoto}
                    className="stg-input-file-unico"
                  />
                  {cargandoFoto && (
                    <small style={{ color: '#1a4d6d' }}>Subiendo foto(s)...</small>
                  )}
                </div>

                {fotos.length > 0 || fotosTemporales.length > 0 ? (
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
                    {fotosTemporales.map((foto, index) => (
                      <div key={`temp-${index}`} className="stg-foto-item-unico">
                        <img src={foto} alt="Foto temporal" />
                        <button
                          className="stg-btn-eliminar-foto-unico"
                          onClick={() => handleEliminarFotoTemporal(index)}
                          title="Eliminar foto"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>Sin fotos agregadas</p>
                )}
              </div>
            </div>

            <div className="stg-modal-footer-unico">
              <button className="stg-btn-cancelar-unico" onClick={handleCerrarModal}>
                Cancelar
              </button>
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