import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getRestauranteById } from "../../services/ServicesRestaurantes";
import { ServicesInicio } from "../../services/servicesAdminRest/ServicesInicio";
import { ServicesTestimonios } from "../../services/servicesAdminRest/ServicesTestimonios";
import { CartContext } from "../../context/CartContext";
import CartIcon from "../CartIcon/CartIcon";
import "./InfoRestaurantes.css";

//Iconos y recursos de redes
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
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [cantidades, setCantidades] = useState({}); // Cantidades para el carrito
  const [mostrarHorario, setMostrarHorario] = useState(false);
  const [mostrarHora, setmostrarHora] = useState({})
  const [platillosBD, setPlatillosBD] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [testimonios, setTestimonios] = useState([]);
  const [nuevoTestimonio, setNuevoTestimonio] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");

  const [nuevaCalificacion, setNuevaCalificacion] = useState(0); 
  const [startIndex, setStartIndex] = useState(0); // Para carrusel de testimonios



  // ⭐ Componente para mostrar calificación con medias estrellas
  function EstrellasPromedio({ valor }) {
    const estrellas = [];

    for (let i = 1; i <= 5; i++) {
      if (valor >= i) {
        estrellas.push(<span key={i} className="star filled">★</span>);
      } else if (valor >= i - 0.5) {
        estrellas.push(<span key={i} className="star half">★</span>);
      } else {
        estrellas.push(<span key={i} className="star">★</span>);
      }
    }

    return <div className="estrellas-promedio">{estrellas}</div>;
  }

  // Cuando cargue el restaurante, actualizar resenas
  useEffect(() => {
    async function fetchTestimonios() {

      try {
        const res = await ServicesTestimonios.obtenerTestimonios(id);
      
        
        const data = res.data;

        if (data && typeof data.map === "function") {
          setTestimonios(data);
        } else if (data?.results && typeof data.results.map === "function") {
          setTestimonios(data.results);
        } else {
          setTestimonios([]);
        }

      } catch (error) {
        console.log("Error cargando testimonios:", error);
        setTestimonios([]);
      }
    }

    fetchTestimonios();
  }, [id]);


  const enviarTestimonio = async () => {
      if (!nombreCliente.trim() || !nuevoTestimonio.trim() || nuevaCalificacion === 0) {
        return alert("Ingresa tu nombre, comentario y calificación.");
      }

      try {
        await ServicesTestimonios.crearTestimonio({
          restaurante: id,
          nombre: nombreCliente,
          comentario: nuevoTestimonio,
          calificacion: nuevaCalificacion 
        });

        const res = await ServicesTestimonios.obtenerTestimonios(id);
        setTestimonios(res.data);

        setNombreCliente("");
        setNuevoTestimonio("");
        setNuevaCalificacion(0);
      } catch (error) {
        console.log("Error enviando testimonio:", error);
      }
    };


  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRestauranteById(id);
        const datah = await ServicesInicio.obtenerHorario(id)
        console.log(datah.data.horario);
        setmostrarHora(datah.data.horario)
        
        setRestaurante(data);
      } catch (err) {
        setError("Error al cargar el restaurante.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

    useEffect(() => {
    async function fetchPlatillos() {
      try {
        const res = await ServicesInicio.obtenerPlatillos(id);
        setPlatillosBD(res.data.results || res.data);
      } catch (error) {
        console.log("Error cargando platillos:", error);
      }
    }

    fetchPlatillos();
  }, [id]);

  console.log(platillosBD);
  


    useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await ServicesInicio.obtenerCategorias();
        setCategorias(res.data.results || res.data || []);
      } catch (error) {
        console.log("Error cargando categorías:", error);
      }
    }

    fetchCategorias();
  }, []);

  if (loading) return <p>Cargando restaurante...</p>;
  if (error) return <p>{error}</p>;
  if (!restaurante) return <p>No se encontró el restaurante.</p>;

  // Horario detallado por día
  const horarioSemana = restaurante.horarios || {
    lunes:    { apertura: "", cierre: "", cerrado: false },
    martes:   { apertura: "", cierre: "", cerrado: false },
    miercoles:{ apertura: "", cierre: "", cerrado: false },
    jueves:   { apertura: "", cierre: "", cerrado: false },
    viernes:  { apertura: "", cierre: "", cerrado: false },
    sabado:   { apertura: "", cierre: "", cerrado: false },
    domingo:  { apertura: "", cierre: "", cerrado: false }
  };
  
  /* console.log(mostrarHora.domingo); */

  const categoriasParaMostrar = [
    { id: 0, nombre_categoria: "General" },
    ...categorias.filter(cat => cat.nombre_categoria.toLowerCase() !== "general")
  ];


  // Filtrado de platillos
  const platillos = platillosBD; 
  const platillosFiltrados =
    categoriaSeleccionada === 0
      ? platillosBD
      : platillosBD.filter((p) => p.categoria_menu === categoriaSeleccionada);
