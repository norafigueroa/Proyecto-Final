import React, { useState, useContext } from "react";
import "./InfoRestaurantes.css";
import { CartContext } from "../../context/CartContext";

// 🖼️ Iconos y recursos
import Instagram from "../../assets/Instagram.png";
import Facebook from "../../assets/Facebook.png";
import TikTok from "../../assets/TikTok.png";
import Whatsapp from "../../assets/Whatsapp.png";

import LogoImg from "../../assets/LogoPerlaPacifico.png";
import Ceviche from "../../assets/Cevicha-Pes.webp";
import Patacones from "../../assets/Patacones.webp";
import Sopa from "../../assets/Sopa-Mariscos.webp";
import arroz from "../../assets/Arroz-Camarones.webp";
import Flan from "../../assets/Flan.avif";
import Jugo from "../../assets/Jugo-Piña.webp";
import JugoFresa from "../../assets/Jugo-Fresa.webp";
import Yuca from "../../assets/Yuca-Frita.webp";

function InfoRestaurantes() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("General");
  const { addToCart } = useContext(CartContext);

  // 📍 Datos generales del restaurante
  const restaurantData = {
    name: "Tiki Gastro Pub",
    slogan: "Sabores auténticos del Pacífico.",
    category: "Marisquería",
    rating: 4.2,
    reviews: 46,
    direccion:
      "200 metros norte de El Faro, Provincia de Puntarenas, Barrio El Carmen",
    horario:
      "Lun-Jue: 11:00 AM - 11:00 PM | Vier: 11:00 AM - 12:00 AM | Sáb: 9:30 AM - 12:00 AM | Dom: 9:30 AM - 11:00 PM",
  };

  // ℹ️ Información general del restaurante (map)
  const infoCards = [
    { label: "Reseña", content: `⭐ ${restaurantData.rating} (${restaurantData.reviews} opiniones)` },
    { label: "Dirección", content: `📍 ${restaurantData.direccion}` },
    { label: "Horario", content: `⏰ ${restaurantData.horario}` },
  ];

  // 💳 Categorías informativas
  const infoCategorias = [
    {
      icono: "🐟",
      titulo: "Nuestra Especialidad",
      texto:
        "Mariscos frescos del día preparados con recetas tradicionales puntarenenses. Ceviche de camarón, pescado frito y arroces con mariscos son nuestro orgullo.",
    },
    {
      icono: "💳",
      titulo: "Métodos de Pago",
      texto:
        "Aceptamos efectivo, tarjetas de crédito/débito, SINPE Móvil y todos los principales métodos de pago electrónico.",
    },
  ];

  // 🍽️ Lista de platillos
  const platillos = [
    { nombre: "Yuca Frita", precio: "₡1,500", descripcion: "Crujiente Yuca frita. Acompañada de pico de gallo.", categoria: "Entradas", imagen: Yuca },
    { nombre: "Patacones", precio: "₡1,500", descripcion: "Crujientes Patacones. Acompañados de pico de gallo, carne mechada, guacamole y frijoles molidos.", categoria: "Entradas", imagen: Patacones },
    { nombre: "Ceviche de Pescado", precio: "₡5,500", descripcion: "Delicioso Ceviche de pescado fresco, macerados en jugo de limón, cebolla y chile dulce.", categoria: "Platos Fuertes", imagen: Ceviche },
    { nombre: "Sopa de Mariscos en Agua", precio: "₡5,800", descripcion: "Sopa de mariscos con todo tipo de mariscos y especias, acompañada de arroz blanco.", categoria: "Platos Fuertes", imagen: Sopa },
    { nombre: "Camarones con Arroz", precio: "₡8,000", descripcion: "Deliciosos camarones con arroz, ensalada verde y papas fritas.", categoria: "Platos Fuertes", imagen: arroz },
    { nombre: "Jugo Natural de Piña", precio: "₡1,600", descripcion: "Refrescante jugo natural recién preparado.", categoria: "Bebidas", imagen: Jugo },
    { nombre: "Jugo Natural de Fresa", precio: "₡1,600", descripcion: "Refrescante jugo natural recién preparado.", categoria: "Bebidas", imagen: JugoFresa },
    { nombre: "Flan de Coco", precio: "₡4,000", descripcion: "Suave flan casero con sabor a coco, el final perfecto para tu comida.", categoria: "Postres", imagen: Flan },
  ];

  // 🥇 Categorías de botones
  const categorias = ["General", "Entradas", "Platos Fuertes", "Bebidas", "Postres"];

  // 💬 Testimonios
  const testimonios = [
    {
      avatar: "BH",
      nombre: "Berni Hidalgo",
      texto: "Tiki Gastro Pub es de esos lugares que sorprenden desde el primer bocado. La comida es exquisita, fresca y llena de sabor. El ambiente es relajado, ideal para disfrutar en pareja o con amigos. ¡Definitivamente volveré! 👌✨",
      fecha: "Hace 4 meses",
    },
    {
      avatar: "RR",
      nombre: "Ruben Rodriguez",
      texto: "El lugar y la atención súper bien. Los camarones con arroz muy ricos y los patacones tiki los mejores. Precios accesibles. Perfecto para ver el atardecer o esperar el ferry.",
      fecha: "Hace 1 semana",
    },
    {
      avatar: "JM",
      nombre: "Jose Manuel Robles Tencio",
      texto: "Lugar muy agradable frente al estero, prácticamente al aire libre. Buena atención, precios moderados, ideal para esperar el ferry.",
      fecha: "Hace 4 semanas",
    },
  ];

  // 🌐 Redes sociales
  const redes = [
    { nombre: "Whatsapp", icono: Whatsapp, link: "https://wa.me/50685155757" },
    { nombre: "Instagram", icono: Instagram, link: "https://www.instagram.com/tikigastropub" },
    { nombre: "Facebook", icono: Facebook, link: "https://www.facebook.com/share/1BjMcpx2Kz" },
    { nombre: "TikTok", icono: TikTok, link: "https://www.tiktok.com/@tikigastropub" },
  ];

  // 🔎 Filtrado de platillos por categoría
  const platillosFiltrados =
    categoriaSeleccionada === "General"
      ? platillos
      : platillos.filter((p) => p.categoria === categoriaSeleccionada);

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
        <h2 className="restaurante-nombre">{restaurantData.name}</h2>
        <p className="restaurante-slogan">{restaurantData.slogan}</p>
        <div className="categoria">
          <strong>Categoría: {restaurantData.category}</strong>
        </div>

        <div className="info-cajas">
          {infoCards.map((item, i) => (
            <div key={i} className="info-card">
              <strong>{item.label}:</strong>
              <p>{item.content}</p>
            </div>
          ))}
        </div>

        <div className="categorias-Res">
          {infoCategorias.map((info, i) => (
            <div key={i} className="categoria-card">
              <span className="categoria-icono">{info.icono}</span>
              <h3>{info.titulo}</h3>
              <p>{info.texto}</p>
            </div>
          ))}
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
            <img src={plato.imagen} alt={plato.nombre} />
            <h3>
              <span className="resaltado-menu">{plato.nombre}</span> {plato.precio}
            </h3>
            <p>{plato.descripcion}</p>
            <div className="cantidad-container">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="input-cantidad"
                onChange={(e) => (plato.cantidad = parseInt(e.target.value))}
              />
              <button
                className="btn-agregar" onClick={() => addToCart({ ...plato, cantidad: plato.cantidad || 1 })}> Agregar🛒 </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💬 Testimonios */}
      <section className="testimonios-section">
        <h2 className="testimonios-titulo">Lo Que Dicen Nuestros Clientes</h2>
        <p className="testimonios-subtitulo">Experiencias reales de quienes nos visitaron</p>

        <div className="testimonios-grid">
          {testimonios.map((t, i) => (
            <div key={i} className="testimonio-card">
              <div className="testimonio-header">
                <div className="testimonio-avatar">{t.avatar}</div>
                <div className="testimonio-nombre">{t.nombre}</div>
              </div>
              <p className="testimonio-texto">{t.texto}</p>
              <p className="testimonio-fecha">{t.fecha}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📍 Mapa */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4791814432956!2d-84.85249052599306!3d9.977218373428437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa02f7e264ced07%3A0xa1a11782a929cb67!2sTiki%20Gastro%20Pub!5e0!3m2!1ses!2scr!4v1762957944839!5m2!1ses!2scr"
          title="Tiki Gastro Pub"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* 👣 Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3 className="footer-title">Tiki Gastro Pub</h3>
            <p className="footer-text">
              Restaurante y bar frente al mar con ambiente relajado y familiar.
              Ofrece una experiencia al aire libre con vistas a los atardeceres y al paisaje marítimo.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-contact">
              <li>📱 +506 8515 5757</li>
              <li>{restaurantData.direccion}</li>
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
