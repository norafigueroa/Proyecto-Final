import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mariscos from "../../assets/mariscos.webp";
import soda from "../../assets/soda.webp";
import tipica from "../../assets/gallopinto.jpg";
import "./Inicio.css";

function Inicio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const navigate = useNavigate();

  // 🔹 Lista de restaurantes de Puntarenas
  const restaurantes = [
    { name: "El Jorón", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "Tiki Gastro Pub", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "Casa Almendro", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "Restaurante El Ancla", categoria: "Comidas Típicas", path: "/Restaurantes" },
    { name: "La Cantina del Puerto", categoria: "Comidas Típicas", path: "/Restaurantes" },
    { name: "Soda La Esquina 2", categoria: "Sodas Tradicionales", path: "/Restaurantes" },
    { name: "Soda La Favorita", categoria: "Sodas Tradicionales", path: "/Restaurantes" },
    { name: "Rancho Marino", categoria: "Comidas Típicas", path: "/Restaurantes" },
    { name: "Soda Martinez", categoria: "Sodas Tradicionales", path: "/Restaurantes" },
  ];

  // 🔹 Restaurantes destacados (sección inferior)
  const destacados = [
    {
      nombre: "Tiki Gastro Pub",
      img: mariscos,
      rating: "⭐ (4.2) • 46 reseñas",
      descripcion:
        "Restaurante tipo Gastro Pub & Bar frente al mar, con ambiente al aire libre, atardeceres únicos y atención familiar. Ofrece mariscos frescos, cortes especiales, hamburguesas artesanales, nachos, cócteles y cerveza draft.",
      path: "/restaurantes",
    },
    {
      nombre: "Soda La Esquina 2",
      img: soda,
      rating: "⭐ (4.5) • 87 reseñas",
      descripcion: "Casados tradicionales, gallo pinto legendario y el mejor café de la zona.",
      path: "/restaurantes",
    },
    {
      nombre: "Restaurante El Ancla",
      img: tipica,
      rating: "⭐ (4.7) • 89 reseñas",
      descripcion:
        "Fusión de sabores del Pacífico con técnicas contemporáneas. Experiencia culinaria única con vista panorámica al atardecer.",
      path: "/restaurantes",
    },
  ];

  // 🔍 Filtro de búsqueda
  const filteredData = restaurantes.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoriaSeleccionada === "Todos" || item.categoria === categoriaSeleccionada;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="search-page">
        <p className="title">Bienvenidos al Paraíso Gastronómico</p>
          <h1 className="search-title">¿Qué antojo tienes hoy?</h1>
        <p className="search-subtitle">
          Explora los mejores restaurantes de la Perla del Pacífico 🌊
        </p>

        {/* Botones de categorías */}
        <div className="categoria-botones">
          {["Todos", "Mariscos", "Comidas Típicas", "Sodas Tradicionales"].map((cat) => (
            <button key={cat} className={`categoria-btn ${categoriaSeleccionada === cat ? "activo" : ""}`} onClick={() => setCategoriaSeleccionada(cat)}> {cat}</button>
          ))}
        </div>

        {/* Buscador */}
        <div className="busqueda-contenedor">
          <div className="busqueda-box">
            <input type="text" placeholder="Buscar restaurante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <span className="busqueda-icono">🔍</span>
        </div>

        {/* Resultados */}
        <ul className="busqueda-lista">
          {searchTerm === "" && categoriaSeleccionada === "Todos" ? (
            <li className="busqueda-msg">Resultados</li>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <li key={index} className="busqueda-item" onClick={() => handleSelect(item.path)}>{item.name}</li>
            ))
          ) : (
            <li className="busqueda-msg">No se encontraron restaurantes</li>
          )}
        </ul>

        {/* ====== SECCIÓN DE EXPLORAR ====== */}
        <section className="categorias-section">
          <h2 className="categorias-titulo">
            Explora por <span className="resaltado">Categorías</span>
          </h2>

          <div className="categorias-grid">
            {[
              {
                icono: "🍽️",
                titulo: "Restaurantes",
                desc: "Descubre los mejores lugares para disfrutar la auténtica comida puntarenense",
                path: "/Restaurantes",
              },
              {
                icono: "📖",
                titulo: "Historias de sabor",
                desc: "Conoce el origen de platillos tradicionales y la rica cultura gastronómica de Puntarenas",
                path: "/Cultura",
              },
              {
                icono: "🌴",
                titulo: "Descubre Puntarenas",
                desc: "Historia, cultura y tradiciones de la Perla del Pacífico que debes conocer",
                path: "/Turismo",
              },
              {
                icono: "👩‍🍳",
                titulo: "Recetario Comunitario",
                desc: "Recetas tradicionales transmitidas de generación en generación por familias",
                path: "/Recetas",
              },
            ].map((item, index) => (
              <div key={index} className="categoria-card" onClick={() => navigate(item.path)}>
                <span className="categoria-icono">{item.icono}</span>
                <h3>{item.titulo}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== SECCIÓN DE RESTAURANTES DESTACADOS ====== */}
        <section className="destacados-section">
          <h2 className="destacados-titulo">
            Restaurantes <span className="resaltado">Destacados</span>
          </h2>

          <div className="destacados-grid">
            {destacados.map((rest, index) => (
              <div key={index} className="destacado-card" onClick={() => navigate(rest.path)}>
                <img src={rest.img} alt={rest.nombre} />
                <h3>{rest.nombre}</h3>
                <p>{rest.rating}</p>
                <p>{rest.descripcion}</p>
              </div>
            ))}
          </div>

          <div className="destacados-footer">
            <h3>¿Tienes un Restaurante?</h3>
            <p>
              Únete a nuestra plataforma y lleva tu negocio al mundo digital. Aumenta tu visibilidad,
              alcanza más clientes y forma parte de la comunidad gastronómica más importante de
              Puntarenas.
            </p>
            <div className="botones-footer">
              <button className="btn-registrar" onClick={() => navigate("/Register")}> Registrar mi negocio </button>
              <button className="btn-beneficios" onClick={() => navigate("/Informacion")}> Conocer beneficios </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Inicio;
