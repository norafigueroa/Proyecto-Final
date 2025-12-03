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

  // Cargar lugares
  useEffect(() => {
    const cargarLugares = async () => {
      try {
        setCargando(true);
        const data = await obtenerSitiosTuristicos();
        const lugaresArray = Array.isArray(data) ? data : data.results || [];
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
      setFotos(fotosData || []);
    } catch (error) {
      console.error("Error cargando fotos:", error);
      setFotos([]);
    }
  };

  // Effect para procesar las URLs de las fotos
  useEffect(() => {
    if (fotos.length > 0) {
      const fotosProcessadas = fotos.map(foto => ({
        ...foto,
        url_foto: foto.url_foto.replace("image/upload/", "")
      }));
      setFotos(fotosProcessadas);
    }
  }, [lugarSeleccionado]);

  const handleAbrirModal = async (lugar) => {
    setLugarSeleccionado(lugar);
    await cargarFotos(lugar.id);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setLugarSeleccionado(null);
    setFotos([]);
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

              {(lugarSeleccionado.latitud || lugarSeleccionado.longitud) && (
                <div className="pt-coordenadas">
                  <p>
                    <strong>📍 Coordenadas:</strong>
                  </p>
                  <p>
                    Latitud: {lugarSeleccionado.latitud || "No especificada"}
                  </p>
                  <p>
                    Longitud: {lugarSeleccionado.longitud || "No especificada"}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${lugarSeleccionado.latitud},${lugarSeleccionado.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-mapa-link"
                  >
                    Abrir en Google Maps
                  </a>
                </div>
              )}

              {fotos.length > 0 && (
                <div className="pt-fotos-galeria">
                  <h3>Galería de Fotos</h3>
                  <div className="pt-galeria-grid">
                    {fotos.map((foto) => (
                      <img
                        key={foto.id}
                        src={foto.url_foto}
                        alt="Foto del lugar"
                        className="pt-foto-miniatura"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
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