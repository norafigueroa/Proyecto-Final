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
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

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

      // Filtrar solo artículos publicados
      const articulosPublicados = articulosArray.filter(a => a.estado === 'publicado');

      // Limpiar URLs de imágenes
      const articulosLimpios = articulosPublicados.map(art => ({
        ...art,
        imagen_portada: limpiarUrlImagen(art.imagen_portada)
      }));

      setArticulos(articulosLimpios);
      setCategorias(categoriasArray);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setArticulos([]);
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

  // Filtrar artículos según categoría seleccionada
  const articulosFiltrados = filtroCategoria === 'todos' 
    ? articulos 
    : articulos.filter(art => art.categoria_blog === parseInt(filtroCategoria));

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
          Historia de <span>Puntarenas Centro</span>
        </h1>
        <p>El corazón del Pacífico costarricense</p>
      </header>

      {/* SELECT FILTRO CATEGORÍAS */}
      <div className="cultura-filtro-contenedor">
        <select 
          value={filtroCategoria} 
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="cultura-select-filtro"
        >
          <option value="todos">Ver todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>
      </div>

      {/* TARJETAS DE ARTÍCULOS */}
      {articulosFiltrados.length > 0 ? (
        <div className="cultura-articulos-contenedor">
          {articulosFiltrados.map((articulo) => (
            <div key={articulo.id} className="cultura-tarjeta-articulo">
              <div className="cultura-tarjeta-imagen-contenedor">
                <img 
                  src={articulo.imagen_portada || `https://via.placeholder.com/600x400?text=${encodeURIComponent(articulo.titulo)}`}
                  alt={articulo.titulo}
                  className="cultura-tarjeta-imagen"
                />
                <div className="cultura-tarjeta-overlay">
                  <button 
                    className="cultura-btn-leer-mas"
                    onClick={() => handleAbrirArticulo(articulo)}
                  >
                    Leer más
                  </button>
                </div>
              </div>

              <div className="cultura-tarjeta-contenido">
                <h3 className="cultura-tarjeta-titulo">{articulo.titulo}</h3>
                
                <div className="cultura-tarjeta-info">
                  <span className="cultura-info-item">
                    📅 {formatearFecha(articulo.fecha_publicacion)}
                  </span>
                  <span className="cultura-info-item">
                    👁️ {articulo.vistas} vistas
                  </span>
                  {articulo.destacado && (
                    <span className="cultura-info-item">⭐ Destacado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="cultura-section">
          <p style={{textAlign: 'center', color: '#999', fontSize: '1.1rem'}}>
            No hay artículos en esta categoría. Por favor intenta más tarde.
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