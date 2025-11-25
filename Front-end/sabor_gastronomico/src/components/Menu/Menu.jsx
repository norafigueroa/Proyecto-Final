import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CartIcon from "../CartIcon/CartIcon";


import "./Menu.css";

function Menu() {

    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
      { name: "Inicio", path: "/" },
      { name: "Restaurantes", path: "/GeneralRestaurantes" },
      { name: "Cultura", path: "/Cultura" },
      { name: "Turismo", path: "/Turismo" },
      { name: "Contáctanos", path: "/Contactanos" },
      { name: "Iniciar Sesión", path: "/Login" },
    ];

    // Cierra el menú al hacer clic fuera
    useEffect(() => {
      function handleClickOutside(event) {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
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
      <div className='menu-container' ref={containerRef}>
        {/* Navegación escritorio */}

        <nav className='manuInicio'>
          {links.map((link) => (
            <span className={location.pathname === link.path ? "active" : ""} key={link.path} onClick={() => handleNavigate(link.path)}>
              {link.name}
            </span>
          ))}
        </nav>
         {/* 🔹 Carrito */}
          <div className="menu-cart">
            <CartIcon />
          </div>

        {/* Botón menú móvil */}

        <button className='manu-btn' onClick={() => setMenuOpen(!menuOpen)} aria-label='Abrir menú'>
          ☰
        </button>

        {/* Fondo oscuro */}
        <div 
          className={`overlay ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)}>
        </div>

        {/* Menú móvil */}

        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          {links.map((link) => (
            <span className={location.pathname === link.path ? "active" : ""} key={link.path} onClick={() => handleNavigate(link.path)}>
              {link.name}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Menu
