import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mariscos from "../../assets/mariscos.webp"
import soda from "../../assets/casado.jpg"
import tipica from "../../assets/gallopinto.jpg"
import "./Inicio.css";

function Inicio() {

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const navigate = useNavigate();

  // 🔹 Lista de restaurantes de Puntarenas
  const restaurantes = [
    { name: "Mariscos El Patio", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "La Cevichería del Muelle", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "La Marisquería del puerto", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "Restaurante Bahía Azul", categoria: "Mariscos", path: "/Restaurantes" },
    { name: "Restaurante El Ancla", categoria: "Comidas Típicas", path: "/Restaurantes" },
    { name: "La Cantina del Puerto", categoria: "Comidas Típicas", path: "/Restaurantes" },
    { name: "Soda Doña Carmen", categoria: "Sodas Tradicionales", path: "/Restaurantes" },
    { name: "Soda La Puntarenense", categoria: "Sodas Tradicionales", path: "/Restaurantes" },
    { name: "Rancho Marino", categoria: "Comidas Típicas", path: "/Restaurantes" },
    { name: "Café del Puerto", categoria: "Sodas Tradicionales", path: "/Restaurantes" },
  ];

  // 🔍 Filtro de búsqueda y categoría
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
          <p className="search-subtitle">Explora los mejores restaurantes de la Perla del Pacífico 🌊</p>

        {/* Botones de categorías */}
        <div className="categoria-botones">
          {["Todos", "Mariscos", "Comidas Típicas", "Sodas Tradicionales"].map((cat) => (
          <button key={cat} className={`categoria-btn ${ categoriaSeleccionada === cat ? "activo" : ""}`} onClick={() => setCategoriaSeleccionada(cat)}>
          {cat}
          </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="busqueda-contenedor">
          <div className="busqueda-box">
            <input type="text" placeholder="Buscar restaurante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
          <span className="busqueda-icono">🔍</span>
        </div>

        {/* Resultados */}
        <ul className="busqueda-lista">
          {searchTerm === "" && categoriaSeleccionada === "Todos" ? (
          <li className="busqueda-msg">Resultados</li>
          ) : filteredData.length > 0 ? (
          filteredData.map((item, index) => (
          <li key={index} className="busqueda-item" onClick={() => handleSelect(item.path)}>
          {item.name}
          </li>
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
            <div className="categoria-card" onClick={() => navigate("/Restaurantes")}>
              <span className="categoria-icono">🍽️</span>
              <h3>Restaurantes</h3>
              <p>Descubre los mejores lugares para disfrutar la auténtica comida puntarenense</p>
            </div>

            <div className="categoria-card" onClick={() => navigate("/Cultura")}>
              <span className="categoria-icono">📖</span>
              <h3>Historias de sabor</h3>
              <p>Conoce el origen de platillos tradicionales y la rica cultura gastronómica de Puntarenas</p>
            </div>

            <div className="categoria-card" onClick={() => navigate("/Turismo")}>
              <span className="categoria-icono">🌴</span>
              <h3>Descubre Puntarenas</h3>
              <p>Historia, cultura y tradiciones de la Perla del Pacífico que debes conocer</p>
            </div>

            <div className="categoria-card" onClick={() => navigate("/Recetas")}>
              <span className="categoria-icono">👩‍🍳</span>
              <h3>Recetario Comunitario</h3>
              <p>Recetas tradicionales transmitidas de generación en generación por familias</p>
            </div>
          </div>
        </section>

        {/* ====== SECCIÓN DE RESTAURANTES DESTACADOS ====== */}
        <section className="destacados-section">
          <h2 className="destacados-titulo">
            Restaurantes <span className="resaltado">Destacados</span>
          </h2>

          <div className="destacados-grid">
            <div className="destacado-card">
              <img className="mariscos" src={mariscos} alt="mariscosImg"/>
              <h3>La Marisquería del Puerto</h3>
              <p>⭐ (4.8) • 127 reseñas</p>
              <p>
                Especialidad en mariscos frescos del día. Ceviche de la casa, pescado entero frito y
                camarones al ajillo son nuestros platillos estrella.
              </p>
            </div>

            <div className="destacado-card" onClick={() => navigate("/restaurantes")}>
              <img className="soda" src={soda} alt="sodaImg"/>
              <h3>Soda Doña Carmen</h3>
              <p>⭐ (4.9) • 203 reseñas</p>
              <p>
                Comida típica costarricense desde 1965. Casados tradicionales, gallo pinto legendario
                y el mejor café de la zona.
              </p>
            </div>

            <div className="destacado-card" onClick={() => navigate("/restaurantes")}>
              <img className="gallopinto" src={tipica} alt="gallopinto"/>
              <h3>Restaurante el Ancla</h3>
              <p>⭐ (4.7) • 89 reseñas</p>
              <p>
                Fusión de sabores del Pacífico con técnicas contemporáneas. Experiencia culinaria
                única con vista panorámica al atardecer.
              </p>
            </div>
          </div>

          <div className="destacados-footer">
            <h3>¿Tienes un Restaurante?</h3>
            <p>
              Únete a nuestra plataforma y lleva tu negocio al mundo digital. Aumenta tu visibilidad,
              alcanza más clientes y forma parte de la comunidad gastronómica más importante de
              Puntarenas.
            </p>
            <div className="botones-footer">
              <button className="btn-registrar" onClick={() => navigate("/register")}>Registrar mi negocio</button>
              <button className="btn-beneficios" onClick={() => navigate("/informacion")}>Conocer beneficios</button>
            </div>
          </div>
        </section>

      </div>

    </div>
  )
}

export default Inicio
