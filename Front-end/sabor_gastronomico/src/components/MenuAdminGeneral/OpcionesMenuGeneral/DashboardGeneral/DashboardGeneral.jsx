import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {obtenerRestaurantes,} from "../../../../services/ServicesAdminGeneral/ServicesRestaurantesGeneral";

import {obtenerUsuarios,} from "../../../../services/ServicesAdminGeneral/ServicesUsuarios";

import {obtenerArticulosBlog,} from "../../../../services/ServicesAdminGeneral/ServicesBlog";

import {obtenerSitiosTuristicos,} from "../../../../services/ServicesAdminGeneral/ServicesTurismo";

import './DashboardGeneral.css';


function Dashboard() {
  const [estadisticas, setEstadisticas] = useState({
    totalRestaurantes: 0,
    restaurantesActivos: 0,
    restaurantesPendientes: 0,
    totalUsuarios: 0,
    totalArticulos: 0,
    totalSitiosTuristicos: 0,
  });

  const [cargando, setCargando] = useState(true);
  const [actividadReciente, setActividadReciente] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
  try {
    setCargando(true);

    // Obtener todos los datos
    const [restaurantes, usuarios, articulos, sitios] = await Promise.all([
      obtenerRestaurantes(),
      obtenerUsuarios(),
      obtenerArticulosBlog(),
      obtenerSitiosTuristicos(),
    ]);

    // Convertir a arrays si viene como objeto
    const restaurantesArray = Array.isArray(restaurantes) ? restaurantes : restaurantes.results || [];
    const usuariosArray = Array.isArray(usuarios) ? usuarios : usuarios.results || [];
    const articulosArray = Array.isArray(articulos) ? articulos : articulos.results || [];
    const sitiosArray = Array.isArray(sitios) ? sitios : sitios.results || [];

    // Procesar restaurantes
    const totalRestaurantes = restaurantesArray.length;
    const restaurantesActivos = restaurantesArray.filter(r => r.estado === 'activo').length;
    const restaurantesPendientes = restaurantesArray.filter(r => r.estado === 'pendiente').length;

    // Actualizar estadísticas
    setEstadisticas({
      totalRestaurantes,
      restaurantesActivos,
      restaurantesPendientes,
      totalUsuarios: usuariosArray.length,
      totalArticulos: articulosArray.length,
      totalSitiosTuristicos: sitiosArray.length,
    });

    // Generar actividad reciente
    const actividad = [
      {
        id: 1,
        evento: `${totalRestaurantes} restaurantes registrados`,
        detalles: `${restaurantesActivos} activos, ${restaurantesPendientes} pendientes`,
        fecha: new Date().toLocaleDateString(),
        tipo: 'restaurante',
      },
      {
        id: 2,
        evento: `${usuariosArray.length} usuarios en el sistema`,
        detalles: 'Total de usuarios registrados',
        fecha: new Date().toLocaleDateString(),
        tipo: 'usuario',
      },
      {
        id: 3,
        evento: `${articulosArray.length} artículos publicados`,
        detalles: 'Contenido cultural disponible',
        fecha: new Date().toLocaleDateString(),
        tipo: 'blog',
      },
      {
        id: 4,
        evento: `${sitiosArray.length} sitios turísticos`,
        detalles: 'Lugares de interés registrados',
        fecha: new Date().toLocaleDateString(),
        tipo: 'turismo',
      },
    ];

    setActividadReciente(actividad);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los datos del dashboard',
      icon: 'error',
    });
  } finally {
    setCargando(false);
  }
};

  if (cargando) {
    return (
      <div className="dashboard-contenedor">
        <div className="dashboard-cargando">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-contenedor">
      <div className="dashboard-encabezado">
        <h2>Dashboard</h2>
        <p>Bienvenido al panel de administración general</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="dashboard-tarjetas">
        <div className="tarjeta">
          <div className="tarjeta-icono restaurante">🏪</div>
          <div className="tarjeta-contenido">
            <p className="tarjeta-label">Restaurantes Totales</p>
            <h3 className="tarjeta-numero">{estadisticas.totalRestaurantes}</h3>
            <p className="tarjeta-subtitulo">
              {estadisticas.restaurantesActivos} activos, {estadisticas.restaurantesPendientes} pendientes
            </p>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta-icono usuario">👥</div>
          <div className="tarjeta-contenido">
            <p className="tarjeta-label">Usuarios Registrados</p>
            <h3 className="tarjeta-numero">{estadisticas.totalUsuarios}</h3>
            <p className="tarjeta-subtitulo">Total de usuarios en la plataforma</p>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta-icono articulo">📝</div>
          <div className="tarjeta-contenido">
            <p className="tarjeta-label">Artículos de Blog</p>
            <h3 className="tarjeta-numero">{estadisticas.totalArticulos}</h3>
            <p className="tarjeta-subtitulo">Contenido cultural publicado</p>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta-icono turismo">🗺️</div>
          <div className="tarjeta-contenido">
            <p className="tarjeta-label">Sitios Turísticos</p>
            <h3 className="tarjeta-numero">{estadisticas.totalSitiosTuristicos}</h3>
            <p className="tarjeta-subtitulo">Lugares de interés</p>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="dashboard-actividad">
        <h3>Resumen de la Plataforma</h3>
        <div className="actividad-lista">
          {actividadReciente.map((item) => (
            <div key={item.id} className="actividad-item">
              <div className="actividad-icono">{item.tipo === 'restaurante' ? '🏪' : item.tipo === 'usuario' ? '👤' : item.tipo === 'blog' ? '📝' : '🗺️'}</div>
              <div className="actividad-contenido">
                <p className="actividad-evento">{item.evento}</p>
                <p className="actividad-detalles">{item.detalles}</p>
              </div>
              <span className="actividad-fecha">{item.fecha}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;