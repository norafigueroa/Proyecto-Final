import React, { useEffect, useState } from 'react'
import HeaderImg from "../../assets/Header.jpg"
import LogoImg from "../../assets/LogoPerlaPacifico.png"
import { obtenerConfiguracion } from '../../services/ServicesAdminGeneral/ServicesConfiguracion'
import "./Header.css";

function Header() {
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

  if (cargando || !configuracion) {
    return <header className="header"><p>Cargando...</p></header>;
  }

  // Limpiar URL del logo
  const logoLimpio = configuracion.logo?.includes('image/upload/') 
    ? configuracion.logo.replace('image/upload/', '') 
    : (configuracion.logo || LogoImg);

  return (
    <div>
      <header className="header">
        {/* Barra superior con logo y título */}
        <div className="header-top">
          <div className="header-content">
            <img 
              className="header-logo" 
              src={logoLimpio} 
              alt="Logo"
            />
            <h1 className="header-title">
              {configuracion.nombre_plataforma || "El Sabor de la Perla del Pacífico"}
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