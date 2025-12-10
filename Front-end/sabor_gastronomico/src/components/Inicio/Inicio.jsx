import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRestaurantes } from "../../services/ServicesRestaurantes";
import { obtenerConfiguracion } from '../../services/ServicesAdminGeneral/ServicesConfiguracion'

import mariscos from "../../assets/mariscos.webp";
import soda from "../../assets/soda.webp";
import tipica from "../../assets/gallopinto.jpg";
import "./Inicio.css";

function Inicio() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [restaurantes, setRestaurantes] = useState([]);
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Traer restaurantes desde la API
  useEffect(() => {
    async function obtener() {
      try {
        const data = await getRestaurantes();
        console.log("🔥 Restaurantes recibidos:", data);
        setRestaurantes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    obtener();
  }, []);

  // Traer configuración desde la API
  useEffect(() => {
    async function obtenerConfig() {
      try {
        const data = await obtenerConfiguracion();
        const config = Array.isArray(data) ? data[0] : data;
        setConfiguracion(config);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    }
    obtenerConfig();
  }, []);

  console.log(restaurantes);
  
  // Filtrar por búsqueda y categoría
  const filteredData = restaurantes.filter((item) => {
    const matchesSearch = item.nombre_restaurante
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = categoriaSeleccionada === "Todos" || item.categoria?.nombre_categoria === categoriaSeleccionada;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (id) => {
    console.log(id);
    navigate(`/Restaurante/${id}`);
  };

  if (loading) return <p>Cargando restaurantes...</p>;
  if (error) return <p>{error}</p>;

  // Restaurantes destacados
  const destacados = [
    {
      nombre: "Tiki Gastro Pub",
      img: mariscos,
      rating: "⭐ (4.2) • 46 reseñas",
      descripcion:
        "Restaurante tipo Gastro Pub & Bar frente al mar, con ambiente al aire libre, atardeceres únicos y atención familiar. Ofrece mariscos frescos, cortes especiales, hamburguesas artesanales, nachos, cócteles y cerveza draft.",
    },
    {
      nombre: "Soda La Esquina 2",
      img: soda,
      rating: "⭐ (4.5) • 87 reseñas",
      descripcion: "Casados tradicionales, gallo pinto legendario y el mejor café de la zona.",
    },
    {
      nombre: "Restaurante El Ancla",
      img: tipica,
      rating: "⭐ (4.7) • 89 reseñas",
      descripcion:
        "Fusión de sabores del Pacífico con técnicas contemporáneas. Experiencia culinaria única con vista panorámica al atardecer.",
    },
  ];

  return (
    <div>
      <div className="search-page">
        <p className="title">{configuracion?.nombre_plataforma || "Bienvenidos al Paraíso Gastronómico"}</p>
        <h1 className="search-title">¿Qué antojo tienes hoy?</h1>
        <p className="search-subtitle">
          Explora los mejores restaurantes de la Perla del Pacífico 🌊
        </p>

        {/* Botones de categorías */}
        <div className="categoria-botones">
          {["Todos", "Mariscos", "Comida China", "Sodas", "Comida Rápidas"].map((cat) => (
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

        {/* Lista de resultados */}
        <ul className="busqueda-lista">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <li
                key={item.id}
                className="busqueda-item"
                onClick={() => handleSelect(item.id)}
              >
                {item.nombre_restaurante}
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
            {[
              {
                icono: "🍽️",
                titulo: "Restaurantes",
                desc: "Descubre los mejores lugares para disfrutar la auténtica comida puntarenense",
                path: "/GeneralRestaurantes",
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
                icono: "🖼️​",
                titulo: "Galería Comunitaria",
                desc: "Descubre Puntarenas a través de los ojos de su gente.",
                path: "/Galeria",
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
              <div key={index} className="destacado-card" onClick={() => navigate(`/Restaurante/1`)}>
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
              <button className="btn-registrar" onClick={() => navigate("/RestauranteRegister")}> Registrar mi negocio </button>
              <button className="btn-beneficios" onClick={() => navigate("/Beneficios")}> Conocer beneficios </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Inicio;