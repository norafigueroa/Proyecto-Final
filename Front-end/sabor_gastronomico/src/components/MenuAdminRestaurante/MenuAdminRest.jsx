import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getRestauranteById } from "../../services/ServicesRestaurantes";
import Swal from "sweetalert2";
import "./MenuAdminRest.css";

// Importar componentes
import Inicio from "./OpcionesMenu/Inicio/Inicio";
import GestionMenu from "./OpcionesMenu/GestionMenu/GestionMenu";
import GaleriaAdmin from "./OpcionesMenu/GaleriaAdmin/GaleriaAdmin";
import Perfil from "./OpcionesMenu/Perfil/Perfil";
import Pedidos from "./OpcionesMenu/Pedidos/Pedidos";
import Resenas from "./OpcionesMenu/Resenas/Resenas";
import Stats from "./OpcionesMenu/Stats/Stats";
import Config from "./OpcionesMenu/ConfigPag/Config";

function MenuAdminRest() {
    const [selected, setSelected] = useState("Inicio");
    const [cargandoLogout, setCargandoLogout] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);  // ← NUEVO
    const [restaurante, setRestaurante] = useState(null);

    const { id } = useParams();
    const { logout } = useAuth();
    const navegar = useNavigate();

    // Cargar restaurante dinámico
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
  const result = await Swal.fire({
    title: "¿Cerrar sesión?",
    text: "¿Estás seguro de que deseas cerrar sesión?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar",
    cancelButtonText: "Cancelar"
  });

  if (!result.isConfirmed) return;

  setCargandoLogout(true);

  try {
    await logout();

    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      timer: 2500,
      showConfirmButton: false
    });

    navegar("/Login");

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un problema al cerrar sesión"
    });
  } finally {
    setCargandoLogout(false);
  }
};
    // Opciones del menú
    const opcionesMenu = [
        { clave: "Inicio", label: "Dashboard", icon: "🏠", descripcion: "Resumen general." },
        { clave: "menu", label: "Gestionar Menú", icon: "📋", descripcion: "Edita tus platillos." },
        { clave: "galeria", label: "Galería / Fotos", icon: "🖼️", descripcion: "Sube imágenes." },
        { clave: "perfil", label: "Mi Perfil", icon: "👤", descripcion: "Tu información." },
        { clave: "pedidos", label: "Pedidos", icon: "🛒", descripcion: "Gestión de pedidos." },
        { clave: "resenas", label: "Reseñas", icon: "⭐", descripcion: "Opiniones de clientes." },
        { clave: "stats", label: "Estadísticas", icon: "📊", descripcion: "Datos del negocio." },
        { clave: "config", label: "Configuración", icon: "⚙️", descripcion: "Ajustes del sistema." },
    ];

    // Render dinámico
    const renderContent = () => {
        switch (selected) {
            case "Inicio": return <Inicio idRestaurante={id} />;
            case "menu": return <GestionMenu idRestaurante={id} />;
            case "galeria": return <GaleriaAdmin idRestaurante={id} />;
            case "perfil": return <Perfil idRestaurante={id} />;
            case "pedidos": return <Pedidos idRestaurante={id} />;
            case "resenas": return <Resenas idRestaurante={id} />;
            case "stats": return <Stats idRestaurante={id} />;
            case "config": return <Config idRestaurante={id} />;
            default: return <Inicio idRestaurante={id} />;
        }
    };

    return (
        <div className="menu-admin-contenedor">

            {/* ---------- HEADER ---------- */}
            <header className="menu-admin-header">
                <button
                    className="menu-toggle-btn"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    aria-label="Abrir menú"
                >
                    ☰
                </button>

                <h1 className="menu-admin-titulo">
                    {restaurante?.nombre_restaurante || "Mi Restaurante"}
                </h1>

                <div className="menu-admin-usuario">
                    <span>{restaurante?.nombre_restaurante}</span>
                    <button
                        className="menu-btn-logout"
                        onClick={handleLogout}
                        disabled={cargandoLogout}
                        title="Cerrar sesión"
                    >
                        🚪
                    </button>
                </div>
            </header>

            <div className="menu-admin-wrapper">

                {/* ---------- SIDEBAR ---------- */}
                <aside className={`menu-admin-sidebar ${menuAbierto ? "activo" : ""}`}>

                    {/* PERFIL */}
                    <div className="menu-sidebar-perfil">
                        <div className="menu-perfil-avatar">

                            {/* Si hay logo → mostrarlo */}
                            {restaurante?.logo && restaurante.logo.includes("https://") ? (
                                <img
                                    src={
                                        restaurante.logo.includes("https://")
                                            ? "https://" + restaurante.logo.split("https://")[1]
                                            : restaurante.logo
                                    }
                                    alt="Logo"
                                    className="Menu-logo"
                                />
                            ) : (
                                /* Si NO hay logo → mostrar la inicial del restaurante */
                                <div className="menu-avatar-inicial">
                                    {restaurante?.nombre_restaurante?.[0]?.toUpperCase() || "R"}
                                </div>
                            )}

                        </div>

                        <div className="menu-perfil-info">
                            <h3 className="menu-perfil-nombre">
                                {restaurante?.nombre_restaurante || "Cargando..."}
                            </h3>
                            <p className="menu-perfil-rol">PANEL ADMINISTRATIVO</p>
                        </div>
                    </div>

                    {/* MENÚ */}
                    <nav className="menu-sidebar-nav">
                        {opcionesMenu.map((opcion) => (
                            <button
                                key={opcion.clave}
                                className={`menu-nav-item ${selected === opcion.clave ? "activo" : ""}`}
                                onClick={() => {
                                    setSelected(opcion.clave);
                                    setMenuAbierto(false);
                                }}
                            >
                                <span className="menu-item-icono">{opcion.icon}</span>

                                <div className="menu-item-textos">
                                    <span className="menu-item-nombre">{opcion.label}</span>
                                    <p className="menu-item-descripcion">{opcion.descripcion}</p>
                                </div>
                            </button>
                        ))}

                        <button
                            className="menu-btn-cerrar-sesion"
                            onClick={handleLogout}
                            disabled={cargandoLogout}
                        >
                            {cargandoLogout ? "Cerrando..." : "Cerrar Sesión"}
                        </button>
                    </nav>

                </aside>

                {/* ---------- OVERLAY MOVIL ---------- */}
                {menuAbierto && (
                    <div className="menu-overlay" onClick={() => setMenuAbierto(false)}></div>
                )}

                {/* ---------- CONTENIDO ---------- */}
                <main className="menu-admin-contenido">
                    {renderContent()}
                </main>

            </div>
        </div>
    );
}

export default MenuAdminRest;
