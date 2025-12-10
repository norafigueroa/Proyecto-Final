import React, { useEffect, useState } from "react";
import { ServicesTestimonios } from "../../../../services/servicesAdminRest/ServicesTestimonios";
import "./Resenas.css";

function Resenas() {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Cargar reseñas al entrar en la página
  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    try {
      const res = await ServicesTestimonios.obtenerTestimonios(1); 
      const data = res.data;

      if (data && typeof data.map === "function") {
        setResenas(data);
      } else if (data?.results && typeof data.results.map === "function") {
        setResenas(data.results);
      } else {
        setResenas([]);
      }

      setLoading(false);
    } catch (err) {
      setError("No se pudieron cargar las reseñas.");
      setLoading(false);
    }
  };


  if (loading) return <p className="cargando">Cargando reseñas...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="resenas-container">
      <h2>Reseñas de Clientes</h2>
      
      {resenas.length === 0 ? (
        <p className="no-resenas">Aún no hay reseñas.</p>
      ) : (
        <div className="resenas-lista">
          {resenas.map((r) => (
            <div key={r.id} className="resena-card">
              <div className="resena-header">
                <h4>{r.usuario_nombre || "Cliente Anónimo"}</h4>
                <span className="calificacion">⭐ {r.calificacion}/5</span>
              </div>
              <p className="comentario">{r.comentario}</p>
              <p className="fecha">{new Date(r.fecha).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resenas;
