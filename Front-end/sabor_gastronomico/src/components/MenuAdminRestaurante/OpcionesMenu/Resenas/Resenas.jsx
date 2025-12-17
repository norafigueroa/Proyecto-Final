import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServicesTestimonios } from "../../../../services/servicesAdminRest/ServicesTestimonios";
import Swal from "sweetalert2";
import "./Resenas.css";

function Resenas() {
  const { id } = useParams();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Cargar reseñas al entrar en la página
  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    if (!id) return;
    try {
      const res = await ServicesTestimonios.obtenerTestimonios(id);
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
      console.error(err);
      setError("No se pudieron cargar las reseñas.");
      setLoading(false);
    }
  };

    // ===================== ELIMINAR RESEÑA =====================
  const eliminarResena = async (resenaId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar esta reseña.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await ServicesTestimonios.eliminarTestimonio(resenaId); // Asegúrate que exista esta función en tu servicio
      Swal.fire("Eliminado", "La reseña ha sido eliminada.", "success");
      setResenas(resenas.filter((r) => r.id !== resenaId));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar la reseña.", "error");
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
                <h4>{r.nombre || "Cliente Anónimo"}</h4>
                <span className="calificacion">⭐ {r.calificacion}/5</span>
              </div>
              <p className="comentario">{r.comentario}</p>
              <p className="fecha">{new Date(r.fecha).toLocaleDateString()}</p>
                            <button
                className="btn-eliminar"
                onClick={() => eliminarResena(r.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resenas;
