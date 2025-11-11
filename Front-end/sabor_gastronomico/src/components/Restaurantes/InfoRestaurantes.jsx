import React, { useState } from "react";
import "./InfoRestaurantes.css";


import LogoImg from "../../assets/LogoPerlaPacifico.png"
import Ceviche from "../../assets/Ceviche-camaron.jpeg"
import Camarones from "../../assets/Camarones-al-ajillo.jpg"
import arroz from "../../assets/arroz-con-mariscos.jpg"
import Flan from "../../assets/Flan.avif"
import Jugo from "../../assets/Jugo-piña.jpg"
import Costilla from "../../assets/Costilla.webp"


function InfoRestaurantes() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("General");

    // Datos del restaurante
  const restaurantData = {
    name: "La Marisquería del Puerto",
    slogan: "Sabores auténticos del Pacífico desde 2015",
    category: "Marisquería",
    rating: 4.8,
    reviews: 127,
    direccion: "Puntarenas Centro, 200m del Muelle",
    horario: "Lun-Dom: 10:00 AM - 10:00 PM",
  };

    // 🔹 Lista de platillos
  const platillos = [
    {
      nombre: "Costilla Frita",
      precio: "₡3,500",
      descripcion:
        "Crujientes costillas fritas marinadas con especias caseras.",
      categoria: "Entradas",
      imagen: Costilla,
    },
    {
      nombre: "Ceviche de Camarón",
      precio: "₡7,000",
      descripcion:
        "Delicioso ceviche preparado con camarones frescos. Acompañado de arroz blanco y crujientes patacones.",
      categoria: "Platos Fuertes",
      imagen: Ceviche,
    },
    {
      nombre: "Camarones al Ajillo",
      precio: "₡10,000",
      descripcion:
        "Camarones jumbo salteados en mantequilla con ajo, vino blanco y un toque de chile picante.",
      categoria: "Platos Fuertes",
      imagen: Camarones,
    },
    {
      nombre: "Arroz con Mariscos",
      precio: "₡12,000",
      descripcion:
        "Delicioso arroz con camarones, calamares, mejillones y pulpo. Una explosión de sabores marinos.",
      categoria: "Platos Fuertes",
      imagen: arroz,
    },
    {
      nombre: "Jugo Natural de Piña",
      precio: "₡2,500",
      descripcion: "Refrescante jugo natural recién preparado.",
      categoria: "Bebidas",
      imagen: Jugo, 
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
              {/* Barra superior con logo y título */}
              <div className="header-top">
                <div className="header-content">
                    <img className="header-logo" src={LogoImg} alt="Logo Puntarenas"/>
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
              <h2 className="categorias-titulo">
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
                  <button className="btn-agregar">+ Agregar</button>
                </div>
              ))}
            </div>



            
        </div>
    </div>
  )
}

export default InfoRestaurantes;

