import React, { useState } from "react";
import "./PagContactanos.css";
import { useNavigate } from "react-router-dom";
import Instagram from "../../assets/instagram.png";
import Facebook from "../../assets/facebook.png";
import Tiktok from "../../assets/tiktok.png";

function PagContactanos() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="contacto-page">
      <div className="contacto-header">
        <h1>Contáctanos</h1>
        <p>
          ¿Tienes preguntas o deseas más información sobre Puntarenas?
          ¡Estamos aquí para ayudarte!
        </p>
      </div>

      {/* ====== INFORMACIÓN DE CONTACTO ====== */}
      <div className="contacto-info">
        <h2>Información de contacto</h2>
        <ul>
          <li>📧 saborperladelpacifico@gmail.com</li>
          <li>🌐 www.saborperla.cr</li>
          <li>📱 +506 6095 4689</li>
          <li>📍 Puntarenas, Costa Rica</li>
          <li>🕐 Lunes a Sábados - 8:00 a.m. a 6:00 p.m.</li>
        </ul>

        {/* Redes sociales */}
        <div className="redes-sociales">
          <a
            href="https://www.instagram.com/tikigastropub?utm_source=ig_web_button_share_sheet&igsh=cjVyanE0eWZsbGl6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Instagram} alt="Instagram" />
          </a>
          <a
            href="https://www.facebook.com/share/1BjMcpx2Kz/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Facebook} alt="Facebook" />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Tiktok} alt="TikTok" />
          </a>
        </div>

        <button className="btn-abrir-modal" onClick={handleOpenModal}>
          Enviar mensaje
        </button>
      </div>

      {/* ====== MODAL DEL FORMULARIO ====== */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // evita cerrar si se hace click dentro
          >
            <button className="modal-cerrar" onClick={handleCloseModal}>
              ✖
            </button>
            <h2>Envíanos un mensaje</h2>
            <form className="contacto-form">
              <label>Nombre:</label>
              <input type="text" placeholder="Tu nombre" required />

              <label>Correo electrónico:</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" required />

              <label>Asunto:</label>
              <input type="text" placeholder="Motivo del mensaje" />

              <label>Mensaje:</label>
              <textarea
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
              ></textarea>

              <button type="submit" className="btn-enviar">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      )}


        {/* ====== FOOTER TURISMO ====== */}
        <footer className="footer-turismo">
            <p>© 2025 El Sabor de la Perla del Pacífico | Todos los derechos reservados</p>
        </footer>
    </div>
  );
}

export default PagContactanos;