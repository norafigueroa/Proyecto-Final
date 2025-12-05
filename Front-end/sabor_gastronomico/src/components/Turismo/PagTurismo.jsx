import React, { useRef, useEffect, useState } from "react";
import "./PagTurismo.css";
import { obtenerSitiosTuristicos } from "../../services/ServicesAdminGeneral/ServicesTurismo";
import { obtenerFotosSitio } from "../../services/ServicesAdminGeneral/ServicesFotosTurismo";

function PagTurismo() {
  const carruselRef = useRef(null);
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoSeleccionadaLightbox, setFotoSeleccionadaLightbox] = useState(null);

  // Cargar lugares
  useEffect(() => {
    const cargarLugares = async () => {
      try {
        setCargando(true);
        const data = await obtenerSitiosTuristicos();
        const lugaresArray = Array.isArray(data) ? data : data.results || [];
        
        // Arreglar URLs de Cloudinary que tienen "image/upload/" al inicio
        lugaresArray.forEach(lugar => {
          if (lugar.imagen_principal && lugar.imagen_principal.includes("image/upload/")) {
            lugar.imagen_principal = lugar.imagen_principal.replace("image/upload/", "");
          }
        });
        
        setLugares(lugaresArray);
      } catch (error) {
        console.error("Error cargando lugares:", error);
        setLugares([]);
      } finally {
        setCargando(false);
      }
    };

    cargarLugares();
  }, []);

  const cargarFotos = async (sitioId) => {
    try {
      const fotosData = await obtenerFotosSitio(sitioId);
      const fotosArray = fotosData || [];
      
      // Arreglar URLs que tienen "image/upload/" al inicio
      fotosArray.forEach(foto => {
        if (foto.url_foto && foto.url_foto.includes("image/upload/")) {
          foto.url_foto = foto.url_foto.replace("image/upload/", "");
        }
      });
      
      setFotos(fotosArray);
    } catch (error) {
      console.error("Error cargando fotos:", error);
      setFotos([]);
    }
  };

  const handleAbrirModal = async (lugar) => {
    setLugarSeleccionado(lugar);
    await cargarFotos(lugar.id);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setLugarSeleccionado(null);
    setFotos([]);
    setFotoSeleccionadaLightbox(null);
  };

  const handleAbrirLightbox = (fotoUrl) => {
    setFotoSeleccionadaLightbox(fotoUrl);
  };

  const handleCerrarLightbox = () => {
    setFotoSeleccionadaLightbox(null);
  };

  const navegarLightbox = (direccion) => {
    const indiceActual = fotos.findIndex(f => f.url_foto === fotoSeleccionadaLightbox);
    let nuevoIndice = indiceActual + direccion;
    
    if (nuevoIndice < 0) nuevoIndice = fotos.length - 1;
    if (nuevoIndice >= fotos.length) nuevoIndice = 0;
    
    setFotoSeleccionadaLightbox(fotos[nuevoIndice].url_foto);
  };

  const scrollIzquierda = () => {
    carruselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollDerecha = () => {
    carruselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Carrusel automático
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (carruselRef.current) {
        carruselRef.current.scrollBy({ left: 300, behavior: "smooth" });

        if (
          carruselRef.current.scrollLeft + carruselRef.current.offsetWidth >=
          carruselRef.current.scrollWidth
        ) {
          carruselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  if (cargando) {
    return (
      <div className="turismo-page">
        <h1>Cargando <span>Lugares Turísticos</span></h1>
        <p>Por favor espera...</p>
      </div>
    );
  }

  return (
    <div className="turismo-page">
      <h1>
        Lugares Turísticos de <span>Puntarenas</span>
      </h1>
      <p>
        Explora los principales atractivos de la Perla del Pacífico Costarricense.
      </p>

      <div className="carrusel-container">
        <button className="btn-scroll" onClick={scrollIzquierda}>
          ◀
        </button>

        <div className="carrusel" ref={carruselRef}>
          {lugares.length > 0 ? (
            lugares.map((lugar) => (
              <div
                key={lugar.id}
                className="lugar-card"
                onClick={() => handleAbrirModal(lugar)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    lugar.imagen_principal ||
                    "https://via.placeholder.com/300x200?text=" +
                      encodeURIComponent(lugar.nombre_lugar)
                  }
                  alt={lugar.nombre_lugar}
                  className="lugar-img"
                />

                <h2>{lugar.nombre_lugar}</h2>
                <p>{lugar.descripcion || "Sin descripción"}</p>

                {lugar.latitud && lugar.longitud && (
                  <a
                    href={`https://www.google.com/maps?q=${lugar.latitud},${lugar.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ubicacion-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📍 Ver ubicación en mapas
                  </a>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#999", width: "100%" }}>
              No hay lugares turísticos disponibles
            </div>
          )}
        </div>

        <button className="btn-scroll" onClick={scrollDerecha}>
          ▶
        </button>
      </div>

      {/* MODAL */}
      {modalAbierto && lugarSeleccionado && (
        <div className="pt-modal-overlay" onClick={handleCerrarModal}>
          <div className="pt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pt-modal-cerrar" onClick={handleCerrarModal}>
              ✕
            </button>

            <img
              src={
                lugarSeleccionado.imagen_principal ||
                "https://via.placeholder.com/600x400"
              }
              alt={lugarSeleccionado.nombre_lugar}
              className="pt-modal-imagen"
            />

            <div className="pt-modal-contenido">
              <h2>{lugarSeleccionado.nombre_lugar}</h2>

              <p className="pt-descripcion">
                {lugarSeleccionado.descripcion || "Sin descripción disponible"}
              </p>

              {/* MAPA DE GOOGLE MAPS */}
              {lugarSeleccionado.latitud && lugarSeleccionado.longitud && (
                <div className="pt-mapa-contenedor">
                  <h3>📍 Ubicación</h3>
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '6px' }}
                    loading="lazy"
                    allowFullScreen=""
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${lugarSeleccionado.latitud},${lugarSeleccionado.longitud}&output=embed`}
                  ></iframe>
                </div>
              )}

              {/* GALERÍA DE FOTOS */}
              {fotos.length > 0 && (
                <div className="pt-fotos-galeria">
                  <h3>🖼️ Galería de Fotos</h3>
                  <div className="pt-galeria-grid">
                    {fotos.map((foto, index) => (
                      <div 
                        key={index} 
                        className="pt-foto-item"
                        onClick={() => handleAbrirLightbox(foto.url_foto)}
                      >
                        <img
                          src={foto.url_foto}
                          alt="Foto del lugar"
                          className="pt-foto-miniatura"
                        />
                        <div className="pt-foto-overlay">🔍</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {fotoSeleccionadaLightbox && (
        <div className="pt-lightbox-overlay" onClick={handleCerrarLightbox}>
          <div className="pt-lightbox" onClick={(e) => e.stopPropagation()}>
            <button className="pt-lightbox-cerrar" onClick={handleCerrarLightbox}>
              ✕
            </button>
            <button className="pt-lightbox-nav pt-lightbox-izq" onClick={() => navegarLightbox(-1)}>
              ◀
            </button>
            <img 
              src={fotoSeleccionadaLightbox} 
              alt="Foto ampliada"
              className="pt-lightbox-imagen"
            />
            <button className="pt-lightbox-nav pt-lightbox-der" onClick={() => navegarLightbox(1)}>
              ▶
            </button>
          </div>
        </div>
      )}

      <footer className="footer-turismo">
        <p>© 2025 Turismo Puntarenas | La Perla del Pacífico 🌅</p>
      </footer>
    </div>
  );
}

export default PagTurismo;