import React, { useRef, useEffect, useState } from "react";
import "./PagTurismo.css";
import LugaresServices from "../../services/TurismoServices"

function PagTurismo() {
  const carruselRef = useRef(null);
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    LugaresServices.obtenerLugares()
      .then((res) => {
        setLugares(res.data);
      })
      .catch((error) => {
        console.error("Error cargando lugares:", error);
      });
  }, []);

  const scrollIzquierda = () => {
    carruselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollDerecha = () => {
    carruselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Carrusel auto
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (carruselRef.current) {
        carruselRef.current.scrollBy({ left: 300, behavior: "smooth" });

        if (
          carruselRef.current.scrollLeft +
            carruselRef.current.offsetWidth >=
          carruselRef.current.scrollWidth
        ) {
          carruselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="turismo-page">
      <h1>Lugares Turísticos de <span>Puntarenas</span></h1>
      <p>Explora los principales atractivos de la Perla del Pacífico Costarricense.</p>

      <div className="carrusel-container">
        <button className="btn-scroll" onClick={scrollIzquierda}>◀</button>

        <div className="carrusel" ref={carruselRef}>
          {lugares.map((lugar) => (
            <div key={lugar.id} className="lugar-card">
              <img
                src={lugar.imagen_principal}
                alt={lugar.nombre_lugar}
                className="lugar-img"
              />

              <h2>{lugar.nombre_lugar}</h2>
              <p>{lugar.descripcion}</p>

              {/* 🔵 UBICACIÓN DINÁMICA DESDE BACKEND */}
              {lugar.latitud && lugar.longitud && (
                <a
                  href={`https://www.google.com/maps?q=${lugar.latitud},${lugar.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ubicacion-link"
                >
                  📍 Ver ubicación en mapas
                </a>
              )}
            </div>
          ))}
        </div>

        <button className="btn-scroll" onClick={scrollDerecha}>▶</button>
      </div>

      <footer className="footer-turismo">
        <p>© 2025 Turismo Puntarenas | La Perla del Pacífico 🌅</p>
      </footer>
    </div>
  );
}

export default PagTurismo;
