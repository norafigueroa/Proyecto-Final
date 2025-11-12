import React, { useState, useContext } from "react";
import "./InfoRestaurantes.css";
import { CartContext } from "../../context/CartContext";


import Instagram from "../../assets/Instagram.png"
import Facebook from "../../assets/Facebook.png"
import TikTok from "../../assets/TikTok.png"
import Whatsapp from "../../assets/Whatsapp.png"

import LogoImg from "../../assets/LogoPerlaPacifico.png"
import Ceviche from "../../assets/Cevicha-Pes.webp"
import Patacones from "../../assets/Patacones.webp"
import Sopa from "../../assets/Sopa-Mariscos.webp"
import arroz from "../../assets/Arroz-Camarones.webp"
import Flan from "../../assets/Flan.avif"
import Jugo from "../../assets/Jugo-Piña.webp"
import JugoFresa from "../../assets/Jugo-Fresa.webp"
import Yuca from "../../assets/Yuca-Frita.webp"


function InfoRestaurantes() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("General");
  const { addToCart } = useContext(CartContext);

    // Datos del restaurante
  const restaurantData = {
    name: "Tiki Gastro Pub",
    slogan: "Sabores auténticos del Pacífico.",
    category: "Marisquería",
    rating: 4.2,
    reviews: 46,
    direccion: "200 metros norte de El Faro, Provincia de Puntarenas, Barrio El Carmen",
    horario: "Lun-Jue: 11:00 AM - 11:00 PM | Vier: 11:00 AM - 12:00 AM | Sáb: 9:30 AM - 12:00 AM | Dom: 9:30 AM - 11:00 PM"
  };

    // 🔹 Lista de platillos
  const platillos = [
    {
      nombre: "Yuca Frita",
      precio: "₡1,500",
      descripcion:
        "Crujiente Yuca fritas. Acompañada de pico de gallo.",
      categoria: "Entradas",
      imagen: Yuca,
    },
    {
      nombre: "Patacones",
      precio: "₡1,500",
      descripcion:
        "Crujientes Patacones. Acompañados de pico de gallo, carne mechada, guacamole y frijoles molidos.",
      categoria: "Entradas",
      imagen: Patacones,
    },
    {
      nombre: "Ceviche de Pescado",
      precio: "₡5,500",
      descripcion:
        "Delicioso Ceviche de pescado fresco, macerados en jugo de limón, cebolla y chile dulce.",
      categoria: "Platos Fuertes",
      imagen: Ceviche,
    },
    {
      nombre: "Sopa de Mariscos en Agua",
      precio: "₡5,800",
      descripcion:
        "Sopa de mariscos en tu preparación favorita, en agua con todo tipo de mariscos, especies, acompañado de arroz blanco.",
      categoria: "Platos Fuertes",
      imagen: Sopa,
    },
    {
      nombre: "Camarones con Arroz",
      precio: "₡8,000",
      descripcion:
        "Delicioso Camarones con Arroz. Acompañado de ensalada verde y crujientes papas fritas",
      categoria: "Platos Fuertes",
      imagen: arroz,
    },
    {
      nombre: "Jugo Natural de Piña",
      precio: "₡1,600",
      descripcion: "Refrescante jugo natural recién preparado.",
      categoria: "Bebidas",
      imagen: Jugo, 
    },
    {
      nombre: "Jugo Natural de Fresa",
      precio: "₡1,600",
      descripcion: "Refrescante jugo natural recién preparado.",
      categoria: "Bebidas",
      imagen: JugoFresa, 
    },
    {
      nombre: "Flan de Coco",
      precio: "₡4,000",
      descripcion:
        "Suave flan casero con sabor a coco, el final perfecto para tu comida.",
      categoria: "Postres",
      imagen: Flan,
    },
  ];

  // 🔎 Filtrado de platillos por categoría
  const platillosFiltrados =
    categoriaSeleccionada === "General"
      ? platillos
      : platillos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div>
        <div>
          <header className="header">
            {/* Barra superior con logo, título y carrito */}
            <div className="header-top">
              <div className="header-content">
                <img className="header-logo" src={LogoImg} alt="Logo Puntarenas" />
                <h1 className="header-title">
                  El Sabor de la <span>Perla del Pacífico</span>
                </h1>
              </div>
            </div>
          </header>

            {/* Información del restaurante */}
          <section className="restaurante-info">
            <h2 className="restaurante-nombre">{restaurantData.name}</h2>
            <p className="restaurante-slogan">{restaurantData.slogan}</p>
            <div className="categoria">
              <strong>Categoría: {restaurantData.category} </strong>
            </div>


            {/* info */}
            <div className="info-cajas">

              <div className="info-card">
                <strong>Reseña:</strong>
                <p>⭐ {restaurantData.rating} ({restaurantData.reviews} opiniones)</p>
              </div>

              <div className="info-card">
                <strong>Dirección:</strong>
                <p>📍 {restaurantData.direccion}</p>
              </div>

              <div className="info-card">
                <strong>Horario:</strong>
                <p>⏰ {restaurantData.horario}</p>
              </div>
            </div>

            <div className="categorias-Res">
              <div className="categoria-card" onClick={() => navigate("/Restaurantes")}>
                <span className="categoria-icono">🐟</span>
                <h3>Nuestra Especialidad</h3>
                <p>Mariscos frescos del día preparados con recetas tradicionales puntarenenses. 
                  Ceviche de camarón, pescado frito y arroces con mariscos son nuestro orgullo.</p>
              </div>

              <div className="categoria-card" onClick={() => navigate("/Cultura")}>
                <span className="categoria-icono">💳</span>
                <h3>Métodos de Pago</h3>
                <p>
                  Aceptamos efectivo, tarjetas de crédito/débito, SINPE Móvil y todos los principales métodos de pago electrónico.
                </p>
              </div>
            </div>
          </section>

            
            {/* ====== BOTONES DE CATEGORÍAS ====== */}
            <section className="categoria-section">
              <h2 className="categorias-titulo-Res">
                Nuestro Menú
              </h2>

              <p className="text-menu">Descubre los sabores del Pacífico costarricense</p>
              <div className="categoria-botones">
                {["General", "Entradas", "Bebidas", "Platos Fuertes", "Postres"].map((cat) => (
                  <button
                    key={cat}
                    className={`categoria-btn ${
                      categoriaSeleccionada === cat ? "activo" : ""
                    }`}
                    onClick={() => setCategoriaSeleccionada(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <div className="destacados-grid">
              {platillosFiltrados.map((plato, index) => (
                <div key={index} className="destacado-card">
                  <img src={plato.imagen} alt={plato.nombre} />
                  <h3>
                    <span className="resaltado-menu">{plato.nombre}</span> {plato.precio}
                  </h3>
                  <p>{plato.descripcion}</p>
                  
                  <button className="btn-agregar" onClick={() => addToCart(plato)} >Agregar <input type="number" /></button>
                </div>
              ))}
            </div>

            <section className="testimonios-section">
              <h2 className="testimonios-titulo">Lo Que Dicen Nuestros Clientes</h2>
              <p className="testimonios-subtitulo">Experiencias reales de quienes nos visitaron</p>

              <div className="testimonios-grid">
                <div className="testimonio-card">
                  <div className="testimonio-header">
                    <div className="testimonio-avatar">BH</div>
                    <div className="testimonio-nombre">Berni Hidalgo</div>
                  </div>
                  <p className="testimonio-texto">
                    Tiki Gastro Pub es de esos lugares que sorprenden desde el primer bocado. La comida es simplemente exquisita, con combinaciones frescas, creativas y llenas de sabor. El ambiente es relajado, ideal para disfrutar en pareja, con amigos o en familia. 
                    Si visitas Puntarenas y buscas algo más allá de lo típico, este lugar es imperdible. ¡Definitivamente volveré! 👌✨
                  </p>
                  <p className="testimonio-fecha">Hace 4 meses</p>
                </div>

                <div className="testimonio-card">
                  <div className="testimonio-header">
                    <div className="testimonio-avatar">RR</div>
                    <div className="testimonio-nombre">Ruben Rodriguez</div>
                  </div>
                  <p className="testimonio-texto">
                    El lugar y a atención super bien. Unos camarones con arroz muy ricos y grandes, los patacones tiki los mejores.
                    Precios accesibles. Un lugar de bonito ambiente y perfecto para ver el atardecer.

                    Puedes pasar a comer acá mientras esperas el Ferry..
                  </p>
                  <p className="testimonio-fecha">Hace 1 semana</p>
                </div>

                <div className="testimonio-card">
                  <div className="testimonio-header">
                    <div className="testimonio-avatar">JM</div>
                    <div className="testimonio-nombre">Jose Manuel Robles Tencio</div>
                  </div>
                  <p className="testimonio-texto">
                    Lugar muy agradable frente al estero de puntarenas,prácticamente al aire libre. 
                    Buena atención, precios moderados, queda uno satisfecho. Ideal para esperar el ferry.
                  </p>
                  <p className="testimonio-fecha">Hace 4 semanas</p>
                </div>
              </div>
            </section>
            
            <div>
              <h2 className="categorias-titulo-Res">
                Encuéntranos
              </h2>

              <p className="text-menu">200 metros norte de El Faro, Provincia de Puntarenas, Barrio El Carmen</p>

              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4791814432956!2d-84.85249052599306!3d9.977218373428437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa02f7e264ced07%3A0xa1a11782a929cb67!2sTiki%20Gastro%20Pub!5e0!3m2!1ses!2scr!4v1762957944839!5m2!1ses!2scr"  
                  title="Tiki Gastro Pub"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div>
              <footer className="footer">
                <div className="footer-container">

                  {/* Columna 1 */}
                  <div className="footer-col">
                    <h3 className="footer-title">Tiki Gastro Pub</h3>
                    <p className="footer-text">
                      Restaurante y bar frente al mar con ambiente relajado y familiar.
                       Ofrece una experiencia al aire libre con vistas a los atardeceres y al paisaje marítimo. 
                    </p>

                  </div>

                  {/* Columna 2 */}
                  <div className="footer-col">
                    <h3 className="footer-title">Contacto</h3>
                    <ul className="footer-contact">
                      <li>📱+506 8515 5757</li>
                      <li>📍200 metros norte de El Faro, Provincia de Puntarenas, Barrio El Carmen</li>
                    </ul>
                  </div>
                  {/* Columna 3 */}
                  <div className="footer-col">
                    <h3 className="footer-title">Redes Sociales</h3>
                    <div className="social-icons">
                      <a 
                        href="https://wa.me/50685155757" target="_blank"  rel="noopener noreferrer">
                        <img src={Whatsapp} alt="Whatsapp"/>
                      </a>                   
                      <a href="https://www.instagram.com/tikigastropub?utm_source=ig_web_button_share_sheet&igsh=cjVyanE0eWZsbGl6" target="_blank" rel="noopener noreferrer">
                        <img src= {Instagram} alt="Instagram" />
                      </a>
                      <a href="https://www.facebook.com/share/1BjMcpx2Kz/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                        <img src= {Facebook} alt="Facebook" />
                      </a>
                      <a href="https://www.tiktok.com/@tikigastropub?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">
                        <img src= {TikTok} alt="TikTok" />
                      </a>
                    </div>
                  </div>

                </div>

                  <hr className="footer-divider" />

                  <div className="footer-bottom">
                    © 2025 El Sabor de la Perla del Pacífico. Todos los derechos reservados.
                  </div>
              </footer>
            </div>
        </div>
    </div>
  )
}

export default InfoRestaurantes;

