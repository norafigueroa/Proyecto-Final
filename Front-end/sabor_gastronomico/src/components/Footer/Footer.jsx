import React from 'react'
import { useNavigate } from "react-router-dom";

import Instagram from "../../assets/Instagram.png"
import Facebook from "../../assets/Facebook.png"

import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <div>
      <footer className="footer">
        <div className="footer-container">

          {/* Columna 1 */}
          <div className="footer-col">
            <h3 className="footer-title">El Sabor de la Perla</h3>
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
              <li>saborperladelpacifico@gmail.com</li>
              <li>🌐www.saborperla.cr</li>
              <li>📱+506 6095 4689</li>
              <li>📍Puntarenas, Costa Rica</li>
            </ul>
          </div>

            {/* Columna 4 */}
          <div className="footer-col">
            <h3 className="footer-title">Redes Sociales</h3>
            <div className="social-icons">
                 
              <a href="https://www.instagram.com/elsabordelaperladelpacifico?igsh=c2hxd3Jkemd6Mnhl" target="_blank" rel="noopener noreferrer">
                <img src= {Instagram} alt="Instagram" />
              </a>
              <a href="https://www.facebook.com/share/1Bn4qJV8JQ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <img src= {Facebook} alt="Facebook" />
              </a>
            </div>
          </div>

        </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            © 2025 El Sabor de la Perla del Pacífico | Todos los derechos reservados.
          </div>
      </footer>
    </div>
  )
}

export default Footer
