import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Menu.css";

function Menu() {

    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Cierra el menú al hacer clic fuera
    useEffect(() => {
      function handleClickOutside(event) {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Oculta el menú al agrandar la pantalla
    useEffect(() => {
      function handleResize() {
        if (window.innerWidth > 768) {
          setMenuOpen(false);
        }
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

      const handleNavigate = (path) => {
          navigate(path);
          setMenuOpen(false);
    };


  return (
    <div>
      <div>
          {/* Navegación escritorio */}
          <nav className="menuInicio">
              <span onClick={() => handleNavigate("/")}>Inicio</span>
              <span onClick={() => handleNavigate("/Restaurantes")}>Restaurantes</span>
              <span onClick={() => handleNavigate("/Cultura")}>Cultura</span>
              <span onClick={() => handleNavigate("/Turismo")}>Turismo</span>
              <span onClick={() => handleNavigate("/Contáctanos")}>Contáctanos</span>
              <span onClick={() => handleNavigate("/Iniciar Sesión")}>Iniciar Sesión</span>
          </nav>

          {/* Botón menú móvil */}
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      <div
          className={`overlay ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)}>
      </div>

      {/* Menú móvil */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          <span onClick={() => { handleNavigate("/"); setMenuOpen(false); }}>Inicio</span>
          <span onClick={() => { handleNavigate("/Restaurantes"); setMenuOpen(false); }}>Restaurantes</span>
          <span onClick={() => { handleNavigate("/Cultura"); setMenuOpen(false); }}>Cultura</span>
          <span onClick={() => { handleNavigate("/Turismo"); setMenuOpen(false); }}>Turismo</span>
          <span onClick={() => { handleNavigate("/Contáctanos"); setMenuOpen(false); }}>Contáctanos</span>
          <span onClick={() => { handleNavigate("/Iniciar Sesión"); setMenuOpen(false); }}>Iniciar Sesión</span>

      </div>
    </div>
  )
}

export default Menu
