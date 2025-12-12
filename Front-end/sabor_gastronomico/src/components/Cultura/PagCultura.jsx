import React, { useState, useEffect } from 'react'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./PagCultura.css";
import { obtenerArticulosBlog, obtenerCategoriasBlog } from "../../services/ServicesAdminGeneral/ServicesBlog";
import Swal from 'sweetalert2';

function PagCultura() {
  const [articulos, setArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seccionesCultura, setSeccionesCultura] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  // Limpiar URL de imagen
  const limpiarUrlImagen = (url) => {
    if (!url || typeof url !== 'string') return null;
    const urlLimpia = url.trim();
    if (!urlLimpia) return null;
    return urlLimpia.includes("image/upload/") 
      ? urlLimpia.replace("image/upload/", "") 
      : urlLimpia;
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [articulosData, categoriasData] = await Promise.all([
        obtenerArticulosBlog(),
        obtenerCategoriasBlog(),
      ]);

      const articulosArray = Array.isArray(articulosData) ? articulosData : articulosData.results || [];
      const categoriasArray = Array.isArray(categoriasData) ? categoriasData : categoriasData.results || [];

      // Filtrar solo artículos publicados (no borradores ni inactivos)
      const articulosPublicados = articulosArray.filter(a => a.estado === 'publicado');

      // Limpiar URLs de imágenes
      const articulosLimpios = articulosPublicados.map(art => ({
        ...art,
        imagen_portada: limpiarUrlImagen(art.imagen_portada)
      }));

      setArticulos(articulosLimpios);
      setCategorias(categoriasArray);

      // Organizar artículos por categoría
      const seccionesOrganizadas = categoriasArray.map(categoria => ({
        id: categoria.id,
        titulo: categoria.nombre_categoria,
        texto: categoria.descripcion || 'Artículos sobre ' + categoria.nombre_categoria,
        imagenes: articulosLimpios
          .filter(art => art.categoria_blog === categoria.id)
          .map(art => ({
            id: art.id,
            src: art.imagen_portada || `https://via.placeholder.com/600x400?text=${encodeURIComponent(art.titulo)}`,
            leyenda: art.titulo,
            articulo: art,
          })),
      })).filter(seccion => seccion.imagenes.length > 0);

      setSeccionesCultura(seccionesOrganizadas);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setSeccionesCultura([]);
    } finally {
      setCargando(false);
    }
  };

  const handleAbrirArticulo = (articulo) => {
    setArticuloSeleccionado(articulo);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setArticuloSeleccionado(null);
  };

  const formatearFecha = (fecha) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  if (cargando) {
    return (
      <div className="cultura-page">
        <header className="cultura-header">
          <h1 className="header-title">
            Cargando <span>Contenido</span>
          </h1>
          <p>Por favor espere...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="cultura-page">
      <header className="cultura-header">
        <h1 className="header-title">
          Blog de <span>Puntarenas Centro</span>
        </h1>
        <p>Historias y Tradiciones Costeras</p>
      </header>

      {seccionesCultura.length > 0 ? (
        seccionesCultura.map((seccion, index) => (
          <section key={index} className="cultura-section">
            <h2>{seccion.titulo}</h2>
            <p>{seccion.texto}</p>

            {seccion.imagenes.length > 0 ? (
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={3000}
                className="cultura-carousel"
              >
                {seccion.imagenes.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleAbrirArticulo(img.articulo)}
                    style={{cursor: 'pointer'}}
                    title="Click para leer el artículo completo"
                  >
                    <img src={img.src} alt={img.leyenda} />
                    <p className="legend">{img.leyenda}</p>
                  </div>
                ))}
              </Carousel>
            ) : (
              <p style={{textAlign: 'center', color: '#999'}}>Sin imágenes disponibles</p>
            )}
          </section>
        ))
      ) : (
        <section className="cultura-section">
          <p style={{textAlign: 'center', color: '#999', fontSize: '1.1rem'}}>
            No hay contenido disponible en este momento. Por favor intenta más tarde.
          </p>
        </section>
      )}

      {/* MODAL ARTÍCULO */}
      {modalAbierto && articuloSeleccionado && (
        <div className="pc-modal-overlay" onClick={handleCerrarModal}>
          <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pc-modal-cerrar" onClick={handleCerrarModal}>✕</button>
            
            {articuloSeleccionado.imagen_portada && (
              <img 
                src={articuloSeleccionado.imagen_portada} 
                alt={articuloSeleccionado.titulo}
                className="pc-modal-imagen"
              />
            )}

            <div className="pc-modal-contenido">
              <h2>{articuloSeleccionado.titulo}</h2>
              
              <div className="pc-modal-info">
                <span className="pc-info-item">
                  📅 {formatearFecha(articuloSeleccionado.fecha_publicacion)}
                </span>
                <span className="pc-info-item">
                  👁️ {articuloSeleccionado.vistas} vistas
                </span>
                {articuloSeleccionado.destacado && (
                  <span className="pc-info-item">⭐ Destacado</span>
                )}
              </div>

              {articuloSeleccionado.resumen && (
                <p className="pc-resumen">
                  <strong>Resumen:</strong> {articuloSeleccionado.resumen}
                </p>
              )}

              <div className="pc-contenido">
                {articuloSeleccionado.contenido}
              </div>
            </div>

            <button className="pc-btn-cerrar-modal" onClick={handleCerrarModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <footer className="cultura-footer">
        <p>© 2025 Blog Puntarenas | Historia y Tradición Costera</p>
      </footer>
    </div>
  );
}

export default PagCultura;