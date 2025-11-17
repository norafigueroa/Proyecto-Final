import React, { useState } from "react";
import "./MenuAdminRest.css"; 

// 🔹 Importa los componentes del contenido
import Dashboard from "./OpcionesMenu/Dashboard/Dashboard";
import GestionMenu from "./OpcionesMenu/GestionMenu/GestionMenu";
import GaleriaAdmin from "./OpcionesMenu/GaleriaAdmin/GaleriaAdmin";
import Perfil from "./OpcionesMenu/Perfil/Perfil";
import Promos from "./OpcionesMenu/Promos/Promos";
import Pedidos from "./OpcionesMenu/Pedidos/Pedidos";
import Resenas from "./OpcionesMenu/Resenas/Resenas";
import Stats from "./OpcionesMenu/Stats/Stats";
import Config from "./OpcionesMenu/ConfigPag/Config";

function MenuAdminRest() {
    const [selected, setSelected] = useState("dashboard");

    // Render dinámico del contenido
    const renderContent = () => {
        switch (selected) {
            case "dashboard": return <Dashboard/>;
            case "menu": return <GestionMenu/>;
            case "galeria": return <GaleriaAdmin/>;
            case "perfil": return <Perfil/>;
            case "promos": return <Promos/>;
            case "pedidos": return <Pedidos/>;
            case "Resenas": return <Resenas/>;
            case "stats": return <Stats/>;
            case "config": return <Config/>;
            default: return <Dashboard/>;
        }
    }

  return (
    <div>
      <div className="menu-admin-container">


        {/* ---------- SIDEBAR ---------- */}
        <aside className="menu-admin-sidebar">
            <div className="sidebar-header">
                <div>
                    <h2>Tiki Gastro Pub</h2>
                    <p>PANEL ADMINISTRATIVO</p>
                </div>  
            </div>
            <ul className="sidebar-menu">
                <li className={selected === "dashboard" ? "active" : ""} onClick={() => setSelected("dashboard")}>Dashboard</li>

                <li className={selected === "menu" ? "active" : ""} onClick={() => setSelected("menu")}>Gestionar Menú</li>

                <li className={selected === "galeria" ? "active" : ""} onClick={() => setSelected("galeria")}>Galeria / Fotos</li>

                <li className={selected === "perfil" ? "active" : ""} onClick={() => setSelected("perfil")}>Mi Perfil</li>

                <li className={selected === "promos" ? "active" : ""} onClick={() => setSelected("promos")}>Promociones</li>

                <li className={selected === "pedidos" ? "active" : ""} onClick={() => setSelected("pedidos")}>Pedidos</li>

                <li className={selected === "resenas" ? "active" : ""} onClick={() => setSelected("resenas")}>Reseñas</li>

                <li className={selected === "stats" ? "active" : ""} onClick={() => setSelected("stats")}>Estadísticas</li>

                <li className={selected === "config" ? "active" : ""} onClick={() => setSelected("config")}>Configuración</li>

                <button className="logout-btn">Cerrar Sesión</button>
            </ul>
        </aside>

        {/* ---------- CONTENIDO PRINCIPAL ---------- */}
        <main className="menu-admin-main"> {renderContent()} </main>
      </div>
    </div>
  )
}

export default MenuAdminRest
