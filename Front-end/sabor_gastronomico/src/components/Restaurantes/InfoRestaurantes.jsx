import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getRestauranteById } from "../../services/ServicesRestaurantes";
import { ServicesInicio } from "../../services/servicesAdminRest/ServicesInicio";
import { CartContext } from "../../context/CartContext";
import CartIcon from "../CartIcon/CartIcon";
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
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [cantidades, setCantidades] = useState({}); // Cantidades para el carrito
  const [mostrarHorario, setMostrarHorario] = useState(false);
  const [mostrarHora, setmostrarHora] = useState({})
  const [platillosBD, setPlatillosBD] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [resenas, setResenas] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevasFotos, setNuevasFotos] = useState([]);


  // Cuando cargue el restaurante, actualizar resenas
  useEffect(() => {
    if (restaurante?.resenas) {
      setResenas(restaurante.resenas);
    }
  }, [restaurante]);

  const enviarResena = async () => {
  if (!nuevoComentario.trim()) return alert("Escribe un comentario antes de enviar.");

  try {
    // 1️⃣ Crear la reseña
    const res = await ServicesResena.crearResena({
      restaurante: id,
      comentario: nuevoComentario,
      calificacion: nuevaCalificacion,
    });
    const nuevaResena = res.data;

    // 2️⃣ Subir fotos si hay
    for (let i = 0; i < nuevasFotos.length; i++) {
      const formData = new FormData();
      formData.append("resena", nuevaResena.id);
      formData.append("url_foto", nuevasFotos[i]);
      await ServicesResena.crearFotoResena(formData);
    }

    // 3️⃣ Recargar reseñas del restaurante
    const resActualizado = await ServicesResena.obtenerResenas();
    const filtradas = resActualizado.data.filter(r => r.restaurante === id);
    setResenas(filtradas);

    // Limpiar formulario
    setNuevoComentario("");
    setNuevaCalificacion(5);
    setNuevasFotos([]);
  } catch (error) {
    console.log("Error al enviar reseña:", error);
    alert("No se pudo enviar la reseña");
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
  
  console.log(mostrarHora.domingo);

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
  console.log("Platillos:", platillosBD);

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
            <strong>Reseñas:</strong>
            <p>⭐ {restaurante.calificacion_promedio} ({restaurante.total_resenas} opiniones)</p>
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
                  plato.foto
                    ? `https://res.cloudinary.com/dhnmsq2fx/${plato.foto}`
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

      <section className="testimonios-section">
        <h2 className="testimonios-titulo">Lo Que Dicen Nuestros Clientes</h2>
        <p className="testimonios-subtitulo">Tus opiniones nos ayudan a mejorar</p>

        {/* Formulario para nueva reseña */}
        <div className="form-resena">
          <textarea
            placeholder="Escribe tu comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />

          <label>Calificación:</label>
          <select
            value={nuevaCalificacion}
            onChange={(e) => setNuevaCalificacion(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <input
            type="file"
            multiple
            onChange={(e) => setNuevasFotos(Array.from(e.target.files))}
          />

          <button onClick={enviarResena}>Enviar Reseña</button>
        </div>

        {/* Listado de reseñas */}
        <div className="testimonios-grid">
          {resenas.map((t) => (
            <div key={t.id} className="testimonio-card">
              <div className="testimonio-header">
                <div className="testimonio-avatar">
                  {t.usuario_nombre ? t.usuario_nombre[0].toUpperCase() : "U"}
                </div>
                <div className="testimonio-nombre">{t.usuario_nombre || "Anónimo"}</div>
              </div>

              <p className="testimonio-texto">{t.comentario}</p>

              {/* Fotos de la reseña */}
              {t.fotos?.length > 0 && (
                <div className="testimonio-fotos" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  {t.fotos.map((f, i) => (
                    <img 
                      key={i} 
                      src={f.url_foto} 
                      alt={`Foto reseña ${i}`} 
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              )}

              <p className="testimonio-fecha">{new Date(t.fecha_resena).toLocaleDateString()}</p>
              <span>⭐ {t.calificacion}/5</span>
            </div>
          ))}
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