/*   console.log("Platillos:", platillosBD); */
 

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


  console.log(testimonios);
  
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
      {/* 🔹 Carrito */}
      <div className="menu-cart">
        <CartIcon />
      </div>

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
          <div className="info-card" onClick={() => setMostrarHorario(true)} style={{cursor:"pointer"}}>
            <h3>Horario</h3>
            <p> Ver detalles</p>
          </div>
          <div className="info-card">
            <strong>Calificación:</strong>

            <div className="rating-promedio-box">
              <EstrellasPromedio valor={restaurante.calificacion_promedio} />

              <p className="rating-num">
                {restaurante.calificacion_promedio.toFixed(1)} / 5
              </p>

              <p className="rating-total">
                ({restaurante.total_resenas} reseñas)
              </p>
            </div>
          </div>
        </div>
      </section>

      {mostrarHorario && (
        <div className="modal-overlay">
          <div className="modal-content">

            <h2>Horarios del Restaurante</h2>

            {Object.entries(mostrarHora).map(([dia, datos]) => (
              <div key={dia} className="horario-item">
                <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</strong>
                
                {datos.cerrado ? (
                  <span> Cerrado </span>
                ) : (
                  <span> Apertura: {datos.apertura} - Cierre: {datos.cierre} </span>
                )}
              </div>
            ))}

            <button className="modal-cerrar" onClick={() => setMostrarHorario(false)}>
              Cerrar
            </button>

          </div>
        </div>
      )}

      {/* Categorías de menú */}
      <div className="categoria-botones">
        {categoriasParaMostrar.map((cat) => (
          <button
            key={cat.id}
            className={`categoria-btn ${
              categoriaSeleccionada === cat.id ? "activo" : ""
            }`}
            onClick={() => setCategoriaSeleccionada(cat.id)}
          >
            {cat.nombre_categoria}
          </button>
        ))}
      </div>


     {/* 🦐 Lista de platillos */}
      <div className="destacados-grid">
        {platillosFiltrados.map((plato, index) => {
          return (
            <div key={plato.id} className="destacado-card" style={{ position: "relative" }}>

              {/* BADGE DESCUENTO */}
              <div className="nombre-y-descuento">
                <h3 className="nombre-plato">{plato.nombre}</h3>

                {plato.promocion && plato.porcentaje > 0 && (
                  <span className="badge-descuento">-{plato.porcentaje}%</span>
                )}
              </div>
              {/* FOTO CLOUDINARY */}
              <img
                src={
                  plato.foto && plato.foto.includes("https://")
                    ? "https://" + plato.foto.split("https://")[1]  // extrae la URL válida
                    : "https://via.placeholder.com/300x200"
                }
                alt={plato.nombre_platillo}
              />


              {/* NOMBRE + PRECIO */}
              <h3>
                <span className="resaltado-menu">{plato.nombre_platillo}</span>{" "}
                {plato.promocion ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>
                      ₡{plato.precio}
                    </span>
                    <span className="precio-descuento">
                      ₡{plato.precio_descuento}
                    </span>
                  </>
                ) : (
                  <>₡{plato.precio}</>
                )}
              </h3>

              {/* DESCRIPCIÓN */}
              <p>{plato.descripcion}</p>

              {/* CANTIDAD + BOTÓN → ESTO VA AQUÍ ADENTRO */}
              <div className="cantidad-container">
                <input
                  type="number"
                  min="1"
                  value={cantidades[plato.id] || 1}
                  className="input-cantidad"
                  onChange={(e) =>
                    setCantidades({
                      ...cantidades,
                      [plato.id]: parseInt(e.target.value),
                    })
                  }
                />

                <button
                  className="btn-agregar"
                  onClick={() =>
                    addToCart({ ...plato, cantidad: cantidades[plato.id] || 1 })
                  }
                >
                  + Agregar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============== TESTIMONIOS ============== */}
      <section className="testimonios-section">
        <h2 className="testimonios-titulo">Lo Que Dicen Nuestros Clientes</h2>
        <p className="testimonios-subtitulo">Experiencias reales</p>

        {/* CARRUSEL DE TESTIMONIOS */}
        <div className="carrusel-container">
          <button
            className="carrusel-btn prev"
            onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}
            disabled={startIndex === 0}
          >
            ◀
          </button>

          <div className="testimonios-grid">
            {testimonios
              .slice(startIndex, startIndex + 4)
              .map((t) => (
                <div key={t.id} className="testimonio-card">
                  <div className="testimonio-header">
                    <div className="testimonio-avatar">
                      {t.nombre ? t.nombre[0].toUpperCase() : "?"}
                    </div>
                    <div className="testimonio-nombre">{t.nombre}</div>
                  </div>

                  <div className="testimonio-estrellas">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span
                        key={num}
                        className={num <= t.calificacion ? "star filled" : "star"}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="testimonio-texto">{t.comentario}</p>
                  <p className="testimonio-fecha">
                    {new Date(t.fecha).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>

          <button
            className="carrusel-btn next"
            onClick={() =>
              setStartIndex((prev) =>
                Math.min(prev + 1, testimonios.length - 4)
              )
            }
            disabled={startIndex + 4 >= testimonios.length}
          >
            ▶
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="form-testimonio">
          <p className="testimonios-subtitulo">Cuentanos tu experiencia</p>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />

          <textarea
            placeholder="Escribe tu comentario..."
            value={nuevoTestimonio}
            onChange={(e) => setNuevoTestimonio(e.target.value)}
          />

          {/* ⭐🔥 ESTRELLAS PARA CALIFICAR */}
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={num <= nuevaCalificacion ? "star filled" : "star"}
                onClick={() => setNuevaCalificacion(num)}
              >
                ★
              </span>
            ))}
          </div>

          <button onClick={enviarTestimonio}>Enviar Testimonio</button>
        </div>
      </section>


      {/* Mapa */}
{/*       <div className="map-container">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=${encodeURIComponent(restaurante.direccion)}`}
          title={restaurante.nombre_restaurante}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div> */}

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
