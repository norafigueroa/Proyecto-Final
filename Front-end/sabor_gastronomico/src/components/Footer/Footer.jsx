import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { obtenerConfiguracion } from '../../services/ServicesAdminGeneral/ServicesConfiguracion'
import Instagram from "../../assets/Instagram.png"
import Facebook from "../../assets/Facebook.png"
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const [configuracion, setConfiguracion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const data = await obtenerConfiguracion();
      const config = Array.isArray(data) ? data[0] : data;
      setConfiguracion(config);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <footer className="footer"><p>Cargando...</p></footer>;
  }

  return (
    <div>
      <footer className="footer">
        <div className="footer-container">

          {/* Columna 1 */}
          <div className="footer-col">
            <h3 className="footer-title">{configuracion?.nombre_plataforma || "El Sabor de la Perla"}</h3>
            <p className="footer-text">
              Conectando a turistas y locales con la auténtica gastronomía de Puntarenas desde 2025.
            </p>
          </div>

          {/* Columna 2 */}
          <div className="footer-col">
            <h3 className="footer-title">Navegación</h3>
            <ul className="footer-links">
              <li onClick={() => navigate("/Restaurantes")}>Restaurantes</li>
              <li onClick={() => navigate("/Cultura")}>Cultura</li>
              <li onClick={() => navigate("/Turismo")}>Turismo</li>
              <li onClick={() => navigate("/Contactanos")}>Contáctanos</li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="footer-col">
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-contact">
              <li>{configuracion?.correo_contacto || "contacto@plataforma.com"}</li>
              <li>🌐 www.saborperla.cr</li>
              <li>📱 {configuracion?.telefono_contacto || "+506 0000-0000"}</li>
              <li>📍 {configuracion?.direccion_general || "Puntarenas, Costa Rica"}</li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div className="footer-col">
            <h3 className="footer-title">Redes Sociales</h3>
            <div className="redes-icons">
              {configuracion?.url_instagram && (
                <a href={configuracion.url_instagram} target="_blank" rel="noopener noreferrer">
                  <img src={Instagram} alt="Instagram" />
                </a>
              )}
              {configuracion?.url_facebook && (
                <a href={configuracion.url_facebook} target="_blank" rel="noopener noreferrer">
                  <img src={Facebook} alt="Facebook" />
                </a>
              )}
            </div>
          </div>

        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          © 2025 {configuracion?.nombre_plataforma || "El Sabor de la Perla del Pacífico"} | Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

export default Footer