import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getRestauranteById } from "../../services/ServicesRestaurantes";
import "./MenuAdminRest.css"; 

// Importa los componentes del contenido
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

    // 🌟 Estado del restaurante
    const [restaurante, setRestaurante] = useState(null);

    const { id } = useParams();
    const { logout } = useAuth();
    const navegar = useNavigate();

    // Cargar restaurante dinámicamente

    useEffect(() => {
        async function obtenerDatos() {
            try {
                const data = await getRestauranteById(id);
                setRestaurante(data);
            } catch (error) {
                console.error("Error al obtener datos del restaurante:", error);
            }
        }
        obtenerDatos();
    }, [id]);


    // Logout

    const handleLogout = async () => {
        setCargandoLogout(true);
        try {
            await logout();
            navegar("/Login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setCargandoLogout(false);
        }
    };

    // Opciones de menú (vendrá del backend si gustas)

    const opcionesMenu = [
        { clave: "Inicio", label: "Inicio" },
        { clave: "menu", label: "Gestionar Menú" },
        { clave: "galeria", label: "Galería / Fotos" },
        { clave: "perfil", label: "Mi Perfil" },
        { clave: "promos", label: "Promociones" },
        { clave: "pedidos", label: "Pedidos" },
        { clave: "resenas", label: "Reseñas" },
        { clave: "stats", label: "Estadísticas" },
        { clave: "config", label: "Configuración" },
    ];


    // Render dinámico del contenido

    const renderContent = () => {
        switch (selected) {
            case "Inicio": return <Inicio idRestaurante={id} />;
            case "menu": return <GestionMenu idRestaurante={id} />;
            case "galeria": return <GaleriaAdmin idRestaurante={id} />;
            case "perfil": return <Perfil idRestaurante={id} />;
            case "promos": return <Promos idRestaurante={id} />;
            case "pedidos": return <Pedidos idRestaurante={id} />;
            case "resenas": return <Resenas idRestaurante={id} />;
            case "stats": return <Stats idRestaurante={id} />;
            case "config": return <Config idRestaurante={id} />;
            default: return <Inicio idRestaurante={id} />;
        }
    };

    return (
        <div className="menu-admin-container">

            {/* ---------- SIDEBAR ---------- */}
            <aside className="menu-admin-sidebar">

                <div className="sidebar-header">
                    <div className="Menu-logo-wrapper">
                        <img
                            src={restaurante?.logo}
                            alt="Logo del Restaurante"
                            className="Menu-logo"
                        />
                    </div>

                    <div>
                        <h2>{restaurante?.nombre_restaurante || "Cargando..."}</h2>
                        <p>PANEL ADMINISTRATIVO</p>
                    </div>
                </div>

                <ul className="sidebar-menu">
                    {opcionesMenu.map((opcion) => (
                        <li
                            key={opcion.clave}
                            className={selected === opcion.clave ? "active" : ""}
                            onClick={() => setSelected(opcion.clave)}
                        >
                            {opcion.label}
                        </li>
                    ))}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        disabled={cargandoLogout}
                    >
                        {cargandoLogout ? "Cerrando..." : "Cerrar Sesión"}
                    </button>
                </ul>

            </aside>

            <main className="menu-admin-main">
                {renderContent()}
            </main>

        </div>
    );
}

export default MenuAdminRest;
