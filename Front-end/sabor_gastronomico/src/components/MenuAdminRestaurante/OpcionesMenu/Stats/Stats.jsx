import React, { useEffect, useState } from "react";
import "./Stats.css";
import StatsService from "../../../../services/servicesAdminRest/ServicesStats";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Stats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const res = await StatsService.obtenerEstadisticas();
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
      setLoading(false);
    }
  };

  if (loading) return <p className="est-loading">Cargando estadísticas...</p>;

  if (!stats) return <p className="est-error">Error al cargar datos.</p>;

  return (
    <div className="est-container">
      <h1 className="est-title">Estadísticas del Restaurante</h1>

      {/* Tarjetas */}
      <div className="est-cards">
        <div className="est-card">
          <p>Ventas Totales</p>
          <h2>₡{stats.ventasTotales}</h2>
        </div>

        <div className="est-card">
          <p>Pedidos Hoy</p>
          <h2>{stats.pedidosHoy}</h2>
        </div>

        <div className="est-card">
          <p>Clientes Nuevos</p>
          <h2>{stats.clientesNuevos}</h2>
        </div>
      </div>

      {/* Ventas Mensuales */}
      <div className="est-chart-box">
        <h2 className="est-chart-title">Ventas Mensuales</h2>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.ventasMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ventas" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pedidos por categoría */}
      <div className="est-chart-box">
        <h2 className="est-chart-title">Pedidos por Categoría</h2>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.pedidosCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pedidos" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Stats;
