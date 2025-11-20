import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestauranteById } from "../../services/ServicesRestaurantes";

function InfoRestaurante() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRestaurante() {
      try {
        const data = await getRestauranteById(id);
          setRestaurante(data);
      } catch (err) {
          setError("Error al cargar el restaurante.");
      } finally {
          setLoading(false);
      }
    }

    fetchRestaurante();
  }, [id]);

  if (loading) return <p>Cargando restaurante...</p>;
  if (error) return <p>{error}</p>;
  if (!restaurante) return <p>No se encontró el restaurante.</p>;

  return (
    <div className="info-restaurante">
      <h1>{restaurante.nombre_restaurante}</h1>

      <img
        src={
          restaurante.foto_portada
            ? restaurante.foto_portada
            : "https://via.placeholder.com/800x300?text=Sin+Imagen"
        }
        alt="Foto del restaurante"
        className="imagen-portada"
      />

      <div className="detalles">
        <p><strong>Descripción:</strong> {restaurante.descripcion || "No disponible"}</p>

        <p><strong>Historia:</strong> {restaurante.historia_negocio || "No disponible"}</p>

        <p><strong>Dirección:</strong> {restaurante.direccion}</p>

        <p><strong>Teléfono:</strong> {restaurante.telefono || "No disponible"}</p>

        <p><strong>Email:</strong> {restaurante.email || "No disponible"}</p>

        <p><strong>Sitio web:</strong> 
          {restaurante.sitio_web ? (
            <a href={restaurante.sitio_web} target="_blank" rel="noopener noreferrer">
              {restaurante.sitio_web}
            </a>
          ) : (
            " No disponible"
          )}
        </p>

        <p><strong>Días de operación:</strong> {restaurante.dias_operacion || "No disponible"}</p>

        <p><strong>Horario:</strong> 
          {restaurante.horario_apertura && restaurante.horario_cierre
            ? `${restaurante.horario_apertura} - ${restaurante.horario_cierre}`
            : "No disponible"}
        </p>

        <p><strong>Calificación:</strong> ⭐ {restaurante.calificacion_promedio}</p>

        <p><strong>Total de reseñas:</strong> {restaurante.total_resenas}</p>

        <p><strong>Estado:</strong> {restaurante.estado}</p>

        <p><strong>Verificado:</strong> {restaurante.verificado ? "Sí" : "No"}</p>

        <p><strong>Categoría:</strong> 
          {restaurante.categoria ? restaurante.categoria.nombre_categoria : "Sin categoría"}
        </p>

        <p><strong>Registrado:</strong> {new Date(restaurante.fecha_registro).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default InfoRestaurante;
