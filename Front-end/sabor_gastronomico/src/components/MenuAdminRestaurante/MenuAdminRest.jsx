import React, { useState } from "react";
import LogoTiki from "../../assets/LogoTiki.jpg"
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MenuAdminRest.css"; 

// 🔹 Importa los componentes del contenido
import Inicio from "./OpcionesMenu/Inicio/Inicio";
import GestionMenu from "./OpcionesMenu/GestionMenu/GestionMenu";
import GaleriaAdmin from "./OpcionesMenu/GaleriaAdmin/GaleriaAdmin";
import Perfil from "./OpcionesMenu/Perfil/Perfil";
import Promos from "./OpcionesMenu/Promos/Promos";
import Pedidos from "./OpcionesMenu/Pedidos/Pedidos";
import Resenas from "./OpcionesMenu/Resenas/Resenas";
import Stats from "./OpcionesMenu/Stats/Stats";
import Config from "./OpcionesMenu/ConfigPag/Config";

function MenuAdminRest() {
    const [selected, setSelected] = useState("Inicio");
    const [cargandoLogout, setCargandoLogout] = useState(false);
    
    const { logout } = useAuth();
    const navegar = useNavigate();

    // Función para cerrar sesión
    const handleLogout = async () => {
      setCargandoLogout(true);
      try {
        await logout();
        console.log('✅ Sesión cerrada');
        navegar('/Login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
      } finally {
        setCargandoLogout(false);
      }
    };

    // Render dinámico del contenido
    const renderContent = () => {
        switch (selected) {
            case "Inicio": return <Inicio/>;
            case "menu": return <GestionMenu/>;
            case "galeria": return <GaleriaAdmin/>;
            case "perfil": return <Perfil/>;
            case "promos": return <Promos/>;
            case "pedidos": return <Pedidos/>;
            case "resenas": return <Resenas/>;
            case "stats": return <Stats/>;
            case "config": return <Config/>;
            default: return <Inicio/>;
        }
    }

  return (
    <div>
      <div className="menu-admin-container">

        {/* ---------- SIDEBAR ---------- */}
        <aside className="menu-admin-sidebar">
            <div className="sidebar-header">
                <div className='Menu-logo-wrapper'>
                    <img src={LogoTiki} alt="Logo del Restaurante" className='Menu-logo'/>
                </div>
                <div>
                    <h2>Tiki Gastro Pub</h2>
                    <p>PANEL ADMINISTRATIVO</p>
                </div>  
            </div>
            <ul className="sidebar-menu">
                <li className={selected === "Inicio" ? "active" : ""} onClick={() => setSelected("Inicio")}>Inicio</li>

                <li className={selected === "menu" ? "active" : ""} onClick={() => setSelected("menu")}>Gestionar Menú</li>

                <li className={selected === "galeria" ? "active" : ""} onClick={() => setSelected("galeria")}>Galeria / Fotos</li>

                <li className={selected === "perfil" ? "active" : ""} onClick={() => setSelected("perfil")}>Mi Perfil</li>

                <li className={selected === "promos" ? "active" : ""} onClick={() => setSelected("promos")}>Promociones</li>

                <li className={selected === "pedidos" ? "active" : ""} onClick={() => setSelected("pedidos")}>Pedidos</li>

                <li className={selected === "resenas" ? "active" : ""} onClick={() => setSelected("resenas")}>Reseñas</li>

                <li className={selected === "stats" ? "active" : ""} onClick={() => setSelected("stats")}>Estadísticas</li>

                <li className={selected === "config" ? "active" : ""} onClick={() => setSelected("config")}>Configuración</li>

                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={cargandoLogout}
                >
                  {cargandoLogout ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
            </ul>
        </aside>

        {/* ---------- CONTENIDO PRINCIPAL ---------- */}
        <main className="menu-admin-main"> 
          {renderContent()} 
        </main>
      </div>
    </div>
  )
}

export default MenuAdminRest