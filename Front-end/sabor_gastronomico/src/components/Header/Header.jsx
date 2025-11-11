import React from 'react'
import HeaderImg from "../../assets/Header.jpg"
import LogoImg from "../../assets/LogoPerlaPacifico.png"
import "./Header.css";

function Header() {

  return (
    <div>
      <header className="header">
        {/* Barra superior con logo y título */}
        <div className="header-top">
          <div className="header-content">
            <img className="header-logo" src={LogoImg} alt="Logo Puntarenas"/>
            <h1 className="header-title">
              El Sabor de la <span>Perla del Pacífico</span>
            </h1>
          </div>
        </div>

        {/* Imagen principal (banner) */}
        <img className="header-banner" src={HeaderImg} alt="Vista Puntarenas"/>
      </header>
    </div>
  )
}

export default Header
