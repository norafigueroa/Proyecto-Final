import React from "react";
import "./BeneficiosRest.css";

function BeneficiosRest() {
  return (
    <section className="beneficios-section">
      <div className="beneficios-container">
        <h2 className="beneficios-titulo">¿Tienes un Restaurante?</h2>
        <p className="beneficios-descripcion">
          Únete a nuestra plataforma y lleva tu negocio al mundo digital. Aumenta tu visibilidad,
          alcanza más clientes y forma parte de la comunidad gastronómica más importante de Puntarenas.
        </p>

        <div className="beneficios-grid">
          <div className="beneficio-card">
            <h3>Mayor visibilidad digital</h3>
            <p>
              Haz que más personas conozcan tu restaurante mediante búsquedas, listados y recomendaciones
              dentro de la plataforma.
            </p>
          </div>

          <div className="beneficio-card">
            <h3>Presencia profesional en línea</h3>
            <p>
              Crea una página con tu menú, fotos y ubicación sin necesidad de conocimientos técnicos.
            </p>
          </div>

          <div className="beneficio-card">
            <h3>Atrae más clientes</h3>
            <p>
              Los turistas y locales podrán descubrir tu restaurante fácilmente y dejar reseñas positivas.
            </p>
          </div>

          <div className="beneficio-card">
            <h3>Promoción y marketing</h3>
            <p>
              Participa en campañas de promoción y destaca entre los restaurantes más populares de Puntarenas.
            </p>
          </div>

          <div className="beneficio-card">
            <h3>Conexión con la comunidad</h3>
            <p>
              Colabora con otros negocios locales y participa en eventos gastronómicos exclusivos.
            </p>
          </div>

          <div className="beneficio-card">
            <h3>Gestión y estadísticas</h3>
            <p>
              Administra tu información fácilmente y obtén datos sobre el rendimiento de tu restaurante en la plataforma.
            </p>
          </div>
        </div>

        <div className="beneficios-cta">
          <p>¿Listo para digitalizar tu restaurante?</p>
          <button
            className="beneficios-btn"
            onClick={() => (window.location.href = "/registrarse")}
          >
            ¡Únete ahora!
          </button>
        </div>
      </div>
    </section>
  );
}

export default BeneficiosRest;