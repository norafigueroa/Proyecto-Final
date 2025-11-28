import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getRestauranteById } from "../../services/ServicesRestaurantes";
import { CartContext } from "../../context/CartContext";
import "./InfoRestaurantes.css";

// 🖼️ Iconos y recursos de redes
import Instagram from "../../assets/Instagram.png";
import Facebook from "../../assets/Facebook.png";
import TikTok from "../../assets/TikTok.png";
import Whatsapp from "../../assets/Whatsapp.png";
import LogoImg from "../../assets/LogoPerlaPacifico.png";

function InfoRestaurantes() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("General");
  const [cantidades, setCantidades] = useState({}); // Cantidades para el carrito

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRestauranteById(id);
        setRestaurante(data);
      } catch (err) {
        setError("Error al cargar el restaurante.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <p>Cargando restaurante...</p>;
  if (error) return <p>{error}</p>;
  if (!restaurante) return <p>No se encontró el restaurante.</p>;

  // Categorías de menú
  const categorias = ["General", "Entradas", "Platos Fuertes", "Bebidas", "Postres"];

  // Filtrado de platillos
  const platillos = restaurante.platillos || []; 
  const platillosFiltrados =
    categoriaSeleccionada === "General"
      ? platillos
      : platillos.filter((p) => p.categoria === categoriaSeleccionada);

  // Testimonios
  const testimonios = restaurante.resenas || []; 

  const iconosRedes = {
    facebook: Facebook,
    instagram: Instagram,
    tiktok: TikTok,
    whatsapp: Whatsapp,
    twitter: null,
    youtube: null,
    otra: null,
  };

  // Redes sociales (ejemplo estático)
  const redes = (restaurante.redes || []).map((red) => ({
    nombre: red.nombre_red,
    icono: iconosRedes[red.nombre_red],
    link: red.link,
  }));

  return (
    <div>
      <header className="header">
        <div className="header-top">
          <div className="header-content">
            <img className="header-logo" src={LogoImg} alt="Logo Puntarenas" />
            <h1 className="header-title">
              El Sabor de la <span>Perla del Pacífico</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Información principal */}
      <section className="restaurante-info">
        <h2 className="restaurante-nombre">{restaurante.nombre_restaurante}</h2>
        <p className="restaurante-slogan">{restaurante.descripcion}</p>
        <div className="categoria">
          <strong>Categoría: {restaurante.categoria ? restaurante.categoria.nombre_categoria : "Sin categoría"}</strong>
        </div>

        <div className="info-cajas">
          <div className="info-card">
            <strong>Dirección:</strong>
            <p>📍 {restaurante.direccion}</p>
          </div>
          <div className="info-card">
            <strong>Horario:</strong>
            <p>⏰ {restaurante.horario_apertura && restaurante.horario_cierre
                  ? `${restaurante.horario_apertura} - ${restaurante.horario_cierre}`
                  : "No disponible"}</p>
          </div>
          <div className="info-card">
            <strong>Reseñas:</strong>
            <p>⭐ {restaurante.calificacion_promedio} ({restaurante.total_resenas} opiniones)</p>
          </div>
        </div>
      </section>

      {/* Categorías de menú */}
      <section className="categoria-section">
        <h2 className="categorias-titulo-Res">Nuestro Menú</h2>
        <p className="text-menu">Descubre los sabores del Pacífico costarricense</p>

        <div className="categoria-botones">
          {categorias.map((cat) => (
            <button key={cat} className={`categoria-btn ${categoriaSeleccionada === cat ? "activo" : ""}`} onClick={() => setCategoriaSeleccionada(cat)}> {cat} </button>
          ))}
        </div>
      </section>

      {/* 🦐 Lista de platillos */}
      <div className="destacados-grid">
        {platillosFiltrados.map((plato, index) => (
          <div key={index} className="destacado-card">
            <img src={plato.imagen || "https://via.placeholder.com/300x200"} alt={plato.nombre} />
            <h3>
              <span className="resaltado-menu">{plato.nombre}</span> {plato.precio}
            </h3>
            <p>{plato.descripcion}</p>
            <div className="cantidad-container">
              <input
                type="number"
                min="1"
                value={cantidades[plato.id] || 1}
                className="input-cantidad"
                onChange={(e) =>
                  setCantidades({ ...cantidades, [plato.id]: parseInt(e.target.value) })
                }
              />
              <button
                className="btn-agregar"
                onClick={() =>
                  addToCart({ ...plato, cantidad: cantidades[plato.id] || 1 })
                }
              >
                Agregar 🛒
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonios */}
      <section className="testimonios-section">
        <h2 className="testimonios-titulo">Lo Que Dicen Nuestros Clientes</h2>
        <div className="testimonios-grid">
          {testimonios.map((t, i) => (
            <div key={i} className="testimonio-card">
              <div className="testimonio-header">
                <div className="testimonio-avatar">{t.usuario ? t.usuario[0].toUpperCase() : "U"}</div>
                <div className="testimonio-nombre">{t.usuario || "Anonimo"}</div>
              </div>
              <p className="testimonio-texto">{t.comentario}</p>
              <p className="testimonio-fecha">{new Date(t.fecha).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mapa */}
      <div className="map-container">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=${encodeURIComponent(restaurante.direccion)}`}
          title={restaurante.nombre_restaurante}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3 className="footer-title">{restaurante.nombre_restaurante}</h3>
            <p className="footer-text">{restaurante.descripcion}</p>
          </div>
          <div className="footer-col">
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-contact">
              <li>📱 {restaurante.telefono || "No disponible"}</li>
              <li>📍 {restaurante.direccion}</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-title">Redes Sociales</h3>
            <div className="social-icons">
              {redes.map((red, i) => (
                <a key={i} href={red.link} target="_blank" rel="noopener noreferrer">
                  <img src={red.icono} alt={red.nombre} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          © 2025 El Sabor de la Perla del Pacífico. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default InfoRestaurantes;
