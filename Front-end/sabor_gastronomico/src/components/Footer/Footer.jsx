import React from 'react'
import { useNavigate } from "react-router-dom";

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
              <li onClick={() => navigate("/Negocios")}>Para Negocios</li>
            </ul>
          </div>

            {/* Columna 3 */}
          <div className="footer-col">
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-contact">
              <li>📧saborperladelpacifico@gmail.com</li>
              <li>🌐www.saborperla.cr</li>
              <li>📱+506 6095 4689</li>
              <li>📍Puntarenas, Costa Rica</li>
            </ul>
          </div>

        </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            © 2025 El Sabor de la Perla del Pacífico. Todos los derechos reservados.
          </div>
      </footer>
    </div>
  )
}

export default Footer
