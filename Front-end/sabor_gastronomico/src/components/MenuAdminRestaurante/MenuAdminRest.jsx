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
        { clave: "Inicio", label: "Inicio", icon: "🏠",
        descripcion: "Resumen general." },

        { clave: "menu", label: "Gestionar Menú", icon: "📋",
        descripcion: "Edita tus platillos." },

        { clave: "galeria", label: "Galería / Fotos", icon: "🖼️",
        descripcion: "Sube imágenes." },

        { clave: "perfil", label: "Mi Perfil", icon: "👤",
        descripcion: "Tu información." },

        { clave: "promos", label: "Promociones", icon: "💸",
        descripcion: "Ofertas activas." },

        { clave: "pedidos", label: "Pedidos", icon: "🛒",
        descripcion: "Gestión de pedidos." },

        { clave: "resenas", label: "Reseñas", icon: "⭐",
        descripcion: "Opiniones de clientes." },

        { clave: "stats", label: "Estadísticas", icon: "📊",
        descripcion: "Datos del negocio." },

        { clave: "config", label: "Configuración", icon: "⚙️",
        descripcion: "Ajustes del sistema." },
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
        <div className="menu-admin-contenedor">

            {/* ---------- SIDEBAR ---------- */}
            <aside className="menu-admin-sidebar">

                {/* PERFIL / HEADER DEL SIDEBAR */}
                <div className="menu-sidebar-perfil">
                    <div className="menu-perfil-avatar">
                        {restaurante?.logo
                            ? <img src={restaurante.logo} alt="Logo" className="Menu-logo" />
                            : restaurante?.nombre_restaurante?.[0] || "R"}
                    </div>

                    <div className="menu-perfil-info">
                        <h3 className="menu-perfil-nombre">
                            {restaurante?.nombre_restaurante || "Cargando..."}
                        </h3>
                        <p className="menu-perfil-rol">PANEL ADMINISTRATIVO</p>
                    </div>
                </div>

                {/* MENÚ */}
                <ul className="menu-sidebar-nav">
                    {opcionesMenu.map((opcion) => (
                        <li
                            key={opcion.clave}
                            className={`menu-nav-item ${selected === opcion.clave ? "activo" : ""}`}
                            onClick={() => setSelected(opcion.clave)}
                        >
                            <span className="menu-item-icono">{opcion.icon}</span>

                            <div className="menu-item-textos">
                                <span className="menu-item-nombre">{opcion.label}</span>
                                <p className="menu-item-descripcion">{opcion.descripcion}</p>
                            </div>
                        </li>
                    ))}

                    <button
                        className="menu-btn-cerrar-sesion"
                        onClick={handleLogout}
                        disabled={cargandoLogout}
                    >
                        {cargandoLogout ? "Cerrando..." : "Cerrar Sesión"}
                    </button>
                </ul>

            </aside>

            {/* ---------- CONTENIDO PRINCIPAL ---------- */}
            <main className="menu-admin-contenido">
                {renderContent()}
            </main>

        </div>

    );
}

export default MenuAdminRest;
